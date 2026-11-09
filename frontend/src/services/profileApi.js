import { getErrorMessage } from "./errorMessages.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export function hasToken() {
  return Boolean(localStorage.getItem("token"));
}

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Войдите в аккаунт");

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new Error("Не удалось связаться с сервером");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(getErrorMessage(body.error));
  }

  return response.json();
}

export function getProfile() {
  return request("/profile");
}

export function updateProfile(data) {
  return request("/profile", { method: "PUT", body: JSON.stringify(data) });
}