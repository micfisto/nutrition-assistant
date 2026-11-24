const PLAN_KEY = "nutrition_plan_v2";
const OLD_PLAN_KEY = "nutrition_plan_v1";
const NORM_KEY = "targetCalories";
const DAY_IDS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const WEEKS = [1, 2, 3, 4];

/*
  Формат хранения:
  {
    week: 1,                          выбранная неделя
    sources: { 2: null, 3: 1, 4: 2 }  какую неделю повторяет каждая (только более раннюю)
    weeks: {
      1: { mon: [...], ... },         неделя без источника: полный план
      3: { tue: [...] }               неделя с источником: только изменённые дни
    }
  }
*/

function emptyPlan() {
  return Object.fromEntries(DAY_IDS.map((d) => [d, []]));
}

function emptyData() {
  return {
    week: 1,
    sources: { 2: null, 3: null, 4: null },
    weeks: { 1: emptyPlan(), 2: {}, 3: {}, 4: {} },
  };
}

function normalize(parsed) {
  const data = emptyData();
  data.week = WEEKS.includes(parsed?.week) ? parsed.week : 1;
  data.weeks[1] = { ...emptyPlan(), ...(parsed?.weeks?.[1] ?? {}) };

  [2, 3, 4].forEach((week) => {
    data.weeks[week] = { ...(parsed?.weeks?.[week] ?? {}) };

    // старый формат хранил один флажок «повторять первую неделю»
    const raw = parsed?.sources ? parsed.sources[week] : parsed?.repeat ? 1 : null;
    const source = Number(raw);
    data.sources[week] = source >= 1 && source < week ? source : null;
  });

  return data;
}

function readData() {
  try {
    const raw = localStorage.getItem(PLAN_KEY);
    if (raw) return normalize(JSON.parse(raw));

    // меню, сохранённое самой первой версией, становится неделей 1
    const old = localStorage.getItem(OLD_PLAN_KEY);
    if (old) {
      const data = emptyData();
      data.weeks[1] = { ...emptyPlan(), ...JSON.parse(old) };
      return data;
    }
  } catch {
    /* повреждённые данные игнорируем */
  }
  return emptyData();
}

function writeData(data) {
  try {
    localStorage.setItem(PLAN_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

function sameDay(a, b) {
  return a.length === b.length && a.every((id, i) => id === b[i]);
}

// итоговый план недели с учётом цепочки повторов
function resolve(data, week) {
  const source = data.sources[week];
  if (source) {
    return { ...resolve(data, source), ...data.weeks[week] };
  }
  return { ...emptyPlan(), ...data.weeks[week] };
}

/* ---------- Меню выбранной недели ---------- */
export function loadPlan() {
  const data = readData();
  return resolve(data, data.week);
}

// меню любой недели для просмотра (выбранную неделю не меняет)
export function loadWeekPlan(week) {
  const data = readData();
  return resolve(data, WEEKS.includes(week) ? week : data.week);
}

export function savePlan(plan) {
  const data = readData();
  const week = data.week;

  const clean = {};
  DAY_IDS.forEach((day) => {
    clean[day] = Array.isArray(plan?.[day]) ? plan[day] : [];
  });

  const source = data.sources[week];
  if (source) {
    // сохраняем только дни, которые отличаются от недели-источника
    const base = resolve(data, source);
    const overrides = {};
    DAY_IDS.forEach((day) => {
      if (!sameDay(clean[day], base[day])) overrides[day] = clean[day];
    });
    data.weeks[week] = overrides;
  } else {
    data.weeks[week] = clean;
  }

  return writeData(data);
}

/* ---------- Недели и повторы ---------- */
export function getWeek() {
  return readData().week;
}

export function setWeek(week) {
  if (!WEEKS.includes(week)) return;
  const data = readData();
  data.week = week;
  writeData(data);
}

// какую неделю повторяет данная (или null)
export function getSource(week) {
  return readData().sources[week] ?? null;
}

export function getSources() {
  return { ...readData().sources };
}

// source: номер более ранней недели или null, чтобы не повторять
export function setSource(week, source) {
  if (![2, 3, 4].includes(week)) return;

  const data = readData();
  const next = source >= 1 && source < week ? source : null;
  if (next === data.sources[week]) return;

  if (next) {
    // неделя копирует выбранную, собственные изменения сбрасываются
    data.weeks[week] = {};
  } else {
    // повтор выключен: неделя остаётся самостоятельной копией
    data.weeks[week] = resolve(data, week);
  }

  data.sources[week] = next;
  writeData(data);
}

// есть ли у недели свои блюда, которые повтор заменит
export function wouldReplaceCustom(week, source) {
  if (!source) return false;

  const data = readData();
  const current = resolve(data, week);
  const base = resolve(data, source);

  return DAY_IDS.some(
    (day) => current[day].length > 0 && !sameDay(current[day], base[day]),
  );
}

/* ---------- Норма калорий ---------- */
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