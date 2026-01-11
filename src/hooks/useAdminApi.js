'use client';

import { useCallback } from 'react';
import { useAdminAuth } from './useAdminAuth';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Create axios instance for admin API
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function useAdminApi() {
  const { admin, logout } = useAdminAuth();

  const apiFetch = useCallback(
    async (path, options = {}) => {
      const { method = 'GET', body, headers = {} } = options;

      try {
        const response = await axiosInstance({
          url: path,
          method,
          data: body,
          headers,
        });

        return {
          status: response.status,
          data: response.data,
          ok: response.status >= 200 && response.status < 300,
        };
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;

          if (status === 401 || status === 403) {
            logout();
            throw new Error('Unauthorized');
          }

          throw new Error(data.message || `API error: ${status}`);
        }
        
        throw error;
      }
    },
    [logout]
  );

  return { apiFetch, admin };
}
