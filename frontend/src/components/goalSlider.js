import { GOALS } from "../utils/nutritionCalc.js";

const GOAL_KEYS = Object.keys(GOALS); // LOSE_WEIGHT, MAINTAIN, GAIN_MUSCLE

function describe(key) {
  const f = GOALS[key].factor;
  if (f < 1) return `Дефицит около ${Math.round((1 - f) * 100)}% от суточной нормы`;
  if (f > 1) return `Профицит около ${Math.round((f - 1) * 100)}% от суточной нормы`;
  return "Калорийность равна суточной норме";
}

export function initGoalSlider(root, onChange, initialGoal = "MAINTAIN") {
  let index = Math.max(0, GOAL_KEYS.indexOf(initialGoal));

  root.innerHTML = `
    <div class="goal-switch" role="radiogroup" aria-label="Цель питания" style="--count: ${GOAL_KEYS.length}">
      <span class="goal-switch__thumb"></span>
      ${GOAL_KEYS.map(
        (key, i) =>
          `<button type="button" role="radio" class="goal-switch__item" data-index="${i}">${GOALS[key].label}</button>`,
      ).join("")}
    </div>
    <p class="goal-switch__hint"></p>
  `;

  const switchEl = root.querySelector(".goal-switch");
  const items = root.querySelectorAll(".goal-switch__item");
  const hint = root.querySelector(".goal-switch__hint");

  function render() {
    switchEl.style.setProperty("--i", index);
    items.forEach((el, i) => {
      const active = i === index;
      el.setAttribute("aria-checked", String(active));
      el.tabIndex = active ? 0 : -1;
    });
    hint.textContent = describe(GOAL_KEYS[index]);
  }

  function select(newIndex, { focus = false } = {}) {
    if (newIndex < 0 || newIndex >= GOAL_KEYS.length) return;
    const changed = newIndex !== index;
    index = newIndex;
    render();
    if (focus) items[index].focus();
    if (changed) onChange(GOAL_KEYS[index]);
  }

  items.forEach((el, i) => {
    el.addEventListener("click", () => select(i));
  });

  switchEl.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      select(index + 1, { focus: true });
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      select(index - 1, { focus: true });
    }
  });

  render();
}