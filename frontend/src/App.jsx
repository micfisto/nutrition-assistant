import React, { useState } from "react";
import DaysTabs from "./components/DaysTabs";
import RecipeCatalog from "./components/RecipeCatalog";

const DAY_NAMES = {
  mon: "понедельник",
  tue: "вторник",
  wed: "среду",
  thu: "четверг",
  fri: "пятницу",
  sat: "субботу",
  sun: "воскресенье",
};

export default function App() {
  const [activeDay, setActiveDay] = useState("mon");

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px" }}>
      <h1
        style={{
          textAlign: "center",
          margin: "0 0 24px",
          fontSize: "32px",
          color: "var(--garnet)",
        }}
      >
        Nutrition Assistant
      </h1>

      <DaysTabs activeDay={activeDay} onSelectDay={setActiveDay} />

      <h2 style={{ margin: "32px 0 16px", fontSize: "22px" }}>
        Меню на {DAY_NAMES[activeDay]}
      </h2>

      <RecipeCatalog />
    </div>
  );
}
