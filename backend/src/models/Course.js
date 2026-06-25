<<<<<<< HEAD
/**
 * МОДЕЛЬ COURSE (Курс)
 * 
 * Назначение: Хранит информацию о курсах в системе
 * Связи: принадлежит автору (User), имеет множество назначений (Assignment)
 * 
 * Поля:
 * - id: UUID - уникальный идентификатор курса
 * - title: строка - название курса (обязательное)
 * - description: текст - описание курса
 * - coverImage: строка - URL обложки курса
 * - content: JSONB - структурированный контент курса (блоки)
 * - duration: число - длительность в часах
 * - level: ENUM - уровень сложности (BEGINNER, INTERMEDIATE, ADVANCED)
 * - isPublished: boolean - опубликован ли курс
 * - authorId: UUID - ID автора (методиста)
 * - createdAt, updatedAt: даты
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  coverImage: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'cover_image'
  },
  content: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  level: {
    type: DataTypes.ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED'),
    defaultValue: 'BEGINNER'
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_published'
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'author_id'
  },
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
  tableName: 'courses',
  timestamps: true,
  underscored: true
});

=======
/**
 * МОДЕЛЬ COURSE (Курс)
 * 
 * Назначение: Хранит информацию о курсах в системе
 * Связи: принадлежит автору (User), имеет множество назначений (Assignment)
 * 
 * Поля:
 * - id: UUID - уникальный идентификатор курса
 * - title: строка - название курса (обязательное)
 * - description: текст - описание курса
 * - coverImage: строка - URL обложки курса
 * - content: JSONB - структурированный контент курса (блоки)
 * - duration: число - длительность в часах
 * - level: ENUM - уровень сложности (BEGINNER, INTERMEDIATE, ADVANCED)
 * - isPublished: boolean - опубликован ли курс
 * - authorId: UUID - ID автора (методиста)
 * - createdAt, updatedAt: даты
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  coverImage: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'cover_image'
  },
  content: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  level: {
    type: DataTypes.ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED'),
    defaultValue: 'BEGINNER'
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_published'
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'author_id'
  },
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
  tableName: 'courses',
  timestamps: true,
  underscored: true
});

>>>>>>> 1c6164c7b8cd6ec8ce3f3de3a0d18819aa26465c
module.exports = Course;