<<<<<<< HEAD
/**
 * Настройка HTTP клиента для общения с бэкендом
 */

import axios from 'axios';

// Базовый URL для API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Создаем экземпляр axios с базовыми настройками
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ================ ИНТЕРСЕПТОРЫ ================

// Перехватчик запросов - добавляет токен к каждому запросу
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Перехватчик ответов - обрабатывает ошибки авторизации
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Если токен истек или недействительный
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

=======
/**
 * Настройка HTTP клиента для общения с бэкендом
 */

import axios from 'axios';

// Базовый URL для API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Создаем экземпляр axios с базовыми настройками
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ================ ИНТЕРСЕПТОРЫ ================

// Перехватчик запросов - добавляет токен к каждому запросу
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Перехватчик ответов - обрабатывает ошибки авторизации
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Если токен истек или недействительный
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

>>>>>>> 1c6164c7b8cd6ec8ce3f3de3a0d18819aa26465c
export default apiClient;