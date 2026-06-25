/**
 * КОНТРОЛЛЕР АУТЕНТИФИКАЦИИ
 * 
 * ВАЖНО: Роль НЕ приходит из внешнего сервиса!
 * 
 * При логине:
 * 1. Проверяем пользователя во внешнем сервисе
 * 2. Получаем: username, fullName, experience, grade
 * 3. В локальной БД ищем пользователя
 * 4. Если найден - берем его роль (локальную)
 * 5. Если не найден - создаем с ролью SPECIALIST (по умолчанию)
 * 6. Генерируем токен с данными из внешнего сервиса + локальной ролью
 */

const { User } = require('../models');
const { comparePassword, generateToken } = require('../utils/auth');
const { validateUser } = require('../services/externalUserService');
const { ERROR_MESSAGES, ROLES } = require('../utils/constants');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Имя пользователя и пароль обязательны'
      });
    }

    // ================ 1. ПРОВЕРКА ВО ВНЕШНЕМ СЕРВИСЕ ================
    // Получаем данные из внешнего сервиса (БЕЗ РОЛИ!)
    const externalUser = await validateUser(username, password);
    
    if (!externalUser) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS
      });
    }

    // ================ 2. РАБОТА С ЛОКАЛЬНОЙ БД ================
    let user = await User.findOne({ where: { username } });

    if (user) {
      // Пользователь существует - обновляем только пароль
      const { hashPassword } = require('../utils/auth');
      const newHash = await hashPassword(password);
      
      if (user.passwordHash !== newHash) {
        user.passwordHash = newHash;
        await user.save();
      }
      
      // Роль берем из БД (локальная роль!)
      // Она не меняется при логине
    } else {
      // Пользователь не существует - создаем
      const { hashPassword } = require('../utils/auth');
      const passwordHash = await hashPassword(password);
      
      user = await User.create({
        username,
        passwordHash,
        // Роль по умолчанию - СПЕЦИАЛИСТ
        // Администратор потом сменит через админ-панель
        role: ROLES.SPECIALIST
      });
    }

    // ================ 3. ГЕНЕРАЦИЯ JWT ТОКЕНА ================
    // В токен кладем:
    // - локальные данные: id, username, role (из БД!)
    // - внешние данные: fullName, experience, grade (из внешнего сервиса)
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role, // <-- Локальная роль из БД!
      fullName: externalUser.fullName,
      experience: externalUser.experience,
      grade: externalUser.grade
    });

    // ================ 4. ОТВЕТ ================
    res.json({
      success: true,
      message: 'Вход выполнен успешно',
      data: {
        id: user.id,
        username: user.username,
        role: user.role, // <-- Локальная роль
        fullName: externalUser.fullName,
        experience: externalUser.experience,
        grade: externalUser.grade
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.message.includes('внешнем сервисе')) {
      return res.status(503).json({
        success: false,
        message: ERROR_MESSAGES.EXTERNAL_SERVICE_ERROR
      });
    }
    
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
};

/**
 * GET /api/auth/me
 * Получение данных текущего пользователя
 * 
 * Возвращает локальные данные (включая роль)
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['passwordHash'] }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        role: user.role // <-- Локальная роль
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
};

/**
 * POST /api/auth/refresh
 * Обновление данных из внешнего сервиса
 * 
 * Роль при этом НЕ МЕНЯЕТСЯ! Она локальная.
 */
const refreshUserData = async (req, res) => {
  try {
    const { username } = req.user;
    
    const { getUserByUsername } = require('../services/externalUserService');
    const externalUser = await getUserByUsername(username);
    
    if (!externalUser) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден во внешнем сервисе'
      });
    }

    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      });
    }

    // Генерируем новый токен с обновленными данными
    // Роль берем из БД (не меняется!)
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role, // <-- Роль из БД
      fullName: externalUser.fullName,
      experience: externalUser.experience,
      grade: externalUser.grade
    });

    res.json({
      success: true,
      message: 'Данные обновлены',
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: externalUser.fullName,
        experience: externalUser.experience,
        grade: externalUser.grade
      },
      token
    });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
};

module.exports = {
  login,
  getMe,
  refreshUserData
};