import { fetchRecipes } from "./services/recipesApi.js";
import { renderDaysTabs } from "./components/daysTabs.js";
import { createRecipeCard } from "./components/recipeCard.js";
import { openRecipeModal } from "./components/recipeModal.js";
import { fetchPlan, pushPlan } from "./services/plansApi.js";
import { createFavoriteButton } from "./components/favoriteButton.js";
import {
  loadPlan,
  savePlan,
  loadNorm,
  saveNorm,
  getWeek,
  setWeek,
  getRepeat,
  setRepeat,
} from "./services/planStorage.js";
import "./styles/Weeks.css";

const DAY_NAMES = {
  mon: "понедельник",
  tue: "вторник",
  wed: "среду",
  thu: "четверг",
  fri: "пятницу",
  sat: "субботу",
  sun: "воскресенье",
};

const state = {
  activeDay: "mon",
  sortBy: "",
  order: "asc",
  search: "",
  mealType: "",
  plan: loadPlan(),
  norm: loadNorm(),
  replacing: null, // { day, index } пока выбираем блюдо для замены
};

const byId = new Map(); // все загруженные рецепты по id
let lastRecipes = [];

const $ = (id) => document.getElementById(id);
const tabsEl = $("days-tabs");
const dayTitleEl = $("day-title");
const dayCountEl = $("day-count");
const dayPlanEl = $("day-plan");
const listEl = $("recipe-list");
const statusEl = $("status");
const replaceBar = $("replace-bar");
const totalKcalEl = $("total-kcal");
const totalMacrosEl = $("total-macros");
const normFillEl = $("norm-fill");
const normTextEl = $("norm-text");
const normInput = $("norm-input");
const saveNote = $("save-note");
const weekTabsEl = $("week-tabs");
const repeatEl = $("repeat-week");
const weekNoteEl = $("week-note");

let pushTimer;
function persist() {
  savePlan(state.plan);
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushPlan(state.plan).catch(() => {});
  }, 400);
}

function dayRecipes() {
  return state.plan[state.activeDay].map((id) => byId.get(id)).filter(Boolean);
}

/* ---------- Итоги дня ---------- */
function renderTotals() {
  const sum = { calories: 0, protein: 0, fat: 0, carbs: 0 };
  dayRecipes().forEach((r) => {
    const n = r.nutrientsPerServing;
    sum.calories += n.calories;
    sum.protein += n.protein;
    sum.fat += n.fat;
    sum.carbs += n.carbs;
  });

  totalKcalEl.textContent = `${Math.round(sum.calories)} ккал`;
  totalMacrosEl.textContent = `Б ${sum.protein.toFixed(1)} · Ж ${sum.fat.toFixed(1)} · У ${sum.carbs.toFixed(1)}`;

  const diff = Math.round(state.norm - sum.calories);
  const percent = Math.min(100, (sum.calories / state.norm) * 100);
  normFillEl.style.width = `${percent}%`;
  normFillEl.classList.toggle("over", diff < 0);
  normTextEl.classList.toggle("over", diff < 0);
  normTextEl.textContent =
    diff >= 0 ? `Осталось ${diff} ккал` : `Перебор ${Math.abs(diff)} ккал`;
}

/* ---------- Меню выбранного дня ---------- */
function renderPlan() {
  dayPlanEl.innerHTML = "";
  const ids = state.plan[state.activeDay];
  dayCountEl.textContent = ids.length ? `Блюд: ${ids.length}` : "";

  const items = ids
    .map((id, index) => ({ recipe: byId.get(id), index }))
    .filter((item) => item.recipe);

  if (items.length === 0) {
    const empty = document.createElement("li");
    empty.className = "day-plan__empty";
    empty.textContent = "Пока пусто. Добавьте блюдо из каталога ниже.";
    dayPlanEl.appendChild(empty);
  }

  items.forEach(({ recipe, index }, position) => {
    const li = document.createElement("li");
    const isReplacing =
      state.replacing &&
      state.replacing.day === state.activeDay &&
      state.replacing.index === index;
    li.className = "day-plan__item" + (isReplacing ? " is-replacing" : "");

    const num = document.createElement("span");
    num.className = "day-plan__num";
    num.textContent = position + 1;

    const name = document.createElement("span");
    name.className = "day-plan__name";
    name.textContent = recipe.title;

    const kcal = document.createElement("span");
    kcal.className = "day-plan__kcal";
    kcal.textContent = `${recipe.nutrientsPerServing.calories} ккал`;

    const actions = document.createElement("div");
    actions.className = "day-plan__actions";

    const replaceBtn = document.createElement("button");
    replaceBtn.type = "button";
    replaceBtn.textContent = "Заменить";
    replaceBtn.addEventListener("click", () => {
      state.replacing = { day: state.activeDay, index };
      renderAll();
      $("recipe-list").scrollIntoView({ behavior: "smooth", block: "center" });
    });

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "danger";
    removeBtn.textContent = "Удалить";
    removeBtn.addEventListener("click", () => {
      state.plan[state.activeDay].splice(index, 1);
      state.replacing = null;
      persist();
      renderAll();
    });

    actions.append(replaceBtn, removeBtn);
    li.append(num, name, kcal, actions);
    dayPlanEl.appendChild(li);
  });

  replaceBar.hidden = !state.replacing;
  renderTotals();
}

