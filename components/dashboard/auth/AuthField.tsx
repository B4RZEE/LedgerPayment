import { forwardRef, type InputHTMLAttributes } from "react";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(function AuthField(
  { label, className, ...inputProps },
  ref
) {
  return (
    <div className="auth-field">
      <label className="auth-label">{label}</label>
      <input ref={ref} className={`auth-input ${className ?? ""}`} {...inputProps} />
    </div>
  );
});

export default AuthField;
