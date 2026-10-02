import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../Login/Login.css';

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

export default function SignUp() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    
    setError(null);
    setLoading(true);

    try {
      await register(name, email, password);
      setSuccess(true);
      setTimeout(() => navigate('/home'), 1000);
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-panel-content">
          <Link to="/home" className="auth-panel-logo">VYBE</Link>
          <h1 className="auth-panel-quote">JOIN THE<br/>REVOLUTION.</h1>
          <p className="auth-panel-sub">Create an account to track your watchlist, share reviews, and connect with other cinephiles.</p>
        </div>
      </div>
      
      <div className="auth-content">
        <Link to="/home" className="auth-mobile-logo">VYBE</Link>
        
        <div className="auth-form-container">
          <h2 className="auth-title">Create an account</h2>
          <p className="auth-subtitle">Join VYBE and start your journey.</p>
          
          {error && (
            <div className="auth-alert error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="auth-alert success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>Account created successfully. Redirecting...</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSignUp}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Username</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  id="name" 
                  className="form-input" 
                  placeholder="Enter a username" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading || success}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <div className="input-wrapper">
                <input 
                  type="email" 
                  id="email" 
                  className="form-input" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || success}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  className="form-input" 
                  placeholder="Create a password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || success}
                />
                <button 
                  type="button" 
                  className="btn-toggle-password" 
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading || success}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="confirmPassword" 
                  className="form-input" 
                  placeholder="Confirm your password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading || success}
                />
              </div>
            </div>
            
            <div className="auth-options">
              <label className="checkbox-label" style={{ fontSize: '0.875rem' }}>
                <input 
                  type="checkbox" 
                  className="checkbox-input"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  disabled={loading || success}
                />
                <span>I agree to the <a href="#terms" className="forgot-link" onClick={(e) => e.preventDefault()}>Terms</a> and <a href="#privacy" className="forgot-link" onClick={(e) => e.preventDefault()}>Privacy Policy</a></span>
              </label>
            </div>
            
            <button type="submit" className="btn-submit" disabled={loading || success}>
              {loading ? <div className="loader"></div> : 'Create Account'}
            </button>
          </form>
          
          <div className="auth-redirect">
            Already have an account? 
            <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
