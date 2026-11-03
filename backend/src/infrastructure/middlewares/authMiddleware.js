import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  // Получаем токен из заголовка Authorization (формат: "Bearer TOKEN")
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Нет токена авторизации' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Проверяем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.userId = decoded.id;
    
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Недействительный токен' });
  }
}