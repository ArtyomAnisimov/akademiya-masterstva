<<<<<<< HEAD
/**
 * МОДЕЛЬ PROGRESS (Прогресс прохождения)
 * 
 * Назначение: Хранит прогресс прохождения курса специалистом
 * 
 * Поля:
 * - id: UUID - уникальный идентификатор
 * - assignmentId: UUID - ID назначения
 * - completedBlocks: JSONB - массив завершенных блоков
 * - progressPercent: число - процент прохождения (0-100)
 * - timeSpent: число - время, потраченное на прохождение (в минутах)
 * - lastAccessedAt: дата последнего доступа
 * - updatedAt: дата последнего обновления
 * 
 * Связи: belongsTo Assignment
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Progress = sequelize.define('Progress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'Уникальный идентификатор прогресса'
  },
  assignmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    field: 'assignment_id',
    comment: 'ID назначения, к которому относится прогресс'
  },
  completedBlocks: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    field: 'completed_blocks',
    comment: 'Массив ID завершенных блоков курса'
  },
  progressPercent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'progress_percent',
    validate: {
      min: 0,
      max: 100
    },
    comment: 'Процент прохождения курса (0-100)'
  },
  timeSpent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'time_spent',
    comment: 'Время, затраченное на прохождение (в минутах)'
  },
  lastAccessedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'last_accessed_at',
    comment: 'Дата и время последнего доступа к курсу'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at',
    comment: 'Дата и время последнего обновления прогресса'
  }
}, {
  tableName: 'progress',
  timestamps: false,
  underscored: true,
  indexes: [
    { fields: ['assignment_id'], name: 'idx_progress_assignment' }
  ],
  comment: 'Таблица прогресса прохождения курсов'
});

=======
/**
 * МОДЕЛЬ PROGRESS (Прогресс прохождения)
 * 
 * Назначение: Хранит прогресс прохождения курса специалистом
 * 
 * Поля:
 * - id: UUID - уникальный идентификатор
 * - assignmentId: UUID - ID назначения
 * - completedBlocks: JSONB - массив завершенных блоков
 * - progressPercent: число - процент прохождения (0-100)
 * - timeSpent: число - время, потраченное на прохождение (в минутах)
 * - lastAccessedAt: дата последнего доступа
 * - updatedAt: дата последнего обновления
 * 
 * Связи: belongsTo Assignment
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Progress = sequelize.define('Progress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'Уникальный идентификатор прогресса'
  },
  assignmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    field: 'assignment_id',
    comment: 'ID назначения, к которому относится прогресс'
  },
  completedBlocks: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    field: 'completed_blocks',
    comment: 'Массив ID завершенных блоков курса'
  },
  progressPercent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'progress_percent',
    validate: {
      min: 0,
      max: 100
    },
    comment: 'Процент прохождения курса (0-100)'
  },
  timeSpent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'time_spent',
    comment: 'Время, затраченное на прохождение (в минутах)'
  },
  lastAccessedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'last_accessed_at',
    comment: 'Дата и время последнего доступа к курсу'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at',
    comment: 'Дата и время последнего обновления прогресса'
  }
}, {
  tableName: 'progress',
  timestamps: false,
  underscored: true,
  indexes: [
    { fields: ['assignment_id'], name: 'idx_progress_assignment' }
  ],
  comment: 'Таблица прогресса прохождения курсов'
});

>>>>>>> 1c6164c7b8cd6ec8ce3f3de3a0d18819aa26465c
module.exports = Progress;