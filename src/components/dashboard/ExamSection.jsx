'use client';

import { memo } from 'react';
import ExamCard from './ExamCard';
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';

/**
 * ExamSection Component
 * Displays a section of exams (Live or Upcoming)
 */
const ExamSection = memo(({
  title,
  exams,
  isLoading,
  emptyMessage,
  emptySubtitle,
  onExamAction,
}) => {
  if (isLoading) {
    return (
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
        <DashboardSkeleton />
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <div className="text-gray-400 mb-2">{emptyMessage}</div>
          <p className="text-sm text-gray-500">{emptySubtitle}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exams.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            isLive={title.includes('Live')}
            onStart={onExamAction}
          />
        ))}
      </div>
    </div>
  );
});

ExamSection.displayName = 'ExamSection';

export default ExamSection;
