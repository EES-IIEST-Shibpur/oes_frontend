"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useExamAttempt, useSaveExamAnswer, useSubmitExam } from "@/hooks/useApi";
import { Clock, ChevronLeft, ChevronRight, Save, Send, X, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { useOfflineQueue } from "@/hooks/useOffline";
import { isNetworkError, getErrorMessage } from "@/utils/errorHandler";

// Reducer function for managing exam state
const examReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_EXAM':
      return {
        ...state,
        questions: action.payload.questions,
        examTitle: action.payload.examTitle,
        remainingSeconds: action.payload.remainingSeconds,
        answersMap: action.payload.answersMap,
        savedMap: action.payload.savedMap,
      };
    
    case 'SET_CURRENT_INDEX':
      return { ...state, currentIndex: action.payload };
    
    case 'DECREMENT_TIMER':
      return { ...state, remainingSeconds: Math.max(0, state.remainingSeconds - 1) };
    
    case 'UPDATE_ANSWER':
      return {
        ...state,
        answersMap: {
          ...state.answersMap,
          [action.payload.questionId]: action.payload.answer,
        },
        savedMap: {
          ...state.savedMap,
          [action.payload.questionId]: false,
        },
      };
    
    case 'MARK_SAVED':
      return {
        ...state,
        savedMap: {
          ...state.savedMap,
          [action.payload.questionId]: true,
        },
      };
    
    case 'CLEAR_ANSWER':
      const { [action.payload.questionId]: removedAnswer, ...restAnswers } = state.answersMap;
      const { [action.payload.questionId]: removedSaved, ...restSaved } = state.savedMap;
      return {
        ...state,
        answersMap: restAnswers,
        savedMap: restSaved,
      };
    
    default:
      return state;
  }
};

const initialState = {
  questions: [],
  examTitle: "",
  currentIndex: 0,
  remainingSeconds: 0,
  answersMap: {},
  savedMap: {},
};