/* ---------- Каталог ---------- */
function renderCatalog() {
  listEl.innerHTML = "";
  lastRecipes.forEach((recipe) => {
    const card = createRecipeCard(recipe);
    card
      .querySelector(".recipe-card__image")
      ?.appendChild(createFavoriteButton(recipe.id));
    card.addEventListener("click", () => openRecipeModal(recipe));

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-add" + (state.replacing ? " btn-add--replace" : "");
    btn.textContent = state.replacing ? "Заменить на это" : "+ В меню";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      addDish(recipe.id);
    });
    card.querySelector(".recipe-card__body").appendChild(btn);

    listEl.appendChild(card);
  });
}

function addDish(id) {
  if (state.replacing) {
    state.plan[state.replacing.day][state.replacing.index] = id;
    state.replacing = null;
  } else {
    state.plan[state.activeDay].push(id);
  }
  persist();
  renderAll();
}

function renderAll() {
  renderPlan();
  renderCatalog();
}

/* ---------- Недели 1-4 и повтор ---------- */
function reloadPlan() {
  state.plan = loadPlan();
  state.replacing = null;
  renderWeeks();
  renderAll();
}

function renderWeeks() {
  const current = getWeek();
  const repeat = getRepeat();

  weekTabsEl.innerHTML = "";
  for (let week = 1; week <= 4; week++) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "week-tab" + (week === current ? " active" : "");
    button.textContent = `Неделя ${week}`;
    button.addEventListener("click", () => {
      setWeek(week);
      reloadPlan();
    });
    weekTabsEl.appendChild(button);
  }

  repeatEl.checked = repeat;
  weekNoteEl.textContent =
    repeat && current > 1
      ? "Эта неделя повторяет первую. Изменённые дни сохраняются отдельно."
      : "";
}

/* ---------- Дни недели ---------- */
function renderDay() {
  renderDaysTabs(tabsEl, state.activeDay, (dayId) => {
    state.activeDay = dayId;
    state.replacing = null;
    renderDay();
    renderAll();
  });
  dayTitleEl.textContent = `Меню на ${DAY_NAMES[state.activeDay]}`;
}

/* ---------- Загрузка рецептов ---------- */
async function loadRecipes() {
  statusEl.textContent = "Загрузка...";
  try {
    lastRecipes = await fetchRecipes({
      sortBy: state.sortBy,
      order: state.order,
      search: state.search,
      mealType: state.mealType,
    });
    lastRecipes.forEach((r) => byId.set(r.id, r));
    statusEl.textContent = lastRecipes.length ? "" : "Ничего не найдено";
    renderAll();
  } catch (err) {
    statusEl.textContent = `Не удалось загрузить рецепты: ${err.message}`;
  }
}

/* ---------- Синхронизация плана с сервером (только для вошедших) ---------- */
async function syncFromServer() {
  try {
    const remote = await fetchPlan();
    const week1 = remote && remote.weeks && remote.weeks[1];
    if (week1) {
      state.plan = { ...state.plan, ...week1 };
      savePlan(state.plan);
      renderAll();
    }
  } catch {
    /* сервер недоступен, остаётся localStorage */
  }
}

/* ---------- Обработчики ---------- */
$("sort-by").addEventListener("change", (e) => {
  state.sortBy = e.target.value;
  loadRecipes();
});
$("sort-order").addEventListener("change", (e) => {
  state.order = e.target.value;
  loadRecipes();
});

let searchTimer;
$("search-input").addEventListener("input", (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.search = e.target.value;
    loadRecipes();
  }, 300);
});
$("meal-type").addEventListener("change", (e) => {
  state.mealType = e.target.value;
  loadRecipes();
});

$("replace-cancel").addEventListener("click", () => {
  state.replacing = null;
  renderAll();
});

repeatEl.addEventListener("change", () => {
  setRepeat(repeatEl.checked);
  reloadPlan();
});

normInput.value = state.norm;
normInput.addEventListener("change", () => {
  const value = Number(normInput.value);
  if (value >= 800) {
    state.norm = value;
    saveNorm(value);
  }
  normInput.value = state.norm;
  renderTotals();
});

$("save-btn").addEventListener("click", () => {
  const ok = savePlan(state.plan);
  pushPlan(state.plan).catch(() => {});
  saveNote.textContent = ok ? "Меню сохранено ✓" : "Не удалось сохранить";
  setTimeout(() => (saveNote.textContent = ""), 2000);
});

renderWeeks();
renderDay();
renderPlan();
loadRecipes();

renderDay();
renderPlan();
loadRecipes().then(syncFromServer);
