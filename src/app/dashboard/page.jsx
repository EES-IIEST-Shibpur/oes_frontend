"use client";

import { useContext, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile, useLiveExams, useUpcomingExams } from "@/hooks/useApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import ExamInstructionsModal from "@/components/ExamInstructionsModal";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsBar from "@/components/dashboard/StatsBar";
import ExamSection from "@/components/dashboard/ExamSection";
import AuthLoadingScreen from "@/components/AuthLoadingScreen";
import { AuthContext } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

export default function Dashboard() {
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading: authLoading } = useContext(AuthContext);

  const { data: profileData, isLoading: profileLoading } = useProfile();
  const { data: liveExamsData, isLoading: liveLoading } = useLiveExams();
  const { data: upcomingExamsData, isLoading: upcomingLoading } = useUpcomingExams();

  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isStarting, setIsStarting] = useState(false);

  // Ensure hooks are always called in the same order
  const userData = profileData?.data;
  const userName = userData?.data?.fullName || user?.data?.fullName || "Candidate";


  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading while checking authentication
  if (authLoading) {
    return <AuthLoadingScreen />;
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const startExam = async (examId, examTitle) => {
    setSelectedExam({ id: examId, title: examTitle });
    setShowInstructionsModal(true);
  };

  const handleConfirmStart = async () => {
    if (!selectedExam || isStarting) return;
    
    setIsStarting(true);

    try {
      const res = await apiFetch(
        `/api/exam-attempt/${selectedExam.id}/start`,
        {
          method: "POST",
        }
      );

      if (res.ok && res.data?.success) {
        setShowInstructionsModal(false);
        router.push(`/exam/${selectedExam.id}`);
      } else {
        alert("Unable to start exam. Please try again.");
        setShowInstructionsModal(false);
        setIsStarting(false);
      }
    } catch (err) {
      console.error("Failed to start exam", err);
      alert("Failed to start exam.");
      setShowInstructionsModal(false);
      setIsStarting(false);
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
  const liveExams = liveExamsData?.data?.exams || [];
  const upcomingExams = upcomingExamsData?.data?.exams || [];
  const isLoading = profileLoading || liveLoading || upcomingLoading;

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
        isStarting={isStarting}
      />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        <DashboardHeader userName={userName} />
        <StatsBar liveCount={liveExams.length} upcomingCount={upcomingExams.length} />

        <ExamSection
          title="Live Exams"
          exams={liveExams}
          isLoading={liveLoading}
          emptyMessage="No live exams"
          emptySubtitle="Check back later"
          onExamAction={(examId, examTitle) => {
            const exam = liveExams.find((e) => e.id === examId);
            if (exam?.hasAttempt && exam?.attemptStatus === "IN_PROGRESS") {
              resumeExam(examId);
            } else {
              startExam(examId, examTitle);
            }
          }}
        />

        <ExamSection
          title="Upcoming Exams"
          exams={upcomingExams}
          isLoading={upcomingLoading}
          emptyMessage="No upcoming exams"
          emptySubtitle="All caught up"
        />
      </div>

      <Footer />
    </div>
  );
}