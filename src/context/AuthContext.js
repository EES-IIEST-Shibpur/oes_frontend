'use client';

import { createContext, useState, useCallback, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    try {
      const hasAuthFlag = typeof window !== 'undefined' &&
        window.localStorage &&
        window.localStorage.getItem('oes_auth') === '1';

      if (hasAuthFlag) {
        checkAuth();
      } else {
        setIsLoading(false);
      }
    } catch (e) {
      // If localStorage unavailable, fall back to no-check
      setIsLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      // Try to fetch current user from backend
      // This will use the httpOnly cookie automatically
      const result = await apiFetch('/api/profile/me', { 
        skipAuthRedirect: true 
      });
      
      if (result.ok && result.data) {
        setUser({ data: result.data });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      // Silently handle expected auth failures (401/403/404)
      const status = err.response?.status;
      if (status !== 401 && status !== 403 && status !== 404) {
        console.error('Failed to check auth:', err);
      }
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback((userData) => {
    // No need to store token - it's in httpOnly cookie
    setUser({ data: userData });
    setIsAuthenticated(true);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('oes_auth', '1');
      }
    } catch {}
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call backend logout to clear cookie
      await apiFetch('/api/auth/logout', { 
        method: 'POST',
        skipAuthRedirect: true 
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
    
    setUser(null);
    setIsAuthenticated(false);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('oes_auth');
      }
    } catch {}
  }, []);

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
