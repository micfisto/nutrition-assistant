import "dotenv/config";
import express from "express";
import cors from "cors";
import { recipeRouter } from "./api/routes/recipeRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/recipes", recipeRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
