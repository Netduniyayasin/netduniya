import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "NetDuniya — National Digital Citizen Services & E-Governance Kendra",
  description: "Official online assistance portal for PAN card, Aadhaar verification, citizen certificates, government schemes, smart PVC card printing, and e-governance services.",
  keywords: ["NetDuniya", "Digital Seva", "PAN card online", "Aadhaar update", "Income Certificate", "PVC card order", "Govt Schemes", "E-Governance"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/logo.png", type: "image/png" }
    ],
    shortcut: "/favicon.ico",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-amber-200 selection:text-slate-900">
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
