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
const tomato = ing("ing-tomato", "Помидор", 18, 0.9, 0.2, 3.9);
const bread = ing("ing-bread", "Зёрновой хлеб", 250, 9, 3, 45);
const cheese = ing("ing-cheese", "Сыр 30%", 260, 22, 18, 2);
const semolina = ing("ing-semolina", "Манная крупа", 360, 10, 1, 74);
const pasta = ing("ing-pasta", "Лапша яичная", 371, 13, 1.5, 75);
const carrot = ing("ing-carrot", "Морковь", 41, 0.9, 0.2, 9.6);
const onion = ing("ing-onion", "Лук репчатый", 40, 1.1, 0.1, 9);
const eggplant = ing("ing-eggplant", "Баклажан", 24, 1, 0.2, 6);
const zucchini = ing("ing-zucchini", "Цукини", 17, 1.2, 0.3, 3);
const bellPepper = ing("ing-bell-pepper", "Болгарский перец", 31, 1, 0.3, 6);
const cod = ing("ing-cod", "Треска", 82, 18, 0.7, 0);
const cauliflower = ing("ing-cauliflower", "Цветная капуста", 25, 2, 0.3, 5);
const walnut = ing("ing-walnut", "Грецкий орех", 654, 15, 65, 14);
const raisin = ing("ing-raisin", "Изюм", 299, 3, 0.5, 66);
const honey = ing("ing-honey", "Мёд", 304, 0.8, 0, 82);
const oliveOil = ing("ing-olive-oil", "Оливковое масло", 884, 0, 100, 0);
const blueberry = ing("ing-blueberry", "Черника", 57, 0.7, 0.3, 14);

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
  recipe("rec-lunch-chicken-burger", "Куриный бургер", "Отбивная из курицы в булке с овощами", 1, [
    [chicken, 150],
    [bread, 60],
    [cheese, 30],
    [tomato, 50],
  ], null, ["lunch"], "Жарка"),
  recipe("rec-lunch-chicken-plov", "Плов с курицей", "Рис с курицей, морковью и луком", 1, [
    [rice, 150],
    [chicken, 150],
    [carrot, 80],
    [onion, 60],
    [oliveOil, 15],
  ], null, ["lunch", "dinner"], "Варка"),
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
