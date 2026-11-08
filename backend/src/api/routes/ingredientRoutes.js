import { Router } from "express";
import { getIngredients } from "../controllers/IngredientController.js";

export const ingredientRouter = Router();

ingredientRouter.get("/", getIngredients);