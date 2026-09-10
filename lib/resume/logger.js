import { createAdminClient } from "../supabase/admin.js";

/**
 * Logs a resume download event to the Supabase database.
 * Never throws — failures are logged server-side to guarantee uninterrupted downloads.
 *
 * @param {object} params
 * @param {object} params.metadata
 * @param {object} params.geo
 * @param {string} [params.emailStatus='pending']
 * @returns {Promise<{ success: boolean, recordId: string | null, error?: string }>}
 */
export async function logResumeDownload({ metadata, geo, emailStatus = "pending" }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("[RESUME LOGGER] Supabase credentials not configured. Skipping database log.");
    return { success: false, recordId: null, error: "Supabase not configured" };
  }

  try {
    const admin = createAdminClient();

    const normalizedIp =
      metadata.ip && metadata.ip !== "Not available" && metadata.ip !== "unknown"
        ? metadata.ip
        : null;

    const payload = {
      resume_name: metadata.filename || "Vedaang_Sharma_Resume.pdf",
      downloaded_at: metadata.timestampIso || new Date().toISOString(),
      ip_address: normalizedIp,
      user_agent: metadata.userAgent && metadata.userAgent !== "Not available" ? metadata.userAgent : null,
      referrer: metadata.referrer && metadata.referrer !== "Direct / Not available" ? metadata.referrer : null,
      request_path: metadata.downloadUrl && metadata.downloadUrl !== "Not available" ? metadata.downloadUrl : null,
      country: geo?.country || null,
      country_code: geo?.countryCode || null,
      region: geo?.region || null,
      region_name: geo?.regionName || null,
      city: geo?.city || null,
      zip: geo?.zip || null,
      latitude: typeof geo?.latitude === "number" ? geo.latitude : null,
      longitude: typeof geo?.longitude === "number" ? geo.longitude : null,
      timezone: geo?.timezone || null,
      isp: geo?.isp || null,
      organization: geo?.organization || null,
      asn: geo?.asn || null,
      as_name: geo?.asName || null,
      geolocation_status: geo?.status || "unknown",
      email_status: emailStatus,
    };

    const { data, error } = await admin
      .from("resume_downloads")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      console.error("[RESUME LOGGER] Failed to insert download record into Supabase:", error.message || error);
      return { success: false, recordId: null, error: error.message };
    }

    return { success: true, recordId: data?.id || null };
  } catch (err) {
    console.error("[RESUME LOGGER] Unexpected exception during download logging:", err?.message || err);
    return { success: false, recordId: null, error: err?.message || err };
  }
}

/**
 * Updates the email_status field of an existing resume download record.
 * Best-effort, non-blocking.
 *
 * @param {string} recordId
 * @param {string} newStatus
 */
export async function updateDownloadEmailStatus(recordId, newStatus) {
  if (!recordId || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return;
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin
      .from("resume_downloads")
      .update({ email_status: newStatus })
      .eq("id", recordId);

    if (error) {
      console.warn("[RESUME LOGGER] Could not update email_status for record", recordId, error.message);
    }
  } catch (err) {
    console.warn("[RESUME LOGGER] Exception updating email_status:", err?.message || err);
  }
}
