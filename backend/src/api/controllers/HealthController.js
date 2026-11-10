import { healthService } from "../../infrastructure/health/HealthService.js";
import { HealthError } from "../../infrastructure/health/HealthService.js";

export async function getHealth(req, res, next) {
  try {
    const health = await healthService.getHealth();
    const statusCode = health.status === "healthy" ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (err) {
    const error = err instanceof HealthError ? err : new HealthError("HEALTH_CHECK_FAILED", err.message);
    res.status(500).json({ status: "unhealthy", error: error.code, details: error.details });
  }
}