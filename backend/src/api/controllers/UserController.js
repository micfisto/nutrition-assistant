import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userService } from '../../services/UserService.js';
import { userRepository } from '../../infrastructure/repositories/userRepository.js';

function handleError(res, err) {
  if (err.name === 'DomainError' || err.code) {
    return res.status(400).json({ error: err.message || err.code });
  }
  console.error(err);
  return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
}

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

export async function register(req, res) {
  try {
    const { login, username, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    await userService.registerUser({
      login,
      username,
      email,
      passwordHash,
      role: 'USER' 
    });

    res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
  } catch (err) {
    handleError(res, err);
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userRepository.findByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const isMatch = await bcrypt.compare(password, user.toJSON().passwordHash);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
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
    handleError(res, err);
  }
}

export async function getMe(req, res) {
  try {
    const user = await userRepository.findById(req.userId); 
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const { passwordHash, ...userData } = user.toJSON();
    res.json(userData);
  } catch (err) {
    handleError(res, err);
  }
}