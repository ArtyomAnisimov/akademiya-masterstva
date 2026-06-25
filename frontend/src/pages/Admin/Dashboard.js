<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card className="h-100 shadow-sm">
    <Card.Body>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h6 className="text-muted mb-2">{title}</h6>
          <h2 className="mb-1">{value}</h2>
          <small className="text-muted">{subtitle}</small>
        </div>
        <div className={`bg-${color} bg-opacity-10 p-3 rounded`} style={{ fontSize: '28px' }}>
          {icon}
        </div>
      </div>
    </Card.Body>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    assignments: 0,
    completed: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      setStats({
        users: 42,
        courses: 156,
        assignments: 89,
        completed: 34,
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Загрузка статистики...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">👋 Добро пожаловать, {user?.fullName || user?.username}!</h2>
      <p className="text-muted mb-4">Здесь вы можете управлять платформой Академия Мастерства</p>

      <Row className="g-4">
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            title="Пользователи"
            value={stats.users}
            icon="👥"
            color="primary"
            subtitle="Всего зарегистрировано"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            title="Курсы"
            value={stats.courses}
            icon="📚"
            color="success"
            subtitle="Доступно для прохождения"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            title="Назначения"
            value={stats.assignments}
            icon="📋"
            color="warning"
            subtitle="Курсов назначено"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            title="Завершено"
            value={stats.completed}
            icon="✅"
            color="info"
            subtitle="Курсов завершено"
          />
        </Col>
      </Row>

      <Row className="mt-4 g-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">📌 Последние действия</h5>
              <p className="text-muted">Здесь будут отображаться последние действия в системе</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">⚡ Быстрые действия</h5>
              <ul className="text-muted ps-3">
                <li>Создать нового пользователя</li>
                <li>Назначить курс</li>
                <li>Создать новый курс</li>
                <li>Просмотреть отчеты</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

=======
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card className="h-100 shadow-sm">
    <Card.Body>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h6 className="text-muted mb-2">{title}</h6>
          <h2 className="mb-1">{value}</h2>
          <small className="text-muted">{subtitle}</small>
        </div>
        <div className={`bg-${color} bg-opacity-10 p-3 rounded`} style={{ fontSize: '28px' }}>
          {icon}
        </div>
      </div>
    </Card.Body>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    assignments: 0,
    completed: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      setStats({
        users: 42,
        courses: 156,
        assignments: 89,
        completed: 34,
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Загрузка статистики...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">👋 Добро пожаловать, {user?.fullName || user?.username}!</h2>
      <p className="text-muted mb-4">Здесь вы можете управлять платформой Академия Мастерства</p>

      <Row className="g-4">
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            title="Пользователи"
            value={stats.users}
            icon="👥"
            color="primary"
            subtitle="Всего зарегистрировано"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            title="Курсы"
            value={stats.courses}
            icon="📚"
            color="success"
            subtitle="Доступно для прохождения"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            title="Назначения"
            value={stats.assignments}
            icon="📋"
            color="warning"
            subtitle="Курсов назначено"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            title="Завершено"
            value={stats.completed}
            icon="✅"
            color="info"
            subtitle="Курсов завершено"
          />
        </Col>
      </Row>

      <Row className="mt-4 g-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">📌 Последние действия</h5>
              <p className="text-muted">Здесь будут отображаться последние действия в системе</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">⚡ Быстрые действия</h5>
              <ul className="text-muted ps-3">
                <li>Создать нового пользователя</li>
                <li>Назначить курс</li>
                <li>Создать новый курс</li>
                <li>Просмотреть отчеты</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

>>>>>>> 1c6164c7b8cd6ec8ce3f3de3a0d18819aa26465c
export default Dashboard;