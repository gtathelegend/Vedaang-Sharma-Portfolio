// When NEXT_PUBLIC_API_BASE_URL is not set, use the same Next.js origin (relative paths).
// This allows the Next.js API routes under /app/api to serve all data.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const apiUrl = (path) => {
  const normalised = path.startsWith("/") ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalised}` : normalised;
};

export const fetchJson = async (path, options = {}) => {
  const response = await fetch(apiUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const message = `Request failed: ${response.status}`;
    throw new Error(message);
  }

  return response.json();
};
