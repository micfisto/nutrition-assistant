import {ActivityLevel} from "../enums/ActivityLevel.js";
import {GoalType} from "../enums/GoalType.js";
import {DomainError} from "../errors/DomainError.js";
import {UserProfileErrors} from "../errors/UserProfileErrors.js";
import {Validator} from "../helpers/Validator.js";

export class UserProfile {
    #id;
    #userId;
    #birthDate;
    #weight;
    #height;
    #activityLevel;
    #goal;
    #allergenIds;
    /** IngredientIds []*/
    #favoriteRecipeIds;
    /** RecipeIds []*/
    #targetCalories;
    #targetProteins;
    #targetFats;
    #targetCarbs;
    #updatedAt;

    constructor(id, userId, birthDate, weight, height, activityLevel = ActivityLevel.MODERATE, goal = GoalType.MAINTAIN, allergenIds = [], favoriteRecipeIds = [], updatedAt = null, targets = {}) {
        if (!userId)
            throw new DomainError(UserProfileErrors.ProfileUserIdEmpty);

        this.#id = id || crypto.randomUUID();
        this.#userId = userId;
        this.#birthDate = this.#validateBirthDate(birthDate);
        this.#weight = this.#validateWeight(weight);
        this.#height = this.#validateHeight(height);
        this.#activityLevel =  this.#validateActivityLevel(activityLevel);
        this.#goal = this.#validateGoal(goal);
        this.#allergenIds = Array.isArray(allergenIds) ? allergenIds : [];
        this.#favoriteRecipeIds = Array.isArray(favoriteRecipeIds) ? favoriteRecipeIds : [];
        this.#targetCalories = this.#validateTarget(targets.calories, {min: 500, max: 10000});
        this.#targetProteins = this.#validateTarget(targets.proteins, {min: 0, max: 1000});
        this.#targetFats = this.#validateTarget(targets.fats, {min: 0, max: 1000});
        this.#targetCarbs = this.#validateTarget(targets.carbs, {min: 0, max: 2000});
        this.#updatedAt = updatedAt ? new Date(updatedAt) : new Date();
    }

    static create({
                      userId,
                      birthDate,
                      weight,
                      height,
                      activityLevel = ActivityLevel.MODERATE,
                      goal = GoalType.MAINTAIN,
                      allergenIds = [],
                      favoriteRecipeIds = [],
                      targetCalories = null,
                      targetProteins = null,
                      targetFats = null,
                      targetCarbs = null
                  }) {
        const id = crypto.randomUUID();
        return new UserProfile(id, userId, birthDate, weight, height, activityLevel, goal, allergenIds, favoriteRecipeIds, null, {
            calories: targetCalories,
            proteins: targetProteins,
            fats: targetFats,
            carbs: targetCarbs
        });
    }

    static restore({
                       id,
                       userId,
                       birthDate,
                       weight,
                       height,
                       activityLevel,
                       goal,
                       allergenIds = [],
                       favoriteRecipeIds = [],
                       targetCalories = null,
                       targetProteins = null,
                       targetFats = null,
                       targetCarbs = null,
                       updatedAt
                   }) {
        if (!id)
            throw new DomainError(UserProfileErrors.ProfileIdEmpty);

        return new UserProfile(id, userId, birthDate, weight, height, activityLevel, goal, allergenIds, favoriteRecipeIds, updatedAt, {
            calories: targetCalories,
            proteins: targetProteins,
            fats: targetFats,
            carbs: targetCarbs
        });
    }

    get id() {
        return this.#id;
    }

    get userId() {
        return this.#userId;
    }

