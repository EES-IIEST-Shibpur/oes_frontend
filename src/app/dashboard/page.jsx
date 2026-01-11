"use client";

import { useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile, useLiveExams, useUpcomingExams } from "@/hooks/useApi";
import { Clock, FileText, Play, Lock, Calendar, Zap, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import ExamInstructionsModal from "@/components/ExamInstructionsModal";
import { AuthContext } from "@/context/AuthContext";

export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);

  const { data: profileData, isLoading: profileLoading } = useProfile();
  const { data: liveExamsData, isLoading: liveLoading } = useLiveExams();
  const { data: upcomingExamsData, isLoading: upcomingLoading } = useUpcomingExams();

  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const startExam = async (examId, examTitle) => {
    setSelectedExam({ id: examId, title: examTitle });
    setShowInstructionsModal(true);
  };

  const handleConfirmStart = async () => {
    if (!selectedExam) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exam-attempt/${selectedExam.id}/start`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setShowInstructionsModal(false);
          router.push(`/exam/${selectedExam.id}`);
        } else {
          alert("Unable to start exam. Please try again.");
          setShowInstructionsModal(false);
        }
      }
    } catch (err) {
      console.error("Failed to start exam", err);
      alert("Failed to start exam.");
      setShowInstructionsModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowInstructionsModal(false);
    setSelectedExam(null);
  };

  const resumeExam = (examId) => {
    router.push(`/exam/${examId}`);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const userData = profileData?.data;
  const liveExams = liveExamsData?.data?.exams || [];
  const upcomingExams = upcomingExamsData?.data?.exams || [];
  const isLoading = profileLoading || liveLoading || upcomingLoading;

  const userName = useMemo(
    () => userData?.fullName || user?.data?.fullName || "Candidate",
    [userData, user]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <DashboardSkeleton />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-gray-50 to-gray-100">
      <Navbar />

      {/* Instructions Modal */}
      <ExamInstructionsModal
        isOpen={showInstructionsModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmStart}
        examTitle={selectedExam?.title}
      />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {userName}'s Dashboard
          </h1>
          <p className="text-gray-500 text-sm">View and manage your exams</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-gray-900 mb-1">{liveExams.length}</div>
            <div className="text-sm text-gray-500">Live Exams</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-gray-900 mb-1">{upcomingExams.length}</div>
            <div className="text-sm text-gray-500">Upcoming</div>
          </div>
        </div>

        {/* Live Exams */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Live Exams
          </h2>

          {liveLoading ? (
            <DashboardSkeleton />
          ) : liveExams.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <div className="text-gray-400 mb-2">No live exams</div>
              <p className="text-sm text-gray-500">Check back later</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveExams.map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  isLive={true}
                  onStart={exam.hasAttempt && exam.attemptStatus === "IN_PROGRESS" ? resumeExam : startExam}
                />
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Exams */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Upcoming Exams
          </h2>

          {upcomingExams.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <div className="text-gray-400 mb-2">No upcoming exams</div>
              <p className="text-sm text-gray-500">All caught up</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingExams.map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  isLive={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

function ExamCard({ exam, isLive, onStart }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Title */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{exam.title}</h3>
        <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${isLive
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-600"
          }`}>
          {isLive ? "Live" : "Upcoming"}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-5 text-sm text-gray-600">
        {exam.durationMinutes && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{exam.durationMinutes} min</span>
          </div>
        )}

        {exam.totalQuestions && (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>{exam.totalQuestions} questions</span>
          </div>
        )}

        {exam.startTime && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Start: {formatDate(exam.startTime)}</span>
          </div>
        )}

        {exam.endTime && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>End: {formatDate(exam.endTime)}</span>
          </div>
        )}
      </div>

      {/* Action */}
      {isLive ? (
        exam.hasAttempt ? (
          exam.attemptStatus === "IN_PROGRESS" ? (
            <button
              onClick={() => onStart(exam.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "#75B06F" }}
            >
              <Play className="w-4 h-4" />
              Resume Exam
            </button>
          ) : (
            <button
              disabled
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-200 text-gray-500 cursor-not-allowed"
            >
              <FileText className="w-4 h-4" />
              Already Attempted
            </button>
          )
        ) : (
          <button
            onClick={() => onStart(exam.id, exam.title)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: "#75B06F" }}
          >
            <Play className="w-4 h-4" />
            Start Exam
          </button>
        )
      ) : (
        <button
          disabled
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
        >
          <Lock className="w-4 h-4" />
          Locked
        </button>
      )}
    </div>
  );
}