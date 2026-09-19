import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faShieldHalved, faFilePdf, faEnvelope } from "@fortawesome/free-solid-svg-icons";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Privacy and data collection policy for Vedaang Sharma's portfolio, detailing resume download logging, approximate geolocation, and security practices.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | Vedaang Sharma",
    description: "Privacy and data handling practices for Vedaang Sharma's portfolio.",
    url: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-28 pb-20 px-6 sm:px-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition mb-6"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-[10px]" /> Back to Home
        </Link>
        <span className="inline-block text-[10px] font-bold uppercase tracking-[.35rem] text-amber-700 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 px-3 py-1.5 rounded-full mb-4">
          Legal &amp; Privacy
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
          Last updated: September 2026. This page describes how data is handled when you visit this website, download the résumé, or get in touch.
        </p>
      </div>

      <div className="space-y-10 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
        {/* Core Principles */}
        <section className="p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/10">
          <div className="flex items-center gap-3 mb-3 text-gray-900 dark:text-white font-semibold text-lg">
            <FontAwesomeIcon icon={faShieldHalved} className="text-amber-600 dark:text-amber-400" />
            Core Principles
          </div>
          <p className="text-sm sm:text-base">
            I believe in privacy-first web architecture and data minimization. I do not run invasive cross-site trackers, sell personal data, or request precise GPS or hardware permissions.
          </p>
        </section>

        {/* Resume Download Tracking */}
        <section>
          <div className="flex items-center gap-3 mb-3 text-gray-900 dark:text-white font-semibold text-xl">
            <FontAwesomeIcon icon={faFilePdf} className="text-amber-600 dark:text-amber-400" />
            Resume Download Telemetry
          </div>
          <p className="mb-4">
            When you choose to download my résumé (via the &ldquo;Download CV&rdquo; or &ldquo;Download Resume&rdquo; actions), our server-side endpoint logs the download event. Specifically, the server records:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4 text-sm sm:text-base">
            <li>
              <strong>IP Address:</strong> Detected server-side to prevent automated bot flooding and abuse.
            </li>
            <li>
              <strong>Approximate Geolocation:</strong> Derived using the public IP lookup service (IP-API). This includes approximate country, region/state, city, timezone, and Internet Service Provider (ISP) / Autonomous System (AS). <em>No GPS, fine-grained coordinates, or physical device locations are ever captured.</em>
            </li>
            <li>
              <strong>Server Timestamp:</strong> The exact date and time the download was initiated.
            </li>
            <li>
              <strong>Request Metadata:</strong> The standard HTTP User-Agent string and HTTP Referrer header supplied by your browser.
            </li>
          </ul>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            <strong>Purpose:</strong> This information is used strictly to understand recruiter and collaborator interest, protect the server against denial-of-service, and notify me via email when my credentials are reviewed.
          </p>
        </section>

        {/* Contact Form */}
        <section>
          <div className="flex items-center gap-3 mb-3 text-gray-900 dark:text-white font-semibold text-xl">
            <FontAwesomeIcon icon={faEnvelope} className="text-amber-600 dark:text-amber-400" />
            Contact Inquiries
          </div>
          <p className="text-sm sm:text-base">
            When you submit a message through the contact form, the information you provide (name, email address, message body) is transmitted securely via transactional email (SMTP/Resend) so that I can respond to your inquiry.
          </p>
        </section>

        {/* Data Security & Retention */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Data Storage &amp; Protection
          </h2>
          <p className="text-sm sm:text-base mb-3">
            Telemetric records are stored in a private database on Supabase with PostgreSQL Row Level Security (RLS) enabled. Public access is strictly denied; records are accessible only server-side by authenticated administrator credentials.
          </p>
          <p className="text-sm sm:text-base">
            If you have questions about this policy or wish to request deletion of any inquiry or telemetric record, feel free to reach out via the{" "}
            <Link href="/contact" className="text-amber-600 dark:text-amber-400 underline underline-offset-4 hover:opacity-80">
              contact page
            </Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
