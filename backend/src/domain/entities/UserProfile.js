import {ActivityLevel} from "../enums/ActivityLevel.js";
import {GoalType} from "../enums/GoalType.js";
import {DomainError} from "../errors/DomainError.js";
import {UserProfileErrors} from "../errors/UserProfileErrors.js";

export class UserProfile {
    #id;
    #userId;
    #birthDate;
    #weight;
    #height;
    #activityLevel;
    #goal;
    #allergenIds
    /** IngredientIds []*/
    #favoriteRecipeIds;
    /** RecipeIds []*/
    #updatedAt;

    constructor(id, userId, birthDate, weight, height, activityLevel = ActivityLevel.MODERATE, goal = GoalType.MAINTAIN, allergenIds = [], favoriteRecipeIds = [], updatedAt = null) {
        if (!userId)
            throw new DomainError(UserProfileErrors.ProfileUserIdEmpty);

        this.#id = id || crypto.randomUUID();
        this.#userId = userId;
        this.#birthDate = this.#validateBirthDate(birthDate);
        this.#weight = this.#validateWeight(weight);
        this.#height = this.#validateHeight(height);
        this.#activityLevel = activityLevel;
        this.#goal = goal;
        this.#allergenIds = Array.isArray(allergenIds) ? allergenIds : [];
        this.#favoriteRecipeIds = Array.isArray(favoriteRecipeIds) ? favoriteRecipeIds : [];
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
                      favoriteRecipeIds = []
                  }) {
        const id = crypto.randomUUID();
        return new UserProfile(id, userId, birthDate, weight, height, activityLevel, goal, allergenIds, favoriteRecipeIds);
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
                       updatedAt
                   }) {
        if (!id)
            throw new DomainError(UserProfileErrors.ProfileIdEmpty);

        return new UserProfile(id, userId, birthDate, weight, height, activityLevel, goal, allergenIds, favoriteRecipeIds, updatedAt);
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
        this.#activityLevel = activityLevel;
        this.#touch();
    }

    changeGoal(goal) {
        this.#goal = goal;
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
            updatedAt: this.#updatedAt
        };
    }
}