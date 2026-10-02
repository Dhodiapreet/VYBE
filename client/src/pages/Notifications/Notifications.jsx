import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Notifications.css';

import { useNotifications } from '../../contexts/NotificationContext';

export default function Notifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread

  useEffect(() => {
    // Simulate network delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const handleMarkAsRead = (id) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleDelete = (id) => {
    deleteNotification(id);
  };

  const getTargetLink = (notification) => {
    if (notification.type === 'message') return '/messages';
    if (!notification.target) return '/profile';
    if (notification.type === 'reply') return `/movies/${notification.target.id}/discussions`;
    return `/movies/${notification.target.id}`;
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'like':
      case 'milestone':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        );
      case 'message':
      case 'reply':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        );
      case 'follow':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        );
      case 'recommendation':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        );
      case 'watchlist':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <header className="notifications-header">
          <div className="header-title-group">
            <h1>Notifications</h1>
            {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
          </div>
          <div className="header-actions">
            <div className="filter-tabs">
              <button 
                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
                onClick={() => setFilter('unread')}
              >
                Unread
              </button>
            </div>
            {unreadCount > 0 && (
              <button className="btn-mark-all" onClick={handleMarkAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>
        </header>

        {loading ? (
          <div className="notifications-loading">
            <div className="spinner"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="notifications-empty">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <h2>You're all caught up!</h2>
            <p>Check back later for new notifications.</p>
          </div>
        ) : (
          <ul className="notifications-list">
            {filteredNotifications.map((notif) => (
              <li key={notif.id} className={`notification-item ${!notif.isRead ? 'unread' : ''}`}>
                <Link to={getTargetLink(notif)} className="notification-content-link">
                  <div className="notification-avatar-container">
                    {notif.actor.avatar === 'vybe' ? (
                      <div className="vybe-avatar">V</div>
                    ) : (
                      <img src={notif.actor.avatar} alt={notif.actor.name} className="actor-avatar" />
                    )}
                    <div className={`notification-type-icon ${notif.type}`}>
                      {renderIcon(notif.type)}
                    </div>
                  </div>
                  
                  <div className="notification-details">
                    <p className="notification-text">
                      <span className="actor-name">{notif.actor.name}</span>{' '}
                      <span className="action-text">{notif.action}</span>{' '}
                      {notif.target && <span className="target-title">{notif.target.title}</span>}
                      {notif.actionSuffix && <span className="action-text"> {notif.actionSuffix}</span>}
                    </p>
                    <span className="notification-time">
                      {new Date(notif.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                    </span>
                  </div>
                </Link>
                
                <div className="notification-actions">
                  {!notif.isRead && (
                    <button 
                      className="btn-action mark-read" 
                      onClick={() => handleMarkAsRead(notif.id)}
                      aria-label="Mark as read"
                      title="Mark as read"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </button>
                  )}
                  <button 
                    className="btn-action delete" 
                    onClick={() => handleDelete(notif.id)}
                    aria-label="Remove notification"
                    title="Remove"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
