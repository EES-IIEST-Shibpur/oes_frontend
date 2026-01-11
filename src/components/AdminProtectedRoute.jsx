'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminAuthContext } from '@/context/AdminAuthContext';

/**
 * AdminProtectedRoute Component
 * Wraps components that require admin authentication
 * Redirects to admin login if user is not authenticated as admin
 */
export function AdminProtectedRoute({ children, fallback = null }) {
  const { isAuthenticated, isLoading } = useContext(AdminAuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login?redirect=' + encodeURIComponent(window.location.pathname));
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
 * useAdminProtectedRoute Hook
 * Use this hook in components to check admin authentication and redirect if needed
 */
export function useAdminProtectedRoute() {
  const { isAuthenticated, isLoading, admin } = useContext(AdminAuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login?redirect=' + encodeURIComponent(window.location.pathname));
    }
  }, [isAuthenticated, isLoading, router]);

  return {
    isAuthenticated,
    isLoading,
    admin,
  };
}
