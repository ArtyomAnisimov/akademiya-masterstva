/**
 * МАРШРУТЫ АУТЕНТИФИКАЦИИ
 * 
 * Назначение:
 * 1. Публичные маршруты для входа
 * 2. Защищенные маршруты для работы с профилем
 * 
 * Все маршруты начинаются с /api/auth
 */

const express = require('express');
const router = express.Router();
const { 
  login,           // Вход в систему
  getMe,           // Получение данных текущего пользователя
  refreshUserData  // Обновление данных из внешнего сервиса
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// ================ ПУБЛИЧНЫЕ МАРШРУТЫ ================
// Доступны без авторизации

/**
 * POST /api/auth/login
 * Вход в систему
 * 
 * Тело запроса:
 * {
 *   "username": "мария.смирнова",
 *   "password": "specialist123"
 * }
 * 
 * Ответ:
 * {
 *   "success": true,
 *   "data": {
 *     "id": "uuid",
 *     "username": "мария.смирнова",
 *     "role": "SPECIALIST",
 *     "fullName": "Мария Смирнова",
 *     "experience": 3,
 *     "grade": "junior"
 *   },
 *   "token": "jwt-token"
 * }
 */
router.post('/login', login);

// ================ ЗАЩИЩЕННЫЕ МАРШРУТЫ ================
// Требуют валидный JWT токен

/**
 * GET /api/auth/me
 * Получение данных текущего пользователя
 * 
 * Заголовки:
 * Authorization: Bearer <token>
 * 
 * Ответ:
 * {
 *   "success": true,
 *   "data": {
 *     "id": "uuid",
 *     "username": "мария.смирнова",
 *     "role": "SPECIALIST",
 *     "createdAt": "2024-01-01T00:00:00.000Z"
 *   }
 * }
 * 
 * ВАЖНО: Возвращает ТОЛЬКО локальные данные!
 * Для получения данных из внешнего сервиса используйте /refresh
 */
router.get('/me', authenticate, getMe);

/**
 * POST /api/auth/refresh
 * Обновление данных из внешнего сервиса
 * 
 * Заголовки:
 * Authorization: Bearer <token>
 * 
 * Ответ:
 * {
 *   "success": true,
 *   "data": {
 *     "id": "uuid",
 *     "username": "мария.смирнова",
 *     "role": "SPECIALIST",
 *     "fullName": "Мария Смирнова",
 *     "experience": 3,
 *     "grade": "junior"
 *   },
 *   "token": "new-jwt-token"
 * }
 * 
 * Используется для:
 * - Обновления данных после их изменения во внешнем сервисе
 * - Получения свежих данных без повторного ввода пароля
 */
router.post('/refresh', authenticate, refreshUserData);

module.exports = router;