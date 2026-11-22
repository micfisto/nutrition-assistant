import { InMemoryRecipeRepository } from "./InMemoryRepositories/InMemoryRecipeRepository.js";
import { recipeSeed } from "../seeds/recipeSeed.js";
import { loadRecipesFromCsv } from "../seeds/csvRecipes.js";
// import { prisma } from "../orm/PrismaClient.js";
// import { OrmRecipeRepository } from "./OrmRepositories/OrmRecipeRepository.js";

const driver = process.env.DB_DRIVER || "memory";

// Рецепты из backend/data/recipes.csv; если файла нет, берём тестовый сид
const csvRecipes = loadRecipesFromCsv();
const initialRecipes = csvRecipes.length ? csvRecipes : recipeSeed;
console.log(`Загружено рецептов: ${initialRecipes.length}`);

let recipeRepository;

if (driver === "memory") {
  recipeRepository = new InMemoryRecipeRepository(initialRecipes);
} else if (driver === "orm") {
  // ORM repository not implemented yet, falling back to memory
  recipeRepository = new InMemoryRecipeRepository(initialRecipes);
}

export { recipeRepository };
