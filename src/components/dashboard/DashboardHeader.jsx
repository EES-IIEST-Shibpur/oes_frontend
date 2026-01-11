'use client';

import { memo } from 'react';

/**
 * DashboardHeader Component
 * Displays user greeting and dashboard description
 */
const DashboardHeader = memo(({ userName }) => {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">
        {userName}'s Dashboard
      </h1>
      <p className="text-gray-500 text-sm">View and manage your exams</p>
    </div>
  );
});

DashboardHeader.displayName = 'DashboardHeader';

export default DashboardHeader;
