import { Recipe } from "../../domain/entities/Recipe.js";

export class RecipeMapper {
  static toDomain(raw) {
    if (!raw) return null;

    return Recipe.restore({
      id: raw.id,
      title: raw.title,
      description: raw.description,
      servings: raw.servings,
      ingredients: raw.ingredients,
      imageUrl: raw.image_url || raw.imageUrl,
      mealTypes: raw.meal_types || raw.mealTypes,
      cookingMethod: raw.cooking_method || raw.cookingMethod,
      updatedAt: raw.updated_at || raw.updatedAt,
    });
  }

  static toPersistence(recipe) {
    const json = recipe.toJSON();
    return {
      id: json.id,
      title: json.title,
      description: json.description,
      servings: json.servings,
      ingredients: json.ingredients,
      image_url: json.imageUrl,
      meal_types: json.mealTypes,
      cooking_method: json.cookingMethod,
      updated_at: json.updatedAt
    };
  }
}
