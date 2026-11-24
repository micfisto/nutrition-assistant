import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { recipeRouter } from "./api/routes/recipeRoutes.js";
import { authRouter } from "./api/routes/authRoutes.js";
import { ingredientRouter } from "./api/routes/ingredientRoutes.js";
import { profileRouter } from "./api/routes/profileRoutes.js";
import { favoriteRouter } from "./api/routes/favoriteRoutes.js";
import { healthRouter } from "./api/routes/healthRoutes.js";
import { menuRouter } from "./api/routes/menuRoutes.js";
import { errorHandler } from "./infrastructure/middlewares/errorHandler.js";
import { planRouter } from "./api/routes/planRoutes.js";
import { recipeRepository } from "./infrastructure/repositories/recipeRepository.js";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/v1/recipes", recipeRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/ingredients", ingredientRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/favorites", favoriteRouter);
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/menu", menuRouter);
app.use("/api/v1/plans", planRouter);

app.use(errorHandler);

/**
 * Автоимпорт рецептов из CSV при первом запуске,
 * если в репозитории пока нет данных.
 */
async function seedRecipesFromCSV() {
  const csvPath = path.resolve(process.cwd(), "data", "recipes.csv");
  if (!fs.existsSync(csvPath)) {
    console.log("CSV recipes file not found, skipping seed...");
    return;
  }

  const raw = fs.readFileSync(csvPath, "utf8");
  const lines = raw.split("\n").filter((line) => line.trim());
  if (lines.length < 2) return;

  const header = lines[0].split(",");
  const headerIndex = {
    id: header.indexOf("id"),
    title: header.indexOf("title"),
    description: header.indexOf("description"),
    servings: header.indexOf("servings"),
    ingredients: header.indexOf("ingredients"),
    image_url: header.indexOf("image_url"),
    meal_types: header.indexOf("meal_types"),
    cooking_method: header.indexOf("cooking_method"),
  };

  let imported = 0;
  let skipped = 0;
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length <= headerIndex.id) continue;

    try {
      const recipeId = cols[headerIndex.id]?.trim();
      const existing = await recipeRepository.findById(recipeId);
      if (existing) {
        skipped++;
        continue;
      }

      const ingredientsJson = cols[headerIndex.ingredients];
      const parsedIngredients = JSON.parse(ingredientsJson);

      const recipe = {
        id: recipeId,
        title: cols[headerIndex.title]?.trim() || "",
        description: cols[headerIndex.description]?.trim() || "",
        servings: Number(cols[headerIndex.servings]) || 1,
        ingredients: parsedIngredients.map((item) => ({
          ingredient: item.ingredient,
          amountInGrams: Number(item.amountInGrams) || 0,
        })),
        image_url: cols[headerIndex.image_url]?.trim() || null,
        meal_types: cols[headerIndex.meal_types]
          ? String(cols[headerIndex.meal_types]).split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        cooking_method: cols[headerIndex.cooking_method]?.trim() || null,
      };

      await recipeRepository.save(recipe);
      imported++;
    } catch (err) {
      console.error(`Failed to import row ${i + 1}:`, err.message);
    }
  }

  console.log(`Seeded ${imported} recipes from CSV (${skipped} already existed)`);
}

seedRecipesFromCSV();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
