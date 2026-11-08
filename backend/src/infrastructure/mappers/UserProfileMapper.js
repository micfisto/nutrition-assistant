export class UserProfileMapper {
  static toDomain(raw) {
    if (!raw) return null;

    return {
      id: raw.id,
      userId: raw.userId,
      birthDate: raw.birthDate,
      weight: raw.weight,
      height: raw.height,
      activityLevel: raw.activityLevel,
      goal: raw.goal,
      allergenIds: raw.allergenIds || [],
      favoriteRecipeIds: raw.favoriteRecipeIds || [],
      updatedAt: raw.updatedAt
    };
  }

  static toPersistence(profile) {
    return {
      id: profile.id,
      userId: profile.userId,
      birthDate: profile.birthDate,
      weight: profile.weight,
      height: profile.height,
      activityLevel: profile.activityLevel,
      goal: profile.goal,
      allergenIds: profile.allergenIds,
      favoriteRecipeIds: profile.favoriteRecipeIds,
      updatedAt: profile.updatedAt
    };
  }
}
