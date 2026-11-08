import { DomainError } from '../../domain/errors/DomainError.js';
import { InfrastructureError } from '../../domain/errors/InfrastructureError.js';

export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err instanceof DomainError) {
    return res.status(400).json({ error: err.code });
  }

  if (err instanceof InfrastructureError) {
    return res.status(500).json({ error: err.code });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'VALIDATION_ERROR' });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }

  res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
}
