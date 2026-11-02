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
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(recipe) {
    return recipe.toJSON();
  }
}
