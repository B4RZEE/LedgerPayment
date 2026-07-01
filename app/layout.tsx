import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ledger — Track Your Prop Firm Payouts",
  description:
    "One dashboard for every prop firm payout. Track withdrawals across FTMO, Apex, TopStep and more. Hit income goals and see what your funded trading business actually earns.",
  openGraph: {
    type: "website",
    title: "Ledger — Track Your Prop Firm Payouts",
    description:
      "One dashboard for every prop firm payout. Track withdrawals, hit income goals, and see what your funded trading business actually earns.",
    url: "https://ledgerpayout.vercel.app/",
    images: [{ url: "https://ledgerpayout.vercel.app/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ledger — Track Your Prop Firm Payouts",
    description:
      "One dashboard for every prop firm payout. Track withdrawals, hit income goals, and see what your funded trading business actually earns.",
    images: ["https://ledgerpayout.vercel.app/og-image.png"],
  },
  other: { "theme-color": "#07080c" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen">
        <div className="atmosphere" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
