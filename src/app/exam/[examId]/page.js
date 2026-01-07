"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "../../../lib/api";
import styles from "./exam.module.css";

export default function ExamPage() {
  const { examId } = useParams();
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [answersMap, setAnswersMap] = useState({});
  const [loading, setLoading] = useState(true);

  const timerRef = useRef(null);

  /* Load exam */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(`/api/exam-attempt/${examId}/attempt`);
        if (!res?.data?.success) return;

        const { exam, remainingSeconds } = res.data;
        setQuestions(exam.questions);
        setRemainingSeconds(remainingSeconds);

        const map = {};
        exam.questions.forEach((q) => {
          if (q.studentAnswer) {
            map[q.id] = {
              selectedOptionIds: q.studentAnswer.selectedOptionIds || [],
              numericalAnswer: q.studentAnswer.numericalAnswer ?? null,
            };
          }
        });

        setAnswersMap(map);
      } catch (err) {
        console.error("Failed to load exam", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [examId]);

  /* Timer */
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (remainingSeconds <= 0) return;

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          autoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [remainingSeconds]);

  const currentQuestion = questions[currentIndex];

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /* Handlers */
  const handleOptionChange = (optionId) => {
    const isMultiple = currentQuestion.questionType === "MULTIPLE_CORRECT";

    setAnswersMap((prev) => {
      const prevAns = prev[currentQuestion.id] || { selectedOptionIds: [] };

      const updated = isMultiple
        ? prevAns.selectedOptionIds.includes(optionId)
          ? prevAns.selectedOptionIds.filter((id) => id !== optionId)
          : [...prevAns.selectedOptionIds, optionId]
        : [optionId];

      return {
        ...prev,
        [currentQuestion.id]: { selectedOptionIds: updated },
      };
    });
  };

  const handleNumericalChange = (value) => {
    setAnswersMap((prev) => ({
      ...prev,
      [currentQuestion.id]: { numericalAnswer: value },
    }));
  };

  const clearAnswer = () => {
    setAnswersMap((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
  };

  const saveAndNext = async () => {
    const q = currentQuestion;
    if (!q) return;

    const ans = answersMap[q.id] || {};
    const payload = { questionId: q.id };

    if (q.questionType === "NUMERICAL") {
      payload.numericalAnswer = ans.numericalAnswer ?? null;
    } else {
      payload.selectedOptionIds = ans.selectedOptionIds || [];
    }

    try {
      const res = await apiFetch(`/api/exam-attempt/${examId}/save`, {
        method: "POST",
        body: payload,
      });

      if (res?.data?.success) {
        setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
      }
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const submitExam = async () => {
    if (!window.confirm("Submit exam? You cannot change answers after submission.")) return;

    try {
      const res = await apiFetch(`/api/exam-attempt/${examId}/submit`, { method: "POST" });
      if (res?.data?.success) router.push("/dashboard");
    } catch (err) {
      console.error("Submit failed", err);
    }
  };

  const autoSubmit = async () => {
    try {
      await apiFetch(`/api/exam-attempt/${examId}/submit`, { method: "POST" });
    } finally {
      router.push("/dashboard");
    }
  };

  const isAnswered = (qId) => {
    const ans = answersMap[qId];
    if (!ans) return false;
    return (ans.selectedOptionIds?.length > 0) || (ans.numericalAnswer !== undefined && ans.numericalAnswer !== null && ans.numericalAnswer !== "");
  };

  if (loading) return <p className={styles.loading}>Loading exam...</p>;
  if (!currentQuestion) return <p className={styles.loading}>No questions</p>;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Online Examination</h1>
        <div className={`${styles.timer} ${remainingSeconds < 300 ? styles.timerWarning : ''}`}>
          {formatTime(remainingSeconds)}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.layout}>
        {/* Question Card */}
        <div className={styles.questionCard}>
          {/* Question Number */}
          <div className={styles.questionNumber}>
            Question {currentIndex + 1} of {questions.length}
          </div>

          {/* Question Statement */}
          <h2 className={styles.questionStatement}>
            {currentQuestion.statement}
          </h2>

          {/* Options */}
          {(currentQuestion.questionType === "SINGLE_CORRECT" ||
            currentQuestion.questionType === "MULTIPLE_CORRECT") && (
            <div className={styles.optionsContainer}>
              {currentQuestion.options.map((opt) => {
                const checked = answersMap[currentQuestion.id]?.selectedOptionIds?.includes(opt.id) || false;
                
                return (
                  <label
                    key={opt.id}
                    className={`${styles.option} ${checked ? styles.optionSelected : ''}`}
                  >
                    <input
                      type={currentQuestion.questionType === "MULTIPLE_CORRECT" ? "checkbox" : "radio"}
                      checked={checked}
                      onChange={() => handleOptionChange(opt.id)}
                      className={styles.optionInput}
                    />
                    <span className={styles.optionText}>
                      {opt.text}
                    </span>
                  </label>
                );
              })}
            </div>
          )}

          {/* Numerical Input */}
          {currentQuestion.questionType === "NUMERICAL" && (
            <input
              type="number"
              value={answersMap[currentQuestion.id]?.numericalAnswer ?? ""}
              onChange={(e) => handleNumericalChange(e.target.value)}
              placeholder="Enter your answer"
              className={styles.numericalInput}
            />
          )}

          {/* Actions */}
          <div className={styles.actions}>
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
              className={styles.btnSecondary}
            >
              Previous
            </button>

            <button
              onClick={clearAnswer}
              className={styles.btnSecondary}
            >
              Clear
            </button>

            <button
              onClick={saveAndNext}
              className={styles.btnPrimary}
            >
              {currentIndex === questions.length - 1 ? "Review" : "Save & Next"}
            </button>
          </div>
        </div>

        {/* Question Palette */}
        <div className={styles.palette}>
          <h3 className={styles.paletteTitle}>Questions</h3>

          {/* Legend */}
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <div className={`${styles.legendBox} ${styles.legendBoxAnswered}`}></div>
              <span>Answered</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendBox} ${styles.legendBoxUnanswered}`}></div>
              <span>Not Answered</span>
            </div>
          </div>

          {/* Grid */}
          <div className={styles.grid}>
            {questions.map((q, idx) => {
              const answered = isAnswered(q.id);
              const active = idx === currentIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`${styles.gridBtn} ${answered ? styles.gridBtnAnswered : ''} ${active ? styles.gridBtnActive : ''}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Submit Button */}
          <button
            onClick={submitExam}
            className={styles.btnSubmit}
          >
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
}