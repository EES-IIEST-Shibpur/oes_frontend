'use client';

import { memo, useMemo } from 'react';
import { Clock, FileText, Calendar, Play, Lock } from 'lucide-react';

/**
 * ExamCard Component
 * Displays individual exam information and actions
 */
const ExamCard = memo(({ exam, isLive, onStart }) => {
  const formattedStartDate = useMemo(() => {
    if (!exam.startTime) return null;
    return new Date(exam.startTime).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [exam.startTime]);

  const formattedEndDate = useMemo(() => {
    if (!exam.endTime) return null;
    return new Date(exam.endTime).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [exam.endTime]);

  const getButtonState = useMemo(() => {
    if (!isLive) {
      return {
        disabled: true,
        icon: <Lock className="w-4 h-4" />,
        text: 'Locked',
        className: 'bg-gray-100 text-gray-400 cursor-not-allowed',
      };
    }

    if (exam.hasAttempt) {
      if (exam.attemptStatus === 'IN_PROGRESS') {
        return {
          disabled: false,
          icon: <Play className="w-4 h-4" />,
          text: 'Resume Exam',
          className: 'text-white hover:opacity-90',
          bgColor: '#75B06F',
        };
      }
      return {
        disabled: true,
        icon: <FileText className="w-4 h-4" />,
        text: 'Already Attempted',
        className: 'bg-gray-200 text-gray-500 cursor-not-allowed',
      };
    }

    return {
      disabled: false,
      icon: <Play className="w-4 h-4" />,
      text: 'Start Exam',
      className: 'text-white hover:opacity-90',
      bgColor: '#75B06F',
    };
  }, [exam.hasAttempt, exam.attemptStatus, isLive]);

  const handleButtonClick = () => {
    if (onStart) {
      if (isLive && exam.hasAttempt && exam.attemptStatus === 'IN_PROGRESS') {
        onStart(exam.id);
      } else if (isLive && !exam.hasAttempt) {
        onStart(exam.id, exam.title);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Title and Status Badge */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{exam.title}</h3>
        <span
          className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
            isLive
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {isLive ? 'Live' : 'Upcoming'}
        </span>
      </div>

      {/* Exam Details */}
      <div className="space-y-2 mb-5 text-sm text-gray-600">
        {exam.durationMinutes && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{exam.durationMinutes} min</span>
          </div>
        )}

        {exam.totalQuestions && (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>{exam.totalQuestions} questions</span>
          </div>
        )}

        {exam.startTime && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Start: {formattedStartDate}</span>
          </div>
        )}

        {exam.endTime && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>End: {formattedEndDate}</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={handleButtonClick}
        disabled={getButtonState.disabled}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
          getButtonState.bgColor
            ? `text-white hover:opacity-90`
            : getButtonState.className
        }`}
        style={getButtonState.bgColor ? { backgroundColor: getButtonState.bgColor } : {}}
      >
        {getButtonState.icon}
        {getButtonState.text}
      </button>
    </div>
  );
});

ExamCard.displayName = 'ExamCard';

export default ExamCard;
