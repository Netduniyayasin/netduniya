"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  Calendar, 
  Layers, 
  Landmark, 
  Users, 
  DollarSign, 
  FileSpreadsheet, 
  BookOpen, 
  HelpCircle, 
  Activity, 
  Settings, 
  ExternalLink, 
  ChevronRight, 
  LogOut,
  Lock,
  ShieldAlert,
  Loader2,
  Mail,
  KeyRound,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { createOrUpdateUser, createAdminRecord, isFirstAdminUser } from "@/lib/firestore-service";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/applications", label: "Applications", icon: FileText },
  { href: "/admin/orders", label: "PVC & Shop Orders", icon: CreditCard },
  { href: "/admin/appointments", label: "Appointments", icon: Calendar },
  { href: "/admin/services", label: "Services & Forms", icon: Layers },
  { href: "/admin/schemes", label: "Govt Schemes", icon: Landmark },
  { href: "/admin/users", label: "Users & Wallets", icon: Users },
  { href: "/admin/payments", label: "Payments & Refunds", icon: DollarSign },
  { href: "/admin/content", label: "CMS & Notices", icon: FileSpreadsheet },
  { href: "/admin/blogs", label: "Blog Articles", icon: BookOpen },
  { href: "/admin/support", label: "Support Tickets", icon: HelpCircle },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: Activity },
  { href: "/admin/settings", label: "Portal Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, isAdmin, isSuperAdmin, loading, signIn, signOut, refreshProfile } = useAuth();
  const pathname = usePathname();
  
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [elevating, setElevating] = useState(false);
  const [canBootstrapAdmin, setCanBootstrapAdmin] = useState(false);

  // Check if system has zero admins so first user can bootstrap
  useEffect(() => {
    let isMounted = true;
    if (user && !isAdmin) {
      isFirstAdminUser().then((isFirst) => {
        if (isMounted) setCanBootstrapAdmin(isFirst);
      }).catch(() => {});
    }
    return () => { isMounted = false; };
  }, [user, isAdmin]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      if (!adminEmail.trim() || !adminPassword.trim()) {
        throw new Error("Please enter both administrator email and password");
      }
      await signIn(adminEmail.trim(), adminPassword);
    } catch (err: any) {
      console.error("Admin sign in failed:", err);
      let msg = "Invalid administrator credentials";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        msg = "Incorrect administrator email or password. Please verify credentials.";
      } else if (err.message) {
        msg = err.message;
      }
      setLoginError(msg);
    } finally {
      setLoggingIn(false);
    }
  };

  const handleBootstrapSuperAdmin = async () => {
    if (!user) return;
    setElevating(true);
    try {
      await createOrUpdateUser({
        uid: user.uid,
        role: "super_admin",
        updatedAt: Date.now(),
      });
      await createAdminRecord({
        uid: user.uid,
        fullName: profile?.fullName || user.displayName || "Super Admin",
        email: user.email || "",
        phoneNumber: profile?.phoneNumber || "",
        role: "super_admin",
        rules: ["all"],
        isActive: true,
        createdBy: "system_bootstrap",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      await refreshProfile();
      alert("Success! Your account has been initialized as Super Administrator.");
      window.location.reload();
    } catch (err: any) {
      alert("Error initializing super admin: " + err.message);
    } finally {
      setElevating(false);
    }
  };

  // 1. Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-4 bg-slate-950 text-slate-100">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 text-amber-400 flex items-center justify-center shadow-2xl animate-pulse">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-base font-black text-white">Verifying Admin Access...</h2>
          <p className="text-xs text-slate-400 mt-1">Connecting securely to NetDuniya administrative node</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated: Show dedicated, clean Admin Login Screen
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100 relative overflow-hidden">
        {/* Background glow accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-blue/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full my-8 animate-fadeIn relative z-10">
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
            
            {/* Header Banner */}
            <div className="p-6 sm:p-8 text-center space-y-3 border-b border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-900/50">
              <div className="w-16 h-16 rounded-2xl bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="h-8 w-8" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20">
                  Protected System
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white mt-2">
                  NetDuniya Admin Portal
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Enter authorized administrator credentials to access the live dashboard.
                </p>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 sm:p-8 space-y-5">
              {loginError && (
                <div className="p-3 bg-rose-950/50 border border-rose-800 text-rose-200 text-xs rounded-xl flex items-center space-x-2.5">
                  <ShieldAlert className="h-4 w-4 flex-shrink-0 text-rose-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Administrator Email / Gmail *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@netduniya.in"
                      required
                      autoComplete="username"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                    />
                    <Mail className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Master Password *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      autoComplete="current-password"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                    />
                    <KeyRound className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loggingIn}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm py-3 px-6 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  {loggingIn ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                      <span>Authenticating Admin...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4 text-slate-950" />
                      <span>Sign In to Dashboard</span>
                    </>
                  )}
                </button>
              </form>

              <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs text-slate-500">
                <Link href="/" className="hover:text-amber-400 flex items-center space-x-1 font-bold transition">
                  <ArrowLeft className="h-3 w-3" />
                  <span>Public Website</span>
                </Link>
                <span className="text-[11px] text-slate-600">NetDuniya Security Node</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // 3. User is logged in, but does NOT have admin access
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <div>
            <h1 className="text-xl font-black text-white">Administrator Access Required</h1>
            <p className="text-xs text-slate-400 mt-2">
              Signed in as <strong className="text-amber-300">{user.email}</strong>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Your account currently has the role <span className="font-bold text-slate-200">"{profile?.role || 'Citizen User'}"</span> and is not authorized to access administrative controls.
            </p>
          </div>

          {canBootstrapAdmin ? (
            <div className="p-4 bg-amber-950/40 border border-amber-700/50 rounded-2xl space-y-3 text-left">
              <div className="flex items-center space-x-2 text-amber-300 text-xs font-black">
                <Sparkles className="h-4 w-4" />
                <span>Initial Platform Setup</span>
              </div>
              <p className="text-xs text-slate-300">
                No administrators exist yet in the database. You can initialize this account as the primary Super Administrator.
              </p>
              <button
                type="button"
                onClick={handleBootstrapSuperAdmin}
                disabled={elevating}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-2.5 px-4 rounded-xl shadow transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                {elevating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                    <span>Initializing Super Admin...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 text-slate-950" />
                    <span>Initialize as Super Admin</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => signOut()}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-2.5 px-4 rounded-xl shadow transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out & Switch to Admin Account</span>
              </button>

              <Link
                href="/"
                className="block w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2.5 px-4 rounded-xl transition"
              >
                Return to Public Website
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4. Authenticated Administrator: Render complete dedicated Admin Workspace
  const displayName = profile?.fullName || user?.displayName || user?.email || "Administrator";
  const displayRole = isSuperAdmin ? "SUPER ADMIN" : (profile?.role?.toUpperCase() || "ADMIN");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col animate-fadeIn">
      
      {/* Dedicated Top Administrative Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0 shadow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images/logo.png" 
              alt="NetDuniya Logo" 
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/founder.jpg";
              }}
            />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                NetDuniya Admin Portal
              </h1>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-sm">
                {displayRole}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Central E-Governance Administration Node &bull; Sazzidul Corporation
            </p>
          </div>
        </div>

        {/* Right Admin Controls */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-white">{displayName}</p>
            <p className="text-[11px] text-slate-400">{user?.email}</p>
          </div>

          <Link
            href="/"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2 px-3 rounded-xl border border-slate-700 transition flex items-center space-x-1.5"
            title="Open Public Website"
          >
            <span className="hidden sm:inline">Website</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </Link>

          <button
            type="button"
            onClick={() => signOut()}
            className="bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold py-2 px-3 rounded-xl transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Administrative Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Admin Navigation Sidebar (3 cols) */}
          <aside className="lg:col-span-3 bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-3 space-y-1 sticky top-20">
            <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1 flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Systems</span>
              </div>
              <span className="text-[9px] bg-amber-400/20 text-amber-300 font-extrabold px-1.5 py-0.5 rounded border border-amber-400/30">
                LIVE
              </span>
            </div>

            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition group ${
                    isActive
                      ? "bg-brand-blue text-white shadow-md border border-blue-500/30"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? "text-amber-300" : "text-slate-400 group-hover:text-slate-200"}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-white/70" />}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-slate-800 text-center">
              <p className="text-[10px] text-slate-500">
                NetDuniya Portal &bull; Sazzidul Corp
              </p>
            </div>
          </aside>

          {/* Admin Workspace Content (9 cols) */}
          <main className="lg:col-span-9 space-y-6">
            <div className="bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-6">
              {children}
            </div>
          </main>

        </div>
      </div>

    </div>
  );
}
