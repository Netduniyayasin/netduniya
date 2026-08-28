"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Wallet, 
  Calendar, 
  CreditCard, 
  ShoppingBag, 
  HelpCircle, 
  User, 
  LogOut, 
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { formatCurrency } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/applications", label: "My Applications", icon: FileText },
  { href: "/dashboard/wallet", label: "Wallet & Passbook", icon: Wallet },
  { href: "/dashboard/appointments", label: "My Appointments", icon: Calendar },
  { href: "/dashboard/orders", label: "Orders & PVC Cards", icon: CreditCard },
  { href: "/dashboard/support", label: "Support Tickets", icon: HelpCircle },
  { href: "/dashboard/profile", label: "Account Profile", icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, walletBalance, signOut, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return <div className="p-12 text-center text-slate-500 font-bold">Verifying session...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-brand-blue text-white rounded-2xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-brand-accent">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-accent flex items-center justify-center font-black text-2xl text-white shadow-md">
            {profile?.fullName?.charAt(0) || user.email?.charAt(0) || "U"}
          </div>
          <div>
            <span className="text-xs uppercase font-extrabold text-amber-300 tracking-wider">Citizen Portal Dashboard</span>
            <h1 className="text-xl sm:text-2xl font-black text-white">{profile?.fullName || "NetDuniya User"}</h1>
            <p className="text-xs text-slate-300">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-xl border border-white/20">
          <Wallet className="h-6 w-6 text-amber-400" />
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-300 font-semibold block">Wallet Balance</span>
            <span className="text-lg font-black text-amber-300">{formatCurrency(walletBalance)}</span>
          </div>
          <Link
            href="/dashboard/wallet"
            className="ml-2 bg-brand-accent hover:bg-brand-accentHover text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow"
          >
            + Recharge
          </Link>
        </div>
      </div>

      {/* Grid: Navigation Sidebar + Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Sidebar Nav (3 cols) */}
        <aside className="lg:col-span-3 bg-white rounded-xl shadow-card border border-slate-200 p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition ${
                  isActive
                    ? "bg-brand-blue text-white shadow"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? "text-amber-300" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="h-3.5 w-3.5 text-white/70" />}
              </Link>
            );
          })}

          {isAdmin && (
            <>
              <div className="border-t border-slate-100 my-2 pt-2" />
              <Link
                href="/admin"
                className="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-lg text-xs font-black bg-blue-50 text-brand-blue border border-blue-200 hover:bg-blue-100 transition"
              >
                <ShieldCheck className="h-4 w-4 text-brand-blue" />
                <span>Admin Staff Portal</span>
              </Link>
            </>
          )}

          <div className="border-t border-slate-100 my-2 pt-2" />
          <button
            type="button"
            onClick={() => signOut()}
            className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition text-left"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </aside>

        {/* Main Content Area (9 cols) */}
        <main className="lg:col-span-9">
          {children}
        </main>

      </div>

    </div>
  );
}
