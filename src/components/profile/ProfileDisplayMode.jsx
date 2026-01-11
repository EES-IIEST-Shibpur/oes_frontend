'use client';

import { memo } from 'react';
import { Edit } from 'lucide-react';

/**
 * ProfileDisplayMode Component
 * Shows profile information in view-only mode
 */
const ProfileDisplayMode = memo(({
  form,
  email,
  onEditClick,
  displayValue,
}) => {
  const fields = [
    { label: 'Full Name', key: 'fullName', display: form.fullName || 'Not set' },
    { label: 'Email', key: 'email', display: email },
    { label: 'Course', key: 'course', display: displayValue('course', form.course) },
    { label: 'Department', key: 'department', display: displayValue('department', form.department) },
    { label: 'Year', key: 'year', display: displayValue('year', form.year) },
    { label: 'Semester', key: 'semester', display: displayValue('semester', form.semester) },
    { label: 'Enrollment Number', key: 'enrollmentNumber', display: form.enrollmentNumber || 'Not set', isMonospace: true },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {fields.map((field) => (
          <div key={field.key} className="pb-4 border-b md:border-b-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {field.label}
            </p>
            <p className={`text-lg font-semibold text-gray-900 ${field.isMonospace ? 'font-mono' : ''}`}>
              {field.display}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={onEditClick}
        className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-gray-900 bg-(--color-primary-main) text-white transition cursor-pointer"
      >
        <Edit className="w-4 h-4" />
        Edit Profile
      </button>
    </div>
  );
});

ProfileDisplayMode.displayName = 'ProfileDisplayMode';

export default ProfileDisplayMode;
