import { RecipeMapper } from "../../mappers/RecipeMapper.js";

export class InMemoryRecipeRepository {
  #recipes = new Map();

  constructor(initialRecipes = []) {
    initialRecipes.forEach((recipe) => {
      const data = RecipeMapper.toPersistence(recipe);
      this.#recipes.set(data.id, data);
    });
  }

  async findAll() {
    return [...this.#recipes.values()].map((raw) => RecipeMapper.toDomain(raw));
  }

  async findById(id) {
    return RecipeMapper.toDomain(this.#recipes.get(id));
  }

  async save(recipe) {
    const data = RecipeMapper.toPersistence(recipe);
    this.#recipes.set(data.id, data);
  }
}
