import React from "react";
import "../styles/DaysTabs.css";

const DAYS = [
  { id: "mon", label: "Пн" },
  { id: "tue", label: "Вт" },
  { id: "wed", label: "Ср" },
  { id: "thu", label: "Чт" },
  { id: "fri", label: "Пт" },
  { id: "sat", label: "Сб" },
  { id: "sun", label: "Вс" },
];

export default function DaysTabs({ activeDay, onSelectDay }) {
  return (
    <div className="days-tabs-container">
      {DAYS.map((day) => (
        <button
          key={day.id}
          className={`day-tab ${activeDay === day.id ? "active" : ""}`}
          onClick={() => onSelectDay(day.id)}
        >
          {day.label}
        </button>
      ))}
    </div>
  );
}
