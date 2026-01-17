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
import ResultsContentSkeleton from '@/components/skeletons/ResultsContentSkeleton';
import AuthLoadingScreen from '@/components/AuthLoadingScreen';
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
    return <AuthLoadingScreen />;
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

  // Show loading skeleton while fetching results for selected exam
  if (isLoading) {
    return <ResultsContentSkeleton />;
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

  const result = resultData?.data;
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

  const { 
    score = 0, 
    totalMarks = 0,
    status = 'SUBMITTED', 
    submittedAt, 
    questions = [], 
    totalQuestions = 0, 
    percentage = 0, 
    examTitle = 'Exam',
    startedAt,
    durationMinutes = 0
  } = result;

  // Calculate correct/incorrect counts with proper fallbacks
  const correctCount = questions.filter(q => q.studentAnswer?.marksObtained > 0).length;
  const incorrectCount = Math.max(0, (totalQuestions || 0) - correctCount);

  const handlePrint = () => {
    setIsPrinting(true);
    window.print();
    setTimeout(() => setIsPrinting(false), 1000);
  };

  const handleDownload = () => {
    const content = `
Exam Results Report
====================
Exam: ${examTitle}
Date: ${new Date(submittedAt).toLocaleDateString()}
Started: ${new Date(startedAt).toLocaleString()}
Duration: ${durationMinutes} minutes

SCORE SUMMARY
=============
Score: ${score} / ${totalMarks} marks
Percentage: ${percentage}%
Status: ${status}
Total Questions: ${totalQuestions}
Correct Answers: ${correctCount}
Incorrect Answers: ${incorrectCount}

DETAILED ANSWER REVIEW
======================
${questions
  .map(
    (q, idx) => `
Question ${idx + 1}:
${q.statement}
Type: ${q.questionType}
Marks: ${q.marks}

${q.questionType === 'NUMERICAL' 
  ? `Your Answer: ${q.studentAnswer?.numericalAnswer ?? 'Not answered'}
Correct Answer: ${q.correctAnswer?.value ?? 'N/A'} (±${q.correctAnswer?.tolerance ?? 0})`
  : `Options:
${q.options.map((opt, i) => 
  `  ${String.fromCharCode(65 + i)}. ${opt.text} ${opt.isCorrect ? '✓ (Correct)' : ''} ${
    q.studentAnswer?.selectedOptionIds?.includes(opt.id) ? '← Your answer' : ''
  }`
).join('\n')}

Your Answer: ${q.studentAnswer?.selectedOptionIds?.length > 0 
  ? q.studentAnswer.selectedOptionIds.map(id => {
      const opt = q.options.find(o => o.id === id);
      return opt ? opt.text : 'Unknown';
    }).join(', ')
  : 'Not answered'}
Correct Answer: ${q.questionType === 'MULTIPLE_CORRECT' 
  ? q.options.filter(o => o.isCorrect).map(o => o.text).join(', ')
  : q.options.find(o => o.isCorrect)?.text || 'N/A'}`}

Marks Obtained: ${q.studentAnswer?.marksObtained ?? 0} / ${q.marks}
Status: ${q.studentAnswer?.marksObtained > 0 ? 'Correct ✓' : 'Incorrect ✗'}
`
  )
  .join('\n' + '='.repeat(50) + '\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exam-results-${examTitle.replace(/\s+/g, '-')}-${new Date(submittedAt).getTime()}.txt`;
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
          totalMarks={totalMarks}
          totalQuestions={totalQuestions}
          isPass={percentage >= 40}
          status={status}
        />

        {/* Details Section */}
        <div className="px-8 py-8">
          <ResultsStats
            correctCount={correctCount}
            incorrectCount={incorrectCount}
            submittedAt={submittedAt}
            percentage={percentage}
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
      {questions && questions.length > 0 && <AnswerReview questions={questions} />}
    </div>
  );
}
