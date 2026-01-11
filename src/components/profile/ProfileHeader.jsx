'use client';

import { memo } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

/**
 * ProfileHeader Component
 * Displays user profile header with name and email
 */
const ProfileHeader = memo(({ fullName, email, isProfileComplete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 border border-gray-300 rounded-full flex items-center justify-center bg-gray-100">
            <span className="text-2xl font-bold text-gray-600">
              {fullName?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {fullName || 'User'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">{email}</p>
          </div>
        </div>
        {isProfileComplete && (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-200">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Complete</span>
          </div>
        )}
      </div>

      <p className="text-gray-600 text-sm">
        Complete your profile to ensure accurate exam records and personalized
        reports. All fields are required.
      </p>
    </div>
  );
});

ProfileHeader.displayName = 'ProfileHeader';

export default ProfileHeader;
