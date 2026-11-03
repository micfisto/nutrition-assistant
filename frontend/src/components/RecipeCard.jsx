import React from "react";
import "../styles/RecipeCard.css";

export default function RecipeCard({ recipe }) {
  const n = recipe.nutrientsPerServing;

  return (
    <div className="recipe-card">
      <h3 className="recipe-card__title">{recipe.title}</h3>
      <p className="recipe-card__desc">{recipe.description}</p>
      <div className="recipe-card__nutrients">
        <span>{n.calories} ккал</span>
        <span>Б {n.protein}</span>
        <span>Ж {n.fat}</span>
        <span>У {n.carbs}</span>
      </div>
    </div>
  );
}
