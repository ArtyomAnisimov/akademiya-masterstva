<<<<<<< HEAD
import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Form,
  InputGroup,
  Badge,
  Spinner,
  Modal,
  Alert,
  Card,
  Row,
  Col,
} from 'react-bootstrap';
import { getUsers, updateUserRole, syncUsers } from '../../api/users';
import { useAuth } from '../../contexts/AuthContext';

const roleColors = {
  ADMIN: 'danger',
  METHODIST: 'success',
  DIRECTOR: 'warning',
  SPECIALIST: 'info',
};

const roleLabels = {
  ADMIN: 'Администратор',
  METHODIST: 'Методист',
  DIRECTOR: 'Руководитель',
  SPECIALIST: 'Специалист',
};

const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [syncDialog, setSyncDialog] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      if (response.success) {
        setUsers(response.data);
        setFilteredUsers(response.data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setMessage({ text: 'Ошибка загрузки пользователей', variant: 'danger' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    let result = users;

    if (search) {
      result = result.filter(
        (user) =>
          user.username.toLowerCase().includes(search.toLowerCase()) ||
          (user.fullName && user.fullName.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (filterRole) {
      result = result.filter((user) => user.role === filterRole);
    }

    setFilteredUsers(result);
  }, [search, filterRole, users]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await updateUserRole(userId, newRole);
      if (response.success) {
        setMessage({ text: 'Роль пользователя обновлена', variant: 'success' });
        await loadUsers();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error updating role:', error);
      setMessage({ text: 'Ошибка обновления роли', variant: 'danger' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncDialog(false);
    try {
      const response = await syncUsers();
      if (response.success) {
        setMessage({ 
          text: `Синхронизация завершена: создано ${response.data.created}, обновлено ${response.data.updated}`,
          variant: 'success' 
        });
        await loadUsers();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error syncing users:', error);
      setMessage({ text: 'Ошибка синхронизации', variant: 'danger' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Загрузка пользователей...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>👥 Управление пользователями</h2>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={loadUsers}>
            🔄 Обновить
          </Button>
          <Button variant="primary" onClick={() => setSyncDialog(true)}>
            🔄 Синхронизировать
          </Button>
        </div>
      </div>

      {message && (
        <Alert variant={message.variant} className="mb-3">
          {message.text}
        </Alert>
      )}

      <Card className="mb-3">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>🔍</InputGroup.Text>
                <Form.Control
                  placeholder="Поиск по имени..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">Все роли</option>
                <option value="ADMIN">Администратор</option>
                <option value="METHODIST">Методист</option>
                <option value="DIRECTOR">Руководитель</option>
                <option value="SPECIALIST">Специалист</option>
              </Form.Select>
            </Col>
            <Col md={3} className="d-flex align-items-center">
              <span className="text-muted">
                Найдено: {filteredUsers.length} пользователей
              </span>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Имя пользователя</th>
                <th>Полное имя</th>
                <th>Роль</th>
                <th>Дата регистрации</th>
                <th className="text-center">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id.substring(0, 8)}...</td>
                  <td>
                    <strong>{user.username}</strong>
                  </td>
                  <td>{user.fullName || '-'}</td>
                  <td>
                    <Badge bg={roleColors[user.role] || 'secondary'}>
                      {roleLabels[user.role] || user.role}
                    </Badge>
                  </td>
                  <td>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('ru-RU')
                      : '-'}
                  </td>
                  <td className="text-center">
                    <Form.Select
                      size="sm"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={user.id === currentUser?.id}
                      className="d-inline-block w-auto"
                    >
                      <option value="ADMIN">Администратор</option>
                      <option value="METHODIST">Методист</option>
                      <option value="DIRECTOR">Руководитель</option>
                      <option value="SPECIALIST">Специалист</option>
                    </Form.Select>
                    {user.id === currentUser?.id && (
                      <span className="badge bg-secondary ms-2">Вы</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Модальное окно синхронизации */}
      <Modal show={syncDialog} onHide={() => setSyncDialog(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Синхронизация пользователей</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Будут загружены все пользователи из внешнего сервиса.
            Новые пользователи будут созданы с ролью <strong>SPECIALIST</strong>.
          </p>
          <Alert variant="warning">
            Внимание: Эта операция может занять некоторое время.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSyncDialog(false)}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSync} disabled={syncing}>
            {syncing ? 'Синхронизация...' : 'Начать синхронизацию'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

=======
import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Form,
  InputGroup,
  Badge,
  Spinner,
  Modal,
  Alert,
  Card,
  Row,
  Col,
} from 'react-bootstrap';
import { getUsers, updateUserRole, syncUsers } from '../../api/users';
import { useAuth } from '../../contexts/AuthContext';

const roleColors = {
  ADMIN: 'danger',
  METHODIST: 'success',
  DIRECTOR: 'warning',
  SPECIALIST: 'info',
};

const roleLabels = {
  ADMIN: 'Администратор',
  METHODIST: 'Методист',
  DIRECTOR: 'Руководитель',
  SPECIALIST: 'Специалист',
};

const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [syncDialog, setSyncDialog] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      if (response.success) {
        setUsers(response.data);
        setFilteredUsers(response.data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setMessage({ text: 'Ошибка загрузки пользователей', variant: 'danger' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    let result = users;

    if (search) {
      result = result.filter(
        (user) =>
          user.username.toLowerCase().includes(search.toLowerCase()) ||
          (user.fullName && user.fullName.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (filterRole) {
      result = result.filter((user) => user.role === filterRole);
    }

    setFilteredUsers(result);
  }, [search, filterRole, users]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await updateUserRole(userId, newRole);
      if (response.success) {
        setMessage({ text: 'Роль пользователя обновлена', variant: 'success' });
        await loadUsers();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error updating role:', error);
      setMessage({ text: 'Ошибка обновления роли', variant: 'danger' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncDialog(false);
    try {
      const response = await syncUsers();
      if (response.success) {
        setMessage({ 
          text: `Синхронизация завершена: создано ${response.data.created}, обновлено ${response.data.updated}`,
          variant: 'success' 
        });
        await loadUsers();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error syncing users:', error);
      setMessage({ text: 'Ошибка синхронизации', variant: 'danger' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Загрузка пользователей...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>👥 Управление пользователями</h2>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={loadUsers}>
            🔄 Обновить
          </Button>
          <Button variant="primary" onClick={() => setSyncDialog(true)}>
            🔄 Синхронизировать
          </Button>
        </div>
      </div>

      {message && (
        <Alert variant={message.variant} className="mb-3">
          {message.text}
        </Alert>
      )}

      <Card className="mb-3">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>🔍</InputGroup.Text>
                <Form.Control
                  placeholder="Поиск по имени..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">Все роли</option>
                <option value="ADMIN">Администратор</option>
                <option value="METHODIST">Методист</option>
                <option value="DIRECTOR">Руководитель</option>
                <option value="SPECIALIST">Специалист</option>
              </Form.Select>
            </Col>
            <Col md={3} className="d-flex align-items-center">
              <span className="text-muted">
                Найдено: {filteredUsers.length} пользователей
              </span>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Имя пользователя</th>
                <th>Полное имя</th>
                <th>Роль</th>
                <th>Дата регистрации</th>
                <th className="text-center">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id.substring(0, 8)}...</td>
                  <td>
                    <strong>{user.username}</strong>
                  </td>
                  <td>{user.fullName || '-'}</td>
                  <td>
                    <Badge bg={roleColors[user.role] || 'secondary'}>
                      {roleLabels[user.role] || user.role}
                    </Badge>
                  </td>
                  <td>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('ru-RU')
                      : '-'}
                  </td>
                  <td className="text-center">
                    <Form.Select
                      size="sm"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={user.id === currentUser?.id}
                      className="d-inline-block w-auto"
                    >
                      <option value="ADMIN">Администратор</option>
                      <option value="METHODIST">Методист</option>
                      <option value="DIRECTOR">Руководитель</option>
                      <option value="SPECIALIST">Специалист</option>
                    </Form.Select>
                    {user.id === currentUser?.id && (
                      <span className="badge bg-secondary ms-2">Вы</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Модальное окно синхронизации */}
      <Modal show={syncDialog} onHide={() => setSyncDialog(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Синхронизация пользователей</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Будут загружены все пользователи из внешнего сервиса.
            Новые пользователи будут созданы с ролью <strong>SPECIALIST</strong>.
          </p>
          <Alert variant="warning">
            Внимание: Эта операция может занять некоторое время.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSyncDialog(false)}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSync} disabled={syncing}>
            {syncing ? 'Синхронизация...' : 'Начать синхронизацию'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

>>>>>>> 1c6164c7b8cd6ec8ce3f3de3a0d18819aa26465c
export default Users;