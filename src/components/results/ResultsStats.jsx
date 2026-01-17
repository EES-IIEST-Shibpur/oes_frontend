'use client';

import { memo } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

/**
 * ResultsStats Component
 * Displays detailed statistics about exam performance
 */
const ResultsStats = memo(({ correctCount = 0, incorrectCount = 0, submittedAt, percentage }) => {
  // Ensure numbers are valid
  const safeCorrectCount = Number.isFinite(correctCount) ? correctCount : 0;
  const safeIncorrectCount = Number.isFinite(incorrectCount) ? incorrectCount : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle size={24} className="text-blue-600" />
          <span className="text-sm text-gray-600">Correct Answers</span>
        </div>
        <p className="text-3xl font-bold text-blue-600">{safeCorrectCount}</p>
      </div>

      <div className="bg-red-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <XCircle size={24} className="text-red-600" />
          <span className="text-sm text-gray-600">Incorrect Answers</span>
        </div>
        <p className="text-3xl font-bold text-red-600">{safeIncorrectCount}</p>
      </div>

      <div className="bg-amber-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <Clock size={24} className="text-amber-600" />
          <span className="text-sm text-gray-600">Submitted At</span>
        </div>
        <p className="text-sm font-semibold text-amber-600">
          {new Date(submittedAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-amber-600">
          {new Date(submittedAt).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
});

ResultsStats.displayName = 'ResultsStats';

export default ResultsStats;
