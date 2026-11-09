import { getToken } from "./authApi.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

// Гость (нет токена): возвращаем null, работаем только с localStorage
export async function fetchPlan() {
  if (!getToken()) return null;
  const response = await fetch(`${API_URL}/plans`, { headers: authHeaders() });
  if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
  return response.json();
}

export async function pushPlan(week1Plan) {
  if (!getToken()) return null;
  const response = await fetch(`${API_URL}/plans`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ weeks: { 1: week1Plan } }),
  });
  if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
  return response.json();
}
