/**
 * API МЕТОДЫ ДЛЯ РАБОТЫ С КУРСАМИ
 * 
 * Содержит все запросы к бэкенду для управления курсами
 */

import apiClient from './client';

/**
 * Получение списка курсов
 * @param {Object} params - Параметры фильтрации
 * @param {string} params.level - Уровень сложности
 * @param {boolean} params.isPublished - Опубликован ли курс
 * @param {string} params.search - Поиск по названию
 * @returns {Promise} - Promise с данными курсов
 */
export const getCourses = async (params = {}) => {
  try {
    const response = await apiClient.get('/courses', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

/**
 * Получение курса по ID
 * @param {string} id - ID курса
 * @returns {Promise} - Promise с данными курса
 */
export const getCourse = async (id) => {
  try {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course ${id}:`, error);
    throw error;
  }
};

/**
 * Создание нового курса
 * @param {Object} data - Данные курса
 * @param {string} data.title - Название курса
 * @param {string} data.description - Описание курса
 * @param {string} data.coverImage - URL обложки
 * @param {Array} data.content - Массив блоков контента
 * @param {number} data.duration - Длительность в часах
 * @param {string} data.level - Уровень сложности
 * @param {Array} data.prerequisites - Массив ID пререквизитов
 * @returns {Promise} - Promise с созданным курсом
 */
export const createCourse = async (data) => {
  try {
    const response = await apiClient.post('/courses', data);
    return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

/**
 * Обновление курса
 * @param {string} id - ID курса
 * @param {Object} data - Данные для обновления
 * @returns {Promise} - Promise с обновленным курсом
 */
export const updateCourse = async (id, data) => {
  try {
    const response = await apiClient.put(`/courses/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating course ${id}:`, error);
    throw error;
  }
};

/**
 * Удаление курса
 * @param {string} id - ID курса
 * @returns {Promise} - Promise с результатом удаления
 */
export const deleteCourse = async (id) => {
  try {
    const response = await apiClient.delete(`/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting course ${id}:`, error);
    throw error;
  }
};

/**
 * Публикация курса
 * @param {string} id - ID курса
 * @returns {Promise} - Promise с опубликованным курсом
 */
export const publishCourse = async (id) => {
  try {
    const response = await apiClient.put(`/courses/${id}/publish`);
    return response.data;
  } catch (error) {
    console.error(`Error publishing course ${id}:`, error);
    throw error;
  }
};