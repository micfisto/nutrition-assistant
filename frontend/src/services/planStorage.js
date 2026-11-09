const PLAN_KEY = "nutrition_plan_v1";
const NORM_KEY = "targetCalories";
const DAY_IDS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function emptyPlan() {
  return Object.fromEntries(DAY_IDS.map((d) => [d, []]));
}

export function loadPlan() {
  try {
    const raw = localStorage.getItem(PLAN_KEY);
    if (!raw) return emptyPlan();
    return { ...emptyPlan(), ...JSON.parse(raw) };
  } catch {
    return emptyPlan();
  }
}

export function savePlan(plan) {
  try {
    localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
    return true;
  } catch {
    return false;
  }
}

export function loadNorm() {
  try {
    const value = Number(localStorage.getItem(NORM_KEY));
    return value > 0 ? value : 2000;
  } catch {
    return 2000;
  }
}

export function saveNorm(value) {
  try {
    localStorage.setItem(NORM_KEY, String(value));
  } catch {
    /* хранилище недоступно, не страшно */
  }
}
