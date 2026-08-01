import React, { createContext, useContext, useState, useCallback } from 'react';
import { API_BASE_URL } from '@/lib/api';




















const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('campus_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const url = `${API_BASE_URL}/auth/login`;
      const payload = { email: email.toLowerCase().trim(), password };

      console.log('=== LOGIN ATTEMPT ===');
      console.log('URL:', url);
      console.log('Payload:', payload);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);
      console.log('Response OK:', response.ok);

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success && data.data?.user) {
        const userData = data.data.user;
        setUser(userData);
        localStorage.setItem('campus_user', JSON.stringify(userData));
        if (data.data.token) {
          localStorage.setItem('campus_token', data.data.token);
        }
        console.log('Login SUCCESS:', userData.name);
        return true;
      } else {
        console.error('Login FAILED:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Login ERROR:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('campus_user');
    localStorage.removeItem('campus_token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>);

};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};