"use client";

import React from "react";
import Link from "next/link";
import { 
  CreditCard, 
  Calendar, 
  Search, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  Layers,
  Wrench,
  HelpCircle,
  Clock
} from "lucide-react";
import InfoCard from "@/components/home/InfoCard";
import LiveClockCalendar from "@/components/home/LiveClockCalendar";
import ServicesGrid from "@/components/home/ServicesGrid";
import GovernmentSchemesHomeGrid from "@/components/home/GovernmentSchemesHomeGrid";
import FounderSection from "@/components/home/FounderSection";
import PromotionalBanners from "@/components/home/PromotionalBanners";
import GovernmentJobsGrid from "@/components/home/GovernmentJobsGrid";

export default function HomePage() {
  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner Highlights */}
      <PromotionalBanners />

      {/* Important Information Notice Card */}
      <InfoCard />

      {/* Main Hero Row: Live Clock/Calendar + Quick Action Service Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Live Time, Date & Interactive Calendar (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <LiveClockCalendar />
        </div>

        {/* Right Column: Fast-Track Citizen Action Hub (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white rounded-xl shadow-card border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-brand-blue font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Instant Citizen Portal</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Fast-Track E-Services & Direct Assistance
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Select an instant service below to submit your application, book an appointment slot, or order premium printed smart PVC cards with doorstep delivery.
            </p>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-5">
              
              <Link
                href="/pvc-card"
                className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 hover:border-rose-400 hover:shadow-md transition-all group flex items-start space-x-3"
              >
                <div className="p-2.5 rounded-lg bg-rose-500 text-white shadow-sm group-hover:scale-105 transition-transform">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-rose-600 transition">
                    Order Smart PVC Card
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Aadhaar, PAN, Voter & Driving Licence PVC
                  </p>
                </div>
              </Link>

              <Link
                href="/appointment"
                className="p-4 rounded-xl bg-violet-50/70 border border-violet-200 hover:border-violet-400 hover:shadow-md transition-all group flex items-start space-x-3"
              >
                <div className="p-2.5 rounded-lg bg-violet-600 text-white shadow-sm group-hover:scale-105 transition-transform">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-violet-600 transition">
                    Book Kendra Appointment
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Reserve priority slot for form verification
                  </p>
                </div>
              </Link>

              <Link
                href="/track"
                className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 hover:border-sky-400 hover:shadow-md transition-all group flex items-start space-x-3"
              >
                <div className="p-2.5 rounded-lg bg-sky-600 text-white shadow-sm group-hover:scale-105 transition-transform">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-sky-600 transition">
                    Track Application
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Check real-time application & PVC status
                  </p>
                </div>
              </Link>

              <Link
                href="/schemes"
                className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all group flex items-start space-x-3"
              >
                <div className="p-2.5 rounded-lg bg-emerald-600 text-white shadow-sm group-hover:scale-105 transition-transform">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition">
                    Government Schemes
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Explore welfare subsidies & eligibility
                  </p>
                </div>
              </Link>

            </div>
          </div>

          {/* Trust Banner Bar */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span className="font-semibold text-slate-700">Encrypted Document Handling</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-brand-blue" />
              <span>Same Day Verification</span>
            </div>
            <Link 
              href="/services" 
              className="font-bold text-brand-blue hover:text-brand-accent flex items-center space-x-1"
            >
              <span>View All 15+ Services</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>

      </div>

      {/* Digital Services Section */}
      <ServicesGrid />

      {/* 100% Verified Government Jobs Section */}
      <GovernmentJobsGrid />

      {/* Verified Government Schemes Section (100+ Real Schemes) */}
      <GovernmentSchemesHomeGrid />

      {/* Founder Section */}
      <FounderSection />

    </div>
  );
}
