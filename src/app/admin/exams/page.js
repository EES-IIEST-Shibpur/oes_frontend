'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminApi } from '@/hooks/useAdminApi';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import styles from './exams.module.css';

function ExamsContent() {
  const router = useRouter();
  const { apiFetch } = useAdminApi();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await apiFetch('/api/exam/all');
      setExams(res.data?.exams || res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleDelete = async (examId) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) {
      return;
    }

    try {
      await apiFetch(`/api/exam/${examId}`, { method: 'DELETE' });
      setExams((prev) => prev.filter((e) => e.id !== examId));
      setSuccessMessage('Exam deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePublish = async (examId) => {
    if (!window.confirm('Are you sure you want to publish this exam? Published exams cannot be edited.')) {
      return;
    }

    try {
      setError('');
      await apiFetch(`/api/exam/${examId}/publish`, { method: 'POST' });
      setSuccessMessage('Exam published successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredExams = exams.filter((e) =>
    e.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className={styles.examsContainer}>
      <div className={styles.examsHeader}>
        <div className={styles.examsTitle}>
          <h1>Manage Exams</h1>
          <p>Create, edit, and publish exams</p>
        </div>
        <button
          className={styles.createButton}
          onClick={() => router.push('/admin/exams/create')}
        >
          + Create Exam
        </button>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}
      {successMessage && <div className={styles.successAlert}>{successMessage}</div>}

      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <label>Search Exams</label>
          <input
            type="text"
            placeholder="Search by exam title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
        </div>
      ) : exams.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>📝</div>
          <p className={styles.emptyStateText}>No exams yet</p>
          <button
            className={styles.emptyStateButton}
            onClick={() => router.push('/admin/exams/create')}
          >
            Create First Exam
          </button>
        </div>
      ) : filteredExams.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateText}>No exams match your search</p>
        </div>
      ) : (
        <div className={styles.examsGrid}>
          {filteredExams.map((exam) => (
            <div key={exam.id} className={styles.examCard}>
              <div className={styles.examCardHeader}>
                <h3 className={styles.examCardTitle}>{exam.title}</h3>
                <p className={styles.examCardDescription}>{exam.description}</p>
              </div>

              <div className={styles.examCardBody}>
                <div className={styles.examInfo}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Duration:</span>
                    <span className={styles.infoValue}>{exam.durationMinutes || 0} min</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Start:</span>
                    <span className={styles.infoValue}>{formatDateTime(exam.startTime)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>End:</span>
                    <span className={styles.infoValue}>{formatDateTime(exam.endTime)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Questions:</span>
                    <span className={styles.infoValue}>{exam.questions?.length || 0}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Status:</span>
                    <span
                      className={`${styles.statusBadge} ${
                        exam.state === 'PUBLISHED' ? styles.statusPublished : 
                        exam.state === 'CLOSED' ? styles.statusClosed : 
                        styles.statusDraft
                      }`}
                    >
                      {exam.state}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.examCardFooter}>
                <button
                  className={styles.viewButton}
                  onClick={() => router.push(`/admin/exams/${exam.id}`)}
                >
                  View Details
                </button>
                <button
                  className={styles.editButton}
                  onClick={() => router.push(`/admin/exams/${exam.id}/edit`)}
                  disabled={exam.state !== 'DRAFT'}
                  title={exam.state !== 'DRAFT' ? 'Cannot edit published exams' : 'Edit exam'}
                >
                  Edit
                </button>
                {exam.state === 'DRAFT' && (
                  <button
                    className={styles.publishButton}
                    onClick={() => handlePublish(exam.id)}
                  >
                    Publish
                  </button>
                )}
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(exam.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExamsPage() {
  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <ExamsContent />
      </AdminLayout>
    </ProtectedAdminRoute>
  );
}
