"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { User, Mail, Key } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-6 py-20">
        <form 
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-white border rounded-xl shadow p-8 space-y-5"
        >
          <h2 className="text-2xl font-semibold text-center">Create Account</h2>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 text-center">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded px-3 py-2 text-center">
              {success}
            </p>
          )}

          {!success && (
            <>
              <div className="space-y-1">
                <label className="text-sm text-gray-700">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    placeholder="Enter your full name"
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-700">Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: "var(--color-primary)" }}
                className="w-full text-sm font-medium rounded-lg py-2 transition text-gray-900 hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Signup"}
              </button>
            </>
          )}

          <div className="text-center text-xs text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="underline hover:text-gray-900">
              Login
            </a>
          </div>
        </form>
      </div>

      <Footer />
    </main>
  );
}