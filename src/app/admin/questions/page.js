'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminApi } from '@/hooks/useAdminApi';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import styles from './questions.module.css';

function QuestionsContent() {
  const router = useRouter();
  const { apiFetch } = useAdminApi();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filterDomain, setFilterDomain] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await apiFetch('/api/question/all');
      setQuestions(res.data?.data || res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      await apiFetch(`/api/question/${questionId}`, { method: 'DELETE' });
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      setSuccessMessage('Question deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesDomain = !filterDomain || q.domain?.toLowerCase().includes(filterDomain.toLowerCase());
    const matchesSearch = !searchTerm || q.statement?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const paginatedQuestions = filteredQuestions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  const getDifficultyClass = (difficulty) => {
    const lower = difficulty?.toLowerCase() || '';
    if (lower === 'easy') return styles.easy;
    if (lower === 'medium') return styles.medium;
    if (lower === 'hard') return styles.hard;
    return '';
  };

  return (
    <div className={styles.questionsContainer}>
      <div className={styles.questionsHeader}>
        <div className={styles.questionsTitle}>
          <h1>Manage Questions</h1>
          <p>Create, edit, and delete exam questions</p>
        </div>
        <button
          className={styles.createButton}
          onClick={() => router.push('/admin/questions/create')}
        >
          + Create Question
        </button>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}
      {successMessage && <div className={styles.successAlert}>{successMessage}</div>}

      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search by question statement..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className={styles.filterGrid}>
          <div className={styles.filterGroup}>
            <label>Filter by Domain</label>
            <input
              type="text"
              placeholder="e.g., Web Development, Mathematics"
              value={filterDomain}
              onChange={(e) => {
                setFilterDomain(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
        </div>
      ) : questions.length === 0 ? (
        <div className={styles.emptyState}>
          {/* <div className={styles.emptyStateIcon}>❓</div> */}
          <p className={styles.emptyStateText}>No questions yet</p>
          <button
            className={styles.emptyStateButton}
            onClick={() => router.push('/admin/questions/create')}
          >
            Create First Question
          </button>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateText}>No questions match your filter</p>
        </div>
      ) : (
        <>
          <div className={styles.questionsTable}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.tableHeader}>Question Statement</th>
                    <th className={styles.tableHeader}>Type</th>
                    <th className={styles.tableHeader}>Domain</th>
                    <th className={styles.tableHeader}>Difficulty</th>
                    <th className={styles.tableHeader}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedQuestions.map((question) => (
                    <tr key={question.id} className={styles.tableRow}>
                      <td className={styles.tableCell}>{question.statement?.substring(0, 50)}...</td>
                      <td className={styles.tableCell}>
                        <span className={styles.questionType}>
                          {question.questionType || 'MULTIPLE_CORRECT'}
                        </span>
                      </td>
                      <td className={styles.tableCell}>{question.domain || 'N/A'}</td>
                      <td className={styles.tableCell}>
                        <span className={`${styles.difficulty} ${getDifficultyClass(question.difficulty)}`}>
                          {question.difficulty || 'N/A'}
                        </span>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.editButton}
                            onClick={() => router.push(`/admin/questions/${question.id}`)}
                          >
                            Edit
                          </button>
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDelete(question.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageButton}
                onClick={() => setPage(1)}
                disabled={page === 1}
              >
                ← First
              </button>
              <button
                className={styles.pageButton}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, page - 2) + i;
                if (pageNum > totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    className={`${styles.pageButton} ${page === pageNum ? styles.active : ''}`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                className={styles.pageButton}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next →
              </button>
              <button
                className={styles.pageButton}
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
              >
                Last →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function QuestionsPage() {
  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <QuestionsContent />
      </AdminLayout>
    </ProtectedAdminRoute>
  );
}
