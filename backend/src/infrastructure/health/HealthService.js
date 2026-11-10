import { DomainError } from '../../domain/errors/DomainError.js';
import { GeneralErrors } from '../../domain/errors/GeneralErrors.js';
import { checkDatabase } from './databaseCheck.js';

export class HealthError extends DomainError {
  constructor(code, details = {}) {
    super(code);
    this.details = details;
  }
}

export class HealthService {
  /**
   * Комплексная проверка состояния сервиса.
   * @returns {Promise<{status: string, checks: Record<string, boolean>, timestamp: string, version?: string}>}
   */
  async getHealth() {
    const checks = {
      app: true,
      database: false,
      recipesLoaded: false,
    };

    const details = {};

    try {
      const db = await checkDatabase();
      checks.database = db.ok;
      checks.recipesLoaded = db.recipesCount > 0;
      checks.recipesCount = db.recipesCount;
      checks.ingredientsCount = db.ingredientsCount;
    } catch (err) {
      checks.database = false;
      details.database = err.message;
      console.error('Health check database failed:', err.message);
    }

    if (!checks.app) {
      details.app = 'app initialization failed';
    }

    const overall = checks.app && checks.database && checks.recipesLoaded
      ? 'healthy'
      : checks.app && checks.database
      ? 'degraded'
      : 'unhealthy';

    return {
      status: overall,
      checks,
      details,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
    };
  }
}

export const healthService = new HealthService();