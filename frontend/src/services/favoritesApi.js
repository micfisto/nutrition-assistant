import { request } from "./profileApi.js";

export function getFavorites() {
  return request("/favorites");
}

export function addFavorite(recipeId) {
  return request(`/favorites/${encodeURIComponent(recipeId)}`, {
    method: "POST",
  });
}

export function removeFavorite(recipeId) {
  return request(`/favorites/${encodeURIComponent(recipeId)}`, {
    method: "DELETE",
  });
}