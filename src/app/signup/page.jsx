"use client";

import { useState, useEffect } from "react";
import { useSignup, useResendVerification } from "@/hooks/useApi";
import { User, Mail, Key } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RESEND_COOLDOWN = 30; // seconds

export default function Signup() {
  const signupMutation = useSignup();
  const resendVerificationMutation = useResendVerification();

  const [fullName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [registeredEmail, setRegisteredEmail] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [cooldown, setCooldown] = useState(0);
  const [autoResent, setAutoResent] = useState(false);

  // ⏱ Countdown timer logic
  useEffect(() => {
    if (cooldown === 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const startCooldown = () => setCooldown(RESEND_COOLDOWN);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!fullName.trim()) return setError("Full name is required");
    if (fullName.trim().length < 3)
      return setError("Full name must be at least 3 characters");
    if (!email.trim()) return setError("Email is required");
    if (!email.includes("@")) return setError("Invalid email");
    if (!password || password.length < 6)
      return setError("Password must be at least 6 characters");

    try {
      // 1️⃣ Signup
      await signupMutation.mutateAsync({
        fullName,
        email,
        password,
      });

      // 2️⃣ Auto resend ONCE (backend workaround)
      if (!autoResent) {
        setAutoResent(true);
        try {
          await resendVerificationMutation.mutateAsync({ email });
          startCooldown();
        } catch {}
      }

      setRegisteredEmail(email);
      setSuccess(
        "Signup successful! Please check your email to verify your account. " +
        "After verification, you can sign in."
      );

      setName("");
      setPassword("");
    } catch (err) {
      // 409 → existing user → resend instead
      if (err?.response?.status === 409) {
        if (!autoResent) {
          setAutoResent(true);
          try {
            await resendVerificationMutation.mutateAsync({ email });
            startCooldown();
          } catch {}
        }

        setRegisteredEmail(email);
        setSuccess(
          "An account with this email already exists. " +
          "We’ve resent the verification email."
        );
        return;
      }

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Signup failed"
      );
    }
  };

  const handleResendVerification = async () => {
    if (cooldown > 0) return;

    setError(null);
    try {
      await resendVerificationMutation.mutateAsync({
        email: registeredEmail,
      });
      setSuccess(
        "Verification email resent. Please check your inbox or spam."
      );
      startCooldown();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to resend verification email"
      );
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
          <h2 className="text-2xl font-semibold text-center">
            Create Account
          </h2>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border rounded px-3 py-2 text-center">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-green-600 bg-green-50 border rounded px-3 py-2 text-center">
              {success}
            </p>
          )}

          {!success && (
            <>
              <div>
                <label className="text-sm">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                  <input
                    value={fullName}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm">Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={signupMutation.isPending}
                style={{ backgroundColor: "var(--color-primary)" }}
                className="w-full py-2 rounded-lg text-sm font-medium"
              >
                {signupMutation.isPending ? "Submitting..." : "Signup"}
              </button>
            </>
          )}

          {success && (
            <>
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={cooldown > 0 || resendVerificationMutation.isPending}
                style={{ backgroundColor: "var(--color-primary)" }}
                className="w-full py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : resendVerificationMutation.isPending
                  ? "Resending..."
                  : "Resend Verification Email"}
              </button>
            </>
          )}

          <p className="text-xs text-center">
            Already have an account?{" "}
            <a href="/login" className="underline">
              Login
            </a>
          </p>
        </form>
      </div>

      <Footer />
    </main>
  );
}
