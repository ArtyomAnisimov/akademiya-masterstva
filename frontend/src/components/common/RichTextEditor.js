/**
 * КОМПОНЕНТ RICH TEXT EDITOR
 * 
 * WYSIWYG редактор на основе react-quill
 * Поддерживает форматирование текста, вставку изображений
 */

import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { uploadImage } from '../../api/upload';

// ================ НАСТРОЙКИ РЕДАКТОРА ================

// Модули редактора
const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
    handlers: {
      // Переопределяем обработчик вставки изображения
      image: function() {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
          const file = input.files[0];
          if (!file) return;

          // Проверяем размер файла (максимум 10MB)
          if (file.size > 10 * 1024 * 1024) {
            alert('Размер изображения не должен превышать 10MB');
            return;
          }

          const quill = this.quill;
          const range = quill.getSelection();
          const loadingIndex = range ? range.index : quill.getLength();

          // Вставляем индикатор загрузки
          quill.insertText(loadingIndex, '⏳ Загрузка изображения...');

          try {
            // Загружаем изображение на сервер
            const response = await uploadImage(file, 'content');
            
            if (response.success) {
              // Удаляем индикатор загрузки
              quill.deleteText(loadingIndex, '⏳ Загрузка изображения...'.length);
              
              // Вставляем изображение
              quill.insertEmbed(loadingIndex, 'image', response.data.url);
              // Перемещаем курсор после изображения
              quill.setSelection(loadingIndex + 1);
            } else {
              throw new Error('Ошибка загрузки');
            }
          } catch (error) {
            console.error('Error uploading image:', error);
            // Удаляем индикатор загрузки и показываем ошибку
            quill.deleteText(loadingIndex, '⏳ Загрузка изображения...'.length);
            quill.insertText(loadingIndex, '❌ Ошибка загрузки изображения', { color: '#E11D2C' });
          }
        };
      }
    }
  }
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet', 'check',
  'indent',
  'align',
  'blockquote', 'code-block',
  'link', 'image', 'video'
];

// ================ КОМПОНЕНТ ================

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = 'Введите текст...',
  readOnly = false,
  height = 300
}) => {
  const quillRef = useRef(null);

  return (
    <div className="rich-text-editor-container">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
        style={{ height: height }}
        className="custom-quill-editor"
      />
      <div className="editor-hint" style={{ 
        marginTop: '8px', 
        fontSize: '12px', 
        color: '#71717A',
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <span>💡 Для вставки изображения нажмите на иконку 🖼️ в панели инструментов</span>
        <span>📝 Изображения загружаются на сервер автоматически</span>
      </div>
    </div>
  );
};

export default RichTextEditor;