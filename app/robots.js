const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vedaangsharma.in";

export default function robots() {
  const aiBots = [
    "GPTBot",
    "ChatGPT-User",
    "Google-Extended",
    "PerplexityBot",
    "ClaudeBot",
    "Applebot-Extended",
    "cohere-ai",
    "Amazonbot",
    "Bytespider",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/admin", "/api/", "/ask"],
      },
      ...aiBots.map((bot) => ({
        userAgent: bot,
        allow: ["/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/admin", "/api/", "/ask"],
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