export default function ExamPage() {
  const { examId } = useParams();
  const router = useRouter();

  const { data: examData, isLoading, error: fetchError } = useExamAttempt(examId);
  const saveAnswerMutation = useSaveExamAnswer();
  const submitExamMutation = useSubmitExam();

  const [state, dispatch] = useReducer(examReducer, initialState);
  const timerRef = useRef(null);

  // Offline queue and error handling
  const { isOnline, queueAnswer, clearPending, loadPendingAnswers } = useOfflineQueue();
  const [savingError, setSavingError] = useState(null);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  // Error boundary for fetch errors
  if (fetchError) {
    throw new Error(`Failed to load exam: ${fetchError.message}`);
  }

  useEffect(() => {
    if (examData?.data?.success) {
      const { exam, remainingSeconds } = examData.data;

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

      dispatch({
        type: 'INIT_EXAM',
        payload: {
          questions: exam.questions || [],
          examTitle: exam.title || "",
          remainingSeconds,
          answersMap: initAnswers,
          savedMap: initSaved,
        },
      });
    }
  }, [examData]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (state.remainingSeconds <= 0) return;

    timerRef.current = setInterval(() => {
      dispatch({ type: 'DECREMENT_TIMER' });
      if (state.remainingSeconds <= 1) {
        clearInterval(timerRef.current);
        autoSubmit();
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [state.remainingSeconds]);

  const currentQuestion = state.questions[state.currentIndex];

  const handleOptionChange = (optionId) => {
    const isMultiple = currentQuestion.questionType === "MULTIPLE_CORRECT";
    const prevAns = state.answersMap[currentQuestion.id] || { selectedOptionIds: [] };

    const updated = isMultiple
      ? prevAns.selectedOptionIds.includes(optionId)
        ? prevAns.selectedOptionIds.filter((id) => id !== optionId)
        : [...prevAns.selectedOptionIds, optionId]
      : [optionId];

    dispatch({
      type: 'UPDATE_ANSWER',
      payload: {
        questionId: currentQuestion.id,
        answer: { selectedOptionIds: updated },
      },
    });
  };

  const handleNumericalChange = (value) => {
    dispatch({
      type: 'UPDATE_ANSWER',
      payload: {
        questionId: currentQuestion.id,
        answer: { numericalAnswer: value },
      },
    });
  };

  const clearAnswer = () => {
    if (!currentQuestion) return;
    dispatch({
      type: 'CLEAR_ANSWER',
      payload: { questionId: currentQuestion.id },
    });
  };

  const saveAndNext = () => {
    const q = currentQuestion;
    if (!q || saveAnswerMutation.isPending) return;

    try {
      const ans = state.answersMap[q.id] || {};
      const payload = { questionId: q.id };

      if (q.questionType === "NUMERICAL") {
        payload.numericalAnswer = ans.numericalAnswer ?? null;
      } else {
        payload.selectedOptionIds = ans.selectedOptionIds || [];
      }

      saveAnswerMutation.mutate(
        { examId, data: payload },
        {
          onSuccess: () => {
            setSavingError(null);
            setShowErrorAlert(false);
            clearPending(q.id);
            dispatch({ type: 'MARK_SAVED', payload: { questionId: q.id } });
            dispatch({ type: 'SET_CURRENT_INDEX', payload: Math.min(state.currentIndex + 1, state.questions.length - 1) });
          },
          onError: (err) => {
            console.error("Save failed", err);
            
            // Check if it's a network error
            if (isNetworkError(err)) {
              // Queue the answer locally for later sync
              queueAnswer(examId, q.id, payload);
              setSavingError({
                type: 'offline',
                message: 'Server offline - Answer saved locally and will sync when connection is restored',
              });
            } else {
              setSavingError({
                type: 'error',
                message: getErrorMessage(err),
              });
            }
            setShowErrorAlert(true);
          },
        }
      );
    } catch (error) {
      console.error("Error in saveAndNext:", error);
      setSavingError({
        type: 'error',
        message: 'Failed to save answer. Please try again.',
      });
      setShowErrorAlert(true);
    }
  };

  const submitExam = () => {
    if (submitExamMutation.isPending) return;
    if (!window.confirm("Submit exam? You cannot change answers after submission.")) return;

    try {
      submitExamMutation.mutate(examId, {
        onSuccess: () => {
          setSavingError(null);
          router.push(`/results?examId=${examId}`);
        },
        onError: (err) => {
          console.error("Submit failed", err);
          
          if (isNetworkError(err)) {
            setSavingError({
              type: 'error',
              message: 'Cannot submit - Server is offline. Your answers are saved. Try again when connection is restored.',
            });
          } else {
            setSavingError({
              type: 'error',
              message: getErrorMessage(err),
            });
          }
          setShowErrorAlert(true);
        },
      });
    } catch (error) {
      console.error("Error in submitExam:", error);
      setSavingError({
        type: 'error',
        message: 'Failed to submit exam. Please try again.',
      });
      setShowErrorAlert(true);
    }
  };

  const autoSubmit = () => {
    try {
      submitExamMutation.mutate(examId, {
        onSettled: () => {
          router.push(`/results?examId=${examId}`);
        },
        onError: (err) => {
          console.error("Auto-submit failed", err);
          // Even if auto-submit fails, redirect to results page
          router.push(`/results?examId=${examId}`);
        },
      });
    } catch (error) {
      console.error("Error in autoSubmit:", error);
      router.push("/dashboard");
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 select-none">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          {/* Question Panel Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <div className="h-6 bg-gray-200 rounded-full w-24 mb-3 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-lg border-2 border-gray-200 animate-pulse"></div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="h-10 bg-gray-200 rounded-lg w-28 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
              <div className="ml-auto h-10 bg-gray-200 rounded-lg w-28 animate-pulse"></div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-200 rounded-full w-1/3 animate-pulse"></div>
              </div>
            </div>

            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              ))}
            </div>

            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="w-full aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!currentQuestion) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-gray-500">No questions available</div>
    </div>
  );

  const answeredCount = Object.keys(state.savedMap).length;

  return (
  <div className="min-h-screen bg-gray-50 select-none">
    {/* Online/Offline Status Banner */}
    {!isOnline && (
      <div className="bg-red-50 border-b border-red-200 px-4 py-3 flex items-center gap-2 text-red-700">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">No internet connection - Answers are being saved locally</span>
      </div>
    )}

    {/* Error Alert */}
    {showErrorAlert && savingError && (
      <div className={`border-b px-4 py-3 flex items-center justify-between gap-2 ${
        savingError.type === 'offline' 
          ? 'bg-yellow-50 border-yellow-200 text-yellow-700' 
          : 'bg-red-50 border-red-200 text-red-700'
      }`}>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">{savingError.message}</span>
        </div>
        <button
          onClick={() => setShowErrorAlert(false)}
          className="text-xl leading-none font-bold opacity-60 hover:opacity-100"
        >
          ×
        </button>
      </div>
    )}

    {/* Header */}
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{state.examTitle}</h1>
          <p className="text-sm text-gray-500">Question {state.currentIndex + 1} of {state.questions.length}</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50">
          <Clock className="w-5 h-5 text-gray-600" />
          <div className="text-lg font-mono font-semibold text-gray-900">
            {formatTime(state.remainingSeconds)}
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
              Question {state.currentIndex + 1}
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
                const checked = state.answersMap[currentQuestion.id]?.selectedOptionIds?.includes(opt.id) || false;
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
                value={state.answersMap[currentQuestion.id]?.numericalAnswer ?? ""}
                onChange={(e) => handleNumericalChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#75B06F] focus:outline-none text-gray-900"
                placeholder="Enter your answer"
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              disabled={state.currentIndex === 0}
              onClick={() => dispatch({ type: 'SET_CURRENT_INDEX', payload: state.currentIndex - 1 })}
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
              disabled={state.currentIndex === state.questions.length - 1}
              onClick={() => dispatch({ type: 'SET_CURRENT_INDEX', payload: Math.min(state.currentIndex + 1, state.questions.length - 1) })}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
              Next
            </button>

            <button
              onClick={saveAndNext}
              disabled={saveAnswerMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{ backgroundColor: "#75B06F" }}
            >
              {saveAnswerMutation.isPending ? (
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
              disabled={submitExamMutation.isPending}
              className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitExamMutation.isPending ? (
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
                {answeredCount}/{state.questions.length}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  backgroundColor: "#75B06F",
                  width: `${(answeredCount / state.questions.length) * 100}%`
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
            {state.questions.map((q, idx) => {
              const isCurrent = idx === state.currentIndex;
              const hasAnswer = state.answersMap[q.id];
              const isSaved = state.savedMap[q.id];

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
                  onClick={() => dispatch({ type: 'SET_CURRENT_INDEX', payload: idx })}
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