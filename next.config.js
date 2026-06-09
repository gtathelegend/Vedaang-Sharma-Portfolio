const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer({
	// your Next.js configuration
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*.supabase.co",
				pathname: "/storage/v1/object/public/**",
			},
		],
		// Add image optimization settings
		formats: ["image/avif", "image/webp"],
		minimumCacheTTL: 60,
	},
	webpack: (config, options) => {
		config.module.rules.push({
			test: /\.pdf$/i,
			type: "asset/source",
		});

		return config;
	},
	async rewrites() {
		return [
			{
				source: "/ingest/static/:path*",
				destination: "https://us-assets.i.posthog.com/static/:path*",
			},
			{
				source: "/ingest/array/:path*",
				destination: "https://us-assets.i.posthog.com/array/:path*",
			},
			{
				source: "/ingest/:path*",
				destination: "https://us.i.posthog.com/:path*",
			},
		];
	},
	skipTrailingSlashRedirect: true,
	async headers() {
		// Report-only CSP: surfaces violations (browser console) without breaking
		// the app. Tune it against real reports before switching to enforcing
		// (rename the header to "Content-Security-Policy"). Kept permissive for
		// Next.js inline runtime, PostHog (proxied via /ingest), Supabase and Vercel.
		const csp = [
			"default-src 'self'",
			"base-uri 'self'",
			"object-src 'none'",
			"frame-ancestors 'none'",
			"form-action 'self'",
			"script-src 'self' 'unsafe-inline' 'unsafe-eval'",
			"style-src 'self' 'unsafe-inline'",
			"img-src 'self' data: blob: https://*.supabase.co",
			"font-src 'self' data:",
			"connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.posthog.com https://*.i.posthog.com https://vitals.vercel-insights.com",
			"upgrade-insecure-requests",
		].join("; ");

		return [
			{
				source: "/sitemap.xml.gz",
				headers: [
					{
						key: "Content-Type",
						value: "application/gzip",
					},
					{
						key: "Cache-Control",
						value: "public, max-age=3600", // Cache for 1 hour
					},
				],
			},
			{
				source: "/:path*",
				headers: [
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "X-XSS-Protection",
						value: "1; mode=block",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains; preload",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
					},
					{
						key: "Content-Security-Policy-Report-Only",
						value: csp,
					},
				],
			},
		];
	},
	// Add performance optimizations
	reactStrictMode: true,
	compiler: {
		removeConsole:
			process.env.NODE_ENV === "production"
				? {
						exclude: ["error", "warn"],
				  }
				: false,
	},
});
