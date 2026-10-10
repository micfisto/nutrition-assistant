import {DomainError} from "../errors/DomainError.js";
import {RecipeErrors} from "../errors/RecipeErrors.js";
import {Ingredient} from "./Ingredient.js";
import {Validator} from "../helpers/Validator.js";

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
        return new Recipe(crypto.randomUUID(), title, description, servings, ingredients)
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
            })) : [];

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
        return Number(total.toFixed(1));
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

    get nutrientsPerServing() {
        const servings = this.#servings || 1;
        return {
            calories: Math.round(this.totalCalories / servings),
            protein: Number((this.totalProteins / servings).toFixed(1)),
            fat: Number((this.totalFats / servings).toFixed(1)),
            carbs: Number((this.totalCarbs / servings).toFixed(1))
        };
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
            this.#ingredients[existingIndex] = {ingredient, amountInGrams: updatedAmount};
        } else {
            this.#ingredients.push({ingredient, amountInGrams});
        }

        this.#touch();
    }

    removeIngredient(ingredientId) {
        this.#ingredients = this.#ingredients.filter(i => i.ingredient.id !== ingredientId);
        this.#touch();
    }

    #validateTitle(title) {
        return Validator.string(title, {
            emptyError: RecipeErrors.TitleEmpty,
            minLength: 2,
            shortError: RecipeErrors.TitleTooShort,
            maxLength: 100,
            longError: RecipeErrors.TitleTooLong,
            collapseSpaces: true
        });
    }

    #validateServings(servings) {
        return Validator.number(servings, {min: 0.1, errorKey: RecipeErrors.InvalidServings});
    }


    #validateIngredient(ingredient, amountInGrams) {
        Validator.instanceOf(ingredient, Ingredient, RecipeErrors.InvalidIngredient);
        Validator.number(amountInGrams, {min: 0.1,})
    }

    #validateIngredients(ingredients) {
        if (!Array.isArray(ingredients))
            throw new DomainError(RecipeErrors.ItemsEmpty);

        ingredients.forEach(i => this.#validateIngredient(i.ingredient, i.amountInGrams));
        return ingredients;
    }
}