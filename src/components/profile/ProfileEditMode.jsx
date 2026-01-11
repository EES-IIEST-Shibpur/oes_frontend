'use client';

import { memo } from 'react';
import { Save, X } from 'lucide-react';
import {
  COURSE_MAP,
  DEPT_MAP,
  YEAR_MAP,
  SEM_MAP,
} from '@/constants/profileMaps';

/**
 * ProfileEditMode Component
 * Shows profile form for editing
 */
const ProfileEditMode = memo(({
  form,
  onChange,
  onSave,
  onCancel,
  isSaving,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Edit Profile</h2>

      <div className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            name="fullName"
            placeholder="Enter your full name"
            value={form.fullName}
            onChange={onChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Minimum 3 characters required</p>
        </div>

        {/* Course */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course <span className="text-red-500">*</span>
          </label>
          <select
            name="course"
            value={form.course}
            onChange={onChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Course</option>
            {Object.entries(COURSE_MAP).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            name="department"
            value={form.department}
            onChange={onChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Department</option>
            {Object.entries(DEPT_MAP).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Year and Semester in Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year <span className="text-red-500">*</span>
            </label>
            <select
              name="year"
              value={form.year}
              onChange={onChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Year</option>
              {Object.entries(YEAR_MAP).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semester <span className="text-red-500">*</span>
            </label>
            <select
              name="semester"
              value={form.semester}
              onChange={onChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Semester</option>
              {Object.entries(SEM_MAP).map(([key, label]) => (
                <option key={key} value={key}>
                  Semester {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Enrollment Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enrollment Number <span className="text-red-500">*</span>
          </label>
          <input
            name="enrollmentNumber"
            placeholder="e.g. 2023EEB005"
            value={form.enrollmentNumber}
            onChange={onChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
          />
          <p className="text-xs text-gray-500 mt-1">Minimum 3 characters required</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-6 border-t">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>

          <button
            onClick={onCancel}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
});

ProfileEditMode.displayName = 'ProfileEditMode';

export default ProfileEditMode;
