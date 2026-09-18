import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getPostHogClient } from "@/lib/posthog-server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTurnstileToken } from "@/lib/turnstile";

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

async function tryDatabaseInsert(payload) {
	try {
		if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
			return { success: false, skipped: true, reason: "Supabase credentials not configured" };
		}
		const supabase = createAdminClient();
		console.log("[CONTACT] database insert started");
		let { error } = await supabase.from("contact_submissions").insert([payload]);
		if (error && error.code === "42P01") {
			// Table contact_submissions doesn't exist, try contact_messages
			const retry = await supabase.from("contact_messages").insert([payload]);
			error = retry.error;
		}
		if (error) {
			console.warn("[CONTACT] database insert error:", error.message || error);
			return { success: false, error: error.message };
		}
		console.log("[CONTACT] database insert successful");
		return { success: true };
	} catch (err) {
		console.warn("[CONTACT] database insert exception:", err?.message || err);
		return { success: false, error: err?.message || err };
	}
}

async function trySendEmail({ name, email, subject, message, safeSubject, ip }) {
	const host = process.env.SMTP_HOST;
	const port = Number(process.env.SMTP_PORT || 587);
	const user = process.env.SMTP_USER;
	const pass = process.env.SMTP_PASS;
	const from = process.env.SMTP_FROM || (user ? `Portfolio <${user}>` : null);
	const to = process.env.SMTP_TO || process.env.CONTACT_TO || user;

	if (!host || !user || !pass || !to) {
		console.warn("[CONTACT] SMTP env not configured");
		return { success: false, skipped: true, reason: "SMTP environment variables not configured" };
	}

	const secure = process.env.SMTP_SECURE
		? process.env.SMTP_SECURE === "true"
		: port === 465;

	try {
		console.log("[CONTACT] email sending started");
		const transporter = nodemailer.createTransport({
			host,
			port,
			secure,
			auth: { user, pass },
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

		const posthog = getPostHogClient();
		if (posthog) {
			try {
				posthog.capture({
					distinctId: `contact:${ip}`,
					event: "contact_email_sent",
					properties: { has_subject: !!subject },
				});
			} catch (phErr) {
				console.warn("[CONTACT] PostHog capture warning:", phErr?.message || phErr);
			}
		}

		return { success: true };
	} catch (err) {
		console.error("[CONTACT] email sending error:", err?.message || err);
		return { success: false, error: err?.message || err };
	}
}

export async function POST(request) {
	try {
		const ip = getClientIp(request);
		console.log("[CONTACT] request received", { ip });

		// 1. IP-based rate limiting (5 requests / 10 minutes)
		const { success: rateLimitSuccess, reset } = await rateLimit(`contact:${ip}`, {
			limit: 5,
			windowMs: 10 * 60 * 1000,
		});
		if (!rateLimitSuccess) {
			const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
			console.warn("[CONTACT] rate limit exceeded", { ip, retryAfter });
			return NextResponse.json(
				{ message: "Too many messages. Please try again later." },
				{ status: 429, headers: { "Retry-After": String(retryAfter) } },
			);
		}

		let body;
		try {
			body = await request.json();
		} catch {
			return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
		}

		// 2. Honeypot check (bots that fill hidden inputs)
		if ((body?.website || "").toString().trim() !== "") {
			console.log("[CONTACT] honeypot triggered");
			return NextResponse.json({ ok: true });
		}

		// 3. Server-side Cloudflare Turnstile verification
		const turnstileToken = body?.turnstileToken || body?.["cf-turnstile-response"];
		if (!turnstileToken) {
			return NextResponse.json(
				{ message: "Verification token is required. Please complete the verification check." },
				{ status: 400 },
			);
		}

		const turnstileResult = await verifyTurnstileToken({ token: turnstileToken, ip });
		if (!turnstileResult.success) {
			console.warn("[CONTACT] Turnstile verification failed:", { ip, errorCodes: turnstileResult.errorCodes });
			return NextResponse.json(
				{
					message: "Bot verification failed or expired. Please verify and try again.",
					errorCodes: turnstileResult.errorCodes,
				},
				{ status: 403 },
			);
		}

		// 4. Payload sanitization and validation
		const name = (body?.name || "").toString().trim().slice(0, 120);
		const email = (body?.email || "").toString().trim().slice(0, 200);
		const subject = (body?.subject || "").toString().trim().slice(0, 200);
		const message = (body?.message || "").toString().trim().slice(0, 4000);

		if (!name || !email || !message) {
			return NextResponse.json({ message: "Name, email and message are required." }, { status: 400 });
		}
		if (!EMAIL_RE.test(email)) {
			return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
		}

		console.log("[CONTACT] validation successful");

		const safeSubject = subject || `New message from ${name}`;

		const [dbResult, emailResult] = await Promise.all([
			tryDatabaseInsert({
				name,
				email,
				subject: safeSubject,
				message,
				ip_address: ip,
			}),
			trySendEmail({ name, email, subject, message, safeSubject, ip }),
		]);

		if (emailResult.success || dbResult.success) {
			console.log(`[CONTACT] submission processed successfully (email: ${emailResult.success}, db: ${dbResult.success})`);
			return NextResponse.json({ ok: true });
		}

		if (emailResult.skipped && dbResult.skipped) {
			console.error("[CONTACT] error: neither mail nor database service is configured");
			return NextResponse.json(
				{ message: "Mail service is not configured. Please try again later." },
				{ status: 503 },
			);
		}

		console.error("[CONTACT] error: submission failed (email and db both failed)");
		return NextResponse.json(
			{ message: "Could not process your message right now. Please try again later." },
			{ status: 502 },
		);
	} catch (err) {
		console.error("[CONTACT] unhandled error:", err?.message || err);
		return NextResponse.json(
			{ message: "An unexpected error occurred. Please try again later." },
			{ status: 500 },
		);
	}
}
