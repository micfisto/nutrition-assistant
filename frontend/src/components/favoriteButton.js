import "../styles/Favorites.css";
import { addFavorite, removeFavorite } from "../services/favoritesApi.js";
import { getProfile, hasToken } from "../services/profileApi.js";

const HEART = `
  <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"></path>
  </svg>
`;

let favoriteIds = new Set();
let loadPromise = null;

function paint(button) {
  const active = favoriteIds.has(button.dataset.recipeId);
  button.classList.toggle("is-active", active);
  button.setAttribute("aria-pressed", String(active));
  const label = active ? "Убрать из избранного" : "Добавить в избранное";
  button.setAttribute("aria-label", label);
  button.title = label;
}

function paintAll() {
  document.querySelectorAll(".fav-btn").forEach(paint);
}

export function syncFavorites(ids) {
  favoriteIds = new Set(ids);
  paintAll();
}

function loadFavoriteIds() {
  if (!hasToken()) return Promise.resolve();
  if (!loadPromise) {
    loadPromise = getProfile()
      .then((profile) => {
        favoriteIds = new Set(profile.favoriteRecipeIds ?? []);
      })
      .catch(() => {
      });
  }
  return loadPromise;
}

export function createFavoriteButton(recipeId) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "fav-btn";
  button.dataset.recipeId = recipeId;
  button.innerHTML = HEART;

  paint(button);
  loadFavoriteIds().then(() => paint(button));

  button.addEventListener("click", async (e) => {
    e.stopPropagation();

    if (!hasToken()) {
      window.location.hash = "#/login";
      return;
    }

    button.disabled = true;
    try {
      const result = favoriteIds.has(recipeId)
        ? await removeFavorite(recipeId)
        : await addFavorite(recipeId);
      syncFavorites(result.favoriteRecipeIds);
    } catch (err) {
      alert(err.message);
    } finally {
      button.disabled = false;
    }
  });

  return button;
}