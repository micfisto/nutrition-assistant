import { InMemoryRecipeRepository } from "./InMemoryRepositories/InMemoryRecipeRepository.js";
import { recipeSeed } from "../seeds/recipeSeed.js";
import { loadRecipesFromCsv } from "../seeds/csvRecipes.js";
// import { prisma } from "../orm/PrismaClient.js";
// import { OrmRecipeRepository } from "./OrmRepositories/OrmRecipeRepository.js";

const driver = process.env.DB_DRIVER || "memory";

const csvRecipes = loadRecipesFromCsv();
// Добавляем рецепты из recipeSeed, которых нет в CSV (чтобы не было дублей)
const seedRecipesNotInCsv = recipeSeed.filter(
  (rs) => !csvRecipes.some((c) => c.id === rs.id),
);
const initialRecipes = [...csvRecipes, ...seedRecipesNotInCsv];
console.log(`Загружено рецептов: ${initialRecipes.length}`);

let recipeRepository;

if (driver === "memory") {
  recipeRepository = new InMemoryRecipeRepository(initialRecipes);
} else if (driver === "orm") {
  // ORM repository not implemented yet, falling back to memory
  recipeRepository = new InMemoryRecipeRepository(initialRecipes);
}

export { recipeRepository };
