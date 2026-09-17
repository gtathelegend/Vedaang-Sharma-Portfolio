"use client";
import { usePathname } from "next/navigation";

export default function AuroraBackground() {
	const pathname = usePathname();
	if (pathname?.startsWith("/admin")) return null;

	return (
		<>
			{/* Soft gradient base - light mode only */}
			<div
				className="pointer-events-none absolute inset-0 -z-20 dark:hidden"
				style={{
					background:
						"linear-gradient(135deg, #E0F2FE 0%, #F5F3FF 50%, #ECFEFF 100%)",
				}}
			/>
			{/* Dark mode base */}
			<div className="pointer-events-none absolute inset-0 -z-20 hidden dark:block bg-gray-950" />

			{/* Floating aurora blobs - pure CSS GPU compositor accelerated */}
			<div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute -top-40 -left-32 h-[44rem] w-[44rem] rounded-full bg-sky-200/60 dark:bg-sky-500/[0.05] blur-3xl animate-aurora-blob-1" />
				<div className="absolute top-[28%] -right-40 h-[38rem] w-[38rem] rounded-full bg-violet-200/55 dark:bg-violet-500/[0.05] blur-3xl animate-aurora-blob-2" />
				<div className="absolute top-[55%] left-[20%] h-[34rem] w-[34rem] rounded-full bg-cyan-200/50 dark:bg-cyan-500/[0.04] blur-3xl animate-aurora-blob-3" />
				<div className="absolute bottom-[-10%] right-[15%] h-[30rem] w-[30rem] rounded-full bg-indigo-200/45 dark:bg-indigo-500/[0.04] blur-3xl animate-aurora-blob-4" />
			</div>
		</>
	);
}
