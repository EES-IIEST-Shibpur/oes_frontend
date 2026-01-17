'use client';

import React, { useState } from 'react';
import { useMyAttempts } from '@/hooks/useApi';
import { Calendar, BookOpen, CheckCircle, Clock, FileText, Info } from 'lucide-react';
import ResultsAttemptsListSkeleton from '@/components/skeletons/ResultsAttemptsListSkeleton';

export default function ResultsAttemptsList({ onSelectExam }) {
  const { data: attemptsData, isLoading, error } = useMyAttempts();
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [showWindowModal, setShowWindowModal] = useState(false);
  const [modalExamTitle, setModalExamTitle] = useState('');
  const [modalEndTime, setModalEndTime] = useState(null);

  const attempts = attemptsData?.data?.data || [];

  const handleSelectExam = (examId, isResultAvailable, examTitle, endTime) => {
    if (!isResultAvailable) {
      setModalExamTitle(examTitle);
      setModalEndTime(endTime);
      setShowWindowModal(true);
      return;
    }
    
    setSelectedExamId(examId);
    onSelectExam(examId);
  };

  const closeModal = () => {
    setShowWindowModal(false);
    setModalExamTitle('');
    setModalEndTime(null);
  };

  const getRemainingTime = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Available now';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `Available in ${days} day${days > 1 ? 's' : ''}`;
    }
    if (hours > 0) {
      return `Available in ${hours}h ${minutes}m`;
    }
    return `Available in ${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  if (isLoading) {
    return <ResultsAttemptsListSkeleton />;
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
      <div className="flex flex-col items-center justify-center min-h-100 bg-gray-50 rounded-lg">
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
          const isResultAvailable = attempt.isResultAvailable !== false; // Default to true if not provided

          return (
            <div
              key={attempt.attemptId}
              className={`p-5 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white'
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

              <div className="border-t border-gray-200 pt-3 mt-3 flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">{attempt.score ?? 'N/A'}</span>
                  <span className="text-gray-500">points</span>
                </div>

                <button
                  onClick={() => handleSelectExam(
                    attempt.examId, 
                    isResultAvailable, 
                    attempt.examTitle, 
                    attempt.endTime
                  )}
                  disabled={!isResultAvailable}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isResultAvailable
                      ? 'bg-[#75B06F] text-white hover:bg-[#6B7F4D]'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                  title={!isResultAvailable ? getRemainingTime(attempt.endTime) : 'View detailed analysis'}
                >
                  <FileText size={18} />
                  <span>View Analysis</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Window Time Modal */}
      {showWindowModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Info size={24} className="text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Results Not Available Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Detailed analysis for <span className="font-semibold">{modalExamTitle}</span> will be available after the exam window closes.
                </p>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-amber-800 mb-1">
                    <Clock size={16} />
                    <span className="font-semibold">Exam ends at:</span>
                  </div>
                  <p className="text-amber-900 font-medium">
                    {modalEndTime ? new Date(modalEndTime).toLocaleString() : 'N/A'}
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    {getRemainingTime(modalEndTime)}
                  </p>
                </div>

                <p className="text-sm text-gray-500">
                  This ensures fair evaluation for all students during the exam window.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-[#75B06F] text-white rounded-lg font-medium hover:bg-[#6B7F4D] transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
