// Middleware - это функция, которая проверяет запрос до обработки
// В нашем случае проверяет наличие и валидность JWT токена

const { verifyToken } = require('../utils/auth');

/**
 * authenticate - проверяет авторизацию пользователя
 * 
 * Как работает:
 * 1. Проверяет заголовок Authorization
 * 2. Если есть Bearer токен - проверяет его
 * 3. Если токен валиден - добавляет пользователя в req.user
 * 4. Если нет - возвращает ошибку 401
 */
const authenticate = async (req, res, next) => {
  try {
    // Проверяем заголовок Authorization
    // Обычно выглядит так: "Bearer eyJhbGciOiJIUzI1NiIs..."
    const authHeader = req.headers.authorization;
    
    // Если заголовка нет или он начинается не с "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Требуется авторизация'
      });
    }

    // Извлекаем токен (убираем "Bearer ")
    const token = authHeader.split(' ')[1];
    
    // Проверяем токен
    const decoded = verifyToken(token);

    // Если токен невалидный
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Недействительный или просроченный токен'
      });
    }

    // Сохраняем данные пользователя в req.user
    // Дальше они будут доступны во всех обработчиках маршрутов
    req.user = decoded;
    
    // Передаем управление следующему обработчику
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка авторизации'
    });
  }
};

/**
 * requireRole - проверяет, что у пользователя есть нужная роль
 * 
 * Использование:
 * requireRole(['ADMIN']) - только админ
 * requireRole(['ADMIN', 'METHODIST']) - админ или методист
 * 
 * Это middleware высшего порядка - возвращает функцию middleware
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    // Проверяем, что пользователь авторизован
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Требуется авторизация'
      });
    }

    // Проверяем, что роль пользователя есть в списке разрешенных
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Недостаточно прав доступа'
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  requireRole
};