<<<<<<< HEAD
/**
 * МОДЕЛЬ USER (Пользователь)
 * 
 * ВАЖНО: Роль ХРАНИТСЯ в локальной БД и управляется администратором!
 * Остальные данные (ФИО, стаж, грейд) - из внешнего сервиса.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { ALL_ROLES } = require('../utils/constants');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'Уникальный идентификатор пользователя'
  },
  
  /**
   * username - логин из внешнего сервиса
   * Уникальный идентификатор для связи с внешним сервисом
   */
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [3, 50],
      isValidUsername(value) {
        if (!/^[\p{L}\p{N}._-]+$/u.test(value)) {
          throw new Error('Имя пользователя может содержать только буквы, цифры, . _ -');
        }
      }
    },
    comment: 'Логин из внешнего сервиса'
  },
  
  /**
   * passwordHash - кэш пароля для быстрой авторизации
   * Обновляется при каждом успешном логине
   */
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password_hash',
    comment: 'Хеш пароля (кэш для быстрой авторизации)'
  },
  
  /**
   * role - РОЛЬ В НАШЕЙ СИСТЕМЕ
   * 
   * ВАЖНО: Это локальные данные!
   * Назначается администратором через админ-панель
   * НЕ приходит из внешнего сервиса
   */
  role: {
    type: DataTypes.ENUM(ALL_ROLES),
    allowNull: false,
    defaultValue: 'SPECIALIST',
    comment: 'Роль в системе (назначается администратором)'
  },
  
  // ================ СИСТЕМНЫЕ ПОЛЯ ================
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  indexes: [
    { unique: true, fields: ['username'] },
    { fields: ['role'] }
  ],
  comment: 'Таблица пользователей (роль - локальные данные)'
});

=======
/**
 * МОДЕЛЬ USER (Пользователь)
 * 
 * ВАЖНО: Роль ХРАНИТСЯ в локальной БД и управляется администратором!
 * Остальные данные (ФИО, стаж, грейд) - из внешнего сервиса.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { ALL_ROLES } = require('../utils/constants');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'Уникальный идентификатор пользователя'
  },
  
  /**
   * username - логин из внешнего сервиса
   * Уникальный идентификатор для связи с внешним сервисом
   */
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [3, 50],
      isValidUsername(value) {
        if (!/^[\p{L}\p{N}._-]+$/u.test(value)) {
          throw new Error('Имя пользователя может содержать только буквы, цифры, . _ -');
        }
      }
    },
    comment: 'Логин из внешнего сервиса'
  },
  
  /**
   * passwordHash - кэш пароля для быстрой авторизации
   * Обновляется при каждом успешном логине
   */
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password_hash',
    comment: 'Хеш пароля (кэш для быстрой авторизации)'
  },
  
  /**
   * role - РОЛЬ В НАШЕЙ СИСТЕМЕ
   * 
   * ВАЖНО: Это локальные данные!
   * Назначается администратором через админ-панель
   * НЕ приходит из внешнего сервиса
   */
  role: {
    type: DataTypes.ENUM(ALL_ROLES),
    allowNull: false,
    defaultValue: 'SPECIALIST',
    comment: 'Роль в системе (назначается администратором)'
  },
  
  // ================ СИСТЕМНЫЕ ПОЛЯ ================
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  indexes: [
    { unique: true, fields: ['username'] },
    { fields: ['role'] }
  ],
  comment: 'Таблица пользователей (роль - локальные данные)'
});

>>>>>>> 1c6164c7b8cd6ec8ce3f3de3a0d18819aa26465c
module.exports = User;