    get birthDate() {
        return new Date(this.#birthDate);
    }

    get weight() {
        return this.#weight;
    }

    get height() {
        return this.#height;
    }

    get activityLevel() {
        return this.#activityLevel;
    }

    get goal() {
        return this.#goal;
    }

    get allergenIds() {
        return [...this.#allergenIds];
    }

    get favoriteRecipeIds() {
        return [...this.#favoriteRecipeIds];
    }

    get targetCalories() {
        return this.#targetCalories;
    }

    get targetProteins() {
        return this.#targetProteins;
    }

    get targetFats() {
        return this.#targetFats;
    }

    get targetCarbs() {
        return this.#targetCarbs;
    }

    get updatedAt() {
        return new Date(this.#updatedAt);
    }

    get age() {
        const today = new Date();
        let age = today.getFullYear() - this.#birthDate.getFullYear();
        const monthDiff = today.getMonth() - this.#birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.#birthDate.getDate())) {
            age--;
        }
        return age;
    }

    #touch() {
        this.#updatedAt = new Date();
    }

    changeBirthDate(birthDate) {
        this.#birthDate = this.#validateBirthDate(birthDate);
        this.#touch();
    }

    changeWeight(weight) {
        this.#weight = this.#validateWeight(weight);
        this.#touch();
    }

    changeHeight(height) {
        this.#height = this.#validateHeight(height);
        this.#touch();
    }

    changeActivityLevel(activityLevel) {
        this.#activityLevel = this.#validateActivityLevel(activityLevel);
        this.#touch();
    }

    changeGoal(goal) {
        this.#goal =this.#validateGoal(goal);
        this.#touch();
    }

    changeTargets({
                      calories = this.#targetCalories,
                      proteins = this.#targetProteins,
                      fats = this.#targetFats,
                      carbs = this.#targetCarbs
                  } = {}) {
        this.#targetCalories = this.#validateTarget(calories, {min: 500, max: 10000});
        this.#targetProteins = this.#validateTarget(proteins, {min: 0, max: 1000});
        this.#targetFats = this.#validateTarget(fats, {min: 0, max: 1000});
        this.#targetCarbs = this.#validateTarget(carbs, {min: 0, max: 2000});
        this.#touch();
    }

    changeAllergens(allergenIds) {
        if (!Array.isArray(allergenIds) || allergenIds.some(id => typeof id !== 'string' || !id.trim()))
            throw new DomainError(UserProfileErrors.InvalidAllergens);

        this.#allergenIds = [...new Set(allergenIds.map(id => id.trim()))];
        this.#touch();
    }

    addAllergen(allergenId) {
        if (!this.#allergenIds.includes(allergenId)) {
            this.#allergenIds.push(allergenId);
            this.#touch();
        }
    }

    removeAllergen(allergenId) {
        this.#allergenIds = this.#allergenIds.filter(id => id !== allergenId);
        this.#touch();
    }

    addFavoriteRecipe(favoriteRecipeId) {
        if (!this.#favoriteRecipeIds.includes(favoriteRecipeId)) {
            this.#favoriteRecipeIds.push(favoriteRecipeId);
            this.#touch();
        }
    }

    removeFavoriteRecipe(favoriteRecipeId) {
        this.#favoriteRecipeIds = this.#favoriteRecipeIds.filter(id => id !== favoriteRecipeId);
        this.#touch();
    }

    #validateBirthDate(dateInput) {
        if (dateInput === null || dateInput === undefined)
            throw new DomainError(UserProfileErrors.InvalidBirthDate);

        const parsedDate = new Date(dateInput);

        if (isNaN(parsedDate.getTime()))
            throw new DomainError(UserProfileErrors.InvalidBirthDate);

        const today = new Date();
        if (parsedDate > today)
            throw new DomainError(UserProfileErrors.BirthDateInFuture);

        let tempAge = today.getFullYear() - parsedDate.getFullYear();
        const monthDiff = today.getMonth() - parsedDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < parsedDate.getDate())) {
            tempAge--;
        }

        if (tempAge < 12 || tempAge > 120)
            throw new DomainError(UserProfileErrors.InvalidAge);

        return parsedDate;
    }

    #validateWeight(weight) {
        if (typeof weight !== 'number' || weight < 30 || weight > 300)
            throw new DomainError(UserProfileErrors.InvalidWeight);
        return weight;
    }

    #validateHeight(height) {
        if (typeof height !== 'number' || height < 100 || height > 250)
            throw new DomainError(UserProfileErrors.InvalidHeight);
        return height;
    }

    #validateActivityLevel(activityLevel) {
        return Validator.enum(activityLevel, ActivityLevel, UserProfileErrors.InvalidActivityLevel);
    }

    #validateGoal(goal) {
        return Validator.enum(goal, GoalType, UserProfileErrors.InvalidGoal);
    }

    #validateTarget(value, {min, max}) {
        if (value === null || value === undefined)
            return null;
        return Validator.number(value, {min, max, errorKey: UserProfileErrors.InvalidTargets});
    }

    toJSON() {
        return {
            id: this.#id,
            userId: this.#userId,
            birthDate: this.#birthDate,
            weight: this.#weight,
            height: this.#height,
            activityLevel: this.#activityLevel,
            goal: this.#goal,
            allergenIds: this.#allergenIds,
            favoriteRecipeIds: this.#favoriteRecipeIds,
            targetCalories: this.#targetCalories,
            targetProteins: this.#targetProteins,
            targetFats: this.#targetFats,
            targetCarbs: this.#targetCarbs,
            updatedAt: this.#updatedAt
        };
    }
}