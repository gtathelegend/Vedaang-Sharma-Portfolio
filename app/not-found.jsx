"use client"
import React from "react";
import Link from "next/link";

const NotFound = () => (
	<div className="relative min-h-screen w-full flex justify-center items-center bg-white">
		<div className="flex flex-col items-center space-y-8 px-8">
			<div className="text-center">
				<p className="text-[11px] font-bold uppercase tracking-[.35rem] text-gray-400 mb-3">
					Page not found
				</p>
				<h1 className="text-7xl md:text-9xl font-bold text-gray-900">
					404
				</h1>
				<p className="text-gray-600 mt-4 max-w-md">
					The page you&apos;re looking for doesn&apos;t exist or has been moved.
				</p>
			</div>
			<div className="flex gap-3">
				<Link href="/"
					className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition shadow-sm">
					Go Home
				</Link>
				<button
					onClick={() => window.history.back()}
					className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition">
					Go Back
				</button>
			</div>
		</div>
	</div>
);

export default NotFound;
