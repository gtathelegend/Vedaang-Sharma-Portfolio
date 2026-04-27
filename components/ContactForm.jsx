"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

	return (
		<motion.form
			onSubmit={handleSubmit}
			className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm p-5 sm:p-6 shadow-sm"
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ type: "spring", delay: 0.15 }}
			viewport={{ once: true, amount: 0.2 }}
		>
			<p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Send a message</p>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
				<label className="flex flex-col gap-1.5">
					<span className="text-xs font-semibold text-gray-600">Name</span>
					<input
						type="text"
						name="name"
						value={form.name}
						onChange={handleChange}
						required
						autoComplete="name"
						maxLength={120}
						placeholder="Your name"
						className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
					/>
				</label>

				<label className="flex flex-col gap-1.5">
					<span className="text-xs font-semibold text-gray-600">Email</span>
					<input
						type="email"
						name="email"
						value={form.email}
						onChange={handleChange}
						required
						autoComplete="email"
						maxLength={200}
						placeholder="you@example.com"
						className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
					/>
				</label>
			</div>

			<label className="flex flex-col gap-1.5 mb-3">
				<span className="text-xs font-semibold text-gray-600">Subject</span>
				<input
					type="text"
					name="subject"
					value={form.subject}
					onChange={handleChange}
					maxLength={200}
					placeholder="What's this about?"
					className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
				/>
			</label>

			<label className="flex flex-col gap-1.5 mb-4">
				<span className="text-xs font-semibold text-gray-600">Message</span>
				<textarea
					name="message"
					value={form.message}
					onChange={handleChange}
					required
					rows={4}
					maxLength={4000}
					placeholder="Tell me a bit about your idea, project or question..."
					className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition resize-y min-h-[110px]"
				/>
			</label>

			<div className="flex flex-col sm:flex-row sm:items-center gap-3">
				<button
					type="submit"
					disabled={isLoading}
					className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
				>
					<FontAwesomeIcon icon={isLoading ? faCircleNotch : faPaperPlane} className={isLoading ? "animate-spin" : ""} />
					{isLoading ? "Sending..." : "Send message"}
				</button>

				{status === "success" && (
					<span className="inline-flex items-center gap-2 text-sm text-emerald-600">
						<FontAwesomeIcon icon={faCircleCheck} /> Thanks — your message is on its way.
					</span>
				)}
				{status === "error" && (
					<span className="inline-flex items-center gap-2 text-sm text-red-600">
						<FontAwesomeIcon icon={faCircleXmark} /> {errorMsg}
					</span>
				)}
			</div>
		</motion.form>
	);
}
