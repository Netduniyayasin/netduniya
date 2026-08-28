"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, AlertCircle, Loader2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn, user, isAdmin, isSuperAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  useEffect(() => {
    if (user) {
      if (redirectParam) {
        router.replace(redirectParam);
      } else if (isAdmin || isSuperAdmin) {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [user, isAdmin, isSuperAdmin, redirectParam, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      // Auth state change will trigger the useEffect redirect above
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Invalid email or password. Please verify your credentials.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later or reset password.");
      } else {
        setError(err.message || "Failed to sign in. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-card border border-slate-200 p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto shadow-md border-2 border-brand-accent p-1 bg-white flex items-center justify-center">
            <img 
              src="https://i.ibb.co/SwRRLf7R/file-00000000cf547209bfa39d10d03ef966.png" 
              alt="NetDuniya Logo" 
              className="w-full h-full object-cover rounded-full" 
            />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign In to NetDuniya
          </h1>
          <p className="text-xs text-slate-500">
            Citizen & Staff Portal • Powered by Sazzidul Corporation
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Email Address / Gmail ID</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-brand-blue"
              />
              <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-slate-700">Password</label>
              <Link href="/forgot-password" className="text-[11px] font-semibold text-brand-blue hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-brand-blue"
              />
              <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-blue hover:bg-brand-primary text-white font-bold text-xs sm:text-sm py-3 rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In to Portal</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="border-t border-slate-100 pt-4 text-center space-y-2">
          <p className="text-xs text-slate-600">
            Don't have an account?{" "}
            <Link href={`/register?redirect=${encodeURIComponent(redirectParam || "")}`} className="font-bold text-brand-blue hover:underline">
              Create Free Account
            </Link>
          </p>
          <p className="text-[10px] text-slate-400">
            ⚡ Engineered & Backed by <strong>Sazzidul Corporation</strong>
          </p>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-bold">Loading login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
