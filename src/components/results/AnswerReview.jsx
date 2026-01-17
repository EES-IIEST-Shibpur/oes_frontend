'use client';

import { memo } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

/**
 * AnswerReview Component
 * Displays detailed review of individual answers with full analysis
 */
const AnswerReview = memo(({ questions }) => {
  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 py-12 text-center text-gray-500">
          No questions to review
        </div>
      </div>
    );
  }

  const getAnswerStatus = (question) => {
    return question.studentAnswer?.marksObtained > 0;
  };

  const isAnswered = (question) => {
    const answer = question.studentAnswer;
    if (question.questionType === 'NUMERICAL') {
      return answer?.numericalAnswer !== null && answer?.numericalAnswer !== undefined;
    }
    return answer?.selectedOptionIds && answer.selectedOptionIds.length > 0;
  };

  const formatCorrectAnswer = (question) => {
    if (question.questionType === 'NUMERICAL') {
      return `${question.correctAnswer?.value ?? 'N/A'} (±${question.correctAnswer?.tolerance ?? 0})`;
    }
    
    if (question.questionType === 'MULTIPLE_CORRECT') {
      const correctOpts = question.options.filter(opt => opt.isCorrect);
      return correctOpts.map(opt => opt.text).join(', ');
    }
    
    const correctOpt = question.options.find(opt => opt.isCorrect);
    return correctOpt?.text || 'N/A';
  };

  const formatStudentAnswer = (question) => {
    const answer = question.studentAnswer;
    
    if (!isAnswered(question)) {
      return <span className="text-gray-400 italic">Not answered</span>;
    }

    if (question.questionType === 'NUMERICAL') {
      return <span className="font-medium">{answer.numericalAnswer}</span>;
    }
    
    if (answer.selectedOptionIds && answer.selectedOptionIds.length > 0) {
      const selectedTexts = answer.selectedOptionIds.map(id => {
        const opt = question.options.find(o => o.id === id);
        return opt?.text || 'Unknown';
      });
      return <span className="font-medium">{selectedTexts.join(', ')}</span>;
    }
    
    return <span className="text-gray-400 italic">Not answered</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-linear-to-r from-[#75B06F] to-[#6B7F4D] px-8 py-6">
        <h2 className="text-2xl font-bold text-white">Detailed Answer Analysis</h2>
        <p className="text-white/90 mt-1">Review each question with correct answers and explanations</p>
      </div>

      <div className="divide-y divide-gray-200">
        {questions.map((question, index) => {
          const isCorrect = getAnswerStatus(question);
          const answered = isAnswered(question);

          return (
            <div key={question.questionId || index} className="px-8 py-6 hover:bg-gray-50 transition">
              <div className="flex items-start gap-4">
                {/* Status Icon */}
                <div
                  className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    !answered 
                      ? 'bg-gray-100' 
                      : isCorrect 
                      ? 'bg-green-100' 
                      : 'bg-red-100'
                  }`}
                >
                  {!answered ? (
                    <AlertCircle size={24} className="text-gray-400" />
                  ) : isCorrect ? (
                    <CheckCircle size={24} className="text-green-600" />
                  ) : (
                    <XCircle size={24} className="text-red-600" />
                  )}
                </div>

                <div className="flex-1">
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Question {question.questionOrder || index + 1}
                      </h3>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {question.questionType.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold px-3 py-1 rounded-full ${
                          !answered
                            ? 'bg-gray-100 text-gray-600'
                            : isCorrect
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {!answered ? 'Not Answered' : isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                      <span className="text-sm font-semibold text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                        {question.studentAnswer?.marksObtained ?? 0} / {question.marks} marks
                      </span>
                    </div>
                  </div>

                  {/* Question Statement */}
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 font-medium leading-relaxed">
                      {question.statement}
                    </p>
                  </div>

                  {/* Options Display (for MCQ) */}
                  {question.questionType !== 'NUMERICAL' && question.options && (
                    <div className="space-y-2 mb-4">
                      {question.options.map((option, optIdx) => {
                        const isSelected = question.studentAnswer?.selectedOptionIds?.includes(option.id);
                        const isCorrectOption = option.isCorrect;

                        return (
                          <div
                            key={option.id}
                            className={`p-3 rounded-lg border-2 transition ${
                              isCorrectOption
                                ? 'border-green-500 bg-green-50'
                                : isSelected
                                ? 'border-red-400 bg-red-50'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                                  isCorrectOption
                                    ? 'bg-green-500 text-white'
                                    : isSelected
                                    ? 'bg-red-400 text-white'
                                    : 'bg-gray-200 text-gray-600'
                                }`}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </div>
                              <span className={`flex-1 ${
                                isCorrectOption ? 'font-semibold text-green-900' : 'text-gray-700'
                              }`}>
                                {option.text}
                              </span>
                              {isCorrectOption && (
                                <CheckCircle size={18} className="text-green-600" />
                              )}
                              {isSelected && !isCorrectOption && (
                                <XCircle size={18} className="text-red-600" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Answer Summary */}
                  <div className="space-y-3 text-sm bg-linear-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-gray-600 font-semibold mb-1">Your Answer:</p>
                        <div className="text-gray-900">
                          {formatStudentAnswer(question)}
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-600 font-semibold mb-1">Correct Answer:</p>
                        <p className="text-green-700 font-semibold">
                          {formatCorrectAnswer(question)}
                        </p>
                      </div>
                    </div>

                    {question.negativeMarks && question.negativeMarks < 0 && (
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          <span className="font-semibold">Note:</span> This question has negative marking 
                          ({question.negativeMarks} marks for incorrect answer)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

AnswerReview.displayName = 'AnswerReview';

export default AnswerReview;
