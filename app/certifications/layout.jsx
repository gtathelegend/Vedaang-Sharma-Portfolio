import Footer from "@/components/Footer";
import { createAdminClient } from "@/lib/supabase/admin";
import { getItemListSchema, getEducationalOccupationalCredentialSchema, getBreadcrumbListSchema } from "@/lib/seo/schema";

export const metadata = {
  title: "Certifications",
  description: "Verified credentials and certifications in AI, Cloud, DevOps, and engineering earned by Vedaang Sharma.",
  alternates: { canonical: "/certifications" },
  openGraph: {
    title: "Certifications | Vedaang Sharma",
    description: "Verified credentials and certifications in AI, Cloud, DevOps, and engineering earned by Vedaang Sharma.",
    url: "/certifications",
  },
};

export default async function Layout({ children }) {
  let certList = [];
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("certifications")
      .select("id, name, issuer, year, category, url")
      .order("sort_order", { ascending: true })
      .order("year", { ascending: false });

    certList = data || [];
  } catch (err) {
    console.warn("[certifications/layout] Failed to fetch certs for schema:", err);
  }

  const itemListSchema = getItemListSchema({
    name: "Certifications & Credentials of Vedaang Sharma",
    description: metadata.description,
    path: "/certifications",
    items: certList.map((c) => ({
      name: c.name,
      description: `${c.issuer || "Issued credential"} (${c.year || ""})`,
      url: c.url || `/certifications#${c.id}`,
    })),
  });

  const credentialSchemas = certList.map((c) => getEducationalOccupationalCredentialSchema(c));

  const breadcrumbSchema = getBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Certifications", url: "/certifications" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {credentialSchemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
      <Footer />
    </>
  );
}
