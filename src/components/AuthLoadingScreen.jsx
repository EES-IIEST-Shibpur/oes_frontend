/**
 * AuthLoadingScreen Component
 * A modern, minimal loading screen that follows the project's theme
 * Used for authentication loading states across the application
 */
export default function AuthLoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-[#E8F0DE] via-white to-[#DDE9C8]">
      <div className="text-center">
        {/* Logo with spinning ring */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <img 
              src="/images/AptiCrack_Logo.png" 
              alt="AptiCrack Logo" 
              className="h-20 w-20 object-contain"
            />
            {/* Spinning ring around logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 border-4 border-transparent border-t-[#75B06F] rounded-full animate-spin"></div>
            </div>
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
