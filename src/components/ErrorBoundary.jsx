"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ErrorBoundary({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    // Log error to console
    console.error("Error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-red-200">
          {/* Error Icon */}
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-6">
            {error?.message || "An unexpected error occurred. Please try again."}
          </p>

          {/* Error Details */}
          {process.env.NODE_ENV === "development" && error?.stack && (
            <details className="text-left bg-gray-100 rounded-lg p-4 mb-6 text-xs text-gray-700 max-h-40 overflow-auto">
              <summary className="cursor-pointer font-semibold text-gray-900 mb-2">
                Error Details (Development Only)
              </summary>
              <pre className="whitespace-pre-wrap break-all">
                {error.stack}
              </pre>
            </details>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-gray-500 mt-6">
            If this problem persists, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
