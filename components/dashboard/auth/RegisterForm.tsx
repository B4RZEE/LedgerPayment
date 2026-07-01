"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isValidEmail } from "@/lib/validation";
import AuthField from "./AuthField";

export default function RegisterForm() {
  const router = useRouter();
  const firstRef = useRef<HTMLInputElement>(null);
  const lastRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const pw2Ref = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    const firstName = firstRef.current?.value.trim() ?? "";
    const lastName = lastRef.current?.value.trim() ?? "";
    const email = emailRef.current?.value.trim() ?? "";
    const pw = pwRef.current?.value ?? "";
    const pw2 = pw2Ref.current?.value ?? "";
    setError("");

    if (!firstName) return setError("First name is required.");
    if (!lastName) return setError("Last name is required.");
    if (!isValidEmail(email)) return setError("Enter a valid email address.");
    if (pw.length < 6) return setError("Password must be at least 6 characters.");
    if (pw !== pw2) return setError("Passwords don't match.");

    setLoading(true);
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password: pw,
      options: { data: { first_name: firstName, last_name: lastName } },
    });

    if (signUpError) {
      let msg = signUpError.message;
      const lower = msg.toLowerCase();
      if (
        lower.includes("already registered") ||
        lower.includes("already exists") ||
        lower.includes("user already") ||
        lower.includes("email address is already")
      ) {
        msg = "An account with this email address already exists. Try logging in instead.";
      }
      setError(msg);
      setLoading(false);
      return;
    }

    // Email confirmation required — session is null until the user clicks the link.
    if (data?.user && !data?.session) {
      setSuccess(true);
      setLoading(false);
      return;
    }

    // Session is live immediately — persist first/last name to profiles now.
    if (data?.user?.id) {
      try {
        await supabase
          .from("profiles")
          .upsert({ id: data.user.id, first_name: firstName, last_name: lastName }, { onConflict: "id" });
      } catch {
        // Non-fatal — onAuthSuccess-equivalent hydration will retry via profile fetch.
      }
    }
    router.push("/app/dashboard");
    router.refresh();
  }

  if (success) {
    return (
      <div>
        <div className="auth-title">Create your account</div>
        <div className="auth-sub">Start tracking your payouts</div>
        <div className="auth-success">
          Account created! Check your inbox and click the confirmation link, then log in.
        </div>
        <div className="auth-switch">
          <Link href="/app/login">Back to login</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="auth-title">Create your account</div>
      <div className="auth-sub">Start tracking your payouts</div>

      <AuthField ref={firstRef} label="First name" type="text" placeholder="Jane" autoComplete="given-name" />
      <AuthField ref={lastRef} label="Last name" type="text" placeholder="Smith" autoComplete="family-name" />
      <AuthField ref={emailRef} label="Email" type="email" placeholder="you@example.com" autoComplete="email" />
      <AuthField
        ref={pwRef}
        label="Password"
        type="password"
        placeholder="At least 6 characters"
        autoComplete="new-password"
      />
      <AuthField
        ref={pw2Ref}
        label="Confirm Password"
        type="password"
        placeholder="Re-enter your password"
        autoComplete="new-password"
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <div className="auth-error">{error}</div>

      <button className="auth-submit" disabled={loading} onClick={handleSubmit}>
        {loading ? "Creating account…" : "Sign Up"}
      </button>

      <div className="auth-switch">
        Already have an account? <Link href="/app/login">Log in</Link>
      </div>
    </div>
  );
}
