import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiRequest } from '../services/api';

const NotificationContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

const initialMockNotifications = [
  { 
    id: 'n1', 
    type: 'like', 
    actor: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah' }, 
    action: 'liked your review of', 
    target: { title: 'Dune: Part Two', id: 1 },
    timestamp: '2h ago', 
    isRead: false 
  },
  { 
    id: 'n2', 
    type: 'reply', 
    actor: { name: 'Marcus Johnson', avatar: 'https://i.pravatar.cc/150?u=marcus' }, 
    action: 'replied to your discussion on', 
    target: { title: 'Challengers', id: 4 },
    timestamp: '5h ago', 
    isRead: false 
  },
  { 
    id: 'n3', 
    type: 'follow', 
    actor: { name: 'Elena Rodriguez', avatar: 'https://i.pravatar.cc/150?u=elena' }, 
    action: 'started following you', 
    target: null,
    timestamp: '1d ago', 
    isRead: true 
  },
  { 
    id: 'n4', 
    type: 'recommendation', 
    actor: { name: 'VYBE', avatar: 'vybe' }, 
    action: 'New recommendation based on your watchlist:', 
    target: { title: 'Civil War', id: 2 },
    timestamp: '1d ago', 
    isRead: true 
  },
  { 
    id: 'n5', 
    type: 'watchlist', 
    actor: { name: 'David Kim', avatar: 'https://i.pravatar.cc/150?u=david' }, 
    action: 'and 2 others added', 
    target: { title: 'Furiosa: A Mad Max Saga', id: 6 },
    actionSuffix: 'to their watchlist',
    timestamp: '2d ago', 
    isRead: true 
  },
  { 
    id: 'n6', 
    type: 'milestone', 
    actor: { name: 'VYBE', avatar: 'vybe' }, 
    action: 'Your review of', 
    target: { title: 'Everything Everywhere All at Once', id: 7 },
    actionSuffix: 'reached 100 likes! 🎉',
    timestamp: '3d ago', 
    isRead: true 
  }
];

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(() => {
    return initialMockNotifications;
  });
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications(initialMockNotifications);
      setUnreadCount(initialMockNotifications.filter(n => !n.isRead).length);
      return;
    }
    try {
      const res = await apiRequest('/notifications');
      if (res && res.data) {
        setNotifications(res.data);
      }
      const countRes = await apiRequest('/notifications/unread-count');
      if (countRes && countRes.data) {
        setUnreadCount(countRes.data.count);
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const addNotification = useCallback((notification) => {
    if (!user) {
      const newNotification = {
        id: `n_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: 'Just now',
        isRead: false,
        ...notification
      };
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    }
  }, [user]);

  const markAsRead = useCallback(async (id) => {
    if (!user) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      return;
    }
    try {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      await apiRequest(`/notifications/${id}/read`, { method: 'PATCH' });
    } catch (e) {
      console.error('Error marking as read', e);
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    if (!user) {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      return;
    }
    try {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      await apiRequest('/notifications/read-all', { method: 'PATCH' });
    } catch (e) {
      console.error('Error marking all as read', e);
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  const deleteNotification = useCallback(async (id) => {
    if (!user) {
      setNotifications(prev => {
        const notifToDelete = prev.find(n => n.id === id);
        if (notifToDelete && !notifToDelete.isRead) {
          setUnreadCount(c => Math.max(0, c - 1));
        }
        return prev.filter(n => n.id !== id);
      });
      return;
    }
    try {
      setNotifications(prev => {
        const notifToDelete = prev.find(n => n.id === id);
        if (notifToDelete && !notifToDelete.isRead) {
          setUnreadCount(c => Math.max(0, c - 1));
        }
        return prev.filter(n => n.id !== id);
      });
      await apiRequest(`/notifications/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Error deleting notification', e);
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      refreshNotifications: fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
