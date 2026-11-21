import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Ensure any early network request immediately carries the stored token
const initialSavedToken = localStorage.getItem('bc_token');
if (initialSavedToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${initialSavedToken}`;
}

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('bc_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('bc_user');
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => !localStorage.getItem('bc_user') && !!localStorage.getItem('bc_token'));

  // Set default axios authorization header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('bc_token', token);
      fetchCurrentUser();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('bc_token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('bc_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.warn('Could not fetch user profile:', err);
      // If server unreachable, check if we had cached user
      const cached = localStorage.getItem('bc_user');
      if (cached) {
        try { setUser(JSON.parse(cached)); } catch (e) {}
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('bc_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const register = async (formData) => {
    const res = await axios.post('/api/auth/register', formData);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('bc_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('bc_token');
    localStorage.removeItem('bc_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Helper flags
  const isLoggedIn = !!user;
  const isApproved = user && (user.role === 'admin' || user.b2bStatus === 'approved');
  const isPending = user && user.b2bStatus === 'pending' && user.role !== 'admin';
  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isLoggedIn,
        isApproved,
        isPending,
        isAdmin,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
