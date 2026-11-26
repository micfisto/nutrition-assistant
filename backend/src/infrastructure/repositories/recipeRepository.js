import { InMemoryRecipeRepository } from "./InMemoryRepositories/InMemoryRecipeRepository.js";
import { recipeSeed } from "../seeds/recipeSeed.js";
import { loadRecipesFromCsv } from "../seeds/csvRecipes.js";

const driver = process.env.DB_DRIVER || "memory";

// старые тестовые рецепты без фото, их не показываем
const LEGACY_IDS = [
  "rec-oatmeal",
  "rec-omelette",
  "rec-chicken-rice",
  "rec-salmon",
  "rec-yogurt",
];

const csvRecipes = loadRecipesFromCsv();
const seedExtra = recipeSeed.filter(
  (r) => !LEGACY_IDS.includes(r.id) && !csvRecipes.some((c) => c.id === r.id),
);
const initialRecipes = [...csvRecipes, ...seedExtra];
console.log(`Загружено рецептов: ${initialRecipes.length}`);

const recipeRepository = new InMemoryRecipeRepository(initialRecipes);

export { recipeRepository };
