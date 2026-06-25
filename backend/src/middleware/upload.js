const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');

console.log('📁 uploadDir:', uploadDir);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // ПРОВЕРЯЕМ ВСЕ ВОЗМОЖНЫЕ МЕСТА
    console.log('========== MULTER DESTINATION ==========');
    console.log('req.body:', req.body);
    console.log('req.query:', req.query);
    console.log('req.headers:', req.headers);
    
    // multer не видит body при multipart/form-data
    // Используем query параметр ИЛИ берем из заголовка
    let type = req.query.type || req.headers['x-type'] || 'content';
    
    // Если ничего нет - пробуем разобрать body вручную
    if (!type || type === 'content') {
      // Проверяем, есть ли type в body (если multer уже обработал)
      if (req.body && req.body.type) {
        type = req.body.type;
      }
    }
    
    console.log('📁 Итоговый тип:', type);
    
    const targetDir = path.join(uploadDir, type === 'cover' ? 'covers' : 'content');
    console.log('📁 Сохраняем в:', targetDir);
    
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    cb(null, targetDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Только изображения!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter
});

module.exports = {
  uploadImage: upload.single('image')
};