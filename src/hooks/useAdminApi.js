'use client';

import { useCallback } from 'react';
import { useAdminAuth } from './useAdminAuth';

export function useAdminApi() {
  const { admin, logout } = useAdminAuth();

  const apiFetch = useCallback(
    async (path, options = {}) => {
      const { method = 'GET', body, headers = {} } = options;

      if (!admin?.token) {
        throw new Error('Not authenticated');
      }

      const url = `${
        process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
      }${path.startsWith('/') ? path : `/${path}`}`;

      const opts = {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${admin.token}`,
          ...headers,
        },
      };

      if (body !== undefined) {
        opts.body = JSON.stringify(body);
      }

      const res = await fetch(url, opts);

      if (res.status === 401 || res.status === 403) {
        logout();
        throw new Error('Unauthorized');
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `API error: ${res.status}`);
      }

      const text = await res.text();
      let data = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }

      return {
        status: res.status,
        data,
        ok: res.ok,
      };
    },
    [admin, logout]
  );

  return { apiFetch, admin };
}
