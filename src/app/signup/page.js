"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import styles from "./signup.module.css";

export default function Signup() {
  const router = useRouter();
  const [fullName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await apiFetch("/api/auth/signup", {
        method: "POST",
        body: { fullName, email, password }
      });

      if (res?.status === 200 && res?.data?.success) {
        setSuccess(
          "A verification email has been sent to your registered email address. " +
          "Please verify your email to activate your account. " +
          "If you don’t see the email, check your spam or junk folder."
        );
      } else {
        setError(res?.data?.message || "Signup failed");
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Create Account</h2>

        {error && <p className={styles.error}>{error}</p>}

        {success && <p className={styles.success}>{success}</p>}

        {!success && (
          <>
            <input
              className={styles.input}
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              className={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Signup"}
            </button>
          </>
        )}

        <p className={styles.footerText}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}