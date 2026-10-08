import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { unreadCount } = useNotifications();
  const { user, logout } = useAuth();

  return (
    <header className="vybe-header">
      <div className="header-container">
        <div className="logo">
          <NavLink to="/home" style={{ textDecoration: 'none' }}><span className="logo-vybe">VYBE</span></NavLink>
        </div>
        <nav className="header-nav">
          <NavLink to="/home" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
          <NavLink to="/movies" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Movies</NavLink>
          <NavLink to="/series" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Series</NavLink>
          <NavLink to="/watchlist" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Watchlist</NavLink>
          <NavLink to="/collections" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Collections</NavLink>
          <NavLink to="/people" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>People</NavLink>
          <NavLink to="/feed" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Community</NavLink>
        </nav>
        <div className="header-actions">
          <NavLink to="/search" className={({ isActive }) => isActive ? "btn-icon active-icon" : "btn-icon"} aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </NavLink>
          <NavLink to="/messages" className="btn-icon header-notification-link" aria-label="Messages">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span className="header-notification-badge">2</span>
          </NavLink>
          <NavLink to="/notifications" className="btn-icon header-notification-link" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {unreadCount > 0 && <span className="header-notification-badge">{unreadCount}</span>}
          </NavLink>
          {user ? (
            <>
              <NavLink to="/profile" className="btn-icon" aria-label="Profile" title={user.username}>
                <div className="avatar">{user.username ? user.username.charAt(0).toUpperCase() : 'U'}</div>
              </NavLink>
              <button onClick={logout} className="nav-link sign-in-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Log Out</button>
            </>
          ) : (
            <NavLink to="/login" className="nav-link sign-in-link">Log In</NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
