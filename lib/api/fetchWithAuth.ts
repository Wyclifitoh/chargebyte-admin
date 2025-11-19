import { API_BASE_URL } from './config';
import { Language } from "@/contexts/LanguageContext";

export async function fetchWithAuth(url: string, language: Language, options: any = {}) {
  const token = localStorage.getItem("access_token");

  if (!token) throw new Error("No access token found. Please log in.");

  const finalOptions = {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Accept-Language": language,
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await fetch(`${API_BASE_URL}${url}`, finalOptions);

    if (res.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
      throw new Error("Session expired. Please sign in again.");
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Request failed: ${res.status}`);
    }

    return res.json();
  } catch (err: any) {
    throw new Error(err.message || "Network error, please try again.");
  }
}
