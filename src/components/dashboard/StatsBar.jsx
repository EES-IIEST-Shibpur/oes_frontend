'use client';

import { memo } from 'react';

/**
 * StatsBar Component
 * Displays quick statistics about exams
 */
const StatsBar = memo(({ liveCount, upcomingCount }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-10">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="text-3xl font-bold text-gray-900 mb-1">{liveCount}</div>
        <div className="text-sm text-gray-500">Live Exams</div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="text-3xl font-bold text-gray-900 mb-1">{upcomingCount}</div>
        <div className="text-sm text-gray-500">Upcoming</div>
      </div>
    </div>
  );
});

StatsBar.displayName = 'StatsBar';

export default StatsBar;
