import { Router } from "express";
import { getRecipes, getRecipeById } from "../controllers/RecipeController.js";

export const recipeRouter = Router();

recipeRouter.get("/", getRecipes);
recipeRouter.get("/:id", getRecipeById);
