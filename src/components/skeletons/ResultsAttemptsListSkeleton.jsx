export default function ResultsAttemptsListSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-52 bg-gray-200 rounded" />
        <div className="h-7 w-24 bg-gray-200 rounded-full" />
      </div>

      {/* Attempts Cards */}
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-full p-5 rounded-lg border-2 border-gray-200 bg-white"
          >
            {/* Top Section */}
            <div className="flex items-start justify-between mb-3">
              {/* Left Side - Exam Info */}
              <div className="flex-1 space-y-3">
                {/* Exam Title */}
                <div className="space-y-2">
                  <div className="h-6 w-3/4 bg-gray-200 rounded" />
                  <div className="h-6 w-1/2 bg-gray-200 rounded" />
                </div>

                {/* Date and Duration */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-gray-200 rounded" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-gray-200 rounded" />
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>

              {/* Right Side - Status Badge */}
              <div className="flex flex-col items-end gap-2">
                <div className="h-8 w-28 bg-gray-200 rounded-full" />
              </div>
            </div>

            {/* Bottom Section - Score */}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex items-baseline gap-2">
                <div className="h-8 w-12 bg-gray-200 rounded" />
                <div className="h-5 w-16 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
