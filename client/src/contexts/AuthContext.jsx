import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiRequest } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await apiRequest('/auth/me');
          if (res && res.data) {
            setUser(res.data);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.token) {
      localStorage.setItem('token', res.token);
      setUser(res.data || { email }); // Fallback if data is not returned immediately
      
      // refetch to get full user data
      try {
         const userRes = await apiRequest('/auth/me');
         if (userRes && userRes.data) {
           setUser(userRes.data);
         }
      } catch(error) {
         console.warn('Could not fetch user details after login:', error.message);
      }
      
      return true;
    }
    return false;
  };

  const register = async (username, email, password) => {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password })
    });
    if (res.token) {
      localStorage.setItem('token', res.token);
      setUser(res.data || { username, email });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
