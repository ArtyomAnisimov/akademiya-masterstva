<<<<<<< HEAD
/**
 * КОМПОНЕНТ ОБЛОЖКИ КУРСА
 * 
 * Отображает обложку курса с обработкой ошибок
 */

import React from 'react';

const CourseCover = ({ 
  coverImage, 
  title, 
  height = '160px',
  className = '',
  fallbackIcon = '📚'
}) => {
  const [error, setError] = React.useState(false);

  const handleError = () => {
    setError(true);
  };

  if (error || !coverImage) {
    return (
      <div 
        className={`course-cover-fallback ${className}`}
        style={{
          width: '100%',
          height: height,
          background: 'linear-gradient(135deg, #E11D2C, #B81523)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '48px',
          borderRadius: '10px 10px 0 0'
        }}
      >
        {fallbackIcon}
      </div>
    );
  }

  return (
    <img 
      src={coverImage} 
      alt={title || 'Обложка курса'} 
      className={`course-cover-image ${className}`}
      style={{
        width: '100%',
        height: height,
        objectFit: 'cover',
        background: '#f0f0f0',
        borderRadius: '10px 10px 0 0'
      }}
      onError={handleError}
    />
  );
};

=======
/**
 * КОМПОНЕНТ ОБЛОЖКИ КУРСА
 * 
 * Отображает обложку курса с обработкой ошибок
 */

import React from 'react';

const CourseCover = ({ 
  coverImage, 
  title, 
  height = '160px',
  className = '',
  fallbackIcon = '📚'
}) => {
  const [error, setError] = React.useState(false);

  const handleError = () => {
    setError(true);
  };

  if (error || !coverImage) {
    return (
      <div 
        className={`course-cover-fallback ${className}`}
        style={{
          width: '100%',
          height: height,
          background: 'linear-gradient(135deg, #E11D2C, #B81523)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '48px',
          borderRadius: '10px 10px 0 0'
        }}
      >
        {fallbackIcon}
      </div>
    );
  }

  return (
    <img 
      src={coverImage} 
      alt={title || 'Обложка курса'} 
      className={`course-cover-image ${className}`}
      style={{
        width: '100%',
        height: height,
        objectFit: 'cover',
        background: '#f0f0f0',
        borderRadius: '10px 10px 0 0'
      }}
      onError={handleError}
    />
  );
};

>>>>>>> 1c6164c7b8cd6ec8ce3f3de3a0d18819aa26465c
export default CourseCover;