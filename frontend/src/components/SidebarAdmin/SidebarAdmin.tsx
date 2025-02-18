import React, { useState } from 'react';
import './SidebarAdmin.css';
import { LogOut, Book, User, Calendar, Menu, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
    onNavigate: (component: 'settings' | 'events' | 'dashboard') => void;
    activeComponent: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activeComponent }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    };

    const handleNavigation = (component: 'settings' | 'events' | 'dashboard') => {
        onNavigate(component);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <div className="mobile-navbar">
        <div className="mobile-navbar-content">
          <div className="mobile-logo">
            <Book size={42} color="white" />
            <span className="mobile-brand">Class Hub</span>
          </div>
          <div className="mobile-actions">
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
                    <li
                        className={`menu-item ${activeComponent === 'dashboard' ? 'active' : ''}`}
                        onClick={() => handleNavigation('dashboard')}
                    >
                        <List className="menu-icon" size={20} />
                        <span>Dashboard</span>
                    </li>
                    <li
                        className={`menu-item ${activeComponent === 'events' ? 'active' : ''}`}
                        onClick={() => handleNavigation('events')}
                    >
                        <Calendar className="menu-icon" size={20} />
                        <span>Eventos</span>
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
                    <span className="sidebar-user">Olá, Admin</span>
                    <button className="logout-button" onClick={handleLogout}>
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

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