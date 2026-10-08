import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        const res = await apiRequest('/auth/me');

        // Backend response:
        // res.data.user
        if (res?.data?.user) {
          setUser(res.data.user);
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const register = async (username, email, password) => {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username,
        email,
        password
      })
    });

    if (!res?.data?.token) {
      throw new Error(res?.message || 'Registration failed');
    }

    localStorage.setItem('token', res.data.token);

    if (res.data.user) {
      setUser(res.data.user);
    }

    return res.data;
  };

  const login = async (email, password) => {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      })
    });

    if (!res?.data?.token) {
      throw new Error(res?.message || 'Login failed');
    }

    localStorage.setItem('token', res.data.token);

    if (res.data.user) {
      setUser(res.data.user);
    }

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}