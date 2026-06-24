const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const { ROLES } = require('../utils/constants');
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
  assignCourse,
  getCoursePrerequisites  // ← ДОБАВЛЕНО
} = require('../controllers/courseController');

// ================ ПУБЛИЧНЫЕ МАРШРУТЫ ================

/**
 * GET /api/courses
 * Получение списка курсов
 * Доступ: все авторизованные пользователи
 */
router.get('/', authenticate, getCourses);

/**
 * GET /api/courses/:id
 * Получение курса по ID
 * Доступ: все авторизованные пользователи
 */
router.get('/:id', authenticate, getCourseById);

/**
 * GET /api/courses/:id/prerequisites
 * Получение пререквизитов курса с их статусами
 * Доступ: все авторизованные пользователи
 */
router.get('/:id/prerequisites', authenticate, getCoursePrerequisites);

// ================ МАРШРУТЫ ДЛЯ МЕТОДИСТА ================

/**
 * POST /api/courses
 * Создание нового курса
 * Доступ: METHODIST, ADMIN
 */
router.post('/', authenticate, requireRole([ROLES.METHODIST, ROLES.ADMIN]), createCourse);

/**
 * PUT /api/courses/:id
 * Обновление курса
 * Доступ: автор курса (METHODIST) или ADMIN
 */
router.put('/:id', authenticate, requireRole([ROLES.METHODIST, ROLES.ADMIN]), updateCourse);

/**
 * DELETE /api/courses/:id
 * Удаление курса
 * Доступ: автор курса (METHODIST) или ADMIN
 */
router.delete('/:id', authenticate, requireRole([ROLES.METHODIST, ROLES.ADMIN]), deleteCourse);

/**
 * PUT /api/courses/:id/publish
 * Публикация курса
 * Доступ: автор курса (METHODIST) или ADMIN
 */
router.put('/:id/publish', authenticate, requireRole([ROLES.METHODIST, ROLES.ADMIN]), publishCourse);

// ================ МАРШРУТЫ ДЛЯ РУКОВОДИТЕЛЯ ================

/**
 * POST /api/courses/:id/assign
 * Назначение курса специалисту
 * Доступ: DIRECTOR, ADMIN
 */
router.post('/:id/assign', authenticate, requireRole([ROLES.DIRECTOR, ROLES.ADMIN]), assignCourse);

module.exports = router;