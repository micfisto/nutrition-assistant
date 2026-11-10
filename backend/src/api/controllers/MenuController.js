import { menuService } from "../../services/MenuService.js";
import { HealthError } from "../../infrastructure/health/HealthService.js";

function handleError(res, err) {
  if (err.name === "DomainError") {
    return res.status(400).json({ error: err.code });
  }

  console.error(err);
  return res.status(500).json({ error: "INTERNAL_ERROR" });
}

/**
 * GET /api/v1/menu/default
 * Генерирует дефолтный план питания на день, подобрав рецепты
 * по целевой калорийности и аллергенам пользователя.
 */
export async function getDefaultMenu(req, res, next) {
  try {
    const { targetCalories = 2000, allergenIds = [] } = req.query;

    const parsedCalories = Number(targetCalories);
    if (isNaN(parsedCalories) || parsedCalories < 500) {
      throw new HealthError("INVALID_TARGET_CALORIES");
    }

    const menu = await menuService.generateDailyMenu({
      targetCalories: parsedCalories,
      allergenIds: Array.isArray(allergenIds) ? allergenIds : String(allergenIds).split(",").filter(Boolean),
    });

    const dailyTotal = {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
    };

    Object.values(menu).forEach((recipe) => {
      const n = recipe.nutrientsPerServing;
      dailyTotal.calories += n.calories;
      dailyTotal.protein += n.protein;
      dailyTotal.fat += n.fat;
      dailyTotal.carbs += n.carbs;
    });

    res.json({
      menu,
      dailyTotal: dailyTotal,
      targetCalories: parsedCalories,
    });
  } catch (err) {
    handleError(res, err);
  }
}