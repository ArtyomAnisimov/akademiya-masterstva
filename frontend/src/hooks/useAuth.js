<<<<<<< HEAD
/**
 * Хук для работы с аутентификацией
 * Обертка над useAuth для удобства
 */

import { useAuth } from '../contexts/AuthContext';

export const useAuth = () => {
  const auth = useAuth();
  return auth;
=======
/**
 * Хук для работы с аутентификацией
 * Обертка над useAuth для удобства
 */

import { useAuth } from '../contexts/AuthContext';

export const useAuth = () => {
  const auth = useAuth();
  return auth;
>>>>>>> 1c6164c7b8cd6ec8ce3f3de3a0d18819aa26465c
};