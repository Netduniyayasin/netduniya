"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  Menu, 
  Search, 
  Wallet, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  ShieldCheck, 
  CreditCard,
  Calendar,
  Layers,
  FileText,
  X,
  Code2,
  Sparkles,
  BookOpen,
  Briefcase,
  Wrench,
  Globe,
  Info,
  ChevronRight,
  UserPlus
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { formatCurrency } from "@/lib/utils";
import MobileDrawer from "./MobileDrawer";

const NAV_PILLS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/services", label: "Services", icon: "⚡" },
  { href: "/jobs", label: "Govt Jobs", icon: "💼", badge: "100% Verified" },
  { href: "/schemes", label: "Govt Schemes", icon: "🏛️" },
  { href: "/pvc-card", label: "PVC Card", icon: "💳" },
  { href: "/appointment", label: "Appointment", icon: "📅" },
  { href: "/tools", label: "Tools", icon: "🛠️" },
  { href: "/blog", label: "Blog", icon: "📰" },
  { href: "/about", label: "About", icon: "ℹ️" },
  { href: "/developer", label: "Developer", icon: "💻", isDev: true },
];

export default function Header() {
  const { user, profile, isAdmin, isSuperAdmin, walletBalance, signOut } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    if (userDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [userDropdownOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand-blue text-white shadow-lg">
        
        {/* Top Utility Bar for Desktop */}
        <div className="hidden lg:block bg-slate-950/40 border-b border-white/10 text-xs py-1 px-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-slate-300">
            <div className="flex items-center space-x-3">
              <span>🇮🇳 NetDuniya Digital Kendra &bull; Government, Banking & Citizen Services</span>
              <span className="text-white/30">|</span>
              <Link 
                href="/developer" 
                className="text-amber-300 hover:text-white font-bold flex items-center space-x-1 transition"
                title="View Sazzidul Corporation Details"
              >
                <span>⚡ Powered by Sazzidul Corporation</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/track" className="hover:text-white transition font-medium">Track Application</Link>
              <span className="text-white/30">|</span>
              <Link href="/how-it-works" className="hover:text-white transition font-medium">How it Works</Link>
              <span className="text-white/30">|</span>
              <Link href="/support" className="hover:text-white transition font-medium">Help & Support</Link>
            </div>
          </div>
        </div>

        {/* Main Header Bar: Logo + Always Visible Global Search + Wallet + User Login */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-4">
            
            {/* Left: Mobile Drawer Trigger + Brand Logo */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none lg:hidden flex-shrink-0"
                aria-label="Open Navigation Menu"
              >
                <Menu className="h-6 w-6 text-white" />
              </button>

              <Link href="/" className="flex items-center space-x-2.5 group flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/logo.png" 
                  alt="NetDuniya Logo" 
                  className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover border-2 border-brand-accent p-0.5 bg-white shadow-md flex-shrink-0" 
                />
                <div className="flex flex-col text-left">
                  <span className="text-xl sm:text-2xl font-black tracking-wider text-white flex items-center leading-none">
                    NET<span className="text-amber-400">DUNIYA</span>
                  </span>
                  <span className="text-[10px] tracking-widest text-slate-300 uppercase font-semibold mt-0.5 hidden sm:inline-block">
                    Digital Center
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Always-Visible Prominent Global Search Bar */}
            <div className="flex-1 max-w-xl mx-2 hidden sm:block">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services, PAN, Aadhaar, Driving Licence, Govt Jobs..."
                  className="w-full bg-white/15 hover:bg-white/20 focus:bg-white text-slate-900 focus:text-slate-900 placeholder-white/80 focus:placeholder-slate-400 text-xs sm:text-sm rounded-full pl-10 pr-24 py-2 border border-white/25 focus:border-brand-accent shadow-inner transition-all duration-200 outline-none"
                />
                <Search className="h-4 w-4 text-white/80 absolute left-3.5 top-2.5 pointer-events-none" />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full transition shadow flex items-center space-x-1 cursor-pointer"
                >
                  <span>Search</span>
                </button>
              </form>
            </div>

            {/* Right: Digital Wallet + User Account / Login & Register */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              
              {/* Wallet Button */}
              <Link
                href={user ? "/dashboard/wallet" : "/login?redirect=/dashboard/wallet"}
                className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 px-2.5 sm:px-3 py-1.5 rounded-full border border-white/20 text-xs sm:text-sm font-semibold transition shadow-sm cursor-pointer"
                title="Your Digital Wallet"
              >
                <Wallet className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span className="hidden xs:inline text-xs font-bold text-slate-200">Wallet:</span>
                <span className="font-black text-amber-300">{user ? formatCurrency(walletBalance) : "₹0"}</span>
              </Link>

              {/* User Account / Login or Profile */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full bg-brand-accent hover:bg-brand-accentHover text-white shadow focus:outline-none transition cursor-pointer"
                    aria-label="User Menu"
                  >
                    <UserIcon className="h-4 w-4" />
                    <span className="hidden md:inline text-xs font-bold truncate max-w-[90px]">
                      {profile?.fullName?.split(" ")[0] || "Account"}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 text-slate-800 border border-slate-200 animate-fadeIn"
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900 truncate">{profile?.fullName || "User"}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 text-[10px] uppercase font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            {isSuperAdmin ? "Super Admin" : "Admin Staff"}
                          </span>
                        )}
                      </div>

                      <div className="py-1 text-xs font-medium">
                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 hover:bg-slate-50 text-slate-700"
                        >
                          <LayoutDashboard className="h-4 w-4 mr-2.5 text-brand-blue" />
                          <span>Citizen Dashboard</span>
                        </Link>
                        <Link
                          href="/dashboard/applications"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 hover:bg-slate-50 text-slate-700"
                        >
                          <FileText className="h-4 w-4 mr-2.5 text-amber-600" />
                          <span>My Applications</span>
                        </Link>
                        <Link
                          href="/dashboard/wallet"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 hover:bg-slate-50 text-slate-700"
                        >
                          <Wallet className="h-4 w-4 mr-2.5 text-emerald-600" />
                          <span>Digital Wallet ({formatCurrency(walletBalance)})</span>
                        </Link>

                        {(isAdmin || isSuperAdmin) && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border-y border-amber-200"
                          >
                            <ShieldCheck className="h-4 w-4 mr-2.5 text-amber-600" />
                            <span>NetDuniya Admin Panel</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            signOut();
                          }}
                          className="flex items-center w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition"
                        >
                          <LogOut className="h-4 w-4 mr-2.5 text-rose-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <Link
                    href="/login"
                    className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-3 py-1.5 rounded-full text-xs font-black transition shadow cursor-pointer"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="hidden sm:inline-flex bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-bold border border-white/20 transition cursor-pointer"
                  >
                    Register
                  </Link>
                </div>
              )}

            </div>

          </div>

          {/* Mobile Search Bar (Visible only on < sm) */}
          <div className="pb-3 sm:hidden">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services, PAN, Govt Jobs..."
                className="w-full bg-white/15 focus:bg-white text-slate-900 placeholder-white/80 focus:placeholder-slate-400 text-xs rounded-full pl-9 pr-20 py-2 border border-white/20 focus:border-brand-accent shadow-inner outline-none"
              />
              <Search className="h-4 w-4 text-white/80 absolute left-3 top-2.5" />
              <button
                type="submit"
                className="absolute right-1 top-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-[11px] px-3 py-1 rounded-full shadow cursor-pointer"
              >
                Go
              </button>
            </form>
          </div>

        </div>

        {/* Sub-Header Horizontal Navigation Pill Strip (ALWAYS VISIBLE & RESPONSIVE ON ALL DEVICES) */}
        <div className="bg-slate-950/80 border-t border-white/10 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 py-1.5">
            <nav className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
              {NAV_PILLS.map((pill) => {
                const isActive = pathname === pill.href;
                
                return (
                  <Link
                    key={pill.href}
                    href={pill.href}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors duration-150 cursor-pointer flex-shrink-0 ${
                      isActive
                        ? "bg-amber-400 text-slate-950 shadow-md font-black ring-1 ring-amber-300"
                        : pill.isDev
                        ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black hover:brightness-110 shadow"
                        : "text-slate-200 hover:text-white hover:bg-white/15"
                    }`}
                  >
                    <span>{pill.icon}</span>
                    <span>{pill.label}</span>
                    {pill.badge && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-emerald-500 text-white tracking-tight">
                        {pill.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

      </header>

      {/* Mobile Full Navigation Drawer */}
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
