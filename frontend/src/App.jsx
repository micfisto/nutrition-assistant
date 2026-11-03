import React, { useState } from "react";
import DaysTabs from "./components/DaysTabs";
import RecipeCatalog from "./components/RecipeCatalog";

export default function App() {
  const [activeDay, setActiveDay] = useState("mon");

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#F8F6F0",
        minHeight: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      <h2
        style={{ textAlign: "center", color: "#24201D", marginBottom: "20px" }}
      >
        Nutrition Assistant — Меню на неделю
      </h2>

      <DaysTabs activeDay={activeDay} onSelectDay={setActiveDay} />

      <p
        style={{
          textAlign: "center",
          marginTop: "20px",
          color: "#565538",
          fontSize: "18px",
        }}
      >
        Выбранный день: <b>{activeDay.toUpperCase()}</b>
      </p>

      <div style={{ maxWidth: "1100px", margin: "30px auto 0" }}>
        <RecipeCatalog />
      </div>
    </div>
  );
}
