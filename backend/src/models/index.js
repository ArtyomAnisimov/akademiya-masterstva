const sequelize = require('../config/database');
const User = require('./User');
const Course = require('./Course');
const CoursePrerequisite = require('./CoursePrerequisite');
const Assignment = require('./Assignment');
const Progress = require('./Progress');

// ================ USER RELATIONS ================
User.belongsTo(User, { as: 'manager', foreignKey: 'managerId' });
User.hasMany(User, { as: 'subordinates', foreignKey: 'managerId' });

// ================ COURSE RELATIONS ================
User.hasMany(Course, { as: 'coursesCreated', foreignKey: 'authorId' });
Course.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

// ================ COURSE PREREQUISITES ================
Course.belongsToMany(Course, {
  as: 'prerequisites',
  through: CoursePrerequisite,
  foreignKey: 'courseId',
  otherKey: 'prerequisiteId'
});
Course.belongsToMany(Course, {
  as: 'dependentCourses',
  through: CoursePrerequisite,
  foreignKey: 'prerequisiteId',
  otherKey: 'courseId'
});

// ================ ASSIGNMENT RELATIONS ================
User.hasMany(Assignment, { as: 'assignments', foreignKey: 'specialistId' });
User.hasMany(Assignment, { as: 'assignedCourses', foreignKey: 'assignedBy' });
Assignment.belongsTo(User, { as: 'specialist', foreignKey: 'specialistId' });
Assignment.belongsTo(User, { as: 'assigner', foreignKey: 'assignedBy' });

Course.hasMany(Assignment, { as: 'assignments', foreignKey: 'courseId' });
Assignment.belongsTo(Course, { as: 'course', foreignKey: 'courseId' });

// ================ PROGRESS RELATIONS ================
Assignment.hasOne(Progress, { as: 'progress', foreignKey: 'assignmentId' });
Progress.belongsTo(Assignment, { as: 'assignment', foreignKey: 'assignmentId' });

module.exports = {
  sequelize,
  User,
  Course,
  CoursePrerequisite,
  Assignment,
  Progress
};