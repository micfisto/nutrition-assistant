import { ingredientService } from "../../services/IngredientService.js";

export async function getIngredients(req, res, next) {
  try {
    const ingredients = await ingredientService.getIngredients();
    res.json(ingredients);
  } catch (err) {
    next(err);
  }
}