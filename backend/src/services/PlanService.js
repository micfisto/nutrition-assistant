import { planRepository } from "../infrastructure/repositories/planRepository.js";
import { DomainError } from "../domain/errors/DomainError.js";

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const WEEKS = ["1", "2", "3", "4"];

function validateWeeks(weeks) {
  if (!weeks || typeof weeks !== "object")
    throw new DomainError("PLAN_INVALID");

  const clean = {};
  for (const [week, days] of Object.entries(weeks)) {
    if (!WEEKS.includes(week)) throw new DomainError("PLAN_INVALID_WEEK");
    clean[week] = {};
    for (const day of DAYS) {
      const ids = days?.[day] ?? [];
      if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string"))
        throw new DomainError("PLAN_INVALID_DAY");
      clean[week][day] = ids;
    }
  }
  return clean;
}

export class PlanService {
  async getPlan(userId) {
    const plan = await planRepository.findByUser(userId);
    return plan ?? { userId, weeks: {}, repeatWeekly: false, updatedAt: null };
  }

  async savePlan(userId, { weeks, repeatWeekly = false }) {
    const plan = {
      userId,
      weeks: validateWeeks(weeks),
      repeatWeekly: Boolean(repeatWeekly),
      updatedAt: new Date().toISOString(),
    };
    await planRepository.save(plan);
    return plan;
  }
}

export const planService = new PlanService();
