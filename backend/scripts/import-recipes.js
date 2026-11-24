import fs from "fs";
import path from "path";

const __dirname = path.dirname(".");
const recipesRepoPath = path.resolve(
  __dirname,
  "../src/infrastructure/repositories/recipeRepository.js"
);
const { recipeRepository } = await import(recipesRepoPath);

function parseIngredients(ingredientsJson) {
  if (!ingredientsJson || !ingredientsJson.trim()) {
    throw new Error("ingredients is empty");
  }

  const parsed = JSON.parse(ingredientsJson);
  if (!Array.isArray(parsed)) {
    throw new Error("ingredients must be an array");
  }

  return parsed.map((item) => {
    if (!item.ingredient || typeof item.ingredient.id !== "string") {
      throw new Error("ingredient.id is required");
    }
    if (!item.ingredient.name || typeof item.ingredient.name !== "string") {
      throw new Error("ingredient.name is required");
    }
    return {
      ingredient: {
        id: item.ingredient.id,
        name: item.ingredient.name,
        caloriesPer100g: Number(item.ingredient.caloriesPer100g) || 0,
        proteinsPer100g: Number(item.ingredient.proteinsPer100g) || 0,
        fatsPer100g: Number(item.ingredient.fatsPer100g) || 0,
        carbsPer100g: Number(item.ingredient.carbsPer100g) || 0,
      },
      amountInGrams: Number(item.amountInGrams) || 0,
    };
  }).filter(Boolean);
}

function parseMealTypes(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function importRecipes(csvPath) {
  const absPath = path.resolve(csvPath);
  if (!fs.existsSync(absPath)) {
    throw new Error(`File not found: ${absPath}`);
  }

  const raw = fs.readFileSync(absPath, "utf8");
  const lines = raw.split("\n").filter((line) => line.trim());
  if (lines.length < 2) {
    throw new Error("CSV file must contain header and at least one row");
  }

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

  const required = ["id", "title", "servings", "ingredients"];
  for (const field of required) {
    if (headerIndex[field] === -1) {
      throw new Error(`Required column missing: ${field}`);
    }
  }

  let imported = 0;
  let skipped = 0;
  const errors = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length <= headerIndex.id) {
      errors.push(`Row ${i + 1}: too few columns`);
      skipped++;
      continue;
    }

    const recipe = {
      id: cols[headerIndex.id].trim(),
      title: cols[headerIndex.title]?.trim() || "",
      description: cols[headerIndex.description]?.trim() || "",
      servings: Number(cols[headerIndex.servings]) || 1,
      image_url: cols[headerIndex.image_url]?.trim() || null,
      meal_types: parseMealTypes(cols[headerIndex.meal_types]),
      cooking_method: cols[headerIndex.cooking_method]?.trim() || null,
    };

    try {
      recipe.ingredients = parseIngredients(cols[headerIndex.ingredients]);
    } catch (err) {
      errors.push(`Row ${i + 1} (${recipe.id}): ${err.message}`);
      skipped++;
      continue;
    }

    const existing = await recipeRepository.findById(recipe.id);
    if (existing) {
      console.log(`⏭️  Skipped (already exists): ${recipe.id}`);
      skipped++;
      continue;
    }

    try {
      await recipeRepository.save(recipe);
      imported++;
      console.log(`✅ Imported: ${recipe.title} (${recipe.id})`);
    } catch (err) {
      errors.push(`Row ${i + 1} (${recipe.id}): save failed - ${err.message}`);
      skipped++;
    }
  }

  console.log(`\n📊 Import complete: ${imported} imported, ${skipped} skipped`);
  if (errors.length > 0) {
    console.log("\nErrors:");
    errors.forEach((e) => console.log("  -", e));
  }
}

const csvPath = process.argv[2];
if (!csvPath) {
  console.error("Usage: node import-recipes.js <path-to-csv>");
  process.exit(1);
}

importRecipes(csvPath).catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});