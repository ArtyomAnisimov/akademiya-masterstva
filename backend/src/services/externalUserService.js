<<<<<<< HEAD
/**
 * СЕРВИС ДЛЯ РАБОТЫ С ВНЕШНИМ СЕРВИСОМ
 * 
 * Назначение:
 * 1. Валидация пользователя (проверка логина/пароля во внешнем сервисе)
 * 2. Получение данных пользователя (ФИО, стаж, грейд)
 * 3. Проверка доступности внешнего сервиса (health check)
 * 4. Обработка ошибок и таймаутов
 */

const axios = require('axios');
require('dotenv').config();

// ================ КОНФИГУРАЦИЯ ================
const EXTERNAL_SERVICE_URL = process.env.EXTERNAL_SERVICE_URL || 'http://localhost:6000';
const API_KEY = process.env.EXTERNAL_SERVICE_API_KEY;
const TIMEOUT = 5000; // 5 секунд таймаут

// ================ ЛОГИРОВАНИЕ ================
const logRequest = (method, url, data = null) => {
  console.log(`🌐 [External Service] ${method} ${url}`);
  if (data) {
    console.log(`📦 Request data:`, JSON.stringify(data, null, 2));
  }
};

const logResponse = (method, url, status, data = null) => {
  console.log(`✅ [External Service] ${method} ${url} -> ${status}`);
  if (data) {
    console.log(`📦 Response data:`, JSON.stringify(data, null, 2));
  }
};

const logError = (method, url, error) => {
  console.error(`❌ [External Service] ${method} ${url} failed:`);
  console.error(`   Message: ${error.message}`);
  if (error.response) {
    console.error(`   Status: ${error.response.status}`);
    console.error(`   Data:`, error.response.data);
  }
  if (error.code === 'ECONNABORTED') {
    console.error(`   ⏱️ Request timeout (${TIMEOUT}ms)`);
  }
};

// ================ ОСНОВНЫЕ МЕТОДЫ ================

/**
 * Валидация пользователя во внешнем сервисе
 * 
 * @param {string} username - Имя пользователя (логин)
 * @param {string} password - Пароль
 * @returns {Promise<Object|null>} - Данные пользователя или null
 */
