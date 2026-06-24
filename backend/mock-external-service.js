/**
 * МОК ВНЕШНЕГО СЕРВИСА
 * 
 * ВАЖНО: Возвращает данные БЕЗ РОЛИ!
 * Роль определяется в нашем приложении
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 6000;

app.use(cors());
app.use(express.json());

// ================ ТЕСТОВЫЕ ПОЛЬЗОВАТЕЛИ ================
// ВНИМАНИЕ: Роль НЕ хранится во внешнем сервисе!
const users = {
  'admin': {
    username: 'admin',
    password: 'admin123',
    fullName: 'Семибратская Екатерина',
    experience: 10,
    grade: 'senior'
    // роль НЕТ!
  },
  'methodist': {
    username: 'methodist',
    password: 'methodist123',
    fullName: 'Анна Петрова',
    experience: 7,
    grade: 'senior'
  },
  'director': {
    username: 'director',
    password: 'director123',
    fullName: 'Сергей Иванов',
    experience: 12,
    grade: 'lead'
  },
  'мария.смирнова': {
    username: 'мария.смирнова',
    password: 'specialist123',
    fullName: 'Мария Смирнова',
    experience: 3,
    grade: 'junior'
  }
};

// ================ МАРШРУТЫ ================

// Health
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok' });
});

// Валидация пользователя
app.post('/api/auth/validate', (req, res) => {
  const { username, password } = req.body;
  
  const user = users[username];
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Пользователь не найден'
    });
  }
  
  if (user.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Неверный пароль'
    });
  }
  
  // Возвращаем данные БЕЗ РОЛИ!
  const { password: _, ...userData } = user;
  
  res.json({
    success: true,
    user: userData // <-- Нет поля role!
  });
});

// Получение пользователя
app.get('/api/users/:username', (req, res) => {
  const { username } = req.params;
  const user = users[username];
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Пользователь не найден'
    });
  }
  
  const { password: _, ...userData } = user;
  
  res.json({
    success: true,
    user: userData // <-- Нет поля role!
  });
});

// Список всех пользователей
app.get('/api/users', (req, res) => {
  const usersList = Object.values(users).map(({ password, ...user }) => user);
  
  res.json({
    success: true,
    users: usersList // <-- Нет поля role!
  });
});

app.listen(PORT, () => {
  console.log(`📡 Мок внешнего сервиса запущен на порту ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📝 Тестовые пользователи (без ролей):`);
  Object.keys(users).forEach(username => {
    console.log(`   ${username} / ${users[username].password}`);
  });
  console.log(`\n💡 Роли назначаются в нашем приложении через админ-панель\n`);
});