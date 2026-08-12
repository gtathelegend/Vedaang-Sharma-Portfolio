import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getPostHogClient } from "@/lib/posthog-server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value = "") {
	return String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

export async function POST(request) {
	console.log("[CONTACT] request received");

	try {
		// Rate limit by IP (5 requests / 10 min).
		const ip = getClientIp(request);
		let limitResult = { success: true, reset: Date.now() + 600000 };
		try {
			limitResult = await rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
		} catch (rlErr) {
			console.warn("[CONTACT] rateLimit execution failed, proceeding gracefully:", rlErr?.message || rlErr);
		}

		if (!limitResult.success) {
			const retryAfter = Math.max(1, Math.ceil((limitResult.reset - Date.now()) / 1000));
			console.log(`[CONTACT] rate limit exceeded for ip ${ip}`);
			return NextResponse.json(
				{ message: "Too many messages. Please try again later." },
				{ status: 429, headers: { "Retry-After": String(retryAfter) } },
			);
		}

		let body;
		try {
			body = await request.json();
		} catch {
			console.warn("[CONTACT] invalid JSON body received");
			return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
		}

		// Honeypot: a hidden field real users never fill. If populated, silently accept
		if ((body?.website || "").toString().trim() !== "") {
			console.log("[CONTACT] honeypot field triggered; ignoring request");
			return NextResponse.json({ ok: true });
		}

		const name = (body?.name || "").toString().trim().slice(0, 120);
		const email = (body?.email || "").toString().trim().slice(0, 200);
		const subject = (body?.subject || "").toString().trim().slice(0, 200);
		const message = (body?.message || "").toString().trim().slice(0, 4000);

		if (!name || !email || !message) {
			console.warn("[CONTACT] validation failed: missing required fields");
			return NextResponse.json({ message: "Name, email and message are required." }, { status: 400 });
		}
		if (!EMAIL_RE.test(email)) {
			console.warn("[CONTACT] validation failed: invalid email format");
			return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
		}

		console.log("[CONTACT] validation successful");

		const safeSubject = subject || `New message from ${name}`;
		let dbInserted = false;
		let emailSent = false;

		// 1. Database persistence (Supabase) if configured
		const hasSupabase = Boolean(
			process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
		);

		if (hasSupabase) {
			console.log("[CONTACT] database insert started");
			try {
				const admin = createAdminClient();
				const { error: dbErr } = await admin.from("contact_messages").insert({
					name,
					email,
					subject: safeSubject,
					message,
					ip_address: ip,
					created_at: new Date().toISOString(),
				});

				if (dbErr) {
					console.error("[CONTACT] database insert error:", dbErr.message || dbErr.code || dbErr);
				} else {
					console.log("[CONTACT] database insert successful");
					dbInserted = true;
				}
			} catch (dbEx) {
				console.error("[CONTACT] database insert exception:", dbEx?.message || dbEx);
			}
		} else {
			console.log("[CONTACT] database skipped (Supabase env vars not set)");
		}

		// 2. Email sending (Nodemailer) if configured
		const host = process.env.SMTP_HOST;
		const port = Number(process.env.SMTP_PORT || 587);
		const user = process.env.SMTP_USER;
		const pass = process.env.SMTP_PASS;
		const from = process.env.SMTP_FROM || (user ? `Portfolio <${user}>` : null);
		const to = process.env.SMTP_TO || process.env.CONTACT_TO || user;

		const hasSmtp = Boolean(host && user && pass && to);

		if (hasSmtp) {
			console.log("[CONTACT] email sending started");
			try {
				const secure = process.env.SMTP_SECURE
					? process.env.SMTP_SECURE === "true"
					: port === 465;

				const transporter = nodemailer.createTransport({
					host,
					port,
					secure,
					auth: { user, pass },
					connectionTimeout: 8000,
					greetingTimeout: 5000,
					socketTimeout: 10000,
				});

				const text = `From: ${name} <${email}>\nSubject: ${safeSubject}\n\n${message}`;
				const html = `
					<div style="font-family:system-ui,Segoe UI,Helvetica,Arial,sans-serif;color:#111;line-height:1.55;max-width:560px;">
						<h2 style="margin:0 0 12px;font-size:18px;">New portfolio contact</h2>
						<p style="margin:0 0 4px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
						<p style="margin:0 0 4px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
						<p style="margin:0 0 12px;"><strong>Subject:</strong> ${escapeHtml(safeSubject)}</p>
						<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px;white-space:pre-wrap;">${escapeHtml(message)}</div>
					</div>
				`;

				await transporter.sendMail({
					from,
					to,
					replyTo: `${name} <${email}>`,
					subject: `[Portfolio] ${safeSubject}`,
					text,
					html,
				});

				console.log("[CONTACT] email sending successful");
				emailSent = true;
			} catch (mailErr) {
				console.error("[CONTACT] email sending failed:", mailErr?.message || mailErr);
			}
		} else {
			console.warn("[CONTACT] email sending skipped (SMTP env not configured)");
		}

		// PostHog analytics (fire & forget)
		try {
			const posthog = getPostHogClient();
			if (posthog) {
				posthog.capture({
					distinctId: `contact:${ip}`,
					event: "contact_email_sent",
					properties: { has_subject: !!subject, email_sent: emailSent, db_inserted: dbInserted },
				});
			}
		} catch (phErr) {
			console.warn("[CONTACT] posthog capture skipped:", phErr?.message || phErr);
		}

		// Success check: if either email or database insert succeeded, treat request as successful
		if (emailSent || dbInserted) {
			return NextResponse.json({ ok: true });
		}

		// If neither service is configured
		if (!hasSmtp && !hasSupabase) {
			console.error("[CONTACT] error: neither SMTP nor Supabase service is configured");
			return NextResponse.json(
				{ message: "Mail service is not configured. Please try again later." },
				{ status: 503 }
			);
		}

		// If services are configured but failed to deliver
		console.error("[CONTACT] error: message delivery failed across configured services");
		return NextResponse.json(
			{ message: "Could not send your message right now. Please try again later." },
			{ status: 502 }
		);
	} catch (outerErr) {
		console.error("[CONTACT] error: unhandled server error:", outerErr?.message || outerErr);
		return NextResponse.json(
			{ message: "An internal error occurred. Please try again later." },
			{ status: 500 }
		);
	}
}
