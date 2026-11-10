const PLAN_KEY = "nutrition_plan_v2";
const OLD_PLAN_KEY = "nutrition_plan_v1";
const NORM_KEY = "targetCalories";
const DAY_IDS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const WEEKS = [1, 2, 3, 4];

/*
  Формат хранения:
  {
    week: 1,          выбранная неделя
    repeat: false,    повторять первую неделю
    weeks: {
      1: { mon: [...], ... },  полный план первой недели
      2: { ... },              без повтора: полный план
      3: { ... },              с повтором: только изменённые дни
      4: { ... }
    }
  }
*/

function emptyPlan() {
  return Object.fromEntries(DAY_IDS.map((d) => [d, []]));
}

function emptyData() {
  return { week: 1, repeat: false, weeks: { 1: emptyPlan(), 2: {}, 3: {}, 4: {} } };
}

function normalize(parsed) {
  const data = emptyData();
  data.week = WEEKS.includes(parsed?.week) ? parsed.week : 1;
  data.repeat = Boolean(parsed?.repeat);
  data.weeks[1] = { ...emptyPlan(), ...(parsed?.weeks?.[1] ?? {}) };
  [2, 3, 4].forEach((week) => {
    data.weeks[week] = { ...(parsed?.weeks?.[week] ?? {}) };
  });
  return data;
}

function readData() {
  try {
    const raw = localStorage.getItem(PLAN_KEY);
    if (raw) return normalize(JSON.parse(raw));

    const old = localStorage.getItem(OLD_PLAN_KEY);
    if (old) {
      const data = emptyData();
      data.weeks[1] = { ...emptyPlan(), ...JSON.parse(old) };
      return data;
    }
  } catch {
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

function resolve(data, week) {
  if (data.repeat && week > 1) {
    return { ...data.weeks[1], ...data.weeks[week] };
  }
  return { ...emptyPlan(), ...data.weeks[week] };
}

/* Меню выбранной недели */
export function loadPlan() {
  const data = readData();
  return resolve(data, data.week);
}

export function savePlan(plan) {
  const data = readData();
  const week = data.week;

  const clean = {};
  DAY_IDS.forEach((day) => {
    clean[day] = Array.isArray(plan?.[day]) ? plan[day] : [];
  });

  if (data.repeat && week > 1) {
    const overrides = {};
    DAY_IDS.forEach((day) => {
      if (!sameDay(clean[day], data.weeks[1][day])) overrides[day] = clean[day];
    });
    data.weeks[week] = overrides;
  } else {
    data.weeks[week] = clean;
  }

  return writeData(data);
}

/* Недели и повтор  */
export function getWeek() {
  return readData().week;
}

export function setWeek(week) {
  if (!WEEKS.includes(week)) return;
  const data = readData();
  data.week = week;
  writeData(data);
}

export function getRepeat() {
  return readData().repeat;
}

export function setRepeat(flag) {
  const data = readData();
  const next = Boolean(flag);
  if (next === data.repeat) return;

  if (next) {
    [2, 3, 4].forEach((week) => {
      const own = {};
      DAY_IDS.forEach((day) => {
        const ids = data.weeks[week][day];
        if (
          Array.isArray(ids) &&
          ids.length > 0 &&
          !sameDay(ids, data.weeks[1][day])
        ) {
          own[day] = ids;
        }
      });
      data.weeks[week] = own;
    });
  } else {
    [2, 3, 4].forEach((week) => {
      data.weeks[week] = resolve(data, week);
    });
  }

  data.repeat = next;
  writeData(data);
}

/* Норма калорий */
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
  }
}