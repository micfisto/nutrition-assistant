import { recipeService } from "../../services/RecipeService.js";
import { GeneralErrors } from "../../domain/errors/GeneralErrors.js";

function handleError(res, err) {
  if (err.code === GeneralErrors.NotFound)
    return res.status(404).json({ error: err.code });

  if (err.name === "DomainError")
    return res.status(400).json({ error: err.code });

  console.error(err);
  return res.status(500).json({ error: GeneralErrors.InternalError });
}

export async function getRecipes(req, res) {
  try {
    const {
      sortBy,
      order,
      excludeIngredients,
      excludeWords,
      search,
      mealType,
    } = req.query;

    const recipes = await recipeService.getRecipes({
      sortBy,
      order,
      search: search || "",
      mealType: mealType || "",
      excludeIngredientIds: excludeIngredients
        ? excludeIngredients.split(",")
        : [],
      excludeWords: excludeWords
        ? String(excludeWords)
            .split(",")
            .map((w) => w.trim())
            .filter(Boolean)
        : [],
    });

    res.json(recipes);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getRecipeById(req, res) {
  try {
    const recipe = await recipeService.getRecipeById(req.params.id);
    res.json(recipe);
  } catch (err) {
    handleError(res, err);
  }
}
