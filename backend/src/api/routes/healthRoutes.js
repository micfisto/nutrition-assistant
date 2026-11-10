import { Router } from "express";
import { getHealth } from "../controllers/HealthController.js";

export const healthRouter = Router();

healthRouter.get("/", getHealth);