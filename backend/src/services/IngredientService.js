import { recipeRepository } from "../infrastructure/repositories/recipeRepository.js";

export class IngredientService {
  // ингредиенты берутся из рецептов, дубликаты убираются по id
  async getIngredients() {
    const recipes = await recipeRepository.findAll();

    const unique = new Map();
    for (const recipe of recipes) {
      for (const { ingredient } of recipe.ingredients) {
        if (!unique.has(ingredient.id)) {
          unique.set(ingredient.id, ingredient);
        }
      }
    }

    return [...unique.values()]
      .sort((a, b) => a.name.localeCompare(b.name, "ru"))
      .map((ingredient) => ingredient.toJSON());
  }
}

export const ingredientService = new IngredientService();