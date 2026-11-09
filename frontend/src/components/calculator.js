import {
  ACTIVITY_LEVELS,
  DEFAULT_ACTIVITY,
  calcTargets,
  validateInput,
} from "../utils/nutritionCalc.js";
import { initDatePicker, parseRuDate } from "./datePicker.js";
import { hasToken, updateProfile } from "../services/profileApi.js";

export function initCalculator(root) {
  let goal = "MAINTAIN";
  let lastInput = null;
  let lastResult = null;
  let submitted = false;

  const activityOptions = ACTIVITY_LEVELS.map(
    (a) =>
      `<option value="${a.value}"${a.value === DEFAULT_ACTIVITY ? " selected" : ""}>${a.label}</option>`,
  ).join("");

  root.innerHTML = `
    <form class="calc-form" id="calc-form" novalidate>
      <div class="calc-form__row">
        <label class="field">
          <span class="field__label">Пол</span>
          <select name="gender">
            <option value="female">Женский</option>
            <option value="male">Мужской</option>
          </select>
        </label>

        <div class="field">
          <label class="field__label" for="calc-birthDate">Дата рождения</label>
          <div class="datepicker" data-datepicker>
            <input
              type="text"
              id="calc-birthDate"
              name="birthDate"
              class="datepicker__input"
              placeholder="дд.мм.гггг"
              inputmode="numeric"
              maxlength="10"
              autocomplete="off"
            />
            <button
              type="button"
              class="datepicker__toggle"
              aria-label="Открыть календарь"
              aria-expanded="false"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="3"></rect>
                <path d="M16 2v4M8 2v4M3 10h18"></path>
              </svg>
            </button>
          </div>
          <span class="field__error" data-error="birthDate"></span>
        </div>
      </div>

      <div class="calc-form__row">
        <label class="field">
          <span class="field__label">Вес, кг</span>
          <input type="number" name="weight" inputmode="decimal" min="30" max="300" step="0.1" placeholder="например, 65" />
          <span class="field__error" data-error="weight"></span>
        </label>

        <label class="field">
          <span class="field__label">Рост, см</span>
          <input type="number" name="height" inputmode="numeric" min="100" max="250" step="1" placeholder="например, 165" />
          <span class="field__error" data-error="height"></span>
        </label>
      </div>

      <label class="field">
        <span class="field__label">Уровень активности</span>
        <select name="activity">${activityOptions}</select>
      </label>

      <button type="submit" class="btn btn--wide">Рассчитать</button>
    </form>
    <div class="calc-result" id="calc-result" hidden></div>
  `;

  const form = root.querySelector("#calc-form");
  initDatePicker(form.querySelector("[data-datepicker]"));
  const resultEl = root.querySelector("#calc-result");
  const fieldNames = ["birthDate", "weight", "height"];

  function toNumber(value) {
    return value === "" ? null : Number(value);
  }

  // из поля приходит "дд.мм.гггг", расчёту и бэкенду нужен "гггг-мм-дд"
  function parseBirthDate(raw) {
    const text = String(raw ?? "").trim();
    if (text === "") return "";
    return parseRuDate(text) ?? "invalid";
  }

  function readForm() {
    const data = new FormData(form);
    return {
      gender: data.get("gender"),
      birthDate: parseBirthDate(data.get("birthDate")),
      weight: toNumber(data.get("weight")),
      height: toNumber(data.get("height")),
      activityLevel: Number(data.get("activity")),
    };
  }

  function showFieldError(name, message = "") {
    form.querySelector(`[data-error="${name}"]`).textContent = message;
    form.elements[name].classList.toggle("is-invalid", Boolean(message));
  }

  function showErrors(errors) {
    fieldNames.forEach((name) => showFieldError(name, errors[name]));
  }

  function setStatus(message, type = "") {
    const statusEl = resultEl.querySelector("[data-status]");
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className =
      "calc-result__status" + (type ? ` calc-result__status--${type}` : "");
  }

  function showLoginHint() {
    const statusEl = resultEl.querySelector("[data-status]");
    if (!statusEl) return;
    statusEl.className = "calc-result__status";
    statusEl.innerHTML =
      'Чтобы сохранить нормы, <a href="#/login">войдите в аккаунт</a>';
  }

  function renderResult(r) {
    resultEl.hidden = false;
    resultEl.innerHTML = `
      <div class="calc-result__kcal">${r.calories} ккал/день</div>
      <div class="calc-result__macros">
        <span>Б ${r.protein} г</span>
        <span>Ж ${r.fat} г</span>
        <span>У ${r.carbs} г</span>
      </div>
      <p class="calc-result__note">
        Базовый обмен (BMR): ${r.bmr} ккал · с учётом активности (TDEE): ${r.tdee} ккал
      </p>
      <button type="button" class="btn btn--wide calc-result__save" data-action="save">
        Сохранить в профиль
      </button>
      <p class="calc-result__status" data-status role="status"></p>
    `;
    if (!hasToken()) showLoginHint();
  }

  function recalc() {
    if (!lastInput) return;
    lastResult = calcTargets({ ...lastInput, goal });
    renderResult(lastResult);
  }

  function process() {
    const input = readForm();
    const errors = validateInput(input);
    showErrors(errors);

    if (Object.keys(errors).length > 0) {
      lastInput = null;
      lastResult = null;
      resultEl.hidden = true;
      return false;
    }

    lastInput = input;
    recalc();
    return true;
  }

  async function saveToProfile(button) {
    if (!lastInput || !lastResult) return;
    if (!hasToken()) {
      showLoginHint();
      return;
    }

    button.disabled = true;
    button.textContent = "Сохраняем...";
    setStatus("");

    try {
      await updateProfile({
        birthDate: lastInput.birthDate,
        weight: lastInput.weight,
        height: lastInput.height,
        activityLevel: lastInput.activityLevel,
        goal,
        targetCalories: lastResult.calories,
        targetProteins: lastResult.protein,
        targetFats: lastResult.fat,
        targetCarbs: lastResult.carbs,
      });
      setStatus("Нормы сохранены в профиль", "ok");
    } catch (err) {
      setStatus(err.message, "error");
    } finally {
      button.disabled = false;
      button.textContent = "Сохранить в профиль";
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitted = true;
    if (process()) {
      resultEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      form.querySelector(".is-invalid")?.focus();
    }
  });

  // результат перерисовывается, поэтому слушаем клик на контейнере
  resultEl.addEventListener("click", (e) => {
    const button = e.target.closest('[data-action="save"]');
    if (button) saveToProfile(button);
  });

  form.addEventListener("input", (e) => {
    if (submitted) {
      process();
      return;
    }

    const name = e.target.name;
    if (fieldNames.includes(name) && e.target.classList.contains("is-invalid")) {
      showFieldError(name, validateInput(readForm())[name]);
    }
  });

  form.addEventListener("focusout", (e) => {
    const name = e.target.name;
    if (!fieldNames.includes(name) || submitted || e.target.value === "") return;
    showFieldError(name, validateInput(readForm())[name]);
  });

  return {
    setGoal(newGoal) {
      goal = newGoal;
      recalc();
    },
    getResult() {
      return lastResult;
    },
  };
}