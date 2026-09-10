/**
 * IP-API Geolocation Client
 * Reference: https://ip-api.com/docs
 *
 * Calls the official IP-API service to retrieve approximate geolocation and network info.
 * Never throws — failures or timeouts return a safe fallback object.
 */

const IP_API_FIELDS = [
  "status",
  "message",
  "country",
  "countryCode",
  "region",
  "regionName",
  "city",
  "zip",
  "lat",
  "lon",
  "timezone",
  "isp",
  "org",
  "as",
  "asname",
  "query",
].join(",");

const REQUEST_TIMEOUT_MS = 3500;

/**
 * Checks if an IP is a private, loopback, or reserved address.
 * @param {string} ip
 * @returns {boolean}
 */
export function isPrivateOrReservedIp(ip) {
  if (!ip || typeof ip !== "string") return true;
  const trimmed = ip.trim();

  // IPv4 & IPv6 loopbacks / unspecified
  if (
    trimmed === "127.0.0.1" ||
    trimmed === "::1" ||
    trimmed === "0.0.0.0" ||
    trimmed === "::" ||
    trimmed === "localhost" ||
    trimmed === "unknown" ||
    trimmed === "Not available"
  ) {
    return true;
  }

  // IPv4 private ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16)
  if (/^(10\.|192\.168\.|169\.254\.)/.test(trimmed)) return true;
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(trimmed)) return true;

  // IPv6 link-local / unique local (fe80::, fc00::, fd00::)
  if (/^(fe80:|fc00:|fd00:)/i.test(trimmed)) return true;

  return false;
}

/**
 * Parses ASN and AS name from IP-API response fields.
 * Example 'as': 'AS15169 Google LLC', 'asname': 'GOOGLE'
 * @param {string} asField
 * @param {string} asnameField
 * @returns {{ asn: string | null, asName: string | null }}
 */
function parseAsnDetails(asField, asnameField) {
  if (!asField && !asnameField) {
    return { asn: null, asName: null };
  }

  let asn = null;
  let asName = asnameField || null;

  if (asField) {
    const match = asField.match(/^(AS\d+)\s*(.*)$/i);
    if (match) {
      asn = match[1];
      if (!asName && match[2]) {
        asName = match[2].trim();
      }
    } else {
      asn = asField;
    }
  }

  return { asn, asName };
}

/**
 * Resolves geolocation for the given client IP address using IP-API.
 *
 * @param {string} ip
 * @returns {Promise<{
 *   status: string,
 *   country: string | null,
 *   countryCode: string | null,
 *   region: string | null,
 *   regionName: string | null,
 *   city: string | null,
 *   zip: string | null,
 *   latitude: number | null,
 *   longitude: number | null,
 *   timezone: string | null,
 *   isp: string | null,
 *   organization: string | null,
 *   asn: string | null,
 *   asName: string | null,
 *   queryIp: string | null,
 *   rawMessage: string | null
 * }>}
 */
export async function fetchIpGeolocation(ip) {
  const fallback = {
    status: "skipped",
    country: null,
    countryCode: null,
    region: null,
    regionName: null,
    city: null,
    zip: null,
    latitude: null,
    longitude: null,
    timezone: null,
    isp: null,
    organization: null,
    asn: null,
    asName: null,
    queryIp: ip || null,
    rawMessage: null,
  };

  if (!ip || isPrivateOrReservedIp(ip)) {
    fallback.status = ip ? "reserved_range" : "no_ip";
    fallback.rawMessage = ip ? "Private or reserved IP address" : "No IP address detected";
    return fallback;
  }

  try {
    const apiKey = process.env.IP_API_KEY || process.env.IPAPI_KEY;
    const isPro = Boolean(apiKey);

    // IP-API free service uses HTTP. Pro service uses HTTPS.
    const baseUrl = isPro
      ? `https://pro.ip-api.com/json/${encodeURIComponent(ip)}?key=${encodeURIComponent(apiKey)}&fields=${IP_API_FIELDS}`
      : `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=${IP_API_FIELDS}`;

    const response = await fetch(baseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(`[GEOLOCATION] IP-API returned HTTP ${response.status} for IP: ${ip}`);
      fallback.status = "failed";
      fallback.rawMessage = `HTTP ${response.status}`;
      return fallback;
    }

    const data = await response.json();

    if (data.status !== "success") {
      console.warn(`[GEOLOCATION] IP-API returned failure status: "${data.message}" for IP: ${ip}`);
      fallback.status = "failed";
      fallback.rawMessage = data.message || "Geolocation unavailable";
      return fallback;
    }

    const { asn, asName } = parseAsnDetails(data.as, data.asname);

    return {
      status: "success",
      country: data.country || null,
      countryCode: data.countryCode || null,
      region: data.region || null,
      regionName: data.regionName || null,
      city: data.city || null,
      zip: data.zip || null,
      latitude: typeof data.lat === "number" ? data.lat : null,
      longitude: typeof data.lon === "number" ? data.lon : null,
      timezone: data.timezone || null,
      isp: data.isp || null,
      organization: data.org || null,
      asn,
      asName,
      queryIp: data.query || ip,
      rawMessage: null,
    };
  } catch (error) {
    console.warn(`[GEOLOCATION] IP-API lookup caught exception for IP ${ip}:`, error?.message || error);
    fallback.status = error?.name === "TimeoutError" ? "timeout" : "error";
    fallback.rawMessage = error?.message || "Lookup error";
    return fallback;
  }
}
