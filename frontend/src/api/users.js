<<<<<<< HEAD
/**
 * API методы для управления пользователями
 * Доступны только для ADMIN
 */

import apiClient from './client';

/**
 * Получение списка всех пользователей
 * @returns {Promise} - Список пользователей
 */
export const getUsers = async () => {
  const response = await apiClient.get('/admin/users');
  return response.data;
};

/**
 * Изменение роли пользователя
 * @param {string} userId - ID пользователя
 * @param {string} role - Новая роль
 * @returns {Promise} - Обновленный пользователь
 */
export const updateUserRole = async (userId, role) => {
  const response = await apiClient.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};

/**
 * Синхронизация пользователей из внешнего сервиса
 * @returns {Promise} - Результат синхронизации
 */
export const syncUsers = async () => {
  const response = await apiClient.post('/admin/users/sync');
  return response.data;
=======
/**
 * API методы для управления пользователями
 * Доступны только для ADMIN
 */

import apiClient from './client';

/**
 * Получение списка всех пользователей
 * @returns {Promise} - Список пользователей
 */
export const getUsers = async () => {
  const response = await apiClient.get('/admin/users');
  return response.data;
};

/**
 * Изменение роли пользователя
 * @param {string} userId - ID пользователя
 * @param {string} role - Новая роль
 * @returns {Promise} - Обновленный пользователь
 */
export const updateUserRole = async (userId, role) => {
  const response = await apiClient.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};

/**
 * Синхронизация пользователей из внешнего сервиса
 * @returns {Promise} - Результат синхронизации
 */
export const syncUsers = async () => {
  const response = await apiClient.post('/admin/users/sync');
  return response.data;
>>>>>>> 1c6164c7b8cd6ec8ce3f3de3a0d18819aa26465c
};