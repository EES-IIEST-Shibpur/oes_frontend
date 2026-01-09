'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminApi } from '@/hooks/useAdminApi';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import styles from './dashboard.module.css';

function DashboardContent() {
  const router = useRouter();
  const { apiFetch } = useAdminApi();
  const [stats, setStats] = useState({
    questions: 0,
    exams: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats((prev) => ({ ...prev, loading: true, error: null }));

        const questionsRes = await apiFetch('/api/question/all');
        const examsRes = await apiFetch('/api/exam/all');

        setStats({
          questions: questionsRes.data?.data?.length || questionsRes.data?.length || 0,
          exams: examsRes.data?.data?.length || examsRes.data?.length || 0,
          loading: false,
          error: null,
        });
      } catch (err) {
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: err.message,
        }));
      }
    };

    fetchStats();
  }, [apiFetch]);

  return (
    <div className={styles.dashboardContainer}>
      <div>
        <h1>Welcome to Admin Dashboard</h1>
        <p>Manage your online examination system</p>
      </div>

      {stats.error && (
        <div className={styles.errorMessage}>{stats.error}</div>
      )}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          {/* <div className={styles.statCardIcon}>❓</div> */}
          <div className={styles.statCardLabel}>Total Questions</div>
          {stats.loading ? (
            <div className={styles.loadingSpinner}></div>
          ) : (
            <p className={styles.statCardValue}>{stats.questions}</p>
          )}
        </div>

        <div className={styles.statCard}>
          {/* <div className={styles.statCardIcon}>📝</div> */}
          <div className={styles.statCardLabel}>Total Exams</div>
          {stats.loading ? (
            <div className={styles.loadingSpinner}></div>
          ) : (
            <p className={styles.statCardValue}>{stats.exams}</p>
          )}
        </div>

        <div className={styles.statCard}>
          {/* <div className={styles.statCardIcon}>⚙️</div> */}
          <div className={styles.statCardLabel}>System Status</div>
          <p className={styles.statCardValue} style={{ color: '#16a34a', fontSize: '1.5rem' }}>
            Active
          </p>
        </div>
      </div>

      <div className={styles.quickActionsSection}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionButtons}>
          <button
            className={styles.actionButton}
            onClick={() => router.push('/admin/questions/create')}
          >
            {/* <span className={styles.actionButtonIcon}>➕</span> */}
            <span>Create Question</span>
          </button>
          <button
            className={styles.actionButton}
            onClick={() => router.push('/admin/exams/create')}
          >
            {/* <span className={styles.actionButtonIcon}>📝</span> */}
            <span>Create Exam</span>
          </button>
          <button
            className={styles.actionButton}
            onClick={() => router.push('/admin/questions')}
          >
            {/* <span className={styles.actionButtonIcon}>❓</span> */}
            <span>View Questions</span>
          </button>
          <button
            className={styles.actionButton}
            onClick={() => router.push('/admin/exams')}
          >
            {/* <span className={styles.actionButtonIcon}>📋</span> */}
            <span>View Exams</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <DashboardContent />
      </AdminLayout>
    </ProtectedAdminRoute>
  );
}
