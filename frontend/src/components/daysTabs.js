const DAYS = [
  { id: "mon", label: "Пн" },
  { id: "tue", label: "Вт" },
  { id: "wed", label: "Ср" },
  { id: "thu", label: "Чт" },
  { id: "fri", label: "Пт" },
  { id: "sat", label: "Сб" },
  { id: "sun", label: "Вс" },
];

function moveIndicator(container) {
  const active = container.querySelector(".day-tab.active");
  const indicator = container.querySelector(".days-indicator");
  if (!active || !indicator || !active.offsetWidth) return;
  indicator.style.width = `${active.offsetWidth}px`;
  indicator.style.transform = `translateX(${active.offsetLeft}px)`;
}

export function renderDaysTabs(container, activeDay, onSelectDay) {
  if (!container.dataset.ready) {
    container.dataset.ready = "1";

    const indicator = document.createElement("span");
    indicator.className = "days-indicator";
    container.appendChild(indicator);

    DAYS.forEach((day) => {
      const button = document.createElement("button");
      button.className = "day-tab";
      button.dataset.day = day.id;
      button.textContent = day.label;
      button.addEventListener("click", () => onSelectDay(day.id));
      container.appendChild(button);
    });

    window.addEventListener("resize", () => moveIndicator(container));
  }

  container.querySelectorAll(".day-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.day === activeDay);
  });

  requestAnimationFrame(() => moveIndicator(container));
}
