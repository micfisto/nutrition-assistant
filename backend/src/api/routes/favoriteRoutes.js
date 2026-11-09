import { Router } from "express";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../controllers/FavoriteController.js";
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware.js";

export const favoriteRouter = Router();

// все маршруты избранного доступны только с токеном
favoriteRouter.use(authMiddleware);

favoriteRouter.get("/", getFavorites);
favoriteRouter.post("/:recipeId", addFavorite);
favoriteRouter.delete("/:recipeId", removeFavorite);