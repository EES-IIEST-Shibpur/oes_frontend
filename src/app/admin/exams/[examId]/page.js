'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminApi } from '@/hooks/useAdminApi';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import styles from './examDetails.module.css';

function ExamDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const { apiFetch } = useAdminApi();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await apiFetch(`/api/exam/${params.examId}`);
        const examData = res.data?.exam || res.data;
        setExam(examData);
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

  const handleRemoveQuestion = async (questionId) => {
    if (!window.confirm('Remove this question from the exam?')) {
      return;
    }

    try {
      setError('');
      await apiFetch(`/api/exam/${params.examId}/questions/${questionId}`, {
        method: 'DELETE',
      });
      setExam((prev) => ({
        ...prev,
        questions: prev.questions.filter((q) => q.id !== questionId),
      }));
      setSuccessMessage('Question removed successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePublish = async () => {
    if (!window.confirm('Are you sure you want to publish this exam? Published exams cannot be edited.')) {
      return;
    }

    try {
      setError('');
      await apiFetch(`/api/exam/${params.examId}/publish`, { method: 'POST' });
      setExam((prev) => ({ ...prev, state: 'PUBLISHED' }));
      setSuccessMessage('Exam published successfully');
      setTimeout(() => {
        setSuccessMessage('');
        router.push('/admin/exams');
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const getDifficultyClass = (difficulty) => {
    const lower = difficulty?.toLowerCase() || '';
    if (lower === 'easy') return styles.easy;
    if (lower === 'medium') return styles.medium;
    if (lower === 'hard') return styles.hard;
    return '';
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className={styles.examDetailsContainer}>
        <div className={styles.errorAlert}>Exam not found</div>
        <button
          className={styles.actionButton}
          onClick={() => router.push('/admin/exams')}
        >
          Back to Exams
        </button>
      </div>
    );
  }

  return (
    <div className={styles.examDetailsContainer}>
      {error && <div className={styles.errorAlert}>{error}</div>}
      {successMessage && <div className={styles.successAlert}>{successMessage}</div>}

      <div className={styles.detailsCard}>
        <div className={styles.cardHeader}>
          <h1>{exam.title}</h1>
          <p>{exam.description}</p>
        </div>

        <div className={styles.examInfo}>
          <div className={styles.infoGroup}>
            <span className={styles.infoLabel}>Duration</span>
            <span className={styles.infoValue}>{exam.durationMinutes || 0} minutes</span>
          </div>
          <div className={styles.infoGroup}>
            <span className={styles.infoLabel}>Start Time</span>
            <span className={styles.infoValue}>{formatDateTime(exam.startTime)}</span>
          </div>
          <div className={styles.infoGroup}>
            <span className={styles.infoLabel}>End Time</span>
            <span className={styles.infoValue}>{formatDateTime(exam.endTime)}</span>
          </div>
          <div className={styles.infoGroup}>
            <span className={styles.infoLabel}>Status</span>
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

        <div className={styles.questionsSection}>
          <h2 className={styles.sectionTitle}>
            Questions ({exam.questions?.length || 0})
          </h2>

          {exam.questions && exam.questions.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className={styles.questionsTable}>
                <thead>
                  <tr>
                    <th>Statement</th>
                    <th>Type</th>
                    <th>Domain</th>
                    <th>Difficulty</th>
                    {exam.state === 'DRAFT' && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {exam.questions.map((question) => (
                    <tr key={question.id}>
                      <td>{question.statement?.substring(0, 40)}...</td>
                      <td>
                        <span className={styles.questionType}>
                          {question.questionType || 'MULTIPLE_CORRECT'}
                        </span>
                      </td>
                      <td>{question.domain || 'N/A'}</td>
                      <td>
                        <span className={`${styles.difficulty} ${getDifficultyClass(question.difficulty)}`}>
                          {question.difficulty || 'N/A'}
                        </span>
                      </td>
                      {exam.state === 'DRAFT' && (
                        <td>
                          <button
                            className={styles.removeQuestionButton}
                            onClick={() => handleRemoveQuestion(question.id)}
                          >
                            Remove
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.emptyQuestions}>
              <p>No questions added to this exam yet</p>
            </div>
          )}
        </div>

        <div className={styles.actionButtons}>
          <button
            className={styles.addQuestionsButton}
            onClick={() => router.push(`/admin/exams/${params.examId}/add-questions`)}
            disabled={exam.state !== 'DRAFT'}
            title={exam.state !== 'DRAFT' ? 'Cannot add questions to published exams' : 'Add questions'}
          >
            + Add Questions
          </button>
          <button
            className={styles.editButton}
            onClick={() => router.push(`/admin/exams/${params.examId}/edit`)}
            disabled={exam.state !== 'DRAFT'}
            title={exam.state !== 'DRAFT' ? 'Cannot edit published exams' : 'Edit exam'}
          >
            Edit Exam
          </button>
          {exam.state === 'DRAFT' && (
            <button
              className={styles.publishButton}
              onClick={handlePublish}
            >
              Publish Exam
            </button>
          )}
          <button
            className={styles.backButton}
            onClick={() => router.push('/admin/exams')}
          >
            Back to Exams
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExamDetailsPage() {
  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <ExamDetailsContent />
      </AdminLayout>
    </ProtectedAdminRoute>
  );
}
