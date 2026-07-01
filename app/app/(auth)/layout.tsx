import ThemeHydrator from "@/components/dashboard/layout/ThemeHydrator";
import "../../dashboard.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-screen">
      <ThemeHydrator />
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-mark" />
          <div className="auth-brand-name">Ledger</div>
        </div>
        {children}
      </div>
    </div>
  );
}