const validateUser = async (username, password) => {
  const url = `${EXTERNAL_SERVICE_URL}/api/auth/validate`;
  
  logRequest('POST', url, { username, password: '***' });
  
  try {
    const response = await axios.post(
      url,
      {
        username,
        password
      },
      {
        headers: {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: TIMEOUT
      }
    );
    
    logResponse('POST', url, response.status, response.data);
    
    if (response.data.success && response.data.user) {
      // Возвращаем данные БЕЗ роли
      const { role, ...userWithoutRole } = response.data.user;
      return userWithoutRole;
    }
    
    return null;
    
  } catch (error) {
    logError('POST', url, error);
    
    if (error.response && (error.response.status === 401 || error.response.status === 404)) {
      return null;
    }
    
    if (error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED') {
      throw new Error('Внешний сервис не отвечает. Попробуйте позже.');
    }
    
    throw new Error(`Ошибка внешнего сервиса: ${error.message}`);
  }
};

/**
 * Получение пользователя по username
 * 
 * @param {string} username - Имя пользователя
 * @returns {Promise<Object|null>} - Данные пользователя или null
 */
const getUserByUsername = async (username) => {
  const url = `${EXTERNAL_SERVICE_URL}/api/users/${username}`;
  
  logRequest('GET', url);
  
  try {
    const response = await axios.get(
      url,
      {
        headers: {
          'X-API-Key': API_KEY
        },
        timeout: TIMEOUT
      }
    );
    
    logResponse('GET', url, response.status, response.data);
    
    if (response.data.success && response.data.user) {
      const { role, ...userWithoutRole } = response.data.user;
      return userWithoutRole;
    }
    
    return null;
    
  } catch (error) {
    logError('GET', url, error);
    
    if (error.response && error.response.status === 404) {
      return null;
    }
    
    throw new Error(`Ошибка получения данных пользователя: ${error.message}`);
  }
};

/**
 * Получение списка всех пользователей
 * 
 * @returns {Promise<Array>} - Массив пользователей
 */
const getAllUsers = async () => {
  const url = `${EXTERNAL_SERVICE_URL}/api/users`;
  
  logRequest('GET', url);
  
  try {
    const response = await axios.get(
      url,
      {
        headers: {
          'X-API-Key': API_KEY
        },
        timeout: TIMEOUT * 2
      }
    );
    
    logResponse('GET', url, response.status, response.data);
    
    if (response.data.success && response.data.users) {
      // Убираем роли из всех пользователей
      return response.data.users.map(({ role, ...user }) => user);
    }
    
    return [];
    
  } catch (error) {
    logError('GET', url, error);
    throw new Error(`Ошибка получения списка пользователей: ${error.message}`);
  }
};

/**
 * ================ НОВАЯ ФУНКЦИЯ: ПРОВЕРКА ДОСТУПНОСТИ ================
 * 
 * Проверка доступности внешнего сервиса
 * Используется для health check
 * 
 * @returns {Promise<boolean>} - Доступен ли сервис
 */
const checkExternalServiceHealth = async () => {
  const url = `${EXTERNAL_SERVICE_URL}/api/health`;
  
  try {
    const response = await axios.get(
      url,
      {
        timeout: 3000, // 3 секунды для health check
        headers: {
          'X-API-Key': API_KEY
        }
      }
    );
    
    // Проверяем, что сервис ответил успешно
    if (response.status === 200 && response.data && response.data.success !== false) {
      console.log(`✅ External service is healthy: ${EXTERNAL_SERVICE_URL}`);
      return true;
    }
    
    console.warn(`⚠️ External service returned unhealthy status`);
    return false;
  } catch (error) {
    // Логируем ошибку, но не бросаем исключение
    console.warn(`⚠️ External service health check failed: ${error.message}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.warn(`   💡 Сервис не доступен по адресу: ${EXTERNAL_SERVICE_URL}`);
    }
    
    return false;
  }
};

// ================ ДОПОЛНИТЕЛЬНЫЕ МЕТОДЫ ================

/**
 * Обновление данных пользователя во внешнем сервисе
 * 
 * @param {string} username - Имя пользователя
 * @param {Object} data - Данные для обновления
 * @returns {Promise<Object>} - Обновленные данные
 */
const updateUserInExternal = async (username, data) => {
  const url = `${EXTERNAL_SERVICE_URL}/api/users/${username}`;
  
  logRequest('PUT', url, data);
  
  try {
    const response = await axios.put(
      url,
      data,
      {
        headers: {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: TIMEOUT
      }
    );
    
    logResponse('PUT', url, response.status, response.data);
    
    if (response.data.success && response.data.user) {
      const { role, ...userWithoutRole } = response.data.user;
      return userWithoutRole;
    }
    
    throw new Error('Внешний сервис вернул ошибку при обновлении');
    
  } catch (error) {
    logError('PUT', url, error);
    throw new Error(`Ошибка обновления данных во внешнем сервисе: ${error.message}`);
  }
};

// ================ ЭКСПОРТ ================
module.exports = {
  validateUser,
  getUserByUsername,
  getAllUsers,
  updateUserInExternal,
  checkExternalServiceHealth // <-- ВАЖНО: экспортируем функцию!
=======
/**
 * СЕРВИС ДЛЯ РАБОТЫ С ВНЕШНИМ СЕРВИСОМ
 * 
 * Назначение:
 * 1. Валидация пользователя (проверка логина/пароля во внешнем сервисе)
 * 2. Получение данных пользователя (ФИО, стаж, грейд)
 * 3. Проверка доступности внешнего сервиса (health check)
 * 4. Обработка ошибок и таймаутов
 */

const axios = require('axios');
require('dotenv').config();

// ================ КОНФИГУРАЦИЯ ================
const EXTERNAL_SERVICE_URL = process.env.EXTERNAL_SERVICE_URL || 'http://localhost:6000';
const API_KEY = process.env.EXTERNAL_SERVICE_API_KEY;
const TIMEOUT = 5000; // 5 секунд таймаут

// ================ ЛОГИРОВАНИЕ ================
const logRequest = (method, url, data = null) => {
  console.log(`🌐 [External Service] ${method} ${url}`);
  if (data) {
    console.log(`📦 Request data:`, JSON.stringify(data, null, 2));
  }
};

const logResponse = (method, url, status, data = null) => {
  console.log(`✅ [External Service] ${method} ${url} -> ${status}`);
  if (data) {
    console.log(`📦 Response data:`, JSON.stringify(data, null, 2));
  }
};

const logError = (method, url, error) => {
  console.error(`❌ [External Service] ${method} ${url} failed:`);
  console.error(`   Message: ${error.message}`);
  if (error.response) {
    console.error(`   Status: ${error.response.status}`);
    console.error(`   Data:`, error.response.data);
  }
  if (error.code === 'ECONNABORTED') {
    console.error(`   ⏱️ Request timeout (${TIMEOUT}ms)`);
  }
};

// ================ ОСНОВНЫЕ МЕТОДЫ ================

/**
 * Валидация пользователя во внешнем сервисе
 * 
 * @param {string} username - Имя пользователя (логин)
 * @param {string} password - Пароль
 * @returns {Promise<Object|null>} - Данные пользователя или null
 */
const validateUser = async (username, password) => {
  const url = `${EXTERNAL_SERVICE_URL}/api/auth/validate`;
  
  logRequest('POST', url, { username, password: '***' });
  
  try {
    const response = await axios.post(
      url,
      {
        username,
        password
      },
      {
        headers: {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: TIMEOUT
      }
    );
    
    logResponse('POST', url, response.status, response.data);
    
    if (response.data.success && response.data.user) {
      // Возвращаем данные БЕЗ роли
      const { role, ...userWithoutRole } = response.data.user;
      return userWithoutRole;
    }
    
    return null;
    
  } catch (error) {
    logError('POST', url, error);
    
    if (error.response && (error.response.status === 401 || error.response.status === 404)) {
      return null;
    }
    
    if (error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED') {
      throw new Error('Внешний сервис не отвечает. Попробуйте позже.');
    }
    
    throw new Error(`Ошибка внешнего сервиса: ${error.message}`);
  }
};

/**
 * Получение пользователя по username
 * 
 * @param {string} username - Имя пользователя
 * @returns {Promise<Object|null>} - Данные пользователя или null
 */
const getUserByUsername = async (username) => {
  const url = `${EXTERNAL_SERVICE_URL}/api/users/${username}`;
  
  logRequest('GET', url);
  
  try {
    const response = await axios.get(
      url,
      {
        headers: {
          'X-API-Key': API_KEY
        },
        timeout: TIMEOUT
      }
    );
    
    logResponse('GET', url, response.status, response.data);
    
    if (response.data.success && response.data.user) {
      const { role, ...userWithoutRole } = response.data.user;
      return userWithoutRole;
    }
    
    return null;
    
  } catch (error) {
    logError('GET', url, error);
    
    if (error.response && error.response.status === 404) {
      return null;
    }
    
    throw new Error(`Ошибка получения данных пользователя: ${error.message}`);
  }
};

/**
 * Получение списка всех пользователей
 * 
 * @returns {Promise<Array>} - Массив пользователей
 */
const getAllUsers = async () => {
  const url = `${EXTERNAL_SERVICE_URL}/api/users`;
  
  logRequest('GET', url);
  
  try {
    const response = await axios.get(
      url,
      {
        headers: {
          'X-API-Key': API_KEY
        },
        timeout: TIMEOUT * 2
      }
    );
    
    logResponse('GET', url, response.status, response.data);
    
    if (response.data.success && response.data.users) {
      // Убираем роли из всех пользователей
      return response.data.users.map(({ role, ...user }) => user);
    }
    
    return [];
    
  } catch (error) {
    logError('GET', url, error);
    throw new Error(`Ошибка получения списка пользователей: ${error.message}`);
  }
};

/**
 * ================ НОВАЯ ФУНКЦИЯ: ПРОВЕРКА ДОСТУПНОСТИ ================
 * 
 * Проверка доступности внешнего сервиса
 * Используется для health check
 * 
 * @returns {Promise<boolean>} - Доступен ли сервис
 */
const checkExternalServiceHealth = async () => {
  const url = `${EXTERNAL_SERVICE_URL}/api/health`;
  
  try {
    const response = await axios.get(
      url,
      {
        timeout: 3000, // 3 секунды для health check
        headers: {
          'X-API-Key': API_KEY
        }
      }
    );
    
    // Проверяем, что сервис ответил успешно
    if (response.status === 200 && response.data && response.data.success !== false) {
      console.log(`✅ External service is healthy: ${EXTERNAL_SERVICE_URL}`);
      return true;
    }
    
    console.warn(`⚠️ External service returned unhealthy status`);
    return false;
  } catch (error) {
    // Логируем ошибку, но не бросаем исключение
    console.warn(`⚠️ External service health check failed: ${error.message}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.warn(`   💡 Сервис не доступен по адресу: ${EXTERNAL_SERVICE_URL}`);
    }
    
    return false;
  }
};

// ================ ДОПОЛНИТЕЛЬНЫЕ МЕТОДЫ ================

/**
 * Обновление данных пользователя во внешнем сервисе
 * 
 * @param {string} username - Имя пользователя
 * @param {Object} data - Данные для обновления
 * @returns {Promise<Object>} - Обновленные данные
 */
const updateUserInExternal = async (username, data) => {
  const url = `${EXTERNAL_SERVICE_URL}/api/users/${username}`;
  
  logRequest('PUT', url, data);
  
  try {
    const response = await axios.put(
      url,
      data,
      {
        headers: {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: TIMEOUT
      }
    );
    
    logResponse('PUT', url, response.status, response.data);
    
    if (response.data.success && response.data.user) {
      const { role, ...userWithoutRole } = response.data.user;
      return userWithoutRole;
    }
    
    throw new Error('Внешний сервис вернул ошибку при обновлении');
    
  } catch (error) {
    logError('PUT', url, error);
    throw new Error(`Ошибка обновления данных во внешнем сервисе: ${error.message}`);
  }
};

// ================ ЭКСПОРТ ================
module.exports = {
  validateUser,
  getUserByUsername,
  getAllUsers,
  updateUserInExternal,
  checkExternalServiceHealth // <-- ВАЖНО: экспортируем функцию!
>>>>>>> 1c6164c7b8cd6ec8ce3f3de3a0d18819aa26465c
};