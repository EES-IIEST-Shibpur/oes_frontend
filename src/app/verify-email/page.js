"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams.get("token");

    const [status, setStatus] = useState("loading"); // loading | success | error
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [resending, setResending] = useState(false);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid or missing verification token.");
            return;
        }

        verifyEmail();
    }, [token]);

    const verifyEmail = async () => {
        try {
            await apiFetch(`/api/auth/verify-email/${token}`, {
                method: "POST",
            });

            setStatus("success");
            setMessage("Your email has been verified successfully.");

            // Optional redirect after success
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err) {
            setStatus("error");
            setMessage(
                err?.message || "Verification failed. The link may be expired."
            );
        }
    };

    const resendVerification = async () => {
        if (!email) return;

        try {
            setResending(true);
            await apiFetch("/api/auth/resend-verification", {
                method: "POST",
                body: JSON.stringify({ email }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setMessage("Verification email resent. Please check your inbox.");
        } catch (err) {
            setMessage(err?.message || "Failed to resend verification email.");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full border rounded-lg p-6 text-center">
                {status === "loading" && (
                    <>
                        <h1 className="text-xl font-semibold mb-2">Verifying Email</h1>
                        <p>Please wait while we verify your email...</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <h1 className="text-xl font-semibold mb-2">Email Verified</h1>
                        <p>{message}</p>
                        <p className="mt-3 text-sm">Redirecting to login...</p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <h1 className="text-xl font-semibold mb-2">Verification Failed</h1>
                        <p className="mb-4">{message}</p>

                        <div className="text-left">
                            <label className="block text-sm mb-1">
                                Enter your email to resend verification link
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border px-3 py-2 rounded mb-3"
                                placeholder="you@example.com"
                            />
                            <button
                                onClick={resendVerification}
                                disabled={resending}
                                className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
                            >
                                {resending ? "Sending..." : "Resend Verification Email"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}