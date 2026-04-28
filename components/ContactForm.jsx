"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faCircleNotch, faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function ContactForm() {
	const [form, setForm] = useState(initialForm);
	const [status, setStatus] = useState("idle");
	const [errorMsg, setErrorMsg] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (status === "loading") return;

		const trimmed = {
			name: form.name.trim(),
			email: form.email.trim(),
			subject: form.subject.trim(),
			message: form.message.trim(),
		};

		if (!trimmed.name || !trimmed.email || !trimmed.message) {
			setStatus("error");
			setErrorMsg("Please fill in your name, email and message.");
			return;
		}

		setStatus("loading");
		setErrorMsg("");

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(trimmed),
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(data.message || "Failed to send message");
			setStatus("success");
			setForm(initialForm);
		} catch (err) {
			setStatus("error");
			setErrorMsg(err.message || "Something went wrong. Please try again.");
		}
	};

	const isLoading = status === "loading";

	const inputClass =
		"w-full rounded-xl border border-white/12 bg-white/8 px-3.5 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400/40 transition backdrop-blur-sm";

	return (
		<form onSubmit={handleSubmit} className="w-full">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
				<label className="flex flex-col gap-1.5">
					<span className="text-xs font-semibold text-white">Name</span>
					<input
						type="text"
						name="name"
						value={form.name}
						onChange={handleChange}
						required
						autoComplete="name"
						maxLength={120}
						placeholder="Your name"
						className={inputClass}
					/>
				</label>
				<label className="flex flex-col gap-1.5">
					<span className="text-xs font-semibold text-white">Email</span>
					<input
						type="email"
						name="email"
						value={form.email}
						onChange={handleChange}
						required
						autoComplete="email"
						maxLength={200}
						placeholder="you@example.com"
						className={inputClass}
					/>
				</label>
			</div>

			<label className="flex flex-col gap-1.5 mb-4">
				<span className="text-xs font-semibold text-white">Subject</span>
				<input
					type="text"
					name="subject"
					value={form.subject}
					onChange={handleChange}
					maxLength={200}
					placeholder="What's this about?"
					className={inputClass}
				/>
			</label>

			<label className="flex flex-col gap-1.5 mb-7">
				<span className="text-xs font-semibold text-white">Message</span>
				<textarea
					name="message"
					value={form.message}
					onChange={handleChange}
					required
					rows={5}
					maxLength={4000}
					placeholder="Tell me about your project, idea, or question…"
					className={`${inputClass} resize-y min-h-[120px]`}
				/>
			</label>

			<div className="flex flex-col sm:flex-row sm:items-center gap-3">
				<button
					type="submit"
					disabled={isLoading}
					className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-400 hover:via-indigo-400 hover:to-blue-400 text-white text-sm font-semibold transition shadow-lg shadow-violet-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
				>
					<FontAwesomeIcon
						icon={isLoading ? faCircleNotch : faPaperPlane}
						className={isLoading ? "animate-spin" : ""}
					/>
					{isLoading ? "Sending…" : "Send message"}
				</button>

				{status === "success" && (
					<span className="inline-flex items-center gap-1.5 text-sm text-emerald-400">
						<FontAwesomeIcon icon={faCircleCheck} /> Message sent — I&apos;ll be in touch soon.
					</span>
				)}
				{status === "error" && (
					<span className="inline-flex items-center gap-1.5 text-sm text-red-400">
						<FontAwesomeIcon icon={faCircleXmark} /> {errorMsg}
					</span>
				)}
			</div>
		</form>
	);
}
