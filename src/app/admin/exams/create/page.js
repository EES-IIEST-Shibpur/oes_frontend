'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminApi } from '@/hooks/useAdminApi';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import styles from '../examForm.module.css';

function CreateExamContent() {
  const router = useRouter();
  const { apiFetch } = useAdminApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    durationMinutes: '',
    startTime: '',
    endTime: '',
  });

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
    console.log('Start Time:', startTime);
    console.log('End Time:', endTime);

    if (endTime <= startTime) {
      setError('End time must be after start time');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        durationMinutes: parseInt(formData.durationMinutes),
        startTime: formData.startTime,
        endTime: formData.endTime,
      };

      const res = await apiFetch('/api/exam/create', {
        method: 'POST',
        body: payload,
      });

      if (res.ok) {
        router.push('/admin/exams');
      } else {
        setError(res.data?.message || 'Failed to create exam');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.examFormContainer}>
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h1>Create Exam</h1>
          <p>Create a new exam in the system</p>
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
              disabled={loading}
            >
              {loading && <span className={styles.loadingSpinner}></span>}
              {loading ? 'Creating...' : 'Create Exam'}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => router.push('/admin/exams')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CreateExamPage() {
  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <CreateExamContent />
      </AdminLayout>
    </ProtectedAdminRoute>
  );
}
