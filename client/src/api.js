const configuredApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const apiUrl = (() => {
  if (/^https?:\/\//i.test(configuredApiUrl)) {
    return configuredApiUrl;
  }

  const hostname = configuredApiUrl.includes(".")
    ? configuredApiUrl
    : `${configuredApiUrl}.onrender.com`;
  return `https://${hostname}`;
})();

export const API_BASE_URL = apiUrl.replace(/\/+$/, "");
