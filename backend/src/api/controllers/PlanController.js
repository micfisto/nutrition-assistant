import { planService } from "../../services/PlanService.js";
import { GeneralErrors } from "../../domain/errors/GeneralErrors.js";

function handleError(res, err) {
  if (err.name === "DomainError")
    return res.status(400).json({ error: err.code });

  console.error(err);
  return res.status(500).json({ error: GeneralErrors.InternalError });
}

export async function getPlan(req, res) {
  try {
    res.json(await planService.getPlan(req.userId));
  } catch (err) {
    handleError(res, err);
  }
}

export async function savePlan(req, res) {
  try {
    res.json(await planService.savePlan(req.userId, req.body ?? {}));
  } catch (err) {
    handleError(res, err);
  }
}
