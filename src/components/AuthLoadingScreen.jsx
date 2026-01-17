/**
 * AuthLoadingScreen Component
 * A modern, minimal loading screen that follows the project's theme
 * Used for authentication loading states across the application
 */
export default function AuthLoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-[#E8F0DE] via-white to-[#DDE9C8]">
      <div className="text-center">
        {/* Animated Logo/Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-[#DDE9C8] rounded-full"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-transparent border-t-[#75B06F] rounded-full animate-spin"></div>
          </div>
          <div className="flex items-center justify-center w-20 h-20">
            <svg
              className="w-10 h-10 text-[#75B06F]"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-[#6B7F4D]">
            Loading...
          </h2>
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-2 h-2 bg-[#75B06F] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-[#75B06F] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-[#75B06F] rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
