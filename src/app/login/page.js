"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import styles from "./login.module.css";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });

      if (res?.status === 200 && res?.data?.accessToken) {
        localStorage.setItem("token", res.data.accessToken);
        router.push("/dashboard");
      } else {
        setError(res?.data?.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Login</h2>

        {error && <p className={styles.error}>{error}</p>}

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
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className={styles.footerText}>
          Don&apos;t have an account? <a href="/signup">Signup</a>
        </p>
      </form>
    </div>
  );
}