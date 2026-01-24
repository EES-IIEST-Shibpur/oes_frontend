'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import styles from '../../admin/login.module.css';
import '../../admin/admin.global.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAdminAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.email.trim()) {
      setLocalError('Email is required');
      return;
    }

    if (!formData.password.trim()) {
      setLocalError('Password is required');
      return;
    }

    const result = await login(formData.email, formData.password);
    if (result.success) {
      // Get redirect parameter if present
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get('redirect') || '/admin/dashboard';
      
      // Force a full page navigation to ensure middleware sees the cookie
      window.location.href = redirectTo;
    } else {
      setLocalError(result.error);
    }
  };

  const displayError = localError || error;

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1>Admin Login</h1>
          <p>Online Examination System</p>
        </div>

        {displayError && (
          <div className={styles.errorAlert}>{displayError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading && <span className={styles.loadingSpinner}></span>}
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
