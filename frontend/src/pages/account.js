import "../styles/Account.css";
import { getUser, isAuthenticated, logout } from "../services/authApi.js";
import { getProfile } from "../services/profileApi.js";
import { getFavorites, removeFavorite } from "../services/favoritesApi.js";
import { fetchRecipes } from "../services/recipesApi.js";
import { loadPlan } from "../services/planStorage.js";
import { createRecipeCard } from "../components/recipeCard.js";
import { openRecipeModal } from "../components/recipeModal.js";
import { ACTIVITY_LEVELS, GOALS, calcAge } from "../utils/nutritionCalc.js";
import { syncFavorites } from "../components/favoriteButton.js";

const DAYS = [
  ["mon", "Понедельник"],
  ["tue", "Вторник"],
  ["wed", "Среда"],
  ["thu", "Четверг"],
  ["fri", "Пятница"],
  ["sat", "Суббота"],
  ["sun", "Воскресенье"],
];

const LOADING = '<div style="min-height: 400px;"></div>';

function fmt(value, unit = "") {
  return value === null || value === undefined ? "—" : `${value}${unit}`;
}

function showError(panel, message) {
  panel.innerHTML = "";

  const box = document.createElement("div");
  box.className = "account__error";

  const text = document.createElement("p");
  text.textContent = message;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn";
  button.textContent = "Выйти и войти заново";
  button.addEventListener("click", () => {
    logout();
    window.location.hash = "#/login";
  });

  box.append(text, button);
  panel.appendChild(box);
}

/* ---------- Вкладка «Мои нормы» ---------- */
function renderNorms(panel, p) {
  const hasNorms = p.targetCalories !== null && p.targetCalories !== undefined;
  const activity =
    ACTIVITY_LEVELS.find((item) => item.value === p.activityLevel)?.label ?? "—";
  const goal = GOALS[p.goal]?.label ?? "—";

  const norms = hasNorms
    ? `<div class="norm-cards">
         <div class="norm-card norm-card--main"><span>Калории</span><b>${fmt(p.targetCalories)}</b><small>ккал в день</small></div>
         <div class="norm-card"><span>Белки</span><b>${fmt(p.targetProteins)}</b><small>г в день</small></div>
         <div class="norm-card"><span>Жиры</span><b>${fmt(p.targetFats)}</b><small>г в день</small></div>
         <div class="norm-card"><span>Углеводы</span><b>${fmt(p.targetCarbs)}</b><small>г в день</small></div>
       </div>`
    : `<div class="account__empty">
         <p>Нормы ещё не рассчитаны.</p>
         <a class="btn" href="#calculator">Рассчитать в калькуляторе</a>
       </div>`;

  panel.innerHTML = `
    ${norms}

    <h3 class="account__sub">Параметры</h3>
    <dl class="account__params">
      <div><dt>Возраст, лет</dt><dd>${fmt(calcAge(p.birthDate))}</dd></div>
      <div><dt>Вес</dt><dd>${fmt(p.weight, " кг")}</dd></div>
      <div><dt>Рост</dt><dd>${fmt(p.height, " см")}</dd></div>
      <div><dt>Активность</dt><dd>${activity}</dd></div>
      <div><dt>Цель</dt><dd>${goal}</dd></div>
    </dl>

    <h3 class="account__sub">Пищевые ограничения</h3>
    <div class="account__tags" data-tags></div>

    <p class="account__links">
      <a href="#calculator">Пересчитать нормы</a>
      <a href="#allergens">Изменить ограничения</a>
    </p>
  `;

  const tagsEl = panel.querySelector("[data-tags]");
  const foods = p.excludedFoods ?? [];
  if (foods.length > 0) {
    foods.forEach((word) => {
      const tag = document.createElement("span");
      tag.className = "account__tag";
      tag.textContent = word;
      tagsEl.appendChild(tag);
    });
  } else if ((p.allergenIds ?? []).length > 0) {
    tagsEl.textContent = `Выбрано продуктов: ${p.allergenIds.length}`;
  } else {
    tagsEl.textContent = "Не указаны";
  }
}

async function loadNorms(panel) {
  panel.innerHTML = LOADING;
  try {
    renderNorms(panel, await getProfile());
  } catch (err) {
    showError(panel, err.message);
  }
}

/* ---------- Вкладка «Избранное» ---------- */
function renderFavorites(panel, recipes) {
  panel.innerHTML = "";

  if (recipes.length === 0) {
    panel.innerHTML = `
      <div class="account__empty">
        <p>В избранном пока пусто. Нажмите ♡ на карточке блюда в каталоге.</p>
        <a class="btn" href="#menu">Перейти к рецептам</a>
      </div>
    `;
    return;
  }

  const list = document.createElement("div");
  list.className = "recipe-catalog__list";

  recipes.forEach((recipe) => {
    const card = createRecipeCard(recipe);
    card.addEventListener("click", () => openRecipeModal(recipe));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "btn-add btn-add--remove";
    remove.textContent = "Убрать из избранного";
    remove.addEventListener("click", async (e) => {
      e.stopPropagation();
      remove.disabled = true;
      try {
        const result = await removeFavorite(recipe.id);
        syncFavorites(result.favoriteRecipeIds);
        renderFavorites(
          panel,
          recipes.filter((item) => item.id !== recipe.id),
        );
      } catch (err) {
        remove.disabled = false;
        alert(err.message);
      }
    });

    card.querySelector(".recipe-card__body").appendChild(remove);
    list.appendChild(card);
  });

  panel.appendChild(list);
}

