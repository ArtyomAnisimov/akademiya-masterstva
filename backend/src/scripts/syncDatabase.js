/**
 * СКРИПТ СИНХРОНИЗАЦИИ БАЗЫ ДАННЫХ
 * 
 * Создает таблицы и тестовые данные
 * Запуск: npm run sync-db
 */

// Правильный импорт sequelize из конфига
const { sequelize } = require('../config/database');
// Импортируем модели
const { User, Course, CoursePrerequisite, Assignment, Progress } = require('../models');
const { hashPassword } = require('../utils/auth');
const { ROLES } = require('../utils/constants');

const syncDatabase = async () => {
  try {
    console.log('🔄 Синхронизация базы данных...');
    console.log('🏫 Академия Мастерства\n');
    
    // Используем sequelize из конфига для синхронизации
    await sequelize.sync({ force: true });
    console.log('✅ База данных синхронизирована успешно\n');

    console.log('📝 Создание тестовых пользователей:');
    console.log('─────────────────────────────────────────────');

    // ================ АДМИНИСТРАТОР ================
    const adminPassword = await hashPassword('admin123');
    const admin = await User.create({
      username: 'admin',
      passwordHash: adminPassword,
      fullName: 'Главный Администратор',
      role: ROLES.ADMIN
    });
    console.log('👑 Админ: admin / admin123');

    // ================ МЕТОДИСТ ================
    const methodistPassword = await hashPassword('methodist123');
    const methodist = await User.create({
      username: 'methodist',
      passwordHash: methodistPassword,
      fullName: 'Анна Петрова',
      role: ROLES.METHODIST
    });
    console.log('📚 Методист: methodist / methodist123');

    // ================ РУКОВОДИТЕЛЬ ================
    const directorPassword = await hashPassword('director123');
    const director = await User.create({
      username: 'director',
      passwordHash: directorPassword,
      fullName: 'Сергей Иванов',
      role: ROLES.DIRECTOR
    });
    console.log('👔 Руководитель: director / director123');

    // ================ СПЕЦИАЛИСТ ================
    const specialistPassword = await hashPassword('specialist123');
    const specialist = await User.create({
      username: 'мария.смирнова',
      passwordHash: specialistPassword,
      fullName: 'Мария Смирнова',
      role: ROLES.SPECIALIST
    });
    console.log('👩‍💻 Специалист: мария.смирнова / specialist123');

    // ================ ТЕСТОВЫЙ КУРС ================
    console.log('\n📝 Создание тестового курса...');
    
    const course = await Course.create({
  title: 'Введение в платформу 1С',
  description: 'Базовый курс для знакомства с платформой 1С',
  coverImage: null,
  content: [
    {
      type: 'text',
      title: 'Введение',
      data: { content: '<h2>Добро пожаловать!</h2><p>Это тестовый курс</p>' }
    }
  ],
  level: 'BEGINNER',
  duration: 2,
  authorId: methodist.id,
  isPublished: true
});
    console.log('📖 Создан тестовый курс:');
    console.log(`   Название: ${course.title}`);
    console.log(`   Автор: ${methodist.fullName}`);

    // ================ НАЗНАЧЕНИЕ КУРСА ================
    console.log('\n📝 Назначение курса специалисту...');
    
    const assignment = await Assignment.create({
      courseId: course.id,
      specialistId: specialist.id,
      assignedBy: director.id,
      status: 'ASSIGNED'
    });
    console.log('✅ Курс назначен специалисту');

    // ================ ПРОГРЕСС ================
    await Progress.create({
      assignmentId: assignment.id,
      completedBlocks: [],
      progressPercent: 0
    });
    console.log('✅ Создана запись прогресса');

    console.log('\n─────────────────────────────────────────────');
    console.log('✅ Инициализация завершена успешно!');
    console.log('\n📝 Данные для входа:');
    console.log('─────────────────────────────────────────────');
    console.log('👑 Админ:       admin / admin123');
    console.log('📚 Методист:    methodist / methodist123');
    console.log('👔 Руководитель: director / director123');
    console.log('👩‍💻 Специалист:  мария.смирнова / specialist123');
    console.log('─────────────────────────────────────────────\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка синхронизации:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

syncDatabase();