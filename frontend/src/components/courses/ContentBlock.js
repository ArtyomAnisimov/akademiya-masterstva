<<<<<<< HEAD
/**
 * КОМПОНЕНТ БЛОКА КОНТЕНТА
 * 
 * Отображает и редактирует отдельный блок контента
 * Поддерживает различные типы блоков:
 * - Текст (с WYSIWYG редактором)
 * - Видео
 * - Тренажёр 1С
 * - Тест
 * - Разбор примера
 * - Материалы для скачивания
 */

import React from 'react';
import RichTextEditor from '../common/RichTextEditor';

const ContentBlock = ({ 
  block, 
  index, 
  onUpdate, 
  onRemove, 
  onMove, 
  totalBlocks,
  onImageUpload 
}) => {
  const { id, type, data } = block;

  /**
   * Обновление данных блока
   */
  const updateData = (newData) => {
    onUpdate(id, { ...data, ...newData });
  };

  /**
   * Рендер содержимого в зависимости от типа блока
   */
  const renderBlockContent = () => {
    switch (type) {
      case 'text':
        return (
          <div className="block-content">
            <RichTextEditor
              value={data.content || ''}
              onChange={(content) => updateData({ content })}
              placeholder="Введите текст..."
              height={250}
            />
          </div>
        );

      case 'video':
        return (
          <div className="block-content">
            <input
              type="text"
              value={data.url || ''}
              onChange={(e) => updateData({ url: e.target.value })}
              placeholder="Ссылка на видео (YouTube, Vimeo)"
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #E4E4E7', 
                borderRadius: '4px', 
                fontSize: '14px',
                marginBottom: '12px'
              }}
            />
            {data.url && (
              <div style={{ marginTop: '12px' }}>
                <iframe
                  src={data.url}
                  title="Видео"
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    borderRadius: '4px', 
                    border: '1px solid #E4E4E7' 
                  }}
                  allowFullScreen
                />
              </div>
            )}
          </div>
        );

      case 'simulator':
        return (
          <div className="block-content">
            <input
              type="text"
              value={data.iframeUrl || ''}
              onChange={(e) => updateData({ iframeUrl: e.target.value })}
              placeholder="Ссылка на тренажёр 1С (iframe)"
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #E4E4E7', 
                borderRadius: '4px', 
                fontSize: '14px' 
              }}
            />
            {data.iframeUrl && (
              <div style={{ marginTop: '12px' }}>
                <iframe
                  src={data.iframeUrl}
                  title="Тренажёр 1С"
                  style={{ 
                    width: '100%', 
                    height: '400px', 
                    borderRadius: '4px', 
                    border: '1px solid #E4E4E7' 
                  }}
                  allowFullScreen
                />
              </div>
            )}
          </div>
        );

      case 'test':
        return (
          <div className="block-content">
            {/* Изображение к тесту */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                Изображение к тесту
              </label>
              {data.image ? (
                <div className="image-preview" style={{ position: 'relative', display: 'inline-block' }}>
                  <img 
                    src={data.image} 
                    alt="Изображение теста" 
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '150px', 
                      borderRadius: '4px', 
                      border: '1px solid #E4E4E7' 
                    }} 
                  />
                  <button
                    type="button"
                    onClick={() => updateData({ image: '' })}
                    style={{ 
                      position: 'absolute', 
                      top: '-8px', 
                      right: '-8px', 
                      width: '24px', 
                      height: '24px', 
                      background: '#E11D2C', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '50%', 
                      cursor: 'pointer' 
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label style={{ 
                  display: 'inline-block', 
                  padding: '10px 20px', 
                  background: '#F4F4F5', 
                  border: '1px solid #E4E4E7', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => updateData({ image: reader.result });
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  📷 Загрузить изображение
                </label>
              )}
            </div>
            
            {/* Вопросы теста */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                Вопросы теста
              </label>
              {data.questions && data.questions.map((q, qIndex) => (
                <div key={qIndex} style={{ 
                  background: '#FAFAFA', 
                  padding: '12px', 
                  borderRadius: '4px', 
                  marginBottom: '8px', 
                  border: '1px solid #E4E4E7' 
                }}>
                  <input
                    type="text"
                    value={q.question || ''}
                    onChange={(e) => {
                      const newQuestions = [...data.questions];
                      newQuestions[qIndex].question = e.target.value;
                      updateData({ questions: newQuestions });
                    }}
                    placeholder="Введите вопрос"
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      border: '1px solid #E4E4E7', 
                      borderRadius: '4px', 
                      marginBottom: '8px' 
                    }}
                  />
                  <div>
                    {q.options && q.options.map((opt, oIndex) => (
                      <div key={oIndex} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newQuestions = [...data.questions];
                            newQuestions[qIndex].options[oIndex] = e.target.value;
                            updateData({ questions: newQuestions });
                          }}
                          placeholder="Вариант ответа"
                          style={{ 
                            flex: 1, 
                            padding: '6px', 
                            border: '1px solid #E4E4E7', 
                            borderRadius: '4px' 
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newQuestions = [...data.questions];
                            newQuestions[qIndex].options.splice(oIndex, 1);
                            updateData({ questions: newQuestions });
                          }}
                          style={{ 
                            padding: '4px 8px', 
                            background: '#FEEBEC', 
                            color: '#E11D2C', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer' 
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newQuestions = [...data.questions];
                        newQuestions[qIndex].options.push('');
                        updateData({ questions: newQuestions });
                      }}
                      style={{ 
                        padding: '4px 12px', 
                        background: '#F4F4F5', 
                        border: '1px solid #E4E4E7', 
                        borderRadius: '4px', 
                        cursor: 'pointer', 
                        fontSize: '12px' 
                      }}
                    >
                      + Добавить вариант
                    </button>
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <label style={{ fontSize: '13px' }}>
                      Правильный ответ:
                      <select
                        value={q.correct || ''}
                        onChange={(e) => {
                          const newQuestions = [...data.questions];
                          newQuestions[qIndex].correct = e.target.value;
                          updateData({ questions: newQuestions });
                        }}
                        style={{ 
                          marginLeft: '8px', 
                          padding: '4px 8px', 
                          border: '1px solid #E4E4E7', 
                          borderRadius: '4px' 
                        }}
                      >
                        <option value="">Выберите ответ</option>
                        {q.options && q.options.map((opt, oIndex) => (
                          <option key={oIndex} value={opt}>{opt || `Вариант ${oIndex + 1}`}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newQuestions = [...data.questions];
                      newQuestions.splice(qIndex, 1);
                      updateData({ questions: newQuestions });
                    }}
                    style={{ 
                      marginTop: '8px', 
                      padding: '4px 12px', 
                      background: '#FEEBEC', 
                      color: '#E11D2C', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer', 
                      fontSize: '12px' 
                    }}
                  >
                    Удалить вопрос
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newQuestions = [...(data.questions || [])];
                  newQuestions.push({ question: '', options: ['', ''], correct: '' });
                  updateData({ questions: newQuestions });
                }}
                style={{ 
                  padding: '8px 16px', 
                  background: '#2196F3', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
              >
                + Добавить вопрос
              </button>
            </div>
          </div>
        );

      case 'example':
        return (
          <div className="block-content">
            {/* Задача */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                Задача
              </label>
              <textarea
                value={data.task || ''}
                onChange={(e) => updateData({ task: e.target.value })}
                placeholder="Опишите задачу"
                rows="3"
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #E4E4E7', 
                  borderRadius: '4px', 
                  fontSize: '14px' 
                }}
              />
            </div>
            
            {/* Изображение к задаче */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                Изображение к задаче
              </label>
              {data.taskImage ? (
                <div className="image-preview" style={{ position: 'relative', display: 'inline-block' }}>
                  <img 
                    src={data.taskImage} 
                    alt="Изображение задачи" 
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '150px', 
                      borderRadius: '4px', 
                      border: '1px solid #E4E4E7' 
                    }} 
                  />
                  <button
                    type="button"
                    onClick={() => updateData({ taskImage: '' })}
                    style={{ 
                      position: 'absolute', 
                      top: '-8px', 
                      right: '-8px', 
                      width: '24px', 
                      height: '24px', 
                      background: '#E11D2C', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '50%', 
                      cursor: 'pointer' 
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label style={{ 
                  display: 'inline-block', 
                  padding: '8px 16px', 
                  background: '#F4F4F5', 
                  border: '1px solid #E4E4E7', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => updateData({ taskImage: reader.result });
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  📷 Загрузить изображение
                </label>
              )}
            </div>
            
            {/* Решение */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                Решение
              </label>
              <textarea
                value={data.solution || ''}
                onChange={(e) => updateData({ solution: e.target.value })}
                placeholder="Опишите решение"
                rows="3"
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #E4E4E7', 
                  borderRadius: '4px', 
                  fontSize: '14px' 
                }}
              />
            </div>
            
            {/* Изображение к решению */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                Изображение к решению
              </label>
              {data.solutionImage ? (
                <div className="image-preview" style={{ position: 'relative', display: 'inline-block' }}>
                  <img 
                    src={data.solutionImage} 
                    alt="Изображение решения" 
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '150px', 
                      borderRadius: '4px', 
                      border: '1px solid #E4E4E7' 
                    }} 
                  />
                  <button
                    type="button"
                    onClick={() => updateData({ solutionImage: '' })}
                    style={{ 
                      position: 'absolute', 
                      top: '-8px', 
                      right: '-8px', 
                      width: '24px', 
                      height: '24px', 
                      background: '#E11D2C', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '50%', 
                      cursor: 'pointer' 
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label style={{ 
                  display: 'inline-block', 
                  padding: '8px 16px', 
                  background: '#F4F4F5', 
                  border: '1px solid #E4E4E7', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => updateData({ solutionImage: reader.result });
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  📷 Загрузить изображение
                </label>
              )}
            </div>
            
            {/* Комментарий */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                Комментарий
              </label>
              <textarea
                value={data.comment || ''}
                onChange={(e) => updateData({ comment: e.target.value })}
                placeholder="Добавьте комментарий"
                rows="2"
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #E4E4E7', 
                  borderRadius: '4px', 
                  fontSize: '14px' 
                }}
              />
            </div>
          </div>
        );

      case 'materials':
        return (
          <div className="block-content">
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                Материалы для скачивания
              </label>
              <div style={{ 
                border: '2px dashed #E4E4E7', 
                borderRadius: '4px', 
                padding: '20px', 
                textAlign: 'center' 
              }}>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    const newFiles = files.map(file => ({
                      name: file.name,
                      size: file.size,
                      type: file.type,
                    }));
                    updateData({ files: [...(data.files || []), ...newFiles] });
                  }}
                  style={{ marginBottom: '12px' }}
                />
                <p style={{ color: '#A1A1AA', fontSize: '13px' }}>
                  Выберите файлы для загрузки
                </p>
              </div>
            </div>
            
            {data.files && data.files.length > 0 && (
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                  Загруженные файлы:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {data.files.map((file, fIndex) => (
                    <div key={fIndex} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '8px 12px', 
                      background: '#FAFAFA', 
                      borderRadius: '4px', 
                      border: '1px solid #E4E4E7' 
                    }}>
                      <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newFiles = [...data.files];
                          newFiles.splice(fIndex, 1);
                          updateData({ files: newFiles });
                        }}
                        style={{ 
                          padding: '4px 8px', 
                          background: '#FEEBEC', 
                          color: '#E11D2C', 
                          border: 'none', 
                          borderRadius: '4px', 
                          cursor: 'pointer' 
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return <div className="block-content">Неизвестный тип блока</div>;
    }
  };

  return (
    <div className="content-block">
      {/* Заголовок блока */}
      <div className="block-header">
        <div className="block-title">
          <span className="block-index">Блок {index + 1}</span>
          <strong>
            {type === 'text' && '📝 Текстовый материал'}
            {type === 'video' && '🎬 Видео'}
            {type === 'simulator' && '🖥️ Тренажёр 1С'}
            {type === 'test' && '📝 Тест'}
            {type === 'example' && '📋 Разбор примера'}
            {type === 'materials' && '📁 Материалы для скачивания'}
          </strong>
        </div>
        <div className="block-controls">
          {/* Кнопка перемещения вверх */}
          <button
            type="button"
            className="move-btn"
            onClick={() => onMove(index, -1)}
            disabled={index === 0}
            title="Переместить блок вверх"
          >
            ↑
          </button>
          
          {/* Кнопка перемещения вниз */}
          <button
            type="button"
            className="move-btn"
            onClick={() => onMove(index, 1)}
            disabled={index === totalBlocks - 1}
            title="Переместить блок вниз"
          >
            ↓
          </button>
          
          {/* Кнопка удаления блока */}
          <button
            type="button"
            className="remove-btn"
            onClick={() => onRemove(id)}
            title="Удалить блок"
          >
            Удалить
          </button>
        </div>
      </div>
      
      {/* Содержимое блока */}
      {renderBlockContent()}
    </div>
  );
};

=======
/**
 * КОМПОНЕНТ БЛОКА КОНТЕНТА
 * 
 * Отображает и редактирует отдельный блок контента
 * Поддерживает различные типы блоков:
 * - Текст (с WYSIWYG редактором)
 * - Видео
 * - Тренажёр 1С
 * - Тест
 * - Разбор примера
 * - Материалы для скачивания
 */

import React from 'react';
import RichTextEditor from '../common/RichTextEditor';

const ContentBlock = ({ 
  block, 
  index, 
  onUpdate, 
  onRemove, 
  onMove, 
  totalBlocks,
  onImageUpload 
}) => {
  const { id, type, data } = block;

  /**
   * Обновление данных блока
   */
  const updateData = (newData) => {
    onUpdate(id, { ...data, ...newData });
  };

  /**
   * Рендер содержимого в зависимости от типа блока
   */
  const renderBlockContent = () => {
    switch (type) {
      case 'text':
        return (
          <div className="block-content">
            <RichTextEditor
              value={data.content || ''}
              onChange={(content) => updateData({ content })}
              placeholder="Введите текст..."
              height={250}
            />
          </div>
        );

      case 'video':
        return (
          <div className="block-content">
            <input
              type="text"
              value={data.url || ''}
              onChange={(e) => updateData({ url: e.target.value })}
              placeholder="Ссылка на видео (YouTube, Vimeo)"
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #E4E4E7', 
                borderRadius: '4px', 
                fontSize: '14px',
                marginBottom: '12px'
              }}
            />
            {data.url && (
              <div style={{ marginTop: '12px' }}>
                <iframe
                  src={data.url}
                  title="Видео"
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    borderRadius: '4px', 
                    border: '1px solid #E4E4E7' 
                  }}
                  allowFullScreen
                />
              </div>
            )}
          </div>
        );

      case 'simulator':
        return (
          <div className="block-content">
            <input
              type="text"
              value={data.iframeUrl || ''}
              onChange={(e) => updateData({ iframeUrl: e.target.value })}
              placeholder="Ссылка на тренажёр 1С (iframe)"
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #E4E4E7', 
                borderRadius: '4px', 
                fontSize: '14px' 
              }}
            />
            {data.iframeUrl && (
              <div style={{ marginTop: '12px' }}>
                <iframe
                  src={data.iframeUrl}
                  title="Тренажёр 1С"
                  style={{ 
                    width: '100%', 
                    height: '400px', 
                    borderRadius: '4px', 
                    border: '1px solid #E4E4E7' 
                  }}
                  allowFullScreen
                />
              </div>
            )}
          </div>
        );

      case 'test':
        return (
          <div className="block-content">
            {/* Изображение к тесту */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                Изображение к тесту
              </label>
              {data.image ? (
                <div className="image-preview" style={{ position: 'relative', display: 'inline-block' }}>
                  <img 
                    src={data.image} 
                    alt="Изображение теста" 
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '150px', 
                      borderRadius: '4px', 
                      border: '1px solid #E4E4E7' 
                    }} 
                  />
                  <button
                    type="button"
                    onClick={() => updateData({ image: '' })}
                    style={{ 
                      position: 'absolute', 
                      top: '-8px', 
                      right: '-8px', 
                      width: '24px', 
                      height: '24px', 
                      background: '#E11D2C', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '50%', 
                      cursor: 'pointer' 
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label style={{ 
                  display: 'inline-block', 
                  padding: '10px 20px', 
                  background: '#F4F4F5', 
                  border: '1px solid #E4E4E7', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => updateData({ image: reader.result });
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  📷 Загрузить изображение
                </label>
              )}
            </div>
            
            {/* Вопросы теста */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                Вопросы теста
              </label>
              {data.questions && data.questions.map((q, qIndex) => (
                <div key={qIndex} style={{ 
                  background: '#FAFAFA', 
                  padding: '12px', 
                  borderRadius: '4px', 
                  marginBottom: '8px', 
                  border: '1px solid #E4E4E7' 
                }}>
                  <input
                    type="text"
                    value={q.question || ''}
                    onChange={(e) => {
                      const newQuestions = [...data.questions];
                      newQuestions[qIndex].question = e.target.value;
                      updateData({ questions: newQuestions });
                    }}
                    placeholder="Введите вопрос"
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      border: '1px solid #E4E4E7', 
                      borderRadius: '4px', 
                      marginBottom: '8px' 
                    }}
                  />
                  <div>
                    {q.options && q.options.map((opt, oIndex) => (
                      <div key={oIndex} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newQuestions = [...data.questions];
                            newQuestions[qIndex].options[oIndex] = e.target.value;
                            updateData({ questions: newQuestions });
                          }}
                          placeholder="Вариант ответа"
                          style={{ 
                            flex: 1, 
                            padding: '6px', 
                            border: '1px solid #E4E4E7', 
                            borderRadius: '4px' 
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newQuestions = [...data.questions];
                            newQuestions[qIndex].options.splice(oIndex, 1);
                            updateData({ questions: newQuestions });
                          }}
                          style={{ 
                            padding: '4px 8px', 
                            background: '#FEEBEC', 
                            color: '#E11D2C', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer' 
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newQuestions = [...data.questions];
                        newQuestions[qIndex].options.push('');
                        updateData({ questions: newQuestions });
                      }}
                      style={{ 
                        padding: '4px 12px', 
                        background: '#F4F4F5', 
                        border: '1px solid #E4E4E7', 
                        borderRadius: '4px', 
                        cursor: 'pointer', 
                        fontSize: '12px' 
                      }}
                    >
                      + Добавить вариант
                    </button>
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <label style={{ fontSize: '13px' }}>
                      Правильный ответ:
                      <select
                        value={q.correct || ''}
                        onChange={(e) => {
                          const newQuestions = [...data.questions];
                          newQuestions[qIndex].correct = e.target.value;
                          updateData({ questions: newQuestions });
                        }}
                        style={{ 
                          marginLeft: '8px', 
                          padding: '4px 8px', 
                          border: '1px solid #E4E4E7', 
                          borderRadius: '4px' 
                        }}
                      >
                        <option value="">Выберите ответ</option>
                        {q.options && q.options.map((opt, oIndex) => (
                          <option key={oIndex} value={opt}>{opt || `Вариант ${oIndex + 1}`}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newQuestions = [...data.questions];
                      newQuestions.splice(qIndex, 1);
                      updateData({ questions: newQuestions });
                    }}
                    style={{ 
                      marginTop: '8px', 
                      padding: '4px 12px', 
                      background: '#FEEBEC', 
                      color: '#E11D2C', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer', 
                      fontSize: '12px' 
                    }}
                  >
                    Удалить вопрос
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newQuestions = [...(data.questions || [])];
                  newQuestions.push({ question: '', options: ['', ''], correct: '' });
                  updateData({ questions: newQuestions });
                }}
                style={{ 
                  padding: '8px 16px', 
                  background: '#2196F3', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
              >
                + Добавить вопрос
              </button>
            </div>
          </div>
        );

      case 'example':
        return (
          <div className="block-content">
            {/* Задача */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                Задача
              </label>
              <textarea
                value={data.task || ''}
                onChange={(e) => updateData({ task: e.target.value })}
                placeholder="Опишите задачу"
                rows="3"
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #E4E4E7', 
                  borderRadius: '4px', 
                  fontSize: '14px' 
                }}
              />
            </div>
            
            {/* Изображение к задаче */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                Изображение к задаче
              </label>
              {data.taskImage ? (
                <div className="image-preview" style={{ position: 'relative', display: 'inline-block' }}>
                  <img 
                    src={data.taskImage} 
                    alt="Изображение задачи" 
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '150px', 
                      borderRadius: '4px', 
                      border: '1px solid #E4E4E7' 
                    }} 
                  />
                  <button
                    type="button"
                    onClick={() => updateData({ taskImage: '' })}
                    style={{ 
                      position: 'absolute', 
                      top: '-8px', 
                      right: '-8px', 
                      width: '24px', 
                      height: '24px', 
                      background: '#E11D2C', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '50%', 
                      cursor: 'pointer' 
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label style={{ 
                  display: 'inline-block', 
                  padding: '8px 16px', 
                  background: '#F4F4F5', 
                  border: '1px solid #E4E4E7', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => updateData({ taskImage: reader.result });
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  📷 Загрузить изображение
                </label>
              )}
            </div>
            
            {/* Решение */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                Решение
              </label>
              <textarea
                value={data.solution || ''}
                onChange={(e) => updateData({ solution: e.target.value })}
                placeholder="Опишите решение"
                rows="3"
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #E4E4E7', 
                  borderRadius: '4px', 
                  fontSize: '14px' 
                }}
              />
            </div>
            
            {/* Изображение к решению */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                Изображение к решению
              </label>
              {data.solutionImage ? (
                <div className="image-preview" style={{ position: 'relative', display: 'inline-block' }}>
                  <img 
                    src={data.solutionImage} 
                    alt="Изображение решения" 
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '150px', 
                      borderRadius: '4px', 
                      border: '1px solid #E4E4E7' 
                    }} 
                  />
                  <button
                    type="button"
                    onClick={() => updateData({ solutionImage: '' })}
                    style={{ 
                      position: 'absolute', 
                      top: '-8px', 
                      right: '-8px', 
                      width: '24px', 
                      height: '24px', 
                      background: '#E11D2C', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '50%', 
                      cursor: 'pointer' 
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label style={{ 
                  display: 'inline-block', 
                  padding: '8px 16px', 
                  background: '#F4F4F5', 
                  border: '1px solid #E4E4E7', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => updateData({ solutionImage: reader.result });
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  📷 Загрузить изображение
                </label>
              )}
            </div>
            
            {/* Комментарий */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                Комментарий
              </label>
              <textarea
                value={data.comment || ''}
                onChange={(e) => updateData({ comment: e.target.value })}
                placeholder="Добавьте комментарий"
                rows="2"
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #E4E4E7', 
                  borderRadius: '4px', 
                  fontSize: '14px' 
                }}
              />
            </div>
          </div>
        );

      case 'materials':
        return (
          <div className="block-content">
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                Материалы для скачивания
              </label>
              <div style={{ 
                border: '2px dashed #E4E4E7', 
                borderRadius: '4px', 
                padding: '20px', 
                textAlign: 'center' 
              }}>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    const newFiles = files.map(file => ({
                      name: file.name,
                      size: file.size,
                      type: file.type,
                    }));
                    updateData({ files: [...(data.files || []), ...newFiles] });
                  }}
                  style={{ marginBottom: '12px' }}
                />
                <p style={{ color: '#A1A1AA', fontSize: '13px' }}>
                  Выберите файлы для загрузки
                </p>
              </div>
            </div>
            
            {data.files && data.files.length > 0 && (
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                  Загруженные файлы:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {data.files.map((file, fIndex) => (
                    <div key={fIndex} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '8px 12px', 
                      background: '#FAFAFA', 
                      borderRadius: '4px', 
                      border: '1px solid #E4E4E7' 
                    }}>
                      <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newFiles = [...data.files];
                          newFiles.splice(fIndex, 1);
                          updateData({ files: newFiles });
                        }}
                        style={{ 
                          padding: '4px 8px', 
                          background: '#FEEBEC', 
                          color: '#E11D2C', 
                          border: 'none', 
                          borderRadius: '4px', 
                          cursor: 'pointer' 
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return <div className="block-content">Неизвестный тип блока</div>;
    }
  };

  return (
    <div className="content-block">
      {/* Заголовок блока */}
      <div className="block-header">
        <div className="block-title">
          <span className="block-index">Блок {index + 1}</span>
          <strong>
            {type === 'text' && '📝 Текстовый материал'}
            {type === 'video' && '🎬 Видео'}
            {type === 'simulator' && '🖥️ Тренажёр 1С'}
            {type === 'test' && '📝 Тест'}
            {type === 'example' && '📋 Разбор примера'}
            {type === 'materials' && '📁 Материалы для скачивания'}
          </strong>
        </div>
        <div className="block-controls">
          {/* Кнопка перемещения вверх */}
          <button
            type="button"
            className="move-btn"
            onClick={() => onMove(index, -1)}
            disabled={index === 0}
            title="Переместить блок вверх"
          >
            ↑
          </button>
          
          {/* Кнопка перемещения вниз */}
          <button
            type="button"
            className="move-btn"
            onClick={() => onMove(index, 1)}
            disabled={index === totalBlocks - 1}
            title="Переместить блок вниз"
          >
            ↓
          </button>
          
          {/* Кнопка удаления блока */}
          <button
            type="button"
            className="remove-btn"
            onClick={() => onRemove(id)}
            title="Удалить блок"
          >
            Удалить
          </button>
        </div>
      </div>
      
      {/* Содержимое блока */}
      {renderBlockContent()}
    </div>
  );
};

>>>>>>> 1c6164c7b8cd6ec8ce3f3de3a0d18819aa26465c
export default ContentBlock;