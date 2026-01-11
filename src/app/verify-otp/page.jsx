"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyOtp, useResendOtp } from "@/hooks/useApi";
import { Mail, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);

  const [resendTimer, setResendTimer] = useState(RESEND_DELAY);

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

    try {
      const res = await verifyOtpMutation.mutateAsync({ email, otp });

      if (res?.status === 200 && res?.data?.success) {
        router.push("/login?verified=true");
      } else {
        setError(res?.data?.message || "Invalid OTP");
      }
    } catch {
      setError("Verification failed. Please try again.");
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    setError(null);

    try {
      const res = await resendOtpMutation.mutateAsync({ email });

      if (res?.status === 200 && res?.data?.success) {
        setResendTimer(RESEND_DELAY);
      } else {
        setError("Failed to resend OTP");
      }
    } catch {
      setError("Failed to resend OTP");
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex flex-1 items-center justify-center px-6 py-20">
        <form 
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-white border rounded-xl shadow p-8 space-y-5"
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-[var(--color-primary-text)]" />
            </div>
            <h2 className="text-2xl font-semibold">Verify OTP</h2>
          </div>

          <p className="text-center text-sm text-gray-600">
            OTP sent to <strong>{email}</strong>
          </p>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 text-center">
              {error}
            </p>
          )}

          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
            className="w-full rounded-lg border px-3 py-2 text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />

          <button
            type="submit"
            disabled={verifyOtpMutation.isPending}
            style={{ backgroundColor: "var(--color-primary)" }}
            className="w-full text-sm font-medium rounded-lg py-2 transition text-gray-900 hover:opacity-90 disabled:opacity-50"
          >
            {verifyOtpMutation.isPending ? "Verifying..." : "Verify"}
          </button>

          <div className="text-center">
            {resendTimer > 0 ? (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Resend in {resendTimer}s</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendOtpMutation.isPending}
                className="text-sm text-[var(--color-primary-text)] hover:underline disabled:opacity-50"
              >
                {resendOtpMutation.isPending ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </div>
        </form>
      </div>
      
      <Footer />
    </main>
  );
}