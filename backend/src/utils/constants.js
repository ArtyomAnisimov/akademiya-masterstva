<<<<<<< HEAD
/**
 * КОНСТАНТЫ ПРИЛОЖЕНИЯ
 * 
 * Здесь хранятся все константы, чтобы избежать магических строк
 * и упростить поддержку кода
 */

/**
 * Роли пользователей
 * Определяют права доступа в системе
 */
const ROLES = {
  ADMIN: 'ADMIN',
  METHODIST: 'METHODIST',
  DIRECTOR: 'DIRECTOR',
  SPECIALIST: 'SPECIALIST'
};

/**
 * Список всех ролей для валидации
 * Используется при проверке ролей в модели и middleware
 */
const ALL_ROLES = Object.values(ROLES);

/**
 * Статусы курсов для специалиста
 */
const COURSE_STATUS = {
  NOT_STARTED: 'NOT_STARTED',    // Не начат
  IN_PROGRESS: 'IN_PROGRESS',    // В процессе
  COMPLETED: 'COMPLETED',        // Завершен
  BLOCKED: 'BLOCKED'             // Заблокирован (нужны пререквизиты)
};

/**
 * Статусы назначения курсов
 */
const ASSIGNMENT_STATUS = {
  ASSIGNED: 'ASSIGNED',          // Назначен
  IN_PROGRESS: 'IN_PROGRESS',    // В процессе
  COMPLETED: 'COMPLETED'         // Завершен
};

/**
 * Сообщения об ошибках
 */
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Требуется авторизация',
  FORBIDDEN: 'Недостаточно прав доступа',
  INVALID_CREDENTIALS: 'Неверное имя пользователя или пароль',
  USER_NOT_FOUND: 'Пользователь не найден',
  USER_EXISTS: 'Пользователь с таким именем уже существует',
  INTERNAL_ERROR: 'Внутренняя ошибка сервера',
  EXTERNAL_SERVICE_ERROR: 'Ошибка при обращении к внешнему сервису',
  TOKEN_EXPIRED: 'Срок действия токена истек',
  INVALID_TOKEN: 'Недействительный токен'
};

module.exports = {
  ROLES,
  ALL_ROLES,
  COURSE_STATUS,
  ASSIGNMENT_STATUS,
  ERROR_MESSAGES
=======
/**
 * КОНСТАНТЫ ПРИЛОЖЕНИЯ
 * 
 * Здесь хранятся все константы, чтобы избежать магических строк
 * и упростить поддержку кода
 */

/**
 * Роли пользователей
 * Определяют права доступа в системе
 */
const ROLES = {
  ADMIN: 'ADMIN',
  METHODIST: 'METHODIST',
  DIRECTOR: 'DIRECTOR',
  SPECIALIST: 'SPECIALIST'
};

/**
 * Список всех ролей для валидации
 * Используется при проверке ролей в модели и middleware
 */
const ALL_ROLES = Object.values(ROLES);

/**
 * Статусы курсов для специалиста
 */
const COURSE_STATUS = {
  NOT_STARTED: 'NOT_STARTED',    // Не начат
  IN_PROGRESS: 'IN_PROGRESS',    // В процессе
  COMPLETED: 'COMPLETED',        // Завершен
  BLOCKED: 'BLOCKED'             // Заблокирован (нужны пререквизиты)
};

/**
 * Статусы назначения курсов
 */
const ASSIGNMENT_STATUS = {
  ASSIGNED: 'ASSIGNED',          // Назначен
  IN_PROGRESS: 'IN_PROGRESS',    // В процессе
  COMPLETED: 'COMPLETED'         // Завершен
};

/**
 * Сообщения об ошибках
 */
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Требуется авторизация',
  FORBIDDEN: 'Недостаточно прав доступа',
  INVALID_CREDENTIALS: 'Неверное имя пользователя или пароль',
  USER_NOT_FOUND: 'Пользователь не найден',
  USER_EXISTS: 'Пользователь с таким именем уже существует',
  INTERNAL_ERROR: 'Внутренняя ошибка сервера',
  EXTERNAL_SERVICE_ERROR: 'Ошибка при обращении к внешнему сервису',
  TOKEN_EXPIRED: 'Срок действия токена истек',
  INVALID_TOKEN: 'Недействительный токен'
};

module.exports = {
  ROLES,
  ALL_ROLES,
  COURSE_STATUS,
  ASSIGNMENT_STATUS,
  ERROR_MESSAGES
>>>>>>> 1c6164c7b8cd6ec8ce3f3de3a0d18819aa26465c
};