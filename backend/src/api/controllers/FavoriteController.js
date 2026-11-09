import { favoriteService } from "../../services/FavoriteService.js";
import { GeneralErrors } from "../../domain/errors/GeneralErrors.js";
import { UserProfileErrors } from "../../domain/errors/UserProfileErrors.js";

function handleError(res, next, err) {
  if (
    err.code === GeneralErrors.NotFound ||
    err.code === UserProfileErrors.ProfileNotFound
  ) {
    return res.status(404).json({ error: err.code });
  }
  next(err);
}

export async function getFavorites(req, res, next) {
  try {
    res.json(await favoriteService.getFavorites(req.userId));
  } catch (err) {
    handleError(res, next, err);
  }
}

export async function addFavorite(req, res, next) {
  try {
    const ids = await favoriteService.addFavorite(req.userId, req.params.recipeId);
    res.json({ favoriteRecipeIds: ids });
  } catch (err) {
    handleError(res, next, err);
  }
}

export async function removeFavorite(req, res, next) {
  try {
    const ids = await favoriteService.removeFavorite(req.userId, req.params.recipeId);
    res.json({ favoriteRecipeIds: ids });
  } catch (err) {
    handleError(res, next, err);
  }
}