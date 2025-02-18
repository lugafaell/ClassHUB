import React from 'react';
import { Bell } from 'lucide-react';
import './NotificationBell.css';

interface NotificationBellProps {
  onClick: () => void;
  unreadCount: number;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ onClick, unreadCount }) => {
  return (
    <div className="notification-bell-container">
      <button 
        onClick={onClick}
        className="notification-bell-button"
      >
        <Bell size={20} color="white" />
        {unreadCount > 0 && (
          <div className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </button>
    </div>
  );
};

export default NotificationBell;