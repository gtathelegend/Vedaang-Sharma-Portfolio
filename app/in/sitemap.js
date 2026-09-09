import baseSitemap from "@/app/sitemap";

const IN_DOMAIN = "https://vedaangsharma.in";

export default async function sitemap() {
  const entries = await baseSitemap();
  return entries.map((entry) => {
    const pathname = new URL(entry.url).pathname;
    return {
      ...entry,
      url: `${IN_DOMAIN}${pathname}`,
    };
  });
}
