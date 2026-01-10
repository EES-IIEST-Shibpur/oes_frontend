"use client";

import { useEffect, useState, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { Clock, FileText, Play, Lock, Calendar, Zap, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import { AuthContext } from "@/context/AuthContext";

export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);

  const [userData, setUserData] = useState(null);
  const [liveExams, setLiveExams] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [loadingAll, setLoadingAll] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoadingAll(true);
        await Promise.all([
          fetchUserProfile(),
          fetchLiveExams(),
          fetchUpcomingExams(),
        ]);
      } finally {
        setLoadingAll(false);
      }
    };
    fetchAll();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await apiFetch("/api/profile/me");
      if (res?.status === 200) {
        setUserData(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  const fetchLiveExams = async () => {
    try {
      setLoadingExams(true);
      const res = await apiFetch("/api/exam/live");
      if (res?.data?.success) {
        setLiveExams(res.data.exams || []);
      }
    } catch (err) {
      console.error("Failed to fetch live exams", err);
    } finally {
      setLoadingExams(false);
    }
  };

  const fetchUpcomingExams = async () => {
    try {
      const res = await apiFetch("/api/exam/upcoming");
      if (res?.data?.success) {
        setUpcomingExams(res.data.exams || []);
      }
    } catch (err) {
      console.error("Failed to fetch upcoming exams", err);
    }
  };

  const startExam = async (examId) => {
    const confirmed = window.confirm(
      "Are you sure you want to start the exam? Once started, the timer will begin immediately."
    );

    if (!confirmed) return;

    try {
      const res = await apiFetch(`/api/exam-attempt/${examId}/start`, {
        method: "POST",
      });

      if (res?.data?.success) {
        router.push(`/exam/${examId}`);
      } else {
        alert("Unable to start exam. Please try again.");
      }
    } catch (err) {
      console.error("Failed to start exam", err);
      alert("Failed to start exam.");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const userName = useMemo(
    () => userData?.fullName || user?.data?.fullName || "Candidate",
    [userData, user]
  );

  if (loadingAll) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <DashboardSkeleton />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Welcome Section */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {userName}
          </h1>
          <p className="text-gray-600">
            Manage and complete your exams efficiently
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="p-2.5 rounded-lg" style={{ backgroundColor: "var(--color-primary-light)" }}>
                <Zap className="w-5 h-5" style={{ color: "var(--color-primary-text)" }} />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">{liveExams.length}</p>
                <p className="text-sm text-gray-600">Live Exams</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="p-2.5 rounded-lg" style={{ backgroundColor: "var(--color-primary-light)" }}>
                <Calendar className="w-5 h-5" style={{ color: "var(--color-primary-text)" }} />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">{upcomingExams.length}</p>
                <p className="text-sm text-gray-600">Upcoming Exams</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Live Exams Section */}
        {loadingExams ? (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: "var(--color-primary)" }}></div>
              Live Exams
            </h2>
            <DashboardSkeleton />
          </div>
        ) : liveExams.length === 0 ? (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: "var(--color-primary)" }}></div>
              Live Exams
            </h2>
            <div className="text-center py-12 border border-gray-200 rounded-lg">
              <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No live exams available</p>
              <p className="text-sm text-gray-500 mt-1">Check back later for new exams</p>
            </div>
          </div>
        ) : (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: "var(--color-primary)" }}></div>
              Live Exams
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveExams.map((exam) => (
                <ExamCard 
                  key={exam.id} 
                  exam={exam} 
                  isLive={true}
                  onStart={startExam}
                />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Exams Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: "var(--color-primary)" }}></div>
            Upcoming Exams
          </h2>

          {upcomingExams.length === 0 ? (
            <div className="text-center py-12 border border-gray-200 rounded-lg">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No upcoming exams scheduled</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <div className="border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all flex flex-col overflow-hidden">
      {/* Badge */}
      <div className="px-6 pt-6 pb-0">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium w-fit ${
          isLive 
            ? "bg-blue-50 text-blue-700" 
            : "bg-gray-100 text-gray-700"
        }`}>
          <span className={`w-2 h-2 rounded-full ${isLive ? "bg-blue-600" : "bg-gray-400"}`}></span>
          {isLive ? "LIVE" : "UPCOMING"}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pt-4 pb-6 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 line-clamp-2">{exam.title}</h3>
        
        {/* Details */}
        <div className="space-y-2.5 mb-6 flex-1">
          {exam.durationMinutes && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{exam.durationMinutes} minutes</span>
            </div>
          )}
          
          {exam.totalQuestions && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FileText className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{exam.totalQuestions} questions</span>
            </div>
          )}

          {!isLive && exam.startTime && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{formatDate(exam.startTime)}</span>
            </div>
          )}
        </div>

        {/* Button */}
        {isLive ? (
          <button
            onClick={() => onStart(exam.id)}
            style={{ backgroundColor: "var(--color-primary)" }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-900 hover:opacity-85 transition-opacity active:scale-95"
          >
            <Play className="w-4 h-4" />
            Start Exam
          </button>
        ) : (
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
          >
            <Lock className="w-4 h-4" />
            Not Available
          </button>
        )}
      </div>
    </div>
  );
}