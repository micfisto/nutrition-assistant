import { DomainError } from "../errors/DomainError.js";
import { MealPlanErrors } from "../errors/MealPlanErrors.js";
import { Meal } from "./Meal.js";

export class MealPlan {
    #id;
    #userId;
    #title;
    #entries;

    constructor(id = crypto.randomUUID(), userId, title, entries = []) {
        this.#id = id;
        this.#userId = this.#validateUserId(userId);
        this.#title = this.#validateTitle(title);
        this.#entries = this.#validateEntries(entries);
    }

    static create({ userId, title, entries = [] }) {
        return new MealPlan(crypto.randomUUID(), userId, title, entries);
    }
    
    static restore({ id, userId, title, entries }) {
        if (!id) throw new DomainError(MealPlanErrors.IdRequired);

        const restoredEntries = Array.isArray(entries)
            ? entries.map(entry => ({
                day: entry.day,
                meals: Array.isArray(entry.meals)
                    ? entry.meals.map(m => m instanceof Meal ? m : Meal.restore(m))
                    : []
            }))
            : [];

        return new MealPlan(id, userId, title, restoredEntries);
    }

    get id() { return this.#id; }
    get userId() { return this.#userId; }
    get title() { return this.#title; }
    get entries() { return [...this.#entries]; }

    get totalNutrients() {
        return this.#entries.reduce(
            (acc, entry) => {
                const dayNutrients = entry.meals.reduce(
                    (dayAcc, meal) => {
                        const mealNutrients = meal.totalNutrients;
                        return {
                            calories: dayAcc.calories + mealNutrients.calories,
                            protein: dayAcc.protein + mealNutrients.protein,
                            fat: dayAcc.fat + mealNutrients.fat,
                            carbs: dayAcc.carbs + mealNutrients.carbs
                        };
                    },
                    { calories: 0, protein: 0, fat: 0, carbs: 0 }
                );

                return {
                    calories: acc.calories + dayNutrients.calories,
                    protein: acc.protein + dayNutrients.protein,
                    fat: acc.fat + dayNutrients.fat,
                    carbs: acc.carbs + dayNutrients.carbs
                };
            },
            { calories: 0, protein: 0, fat: 0, carbs: 0 }
        );
    }

    addMealToDay(day, meal) {
        if (!(meal instanceof Meal)) throw new DomainError(MealPlanErrors.InvalidMeal);

        let entry = this.#entries.find(e => e.day === day);
        if (!entry) {
            entry = { day, meals: [] };
            this.#entries.push(entry);
        }

        entry.meals.push(meal);
    }

    removeMealFromDay(day, mealId) {
        const entry = this.#entries.find(e => e.day === day);
        if (entry) {
            entry.meals = entry.meals.filter(m => m.id !== mealId);
        }
    }

    changeTitle(newTitle) {
        this.#title = this.#validateTitle(newTitle);
    }

    #validateUserId(userId) {
        if (!userId) throw new DomainError(MealPlanErrors.UserIdRequired);
        return userId;
    }

    #validateTitle(title) {
        if (!title || typeof title !== 'string' || !title.trim()) {
            throw new DomainError(MealPlanErrors.TitleEmpty);
        }
        return title.trim();
    }

    #validateEntries(entries) {
        if (!Array.isArray(entries)) return [];
        return entries;
    }
}