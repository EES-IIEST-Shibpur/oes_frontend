'use client';

import { memo } from 'react';
import { Download, ArrowLeft } from 'lucide-react';

/**
 * ResultsActions Component
 * Displays action buttons for results (Print, Download, Back to Dashboard)
 */
const ResultsActions = memo(({
  onPrint,
  onDownload,
  onBackToDashboard,
  isPrinting = false,
}) => {
  return (
    <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
      <button
        onClick={onPrint}
        disabled={isPrinting}
        className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        <Download size={20} />
        Print Results
      </button>

      <button
        onClick={onDownload}
        className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
      >
        <Download size={20} />
        Download Report
      </button>

      <button
        onClick={onBackToDashboard}
        className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 transition"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>
    </div>
  );
});

ResultsActions.displayName = 'ResultsActions';

export default ResultsActions;
