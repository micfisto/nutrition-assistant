import { Router } from "express";
import { getDefaultMenu } from "../controllers/MenuController.js";

export const menuRouter = Router();

menuRouter.get("/", getDefaultMenu);