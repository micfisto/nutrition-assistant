import { UserProfile } from "../domain/entities/UserProfile.js";
import { userProfileRepository } from "../infrastructure/repositories/UserProfileRepository.js";
import { DomainError } from "../domain/errors/DomainError.js";
import { UserProfileErrors } from "../domain/errors/UserProfileErrors.js";

export class UserProfileService {
  async createUserProfile({ userId, birthDate, weight, height, activityLevel, goal, allergenIds, favoriteRecipeIds }) {
    const profile = UserProfile.create({
      userId,
      birthDate,
      weight,
      height,
      activityLevel,
      goal,
      allergenIds,
      favoriteRecipeIds
    });

    await userProfileRepository.save(profile);
    return profile;
  }

  async getProfileById(id) {
    const profile = await userProfileRepository.findById(id);
    if (!profile) {
      throw new DomainError(UserProfileErrors.ProfileNotFound);
    }
    return profile;
  }

  async getProfileByUserId(userId) {
    const profile = await userProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new DomainError(UserProfileErrors.ProfileNotFound);
    }
    return profile;
  }

   async updateProfile(id, updates) {
    const current = await this.getProfileById(id);

    const draft = UserProfile.restore(current.toJSON());

    if (updates.birthDate !== undefined) {
      draft.changeBirthDate(updates.birthDate);
    }
    if (updates.weight !== undefined) {
      draft.changeWeight(updates.weight);
    }
    if (updates.height !== undefined) {
      draft.changeHeight(updates.height);
    }
    if (updates.activityLevel !== undefined) {
      draft.changeActivityLevel(updates.activityLevel);
    }
    if (updates.goal !== undefined) {
      draft.changeGoal(updates.goal);
    }
    if (updates.allergenIds !== undefined) {
      draft.changeAllergens(updates.allergenIds);
    }

    const targets = {};
    if (updates.targetCalories !== undefined) targets.calories = updates.targetCalories;
    if (updates.targetProteins !== undefined) targets.proteins = updates.targetProteins;
    if (updates.targetFats !== undefined) targets.fats = updates.targetFats;
    if (updates.targetCarbs !== undefined) targets.carbs = updates.targetCarbs;
    if (Object.keys(targets).length > 0) {
      draft.changeTargets(targets);
    }

    await userProfileRepository.save(draft);
    return draft;
  }

  async addAllergen(id, allergenId) {
    const profile = await this.getProfileById(id);
    profile.addAllergen(allergenId);
    await userProfileRepository.save(profile);
    return profile;
  }

  async removeAllergen(id, allergenId) {
    const profile = await this.getProfileById(id);
    profile.removeAllergen(allergenId);
    await userProfileRepository.save(profile);
    return profile;
  }

  async addFavoriteRecipe(id, recipeId) {
    const profile = await this.getProfileById(id);
    profile.addFavoriteRecipe(recipeId);
    await userProfileRepository.save(profile);
    return profile;
  }

  async removeFavoriteRecipe(id, recipeId) {
    const profile = await this.getProfileById(id);
    profile.removeFavoriteRecipe(recipeId);
    await userProfileRepository.save(profile);
    return profile;
  }

  async deleteProfile(id) {
    await userProfileRepository.delete(id);
  }
}

export const userProfileService = new UserProfileService();