export default function ResultsContentSkeleton() {
  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
      {/* Back Button Skeleton */}
      <div className="mb-6 animate-pulse">
        <div className="h-10 w-40 bg-gray-200 rounded" />
      </div>

      {/* Main Result Card Skeleton */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 animate-pulse">
        {/* Score Card Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-8 py-12 text-center">
          {/* Status Badge */}
          <div className="flex justify-center mb-4">
            <div className="h-6 w-24 bg-gray-200 rounded-full" />
          </div>

          {/* Score Circle */}
          <div className="flex justify-center mb-6">
            <div className="h-40 w-40 bg-gray-200 rounded-full" />
          </div>

          {/* Title */}
          <div className="flex justify-center mb-2">
            <div className="h-8 w-48 bg-gray-200 rounded" />
          </div>

          {/* Subtitle */}
          <div className="flex justify-center">
            <div className="h-5 w-64 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Details Section */}
        <div className="px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-center mb-2">
                  <div className="h-6 w-6 bg-gray-200 rounded" />
                </div>
                <div className="flex justify-center mb-1">
                  <div className="h-8 w-16 bg-gray-200 rounded" />
                </div>
                <div className="flex justify-center">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Actions Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-11 w-40 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Answers Section Skeleton */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div className="h-6 w-48 bg-blue-400 rounded" />
        </div>

        {/* Answer Cards */}
        <div className="p-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg p-6 space-y-4"
            >
              {/* Question Number and Status */}
              <div className="flex justify-between items-start mb-3">
                <div className="h-5 w-32 bg-gray-200 rounded" />
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
              </div>

              {/* Options */}
              <div className="space-y-3 mt-4">
                {[...Array(4)].map((_, j) => (
                  <div
                    key={j}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="h-5 w-5 bg-gray-200 rounded-full flex-shrink-0" />
                    <div className="h-4 flex-1 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>

              {/* Explanation */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-200 rounded" />
                  <div className="h-3 w-4/5 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
