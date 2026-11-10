import bcrypt from "bcryptjs";
import { User } from "../../domain/entities/User.js";
import { UserRole } from "../../domain/enums/UserRole.js";
import { UserStatus } from "../../domain/enums/UserStatus.js";
import { UserProfile } from "../../domain/entities/UserProfile.js";
import { ActivityLevel } from "../../domain/enums/ActivityLevel.js";
import { GoalType } from "../../domain/enums/GoalType.js";

/**
 * Тестовые пользователи для разработки и автотестов.
 * Пароль: testpass123 (для всех пользователей)
 *
 * role    — UserRole.USER / UserRole.ADMIN
 * status  — UserStatus.ACTIVE / DEACTIVATED / DELETED
 * goal    — GoalType.LOSE_WEIGHT / MAINTAIN / GAIN_MUSCLE
 * activity — ActivityLevel.SEDENTARY | LIGHT | MODERATE | HIGH | VERY_HIGH
 */
export const TEST_USERS = [
  {
    login: "alice",
    username: "Alice Ivanova",
    email: "alice@example.com",
    password: "testpass123",
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    birthDate: "1995-05-15",
    weight: 62,
    height: 168,
    activityLevel: ActivityLevel.MODERATE,
    goal: GoalType.LOSE_WEIGHT,
    allergenIds: ["ing-egg"],
    favoriteRecipeIds: [],
  },
  {
    login: "bob",
    username: "Bob Petrov",
    email: "bob@example.com",
    password: "testpass123",
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    birthDate: "1988-11-02",
    weight: 85,
    height: 182,
    activityLevel: ActivityLevel.HIGH,
    goal: GoalType.GAIN_MUSCLE,
    allergenIds: [],
    favoriteRecipeIds: ["rec-salmon"],
  },
  {
    login: "admin",
    username: "System Admin",
    email: "admin@nutrition-assistant.local",
    password: "testpass123",
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    birthDate: "1980-01-01",
    weight: 75,
    height: 178,
    activityLevel: ActivityLevel.MODERATE,
    goal: GoalType.MAINTAIN,
    allergenIds: [],
    favoriteRecipeIds: [],
  },
];

export const seedUsers = async (userRepository, userProfileRepository) => {
  const existing = await userRepository.findByLogin("alice");
  if (existing) {
    console.log(`Users already loaded (${TEST_USERS.length}). Skipping seed...`);
    return;
  }

  for (const userData of TEST_USERS) {
    const passwordHash = await bcrypt.hash(userData.password, 10);

    const user = User.create({
      login: userData.login,
      username: userData.username,
      email: userData.email,
      passwordHash,
      role: userData.role,
    });

    await userRepository.save(user);

    const profile = UserProfile.create({
      userId: user.id,
      birthDate: userData.birthDate,
      weight: userData.weight,
      height: userData.height,
      activityLevel: userData.activityLevel,
      goal: userData.goal,
      allergenIds: userData.allergenIds,
      favoriteRecipeIds: userData.favoriteRecipeIds,
    });

    await userProfileRepository.save(profile);
    console.log(`Seeded user: ${user.login} (${user.email})`);
  }
};