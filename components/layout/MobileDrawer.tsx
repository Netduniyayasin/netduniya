"use client";

import React from "react";
import Link from "next/link";
import { 
  X, 
  Home, 
  Layers, 
  BookOpen, 
  FileText, 
  Wrench, 
  ShoppingBag, 
  CreditCard, 
  Calendar, 
  Wallet, 
  User, 
  LogOut, 
  ShieldCheck, 
  ExternalLink,
  PhoneCall,
  HelpCircle,
  Code2,
  Sparkles,
  Briefcase,
  Search,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { formatCurrency } from "@/lib/utils";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { user, profile, isAdmin, isSuperAdmin, walletBalance, signOut } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Sidebar */}
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 text-white shadow-2xl z-50 transform transition-all duration-300 ease-in-out">
        
        {/* Drawer Header */}
        <div className="p-4 bg-brand-blue flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <img 
              src="/images/logo.png" 
              alt="NetDuniya Logo" 
              className="h-9 w-9 rounded-full object-cover border-2 border-brand-accent p-0.5 bg-white shadow" 
            />
            <div>
              <h2 className="font-extrabold text-lg text-white leading-none">
                NET<span className="text-amber-400">DUNIYA</span>
              </h2>
              <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Digital Center</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none"
            aria-label="Close Navigation"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User Status Card at Top */}
        <div className="p-4 bg-slate-800/90 border-b border-slate-700">
          {user ? (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center font-bold text-white shadow flex-shrink-0">
                  {profile?.fullName?.charAt(0) || user.email?.charAt(0) || "U"}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-sm text-white truncate">{profile?.fullName || "User"}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-lg border border-slate-700 mt-2">
                <div className="flex items-center space-x-1.5 text-xs text-slate-300">
                  <Wallet className="h-4 w-4 text-amber-400" />
                  <span>Wallet:</span>
                  <span className="font-bold text-amber-400 text-sm">{formatCurrency(walletBalance)}</span>
                </div>
                <Link
                  href="/dashboard/wallet"
                  onClick={onClose}
                  className="text-[11px] bg-brand-accent hover:bg-brand-accentHover text-white font-bold px-2.5 py-1 rounded shadow"
                >
                  + Add
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <p className="text-xs text-slate-300">Login to track your applications and access your digital wallet.</p>
              <div className="flex space-x-2 pt-1">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex-1 text-center bg-amber-400 hover:bg-amber-500 text-slate-950 py-2 rounded-lg font-black text-xs shadow"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={onClose}
                  className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg font-bold text-xs border border-white/20"
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 1-Click Navigation Items List */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1.5 scrollbar-thin">
          
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center px-3 py-2.5 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 text-sm font-bold transition active:scale-98"
          >
            <Home className="h-4 w-4 mr-3 text-amber-400" />
            <span>Home</span>
          </Link>

          <Link
            href="/services"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 text-sm font-bold transition active:scale-98"
          >
            <div className="flex items-center">
              <Layers className="h-4 w-4 mr-3 text-sky-400" />
              <span>Digital Services (PAN, Aadhaar)</span>
            </div>
            <span className="text-[10px] bg-sky-500/20 text-sky-300 font-extrabold px-2 py-0.5 rounded">All</span>
          </Link>

          <Link
            href="/jobs"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 text-sm font-bold transition active:scale-98"
          >
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 mr-3 text-amber-400" />
              <span>Govt Jobs & Recruitment</span>
            </div>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-black px-1.5 py-0.5 rounded uppercase">100% Verified</span>
          </Link>

          <Link
            href="/schemes"
            onClick={onClose}
            className="flex items-center px-3 py-2.5 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 text-sm font-bold transition active:scale-98"
          >
            <FileText className="h-4 w-4 mr-3 text-emerald-400" />
            <span>Govt Schemes & Subsidies</span>
          </Link>

          <Link
            href="/pvc-card"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 text-sm font-bold transition active:scale-98"
          >
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 mr-3 text-rose-400" />
              <span>PVC Smart Card Order</span>
            </div>
            <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded">₹50</span>
          </Link>

          <Link
            href="/appointment"
            onClick={onClose}
            className="flex items-center px-3 py-2.5 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 text-sm font-bold transition active:scale-98"
          >
            <Calendar className="h-4 w-4 mr-3 text-violet-400" />
            <span>Book Kendra Appointment</span>
          </Link>

          <Link
            href="/tools"
            onClick={onClose}
            className="flex items-center px-3 py-2.5 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 text-sm font-bold transition active:scale-98"
          >
            <Wrench className="h-4 w-4 mr-3 text-amber-400" />
            <span>Citizen Tools (Photo/Age)</span>
          </Link>

          <Link
            href="/blog"
            onClick={onClose}
            className="flex items-center px-3 py-2.5 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 text-sm font-bold transition active:scale-98"
          >
            <BookOpen className="h-4 w-4 mr-3 text-indigo-400" />
            <span>Blog & Guidelines</span>
          </Link>

          <Link
            href="/track"
            onClick={onClose}
            className="flex items-center px-3 py-2.5 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 text-sm font-bold transition active:scale-98"
          >
            <HelpCircle className="h-4 w-4 mr-3 text-teal-400" />
            <span>Track Application Status</span>
          </Link>

          <Link
            href="/about"
            onClick={onClose}
            className="flex items-center px-3 py-2.5 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 text-sm font-bold transition active:scale-98"
          >
            <HelpCircle className="h-4 w-4 mr-3 text-emerald-400" />
            <span>About NetDuniya</span>
          </Link>

          {/* Developer Showcase Badge */}
          <Link
            href="/developer"
            onClick={onClose}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400/20 via-yellow-400/15 to-transparent text-amber-300 hover:text-white text-sm font-bold transition border border-amber-400/30 shadow-sm active:scale-98"
          >
            <div className="flex items-center space-x-2.5">
              <span className="p-1 rounded-md bg-amber-400 text-slate-950">
                <Code2 className="h-4 w-4" />
              </span>
              <span>Developer (Sazzidul Corp)</span>
            </div>
            <span className="text-[10px] uppercase font-black bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 px-2 py-0.5 rounded-full shadow-sm">
              Official
            </span>
          </Link>
        </div>

        {/* Drawer Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <Link href="/support" onClick={onClose} className="flex items-center text-slate-300 hover:text-white font-medium">
            <PhoneCall className="h-3.5 w-3.5 mr-1" />
            Help & Support
          </Link>
          {user && (
            <button
              type="button"
              onClick={() => {
                signOut();
                onClose();
              }}
              className="flex items-center text-rose-400 hover:text-rose-300 font-bold"
            >
              <LogOut className="h-3.5 w-3.5 mr-1" />
              Logout
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
