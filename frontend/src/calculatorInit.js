import "./styles/Calculator.css";
import { initCalculator } from "./components/calculator.js";
import { initGoalSlider } from "./components/goalSlider.js";

function mountSection(id, title) {
  const section = document.getElementById(id);
  if (!section) return null;

  section.classList.remove("slot");
  section.classList.add("calc-section");
  section.innerHTML = `<h2>${title}</h2><div id="${id}-root"></div>`;
  return section.querySelector(`#${id}-root`);
}

const calcRoot = mountSection("calculator", "Калькулятор КБЖУ");
const goalsRoot = mountSection("goals", "Выбор цели");

if (calcRoot && goalsRoot) {
  const calculator = initCalculator(calcRoot);
  initGoalSlider(goalsRoot, (goal) => calculator.setGoal(goal));
}