import { InMemoryRecipeRepository } from "./InMemoryRepositories/InMemoryRecipeRepository.js";
import { recipeSeed } from "../seeds/recipeSeed.js";

const driver = process.env.DB_DRIVER || "memory";

let recipeRepository;

if (driver === "memory") {
  recipeRepository = new InMemoryRecipeRepository(recipeSeed);
} else if (driver === "orm") {
  // recipeRepository = new OrmRecipeRepository(prisma.recipeEntity);
}

export { recipeRepository };
