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
  const [savedMap, setSavedMap] = useState({});
  const [loading, setLoading] = useState(true);

  const timerRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(`/api/exam-attempt/${examId}/attempt`);
        if (!res?.data?.success) return;

        const { exam, remainingSeconds } = res.data;
        setQuestions(exam.questions || []);
        setRemainingSeconds(remainingSeconds);

        const initAnswers = {};
        const initSaved = {};

        exam.questions.forEach((q) => {
          if (q.studentAnswer) {
            initAnswers[q.id] = {
              selectedOptionIds: q.studentAnswer.selectedOptionIds || [],
              numericalAnswer: q.studentAnswer.numericalAnswer ?? null,
            };
            initSaved[q.id] = true;
          }
        });

        setAnswersMap(initAnswers);
        setSavedMap(initSaved);
      } catch (err) {
        console.error("Failed to load exam", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [examId]);

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

  const handleOptionChange = (optionId) => {
    const isMultiple = currentQuestion.questionType === "MULTIPLE_CORRECT";

    setAnswersMap((prev) => {
      const prevAns = prev[currentQuestion.id] || { selectedOptionIds: [] };

      const updated = isMultiple
        ? prevAns.selectedOptionIds.includes(optionId)
          ? prevAns.selectedOptionIds.filter((id) => id !== optionId)
          : [...prevAns.selectedOptionIds, optionId]
        : [optionId];

      const newState = {
        ...prev,
        [currentQuestion.id]: { selectedOptionIds: updated },
      };

      setSavedMap((s) => ({ ...s, [currentQuestion.id]: false }));
      return newState;
    });
  };

  const handleNumericalChange = (value) => {
    setAnswersMap((prev) => {
      const newState = {
        ...prev,
        [currentQuestion.id]: { numericalAnswer: value },
      };
      setSavedMap((s) => ({ ...s, [currentQuestion.id]: false }));
      return newState;
    });
  };

  const clearAnswer = () => {
    const q = currentQuestion;
    if (!q) return;
    setAnswersMap((prev) => {
      const copy = { ...prev };
      delete copy[q.id];
      return copy;
    });
    setSavedMap((prev) => {
      const copy = { ...prev };
      delete copy[q.id];
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
        setSavedMap((s) => ({ ...s, [q.id]: true }));
        setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
      }
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const submitExam = async () => {
    if (!window.confirm("Submit exam? You cannot change answers after submission.")) return;

    try {
      const res = await apiFetch(`/api/exam-attempt/${examId}`, { method: "POST" });
      if (res?.data?.success) router.push("/dashboard");
    } catch (err) {
      console.error("Submit failed", err);
    }
  };

  const autoSubmit = async () => {
    try {
      await apiFetch(`/api/exam-attempt/${examId}`, { method: "POST" });
    } finally {
      router.push("/dashboard");
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2,"0")}:${mins.toString().padStart(2,"0")}:${secs.toString().padStart(2,"0")}`;
  };

  if (loading) return <div className={styles.loading}>Loading exam...</div>;
  if (!currentQuestion) return <div className={styles.loading}>No questions</div>;

  const answeredCount = Object.keys(savedMap).length;

  return (
    <div className={styles.page}>
      <div className={styles.headerBar}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Online Examination</h1>
          <p className={styles.subTitle}>Question {currentIndex + 1} of {questions.length}</p>
        </div>
        <div className={styles.timerBox}>
          <div className={styles.timerLabel}>Time Remaining</div>
          <div className={styles.timerValue}>{formatTime(remainingSeconds)}</div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.questionCard}>
          <div className={styles.questionHeader}>
            <div className={styles.qNumber}>Q{currentIndex + 1}</div>
            <div className={styles.qText}>{currentQuestion.statement}</div>
          </div>

          <div className={styles.qContent}>
            {(currentQuestion.questionType === "SINGLE_CORRECT" ||
              currentQuestion.questionType === "MULTIPLE_CORRECT") &&
              currentQuestion.options.map((opt) => {
                const checked = answersMap[currentQuestion.id]?.selectedOptionIds?.includes(opt.id) || false;

                return (
                  <label key={opt.id} className={`${styles.optRow} ${checked ? styles.optActive : ""}`}>
                    <input
                      type={currentQuestion.questionType === "MULTIPLE_CORRECT" ? "checkbox" : "radio"}
                      checked={checked}
                      onChange={() => handleOptionChange(opt.id)}
                      className={styles.optInput}
                    />
                    <span className={`${styles.optText} ${checked ? styles.optTextActive : ""}`}>
                      {opt.text}
                    </span>
                  </label>
                );
              })}

            {currentQuestion.questionType === "NUMERICAL" && (
              <input
                type="number"
                value={answersMap[currentQuestion.id]?.numericalAnswer ?? ""}
                onChange={(e) => handleNumericalChange(e.target.value)}
                className={styles.numInput}
                placeholder="Enter your answer"
              />
            )}
          </div>

          <div className={styles.actions}>
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
              className={styles.prevBtn}
            >
              Previous
            </button>
            <button onClick={clearAnswer} className={styles.clearBtn}>
              Clear
            </button>
            <button onClick={saveAndNext} className={styles.saveNextBtn}>
              Save & Next
            </button>
            <button onClick={submitExam} className={styles.submitBtn}>
              Submit Exam
            </button>
          </div>
        </div>

        <div className={styles.sidePanel}>
          <div className={styles.panelHeader}>
            <div>Progress</div>
            <div className={styles.panelCount}>{answeredCount}/{questions.length}</div>
          </div>

          <div className={styles.progressBarWrap}>
            <div
              className={styles.progressBar}
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>

          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <div className={`${styles.legendBox} ${styles.legendCurrent}`} />
              Current
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendBox} ${styles.legendSaved}`} />
              Answered (Saved)
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendBox} ${styles.legendUnsaved}`} />
              Selected (Unsaved)
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendBox} ${styles.legendNot}`} />
              Not Answered
            </div>
          </div>

          <div className={styles.qList}>
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const hasAnswer = answersMap[q.id];
              const isSaved = savedMap[q.id];

              const cls = isCurrent
                ? styles.qButtonCurrent
                : isSaved
                ? styles.qButtonSaved
                : hasAnswer
                ? styles.qButtonUnsaved
                : styles.qButtonNot;

              return (
                <button key={q.id} className={cls} onClick={() => setCurrentIndex(idx)}>
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}