"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import styles from "./dashboard.module.css";
import LiveExamSkeleton from "@/components/skeletons/LiveExamSkeleton";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [liveExams, setLiveExams] = useState([]);
  const [loadingExams, setLoadingExams] = useState(false);
  const [upcomingExams, setUpcomingExams] = useState([]);

  useEffect(() => {
    fetchUserProfile();
    fetchLiveExams();
    fetchUpcomingExams();
  }, []);

  // Fetch user profile (stored for later use in profile page)
  const fetchUserProfile = async () => {
    try {
      const res = await apiFetch("/api/profile/me");
      if (res?.status === 200) {
        setUser(res.data);
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
    }
    finally{
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
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      {/* Top Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.navBrand}>
          <h2>AptiCrack</h2>
        </div>
        <div className={styles.navActions}>
          <button
            className={styles.navBtn}
            onClick={() => router.push("/profile")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Profile
          </button>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </nav>

      {/* Welcome Section */}
      <header className={styles.welcomeSection}>
        <div className={styles.welcomeContent}>
          <h1 className={styles.welcomeTitle}>
            Welcome back, {user?.fullName || "Candidate"}!
          </h1>
          <p className={styles.welcomeSubtitle}>
            Ready to practice? Check out the exams available below.
          </p>
        </div>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{background: '#e8f5e9'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2fa36b" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div>
              <p className={styles.statValue}>{liveExams.length}</p>
              <p className={styles.statLabel}>Live Exams</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{background: '#fff3e0'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f57c00" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <p className={styles.statValue}>{upcomingExams.length}</p>
              <p className={styles.statLabel}>Upcoming</p>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.mainContent}>
        {/* Live Exams Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrapper}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2fa36b" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" fill="#2fa36b" />
              </svg>
              <h2 className={styles.sectionTitle}>Live Exams</h2>
            </div>
            <span className={styles.badge}>{liveExams.length} Available</span>
          </div>

          {loadingExams?(
            <LiveExamSkeleton/>
          ):(
            liveExams.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#cbd5e0" strokeWidth="1.5">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              <p className={styles.emptyText}>No live exams available at the moment</p>
              <p className={styles.emptySubtext}>Check back later or browse upcoming exams</p>
            </div>
          ) : (
            <div className={styles.examGrid}>
              {liveExams.map((exam) => (
                <div key={exam.id} className={styles.examCard}>
                  <div className={styles.examHeader}>
                    <div className={styles.liveBadge}>
                      <span className={styles.liveDot}></span>
                      LIVE
                    </div>
                  </div>
                  <h3 className={styles.examName}>{exam.title}</h3>
                  <div className={styles.examDetails}>
                    <div className={styles.examDetail}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>{exam.durationMinutes} minutes</span>
                    </div>
                    {exam.totalQuestions && (
                      <div className={styles.examDetail}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                        <span>{exam.totalQuestions} questions</span>
                      </div>
                    )}
                  </div>
                  <button
                    className={styles.startBtn}
                    onClick={() => startExam(exam.id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    Start Exam
                  </button>
                </div>
              ))}
            </div>
          )
          )}
        </section>

        {/* Upcoming Exams Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrapper}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f57c00" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <h2 className={styles.sectionTitle}>Upcoming Exams</h2>
            </div>
            <span className={styles.badgeSecondary}>{upcomingExams.length} Scheduled</span>
          </div>

          {upcomingExams.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#cbd5e0" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <p className={styles.emptyText}>No upcoming exams scheduled</p>
            </div>
          ) : (
            <div className={styles.examGrid}>
              {upcomingExams.map((exam) => (
                <div key={exam.id} className={styles.examCardUpcoming}>
                  <div className={styles.examHeader}>
                    <div className={styles.upcomingBadge}>UPCOMING</div>
                  </div>
                  <h3 className={styles.examName}>{exam.title}</h3>
                  <div className={styles.examDetails}>
                    <div className={styles.examDetail}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>Starts: {new Date(exam.startTime).toLocaleString()}</span>
                    </div>
                    <div className={styles.examDetail}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v20M2 12h20" />
                      </svg>
                      <span>{exam.durationMinutes} minutes</span>
                    </div>
                  </div>
                  <button className={styles.disabledBtn} disabled>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Not Available Yet
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}