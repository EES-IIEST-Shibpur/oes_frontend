'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminApi } from '@/hooks/useAdminApi';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import styles from '../form.module.css';

const QUESTION_TYPES = ['SINGLE_CORRECT', 'MULTIPLE_CORRECT', 'NUMERICAL'];
const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];

function EditQuestionContent() {
  const router = useRouter();
  const params = useParams();
  const { apiFetch } = useAdminApi();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    statement: '',
    questionType: '',
    domain: '',
    difficulty: '',
    options: [],
    numericalAnswer: '',
  });

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await apiFetch(`/api/question/${params.questionId}`);
        const question = res.data?.data || res.data;
        setFormData({
          statement: question.statement || '',
          questionType: question.questionType || '',
          domain: question.domain || '',
          difficulty: question.difficulty || '',
          options: question.options || [],
          numericalAnswer: question.numericalAnswer || '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.questionId) {
      fetchQuestion();
    }
  }, [params.questionId, apiFetch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleQuestionTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      questionType: type,
      ...(type === 'NUMERICAL' && { options: [] }),
    }));
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { text: '', isCorrect: false }],
    }));
  };

  const removeOption = (index) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    if (!formData.statement.trim()) {
      setError('Question statement is required');
      return false;
    }

    if (!formData.domain.trim()) {
      setError('Domain is required');
      return false;
    }

    if (formData.questionType === 'MULTIPLE_CORRECT') {
      if (formData.options.length < 2) {
        setError('At least 2 options are required for MULTIPLE_CORRECT questions');
        return false;
      }

      if (formData.options.some((opt) => !opt.text.trim())) {
        setError('All options must have text');
        return false;
      }

      if (!formData.options.some((opt) => opt.isCorrect)) {
        setError('At least one option must be marked as correct');
        return false;
      }
    } else if (formData.questionType === 'NUMERICAL') {
      if (!formData.numericalAnswer && formData.numericalAnswer !== 0) {
        setError('Numerical answer is required');
        return false;
      }
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
        statement: formData.statement,
        questionType: formData.questionType,
        domain: formData.domain,
        difficulty: formData.difficulty,
      };

      if (formData.questionType === 'MULTIPLE_CORRECT') {
        payload.options = formData.options;
      } else if (formData.questionType === 'NUMERICAL') {
        payload.numericalAnswer = parseFloat(formData.numericalAnswer);
      }

      const res = await apiFetch(`/api/question/${params.questionId}`, {
        method: 'PUT',
        body: payload,
      });

      if (res.ok) {
        router.push('/admin/questions');
      } else {
        setError(res.data?.message || 'Failed to update question');
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
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading question...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h1>Edit Question</h1>
          <p>Update the question details</p>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Question Type</h2>
            <div className={styles.typeToggle}>
              {QUESTION_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`${styles.typeOption} ${formData.questionType === type ? styles.active : ''
                    }`}
                  onClick={() => handleQuestionTypeChange(type)}
                >
                  {type === 'MULTIPLE_CORRECT'
                    ? 'Multiple Correct'
                    : 'Numerical'}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Basic Information</h2>

            <div className={styles.formGroup}>
              <label htmlFor="statement">Question Statement *</label>
              <textarea
                id="statement"
                name="statement"
                placeholder="Enter the question..."
                value={formData.statement}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="domain">Domain *</label>
                <input
                  id="domain"
                  type="text"
                  name="domain"
                  placeholder="e.g., Web Development"
                  value={formData.domain}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="difficulty">Difficulty *</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {formData.questionType === 'MULTIPLE_CORRECT' && (
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Options</h2>
              <div className={styles.optionsContainer}>
                {formData.options.map((option, index) => (
                  <div key={index} className={styles.optionItem}>
                    <div className={styles.optionText}>
                      <input
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(index, 'text', e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.optionCheckbox}>
                      <input
                        type="checkbox"
                        id={`correct-${index}`}
                        checked={option.isCorrect}
                        onChange={(e) =>
                          handleOptionChange(index, 'isCorrect', e.target.checked)
                        }
                      />
                      <label htmlFor={`correct-${index}`}>Correct</label>
                    </div>
                    <div className={styles.optionButtons}>
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => removeOption(index)}
                        disabled={formData.options.length <= 2}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className={styles.addOptionButton}
                onClick={addOption}
              >
                + Add Option
              </button>
            </div>
          )}

          {formData.questionType === 'NUMERICAL' && (
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Numerical Answer</h2>
              <div className={styles.formGroup}>
                <label htmlFor="numericalAnswer">Answer *</label>
                <input
                  id="numericalAnswer"
                  type="number"
                  step="0.01"
                  placeholder="Enter the numerical answer"
                  value={formData.numericalAnswer}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      numericalAnswer: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
          )}

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={submitting}
            >
              {submitting && <span className={styles.loadingSpinner}></span>}
              {submitting ? 'Updating...' : 'Update Question'}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => router.push('/admin/questions')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditQuestionPage() {
  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <EditQuestionContent />
      </AdminLayout>
    </ProtectedAdminRoute>
  );
}
