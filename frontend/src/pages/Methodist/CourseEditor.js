<<<<<<< HEAD
/**
 * РЕДАКТОР КУРСА
 * 
 * Позволяет создавать и редактировать курсы
 * Поддерживает загрузку обложки и различные типы блоков контента
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createCourse, updateCourse, getCourse, getCourses } from '../../api/courses';
import { uploadImage, deleteImage } from '../../api/upload';
import ContentBlock from '../../components/courses/ContentBlock';
import CoursePreview from '../../components/courses/CoursePreview';

const CourseEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  
  // Данные формы
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [contentBlocks, setContentBlocks] = useState([]);
  const [uploadingCover, setUploadingCover] = useState(false);
  
  // Пререквизиты
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedPrerequisites, setSelectedPrerequisites] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  /**
   * Загрузка курса для редактирования
   */
  const loadCourse = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await getCourse(id);
      if (response.success) {
        const course = response.data;
        setTitle(course.title || '');
        setDescription(course.description || '');
        setCoverImage(course.coverImage || '');
        setContentBlocks(course.content || []);
        // Сохраняем пререквизиты
        setSelectedPrerequisites(course.prerequisites?.map(p => p.id) || []);
      } else {
        setError('Ошибка загрузки курса');
      }
    } catch (error) {
      console.error('Error loading course:', error);
      setError('Ошибка загрузки курса');
    } finally {
      setLoading(false);
    }
  }, [id]);

  /**
   * Загрузка доступных курсов для выбора пререквизитов
   */
  const loadAvailableCourses = useCallback(async () => {
    setLoadingCourses(true);
    try {
      const response = await getCourses();
      if (response.success) {
        // Исключаем текущий курс из списка
        const filtered = response.data.filter(c => c.id !== id);
        setAvailableCourses(filtered);
      }
    } catch (error) {
      console.error('Error loading available courses:', error);
    } finally {
      setLoadingCourses(false);
    }
  }, [id]);

  useEffect(() => {
    loadCourse();
    loadAvailableCourses();
  }, [loadCourse, loadAvailableCourses]);

  /**
   * Загрузка обложки курса
   */
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Размер файла не должен превышать 10MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите файл изображения');
      return;
    }

    setUploadingCover(true);
    try {
      // Если есть старая обложка, удаляем её
      if (coverImage) {
        try {
          await deleteImage(coverImage);
        } catch (error) {
          console.error('Error deleting old cover:', error);
        }
      }

      // ВАЖНО! Передаем тип 'cover'
      const response = await uploadImage(file, 'cover');
      console.log('Ответ сервера на загрузку обложки:', response);
      
      if (response.success) {
        setCoverImage(response.data.url);
        console.log('Обложка установлена:', response.data.url);
      } else {
        alert('Ошибка загрузки обложки');
      }
    } catch (error) {
      console.error('Error uploading cover:', error);
      alert('Ошибка загрузки обложки');
    } finally {
      setUploadingCover(false);
    }
  };

  /**
   * Удаление обложки
   */
  const handleRemoveCover = async () => {
    if (!coverImage) return;
    
    if (!window.confirm('Вы уверены, что хотите удалить обложку?')) return;
    
    try {
      await deleteImage(coverImage);
      setCoverImage('');
    } catch (error) {
      console.error('Error deleting cover:', error);
      alert('Ошибка удаления обложки');
    }
  };

  /**
   * Получение данных по умолчанию для типа блока
   */
  const getDefaultDataForType = (type) => {
    switch(type) {
      case 'text':
        return { content: '<p>Введите текст...</p>' };
      case 'video':
        return { url: '', type: 'link' };
      case 'simulator':
        return { iframeUrl: '' };
      case 'test':
        return { 
          questions: [],
          image: ''
        };
      case 'example':
        return { 
          task: '', 
          solution: '', 
          comment: '',
          taskImage: '',
          solutionImage: ''
        };
      case 'materials':
        return { files: [] };
      default:
        return {};
    }
  };

  /**
   * Добавление нового блока контента
   */
  const addContentBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      type: type,
      data: getDefaultDataForType(type)
    };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  /**
   * Обновление блока контента
   */
  const updateContentBlock = (blockId, newData) => {
    setContentBlocks(contentBlocks.map(block => 
      block.id === blockId ? { ...block, data: newData } : block
    ));
  };

  /**
   * Удаление блока контента
   */
  const removeContentBlock = (blockId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот блок?')) return;
    setContentBlocks(contentBlocks.filter(block => block.id !== blockId));
  };

  /**
   * Перемещение блока контента
   */
  const moveContentBlock = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= contentBlocks.length) return;
    
    const newBlocks = [...contentBlocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setContentBlocks(newBlocks);
  };

  /**
   * Сохранение курса
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (!title.trim()) {
        setError('Введите название курса');
        setSaving(false);
        return;
      }

      if (!contentBlocks || contentBlocks.length === 0) {
        setError('Добавьте хотя бы один блок контента');
        setSaving(false);
        return;
      }

      const data = {
        title: title.trim(),
        description,
        coverImage: coverImage || null,
        content: contentBlocks,
        level: 'BEGINNER',
        duration: 0,
        prerequisites: selectedPrerequisites
      };
      console.log('Сохраняем с обложкой:', data.coverImage);
      console.log('Пререквизиты:', data.prerequisites);

      let response;
      if (id) {
        response = await updateCourse(id, data);
      } else {
        response = await createCourse(data);
      }

      if (response.success) {
        navigate('/methodist');
      } else {
        setError(response.message || 'Ошибка сохранения курса');
      }
    } catch (error) {
      console.error('Error saving course:', error);
      setError('Ошибка сохранения курса');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Предпросмотр курса
   */
  const handlePreview = () => {
    if (!title.trim()) {
      alert('Введите название курса перед просмотром');
      return;
    }
    setShowPreview(true);
  };

  if (loading) {
    return <div className="loading">Загрузка курса...</div>;
  }

  return (
    <>
      <div className="course-editor">
        <form onSubmit={handleSubmit}>
          <div className="editor-header">
            <h2>{id ? 'Редактирование курса' : 'Создание нового курса'}</h2>
            <div className="editor-actions">
              <button 
                type="button" 
                onClick={handlePreview} 
                className="preview-btn"
              >
                👁️ Предпросмотр
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/methodist')} 
                className="cancel-btn"
              >
                Отмена
              </button>
              <button 
                type="submit" 
                className="save-btn"
                disabled={saving}
              >
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message" style={{ margin: '16px 32px' }}>
              {error}
              <button onClick={() => setError('')} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
          )}

          <div className="form-group">
            <label>Название курса *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название курса"
              required
            />
          </div>

          {/* Загрузка обложки */}
          <div className="form-group">
            <label>Обложка курса</label>
            <div className="image-upload-area">
              {coverImage ? (
                <div className="image-preview">
                  <img src={coverImage} alt="Обложка курса" />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={handleRemoveCover}
                    disabled={uploadingCover}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="image-upload-label" style={{ cursor: uploadingCover ? 'wait' : 'pointer' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    style={{ display: 'none' }}
                    disabled={uploadingCover}
                  />
                  <span>{uploadingCover ? '⏳ Загрузка...' : '📷 Нажмите для загрузки обложки'}</span>
                </label>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Описание курса</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введите описание курса"
              rows="4"
            />
          </div>

          {/* Пререквизиты курса */}
          <div className="form-group">
            <label>Пререквизиты (курсы, которые нужно пройти сначала)</label>
            {loadingCourses ? (
              <div>Загрузка курсов...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                {availableCourses.length === 0 ? (
                  <p style={{ color: '#71717A', fontSize: '14px' }}>
                    Нет доступных курсов для выбора в качестве пререквизитов
                  </p>
                ) : (
                  availableCourses.map(course => (
                    <label key={course.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={selectedPrerequisites.includes(course.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPrerequisites([...selectedPrerequisites, course.id]);
                          } else {
                            setSelectedPrerequisites(selectedPrerequisites.filter(id => id !== course.id));
                          }
                        }}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '14px' }}>
                        {course.title}
                        {course.isPublished ? ' ✅' : ' 📝'}
                      </span>
                      <span style={{ fontSize: '12px', color: '#71717A' }}>
                        ({course.level === 'BEGINNER' ? 'Начальный' : 
                          course.level === 'INTERMEDIATE' ? 'Средний' : 'Продвинутый'})
                      </span>
                    </label>
                  ))
                )}
              </div>
            )}
            {selectedPrerequisites.length > 0 && (
              <div style={{ marginTop: '8px', fontSize: '13px', color: '#71717A' }}>
                Выбрано пререквизитов: {selectedPrerequisites.length}
              </div>
            )}
          </div>

          {/* Блоки контента */}
          <div className="content-blocks">
            <h3>Содержание курса</h3>
            
            {/* ЗАКРЕПЛЕННЫЕ КНОПКИ - всегда видны при скролле */}
            <div style={{
              position: 'sticky',
              top: '0',
              zIndex: '10',
              background: 'white',
              padding: '12px 0',
              borderBottom: '1px solid #E4E4E7',
              marginBottom: '16px'
            }}>
              <div className="add-block-buttons">
                <button 
                  type="button" 
                  onClick={() => addContentBlock('text')} 
                  className="add-block-btn"
                >
                  + Текстовый материал
                </button>
                <button 
                  type="button" 
                  onClick={() => addContentBlock('video')} 
                  className="add-block-btn"
                >
                  + Видео
                </button>
                <button 
                  type="button" 
                  onClick={() => addContentBlock('simulator')} 
                  className="add-block-btn"
                >
                  + Тренажёр 1С
                </button>
                <button 
                  type="button" 
                  onClick={() => addContentBlock('test')} 
                  className="add-block-btn"
                >
                  + Тест
                </button>
                <button 
                  type="button" 
                  onClick={() => addContentBlock('example')} 
                  className="add-block-btn"
                >
                  + Разбор примера
                </button>
                <button 
                  type="button" 
                  onClick={() => addContentBlock('materials')} 
                  className="add-block-btn"
                >
                  + Материалы для скачивания
                </button>
              </div>
            </div>

            {contentBlocks.length === 0 ? (
              <p className="no-blocks">Нет добавленных блоков. Нажмите на кнопку выше, чтобы добавить контент.</p>
            ) : (
              contentBlocks.map((block, index) => (
                <ContentBlock
                  key={block.id}
                  block={block}
                  index={index}
                  onUpdate={updateContentBlock}
                  onRemove={removeContentBlock}
                  onMove={moveContentBlock}
                  totalBlocks={contentBlocks.length}
                />
              ))
            )}

            {/* ДУБЛИРУЕМ КНОПКИ ВНИЗУ - для удобства */}
            <div style={{
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid #E4E4E7'
            }}>
              <div className="add-block-buttons">
                <button 
                  type="button" 
                  onClick={() => addContentBlock('text')} 
                  className="add-block-btn"
                >
                  + Текстовый материал
                </button>
                <button 
                  type="button" 
                  onClick={() => addContentBlock('video')} 
                  className="add-block-btn"
                >
                  + Видео
                </button>
                <button 
                  type="button" 
                  onClick={() => addContentBlock('simulator')} 
                  className="add-block-btn"
                >
                  + Тренажёр 1С
                </button>
                <button 
                  type="button" 
                  onClick={() => addContentBlock('test')} 
                  className="add-block-btn"
                >
                  + Тест
                </button>
                <button 
                  type="button" 
                  onClick={() => addContentBlock('example')} 
                  className="add-block-btn"
                >
                  + Разбор примера
                </button>
                <button 
                  type="button" 
                  onClick={() => addContentBlock('materials')} 
                  className="add-block-btn"
                >
                  + Материалы для скачивания
                </button>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/methodist')} 
              className="cancel-btn"
            >
              Отмена
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={saving}
            >
              {saving ? 'Сохранение...' : 'Сохранить курс'}
            </button>
          </div>
        </form>
      </div>

      {/* Модальное окно предпросмотра */}
      {showPreview && (
        <CoursePreview
          course={{
            title,
            description,
            coverImage,
            contentBlocks,
            authorName: user?.fullName || user?.username || 'Методист',
            createdAt: new Date().toISOString()
          }}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
};

=======
/**
 * РЕДАКТОР КУРСА
 * 
 * Позволяет создавать и редактировать курсы
 * Поддерживает загрузку обложки и различные типы блоков контента
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createCourse, updateCourse, getCourse, getCourses } from '../../api/courses';
import { uploadImage, deleteImage } from '../../api/upload';
import ContentBlock from '../../components/courses/ContentBlock';
import CoursePreview from '../../components/courses/CoursePreview';

const CourseEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  
  // Данные формы
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [contentBlocks, setContentBlocks] = useState([]);
  const [uploadingCover, setUploadingCover] = useState(false);
  
  // Пререквизиты
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedPrerequisites, setSelectedPrerequisites] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  /**
   * Загрузка курса для редактирования
   */
  const loadCourse = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await getCourse(id);
      if (response.success) {
        const course = response.data;
        setTitle(course.title || '');
        setDescription(course.description || '');
        setCoverImage(course.coverImage || '');
        setContentBlocks(course.content || []);
        // Сохраняем пререквизиты
        setSelectedPrerequisites(course.prerequisites?.map(p => p.id) || []);
      } else {
        setError('Ошибка загрузки курса');
      }
    } catch (error) {
      console.error('Error loading course:', error);
      setError('Ошибка загрузки курса');
    } finally {
      setLoading(false);
    }
  }, [id]);

  /**
   * Загрузка доступных курсов для выбора пререквизитов
   */
  const loadAvailableCourses = useCallback(async () => {
    setLoadingCourses(true);
    try {
      const response = await getCourses();
      if (response.success) {
        // Исключаем текущий курс из списка
        const filtered = response.data.filter(c => c.id !== id);
        setAvailableCourses(filtered);
      }
    } catch (error) {
      console.error('Error loading available courses:', error);
    } finally {
      setLoadingCourses(false);
    }
  }, [id]);

  useEffect(() => {
    loadCourse();
    loadAvailableCourses();
  }, [loadCourse, loadAvailableCourses]);

  /**
   * Загрузка обложки курса
   */
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Размер файла не должен превышать 10MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите файл изображения');
      return;
    }

    setUploadingCover(true);
    try {
      // Если есть старая обложка, удаляем её
      if (coverImage) {
        try {
          await deleteImage(coverImage);
        } catch (error) {
          console.error('Error deleting old cover:', error);
        }
      }

      // ВАЖНО! Передаем тип 'cover'
      const response = await uploadImage(file, 'cover');
      console.log('Ответ сервера на загрузку обложки:', response);
      
      if (response.success) {
        setCoverImage(response.data.url);
        console.log('Обложка установлена:', response.data.url);
      } else {
        alert('Ошибка загрузки обложки');
      }
    } catch (error) {
      console.error('Error uploading cover:', error);
      alert('Ошибка загрузки обложки');
    } finally {
      setUploadingCover(false);
    }
  };

  /**
   * Удаление обложки
   */
  const handleRemoveCover = async () => {
    if (!coverImage) return;
    
    if (!window.confirm('Вы уверены, что хотите удалить обложку?')) return;
    
    try {
      await deleteImage(coverImage);
      setCoverImage('');
    } catch (error) {
      console.error('Error deleting cover:', error);
      alert('Ошибка удаления обложки');
    }
  };

  /**
   * Получение данных по умолчанию для типа блока
   */
  const getDefaultDataForType = (type) => {
    switch(type) {
      case 'text':
        return { content: '<p>Введите текст...</p>' };
      case 'video':
        return { url: '', type: 'link' };
      case 'simulator':
        return { iframeUrl: '' };
      case 'test':
        return { 
          questions: [],
          image: ''
        };
      case 'example':
        return { 
          task: '', 
          solution: '', 
          comment: '',
          taskImage: '',
          solutionImage: ''
        };
      case 'materials':
        return { files: [] };
      default:
        return {};
    }
  };

  /**
   * Добавление нового блока контента
   */
  const addContentBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      type: type,
      data: getDefaultDataForType(type)
    };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  /**
   * Обновление блока контента
   */
  const updateContentBlock = (blockId, newData) => {
    setContentBlocks(contentBlocks.map(block => 
      block.id === blockId ? { ...block, data: newData } : block
    ));
  };

  /**
   * Удаление блока контента
   */
  const removeContentBlock = (blockId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот блок?')) return;
    setContentBlocks(contentBlocks.filter(block => block.id !== blockId));
  };

  /**
   * Перемещение блока контента
   */
  const moveContentBlock = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= contentBlocks.length) return;
    
    const newBlocks = [...contentBlocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setContentBlocks(newBlocks);
  };

  /**
   * Сохранение курса
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (!title.trim()) {
        setError('Введите название курса');
        setSaving(false);
        return;
      }

      if (!contentBlocks || contentBlocks.length === 0) {
        setError('Добавьте хотя бы один блок контента');
        setSaving(false);
        return;
      }

      const data = {
        title: title.trim(),
        description,
        coverImage: coverImage || null,
        content: contentBlocks,
        level: 'BEGINNER',
        duration: 0,
        prerequisites: selectedPrerequisites
      };
      console.log('Сохраняем с обложкой:', data.coverImage);
      console.log('Пререквизиты:', data.prerequisites);

      let response;
      if (id) {
        response = await updateCourse(id, data);
      } else {
        response = await createCourse(data);
      }

      if (response.success) {
        navigate('/methodist');
      } else {
        setError(response.message || 'Ошибка сохранения курса');
      }
    } catch (error) {
      console.error('Error saving course:', error);
      setError('Ошибка сохранения курса');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Предпросмотр курса
   */
  const handlePreview = () => {
    if (!title.trim()) {
      alert('Введите название курса перед просмотром');
      return;
    }
    setShowPreview(true);
  };

  if (loading) {
    return <div className="loading">Загрузка курса...</div>;
  }

  return (
    <>
      <div className="course-editor">
        <form onSubmit={handleSubmit}>
          <div className="editor-header">
            <h2>{id ? 'Редактирование курса' : 'Создание нового курса'}</h2>
            <div className="editor-actions">
              <button 
                type="button" 
                onClick={handlePreview} 
                className="preview-btn"
              >
                👁️ Предпросмотр
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/methodist')} 
                className="cancel-btn"
              >
                Отмена
              </button>
              <button 
                type="submit" 
                className="save-btn"
                disabled={saving}
              >
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message" style={{ margin: '16px 32px' }}>
              {error}
              <button onClick={() => setError('')} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
          )}

          <div className="form-group">
            <label>Название курса *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название курса"
              required
            />
          </div>

          {/* Загрузка обложки */}
          <div className="form-group">
            <label>Обложка курса</label>
            <div className="image-upload-area">
              {coverImage ? (
                <div className="image-preview">
                  <img src={coverImage} alt="Обложка курса" />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={handleRemoveCover}
                    disabled={uploadingCover}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="image-upload-label" style={{ cursor: uploadingCover ? 'wait' : 'pointer' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    style={{ display: 'none' }}
                    disabled={uploadingCover}
                  />
                  <span>{uploadingCover ? '⏳ Загрузка...' : '📷 Нажмите для загрузки обложки'}</span>
                </label>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Описание курса</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введите описание курса"
              rows="4"
            />
          </div>

          {/* Пререквизиты курса */}
          <div className="form-group">
            <label>Пререквизиты (курсы, которые нужно пройти сначала)</label>
            {loadingCourses ? (
              <div>Загрузка курсов...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                {availableCourses.length === 0 ? (
                  <p style={{ color: '#71717A', fontSize: '14px' }}>
                    Нет доступных курсов для выбора в качестве пререквизитов
                  </p>
                ) : (
                  availableCourses.map(course => (
                    <label key={course.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={selectedPrerequisites.includes(course.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPrerequisites([...selectedPrerequisites, course.id]);
                          } else {
                            setSelectedPrerequisites(selectedPrerequisites.filter(id => id !== course.id));
                          }
                        }}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '14px' }}>
                        {course.title}
                        {course.isPublished ? ' ✅' : ' 📝'}
                      </span>
                      <span style={{ fontSize: '12px', color: '#71717A' }}>
                        ({course.level === 'BEGINNER' ? 'Начальный' : 
                          course.level === 'INTERMEDIATE' ? 'Средний' : 'Продвинутый'})
                      </span>
                    </label>
                  ))
                )}
              </div>
            )}
            {selectedPrerequisites.length > 0 && (
              <div style={{ marginTop: '8px', fontSize: '13px', color: '#71717A' }}>
                Выбрано пререквизитов: {selectedPrerequisites.length}
              </div>
            )}
          </div>

          {/* Блоки контента */}
          <div className="content-blocks">
            <h3>Содержание курса</h3>
            
            {/* ЗАКРЕПЛЕННЫЕ КНОПКИ - всегда видны при скролле */}
            <div style={{
              position: 'sticky',
              top: '0',
              zIndex: '10',
              background: 'white',
              padding: '12px 0',
              borderBottom: '1px solid #E4E4E7',
              marginBottom: '16px'
            }}>
              <div className="add-block-buttons">
                <button 
                  type="button" 
                  onClick={() => addContentBlock('text')} 
                  className="add-block-btn"
                >
                  + Текстовый материал
                </button>
                <button 
                  type="button" 
                  onClick={() => addContentBlock('video')} 
                  className="add-block-btn"
                >
                  + Видео
                </button>
                <button 
                  type="button" 
                  onClick={() => addContentBlock('simulator')} 
                  className="add-block-btn"
                >
                  + Тренажёр 1С
                </button>
                <button 
                  type="button" 
                  onClick={() => addContentBlock('test')} 
                  className="add-block-btn"
                >
                  + Тест
                </button>
                <button 
                  type="button" 
                  onClick={() => addContentBlock('example')} 
                  className="add-block-btn"
                >
                  + Разбор примера
                </button>
                <button 
                  type="button" 
                  onClick={() => addContentBlock('materials')} 
                  className="add-block-btn"
                >
                  + Материалы для скачивания
                </button>
              </div>
            </div>

            {contentBlocks.length === 0 ? (
              <p className="no-blocks">Нет добавленных блоков. Нажмите на кнопку выше, чтобы добавить контент.</p>
            ) : (
              contentBlocks.map((block, index) => (
                <ContentBlock
                  key={block.id}
                  block={block}
                  index={index}
                  onUpdate={updateContentBlock}
                  onRemove={removeContentBlock}
                  onMove={moveContentBlock}
                  totalBlocks={contentBlocks.length}
                />
              ))
            )}

            {/* ДУБЛИРУЕМ КНОПКИ ВНИЗУ - для удобства */}
            <div style={{
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid #E4E4E7'
            }}>
              <div className="add-block-buttons">
                <button 
                  type="button" 
                  onClick={() => addContentBlock('text')} 
                  className="add-block-btn"
                >
                  + Текстовый материал
                </button>
                <button 
                  type="button" 
                  onClick={() => addContentBlock('video')} 
                  className="add-block-btn"
                >
                  + Видео
                </button>
                <button 
                  type="button" 
                  onClick={() => addContentBlock('simulator')} 
                  className="add-block-btn"
                >
                  + Тренажёр 1С
                </button>
                <button 
                  type="button" 
                  onClick={() => addContentBlock('test')} 
                  className="add-block-btn"
                >
                  + Тест
                </button>
                <button 
                  type="button" 
                  onClick={() => addContentBlock('example')} 
                  className="add-block-btn"
                >
                  + Разбор примера
                </button>
                <button 
                  type="button" 
                  onClick={() => addContentBlock('materials')} 
                  className="add-block-btn"
                >
                  + Материалы для скачивания
                </button>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/methodist')} 
              className="cancel-btn"
            >
              Отмена
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={saving}
            >
              {saving ? 'Сохранение...' : 'Сохранить курс'}
            </button>
          </div>
        </form>
      </div>

      {/* Модальное окно предпросмотра */}
      {showPreview && (
        <CoursePreview
          course={{
            title,
            description,
            coverImage,
            contentBlocks,
            authorName: user?.fullName || user?.username || 'Методист',
            createdAt: new Date().toISOString()
          }}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
};

>>>>>>> 1c6164c7b8cd6ec8ce3f3de3a0d18819aa26465c
export default CourseEditor;