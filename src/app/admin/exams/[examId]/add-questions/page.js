'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminApi } from '@/hooks/useAdminApi';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import styles from '../addQuestions.module.css';

function AddQuestionsContent() {
  const router = useRouter();
  const params = useParams();
  const { apiFetch } = useAdminApi();
  const [questions, setQuestions] = useState([]);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch exam details first to check status
        const examRes = await apiFetch(`/api/exam/${params.examId}`);
        const examData = examRes.data?.exam || examRes.data;
        setExam(examData);
        
        // If exam is not in DRAFT status, redirect
        if (examData.state !== 'DRAFT') {
          setError('Cannot add questions to a non-draft exam');
          setTimeout(() => {
            router.push(`/admin/exams/${params.examId}`);
          }, 2000);
          return;
        }
        
        // Fetch questions
        const questionsRes = await apiFetch('/api/question/all');
        setQuestions(questionsRes.data?.data || questionsRes.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.examId) {
      fetchData();
    }
  }, [params.examId, apiFetch, router]);

  const handleToggleQuestion = (questionId) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleAddQuestions = async () => {
    if (selectedQuestions.length === 0) {
      setError('Please select at least one question');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        addQuestionIds: selectedQuestions.map((id) => ({ questionId: id })),
      };

      const res = await apiFetch(`/api/exam/${params.examId}/questions`, {
        method: 'POST',
        body: payload,
      });

      if (res.ok) {
        setSuccessMessage('Questions added successfully');
        setTimeout(() => {
          router.push(`/admin/exams/${params.examId}`);
        }, 1500);
      } else {
        setError(res.data?.message || 'Failed to add questions');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesDomain = !filterDomain || q.domain?.toLowerCase().includes(filterDomain.toLowerCase());
    const matchesSearch = !searchTerm || q.statement?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDomain && matchesSearch;
  });

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

  return (
    <div className={styles.addQuestionsContainer}>
      {error && <div className={styles.errorAlert}>{error}</div>}
      {successMessage && <div className={styles.successAlert}>{successMessage}</div>}

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h1>Add Questions to Exam</h1>
          <p>Select questions from the question bank to add to this exam</p>
        </div>

        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <label>Search Questions</label>
            <input
              type="text"
              placeholder="Search by statement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            <label>Filter by Domain</label>
            <input
              type="text"
              placeholder="e.g., Web Development"
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
            />
          </div>
        </div>

        {selectedQuestions.length > 0 && (
          <div className={styles.selectedCount}>
            {selectedQuestions.length} question{selectedQuestions.length !== 1 ? 's' : ''} selected
          </div>
        )}

        {questions.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>❓</div>
            <p className={styles.emptyStateText}>No questions available</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>No questions match your filter</p>
          </div>
        ) : (
          <div className={styles.questionsGrid}>
            {filteredQuestions.map((question) => (
              <div
                key={question.id}
                className={styles.questionCard}
                style={{
                  backgroundColor: selectedQuestions.includes(question.id) ? '#dbeafe' : '#f9fafb',
                }}
              >
                <div className={styles.questionInfo}>
                  <div className={styles.questionStatement}>
                    {question.statement?.substring(0, 60)}...
                  </div>
                  <div className={styles.questionMeta}>
                    <span className={styles.metaBadge}>
                      {question.questionType || 'MULTIPLE_CORRECT'}
                    </span>
                    <span className={styles.metaBadge}>{question.domain || 'N/A'}</span>
                    <span className={`${styles.metaBadge} ${styles.difficulty} ${getDifficultyClass(question.difficulty)}`}>
                      {question.difficulty || 'N/A'}
                    </span>
                  </div>
                </div>
                <div className={styles.questionActions}>
                  <button
                    className={styles.addButton}
                    onClick={() => handleToggleQuestion(question.id)}
                  >
                    {selectedQuestions.includes(question.id) ? '✓ Selected' : '+ Select'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.actionButtons}>
          <button
            className={styles.submitButton}
            onClick={handleAddQuestions}
            disabled={submitting || selectedQuestions.length === 0}
          >
            {submitting ? 'Adding...' : `Add ${selectedQuestions.length} Question${selectedQuestions.length !== 1 ? 's' : ''}`}
          </button>
          <button
            className={styles.cancelButton}
            onClick={() => router.push(`/admin/exams/${params.examId}`)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AddQuestionsPage() {
  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <AddQuestionsContent />
      </AdminLayout>
    </ProtectedAdminRoute>
  );
}
