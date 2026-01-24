'use client';

import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

/**
 * ProtectedRoute Component
 * Wraps components that require authentication
 * NOTE: Security is enforced by middleware.js on the server-side.
 * This component only handles loading states and UI, not access control.
 */
export function ProtectedRoute({ children, fallback = null }) {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, middleware will redirect before this renders on SSR
  // This check is only for client-side edge cases
  if (!isAuthenticated) {
    return null;
  }

  return children;
}

/**
 * useProtectedRoute Hook
 * Use this hook in components to check authentication status
 * NOTE: Does not perform redirects - middleware handles that
 */
export function useProtectedRoute() {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);

  return {
    isAuthenticated,
    isLoading,
    user,
  };
}
