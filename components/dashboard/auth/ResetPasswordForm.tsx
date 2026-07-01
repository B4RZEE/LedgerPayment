"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthField from "./AuthField";

export default function ResetPasswordForm() {
  const router = useRouter();
  const pwRef = useRef<HTMLInputElement>(null);
  const pw2Ref = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    const pw = pwRef.current?.value ?? "";
    const pw2 = pw2Ref.current?.value ?? "";
    setError("");
    if (pw.length < 6) return setError("Password must be at least 6 characters.");
    if (pw !== pw2) return setError("Passwords don't match.");

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password: pw });
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }
    router.push("/app/dashboard");
    router.refresh();
  }

  return (
    <div>
      <div className="auth-title">Set a new password</div>
      <div className="auth-sub">Choose a new password for your account</div>

      <AuthField ref={pwRef} label="New password" type="password" placeholder="At least 6 characters" autoComplete="new-password" />
      <AuthField
        ref={pw2Ref}
        label="Confirm new password"
        type="password"
        placeholder="Re-enter your password"
        autoComplete="new-password"
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <div className="auth-error">{error}</div>

      <button className="auth-submit" disabled={loading} onClick={handleSubmit}>
        {loading ? "Saving…" : "Save New Password"}
      </button>
    </div>
  );
}
