'use client';

import { memo } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

/**
 * ResultsScoreCard Component
 * Displays the main score and pass/fail status
 */
const ResultsScoreCard = memo(({ score, totalMarks, totalQuestions, isPass, status }) => {
  // Ensure all values are valid numbers
  const safeScore = Number.isFinite(score) ? score : 0;
  const safeTotalMarks = Number.isFinite(totalMarks) ? totalMarks : 0;
  const safeTotalQuestions = Number.isFinite(totalQuestions) ? totalQuestions : 0;
  const percentage = safeTotalMarks > 0 ? Math.round((safeScore / safeTotalMarks) * 100) : 0;

  return (
    <div
      className={`px-8 py-12 text-center ${
        isPass
          ? 'bg-gradient-to-r from-green-50 to-emerald-50'
          : 'bg-gradient-to-r from-red-50 to-rose-50'
      }`}
    >
      <div className="mb-6 flex justify-center">
        {isPass ? (
          <CheckCircle size={64} className="text-green-600" />
        ) : (
          <XCircle size={64} className="text-red-600" />
        )}
      </div>

      <h1 className={`text-4xl font-bold mb-2 ${isPass ? 'text-green-700' : 'text-red-700'}`}>
        {isPass ? 'Congratulations!' : 'Keep Practicing!'}
      </h1>

      <div className="text-6xl font-bold text-gray-900 mb-2">{percentage}%</div>

      <p className="text-xl text-gray-600 mb-4">
        You scored {safeScore} out of {safeTotalMarks} marks
      </p>
      
      <p className="text-lg text-gray-500 mb-6">
        Total Questions: {safeTotalQuestions}
      </p>

      <div className="inline-block bg-white rounded-lg px-6 py-3 shadow-sm">
        <p className="text-sm text-gray-500">Status</p>
        <p className="text-lg font-semibold text-gray-900">{status}</p>
      </div>
    </div>
  );
});

ResultsScoreCard.displayName = 'ResultsScoreCard';

export default ResultsScoreCard;
