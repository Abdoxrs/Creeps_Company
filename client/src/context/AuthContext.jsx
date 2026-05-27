import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          // Fetch logged-in user profile
          const response = await api.get('/users/me');
          if (response.data && response.data.data) {
            setUser(response.data.data);
          } else {
            // Fallback if data structure varies
            setUser(response.data);
          }
        } catch (error) {
          console.error('Error fetching current user:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      const { user: loggedUser, token: authToken } = response.data.data;
      
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setToken(authToken);
      setUser(loggedUser);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to login'
      };
    }
  };

  const signup = async (email, password, passwordConfirmation, role = 'user') => {
    try {
      const response = await api.post('/users/signup', {
        email,
        password,
        passwordConfirmation,
        role
      });
      const { user: loggedUser, token: authToken } = response.data.data;
      
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setToken(authToken);
      setUser(loggedUser);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to sign up'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updatedData) => {
    try {
      const response = await api.patch('/users/me', updatedData);
      const updatedUser = response.data.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile'
      };
    }
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
