import React from 'react';
import './Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="vybe-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand-section">
            <h2 className="footer-logo">VYBE</h2>
            <p className="footer-brand-statement">
              Your cinematic compass. Discover, track, and share the best movies and shows with a community that shares your taste.
            </p>
          </div>
          <div className="footer-links-section">
            <div className="footer-link-group">
              <h4>Explore</h4>
              <a href="#movies">Movies</a>
              <a href="#series">Series</a>
              <a href="#trending">Trending</a>
            </div>
            <div className="footer-link-group">
              <h4>Community</h4>
              <a href="#reviews">Reviews</a>
              <a href="#lists">Lists</a>
              <a href="#members">Members</a>
            </div>
            <div className="footer-link-group">
              <h4>Account</h4>
              <a href="#profile">Profile</a>
              <a href="#settings">Settings</a>
              <a href="#watchlist">Watchlist</a>
            </div>
            <div className="footer-link-group">
              <h4>Legal</h4>
              <a href="#terms">Terms</a>
              <a href="#privacy">Privacy</a>
              <a href="#cookies">Cookies</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-social">
            <a href="#twitter" aria-label="Twitter">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
            <a href="#instagram" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#youtube" aria-label="YouTube">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
            </a>
          </div>
          <div className="footer-copy">
            &copy; {CURRENT_YEAR} VYBE. Made with <span className="heart">♥</span> in India.
          </div>
        </div>
      </div>
    </footer>
  );
}
