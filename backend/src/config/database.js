<<<<<<< HEAD
// Импортируем Sequelize из установленной библиотеки
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Загружаем переменные окружения
dotenv.config();

// Создаем экземпляр Sequelize - подключение к БД
const sequelize = new Sequelize(
  // Параметры подключения берутся из .env
  process.env.DB_NAME || 'akademiya_masterstva',    // Имя БД
  process.env.DB_USER || 'postgres',                // Пользователь
  process.env.DB_PASSWORD || 'postgres',            // Пароль
  {
    host: process.env.DB_HOST || 'localhost',       // Хост БД
    port: process.env.DB_PORT || 5432,              // Порт PostgreSQL
    dialect: 'postgres',                            // Тип БД (postgres)
    logging: false,                                 // Отключаем логи SQL запросов
    pool: {                                         // Пул соединений (повышает производительность)
      max: 5,          // Максимум соединений
      min: 0,          // Минимум соединений
      acquire: 30000,  // Время ожидания соединения (30 сек)
      idle: 10000      // Время жизни неактивного соединения (10 сек)
    }
  }
);

// Функция для проверки подключения к БД
// Вызываем при старте сервера
const testConnection = async () => {
  try {
    // authenticate() проверяет, что подключение работает
    await sequelize.authenticate();
    console.log('✅ Подключение к PostgreSQL установлено');
    console.log(`📊 База данных: ${process.env.DB_NAME || 'akademiya_masterstva'}`);
    return true;
  } catch (error) {
    console.error('❌ Ошибка подключения к PostgreSQL:', error.message);
    console.log('💡 Убедитесь, что PostgreSQL запущен и данные в .env верны');
    return false;
  }
};

// Экспортируем для использования в других файлах
=======
// Импортируем Sequelize из установленной библиотеки
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Загружаем переменные окружения
dotenv.config();

// Создаем экземпляр Sequelize - подключение к БД
const sequelize = new Sequelize(
  // Параметры подключения берутся из .env
  process.env.DB_NAME || 'akademiya_masterstva',    // Имя БД
  process.env.DB_USER || 'postgres',                // Пользователь
  process.env.DB_PASSWORD || 'postgres',            // Пароль
  {
    host: process.env.DB_HOST || 'localhost',       // Хост БД
    port: process.env.DB_PORT || 5432,              // Порт PostgreSQL
    dialect: 'postgres',                            // Тип БД (postgres)
    logging: false,                                 // Отключаем логи SQL запросов
    pool: {                                         // Пул соединений (повышает производительность)
      max: 5,          // Максимум соединений
      min: 0,          // Минимум соединений
      acquire: 30000,  // Время ожидания соединения (30 сек)
      idle: 10000      // Время жизни неактивного соединения (10 сек)
    }
  }
);

// Функция для проверки подключения к БД
// Вызываем при старте сервера
const testConnection = async () => {
  try {
    // authenticate() проверяет, что подключение работает
    await sequelize.authenticate();
    console.log('✅ Подключение к PostgreSQL установлено');
    console.log(`📊 База данных: ${process.env.DB_NAME || 'akademiya_masterstva'}`);
    return true;
  } catch (error) {
    console.error('❌ Ошибка подключения к PostgreSQL:', error.message);
    console.log('💡 Убедитесь, что PostgreSQL запущен и данные в .env верны');
    return false;
  }
};

// Экспортируем для использования в других файлах
>>>>>>> 1c6164c7b8cd6ec8ce3f3de3a0d18819aa26465c
module.exports = { sequelize, testConnection };