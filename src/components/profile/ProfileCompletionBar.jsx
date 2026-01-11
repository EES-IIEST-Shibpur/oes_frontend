'use client';

import { memo } from 'react';

/**
 * ProfileCompletionBar Component
 * Shows profile completion percentage
 */
const ProfileCompletionBar = memo(({ completionPercentage }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-700">Profile Completion</p>
        <span className="text-sm font-semibold text-gray-900">{completionPercentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-(--color-primary-text) h-2 rounded-full transition-all duration-300"
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>
    </div>
  );
});

ProfileCompletionBar.displayName = 'ProfileCompletionBar';

export default ProfileCompletionBar;
