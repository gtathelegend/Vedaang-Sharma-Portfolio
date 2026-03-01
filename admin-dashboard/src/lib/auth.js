export const getSessionUser = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/auth/me`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    return payload?.data?.user || null;
  } catch (error) {
    return null;
  }
};

export const clearSession = async () => {
  try {
    await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    return null;
  }
};
