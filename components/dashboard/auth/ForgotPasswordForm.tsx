"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isValidEmail } from "@/lib/validation";
import AuthField from "./AuthField";

export default function ForgotPasswordForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    const email = emailRef.current?.value.trim() ?? "";
    if (!isValidEmail(email)) {
      setSuccess(false);
      setMessage("Enter a valid email address.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/app/reset-password`,
    });
    if (error) {
      setSuccess(false);
      setMessage(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setMessage("If an account exists for that email, a reset link has been sent.");
    }
  }

  return (
    <div>
      <div className="auth-back">
        <Link href="/app/login" className="auth-back">
          ← Back to login
        </Link>
      </div>
      <div className="auth-title">Reset your password</div>
      <div className="auth-sub">We&apos;ll send a reset link to your email</div>

      <AuthField
        ref={emailRef}
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <div className={success ? "auth-success" : "auth-error"}>{message}</div>

      <button className="auth-submit" disabled={loading || success} onClick={handleSubmit}>
        {success ? "Link Sent" : loading ? "Sending…" : "Send Reset Link"}
      </button>
    </div>
  );
}
