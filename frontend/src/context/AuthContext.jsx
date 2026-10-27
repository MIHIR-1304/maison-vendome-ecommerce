import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const profile = await authApi.getProfile();
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        } catch (err) {
          console.warn('Failed to verify existing session token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (credentials) => {
    const authData = await authApi.login(credentials);
    const userInfo = {
      id: authData.id,
      email: authData.email,
      fullName: authData.fullName,
      role: authData.role,
    };
    setToken(authData.token);
    setUser(userInfo);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(userInfo));
    return userInfo;
  };

  const register = async (userData) => {
    const authData = await authApi.register(userData);
    const userInfo = {
      id: authData.id,
      email: authData.email,
      fullName: authData.fullName,
      role: authData.role,
    };
    setToken(authData.token);
    setUser(userInfo);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(userInfo));
    return userInfo;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const refreshProfile = async () => {
    if (token) {
      const profile = await authApi.getProfile();
      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
      return profile;
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role,
        isAdmin,
        loading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
