'use client';

import { createContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Create axios instance for admin operations
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if admin is authenticated on mount
  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const response = await axiosInstance.get('/api/profile/me');
      setAdmin({ data: response.data });
    } catch (err) {
      // Silently handle expected auth errors (401/403/404)
      const status = err.response?.status;
      if (status !== 401 && status !== 403 && status !== 404) {
        console.error('Failed to check admin auth:', err);
      }
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/api/auth/login', {
        email,
        password,
      });

      const adminInfo = response.data.admin || response.data.user || { email };

      setAdmin({
        data: adminInfo,
      });

      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    }
    
    setAdmin(null);
    setError(null);
  }, []);

  const value = {
    admin,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!admin?.data,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}
