import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/ProfileController.js";
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware.js";

export const profileRouter = Router();

// все маршруты профиля доступны только с токеном
profileRouter.use(authMiddleware);

profileRouter.get("/", getProfile);
profileRouter.put("/", updateProfile);