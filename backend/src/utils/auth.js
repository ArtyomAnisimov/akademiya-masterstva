<<<<<<< HEAD
/**
 * УТИЛИТЫ АУТЕНТИФИКАЦИИ
 * 
 * ВАЖНО: generateToken теперь принимает ВСЕ данные пользователя
 * (включая данные из внешнего сервиса)
 * Эти данные НЕ хранятся в БД, но передаются в токене
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'akademiya-masterstva-secret-key';

const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Генерация JWT токена
 * 
 * Принимает объект с ВСЕМИ данными пользователя:
 * - локальные: id, username, role
 * - внешние: fullName, experience, grade
 * 
 * Все данные будут доступны на фронтенде из токена
 */
const generateToken = (userData) => {
  const payload = {
    id: userData.id,
    username: userData.username,
    role: userData.role,
    // Данные из внешнего сервиса (не хранятся в БД!)
    fullName: userData.fullName,
    experience: userData.experience || 0,
    grade: userData.grade || null
  };
  
  return jwt.sign(
    payload,
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken
=======
/**
 * УТИЛИТЫ АУТЕНТИФИКАЦИИ
 * 
 * ВАЖНО: generateToken теперь принимает ВСЕ данные пользователя
 * (включая данные из внешнего сервиса)
 * Эти данные НЕ хранятся в БД, но передаются в токене
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'akademiya-masterstva-secret-key';

const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Генерация JWT токена
 * 
 * Принимает объект с ВСЕМИ данными пользователя:
 * - локальные: id, username, role
 * - внешние: fullName, experience, grade
 * 
 * Все данные будут доступны на фронтенде из токена
 */
const generateToken = (userData) => {
  const payload = {
    id: userData.id,
    username: userData.username,
    role: userData.role,
    // Данные из внешнего сервиса (не хранятся в БД!)
    fullName: userData.fullName,
    experience: userData.experience || 0,
    grade: userData.grade || null
  };
  
  return jwt.sign(
    payload,
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken
>>>>>>> 1c6164c7b8cd6ec8ce3f3de3a0d18819aa26465c
};