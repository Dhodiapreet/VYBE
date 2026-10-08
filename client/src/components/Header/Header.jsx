import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="vybe-header">
      <div className="header-container">
        <NavLink to="/home" className="logo">
          <span className="logo-vybe">VYBE</span>
        </NavLink>

        <nav className="header-nav" aria-label="Primary">
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/movies">Movies</NavLink>
          <NavLink to="/series">Series</NavLink>
          <NavLink to="/watchlist">Watchlist</NavLink>
          <NavLink to="/collections">Collections</NavLink>
          <NavLink to="/people">People</NavLink>
          <NavLink to="/feed">Community</NavLink>
        </nav>

        <div className="header-actions">
          <NavLink to="/search" className="header-search" aria-label="Search">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </NavLink>

          {user ? (
            <>
              <NavLink to="/profile" className="header-user" title={user.username || 'Profile'}>
                <span className="header-avatar">{user.username?.charAt(0).toUpperCase() || 'U'}</span>
              </NavLink>
              <button type="button" className="header-login-link" onClick={logout}>Log Out</button>
            </>
          ) : (
            <>
              <NavLink to="/signup" className="header-signup-link">Sign Up</NavLink>
              <NavLink to="/login" className="header-login-button">Log In</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}