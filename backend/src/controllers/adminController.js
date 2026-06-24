/**
 * АДМИН-КОНТРОЛЛЕР
 * 
 * Управление пользователями и их ролями
 * Только для администраторов!
 */

const { User } = require('../models');
const { ROLES, ERROR_MESSAGES } = require('../utils/constants');

/**
 * GET /api/admin/users
 * Получение всех пользователей с их ролями
 * 
 * Только для ADMIN
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'role', 'createdAt', 'updatedAt'],
      order: [['username', 'ASC']]
    });
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
};

/**
 * GET /api/admin/users/:id
 * Получение пользователя по ID
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'role', 'createdAt', 'updatedAt']
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user by id error:', error);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
};

/**
 * PUT /api/admin/users/:id/role
 * Изменение роли пользователя
 * 
 * Только для ADMIN
 * 
 * Тело запроса:
 * {
 *   "role": "METHODIST"
 * }
 */
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    // Проверяем, что роль существует
    if (!Object.values(ROLES).includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Недопустимая роль. Доступные роли: ${Object.values(ROLES).join(', ')}`
      });
    }
    
    // Находим пользователя
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      });
    }
    
    // Не даем изменить роль самому себе (безопасность)
    if (user.id === req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Нельзя изменить роль самому себе'
      });
    }
    
    // Обновляем роль
    user.role = role;
    await user.save();
    
    res.json({
      success: true,
      message: 'Роль пользователя обновлена',
      data: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
};

/**
 * POST /api/admin/users/sync
 * Синхронизация пользователей из внешнего сервиса
 * 
 * Создает пользователей, которых нет в локальной БД
 * Роль по умолчанию - SPECIALIST
 */
const syncUsersFromExternal = async (req, res) => {
  try {
    const { getAllUsers } = require('../services/externalUserService');
    const externalUsers = await getAllUsers();
    
    if (!externalUsers || externalUsers.length === 0) {
      return res.json({
        success: true,
        message: 'Нет пользователей для синхронизации',
        data: { created: 0, updated: 0 }
      });
    }
    
    let created = 0;
    let updated = 0;
    
    for (const extUser of externalUsers) {
      const existingUser = await User.findOne({
        where: { username: extUser.username }
      });
      
      if (!existingUser) {
        // Создаем пользователя с ролью SPECIALIST по умолчанию
        const { hashPassword } = require('../utils/auth');
        const tempPassword = 'temp123'; // Временный пароль
        const passwordHash = await hashPassword(tempPassword);
        
        await User.create({
          username: extUser.username,
          passwordHash,
          role: ROLES.SPECIALIST // <-- Роль по умолчанию
        });
        created++;
      } else {
        // Обновляем существующего (только если нужно)
        // Роль НЕ меняем при синхронизации!
        updated++;
      }
    }
    
    res.json({
      success: true,
      message: 'Синхронизация завершена',
      data: {
        created,
        updated,
        total: externalUsers.length
      }
    });
  } catch (error) {
    console.error('Sync users error:', error);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  syncUsersFromExternal
};