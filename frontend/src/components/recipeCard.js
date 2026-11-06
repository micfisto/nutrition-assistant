const EMOJI = {
  "rec-oatmeal": "🥣",
  "rec-omelette": "🍳",
  "rec-chicken-rice": "🍗",
  "rec-salmon": "🐟",
  "rec-yogurt": "🍌",
};

export function createRecipeCard(recipe) {
  const n = recipe.nutrientsPerServing;

  const card = document.createElement("div");
  card.className = "recipe-card";

  const image = document.createElement("div");
  image.className = "recipe-card__image";
  if (recipe.imageUrl) {
    const img = document.createElement("img");
    img.src = recipe.imageUrl;
    img.alt = recipe.title;
    image.appendChild(img);
  } else {
    image.textContent = EMOJI[recipe.id] || "🍽️";
  }

  const body = document.createElement("div");
  body.className = "recipe-card__body";
  body.innerHTML = `
    <h3 class="recipe-card__title"></h3>
    <p class="recipe-card__desc"></p>
    <div class="recipe-card__kcal">${n.calories} ккал</div>
    <div class="recipe-card__macros">
      <span>Б ${n.protein}</span>
      <span>Ж ${n.fat}</span>
      <span>У ${n.carbs}</span>
    </div>
  `;
  body.querySelector(".recipe-card__title").textContent = recipe.title;
  body.querySelector(".recipe-card__desc").textContent = recipe.description;

  card.append(image, body);
  return card;
}
