<<<<<<< HEAD
/**
 * API методы для аутентификации
 */

import apiClient from './client';

/**
 * Вход в систему
 * @param {string} username - Имя пользователя
 * @param {string} password - Пароль
 * @returns {Promise} - Данные пользователя и токен
 */
export const login = async (username, password) => {
  const response = await apiClient.post('/auth/login', { username, password });
  return response.data;
};

/**
 * Получение данных текущего пользователя
 * @returns {Promise} - Данные пользователя
 */
export const getMe = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

/**
 * Обновление данных из внешнего сервиса
 * @returns {Promise} - Обновленные данные и новый токен
 */
export const refreshUserData = async () => {
  const response = await apiClient.post('/auth/refresh');
  return response.data;
};

/**
 * Выход из системы (очистка localStorage)
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
=======
/**
 * API методы для аутентификации
 */

import apiClient from './client';

/**
 * Вход в систему
 * @param {string} username - Имя пользователя
 * @param {string} password - Пароль
 * @returns {Promise} - Данные пользователя и токен
 */
export const login = async (username, password) => {
  const response = await apiClient.post('/auth/login', { username, password });
  return response.data;
};

/**
 * Получение данных текущего пользователя
 * @returns {Promise} - Данные пользователя
 */
export const getMe = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

/**
 * Обновление данных из внешнего сервиса
 * @returns {Promise} - Обновленные данные и новый токен
 */
export const refreshUserData = async () => {
  const response = await apiClient.post('/auth/refresh');
  return response.data;
};

/**
 * Выход из системы (очистка localStorage)
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
>>>>>>> 1c6164c7b8cd6ec8ce3f3de3a0d18819aa26465c
};