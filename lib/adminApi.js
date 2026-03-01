import { apiUrl } from "@/lib/api";
import { clearAdminToken, getAdminToken } from "@/lib/adminAuth";

const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const adminFetch = async (path, options = {}) => {
  const token = getAdminToken();

  const response = await fetch(apiUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    clearAdminToken();
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
    throw new Error("Session expired");
  }

  const body = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(body?.message || `Request failed: ${response.status}`);
  }

  return body;
};
