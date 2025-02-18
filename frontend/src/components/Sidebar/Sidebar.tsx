import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { LogOut, Book, ClipboardList, ClipboardCheck, User, Calendar, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationsModal from '../NotificationsModal/NotificationsModal';
import NotificationBell from '../NotificationBell/NotificationBell';
import Cronograma from '../Cronograma/Cronograma';

interface SidebarProps {
  onNavigate: (component: 'pendentes' | 'completos' | 'settings' | 'events' | 'feedback') => void;
  activeComponent: string;
}

interface Notification {
  id: string
  message: string
  notifiable_type: 'Tarefa' | 'Event'
  notifiable: {
    id: number
    titulo?: string
    data_entrega?: string
    title?: string
    date?: string
    location?: string
  } | null
  read: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activeComponent }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCronogramaOpen, setIsCronogramaOpen] = useState(false);
  const [userName, setUserName] = useState('Carregando...');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const getAuthToken = () => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const authData = JSON.parse(auth);
      return authData.token;
    }
    return null;
  };

  const fetchNotifications = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await fetch('http://localhost:3000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const { user } = JSON.parse(authData);
      setUserName(user.nome);
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleNavigation = (component: 'pendentes' | 'completos' | 'settings' | 'events' | 'feedback') => {
    onNavigate(component);
    setIsMobileMenuOpen(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <div className="mobile-navbar">
        <div className="mobile-navbar-content">
          <div className="mobile-logo">
            <Book size={42} color="white" />
            <span className="mobile-brand">Class Hub</span>
          </div>
          <div className="mobile-actions">
            <NotificationBell
              onClick={() => setIsNotificationsOpen(true)}
              unreadCount={unreadCount}
            />
            <button
              className="mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} color="white" />
            </button>
          </div>
        </div>
      </div>

      <div className={`sidebar ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <div className="sidebar-header desktop-only">
          <Book size={42} color="white" />
          <p className="sidebar-brand">Class Hub</p>
        </div>
        <ul className="sidebar-menu">
          <li className="menu-item notification-item-bell" onClick={() => setIsNotificationsOpen(true)}>
            <NotificationBell
              onClick={() => setIsNotificationsOpen(true)}
              unreadCount={unreadCount}
            />
            <span>Notificações</span>
          </li>
          <li
            className="menu-item"
            onClick={() => setIsCronogramaOpen(true)}
          >
            <Calendar className="menu-icon" size={20} />
            <span>Cronograma</span>
          </li>
          <li
            className={`menu-item ${activeComponent === 'pendentes' ? 'active' : ''}`}
            onClick={() => handleNavigation('pendentes')}
          >
            <ClipboardList className="menu-icon" size={20} />
            <span>Tarefas Pendentes</span>
          </li>
          <li
            className={`menu-item ${activeComponent === 'completos' ? 'active' : ''}`}
            onClick={() => handleNavigation('completos')}
          >
            <ClipboardCheck className="menu-icon" size={20} strokeWidth={3} />
            <span>Tarefas Concluídas</span>
          </li>
          <li
            className={`menu-item ${activeComponent === 'events' ? 'active' : ''}`}
            onClick={() => handleNavigation('events')}
          >
            <Calendar className="menu-icon" size={20} />
            <span>Eventos</span>
          </li>
          <li
            className={`menu-item ${activeComponent === 'feedback' ? 'active' : ''}`}
            onClick={() => handleNavigation('feedback')}
          >
            <Calendar className="menu-icon" size={20} />
            <span>Feedbacks</span>
          </li>
          <li
            className={`menu-item ${activeComponent === 'settings' ? 'active' : ''}`}
            onClick={() => handleNavigation('settings')}
          >
            <User className="menu-icon" size={20} />
            <span>Perfil</span>
          </li>
        </ul>
        <div className="sidebar-footer">
          <span className="sidebar-user">Olá, {userName}</span>
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onNotificationsUpdate={setNotifications}
      />

      <Cronograma
        isOpen={isCronogramaOpen}
        onClose={() => setIsCronogramaOpen(false)}
      />

      {isMobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;