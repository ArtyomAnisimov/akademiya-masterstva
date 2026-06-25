const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CoursePrerequisite = sequelize.define('CoursePrerequisite', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'course_id'
  },
  prerequisiteId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'prerequisite_id'
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
  tableName: 'course_prerequisites',
  timestamps: true,
  underscored: true
});

module.exports = CoursePrerequisite;