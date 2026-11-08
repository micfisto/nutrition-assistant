import { InMemoryRecipeRepository } from "./InMemoryRepositories/InMemoryRecipeRepository.js";
import { OrmRecipeRepository } from "./OrmRepositories/OrmRecipeRepository.js";
import { recipeSeed } from "../seeds/recipeSeed.js";
import { prisma } from "../orm/PrismaClient.js";

const driver = process.env.DB_DRIVER || "memory";

let recipeRepository;

if (driver === "memory") {
  recipeRepository = new InMemoryRecipeRepository(recipeSeed);
} else if (driver === "orm") {
  recipeRepository = new OrmRecipeRepository(prisma.recipeEntity);
}

export { recipeRepository };
