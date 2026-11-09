let modalEl = null;

function ensureModal() {
  if (modalEl) return modalEl;

  modalEl = document.createElement("div");
  modalEl.className = "modal";
  modalEl.innerHTML = `
    <div class="modal__window" role="dialog" aria-modal="true">
      <button class="modal__close" aria-label="Закрыть">×</button>
      <div class="modal__content"></div>
    </div>
  `;
  document.body.appendChild(modalEl);

  modalEl.addEventListener("click", (e) => {
    if (e.target === modalEl) closeRecipeModal();
  });
  modalEl
    .querySelector(".modal__close")
    .addEventListener("click", closeRecipeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeRecipeModal();
  });

  return modalEl;
}

export function closeRecipeModal() {
  if (modalEl) modalEl.classList.remove("modal--open");
  document.body.style.overflow = "";
}

export function openRecipeModal(recipe) {
  const modal = ensureModal();
  const content = modal.querySelector(".modal__content");
  const n = recipe.nutrientsPerServing;

  content.innerHTML = `
    <h2 class="modal__title"></h2>
    <p class="modal__desc"></p>
    <div class="modal__nutrients">
      <div><b>${n.calories}</b><span>ккал</span></div>
      <div><b>${n.protein}</b><span>белки</span></div>
      <div><b>${n.fat}</b><span>жиры</span></div>
      <div><b>${n.carbs}</b><span>углеводы</span></div>
    </div>
    <p class="modal__note">КБЖУ на 1 порцию. Порций в рецепте: ${recipe.servings}</p>
    <h3>Ингредиенты</h3>
    <ul class="modal__ingredients"></ul>
    <div class="modal__steps"></div>
  `;

  content.querySelector(".modal__title").textContent = recipe.title;
  content.querySelector(".modal__desc").textContent = recipe.description || "";

  const list = content.querySelector(".modal__ingredients");
  recipe.ingredients.forEach((item) => {
    const li = document.createElement("li");
    const name = document.createElement("span");
    name.textContent = item.ingredient.name;
    const grams = document.createElement("span");
    grams.textContent = `${item.amountInGrams} г`;
    li.append(name, grams);
    list.appendChild(li);
  });

  const steps = recipe.instructions || recipe.cookingMethod || recipe.steps;
  if (steps) {
    const box = content.querySelector(".modal__steps");
    const title = document.createElement("h3");
    title.textContent = "Приготовление";
    const text = document.createElement("p");
    text.textContent = Array.isArray(steps) ? steps.join(" ") : steps;
    box.append(title, text);
  }

  modal.classList.add("modal--open");
  document.body.style.overflow = "hidden";
}
