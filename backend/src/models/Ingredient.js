import {DomainError} from "../errors/DomainError.js";
import {IngredientErrors} from "../errors/IngredientErrors.js";

export class Ingredient {
    #id;
    #name;
    #caloriesPer100g;
    #proteinsPer100g;
    #fatsPer100g;
    #carbsPer100g;
    #updatedAt;

    constructor(id, name, caloriesPer100g=0, proteinsPer100g=0, fatsPer100g=0, carbsPer100g=0, updatedAt = null) {
        this.#id = id;
        this.#name = this.#validateName(name);
        this.#caloriesPer100g = this.#validateNutrient(caloriesPer100g, IngredientErrors.InvalidCalories);
        this.#proteinsPer100g = this.#validateNutrient(proteinsPer100g, IngredientErrors.InvalidNutrient);
        this.#fatsPer100g = this.#validateNutrient(fatsPer100g, IngredientErrors.InvalidNutrient);
        this.#carbsPer100g = this.#validateNutrient(carbsPer100g, IngredientErrors.InvalidNutrient);
        this.#updatedAt = updatedAt ? new Date(updatedAt) : new Date();
    }

    static create({name, caloriesPer100g, proteinsPer100g, fatsPer100g, carbsPer100g}) {
        const id = crypto.randomUUID();
        return new Ingredient(id, name, caloriesPer100g, proteinsPer100g, fatsPer100g, carbsPer100g)
    }

    static restore({id, name, caloriesPer100g, proteinsPer100g, fatsPer100g, carbsPer100g, updatedAt}) {
        if (!id)
            throw new DomainError(IngredientErrors.IdRequired);
        return new Ingredient(id, name, caloriesPer100g, proteinsPer100g, fatsPer100g, carbsPer100g, updatedAt)
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get caloriesPer100g() {
        return this.#caloriesPer100g;
    }

    get proteinsPer100g() {
        return this.#proteinsPer100g;
    }

    get fatsPer100g() {
        return this.#fatsPer100g;
    }

    get carbsPer100g() {
        return this.#carbsPer100g;
    }

    get updatedAt() {
        return new Date(this.#updatedAt);
    }

    #touch() {
        this.#updatedAt = new Date();
    }

    changeName(newName) {
        this.#name = this.#validateName(newName);
        this.#touch();
    }

    changeCalories(newCaloriesPer100g) {
        this.#caloriesPer100g = this.#validateNutrient(newCaloriesPer100g, IngredientErrors.InvalidCalories);
        this.#touch();
    }

    changeProteins(newProteinsPer100g) {
        this.#proteinsPer100g = this.#validateNutrient(newProteinsPer100g, IngredientErrors.InvalidNutrient);
        this.#touch();
    }

    changeFats(newFatsPer100g) {
        this.#fatsPer100g = this.#validateNutrient(newFatsPer100g, IngredientErrors.InvalidNutrient);
        this.#touch();
    }

    changeCarbs(newCarbsPer100g) {
        this.#carbsPer100g = this.#validateNutrient(newCarbsPer100g, IngredientErrors.InvalidNutrient);
        this.#touch();
    }

    #validateNutrient(val, errorKey) {
        if (typeof val !== 'number' || isNaN(val) || val < 0)
            throw new DomainError(errorKey);
        return val;
    }

    #validateName(name) {
        if (!name || typeof name !== 'string' || !name.trim())
            throw new DomainError(IngredientErrors.NameEmpty);

        const trimmedName = name.trim().replace(/\s+/g, ' ');
        if (trimmedName.length < 1)
            throw new DomainError(IngredientErrors.NameTooShort);
        if (trimmedName.length > 50)
            throw new DomainError(IngredientErrors.NameTooLong);

        return trimmedName;
    }
}