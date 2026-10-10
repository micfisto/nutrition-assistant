import {DomainError} from "../errors/DomainError.js";
import {MealErrors} from "../errors/MealErrors.js";
import {Recipe} from "./Recipe.js";

export class Meal {
    #id;
    #name;
    #items;

    constructor(id = crypto.randomUUID(), name, items = []) {
        this.#id = id;
        this.#name = this.#validateName(name);
        this.#items = this.#validateItems(items);
    }

    static create({name, items = []}) {
        return new Meal(crypto.randomUUID(), name, items);
    }

    static restore({id, name, items}) {
        if (!id)
            throw new DomainError(MealErrors.IdRequired);

        const restoredItems = Array.isArray(items)
            ? items.map(item => ({
                recipe: item.recipe instanceof Recipe ? item.recipe : Recipe.restore(item.recipe),
                servings: item.servings
            }))
            : [];

        return new Meal(id, name, restoredItems);
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get items() {
        return [...this.#items];
    }

    get totalNutrients() {
        return this.#items.reduce(
            (acc, item) => {
                const recipeNutrients = item.recipe.nutrientsPerServing; // КБЖУ на 1 порцию
                return {
                    calories: acc.calories + (recipeNutrients.calories * item.servings),
                    protein: acc.protein + (recipeNutrients.protein * item.servings),
                    fat: acc.fat + (recipeNutrients.fat * item.servings),
                    carbs: acc.carbs + (recipeNutrients.carbs * item.servings)
                };
            },
            {calories: 0, protein: 0, fat: 0, carbs: 0}
        );
    }

    addRecipe(recipe, servings = 1) {
        if (!(recipe instanceof Recipe)) throw new DomainError(MealErrors.InvalidRecipe);
        if (typeof servings !== 'number' || servings <= 0) throw new DomainError(MealErrors.InvalidServings);

        this.#items.push({recipe, servings});
    }

    removeRecipe(recipeId) {
        this.#items = this.#items.filter(item => item.recipe.id !== recipeId);
    }

    changeName(newName) {
        this.#name = this.#validateName(newName);
    }

    #validateName(name) {
        if (!name || typeof name !== 'string' || !name.trim()) {
            throw new DomainError(MealErrors.NameEmpty);
        }
        return name.trim();
    }

    #validateItems(items) {
        if (!Array.isArray(items)) return [];
        return items;
    }
}