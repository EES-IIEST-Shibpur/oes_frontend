"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "../../lib/api";
import styles from "./verify-otp.module.css";

const RESEND_DELAY = 30;

export default function VerifyOTP() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOTPComponent />
    </Suspense>
  );
}

function VerifyOTPComponent() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [resendTimer, setResendTimer] = useState(RESEND_DELAY);
  const [resending, setResending] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiFetch("/api/verify-otp", {
        method: "POST",
        body: { email, otp },
      });

      if (res?.status === 200 && res?.data?.success) {
        router.push("/login?verified=true");
      } else {
        setError(res?.data?.message || "Invalid OTP");
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    setResending(true);
    setError(null);

    try {
      const res = await apiFetch("/api/resend-otp", {
        method: "POST",
        body: { email },
      });

      if (res?.status === 200 && res?.data?.success) {
        setResendTimer(RESEND_DELAY);
      } else {
        setError("Failed to resend OTP");
      }
    } catch {
      setError("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Verify OTP</h2>

        <p className={styles.info}>
          OTP sent to <strong>{email}</strong>
        </p>

        {error && <p className={styles.error}>{error}</p>}

        <input
          className={styles.input}
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          required
        />

        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>

        <div className={styles.resendBox}>
          {resendTimer > 0 ? (
            <span className={styles.timer}>Resend in {resendTimer}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className={styles.resendBtn}
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}