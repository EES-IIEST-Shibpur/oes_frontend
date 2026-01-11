'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';

/**
 * ProtectedRoute Component
 * Wraps components that require authentication
 * Redirects to login if user is not authenticated
 */
export function ProtectedRoute({ children, fallback = null }) {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}

/**
 * useProtectedRoute Hook
 * Use this hook in components to check authentication and redirect if needed
 */
export function useProtectedRoute() {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
    }
  }, [isAuthenticated, isLoading, router]);

  return {
    isAuthenticated,
    isLoading,
    user,
  };
}
