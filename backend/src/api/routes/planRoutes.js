import { Router } from "express";
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware.js";
import { getPlan, savePlan } from "../controllers/PlanController.js";

export const planRouter = Router();

planRouter.use(authMiddleware);
planRouter.get("/", getPlan);
planRouter.put("/", savePlan);
