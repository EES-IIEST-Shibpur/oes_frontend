'use client';

import React, { useState } from 'react';
import { useMyAttempts } from '@/hooks/useApi';
import { Calendar, BookOpen, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function ResultsAttemptsList({ onSelectExam }) {
  const { data: attemptsData, isLoading, error } = useMyAttempts();
  const [selectedExamId, setSelectedExamId] = useState(null);

  const attempts = attemptsData?.data?.data || [];

  const handleSelectExam = (examId) => {
    setSelectedExamId(examId);
    onSelectExam(examId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading attempts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Failed to load attempts: {error.message}</p>
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
        <BookOpen size={48} className="text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Exam Attempts</h3>
        <p className="text-gray-500">You haven't attempted any exams yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Exam Attempts</h2>
        <span className="bg-(--color-primary-main) px-3 py-1 rounded-full text-sm font-medium">
          {attempts.length} attempt{attempts.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid gap-4">
        {attempts.map((attempt) => {
          const isSelected = selectedExamId === attempt.examId;
          const statusIcon = attempt.status === 'SUBMITTED' ? <CheckCircle size={18} /> : <Clock size={18} />;

          return (
            <button
              key={attempt.attemptId}
              onClick={() => handleSelectExam(attempt.examId)}
              className={`w-full text-left p-5 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {attempt.examTitle}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{new Date(attempt.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{attempt.durationMinutes} mins</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-medium ${
                    attempt.status === 'SUBMITTED' ? 'bg-green-500' : 'bg-(--color-primary-main)'
                  }`}>
                    {statusIcon}
                    <span>{attempt.status}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">{attempt.score}</span>
                  <span className="text-gray-500">points</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
