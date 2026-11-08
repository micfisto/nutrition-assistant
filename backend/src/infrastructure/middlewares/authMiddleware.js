import jwt from 'jsonwebtoken';
import { DomainError } from '../../domain/errors/DomainError.js';
import { InfrastructureError } from '../../domain/errors/InfrastructureError.js';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new DomainError('AUTH_TOKEN_MISSING');
    return res.status(401).json({ error: error.code });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      const error = new DomainError('AUTH_TOKEN_EXPIRED');
      return res.status(401).json({ error: error.code });
    }
    if (err.name === 'JsonWebTokenError') {
      const error = new DomainError('AUTH_TOKEN_INVALID');
      return res.status(401).json({ error: error.code });
    }
    const error = new InfrastructureError('AUTH_VERIFICATION_ERROR', err);
    return res.status(500).json({ error: error.code });
  }
}