'use client';

import { memo } from 'react';
import { ArrowLeft } from 'lucide-react';

/**
 * ResultsHeader Component
 * Displays header and back button for results page
 */
const ResultsHeader = memo(({ onBack }) => {
  return (
    <button
      onClick={onBack}
      className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
    >
      <ArrowLeft size={20} />
      Back to Dashboard
    </button>
  );
});

ResultsHeader.displayName = 'ResultsHeader';

export default ResultsHeader;
