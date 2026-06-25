/**
 * СТРАНИЦА СПИСКА КУРСОВ МЕТОДИСТА
 * 
 * Отображает все курсы созданные методистом
 * Позволяет создавать, редактировать, удалять и публиковать курсы
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getCourses, deleteCourse, publishCourse } from '../../api/courses';

const Courses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState({});

  // Загрузка курсов при монтировании компонента
  useEffect(() => {
    loadCourses();
  }, []);

  /**
   * Загрузка списка курсов с сервера
   */
  const loadCourses = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getCourses();
      if (response.success) {
        setCourses(response.data);
      } else {
        setError(response.message || 'Ошибка загрузки курсов');
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      setError('Ошибка загрузки курсов. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Удаление курса
   */
  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот курс?')) return;
    
    setActionLoading(prev => ({ ...prev, [id]: 'deleting' }));
    try {
      const response = await deleteCourse(id);
      if (response.success) {
        await loadCourses(); // Обновляем список
      } else {
        setError(response.message || 'Ошибка удаления курса');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      setError('Ошибка удаления курса');
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: undefined }));
    }
  };

  /**
   * Публикация курса
   */
  const handlePublish = async (id) => {
    setActionLoading(prev => ({ ...prev, [id]: 'publishing' }));
    try {
      const response = await publishCourse(id);
      if (response.success) {
        await loadCourses(); // Обновляем список
      } else {
        setError(response.message || 'Ошибка публикации курса');
      }
    } catch (error) {
      console.error('Error publishing course:', error);
      setError('Ошибка публикации курса');
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: undefined }));
    }
  };

  // Отображение состояния загрузки
  if (loading) {
    return (
      <div style={styles.loading}>
        <div className="loading">Загрузка курсов...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Заголовок страницы */}
      <div style={styles.header}>
        <h1 style={styles.title}>Мои курсы</h1>
        <button
          onClick={() => navigate('/methodist/create')}
          style={styles.createButton}
          className="btn-primary"
        >
          + Создать курс
        </button>
      </div>

      {/* Сообщение об ошибке */}
      {error && (
        <div style={styles.error}>
          {error}
          <button onClick={() => setError('')} style={styles.errorClose}>×</button>
        </div>
      )}

      {/* Список курсов */}
      {courses.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyTitle}>У вас пока нет курсов</p>
          <p style={styles.emptyText}>Создайте свой первый курс, нажав на кнопку выше</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {courses.map((course) => (
            <div key={course.id} style={styles.card} className="course-card">
              {/* Обложка курса */}
              {course.coverImage ? (
                <img 
                  src={course.coverImage} 
                  alt={course.title} 
                  style={styles.coverImage}
                  onLoad={() => {
                    console.log('✅ Обложка загружена:', course.coverImage);
                  }}
                  onError={(e) => {
                    console.error('❌ Ошибка загрузки обложки:', course.coverImage);
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    const fallback = document.createElement('div');
                    fallback.style.cssText = `
                      width: 100%;
                      height: 160px;
                      background: linear-gradient(135deg, #E11D2C, #B81523);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      color: white;
                      font-size: 48px;
                    `;
                    fallback.textContent = '📚';
                    parent.appendChild(fallback);
                  }}
                />
              ) : (
                <div style={styles.coverFallback}>
                  📚
                </div>
              )}
              
              {/* Информация о курсе */}
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{course.title}</h3>
                <p style={styles.cardDescription}>
                  {course.description || 'Без описания'}
                </p>
                
                {/* Теги статуса */}
                <div style={styles.tags}>
                  <span style={{
                    ...styles.tag,
                    background: course.isPublished ? '#E6F7E6' : '#FFF3E0',
                    color: course.isPublished ? '#15803D' : '#B45309'
                  }}>
                    {course.isPublished ? '✅ Опубликован' : '📝 Черновик'}
                  </span>
                  <span style={styles.tag}>
                    📚 {course.content?.length || 0} блоков
                  </span>
                  <span style={styles.tag}>
                    {course.level === 'BEGINNER' ? '🔰 Начальный' : 
                     course.level === 'INTERMEDIATE' ? '📊 Средний' : '🚀 Продвинутый'}
                  </span>
                  {course.prerequisites && course.prerequisites.length > 0 && (
                    <span style={{ ...styles.tag, background: '#FEEBEC', color: '#E11D2C' }}>
                      🔗 {course.prerequisites.length} пререквизитов
                    </span>
                  )}
                </div>
              </div>

              {/* Кнопки действий */}
              <div style={styles.cardActions}>
                <button
                  onClick={() => navigate(`/methodist/edit/${course.id}`)}
                  style={{ ...styles.actionButton, background: '#2196F3' }}
                  className="action-btn-edit"
                >
                  ✏️ Редактировать
                </button>
                
                {!course.isPublished && (
                  <button
                    onClick={() => handlePublish(course.id)}
                    disabled={actionLoading[course.id] === 'publishing'}
                    style={{ ...styles.actionButton, background: '#15803D' }}
                    className="action-btn-publish"
                  >
                    {actionLoading[course.id] === 'publishing' ? '⏳...' : '📤 Опубликовать'}
                  </button>
                )}
                
                <button
                  onClick={() => handleDelete(course.id)}
                  disabled={actionLoading[course.id] === 'deleting'}
                  style={{ ...styles.actionButton, background: '#E11D2C' }}
                  className="action-btn-delete"
                >
                  {actionLoading[course.id] === 'deleting' ? '⏳...' : '🗑️ Удалить'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ================ СТИЛИ ================

const styles = {
  container: {
    padding: '32px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0A0A0A',
    letterSpacing: '-0.025em'
  },
  createButton: {
    padding: '12px 24px',
    background: '#E11D2C',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  error: {
    padding: '12px 16px',
    background: '#FEEBEC',
    color: '#E11D2C',
    borderRadius: '6px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  errorClose: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#E11D2C'
  },
  empty: {
    textAlign: 'center',
    padding: '60px',
    background: 'white',
    borderRadius: '10px',
    border: '1px solid #E4E4E7'
  },
  emptyTitle: {
    fontSize: '18px',
    color: '#18181B',
    marginBottom: '8px'
  },
  emptyText: {
    color: '#71717A'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '20px'
  },
  card: {
    background: 'white',
    borderRadius: '10px',
    border: '1px solid #E4E4E7',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column'
  },
  coverImage: {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
    background: '#f0f0f0'
  },
  coverFallback: {
    width: '100%',
    height: '160px',
    background: 'linear-gradient(135deg, #E11D2C, #B81523)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '48px'
  },
  cardContent: {
    padding: '20px',
    flex: 1
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0A0A0A',
    marginBottom: '8px'
  },
  cardDescription: {
    color: '#71717A',
    fontSize: '14px',
    marginBottom: '12px',
    lineHeight: '1.5',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  tags: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: 'auto'
  },
  tag: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    background: '#F4F4F5',
    color: '#71717A'
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
    padding: '12px 20px',
    borderTop: '1px solid #F4F4F5',
    background: '#FAFAFA',
    flexWrap: 'wrap'
  },
  actionButton: {
    padding: '6px 16px',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px'
  }
};

// ================ ГЛОБАЛЬНЫЕ СТИЛИ ДЛЯ КНОПОК ================

const globalStyles = document.createElement('style');
globalStyles.textContent = `
  /* Кнопка "Создать курс" */
  .btn-primary:hover {
    background: #B81523 !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(225, 29, 44, 0.3);
  }
  .btn-primary:active {
    transform: scale(0.98);
  }

  /* Кнопка "Редактировать" */
  .action-btn-edit:hover {
    background: #1976D2 !important;
  }

  /* Кнопка "Опубликовать" */
  .action-btn-publish:hover:not(:disabled) {
    background: #166534 !important;
  }
  .action-btn-publish:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Кнопка "Удалить" */
  .action-btn-delete:hover:not(:disabled) {
    background: #B81523 !important;
  }
  .action-btn-delete:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Карточка курса при наведении */
  .course-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    border-color: #0A0A0A;
  }
`;
document.head.appendChild(globalStyles);

export default Courses;