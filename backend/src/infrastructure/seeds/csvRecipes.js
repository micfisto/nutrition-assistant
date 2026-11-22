import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Ingredient } from "../../domain/entities/Ingredient.js";
import { Recipe } from "../../domain/entities/Recipe.js";

const CSV_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../data/recipes.csv",
);

// Разбор CSV с кавычками; внутри кавычек понимает и \" и ""
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === "\\" && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && next === "\n") i++;
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

export function loadRecipesFromCsv() {
  if (!fs.existsSync(CSV_PATH)) return [];

  const rows = parseCsv(fs.readFileSync(CSV_PATH, "utf8"));
  if (rows.length < 2) return [];

  const header = rows[0].map((h) => h.trim());
  const col = (name) => header.indexOf(name);
  const recipes = [];

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const get = (name) => (r[col(name)] ?? "").trim();

    try {
      const items = JSON.parse(get("ingredients")).map((item) => ({
        ingredient: Ingredient.restore(item.ingredient),
        amountInGrams: Number(item.amountInGrams),
      }));

      recipes.push(
        Recipe.restore({
          id: get("id"),
          title: get("title"),
          description: get("description"),
          servings: Number(get("servings")) || 1,
          ingredients: items,
          imageUrl: get("image_url") || null,
          mealTypes: get("meal_types")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          cookingMethod: get("cooking_method") || null,
        }),
      );
    } catch (err) {
      console.warn(`recipes.csv, строка ${i + 1} пропущена: ${err.message}`);
    }
  }
  return recipes;
}
