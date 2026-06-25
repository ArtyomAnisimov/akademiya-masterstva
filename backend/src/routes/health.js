<<<<<<< HEAD
/**
 * МАРШРУТЫ ДЛЯ ПРОВЕРКИ ЗДОРОВЬЯ СИСТЕМЫ
 * 
 * Позволяет проверить состояние всех компонентов:
 * - Локальный сервер
 * - База данных
 * - Внешний сервис аутентификации
 */

const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');
const { checkExternalServiceHealth } = require('../services/externalUserService');

/**
 * GET /api/health
 * Полная проверка всех компонентов
 */
router.get('/', async (req, res) => {
  try {
    const checks = {
      server: { status: 'ok', timestamp: new Date().toISOString() },
      database: { status: 'unknown' },
      externalService: { status: 'unknown' }
    };

    // Проверяем базу данных
    try {
      await sequelize.authenticate();
      checks.database.status = 'ok';
      checks.database.message = 'Connected';
    } catch (error) {
      checks.database.status = 'error';
      checks.database.message = error.message;
    }

    // Проверяем внешний сервис
    const isExternalAvailable = await checkExternalServiceHealth();
    checks.externalService.status = isExternalAvailable ? 'ok' : 'error';
    checks.externalService.message = isExternalAvailable ? 'Available' : 'Unavailable';

    // Общий статус
    const allOk = checks.database.status === 'ok' && checks.externalService.status === 'ok';
    
    res.status(allOk ? 200 : 503).json({
      success: allOk,
      status: allOk ? 'healthy' : 'unhealthy',
      checks
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'error',
      message: error.message
    });
  }
});

/**
 * GET /api/health/external
 * Проверка только внешнего сервиса
 */
router.get('/external', async (req, res) => {
  const isAvailable = await checkExternalServiceHealth();
  
  res.json({
    success: isAvailable,
    service: 'external-authentication',
    status: isAvailable ? 'available' : 'unavailable',
    timestamp: new Date().toISOString()
  });
});

=======
/**
 * МАРШРУТЫ ДЛЯ ПРОВЕРКИ ЗДОРОВЬЯ СИСТЕМЫ
 * 
 * Позволяет проверить состояние всех компонентов:
 * - Локальный сервер
 * - База данных
 * - Внешний сервис аутентификации
 */

const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');
const { checkExternalServiceHealth } = require('../services/externalUserService');

/**
 * GET /api/health
 * Полная проверка всех компонентов
 */
router.get('/', async (req, res) => {
  try {
    const checks = {
      server: { status: 'ok', timestamp: new Date().toISOString() },
      database: { status: 'unknown' },
      externalService: { status: 'unknown' }
    };

    // Проверяем базу данных
    try {
      await sequelize.authenticate();
      checks.database.status = 'ok';
      checks.database.message = 'Connected';
    } catch (error) {
      checks.database.status = 'error';
      checks.database.message = error.message;
    }

    // Проверяем внешний сервис
    const isExternalAvailable = await checkExternalServiceHealth();
    checks.externalService.status = isExternalAvailable ? 'ok' : 'error';
    checks.externalService.message = isExternalAvailable ? 'Available' : 'Unavailable';

    // Общий статус
    const allOk = checks.database.status === 'ok' && checks.externalService.status === 'ok';
    
    res.status(allOk ? 200 : 503).json({
      success: allOk,
      status: allOk ? 'healthy' : 'unhealthy',
      checks
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'error',
      message: error.message
    });
  }
});

/**
 * GET /api/health/external
 * Проверка только внешнего сервиса
 */
router.get('/external', async (req, res) => {
  const isAvailable = await checkExternalServiceHealth();
  
  res.json({
    success: isAvailable,
    service: 'external-authentication',
    status: isAvailable ? 'available' : 'unavailable',
    timestamp: new Date().toISOString()
  });
});

>>>>>>> 1c6164c7b8cd6ec8ce3f3de3a0d18819aa26465c
module.exports = router;