import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize from local storage
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('research_user');
      const token = localStorage.getItem('access_token');

      if (savedUser && token) {
        // Technically should verify token here, but trusting local storage for now
        setUser(JSON.parse(savedUser));
      }

      const savedActivities = localStorage.getItem('research_activities');
      if (savedActivities) {
        setActivities(JSON.parse(savedActivities));
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const logActivity = (type, details, targetUser = null) => {
    const activeUser = targetUser || user;
    if (!activeUser) return;

    const newActivity = {
      id: `act-${Date.now()}`,
      userId: activeUser.id,
      userName: activeUser.username || activeUser.name,
      type,
      details,
      timestamp: new Date().toISOString(),
    };

    const updatedActivities = [newActivity, ...activities];
    setActivities(updatedActivities);
    localStorage.setItem('research_activities', JSON.stringify(updatedActivities));
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('register/', {
        username: name,
        email: email,
        password: password
      });

      // Auto login after successful registration
      return await login(email, password, 'student');

    } catch (error) {
      console.error('Registration failed:', error);
      const msg = error.response?.data?.error || error.response?.data?.username?.[0] || error.response?.data?.email?.[0] || 'Registration failed';
      return { success: false, message: msg };
    }
  };

  const login = async (email, password, role) => {
    try {
      // Get JWT Tokens
      const response = await api.post('login/', {
        email: email,
        password: password
      });

      const { access, refresh } = response.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Fetch User Profile
      const profileRes = await api.get('profile/', {
        headers: { Authorization: `Bearer ${access}` }
      });

      const userData = profileRes.data;

      setUser(userData);
      localStorage.setItem('research_user', JSON.stringify(userData));

      logActivity('login', 'User logged in securely', userData);
      return { success: true };

    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        message: error.response?.data?.detail || 'Invalid credentials or server error.'
      };
    }
  };

  const logout = () => {
    logActivity('logout', 'User logged out');
    setUser(null);
    localStorage.removeItem('research_user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      logActivity,
      activities,
      isAuthenticated: !!user,
      loading
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

