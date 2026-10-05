import {DomainError} from "../errors/DomainError.js";
import {RecipeErrors} from "../errors/RecipeErrors.js";
import {Ingredient} from "./Ingredient.js";

export class Recipe {
    #id;
    #title;
    #description;
    #servings;
    #ingredients;
    #updatedAt;

    constructor(id = crypto.randomUUID(), title, description = '', servings = 1, ingredients = [], updatedAt = null) {
        this.#id = id;
        this.#title = this.#validateTitle(title);
        this.#description = typeof description === 'string' ? description.trim() : '';
        this.#servings = this.#validateServings(servings);
        this.#ingredients = this.#validateIngredients(ingredients);
        this.#updatedAt = updatedAt ? new Date(updatedAt) : new Date();
    }

    static create({title, description = '', servings = 1, ingredients = []}) {
        const id = crypto.randomUUID();
        return new Recipe(id, title, description, servings, ingredients)
    }

    static restore({id, title, description, servings, ingredients, updatedAt}) {
        if (!id)
            throw new DomainError(RecipeErrors.IdRequired);

        const restoredIngredients = Array.isArray(ingredients)
            ? ingredients.map(item => ({
                ingredient: item.ingredient instanceof Ingredient
                    ? item.ingredient
                    : Ingredient.restore(item.ingredient),
                amountInGrams: item.amountInGrams
            })) : ingredients;

        return new Recipe(id, title, description, servings, restoredIngredients, updatedAt)
    }

    get id() {
        return this.#id;
    }

    get title() {
        return this.#title;
    }

    get description() {
        return this.#description;
    }

    get servings() {
        return this.#servings;
    }

    get ingredients() {
        return this.#ingredients.map(i => ({ingredient: i.ingredient, amountInGrams: i.amountInGrams}));
    }

    get updatedAt() {
        return new Date(this.#updatedAt);
    }

    get totalCalories() {
        const total = this.#ingredients.reduce((sum, item) => {
            return sum + (item.ingredient.caloriesPer100g * (item.amountInGrams / 100));
        }, 0);

        return Math.round(total);
    }

    get totalProteins() {
        const total = this.#ingredients.reduce((sum, item) => {
            return sum + (item.ingredient.proteinsPer100g * (item.amountInGrams / 100));
        }, 0);

        return Number(total.toFixed(1));
    }

    get totalFats() {
        const total = this.#ingredients.reduce((sum, item) => {
            return sum + (item.ingredient.fatsPer100g * (item.amountInGrams / 100));
        }, 0);

        return Number(total.toFixed(1));
    }

    get totalCarbs() {
        const total = this.#ingredients.reduce((sum, item) => {
            return sum + (item.ingredient.carbsPer100g * (item.amountInGrams / 100));
        }, 0);

        return Number(total.toFixed(1));
    }

    #touch() {
        this.#updatedAt = new Date();
    }

    changeTitle(newTitle) {
        this.#title = this.#validateTitle(newTitle);
        this.#touch();
    }

    changeDescription(newDescription) {
        this.#description = typeof newDescription === 'string' ? newDescription.trim() : '';
        this.#touch();
    }

    changeServings(newServings) {
        this.#servings = this.#validateServings(newServings);
        this.#touch();
    }

    addIngredient(ingredient, amountInGrams) {
        this.#validateIngredient(ingredient, amountInGrams);

        const existingIndex = this.#ingredients.findIndex(i => i.ingredient.id === ingredient.id);

        if (existingIndex !== -1) {
            const updatedAmount = this.#ingredients[existingIndex].amountInGrams + amountInGrams;
            this.#ingredients[existingIndex] = { ingredient, amountInGrams: updatedAmount };
        } else {
            this.#ingredients.push({ ingredient, amountInGrams });
        }

        this.#touch();
    }

    removeIngredient(ingredientId) {
        this.#ingredients = this.#ingredients.filter(i => i.ingredient.id !== ingredientId);
        this.#touch();
    }

    #validateTitle(title) {
        if (!title || typeof title !== 'string' || !title.trim())
            throw new DomainError(RecipeErrors.TitleEmpty);

        const trimmedTitle = title.trim().replace(/\s+/g, ' ');
        if (trimmedTitle.length < 2)
            throw new DomainError(RecipeErrors.TitleTooShort);
        if (trimmedTitle.length > 100)
            throw new DomainError(RecipeErrors.TitleTooLong);

        return trimmedTitle;
    }

    #validateServings(servings) {
        if (typeof servings !== 'number' || isNaN(servings) || servings <= 0)
            throw new DomainError(RecipeErrors.InvalidServings);

        return servings;
    }

    #validateIngredient(ingredient, amountInGrams) {
        if (!(ingredient instanceof Ingredient))
            throw new DomainError(RecipeErrors.InvalidIngredient);

        if (typeof amountInGrams !== 'number' || isNaN(amountInGrams) || amountInGrams <= 0)
            throw new DomainError(RecipeErrors.InvalidAmount);
    }

    #validateIngredients(ingredients) {
        if (!Array.isArray(ingredients))
            throw new DomainError(RecipeErrors.ItemsEmpty);

        ingredients.forEach(i => this.#validateIngredient(i.ingredient, i.amountInGrams));
        return ingredients;
    }
}