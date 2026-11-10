import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userService } from '../../services/UserService.js';
import { userProfileService } from '../../services/UserProfileService.js';
import { userRepository } from '../../infrastructure/repositories/UserRepository.js';
import { DomainError } from '../../domain/errors/DomainError.js';

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
  return jwt.sign({ id: userId }, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });
};

export async function register(req, res, next) {
  try {
    const { login, username, email, password, birthDate, weight, height, activityLevel, goal, allergenIds } = req.body;

    // Преобразуем activityLevel в число, если оно пришло как строка
    const activityLevelNum = typeof activityLevel === 'string' ? parseFloat(activityLevel) : activityLevel;

    if (!login || !username || !email || !password) {
      throw new DomainError('USER_LOGIN_EMPTY');
    }

    if (!password || password.length < 6) {
      throw new DomainError('USER_PASSWORD_TOO_SHORT');
    }

    if (!birthDate || !weight || !height) {
      throw new DomainError('PROFILE_INVALID_BIRTH_DATE');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userService.registerUser({
      login,
      username,
      email,
      passwordHash,
      role: 'USER'
    });

    await userProfileService.createUserProfile({
      userId: user.id,
      birthDate,
      weight,
      height,
      activityLevel: activityLevelNum,
      goal,
      allergenIds: allergenIds || [],
      favoriteRecipeIds: []
    });

    res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    console.log('Login request body:', req.body);
    const { loginOrEmail, password } = req.body;

    console.log('Extracted loginOrEmail:', loginOrEmail, 'password:', password ? '***' : 'missing');

    if (!loginOrEmail || !password) {
      console.log('Missing credentials');
      throw new DomainError('INVALID_CREDENTIALS');
    }

    const user = await userService.validateUserForLogin(loginOrEmail);
    const userData = user.toJSON();

    console.log('User found, comparing password');
    const isMatch = await bcrypt.compare(password, userData.passwordHash);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      throw new DomainError('INVALID_CREDENTIALS');
    }

    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        login: user.login,
        email: user.email,
        username: user.username
      }
    });
  } catch (err) {
    console.log('Login error:', err);
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await userRepository.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const { passwordHash, ...userData } = user.toJSON();
    res.json(userData);
  } catch (err) {
    next(err);
  }
}