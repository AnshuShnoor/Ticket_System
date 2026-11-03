const configuredApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const apiUrl = /^https?:\/\//i.test(configuredApiUrl)
  ? configuredApiUrl
  : `https://${configuredApiUrl}`;

export const API_BASE_URL = apiUrl.replace(/\/+$/, "");
