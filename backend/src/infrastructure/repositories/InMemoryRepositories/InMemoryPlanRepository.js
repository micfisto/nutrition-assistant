export class InMemoryPlanRepository {
  #plans = new Map();

  async findByUser(userId) {
    const plan = this.#plans.get(userId);
    return plan ? structuredClone(plan) : null;
  }

  async save(plan) {
    this.#plans.set(plan.userId, structuredClone(plan));
  }
}
