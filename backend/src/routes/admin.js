/**
 * АДМИН-МАРШРУТЫ
 * 
 * Только для пользователей с ролью ADMIN
 */

const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  syncUsersFromExternal
} = require('../controllers/adminController');
const { authenticate, requireRole } = require('../middleware/auth');
const { ROLES } = require('../utils/constants');

// Все маршруты требуют авторизации и роли ADMIN
router.use(authenticate);
router.use(requireRole([ROLES.ADMIN]));

/**
 * GET /api/admin/users
 * Список всех пользователей
 */
router.get('/users', getAllUsers);

/**
 * GET /api/admin/users/:id
 * Пользователь по ID
 */
router.get('/users/:id', getUserById);

/**
 * PUT /api/admin/users/:id/role
 * Изменение роли пользователя
 */
router.put('/users/:id/role', updateUserRole);

/**
 * POST /api/admin/users/sync
 * Синхронизация с внешним сервисом
 */
router.post('/users/sync', syncUsersFromExternal);

module.exports = router;