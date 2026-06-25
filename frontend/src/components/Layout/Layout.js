import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    const items = [];

    if (user?.role === 'ADMIN') {
      items.push(
        //{ id: 'dashboard', label: 'Дашборд', icon: '📊', path: '/admin' },
        { id: 'users', label: 'Пользователи', icon: '👥', path: '/admin/users' },
        //{ id: 'courses', label: 'Курсы', icon: '📚', path: '/admin/courses' },
      );
    } else if (user?.role === 'METHODIST') {
      items.push(
        { id: 'dashboard', label: 'Дашборд', icon: '📊', path: '/methodist' },
        { id: 'courses', label: 'Мои курсы', icon: '📚', path: '/methodist/courses' },
        { id: 'create', label: 'Создать курс', icon: '➕', path: '/methodist/create' },
      );
    } else if (user?.role === 'DIRECTOR') {
      items.push(
        { id: 'dashboard', label: 'Дашборд', icon: '📊', path: '/director' },
        { id: 'team', label: 'Команда', icon: '👥', path: '/director/team' },
        { id: 'assignments', label: 'Назначения', icon: '📋', path: '/director/assignments' },
      );
    } else {
      items.push(
        { id: 'dashboard', label: 'Дашборд', icon: '📊', path: '/specialist' },
        { id: 'courses', label: 'Мои курсы', icon: '📚', path: '/specialist/courses' },
        { id: 'progress', label: 'Прогресс', icon: '📈', path: '/specialist/progress' },
      );
    }

    return items;
  };

  const menuItems = getMenuItems();

  return (
    <div className="app-container">
      {/* Сайдбар */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-dot">🎓</div>
          <div className="brand-text">
            <div className="brand-name">Академия Мастерства</div>
            <div className="brand-sub">Платформа обучения</div>
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-label">Меню</div>
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => {
                setCurrentView(item.id);
                navigate(item.path);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="role-block">
          <div className="role-label">Пользователь</div>
          <div style={{ padding: '8px 12px', fontSize: '14px', color: '#18181B' }}>
            {user?.fullName || user?.username}
            <div style={{ fontSize: '11px', color: '#71717A', marginTop: '2px' }}>
              {user?.role}
            </div>
          </div>

        </div>
      </aside>

      {/* Основной контент */}
      <main className="main-content">
        <header className="topbar">
          <div className="crumb">
            <span>Академия Мастерства</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-current">
              {menuItems.find(item => item.id === currentView)?.label || 'Дашборд'}
            </span>
          </div>
          <div className="top-actions">
            <div className="user-chip">
              <div className="user-avatar">
                {/*user?.fullName?.charAt(0) + user|| user?.username?.charAt(0) || 'U'*/
                  user?.fullName.split(" ")[0].charAt(0) + user?.fullName.split(" ")[1].charAt(0) || user?.username?.charAt(0) || 'U'
                  //user?.fullName.split(" ")[0]
                }
              </div>
              <div>
                <div className="user-name">{user?.fullName || user?.username}</div>
                <div className="user-meta">{user?.role}
                </div>
              </div>
            </div><button
              className="btn btn-link"
              onClick={handleLogout}
              style={{ color: '#E11D2C' }}
            >

              <span>Выйти</span>
            </button>
          </div>
        </header>

        <div className="view">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;