/**
 * GlobalLoadingScreen Component
 * Displayed during page refresh and initial load
 */
export default function GlobalLoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <img 
            src="/images/AptiCrack_Logo.png" 
            alt="AptiCrack Logo" 
            className="h-24 w-24 object-contain"
          />
        </div>

        {/* Loading Text */}
        <h2 className="text-xl font-semibold text-gray-900">
          AptiCrack is Loading
        </h2>
      </div>
    </div>
  );
}
