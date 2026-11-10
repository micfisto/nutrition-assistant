import { Ingredient } from "../../domain/entities/Ingredient.js";
import { Recipe } from "../../domain/entities/Recipe.js";

const ing = (id, name, calories, proteins, fats, carbs) =>
  Ingredient.restore({
    id,
    name,
    caloriesPer100g: calories,
    proteinsPer100g: proteins,
    fatsPer100g: fats,
    carbsPer100g: carbs,
  });

const chicken = ing("ing-chicken", "Куриная грудка", 165, 31, 3.6, 0);
const rice = ing("ing-rice", "Рис", 130, 2.7, 0.3, 28);
const broccoli = ing("ing-broccoli", "Брокколи", 34, 2.8, 0.4, 7);
const oats = ing("ing-oats", "Овсяные хлопья", 389, 16.9, 6.9, 66);
const milk = ing("ing-milk", "Молоко", 42, 3.4, 1, 5);
const egg = ing("ing-egg", "Яйцо", 155, 13, 11, 1.1);
const salmon = ing("ing-salmon", "Лосось", 208, 20, 13, 0);
const potato = ing("ing-potato", "Картофель", 77, 2, 0.1, 17);
const yogurt = ing("ing-yogurt", "Йогурт натуральный", 59, 10, 0.4, 3.6);
const banana = ing("ing-banana", "Банан", 89, 1.1, 0.3, 23);

const recipe = (id, title, description, servings, items, imageUrl = null, mealTypes = [], cookingMethod = null) =>
  Recipe.restore({
    id,
    title,
    description,
    servings,
    ingredients: items.map(([ingredient, amountInGrams]) => ({
      ingredient,
      amountInGrams,
    })),
    imageUrl,
    mealTypes,
    cookingMethod,
  });

export const recipeSeed = [
  recipe("rec-oatmeal", "Овсянка с бананом", "Овсянка на молоке с бананом", 1, [
    [oats, 60],
    [milk, 200],
    [banana, 100],
  ], null, ["breakfast"], "Варка"),
  recipe("rec-omelette", "Омлет", "Омлет с молоком", 1, [
    [egg, 150],
    [milk, 50],
  ], null, ["breakfast"], "Жарка"),
  recipe(
    "rec-chicken-rice",
    "Курица с рисом и брокколи",
    "Классический обед",
    2,
    [
      [chicken, 300],
      [rice, 200],
      [broccoli, 200],
    ],
    null,
    ["lunch", "dinner"],
    "Запекание"
  ),
  recipe("rec-salmon", "Лосось с картофелем", "Запечённый лосось", 2, [
    [salmon, 200],
    [potato, 300],
  ], null, ["dinner"], "Запекание"),
  recipe("rec-yogurt", "Йогурт с бананом", "Лёгкий перекус", 1, [
    [yogurt, 200],
    [banana, 100],
  ], null, ["snack"], null),
];

export const seedRecipes = async (recipeRepo) => {
  const existing = await recipeRepo.findAll();
  if (existing.length > 0) {
    console.log(`Seeds already loaded (${existing.length} recipes). Skipping...`);
    return;
  }

  for (const recipe of recipeSeed) {
    await recipeRepo.save(recipe);
  }
  console.log(`Seeded ${recipeSeed.length} recipes`);
};
