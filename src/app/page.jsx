"use client";

import { useRouter } from "next/navigation";
import {
  BarChart2,
  Timer,
  Shield,
  BookOpen,
  Award,
  BookmarkCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeLeaderboard from "@/components/HomeLeaderboard";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col min-h-screen bg-[#ECFAE5] from-blue-50 via-white to-green-50 text-gray-900">
      <Navbar />

      {/* LEADERBOARD */}
      <HomeLeaderboard />

      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-20 pb-28 bg-linear-to-b from-(var(--color-primary-light)) via-white to-gray-50 overflow-hidden">
        {/* Background Illustration */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <svg className="absolute top-10 right-10 w-64 h-64" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="80" stroke="#75B06F" strokeWidth="2" opacity="0.3"/>
            <path d="M100 40 Q150 70 150 130 Q100 160 50 130 Q50 70 100 40Z" fill="#C5D89D" opacity="0.2"/>
          </svg>
          <svg className="absolute bottom-10 left-10 w-48 h-48" viewBox="0 0 200 200" fill="none">
            <rect x="20" y="20" width="160" height="160" stroke="#75B06F" strokeWidth="2" opacity="0.3" rx="20"/>
            <circle cx="100" cy="100" r="40" fill="#DDE9C8" opacity="0.2"/>
          </svg>
        </div>

        <div className="max-w-3xl relative z-10">
          <div className="mb-3 inline-block bg-(var(--color-primary-soft)) text-(var(--color-primary-text)) text-xs font-medium px-3 py-1 rounded-full">
            Weekly aptitude test series for placements & exams
          </div>

          <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
            Strengthen Your Aptitude Skills With AptiCrack
          </h2>

          <p className="mt-4 text-gray-600 max-w-xl mx-auto">
            Designed to enhance quantitative ability, logical reasoning, and analytical thinking.
            Ideal for campus placements, competitive exams, and technical screenings.
          </p>

          <div className="mt-6 flex gap-3 justify-center">
            <button
              onClick={() => router.push("/signup")}
              className="px-5 py-3 rounded-lg bg-[#75B06F] text-white text-sm font-medium hover:bg-(var(--color-primary-hover)) transition"
            >
              Start Free Practice
            </button>
            <button
              onClick={() => router.push("/login")}
              className="px-5 py-3 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 transition"
            >
              Login to Continue
            </button>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="max-w-6xl mx-auto px-6 mt-12">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-3">What is AptiCrack</h3>
            <p className="text-gray-600 leading-relaxed">
              AptiCrack is focused on improving students' core aptitude skills including quantitative ability,
              logical reasoning, and analytical thinking. These skills are essential for campus placements,
              competitive exams, and internship assessments.
            </p>
            <p className="mt-3 text-gray-600 leading-relaxed">
              The sessions are structured with increasing difficulty under timed environments, encouraging
              competitive participation across year groups.
            </p>
          </div>
          <div className="relative">
            {/* Illustration */}
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8 min-h-80 flex items-center justify-center relative overflow-hidden">
              <svg className="w-full h-full absolute inset-0" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Brain icon - representing thinking */}
                <circle cx="150" cy="80" r="40" fill="#75B06F" opacity="0.2"/>
                <path d="M120 60Q100 50 90 70Q85 90 100 100Q120 110 150 100Q180 110 200 100Q215 90 210 70Q200 50 180 60" fill="#75B06F" opacity="0.3"/>
                
                {/* Books/Learning stack */}
                <rect x="80" y="140" width="140" height="15" fill="#C5D89D" rx="3"/>
                <rect x="70" y="160" width="160" height="15" fill="#B3C788" opacity="0.7" rx="3"/>
                <rect x="60" y="180" width="180" height="15" fill="#9CBF5C" opacity="0.5" rx="3"/>
                
                {/* Rocket - growth */}
                <path d="M150 220L140 250L150 240L160 250Z" fill="#75B06F" opacity="0.4"/>
                <circle cx="150" cy="215" r="8" fill="#75B06F" opacity="0.4"/>
              </svg>
              <div className="relative z-10 text-center">
                <BookOpen className="w-20 h-20 text-green-600 mx-auto mb-4 opacity-80" />
                <p className="text-green-700 font-semibold">Learn & Grow</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mt-20 bg-white border-t py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-semibold text-center mb-10">Platform Features</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Feature icon={Timer} title="Timed Assessments" text="Real exam-like environment with timers and auto-submission logic." />
            <Feature icon={BarChart2} title="Detailed Analytics" text="Performance tracking, section-wise scores, and insights over time." />
            <Feature icon={Shield} title="Secure Platform" text="JWT-based authentication and protected exam workflows." />
            <Feature icon={BookOpen} title="Topic-wise Tests" text="Focus on specific sections to strengthen weak areas." />
            <Feature icon={BookmarkCheck} title="Practice Library" text="Curated question bank for internships, placements, and exams." />
            <Feature icon={Award} title="Recognition" text="Top performers are highlighted and appreciated." />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h3 className="text-2xl font-semibold text-center mb-10">How It Works</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Step number="01" title="Sign Up" text="Create your account and get access to the platform." icon={UserSetupIcon} />
          <Step number="02" title="Choose Test" text="Select from weekly sessions or topic-based practice tests." icon={ChooseTestIcon} />
          <Step number="03" title="Take Exam" text="Attempt under real timed conditions with controlled environment." icon={TakeExamIcon} />
          <Step number="04" title="Analyze Results" text="Review analytics and improve with consistent practice." icon={AnalyzeIcon} />
        </div>
      </section>

      <Footer />
    </main>
  );
}

// User Setup Icon
function UserSetupIcon() {
  return (
    <svg className="w-12 h-12 mx-auto mb-3 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 6l3 3m0 0l-3 3m3-3H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Choose Test Icon
function ChooseTestIcon() {
  return (
    <svg className="w-12 h-12 mx-auto mb-3 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M9 11h6M9 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M7 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// Take Exam Icon
function TakeExamIcon() {
  return (
    <svg className="w-12 h-12 mx-auto mb-3 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 7v5l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Analyze Results Icon
function AnalyzeIcon() {
  return (
    <svg className="w-12 h-12 mx-auto mb-3 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 13h6v8H3zM11 7h6v14h-6zM19 3h2v18h-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 21h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function Feature({ icon: Icon, title, text }) {
  return (
    <div className="p-5 bg-gray-50 rounded-xl border hover:shadow-md transition">
      <Icon className="w-6 h-6 mb-3 text-(var(--color-primary))" />
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );
}

function Step({ number, title, text, icon: Icon }) {
  return (
    <div className="text-center">
      <Icon />
      <div className="text-3xl font-bold text-(var(--color-primary)) mb-1">{number}</div>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );
}
