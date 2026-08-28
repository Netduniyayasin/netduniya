"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  Heart,
  ChevronRight
} from "lucide-react";
import { subscribeToSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/firestore-service";
import { SiteSettings } from "@/lib/types";

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    const unsub = subscribeToSiteSettings((s) => setSettings(s));
    return () => unsub();
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-6 border-t-4 border-brand-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Brand Info & Contact */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <img 
                src="https://i.ibb.co/SwRRLf7R/file-00000000cf547209bfa39d10d03ef966.png" 
                alt="NetDuniya Logo" 
                className="h-11 w-11 rounded-full object-cover border-2 border-brand-accent p-0.5 bg-white shadow-md flex-shrink-0" 
              />
              <span className="text-2xl font-black tracking-wider text-white">
                NET<span className="text-amber-400">DUNIYA</span>
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              {settings.tagline || "Your Trusted Digital & E-Governance Citizen Services Assistance Kendra."}
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-start space-x-2.5">
                <MapPin className="h-4 w-4 text-brand-accent flex-shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <a href={`tel:${settings.contactPhone}`} className="hover:text-white transition">
                  {settings.contactPhone}
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 text-sky-400 flex-shrink-0" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-white transition">
                  {settings.contactEmail}
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Clock className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span>{settings.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Digital Services */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-brand-accent pl-2">
              Popular Services
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services?category=cat-tax-pan" className="hover:text-amber-400 transition flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 text-slate-500" />
                  New PAN Card Application (Form 49A)
                </Link>
              </li>
              <li>
                <Link href="/services?category=cat-identity" className="hover:text-amber-400 transition flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 text-slate-500" />
                  Aadhaar Address & Mobile Verification
                </Link>
              </li>
              <li>
                <Link href="/services?category=cat-certificates" className="hover:text-amber-400 transition flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 text-slate-500" />
                  Income / Caste / Domicile Certificates
                </Link>
              </li>
              <li>
                <Link href="/pvc-card" className="hover:text-amber-400 transition flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 text-slate-500" />
                  High Quality Smart PVC Card Printing
                </Link>
              </li>
              <li>
                <Link href="/services?category=cat-transport" className="hover:text-amber-400 transition flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 text-slate-500" />
                  Learning Driving Licence Slot Booking
                </Link>
              </li>
              <li>
                <Link href="/schemes" className="hover:text-amber-400 transition flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 text-slate-500" />
                  Government Welfare Schemes Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Citizen Tools & Quick Links */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-brand-accent pl-2">
              Quick Links & Tools
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/track" className="hover:text-amber-400 transition flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 text-slate-500" />
                  Track Your Application Status
                </Link>
              </li>
              <li>
                <Link href="/appointment" className="hover:text-amber-400 transition flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 text-slate-500" />
                  Book Kendra Appointment Slot
                </Link>
              </li>
              <li>
                <Link href="/tools#photo-resizer" className="hover:text-amber-400 transition flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 text-slate-500" />
                  Govt Exam Photo & Signature Resizer
                </Link>
              </li>
              <li>
                <Link href="/tools#age-calculator" className="hover:text-amber-400 transition flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 text-slate-500" />
                  Age Calculator for Job Applications
                </Link>
              </li>
              <li>
                <Link href="/links" className="hover:text-amber-400 transition flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 text-slate-500" />
                  Direct Official Government Portal Links
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-amber-400 transition flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 text-slate-500" />
                  How NetDuniya Online Service Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Security */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-brand-accent pl-2">
              Legal & Support
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy-policy" className="hover:text-amber-400 transition flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 text-slate-500" />
                  Privacy Policy & Data Security
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-400 transition flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 text-slate-500" />
                  Terms & Conditions of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-amber-400 transition flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 text-slate-500" />
                  Government Portal Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/refund-cancellation" className="hover:text-amber-400 transition flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 text-slate-500" />
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 text-slate-500" />
                  About NetDuniya
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-amber-400 transition flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 text-slate-500" />
                  Help Center & Customer Support
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <div className="text-center md:text-left">
            <p>© {new Date().getFullYear()} NetDuniya Digital Citizen Portal. All rights reserved.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              A Flagship Digital Citizen Services Platform • <Link href="/developer" className="text-amber-400 hover:text-amber-300 font-bold underline">Powered by Sazzidul Corporation</Link>
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link 
              href="/developer"
              className="text-[11px] bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-400/50 text-amber-300 px-3 py-1 rounded-md font-bold transition flex items-center space-x-1"
            >
              <span>⚡ Developer: Sazzidul Corporation</span>
            </Link>
            <span className="flex items-center text-[11px]">
              Made with <Heart className="h-3 w-3 text-rose-500 mx-1 fill-rose-500" /> for Digital India
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
