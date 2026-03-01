const TOKEN_KEY = "portfolioAdminToken";

export const setAdminToken = (token) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const getAdminToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const clearAdminToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
};

const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch (error) {
    return null;
  }
};

export const isAdminAuthenticated = () => {
  const token = getAdminToken();
  if (!token) return false;

  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;

  return payload.exp * 1000 > Date.now();
};
