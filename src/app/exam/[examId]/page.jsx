"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "../../../lib/api";
import { Clock, ChevronLeft, ChevronRight, Save, Send, X } from "lucide-react";

export default function ExamPage() {
  const { examId } = useParams();
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [examTitle, setExamTitle] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [answersMap, setAnswersMap] = useState({});
  const [savedMap, setSavedMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(`/api/exam-attempt/${examId}/attempt`);
        if (!res?.data?.success) return;

        const { exam, remainingSeconds } = res.data;
        setExamTitle(exam.title || "");
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
    if (!q || saving) return;

    const ans = answersMap[q.id] || {};
    const payload = { questionId: q.id };

    if (q.questionType === "NUMERICAL") {
      payload.numericalAnswer = ans.numericalAnswer ?? null;
    } else {
      payload.selectedOptionIds = ans.selectedOptionIds || [];
    }

    try {
      setSaving(true);
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
    } finally {
      setSaving(false);
    }
  };

  const submitExam = async () => {
    if (submitting) return;
    if (!window.confirm("Submit exam? You cannot change answers after submission.")) return;

    try {
      setSubmitting(true);
      const res = await apiFetch(`/api/exam-attempt/${examId}/submit`, { method: "POST" });
      if (res?.data?.success) router.push("/dashboard");
    } catch (err) {
      console.error("Submit failed", err);
      setSubmitting(false);
    }
  };

  const autoSubmit = async () => {
    try {
      await apiFetch(`/api/exam-attempt/${examId}/submit`, { method: "POST" });
    } finally {
      router.push("/dashboard");
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-gray-500">Loading exam...</div>
    </div>
  );

  if (!currentQuestion) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-gray-500">No questions available</div>
    </div>
  );

  const answeredCount = Object.keys(savedMap).length;

  return (
  <div className="min-h-screen bg-gray-50 select-none">
    {/* Header */}
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{examTitle}</h1>
          <p className="text-sm text-gray-500">Question {currentIndex + 1} of {questions.length}</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50">
          <Clock className="w-5 h-5 text-gray-600" />
          <div className="text-lg font-mono font-semibold text-gray-900">
            {formatTime(remainingSeconds)}
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* Question Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Question Statement */}
          <div className="mb-6">
            <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 mb-3">
              Question {currentIndex + 1}
            </div>
            <h2 className="text-lg font-medium text-gray-900 leading-relaxed">
              {currentQuestion.statement}
            </h2>
          </div>

          {/* Options/Input */}
          <div className="space-y-3 mb-8">
            {(currentQuestion.questionType === "SINGLE_CORRECT" ||
              currentQuestion.questionType === "MULTIPLE_CORRECT") &&
              currentQuestion.options.map((opt) => {
                const checked = answersMap[currentQuestion.id]?.selectedOptionIds?.includes(opt.id) || false;
                const inputType = currentQuestion.questionType === "MULTIPLE_CORRECT" ? "checkbox" : "radio";

                return (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${checked
                        ? "border-[#75B06F] bg-green-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                  >
                    <input
                      type={inputType}
                      checked={checked}
                      onChange={() => handleOptionChange(opt.id)}
                      className="w-4 h-4 accent-[#75B06F]"
                    />
                    <span className="text-gray-900">{opt.text}</span>
                  </label>
                );
              })}

            {currentQuestion.questionType === "NUMERICAL" && (
              <input
                type="number"
                value={answersMap[currentQuestion.id]?.numericalAnswer ?? ""}
                onChange={(e) => handleNumericalChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#75B06F] focus:outline-none text-gray-900"
                placeholder="Enter your answer"
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={clearAnswer}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
              Clear
            </button>

            <button
              onClick={saveAndNext}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{ backgroundColor: "#75B06F" }}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save & Next
                </>
              )}
            </button>

            <button
              onClick={submitExam}
              disabled={submitting}
              className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit lg:sticky lg:top-24">
          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-semibold text-gray-900">
                {answeredCount}/{questions.length}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  backgroundColor: "#75B06F",
                  width: `${(answeredCount / questions.length) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-3 h-3 rounded bg-blue-500" />
              Current
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-3 h-3 rounded bg-green-500" />
              Answered
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-3 h-3 rounded bg-yellow-500" />
              Selected
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-3 h-3 rounded bg-gray-200" />
              Not Answered
            </div>
          </div>

          {/* Question Grid */}
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const hasAnswer = answersMap[q.id];
              const isSaved = savedMap[q.id];

              const bgColor = isCurrent
                ? "bg-blue-500 text-white"
                : isSaved
                  ? "bg-green-500 text-white"
                  : hasAnswer
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200 text-gray-700";

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-full aspect-square rounded-lg text-sm font-medium transition hover:opacity-80 cursor-pointer ${bgColor}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}