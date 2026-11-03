import React from "react";
import "../styles/RecipeCard.css";

const EMOJI = {
  "rec-oatmeal": "🥣",
  "rec-omelette": "🍳",
  "rec-chicken-rice": "🍗",
  "rec-salmon": "🐟",
  "rec-yogurt": "🍌",
};

export default function RecipeCard({ recipe }) {
  const n = recipe.nutrientsPerServing;

  return (
    <div className="recipe-card">
      <div className="recipe-card__image">{EMOJI[recipe.id] || "🍽️"}</div>
      <div className="recipe-card__body">
        <h3 className="recipe-card__title">{recipe.title}</h3>
        <p className="recipe-card__desc">{recipe.description}</p>
        <div className="recipe-card__kcal">{n.calories} ккал</div>
        <div className="recipe-card__macros">
          <span>Б {n.protein}</span>
          <span>Ж {n.fat}</span>
          <span>У {n.carbs}</span>
        </div>
      </div>
    </div>
  );
}
