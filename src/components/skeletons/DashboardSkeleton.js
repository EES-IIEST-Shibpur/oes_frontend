export default function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="border border-gray-200 rounded-lg overflow-hidden animate-pulse"
        >
          {/* Badge Skeleton */}
          <div className="px-6 pt-6 pb-0">
            <div className="h-6 w-16 bg-gray-200 rounded" />
          </div>

          {/* Content Skeleton */}
          <div className="px-6 pt-4 pb-6 flex flex-col">
            {/* Title */}
            <div className="space-y-2 mb-4">
              <div className="h-5 bg-gray-200 rounded" />
              <div className="h-5 w-3/4 bg-gray-200 rounded" />
            </div>

            {/* Details */}
            <div className="space-y-2.5 mb-6 flex-1">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-40 bg-gray-200 rounded" />
              <div className="h-4 w-36 bg-gray-200 rounded" />
            </div>

            {/* Button */}
            <div className="h-10 bg-gray-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
