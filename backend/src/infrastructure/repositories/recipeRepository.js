import { InMemoryRecipeRepository } from "./InMemoryRepositories/InMemoryRecipeRepository.js";
import { recipeSeed } from "../seeds/recipeSeed.js";
import { loadRecipesFromCsv } from "../seeds/csvRecipes.js";

const driver = process.env.DB_DRIVER || "memory";

const csvRecipes = loadRecipesFromCsv();
const initialRecipes = csvRecipes.length ? csvRecipes : recipeSeed;
console.log(`Загружено рецептов: ${initialRecipes.length}`);

const recipeRepository = new InMemoryRecipeRepository(initialRecipes);

export { recipeRepository };
