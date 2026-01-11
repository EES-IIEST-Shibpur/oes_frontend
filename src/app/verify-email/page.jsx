"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useVerifyEmail, useResendVerification } from "@/hooks/useApi";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  );
}

function VerifyEmail() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const verifyEmailMutation = useVerifyEmail();
    const resendVerificationMutation = useResendVerification();

    const token = searchParams.get("token");

    const [status, setStatus] = useState("loading"); // loading | success | error
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid or missing verification token.");
            return;
        }

        verifyEmailAsync();
    }, [token]);

    const verifyEmailAsync = async () => {
        try {
            const res = await verifyEmailMutation.mutateAsync({
                token,
                body: {}
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

    const resendVerificationAsync = async () => {
        if (!email) return;

        try {
            await resendVerificationMutation.mutateAsync({ email });
            setMessage("Verification email resent. Please check your inbox.");
        } catch (err) {
            setMessage(err?.message || "Failed to resend verification email.");
        }
    };

    return (
        <main className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            
            <div className="flex flex-1 items-center justify-center px-6 py-20">
                <div className="w-full max-w-md bg-white border rounded-xl shadow p-8 text-center">
                    {status === "loading" && (
                        <>
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                            <h1 className="text-2xl font-semibold mb-2">Verifying Email</h1>
                            <p className="text-gray-600">Please wait while we verify your email...</p>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h1 className="text-2xl font-semibold mb-2">Email Verified</h1>
                            <p className="text-gray-600">{message}</p>
                            <p className="mt-3 text-sm text-gray-500">Redirecting to login...</p>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                <XCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <h1 className="text-2xl font-semibold mb-2">Verification Failed</h1>
                            <p className="text-gray-600 mb-6">{message}</p>

                            <div className="space-y-3 text-left">
                                <label className="block text-sm text-gray-700">
                                    Enter your email to resend verification link
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    placeholder="you@example.com"
                                />
                                <button
                                    onClick={resendVerificationAsync}
                                    disabled={resendVerificationMutation.isPending}
                                    style={{ backgroundColor: "var(--color-primary)" }}
                                    className="w-full py-2 rounded-lg text-sm font-medium text-gray-900 hover:opacity-90 disabled:opacity-50"
                                >
                                    {resendVerificationMutation.isPending ? "Sending..." : "Resend Verification Email"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            
            <Footer />
        </main>
    );
}