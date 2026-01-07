"use client";

import { useRouter } from "next/navigation";
import styles from "./home.module.css";

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.logo}>AptiCrack</h1>
        <div className={styles.actions}>
          <button onClick={() => router.push("/login")} className={styles.outlineBtn}>
            Login
          </button>
          <button onClick={() => router.push("/signup")} className={styles.primaryBtn}>
            Signup
          </button>
        </div>
      </header>

      <main className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>Trusted by 1000+ Students</div>
          <h2 className={styles.title}>Master Your Aptitude Tests with AptiCrack</h2>
          <p className={styles.subtitle}>
            Practice and ace your placement exams with our comprehensive online testing platform. 
            Real exam environment, instant feedback, and detailed performance analytics.
          </p>

          <div className={styles.cta}>
            <button className={styles.primaryBtn} onClick={() => router.push("/signup")}>
              Start Practicing Free
            </button>
            <button className={styles.outlineBtn} onClick={() => router.push("/login")}>
              Login to Continue
            </button>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <strong>500+</strong>
              <span>Practice Questions</span>
            </div>
            <div className={styles.stat}>
              <strong>50+</strong>
              <span>Mock Tests</span>
            </div>
            <div className={styles.stat}>
              <strong>95%</strong>
              <span>Success Rate</span>
            </div>
          </div>
        </div>
      </main>

      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2>Why Choose AptiCrack?</h2>
          <p>Everything you need to excel in your placement exams</p>
        </div>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.icon}></div>
            <h3>Real-Time Testing</h3>
            <p>Experience actual exam conditions with accurate timers and auto-submission features.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.icon}></div>
            <h3>Detailed Analytics</h3>
            <p>Get comprehensive performance reports with section-wise and question-wise breakdowns.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.icon}></div>
            <h3>Secure Platform</h3>
            <p>JWT-based authentication ensures your data and progress are always protected.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.icon}></div>
            <h3>Practice Anywhere</h3>
            <p>Access your tests on any device - desktop, tablet, or mobile. Practice on the go.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.icon}></div>
            <h3>Topic-Wise Tests</h3>
            <p>Focus on specific areas like quantitative, logical reasoning, and verbal ability.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.icon}></div>
            <h3>Instant Results</h3>
            <p>View your scores immediately after submission with correct answers and explanations.</p>
          </div>
        </div>
      </section>

      <section className={styles.howItWorks}>
        <h2>How It Works</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Sign Up</h3>
            <p>Create your free account in seconds</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Choose Test</h3>
            <p>Select from various mock tests or practice questions</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Take Exam</h3>
            <p>Attempt the test in a real exam environment</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <h3>Analyze Results</h3>
            <p>Review detailed performance analytics and improve</p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>AptiCrack</h4>
            <p>Empowering students to excel in aptitude assessments for internships and placements.</p>
          </div>

          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/tests">Browse Tests</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4>Contact</h4>
            <p>Email: <a href="mailto:contact@eesiiests.org">contact@eesiiests.org</a></p>
            <p>Developer: <a href="mailto:aminulislam@eesiiests.org">aminulislam@eesiiests.org</a></p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>Developed by Aminul Islam, Head Web Developer, Electrical Engineers' Society, IIEST Shibpur</p>
          <p className={styles.copy}>© {new Date().getFullYear()} Electrical Engineers' Society, IIEST Shibpur. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}