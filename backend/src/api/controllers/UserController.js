import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userService } from '../../services/UserService.js';
import { userProfileService } from '../../services/UserProfileService.js';
import { userRepository } from '../../infrastructure/repositories/userRepository.js';
import { DomainError } from '../../domain/errors/DomainError.js';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

export async function register(req, res, next) {
  try {
    const { login, username, email, password, birthDate, weight, height, activityLevel, goal, allergenIds } = req.body;
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
      activityLevel,
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
    const { login, password } = req.body;

    const user = await userService.validateUserForLogin(login);
    const userData = user.toJSON();

    const isMatch = await bcrypt.compare(password, userData.passwordHash);

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