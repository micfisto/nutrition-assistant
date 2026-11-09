import "dotenv/config";
import express from "express";
import cors from "cors";
import { recipeRouter } from "./api/routes/recipeRoutes.js";
import { authRouter } from "./api/routes/authRoutes.js";
import { ingredientRouter } from "./api/routes/ingredientRoutes.js";
import { errorHandler } from "./infrastructure/middlewares/errorHandler.js";
import { profileRouter } from "./api/routes/profileRoutes.js";
import { favoriteRouter } from "./api/routes/favoriteRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/recipes", recipeRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/ingredients", ingredientRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/favorites", favoriteRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
