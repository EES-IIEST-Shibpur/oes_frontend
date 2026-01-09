'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminApi } from '@/hooks/useAdminApi';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import styles from '../form.module.css';

const QUESTION_TYPES = ['SINGLE_CORRECT', 'MULTIPLE_CORRECT', 'NUMERICAL'];
const DOMAINS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'History', 'Geography', 'Literature'];
const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];

function QuestionFormContent() {
  const router = useRouter();
  const { apiFetch } = useAdminApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    statement: '',
    questionType: '',
    domain: '',
    difficulty: 'EASY',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ],
    numericalAnswer: '',
  });

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

    if (formData.questionType === 'SINGLE_CORRECT') {
      if (formData.options.length < 2) {
        setError('At least 2 options are required for SINGLE_CORRECT questions');
        return false;
      }

      if (formData.options.some((opt) => !opt.text.trim())) {
        setError('All options must have text');
        return false;
      }

      const correctCount = formData.options.filter((opt) => opt.isCorrect).length;
      if (correctCount !== 1) {
        setError('Exactly one option must be marked as correct for SINGLE_CORRECT questions');
        return false;
      }
    } else if (formData.questionType === 'MULTIPLE_CORRECT') {
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

    setLoading(true);
    setError('');

    try {
      const payload = {
        statement: formData.statement,
        questionType: formData.questionType,
        domain: formData.domain,
        difficulty: formData.difficulty,
      };

      if (formData.questionType === 'SINGLE_CORRECT' || formData.questionType === 'MULTIPLE_CORRECT') {
        payload.options = formData.options;
      } else if (formData.questionType === 'NUMERICAL') {
        payload.numericalAnswer = parseFloat(formData.numericalAnswer);
      }

      const res = await apiFetch('/api/question/create', {
        method: 'POST',
        body: payload,
      });

      if (res.ok) {
        router.push('/admin/questions');
      } else {
        setError(res.data?.message || 'Failed to create question');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h1>Create Question</h1>
          <p>Add a new question to the question bank</p>
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
                  {type === 'SINGLE_CORRECT'
                    ? 'Single Correct'
                    : type === 'MULTIPLE_CORRECT'
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
                <select
                  id="domain"
                  name="domain"
                  value={formData.domain}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a domain</option>
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                  <option value="">-- Type Custom --</option>
                </select>
                {formData.domain && !DOMAINS.includes(formData.domain) && (
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        domain: e.target.value,
                      }))
                    }
                    placeholder="Custom domain"
                    style={{ marginTop: '0.5rem' }}
                  />
                )}
                {!formData.domain && (
                  <input
                    type="text"
                    placeholder="Or type custom domain"
                    onChange={(e) => {
                      if (e.target.value) {
                        setFormData((prev) => ({
                          ...prev,
                          domain: e.target.value,
                        }));
                      }
                    }}
                    style={{ marginTop: '0.5rem' }}
                  />
                )}
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

          {formData.questionType === 'SINGLE_CORRECT' && (
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
                        type="radio"
                        id={`correct-${index}`}
                        name="correctOption"
                        checked={option.isCorrect}
                        onChange={() => {
                          const newOptions = formData.options.map((opt, i) => ({
                            ...opt,
                            isCorrect: i === index,
                          }));
                          setFormData((prev) => ({ ...prev, options: newOptions }));
                        }}
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
              disabled={loading}
            >
              {loading && <span className={styles.loadingSpinner}></span>}
              {loading ? 'Creating...' : 'Create Question'}
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

export default function CreateQuestionPage() {
  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <QuestionFormContent />
      </AdminLayout>
    </ProtectedAdminRoute>
  );
}
