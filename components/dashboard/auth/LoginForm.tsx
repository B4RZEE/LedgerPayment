"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import AuthField from "./AuthField";

export default function LoginForm() {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    const email = emailRef.current?.value.trim() ?? "";
    const password = pwRef.current?.value ?? "";
    setError("");
    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "Incorrect email or password."
          : signInError.message
      );
      setLoading(false);
      return;
    }
    router.push("/app/dashboard");
    router.refresh();
  }

  return (
    <div>
      <div className="auth-title">Welcome back</div>
      <div className="auth-sub">Log in to access your payouts</div>

      <AuthField
        ref={emailRef}
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <AuthField
        ref={pwRef}
        label="Password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <div className="auth-error">{error}</div>

      <button className="auth-submit" disabled={loading} onClick={handleSubmit}>
        {loading ? "Logging in…" : "Log In"}
      </button>

      <div className="auth-switch">
        <Link href="/app/forgot-password">Forgot your password?</Link>
      </div>
      <div className="auth-switch">
        Don&apos;t have an account? <Link href="/app/register">Sign up</Link>
      </div>
    </div>
  );
}
