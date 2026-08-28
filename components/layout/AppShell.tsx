"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import ImportantTicker from "./ImportantTicker";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  // If on any /admin route, render clean standalone layout without public website header/footer
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col w-full">
        {children}
      </div>
    );
  }

  // Regular public citizen portal shell
  return (
    <>
      <Header />
      <ImportantTicker />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
