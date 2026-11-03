import React, { useEffect, useState } from "react";
import { fetchRecipes } from "../services/recipesApi";
import RecipeCard from "./RecipeCard";
import "../styles/RecipeCatalog.css";

export default function RecipeCatalog() {
  const [recipes, setRecipes] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    fetchRecipes({ sortBy, order })
      .then(setRecipes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [sortBy, order]);

  return (
    <section className="recipe-catalog">
      <div className="recipe-catalog__controls">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Без сортировки</option>
          <option value="calories">Калории</option>
          <option value="proteins">Белки</option>
          <option value="fats">Жиры</option>
          <option value="carbs">Углеводы</option>
        </select>

        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">По возрастанию</option>
          <option value="desc">По убыванию</option>
        </select>
      </div>

      {loading && <p>Загрузка...</p>}
      {error && <p>Не удалось загрузить рецепты: {error}</p>}

      <div className="recipe-catalog__list">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}
