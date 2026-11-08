import { recipeRepository } from "../infrastructure/repositories/recipeRepository.js";
import { DomainError } from "../domain/errors/DomainError.js";
import { GeneralErrors } from "../domain/errors/GeneralErrors.js";
import { MEAL_DISTRIBUTION, MEAL_TYPES } from "../domain/enums/MealConstants.js";

export class MenuService {
  async generateDailyMenu({ targetCalories, allergenIds = [] } = {}) {
    if (!targetCalories || targetCalories < 500) {
      throw new DomainError('INVALID_TARGET_CALORIES');
    }

    const allRecipes = await recipeRepository.findAll();

    const filteredRecipes = this.#filterByAllergens(allRecipes, allergenIds);

    const menu = {};

    for (const mealType of MEAL_TYPES) {
      const targetMealCalories = targetCalories * MEAL_DISTRIBUTION[mealType];
      const recipe = this.#selectBestRecipe(filteredRecipes, mealType, targetMealCalories);
      
      if (recipe) {
        menu[mealType] = recipe.toJSON();
      }
    }

    if (Object.keys(menu).length === 0) {
      throw new DomainError('NO_SUITABLE_RECIPES');
    }

    return menu;
  }

  #filterByAllergens(recipes, allergenIds) {
    if (!allergenIds || allergenIds.length === 0) {
      return recipes;
    }

    return recipes.filter(recipe => {
      const recipeIngredientIds = recipe.ingredients.map(i => i.ingredient.id);
      return !allergenIds.some(allergenId => recipeIngredientIds.includes(allergenId));
    });
  }

  #selectBestRecipe(recipes, mealType, targetCalories) {
    const mealTypeRecipes = recipes.filter(recipe => 
      recipe.mealTypes.includes(mealType)
    );

    if (mealTypeRecipes.length === 0) {
      const anyRecipes = recipes.filter(recipe => 
        recipe.mealTypes.length === 0
      );
      return this.#findClosestCalorieMatch(anyRecipes, targetCalories);
    }

    return this.#findClosestCalorieMatch(mealTypeRecipes, targetCalories);
  }

  #findClosestCalorieMatch(recipes, targetCalories) {
    if (recipes.length === 0) {
      return null;
    }

    return recipes.reduce((best, current) => {
      const currentDiff = Math.abs(current.nutrientsPerServing.calories - targetCalories);
      const bestDiff = Math.abs(best.nutrientsPerServing.calories - targetCalories);
      
      return currentDiff < bestDiff ? current : best;
    });
  }
}

export const menuService = new MenuService();
