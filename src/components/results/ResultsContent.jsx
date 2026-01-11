'use client';

import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { useExamResults } from '@/hooks/useApi';
import ResultsHeader from '@/components/results/ResultsHeader';
import ResultsScoreCard from '@/components/results/ResultsScoreCard';
import ResultsStats from '@/components/results/ResultsStats';
import ResultsActions from '@/components/results/ResultsActions';
import AnswerReview from '@/components/results/AnswerReview';
import ResultsAttemptsList from '@/components/results/ResultsAttemptsList';
import { AuthContext } from '@/context/AuthContext';

/**
 * ResultsContent Component
 * Shows list of attempts first, then allows viewing result details
 */
export default function ResultsContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useContext(AuthContext);
  const [selectedExamId, setSelectedExamId] = useState(null);

  const { data: resultData, isLoading, error } = useExamResults(selectedExamId);
  const [isPrinting, setIsPrinting] = useState(false);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // If no exam is selected, show attempts list
  if (!selectedExamId) {
    return (
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
        <ResultsAttemptsList onSelectExam={setSelectedExamId} />
      </div>
    );
  }

  // Show loading while fetching results for selected exam
  if (isLoading) {
    return (
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
        <button
          onClick={() => setSelectedExamId(null)}
          className="mb-6 px-4 py-2 font-medium flex items-center gap-2"
        >
          ← Back to Attempts
        </button>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Loading results...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
        <button
          onClick={() => setSelectedExamId(null)}
          className="mb-6 px-4 py-2 font-medium flex items-center gap-2"
        >
          ← Back to Attempts
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Results</h3>
          <p className="text-red-600">{error?.message || 'Failed to load exam results'}</p>
        </div>
      </div>
    );
  }

  const result = resultData?.data?.data;
  if (!result) {
    return (
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
        <button
          onClick={() => setSelectedExamId(null)}
          className="mb-6 px-4 py-2 font-medium flex items-center gap-2"
        >
          ← Back to Attempts
        </button>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
          <p className="text-gray-500">Results are not available yet</p>
        </div>
      </div>
    );
  }

  const { score, status, submittedAt, answers = [], totalQuestions, percentage, examTitle } = result;

  const handlePrint = () => {
    setIsPrinting(true);
    window.print();
    setTimeout(() => setIsPrinting(false), 1000);
  };

  const handleDownload = () => {
    const content = `
Exam Results Report
Exam: ${examTitle}
Date: ${new Date(submittedAt).toLocaleDateString()}

SCORE SUMMARY
=============
Score: ${score}${totalQuestions ? ` / ${totalQuestions}` : ''}
Percentage: ${percentage}%
Status: ${status}
Submitted: ${new Date(submittedAt).toLocaleString()}

ANSWER DETAILS
==============
${answers
  .map(
    (answer, idx) => `
Question ${idx + 1}:
Text: ${answer?.Question?.questionText || 'N/A'}
Your Answer: ${
      answer.selectedOptionIds?.[0]
        ? `Option ${answer.selectedOptionIds[0]}`
        : answer.numericalAnswer || 'Not answered'
    }
Status: ${answer.marksObtained > 0 ? 'Correct' : 'Incorrect'}
Marks: ${answer.marksObtained || 0}
`
  )
  .join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exam-results-${examTitle}-${new Date(submittedAt).getTime()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
      {/* Back Button */}
      <button
        onClick={() => setSelectedExamId(null)}
        className="mb-6 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
      >
        ← Back to Attempts
      </button>

      {/* Main Result Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <ResultsScoreCard
          score={score}
          totalQuestions={totalQuestions}
          isPass={percentage >= 40}
          status={status}
        />

        {/* Details Section */}
        <div className="px-8 py-8">
          <ResultsStats
            correctCount={score}
            incorrectCount={totalQuestions ? totalQuestions - score : 0}
            submittedAt={submittedAt}
          />

          <ResultsActions
            onPrint={handlePrint}
            onDownload={handleDownload}
            onBackToDashboard={() => router.push('/dashboard')}
            isPrinting={isPrinting}
          />
        </div>
      </div>

      {/* Detailed Answers Section */}
      {answers && answers.length > 0 && <AnswerReview answers={answers} />}
    </div>
  );
}
