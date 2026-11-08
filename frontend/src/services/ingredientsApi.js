const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export async function fetchIngredients() {
  let response;
  try {
    response = await fetch(`${API_URL}/ingredients`);
  } catch {
    throw new Error("Не удалось связаться с сервером");
  }

  if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
  return response.json();
}