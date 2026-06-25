<<<<<<< HEAD
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert
} from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

//import logo from '../../../public/LogoFull.svg';
//import reactsvg from 'react-svg'
//import { ReactSVG } from "react-svg";
//import LogoSvg from "svg-react-loader!../../../public/LogoFull.svg";
//import LogoSvg from '../../assets/LogoFull.svg';
import logoPath from '../../assets/LogoFull.svg';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      const role = result.data.role;
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'METHODIST') navigate('/methodist');
      else if (role === 'DIRECTOR') navigate('/director');
      else navigate('/specialist');
    } else {
      setError(result.error || 'Ошибка входа');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Логотип */}
        <div className="logo">

          <img src={logoPath} />
          <br />
          <br />
          <h2>Академия <span className="accent">Мастерства</span></h2>
          <p>Вход в систему</p>
        </div>

        {/* Ошибка */}
        {error && (
          <div className="error-message">
            {error}
            <button className="close-btn" onClick={() => setError('')}>×</button>
          </div>
        )}

        {/* Форма */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Имя пользователя <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="Введите имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>
              Пароль <span className="required">*</span>
            </label>
            <input
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        {/* Демо-информация */}
        <div className="demo-info">
          <p>🔑 Тестовые пользователи:</p>
          <div className="badges">
            <span className="badge">
              <span className="label">admin</span> / <span className="value">admin123</span>
            </span>
            <span className="badge">
              <span className="label">methodist</span> / <span className="value">methodist123</span>
            </span>
            <span className="badge">
              <span className="label">director</span> / <span className="value">director123</span>
            </span>
            <span className="badge">
              <span className="label">мария.смирнова</span> / <span className="value">specialist123</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

=======
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert
} from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

//import logo from '../../../public/LogoFull.svg';
//import reactsvg from 'react-svg'
//import { ReactSVG } from "react-svg";
//import LogoSvg from "svg-react-loader!../../../public/LogoFull.svg";
//import LogoSvg from '../../assets/LogoFull.svg';
import logoPath from '../../assets/LogoFull.svg';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      const role = result.data.role;
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'METHODIST') navigate('/methodist');
      else if (role === 'DIRECTOR') navigate('/director');
      else navigate('/specialist');
    } else {
      setError(result.error || 'Ошибка входа');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Логотип */}
        <div className="logo">

          <img src={logoPath} />
          <br />
          <br />
          <h2>Академия <span className="accent">Мастерства</span></h2>
          <p>Вход в систему</p>
        </div>

        {/* Ошибка */}
        {error && (
          <div className="error-message">
            {error}
            <button className="close-btn" onClick={() => setError('')}>×</button>
          </div>
        )}

        {/* Форма */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Имя пользователя <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="Введите имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>
              Пароль <span className="required">*</span>
            </label>
            <input
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        {/* Демо-информация */}
        <div className="demo-info">
          <p>🔑 Тестовые пользователи:</p>
          <div className="badges">
            <span className="badge">
              <span className="label">admin</span> / <span className="value">admin123</span>
            </span>
            <span className="badge">
              <span className="label">methodist</span> / <span className="value">methodist123</span>
            </span>
            <span className="badge">
              <span className="label">director</span> / <span className="value">director123</span>
            </span>
            <span className="badge">
              <span className="label">мария.смирнова</span> / <span className="value">specialist123</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

>>>>>>> 1c6164c7b8cd6ec8ce3f3de3a0d18819aa26465c
export default Login;