const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];
const WEEKDAYS = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

const pad = (n) => String(n).padStart(2, "0");

// month: 0-11
export function toIso(year, month, day) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function todayIso() {
  const now = new Date();
  return toIso(now.getFullYear(), now.getMonth(), now.getDate());
}

// "15.05.2001" -> "2001-05-15"; для неверной даты вернёт null
export function parseRuDate(text) {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(text).trim());
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]) - 1;
  const year = Number(match[3]);

  const date = new Date(year, month, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }
  return toIso(year, month, day);
}

// "2001-05-15" -> "15.05.2001"
export function formatRuDate(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

// при вводе цифр сами расставляет точки: 15052001 -> 15.05.2001
function maskDate(value) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  let out = digits.slice(0, 2);
  if (digits.length > 2) out += "." + digits.slice(2, 4);
  if (digits.length > 4) out += "." + digits.slice(4);
  return out;
}

export function initDatePicker(root, { min = "1900-01-01", max = todayIso() } = {}) {
  const input = root.querySelector(".datepicker__input");
  const toggle = root.querySelector(".datepicker__toggle");
  const minYear = Number(min.slice(0, 4));
  const maxYear = Number(max.slice(0, 4));

  const yearOptions = [];
  for (let y = maxYear; y >= minYear; y--) {
    yearOptions.push(`<option value="${y}">${y}</option>`);
  }

  const popup = document.createElement("div");
  popup.className = "datepicker__popup";
  popup.hidden = true;
  popup.setAttribute("role", "dialog");
  popup.setAttribute("aria-label", "Выбор даты");
  popup.innerHTML = `
    <div class="datepicker__head">
      <button type="button" class="datepicker__nav" data-nav="-1" aria-label="Предыдущий месяц">‹</button>
      <select class="datepicker__select" data-role="month" aria-label="Месяц">
        ${MONTHS.map((name, i) => `<option value="${i}">${name}</option>`).join("")}
      </select>
      <select class="datepicker__select" data-role="year" aria-label="Год">
        ${yearOptions.join("")}
      </select>
      <button type="button" class="datepicker__nav" data-nav="1" aria-label="Следующий месяц">›</button>
    </div>
    <div class="datepicker__weekdays">
      ${WEEKDAYS.map((d) => `<span>${d}</span>`).join("")}
    </div>
    <div class="datepicker__grid"></div>
    <div class="datepicker__foot">
      <button type="button" class="datepicker__clear">Очистить</button>
    </div>
  `;
  root.appendChild(popup);

  const monthSelect = popup.querySelector('[data-role="month"]');
  const yearSelect = popup.querySelector('[data-role="year"]');
  const grid = popup.querySelector(".datepicker__grid");

  let viewYear = maxYear;
  let viewMonth = 0;

  function isOpen() {
    return !popup.hidden;
  }

  function renderGrid() {
    monthSelect.value = String(viewMonth);
    yearSelect.value = String(viewYear);

    const selected = parseRuDate(input.value);
    const today = todayIso();
    // неделя начинается с понедельника
    const offset = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < offset; i++) {
      cells.push('<span class="datepicker__empty"></span>');
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const iso = toIso(viewYear, viewMonth, day);
      const disabled = iso > max || iso < min;
      const classes = ["datepicker__day"];
      if (iso === selected) classes.push("is-selected");
      if (iso === today) classes.push("is-today");
      cells.push(
        `<button type="button" class="${classes.join(" ")}" data-date="${iso}"${disabled ? " disabled" : ""}>${day}</button>`,
      );
    }
    grid.innerHTML = cells.join("");
  }

  function open() {
    const selected = parseRuDate(input.value);
    if (selected) {
      const year = Number(selected.slice(0, 4));
      viewYear = Math.min(maxYear, Math.max(minYear, year));
      viewMonth = Number(selected.slice(5, 7)) - 1;
    } else {
      // для даты рождения удобнее открывать несколько лет назад
      viewYear = Math.max(minYear, maxYear - 25);
      viewMonth = 0;
    }
    renderGrid();
    popup.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
  }

  function close() {
    popup.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  }

  function shiftMonth(delta) {
    let year = viewYear;
    let month = viewMonth + delta;
    if (month < 0) {
      month = 11;
      year--;
    } else if (month > 11) {
      month = 0;
      year++;
    }
    if (year < minYear || year > maxYear) return;
    viewYear = year;
    viewMonth = month;
    renderGrid();
  }

  // обновляет поле и сообщает форме, что значение изменилось
  function setValue(text) {
    input.value = text;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  toggle.addEventListener("click", () => (isOpen() ? close() : open()));

  input.addEventListener("input", () => {
    input.value = maskDate(input.value);
  });

  popup.addEventListener("click", (e) => {
    const nav = e.target.closest("[data-nav]");
    if (nav) {
      shiftMonth(Number(nav.dataset.nav));
      return;
    }

    const day = e.target.closest("[data-date]");
    if (day && !day.disabled) {
      setValue(formatRuDate(day.dataset.date));
      close();
      input.focus();
      return;
    }

    if (e.target.closest(".datepicker__clear")) {
      setValue("");
      close();
      input.focus();
    }
  });

  popup.addEventListener("change", (e) => {
    if (e.target === monthSelect) viewMonth = Number(monthSelect.value);
    if (e.target === yearSelect) viewYear = Number(yearSelect.value);
    renderGrid();
  });

  // действия внутри календаря не должны запускать пересчёт формы
  popup.addEventListener("input", (e) => e.stopPropagation());

  document.addEventListener("click", (e) => {
    if (isOpen() && !root.contains(e.target)) close();
  });

  root.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) {
      close();
      toggle.focus();
    }
  });
}