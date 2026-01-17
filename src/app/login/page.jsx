"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { Mail, Key, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthContext } from "@/context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Only redirect if auth check is complete and user is authenticated
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return null; // or return a loading spinner
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
        skipAuthRedirect: true,
      });

      if (res?.status === 200 && res?.data?.user) {
        // Use user data from login response
        const userData = res.data.user;
        
        // Cookie is automatically set by backend, just update context
        login(userData);
        router.push("/dashboard");
      } else {
        // Display backend error message if available
        const errorMessage = res?.data?.message || "Login failed. Please try again.";
        setError(errorMessage);
      }
    } catch (err) {
      // Handle network errors or other issues
      const errorMessage = err?.message || "Login failed. Please check your connection and try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-6 py-20">
        {/* Back Button */}
        <div className="absolute top-20 left-4">
          <button
            onClick={() => router.push('/')}
            className="mb-4 text-sm underline text-gray-700"
          >
            <ArrowLeft/>
          </button>

        </div>
        <form
          onSubmit={handleSubmit}
          autoComplete="on"
          className="w-full max-w-sm bg-white border rounded-xl shadow p-8 space-y-5"
        >
          {/* <Image src="/images/EES_Logo.png" alt="Welcome Image" width={100} height={50} /> */}
          <h2 className="text-2xl font-semibold text-center">Welcome Back</h2>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 text-center">
              {error}
            </p>
          )}

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm text-gray-700">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                autoComplete="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm text-gray-700">Password</label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                autoComplete="current-password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: "var(--color-primary)" }}
            className="w-full text-sm font-medium rounded-lg py-2 transition text-gray-900 cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="flex justify-between text-xs text-gray-600">
            <a href="/signup" className="underline hover:text-gray-900">Sign up</a>
            <a href="/forgot-password" className="underline hover:text-gray-900">Forgot password?</a>
          </div>
        </form>
      </div>

    </main>
  );
}