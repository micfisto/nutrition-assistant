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
    const profile = await this.getProfileById(id);

    if (updates.birthDate !== undefined) {
      profile.changeBirthDate(updates.birthDate);
    }
    if (updates.weight !== undefined) {
      profile.changeWeight(updates.weight);
    }
    if (updates.height !== undefined) {
      profile.changeHeight(updates.height);
    }
    if (updates.activityLevel !== undefined) {
      profile.changeActivityLevel(updates.activityLevel);
    }
    if (updates.goal !== undefined) {
      profile.changeGoal(updates.goal);
    }

    await userProfileRepository.save(profile);
    return profile;
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