<<<<<<< HEAD
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { sequelize, testConnection } = require('./src/config/database');

// Импорт маршрутов jjjjjjjj
const authRoutes = require('./src/routes/auth');
const adminRoutes = require('./src/routes/admin');
const courseRoutes = require('./src/routes/courses');
const healthRoutes = require('./src/routes/health');
const uploadRoutes = require('./src/routes/upload');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// РАЗДАЧА СТАТИКИ
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// ================ ТЕСТОВЫЙ МАРШРУТ ================
app.get('/test-uploads', (req, res) => {
  try {
    const coversPath = path.join(uploadsPath, 'covers');
    const contentPath = path.join(uploadsPath, 'content');
    
    res.json({
      success: true,
      uploadsPath: uploadsPath,
      files: {
        uploads: fs.existsSync(uploadsPath) ? fs.readdirSync(uploadsPath) : [],
        covers: fs.existsSync(coversPath) ? fs.readdirSync(coversPath) : [],
        content: fs.existsSync(contentPath) ? fs.readdirSync(contentPath) : []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

testConnection();

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.json({ success: true, message: '🏫 Академия Мастерства API' });
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ success: false, message: 'Внутренняя ошибка' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Маршрут не найден' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
=======
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { sequelize, testConnection } = require('./src/config/database');

// Импорт маршрутов
const authRoutes = require('./src/routes/auth');
const adminRoutes = require('./src/routes/admin');
const courseRoutes = require('./src/routes/courses');
const healthRoutes = require('./src/routes/health');
const uploadRoutes = require('./src/routes/upload');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// РАЗДАЧА СТАТИКИ
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// ================ ТЕСТОВЫЙ МАРШРУТ ================
app.get('/test-uploads', (req, res) => {
  try {
    const coversPath = path.join(uploadsPath, 'covers');
    const contentPath = path.join(uploadsPath, 'content');
    
    res.json({
      success: true,
      uploadsPath: uploadsPath,
      files: {
        uploads: fs.existsSync(uploadsPath) ? fs.readdirSync(uploadsPath) : [],
        covers: fs.existsSync(coversPath) ? fs.readdirSync(coversPath) : [],
        content: fs.existsSync(contentPath) ? fs.readdirSync(contentPath) : []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

testConnection();

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.json({ success: true, message: '🏫 Академия Мастерства API' });
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ success: false, message: 'Внутренняя ошибка' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Маршрут не найден' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
>>>>>>> 1c6164c7b8cd6ec8ce3f3de3a0d18819aa26465c
});