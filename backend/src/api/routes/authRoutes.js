import { Router } from 'express';
import { register, login, getMe } from '../controllers/UserController.js';
import { authMiddleware } from '../../infrastructure/middlewares/authMiddleware.js';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', authMiddleware, getMe);