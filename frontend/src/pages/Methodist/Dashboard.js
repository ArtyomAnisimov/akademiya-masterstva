<<<<<<< HEAD
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MethodistDashboard = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
        📚 Добро пожаловать, {user?.fullName || user?.username}!
      </h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
        Вы вошли как <strong style={{ color: '#E11D2C' }}>Методист</strong>
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px' 
      }}>
        <div style={{ 
          background: 'white', 
          padding: '24px', 
          borderRadius: '12px', 
          border: '1px solid #E4E4E7',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>➕ Создать курс</h3>
          <p style={{ fontSize: '14px', color: '#666' }}>Создание нового курса</p>
        </div>
        
        <div style={{ 
          background: 'white', 
          padding: '24px', 
          borderRadius: '12px', 
          border: '1px solid #E4E4E7',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>📖 Мои курсы</h3>
          <p style={{ fontSize: '14px', color: '#666' }}>Редактирование курсов</p>
        </div>
        
        <div style={{ 
          background: 'white', 
          padding: '24px', 
          borderRadius: '12px', 
          border: '1px solid #E4E4E7',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>📊 Статистика</h3>
          <p style={{ fontSize: '14px', color: '#666' }}>Статистика по курсам</p>
        </div>
      </div>
    </div>
  );
};

=======
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MethodistDashboard = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
        📚 Добро пожаловать, {user?.fullName || user?.username}!
      </h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
        Вы вошли как <strong style={{ color: '#E11D2C' }}>Методист</strong>
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px' 
      }}>
        <div style={{ 
          background: 'white', 
          padding: '24px', 
          borderRadius: '12px', 
          border: '1px solid #E4E4E7',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>➕ Создать курс</h3>
          <p style={{ fontSize: '14px', color: '#666' }}>Создание нового курса</p>
        </div>
        
        <div style={{ 
          background: 'white', 
          padding: '24px', 
          borderRadius: '12px', 
          border: '1px solid #E4E4E7',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>📖 Мои курсы</h3>
          <p style={{ fontSize: '14px', color: '#666' }}>Редактирование курсов</p>
        </div>
        
        <div style={{ 
          background: 'white', 
          padding: '24px', 
          borderRadius: '12px', 
          border: '1px solid #E4E4E7',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>📊 Статистика</h3>
          <p style={{ fontSize: '14px', color: '#666' }}>Статистика по курсам</p>
        </div>
      </div>
    </div>
  );
};

>>>>>>> 1c6164c7b8cd6ec8ce3f3de3a0d18819aa26465c
export default MethodistDashboard;