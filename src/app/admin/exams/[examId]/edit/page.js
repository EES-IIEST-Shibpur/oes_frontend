'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminApi } from '@/hooks/useAdminApi';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import styles from '../examDetails.module.css';

function EditExamContent() {
  const router = useRouter();
  const params = useParams();
  const { apiFetch } = useAdminApi();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    durationMinutes: '',
    startTime: '',
    endTime: '',
  });


  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await apiFetch(`/api/exam/${params.examId}`);
        const examData = res.data?.exam || res.data;
        console.log('Fetched Exam for Edit:', res.data.exam);
        setFormData({
          title: examData.title || '',
          description: examData.description || '',
          durationMinutes: examData.durationMinutes || '',
          startTime: examData.startTime || '',
          endTime: examData.endTime || '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.examId) {
      fetchExam();
    }
  }, [params.examId, apiFetch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Exam title is required');
      return false;
    }

    if (!formData.description.trim()) {
      setError('Exam description is required');
      return false;
    }

    if (!formData.durationMinutes || isNaN(formData.durationMinutes)) {
      setError('Valid duration in minutes is required');
      return false;
    }

    if (!formData.startTime) {
      setError('Start time is required');
      return false;
    }

    if (!formData.endTime) {
      setError('End time is required');
      return false;
    }

    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);

    if (endTime <= startTime) {
      setError('End time must be after start time');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        durationMinutes: parseInt(formData.durationMinutes),
        startTime: formData.startTime,
        endTime: formData.endTime,
      };

      const res = await apiFetch(`/api/exam/${params.examId}/update`, {
        method: 'PUT',
        body: payload,
      });

      if (res.ok) {
        router.push(`/admin/exams/${params.examId}`);
      } else {
        setError(res.data?.message || 'Failed to update exam');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #2563eb',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}></div>
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading exam...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className={styles.examFormContainer}>
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h1>Edit Exam</h1>
          <p>Update exam details. Note: You cannot edit published exams.</p>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Basic Information</h2>

            <div className={styles.formGroup}>
              <label htmlFor="title">
                Exam Title <span className={styles.requiredField}>*</span>
              </label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="e.g., PwC Intern Online Assessment"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">
                Description <span className={styles.requiredField}>*</span>
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter exam description..."
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="durationMinutes">
                Duration (minutes) <span className={styles.requiredField}>*</span>
              </label>
              <input
                id="durationMinutes"
                type="number"
                name="durationMinutes"
                placeholder="e.g., 90"
                min="1"
                value={formData.durationMinutes}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Schedule</h2>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="startTime">
                  Start Time <span className={styles.requiredField}>*</span>
                </label>
                <input
                  id="startTime"
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="endTime">
                  End Time <span className={styles.requiredField}>*</span>
                </label>
                <input
                  id="endTime"
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={submitting}
            >
              {submitting && <span className={styles.loadingSpinner}></span>}
              {submitting ? 'Updating...' : 'Update Exam'}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => router.push(`/admin/exams/${params.examId}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditExamPage() {
  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <EditExamContent />
      </AdminLayout>
    </ProtectedAdminRoute>
  );
}
