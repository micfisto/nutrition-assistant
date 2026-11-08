import "./styles/Calculator.css";
import "./styles/Allergens.css";
import { initCalculator } from "./components/calculator.js";
import { initGoalSlider } from "./components/goalSlider.js";
import { initAllergens } from "./components/allergens.js";

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

const goalsSection = document.getElementById("goals");
if (goalsSection) {
  const section = document.createElement("section");
  section.id = "allergens";
  section.className = "calc-section";
  section.innerHTML =
    '<h2>Пищевые ограничения</h2><div id="allergens-root"></div>';
  goalsSection.after(section);
  initAllergens(section.querySelector("#allergens-root"));
}