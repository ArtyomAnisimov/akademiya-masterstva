/**
 * Хук для работы с аутентификацией
 * Обертка над useAuth для удобства
 */

import { useAuth } from '../contexts/AuthContext';

export const useAuth = () => {
  const auth = useAuth();
  return auth;
};