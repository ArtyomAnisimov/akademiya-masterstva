import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Auth/Login';
import Layout from './components/Layout/Layout';

// Импорты страниц
import AdminDashboard from './pages/Admin/Dashboard';
import AdminUsers from './pages/Admin/Users';

// Импорты для методиста
import MethodistCourses from './pages/Methodist/Courses';
import CourseEditor from './pages/Methodist/CourseEditor';

import DirectorDashboard from './pages/Director/Dashboard';
import SpecialistDashboard from './pages/Specialist/Dashboard';

// Импортируем стили
import './styles/index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Публичный маршрут */}
          <Route path="/login" element={<Login />} />
          
          {/* Защищенные маршруты */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {/* Админ */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              
              {/* Методист */}
              <Route path="/methodist" element={<MethodistCourses />} />
              <Route path="/methodist/courses" element={<MethodistCourses />} />
              <Route path="/methodist/create" element={<CourseEditor />} />
              <Route path="/methodist/edit/:id" element={<CourseEditor />} />
              
              {/* Руководитель */}
              <Route path="/director" element={<DirectorDashboard />} />
              
              {/* Специалист */}
              <Route path="/specialist" element={<SpecialistDashboard />} />
              
              {/* Редирект по умолчанию */}
              <Route path="/" element={<Navigate to="/admin" replace />} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;