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

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-20 pb-28 bg-linear-to-b from-(var(--color-primary-light)) via-white to-gray-50">
        <div className="max-w-3xl">
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
              className="px-5 py-3 rounded-lg bg-(var(--color-primary)) text-white text-sm font-medium hover:bg-(var(--color-primary-hover)) transition"
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
          <div className="bg-white rounded-xl shadow-md p-6 border">
            <h4 className="text-lg font-semibold mb-2">Weekly Aptitude Sessions</h4>
            <p className="text-gray-600">
              Conducted every Saturday to help students prepare consistently and track improvement. 
              Focus areas include:
            </p>
            <ul className="mt-3 space-y-2 text-gray-700 text-sm list-disc list-inside">
              <li>Quantitative Aptitude</li>
              <li>Logical Reasoning</li>
              <li>Analytical Problem Solving</li>
              <li>Verbal & Interpretation</li>
            </ul>
            <p className="mt-3 text-gray-600">
              Top performers are recognized and appreciated for their achievements.
            </p>
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
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <Step number="01" title="Sign Up" text="Create your account and get access to the platform." />
          <Step number="02" title="Choose Test" text="Select from weekly sessions or topic-based practice tests." />
          <Step number="03" title="Take Exam" text="Attempt under real timed conditions with controlled environment." />
          <Step number="04" title="Analyze Results" text="Review analytics and improve with consistent practice." />
        </div>
      </section>

      <Footer />
    </main>
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

function Step({ number, title, text }) {
  return (
    <div>
      <div className="text-3xl font-bold text-(var(--color-primary)) mb-1">{number}</div>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );
}