async function loadFavorites(panel) {
  panel.innerHTML = LOADING;
  try {
    renderFavorites(panel, await getFavorites());
  } catch (err) {
    showError(panel, err.message);
  }
}

/* ---------- Вкладка «Мои планы» ---------- */
function renderPlans(panel, plan, byId) {
  panel.innerHTML = "";

  const hasDishes = DAYS.some(([id]) => (plan[id] ?? []).length > 0);
  if (!hasDishes) {
    panel.innerHTML = `
      <div class="account__empty">
        <p>Меню ещё не составлено.</p>
        <a class="btn" href="#menu">Собрать меню</a>
      </div>
    `;
    return;
  }

  const caption = document.createElement("p");
  caption.className = "account__caption";
  caption.textContent = "Меню на неделю, сохранённое в этом браузере.";
  panel.appendChild(caption);

  const grid = document.createElement("div");
  grid.className = "plans-grid";

  DAYS.forEach(([id, label]) => {
    const recipes = (plan[id] ?? []).map((rid) => byId.get(rid)).filter(Boolean);
    const total = recipes.reduce(
      (sum, r) => sum + r.nutrientsPerServing.calories,
      0,
    );

    const day = document.createElement("article");
    day.className = "plan-day";

    const head = document.createElement("header");
    head.className = "plan-day__head";
    const title = document.createElement("h4");
    title.textContent = label;
    const kcal = document.createElement("span");
    kcal.textContent = recipes.length ? `${Math.round(total)} ккал` : "";
    head.append(title, kcal);

    const list = document.createElement("ul");
    list.className = "plan-day__list";
    if (recipes.length === 0) {
      const empty = document.createElement("li");
      empty.className = "plan-day__empty";
      empty.textContent = "Блюд нет";
      list.appendChild(empty);
    }
    recipes.forEach((recipe) => {
      const item = document.createElement("li");
      const name = document.createElement("span");
      name.textContent = recipe.title;
      const cal = document.createElement("small");
      cal.textContent = `${recipe.nutrientsPerServing.calories} ккал`;
      item.append(name, cal);
      list.appendChild(item);
    });

    day.append(head, list);
    grid.appendChild(day);
  });

  panel.appendChild(grid);

  const link = document.createElement("p");
  link.className = "account__links";
  link.innerHTML = '<a href="#menu">Редактировать меню</a>';
  panel.appendChild(link);
}

async function loadPlans(panel) {
  panel.innerHTML = LOADING;

  let recipes;
  try {
    recipes = await fetchRecipes();
  } catch (err) {
    panel.innerHTML = "";
    const message = document.createElement("p");
    message.className = "account__caption";
    message.textContent = `Не удалось загрузить рецепты: ${err.message}`;
    panel.appendChild(message);
    return;
  }

  let plan = {};
  try {
    plan = loadPlan() ?? {};
  } catch {
    plan = {};
  }

  renderPlans(panel, plan, new Map(recipes.map((r) => [r.id, r])));
}

/* ---------- Запуск страницы ---------- */
function init() {
  const root = document.getElementById("account-module");
  if (!root) return;

  if (!isAuthenticated()) {
    window.location.hash = "#/login";
    return;
  }

  const user = getUser();
  root.querySelector("#account-hello").textContent = user?.username
    ? `Привет, ${user.username}!`
    : "";

  const tabs = root.querySelectorAll(".account__tab");
  const panels = {
    norms: root.querySelector("#panel-norms"),
    favorites: root.querySelector("#panel-favorites"),
    plans: root.querySelector("#panel-plans"),
  };
  const loaders = {
    norms: loadNorms,
    favorites: loadFavorites,
    plans: loadPlans,
  };
  const loaded = new Set();

  function openTab(name) {
    tabs.forEach((tab) => {
      const active = tab.dataset.tab === name;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    
    Object.entries(panels).forEach(([key, panel]) => {
      if (key === name) {
        panel.style.display = "block";
        panel.hidden = false;
      } else {
        panel.style.display = "none";
        panel.hidden = true;
      }
    });

    if (!loaded.has(name)) {
      loaded.add(name);
      loaders[name](panels[name]);
    }
  }

  tabs.forEach((tab) =>
    tab.addEventListener("click", () => openTab(tab.dataset.tab)),
  );

  openTab("norms");
}

init();