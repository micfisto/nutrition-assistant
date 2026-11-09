import { fetchIngredients } from "../services/ingredientsApi.js";
import { getProfile, updateProfile, hasToken } from "../services/profileApi.js";
import { matchesExcluded, normalizeFood } from "../utils/foodMatcher.js";

const STORAGE_KEY = "excludedFoods";
const MAX_WORDS = 50;
const MIN_LENGTH = 2;
const MAX_LENGTH = 40;

function loadLocal() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(value)
      ? value.filter((word) => typeof word === "string")
      : [];
  } catch {
    return [];
  }
}

function saveLocal(words) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  } catch {
  }
}

export function initAllergens(root) {
  let words = loadLocal();
  let ingredients = [];

  root.innerHTML = `
    <p class="allergens__lead">
      Впишите продукты, которые нужно исключить из рациона. Можно несколько через запятую.
    </p>
    <form class="allergens__form" novalidate>
      <input
        type="text"
        class="allergens__input"
        placeholder="Например: арахис, креветки"
        maxlength="80"
        autocomplete="off"
        aria-label="Продукт для исключения"
      />
      <button type="submit" class="btn allergens__add">Добавить</button>
    </form>
    <p class="allergens__error" role="alert"></p>
    <div class="allergens__tags" aria-label="Исключённые продукты"></div>

    <p class="allergens__sub">
      Или выберите из списка: нажмите на продукт, чтобы исключить его
    </p>
    <div class="allergens__list" role="group" aria-label="Быстрый выбор продуктов"></div>

    <div class="allergens__footer">
      <div class="allergens__summary">
        <span class="allergens__count"></span>
        <button type="button" class="allergens__clear" hidden>Очистить всё</button>
      </div>
      <button type="button" class="btn allergens__save">Сохранить в профиль</button>
    </div>
    <p class="allergens__status" role="status"></p>
    <p class="allergens__note">
      Фильтр работает по названиям ингредиентов в рецептах. При серьёзной аллергии всегда проверяйте состав блюда.
    </p>
  `;

  const formEl = root.querySelector(".allergens__form");
  const inputEl = root.querySelector(".allergens__input");
  const errorEl = root.querySelector(".allergens__error");
  const tagsEl = root.querySelector(".allergens__tags");
  const listEl = root.querySelector(".allergens__list");
  const countEl = root.querySelector(".allergens__count");
  const saveBtn = root.querySelector(".allergens__save");
  const clearBtn = root.querySelector(".allergens__clear");
  const statusEl = root.querySelector(".allergens__status");

  function setError(message = "") {
    errorEl.textContent = message;
    inputEl.classList.toggle("is-invalid", Boolean(message));
  }

  function setStatus(message, type = "") {
    statusEl.textContent = message;
    statusEl.className =
      "allergens__status" + (type ? ` allergens__status--${type}` : "");
  }

  function showLoginHint() {
    statusEl.className = "allergens__status";
    statusEl.innerHTML =
      'Выбор сохранён в браузере. Чтобы сохранить в профиль, <a href="#/login">войдите в аккаунт</a>';
  }

  function refreshStatus() {
    if (hasToken()) setStatus("");
    else showLoginHint();
  }

  function matchingIds() {
    return ingredients
      .filter((item) => matchesExcluded(item.name, words))
      .map((item) => item.id);
  }

  function notify() {
    document.dispatchEvent(
      new CustomEvent("allergens:change", {
        detail: { words: [...words], ids: matchingIds() },
      }),
    );
  }

  function renderTags() {
    tagsEl.innerHTML = "";
    words.forEach((word) => {
      const tag = document.createElement("span");
      tag.className = "allergen-tag";

      const label = document.createElement("span");
      label.textContent = word;

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "allergen-tag__remove";
      remove.dataset.word = word;
      remove.setAttribute("aria-label", `Убрать: ${word}`);
      remove.textContent = "×";

      tag.append(label, remove);
      tagsEl.appendChild(tag);
    });
  }

  function renderChips() {
    listEl.innerHTML = "";
    ingredients.forEach(({ name }) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "allergen-chip";
      chip.dataset.name = name;
      chip.textContent = name;
      chip.setAttribute("aria-pressed", String(matchesExcluded(name, words)));
      listEl.appendChild(chip);
    });
  }

  function updateCount() {
    countEl.textContent =
      words.length === 0
        ? "Ничего не исключено"
        : `Исключено продуктов: ${words.length}`;
    clearBtn.hidden = words.length === 0;
  }

  function update() {
    saveLocal(words);
    renderTags();
    renderChips();
    updateCount();
    refreshStatus();
    notify();
  }

  function addWords(raw) {
    const parts = raw
      .split(/[,;\n]/)
      .map((part) => part.trim().replace(/\s+/g, " "))
      .filter(Boolean);

    if (parts.length === 0) {
      setError("Введите название продукта");
      return false;
    }

    if (parts.some((p) => p.length < MIN_LENGTH || p.length > MAX_LENGTH)) {
      setError(`Название должно быть от ${MIN_LENGTH} до ${MAX_LENGTH} символов`);
      return false;
    }

    let added = 0;
    for (const part of parts) {
      if (words.length >= MAX_WORDS) {
        setError(`Можно добавить не больше ${MAX_WORDS} продуктов`);
        return false;
      }
      const exists = words.some((w) => normalizeFood(w) === normalizeFood(part));
      if (!exists) {
        words.push(part);
        added++;
      }
    }

    if (added === 0) {
      setError("Этот продукт уже добавлен");
      return false;
    }

    setError("");
    return true;
  }

  function toggleIngredient(name) {
    if (matchesExcluded(name, words)) {

      words = words.filter((word) => !matchesExcluded(name, [word]));
    } else if (words.length < MAX_WORDS) {
      words.push(name);
    }
  }

  async function load() {
    renderTags();
    updateCount();
    setStatus("Загрузка списка продуктов...");

    let catalogError = null;
    try {
      ingredients = await fetchIngredients();
    } catch (err) {
      catalogError = err.message;
    }

    let profileError = null;
    if (hasToken()) {
      try {
        const profile = await getProfile();
        const fromProfile = profile.excludedFoods ?? [];
        // продукты, выбранные раньше по id, превращаем в слова
        const fromIds = ingredients
          .filter(
            (item) =>
              (profile.allergenIds ?? []).includes(item.id) &&
              !matchesExcluded(item.name, fromProfile),
          )
          .map((item) => item.name);
        words = [...fromProfile, ...fromIds];
      } catch (err) {
        profileError = err.message;
      }
    }

    update();

    if (profileError) setStatus(`Профиль не загружен: ${profileError}`, "error");
    else if (catalogError)
      setStatus(`Список продуктов недоступен: ${catalogError}`, "error");
  }

  async function save() {
    if (!hasToken()) {
      showLoginHint();
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = "Сохраняем...";
    setStatus("");

    const payload = { excludedFoods: words };

    if (ingredients.length > 0) payload.allergenIds = matchingIds();

    try {
      await updateProfile(payload);
      setStatus("Ограничения сохранены в профиль", "ok");
    } catch (err) {
      setStatus(err.message, "error");
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = "Сохранить в профиль";
    }
  }

  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    if (addWords(inputEl.value)) {
      inputEl.value = "";
      update();
    }
  });

  inputEl.addEventListener("input", () => setError(""));

  tagsEl.addEventListener("click", (e) => {
    const button = e.target.closest("[data-word]");
    if (!button) return;
    words = words.filter((word) => word !== button.dataset.word);
    update();
  });

  listEl.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-name]");
    if (!chip) return;
    toggleIngredient(chip.dataset.name);
    update();
  });

  clearBtn.addEventListener("click", () => {
    words = [];
    setError("");
    update();
    if (hasToken()) {
      setStatus(
        "Список очищен. Нажмите «Сохранить в профиль», чтобы обновить профиль",
      );
    }
  });

  saveBtn.addEventListener("click", save);

  load();

  return {
    getSelected() {
      return [...words];
    },
  };
}