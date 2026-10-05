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
    #updatedAt;

    constructor(id, userId, birthDate, weight, height, activityLevel = ActivityLevel.MODERATE, goal = GoalType.MAINTAIN) {
        if (!userId)
            throw new DomainError(UserProfileErrors.ProfileUserIdEmpty);

        this.#id = id || crypto.randomUUID();
        this.#userId = userId;
        this.#birthDate = this.#validateBirthDate(birthDate);
        this.#weight = this.#validateWeight(weight);
        this.#height = this.#validateHeight(height);
        this.#activityLevel = activityLevel;
        this.#goal = goal;
        this.#touch();
    }

    static create({
                      userId,
                      birthDate,
                      weight,
                      height,
                      activityLevel = ActivityLevel.MODERATE,
                      goal = GoalType.MAINTAIN
                  }) {
        const id = crypto.randomUUID();
        return new UserProfile(id, userId, birthDate, weight, height, activityLevel, goal);
    }

    static restore({id, userId, birthDate, weight, height, activityLevel, goal, updatedAt}) {
        return new UserProfile(id, userId, birthDate, weight, height, activityLevel, goal), updatedAt;
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

    get updatedAt() {
        return this.#updatedAt;
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
}