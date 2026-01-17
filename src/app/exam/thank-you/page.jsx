'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Home } from 'lucide-react';

export default function ThankYouPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examId = searchParams.get('examId');

  // Prevent back navigation
  useEffect(() => {
    const handlePopState = (e) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.href);
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-100 rounded-full">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>

          {/* Thank You Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thank You!
          </h1>
          <p className="text-lg text-gray-700 mb-2">
            Your exam has been submitted successfully.
          </p>
          <p className="text-sm text-gray-600 mb-8">
            Your responses have been recorded and are being evaluated. You can check your results once they are available.
          </p>

          {/* Divider */}
          <div className="border-t border-gray-200 my-6" />

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: '#75B06F' }}
            >
              <Home className="w-5 h-5" />
              Go to Dashboard
            </button>

            {examId && (
              <button
                onClick={() => router.push(`/results?examId=${examId}`)}
                className="w-full px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition cursor-pointer"
              >
                View Results
              </button>
            )}
          </div>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 mt-6">
            You will be notified once your results are ready.
          </p>
        </div>
      </div>
    </div>
  );
}
