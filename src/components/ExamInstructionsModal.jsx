import { X, ChevronLeft, ChevronRight, Save, Send, Clock } from "lucide-react";

export default function ExamInstructionsModal({ isOpen, onClose, onConfirm, examTitle, isStarting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Before You Begin</h2>
            {examTitle && (
              <p className="text-sm text-gray-600 mt-1">{examTitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Introduction */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              Please read these instructions carefully before starting the exam. 
              Familiarize yourself with the navigation controls and exam interface.
            </p>
          </div>

          {/* Section 1: Question Navigation */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500 text-white text-sm font-bold">1</span>
              Question Navigation
            </h3>
            <div className="space-y-3 ml-9">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="font-medium text-gray-900 mb-2">Question Grid</p>
                <p className="text-sm text-gray-700 mb-3">
                  Use the question grid in the sidebar to jump directly to any question. 
                  Questions are color-coded to show their status:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-500" />
                    <span className="text-gray-700">Current question</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500" />
                    <span className="text-gray-700">Answered & saved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-yellow-500" />
                    <span className="text-gray-700">Selected (not saved)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-200" />
                    <span className="text-gray-700">Not answered</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-300 text-sm">
                  <ChevronLeft className="w-4 h-4 text-gray-700" />
                  <span className="text-gray-700 font-medium">Previous</span>
                  <span className="text-gray-500">- Navigate to previous question without saving</span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg text-sm" style={{ backgroundColor: "#75B06F", color: "white" }}>
                <Save className="w-4 h-4" />
                <span className="font-medium">Save & Next</span>
                <span className="opacity-90">- Saves answer and moves to next question instantly</span>
              </div>
            </div>
          </div>

          {/* Section 2: Answering Questions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-500 text-white text-sm font-bold">2</span>
              Answering Questions
            </h3>
            <div className="space-y-3 ml-9">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Click on an option to select it. The selected option will be highlighted.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>For <strong>multiple-correct questions</strong>, you can select more than one option using checkboxes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>For <strong>numerical questions</strong>, enter your answer in the input field provided.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Use the <strong>Clear</strong> button to remove your selected answer if needed.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Reviewing Questions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-yellow-500 text-white text-sm font-bold">3</span>
              Reviewing Questions
            </h3>
            <div className="space-y-3 ml-9">
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> There is currently no "Mark for Review" feature. 
                  You can navigate freely between questions using the question grid and return to any question before submitting the exam.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Timer */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-500 text-white text-sm font-bold">4</span>
              Timer
            </h3>
            <div className="space-y-3 ml-9">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <div className="text-lg font-mono font-semibold text-gray-900">
                      00:45:00
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">(Example timer display)</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>A countdown timer is displayed at the top of the page showing remaining time.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span><strong className="text-red-600">When time expires, the exam will automatically submit.</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>Manage your time wisely and keep track of the timer throughout the exam.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 5: Submitting */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-900 text-white text-sm font-bold">5</span>
              Submitting the Exam
            </h3>
            <div className="space-y-3 ml-9">
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="mb-3">
                  <button
                    disabled
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white"
                  >
                    <Send className="w-4 h-4" />
                    Submit
                  </button>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Click the <strong>Submit</strong> button to finalize and submit all your answers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span className="text-red-700 font-semibold">⚠️ Submission is final and cannot be undone. You will not be able to change your answers after submitting.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Review all your answers before submitting the exam.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 font-medium">
              <strong>💡 Important:</strong> All buttons shown in these instructions use the same colors, shapes, and styles as the actual exam interface to help you recognize them easily.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Make sure you understand all instructions before proceeding.
          </p>
          <button
            onClick={onConfirm}
            disabled={isStarting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium transition hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#75B06F" }}
          >
            {isStarting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Starting...
              </>
            ) : (
              'I Understand, Start Exam'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
