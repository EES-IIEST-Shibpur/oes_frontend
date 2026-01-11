'use client';

import { memo } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

/**
 * AnswerReview Component
 * Displays detailed review of individual answers
 */
const AnswerReview = memo(({ answers }) => {
  const getAnswerStatus = (answer) => {
    return answer.marksObtained > 0;
  };

  const getCorrectAnswer = (question) => {
    if (!question) return null;
    
    const options = question.options || [];
    const correctOption = options.find(opt => opt.isCorrect);
    
    if (correctOption) {
      return `${correctOption.optionText}`;
    }
    
    const numericalAnswer = question.NumericalAnswer;
    if (numericalAnswer) {
      return `${numericalAnswer.value} (±${numericalAnswer.tolerance})`;
    }
    
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Detailed Review</h2>
        <p className="text-gray-600 mt-1">Review your answers for each question</p>
      </div>

      <div className="divide-y divide-gray-200">
        {answers && answers.length > 0 ? (
          answers.map((answer, index) => {
            const isCorrect = getAnswerStatus(answer);
            const correctAnswer = getCorrectAnswer(answer.Question);

            return (
              <div key={answer.id || index} className="px-8 py-6 hover:bg-gray-50 transition">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isCorrect ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle size={24} className="text-green-600" />
                    ) : (
                      <XCircle size={24} className="text-red-600" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Question {index + 1}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold px-3 py-1 rounded-full ${
                            isCorrect
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                        {answer.marksObtained !== undefined && (
                          <span className="text-sm font-semibold text-gray-600">
                            {answer.marksObtained} marks
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 font-medium">
                      {answer?.Question?.questionText || 'N/A'}
                    </p>

                    <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-gray-600 font-semibold">Your Answer:</p>
                        <p className="text-gray-900 mt-1">
                          {answer.selectedOptionIds?.[0]
                            ? `Option: ${answer.selectedOptionIds.map(id => {
                                const opt = answer.Question?.options?.find(o => o.id === id);
                                return opt?.optionText || id;
                              }).join(', ')}`
                            : answer.numericalAnswer !== undefined && answer.numericalAnswer !== null
                            ? `${answer.numericalAnswer}`
                            : 'Not answered'}
                        </p>
                      </div>

                      {correctAnswer && (
                        <div>
                          <p className="text-gray-600 font-semibold">Correct Answer:</p>
                          <p className="text-green-600 font-medium mt-1">
                            {correctAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="px-8 py-12 text-center text-gray-500">
            No answers to review
          </div>
        )}
      </div>
    </div>
  );
});

AnswerReview.displayName = 'AnswerReview';

export default AnswerReview;
