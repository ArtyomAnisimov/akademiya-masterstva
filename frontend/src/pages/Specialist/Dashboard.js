import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const SpecialistDashboard = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
        👨‍💻 Добро пожаловать, {user?.fullName || user?.username}!
      </h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
        Вы вошли как <strong style={{ color: '#E11D2C' }}>Специалист</strong>
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
          <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>📖 Мои курсы</h3>
          <p style={{ fontSize: '14px', color: '#666' }}>Доступные курсы</p>
        </div>
        
        <div style={{ 
          background: 'white', 
          padding: '24px', 
          borderRadius: '12px', 
          border: '1px solid #E4E4E7',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>📊 Мой прогресс</h3>
          <p style={{ fontSize: '14px', color: '#666' }}>Отслеживание прогресса</p>
        </div>
        
        <div style={{ 
          background: 'white', 
          padding: '24px', 
          borderRadius: '12px', 
          border: '1px solid #E4E4E7',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>🏆 Сертификаты</h3>
          <p style={{ fontSize: '14px', color: '#666' }}>Мои сертификаты</p>
        </div>
      </div>
    </div>
  );
};

export default SpecialistDashboard;