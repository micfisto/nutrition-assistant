import { InfrastructureError } from "../../domain/errors/InfrastructureError.js";

/**
 * Комплексная проверка доступности слоя данных.
 * @returns {Promise<{ok: boolean, driver: string, recipesCount?: number, ingredientsCount?: number, error?: string}>}
 */
export async function checkDatabase() {
  const driver = process.env.DB_DRIVER || "memory";
  try {
    const { recipeService } = await import("../../services/RecipeService.js");
    const recipes = await recipeService.getRecipes();

    let ingredients = [];
    try {
      const { ingredientService } = await import("../../services/IngredientService.js");
      ingredients = await ingredientService.getIngredients();
    } catch {
      /* ingredientService недоступен, игнорируем */
    }

    return {
      ok: true,
      driver,
      recipesCount: recipes.length,
      ingredientsCount: ingredients.length,
    };
  } catch (err) {
    return {
      ok: false,
      driver,
      error: err.message,
    };
  }
}