const DAYS = [
  { id: "mon", label: "Пн" },
  { id: "tue", label: "Вт" },
  { id: "wed", label: "Ср" },
  { id: "thu", label: "Чт" },
  { id: "fri", label: "Пт" },
  { id: "sat", label: "Сб" },
  { id: "sun", label: "Вс" },
];

export function renderDaysTabs(container, activeDay, onSelectDay) {
  container.innerHTML = "";

  DAYS.forEach((day) => {
    const button = document.createElement("button");
    button.className = "day-tab" + (day.id === activeDay ? " active" : "");
    button.textContent = day.label;
    button.addEventListener("click", () => onSelectDay(day.id));
    container.appendChild(button);
  });
}
