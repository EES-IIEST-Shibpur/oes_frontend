"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { ArrowLeft, Key } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ResetPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const storedEmail = sessionStorage.getItem("resetEmail");
        if (!storedEmail) router.replace("/forgot-password");
        else setEmail(storedEmail);
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        try {
            const res = await apiFetch("/api/auth/reset-password", {
                method: "POST",
                body: { email, otp, newPassword },
            });

            if (res?.status === 200) {
                sessionStorage.removeItem("resetEmail");
                router.push("/login");
            } else {
                setError(res?.data?.message || "Reset failed.");
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
                    <h2 className="text-lg font-semibold text-center">Reset Password</h2>

                    {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 text-center">{error}</p>}

                    <p className="text-xs text-center text-gray-600">OTP sent to {email}</p>

                    <input
                        type="text"
                        placeholder="Enter OTP"
                        required
                        className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)]"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />

                    <div className="relative">
                        <Key className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                        <input
                            type="password"
                            required
                            placeholder="New Password"
                            className="w-full pl-10 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)]"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" style={{ backgroundColor: "var(--color-primary)" }} className="w-full text-sm font-medium rounded-lg py-2 text-gray-900">
                        Reset Password
                    </button>
                </form>
            </div>
            
            <Footer />
        </main>
    );
}
