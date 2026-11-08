const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export async function fetchRecipes({ sortBy, order } = {}) {
  const params = new URLSearchParams();
  if (sortBy) params.set("sortBy", sortBy);
  if (order) params.set("order", order);

  const query = params.toString();
  const response = await fetch(`${API_URL}/recipes${query ? `?${query}` : ""}`);

  if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
  return response.json();
}
