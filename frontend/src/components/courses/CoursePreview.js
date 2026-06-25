/**
 * КОМПОНЕНТ ПРЕДПРОСМОТРА КУРСА
 * 
 * Отображает курс в том виде, в котором его увидит специалист
 * Каждый блок на отдельной странице с пагинацией
 */

import React, { useState } from 'react';

const CoursePreview = ({ course, onClose }) => {
  const { title, description, coverImage, contentBlocks, authorName, createdAt } = course;
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = contentBlocks?.length || 0;

  // Текущий блок
  const currentBlock = contentBlocks?.[currentPage] || null;
  const totalBlocks = contentBlocks?.length || 0;

  /**
   * Рендер блока в зависимости от типа
   */
  const renderBlock = (block) => {
    if (!block) return null;
    const { type, data } = block;

    switch (type) {
      case 'text':
        return (
          <div className="preview-block">
            <div className="block-header-preview">
              <span className="block-number">Блок {currentPage + 1}</span>
              <span className="block-type-label">📝 Текст</span>
            </div>
            <div 
              className="preview-text-block"
              dangerouslySetInnerHTML={{ __html: data.content || '' }}
            />
          </div>
        );

      case 'video':
        return (
          <div className="preview-block">
            <div className="block-header-preview">
              <span className="block-number">Блок {currentPage + 1}</span>
              <span className="block-type-label">🎬 Видео</span>
            </div>
            <div className="preview-video-block">
              <div className="video-wrapper">
                <iframe
                  src={data.url || ''}
                  title="Видео"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        );

      case 'simulator':
        return (
          <div className="preview-block">
            <div className="block-header-preview">
              <span className="block-number">Блок {currentPage + 1}</span>
              <span className="block-type-label">🖥️ Тренажёр 1С</span>
            </div>
            <div className="preview-simulator-block">
              <iframe
                src={data.iframeUrl || ''}
                className="simulator-iframe"
                title="Тренажёр 1С"
              />
            </div>
          </div>
        );

      case 'test':
        return (
          <div className="preview-block">
            <div className="block-header-preview">
              <span className="block-number">Блок {currentPage + 1}</span>
              <span className="block-type-label">📝 Тест</span>
            </div>
            <div className="preview-test-block">
              {data.image && (
                <img src={data.image} alt="Изображение к тесту" className="preview-test-image" />
              )}
              {data.questions && data.questions.map((q, qIndex) => (
                <div key={qIndex} className="preview-question">
                  <div className="question-text">{qIndex + 1}. {q.question}</div>
                  <div className="question-options">
                    {q.options && q.options.map((opt, oIndex) => (
                      <label key={oIndex} className="preview-option">
                        <input type="radio" name={`question-${currentPage}-${qIndex}`} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'example':
        return (
          <div className="preview-block">
            <div className="block-header-preview">
              <span className="block-number">Блок {currentPage + 1}</span>
              <span className="block-type-label">📋 Разбор примера</span>
            </div>
            <div className="preview-example-block">
              <div className="example-task">
                <strong>📌 Задача:</strong>
                <p>{data.task || 'Нет описания задачи'}</p>
                {data.taskImage && (
                  <img src={data.taskImage} alt="Изображение задачи" className="preview-task-image" />
                )}
              </div>
              <details className="example-solution">
                <summary>💡 Показать решение</summary>
                <div className="solution-content">
                  <strong>Решение:</strong>
                  <p>{data.solution || 'Нет решения'}</p>
                  {data.solutionImage && (
                    <img src={data.solutionImage} alt="Изображение решения" className="preview-solution-image" />
                  )}
                  {data.comment && (
                    <>
                      <strong>Комментарий:</strong>
                      <p>{data.comment}</p>
                    </>
                  )}
                </div>
              </details>
            </div>
          </div>
        );

      case 'materials':
        return (
          <div className="preview-block">
            <div className="block-header-preview">
              <span className="block-number">Блок {currentPage + 1}</span>
              <span className="block-type-label">📁 Материалы</span>
            </div>
            <div className="preview-materials-block">
              {data.files && data.files.length > 0 ? (
                <div className="materials-list">
                  {data.files.map((file, fIndex) => (
                    <button
                      key={fIndex}
                      className="material-link"
                      onClick={() => {
                        alert(`Скачивание файла: ${file.name}`);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        background: 'var(--bg)',
                        border: '1px solid var(--line)',
                        borderRadius: 'var(--radius-sm)',
                        textDecoration: 'none',
                        width: '100%',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--white)';
                        e.currentTarget.style.borderColor = 'var(--red)';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--bg)';
                        e.currentTarget.style.borderColor = 'var(--line)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <span className="material-icon" style={{ fontSize: '24px' }}>📄</span>
                      <span className="material-name" style={{ flex: 1, color: 'var(--ink)', fontWeight: 500 }}>
                        {file.name}
                      </span>
                      <span className="material-size" style={{ color: 'var(--muted)', fontSize: '12px' }}>
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="preview-placeholder">Нет загруженных материалов</p>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="preview-block">
            <div className="block-header-preview">
              <span className="block-number">Блок {currentPage + 1}</span>
              <span className="block-type-label">❓ Неизвестный тип</span>
            </div>
            <div className="preview-text-block">
              <p style={{ color: 'var(--muted)' }}>Неизвестный тип блока</p>
            </div>
          </div>
        );
    }
  };

  // Пагинация
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px',
        padding: '20px 0 10px 0',
        borderTop: '1px solid var(--line)',
        marginTop: '20px'
      }}>
        <button
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
          style={{
            padding: '8px 16px',
            background: currentPage === 0 ? 'var(--bg)' : 'var(--red)',
            color: currentPage === 0 ? 'var(--muted)' : 'var(--white)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
        >
          ← Назад
        </button>

        <span style={{
          fontSize: '14px',
          color: 'var(--muted)',
          fontWeight: '500'
        }}>
          {currentPage + 1} / {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
          disabled={currentPage === totalPages - 1}
          style={{
            padding: '8px 16px',
            background: currentPage === totalPages - 1 ? 'var(--bg)' : 'var(--red)',
            color: currentPage === totalPages - 1 ? 'var(--muted)' : 'var(--white)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
        >
          Вперёд →
        </button>
      </div>
    );
  };

  // Индикатор прогресса по блокам
  const renderProgressIndicator = () => {
    if (!contentBlocks || contentBlocks.length === 0) return null;

    return (
      <div style={{
        display: 'flex',
        gap: '6px',
        justifyContent: 'center',
        marginBottom: '16px',
        flexWrap: 'wrap'
      }}>
        {contentBlocks.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: index === currentPage 
                ? 'var(--red)' 
                : 'var(--bg-soft)',
              color: index === currentPage 
                ? 'var(--white)' 
                : 'var(--muted)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            title={`Блок ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    );
  };

  // Навигация по блокам (предыдущий/следующий)
  const renderBlockNavigation = () => {
    if (totalPages <= 1) return null;

    return (
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 0',
        borderTop: '1px solid var(--line)',
        marginTop: '16px'
      }}>
        <button
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
          style={{
            padding: '8px 20px',
            background: currentPage === 0 ? 'var(--bg)' : 'var(--red)',
            color: currentPage === 0 ? 'var(--muted)' : 'var(--white)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ⬅️ Предыдущий блок
        </button>

        <span style={{
          fontSize: '13px',
          color: 'var(--muted)',
          fontWeight: '500'
        }}>
          {currentPage + 1} / {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
          disabled={currentPage === totalPages - 1}
          style={{
            padding: '8px 20px',
            background: currentPage === totalPages - 1 ? 'var(--bg)' : 'var(--red)',
            color: currentPage === totalPages - 1 ? 'var(--muted)' : 'var(--white)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          Следующий блок ➡️
        </button>
      </div>
    );
  };

  return (
    <div className="course-preview-overlay" onClick={onClose}>
      <div className="course-preview" onClick={(e) => e.stopPropagation()}>
        {/* Заголовок */}
        <div className="preview-header">
          <h2>👁️ Предпросмотр курса</h2>
          <button className="close-preview-btn" onClick={onClose}>✕</button>
        </div>
        
        {/* Контент */}
        <div className="preview-content">
          {/* Информация о курсе */}
          <div className="preview-course-info">
            {coverImage && (
              <img src={coverImage} alt={title} className="course-cover" />
            )}
            <h1>{title}</h1>
            <p className="course-description-preview">{description || 'Нет описания'}</p>
            <div className="preview-meta">
              <span>👤 Автор: {authorName || 'Методист'}</span>
              <span>📅 Создан: {new Date(createdAt).toLocaleDateString('ru-RU')}</span>
              <span>📚 Блоков: {totalBlocks}</span>
            </div>
          </div>

          {/* Блоки курса */}
          <div className="preview-blocks">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{ margin: 0 }}>Содержание курса</h3>
              <span style={{
                fontSize: '13px',
                color: 'var(--muted)',
                fontWeight: '500'
              }}>
                Блок {currentPage + 1} из {totalBlocks}
              </span>
            </div>

            {/* Индикатор прогресса */}
            {renderProgressIndicator()}

            {/* Текущий блок */}
            {currentBlock ? (
              renderBlock(currentBlock)
            ) : (
              <p className="preview-placeholder">Нет добавленных блоков</p>
            )}

            {/* Навигация по блокам */}
            {renderBlockNavigation()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;