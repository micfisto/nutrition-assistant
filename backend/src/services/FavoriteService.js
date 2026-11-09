import { recipeRepository } from "../infrastructure/repositories/recipeRepository.js";
import { userProfileService } from "./UserProfileService.js";
import { DomainError } from "../domain/errors/DomainError.js";
import { GeneralErrors } from "../domain/errors/GeneralErrors.js";

export class FavoriteService {
  // полные данные рецептов, которые лежат в избранном у пользователя
  async getFavorites(userId) {
    const profile = await userProfileService.getProfileByUserId(userId);
    const recipes = await Promise.all(
      profile.favoriteRecipeIds.map((id) => recipeRepository.findById(id)),
    );
    return recipes.filter(Boolean).map((recipe) => recipe.toJSON());
  }

  async addFavorite(userId, recipeId) {
    const recipe = await recipeRepository.findById(recipeId);
    if (!recipe) throw new DomainError(GeneralErrors.NotFound);

    const profile = await userProfileService.getProfileByUserId(userId);
    const updated = await userProfileService.addFavoriteRecipe(profile.id, recipeId);
    return updated.favoriteRecipeIds;
  }

  async removeFavorite(userId, recipeId) {
    const profile = await userProfileService.getProfileByUserId(userId);
    const updated = await userProfileService.removeFavoriteRecipe(profile.id, recipeId);
    return updated.favoriteRecipeIds;
  }
}

export const favoriteService = new FavoriteService();