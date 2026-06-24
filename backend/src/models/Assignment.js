/**
 * МОДЕЛЬ ASSIGNMENT (Назначение курса)
 * 
 * Назначение: Хранит информацию о назначении курсов специалистам
 * 
 * Поля:
 * - id: UUID - уникальный идентификатор назначения
 * - courseId: UUID - ID курса
 * - specialistId: UUID - ID специалиста (ученика)
 * - assignedBy: UUID - ID руководителя, который назначил
 * - status: ENUM - статус назначения (ASSIGNED, IN_PROGRESS, COMPLETED)
 * - assignedAt: дата назначения
 * - startedAt: дата начала прохождения
 * - completedAt: дата завершения
 * - deadline: срок прохождения
 * 
 * Связи: belongsTo User (specialist, assigner), belongsTo Course
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Assignment = sequelize.define('Assignment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'Уникальный идентификатор назначения'
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'course_id',
    comment: 'ID курса, который назначен'
  },
  specialistId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'specialist_id',
    comment: 'ID специалиста (ученика)'
  },
  assignedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'assigned_by',
    comment: 'ID руководителя, который назначил курс'
  },
  status: {
    type: DataTypes.ENUM('ASSIGNED', 'IN_PROGRESS', 'COMPLETED'),
    defaultValue: 'ASSIGNED',
    allowNull: false,
    comment: 'Статус прохождения: ASSIGNED (назначен), IN_PROGRESS (в процессе), COMPLETED (завершен)'
  },
  assignedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'assigned_at',
    comment: 'Дата и время назначения'
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'started_at',
    comment: 'Дата и время начала прохождения'
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'completed_at',
    comment: 'Дата и время завершения'
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Срок прохождения (дедлайн)'
  }
}, {
  tableName: 'assignments',
  timestamps: false,
  underscored: true,
  indexes: [
    { fields: ['course_id'], name: 'idx_assignments_course' },
    { fields: ['specialist_id'], name: 'idx_assignments_specialist' },
    { fields: ['status'], name: 'idx_assignments_status' }
  ],
  comment: 'Таблица назначений курсов специалистам'
});

module.exports = Assignment;