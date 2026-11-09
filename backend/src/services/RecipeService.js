import { recipeRepository } from "../infrastructure/repositories/recipeRepository.js";
import { DomainError } from "../domain/errors/DomainError.js";
import { GeneralErrors } from "../domain/errors/GeneralErrors.js";
import { matchesExcluded } from "../domain/helpers/FoodMatcher.js";

// ключ из запроса -> поле в recipe.nutrientsPerServing
const SORT_FIELDS = {
  calories: "calories",
  proteins: "protein",
  fats: "fat",
  carbs: "carbs",
};

function getMealTypes(recipe) {
  return recipe.mealTypes ?? recipe.toJSON().mealTypes ?? [];
}

export class RecipeService {
  async getRecipes({
    sortBy,
    order = "asc",
    excludeIngredientIds = [],
    excludeWords = [],
    search = "",
    mealType = "",
  } = {}) {
    let recipes = await recipeRepository.findAll();

    if (excludeIngredientIds.length > 0) {
      recipes = recipes.filter(
        (recipe) =>
          !recipe.ingredients.some((i) =>
            excludeIngredientIds.includes(i.ingredient.id),
          ),
      );
    }

    if (excludeWords.length > 0) {
      recipes = recipes.filter(
        (recipe) =>
          !recipe.ingredients.some((i) =>
            matchesExcluded(i.ingredient.name, excludeWords),
          ),
      );
    }

    const query = search.trim().toLowerCase();
    if (query) {
      recipes = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(query),
      );
    }

    if (mealType) {
      recipes = recipes.filter((recipe) =>
        getMealTypes(recipe).includes(mealType),
      );
    }

    if (sortBy) {
      const field = SORT_FIELDS[sortBy];
      if (!field) throw new DomainError("INVALID_SORT_PARAMETER");

      const direction = order === "desc" ? -1 : 1;
      recipes.sort(
        (a, b) =>
          (a.nutrientsPerServing[field] - b.nutrientsPerServing[field]) *
          direction,
      );
    }

    return recipes.map((recipe) => recipe.toJSON());
  }

  async getRecipeById(id) {
    const recipe = await recipeRepository.findById(id);
    if (!recipe) throw new DomainError(GeneralErrors.NotFound);

    return recipe.toJSON();
  }
}

export const recipeService = new RecipeService();
