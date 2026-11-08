import { fetchRecipes } from "./services/recipesApi.js";
import { renderDaysTabs } from "./components/daysTabs.js";
import { createRecipeCard } from "./components/recipeCard.js";
import { requireAuth, addLogoutHandler, displayUserInfo } from "./services/authGuard.js";

const DAY_NAMES = {
  mon: "понедельник",
  tue: "вторник",
  wed: "среду",
  thu: "четверг",
  fri: "пятницу",
  sat: "субботу",
  sun: "воскресенье",
};

requireAuth();
displayUserInfo();
addLogoutHandler();

const state = { activeDay: "mon", sortBy: "", order: "asc" };

const tabsEl = document.getElementById("days-tabs");
const dayTitleEl = document.getElementById("day-title");
const sortByEl = document.getElementById("sort-by");
const sortOrderEl = document.getElementById("sort-order");
const statusEl = document.getElementById("status");
const listEl = document.getElementById("recipe-list");

function renderDay() {
  renderDaysTabs(tabsEl, state.activeDay, (dayId) => {
    state.activeDay = dayId;
    renderDay();
  });
  dayTitleEl.textContent = `Меню на ${DAY_NAMES[state.activeDay]}`;
}

async function loadRecipes() {
  statusEl.textContent = "Загрузка...";
  try {
    const recipes = await fetchRecipes({
      sortBy: state.sortBy,
      order: state.order,
    });
    listEl.innerHTML = "";
    recipes.forEach((recipe) => listEl.appendChild(createRecipeCard(recipe)));
    statusEl.textContent = "";
  } catch (err) {
    statusEl.textContent = `Не удалось загрузить рецепты: ${err.message}`;
  }
}

sortByEl.addEventListener("change", () => {
  state.sortBy = sortByEl.value;
  loadRecipes();
});
sortOrderEl.addEventListener("change", () => {
  state.order = sortOrderEl.value;
  loadRecipes();
});

renderDay();
loadRecipes();
