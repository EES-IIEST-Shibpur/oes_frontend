"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { ArrowLeft, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await apiFetch("/api/auth/forgot-password", {
                method: "POST",
                body: { email },
            });

            if (res?.status === 200) {
                sessionStorage.setItem("resetEmail", email);
                setSent(true);
                router.push("/reset-password");
            } else {
                setError(res?.data?.message || "Failed to send reset email.");
            }
        } catch (err) {
            setError("Request failed.");
        }
    };

    return (
        <main className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            
            <div className="flex flex-1 items-center justify-center px-6 py-20">
                <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border rounded-xl shadow p-8 space-y-5">
                    <h2 className="text-lg font-semibold text-center">Forgot Password</h2>

                    {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 text-center">{error}</p>}

                    <p className="text-xs text-gray-600 text-center">Enter your registered email.</p>

                    <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                        <input
                            type="email"
                            required
                            placeholder="Email"
                            className="w-full pl-10 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)]"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button type="submit" style={{ backgroundColor: "var(--color-primary)" }} className="w-full text-sm font-medium rounded-lg py-2 text-gray-900">
                        Send OTP
                    </button>
                </form>
            </div>
            
            <Footer />
        </main>
    );
}