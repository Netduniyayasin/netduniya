"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Calendar, 
  Building, 
  ArrowRight,
  GraduationCap,
  Clock,
  Sparkles,
  CheckCircle2,
  Users
} from "lucide-react";
import { subscribeToJobs } from "@/lib/firestore-service";
import { GovernmentJob } from "@/lib/types";

export default function GovernmentJobsPage() {
  const [jobs, setJobs] = useState<GovernmentJob[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToJobs((data) => {
      setJobs(data);
      setLoading(false);
    }, true);

    return () => unsub();
  }, []);

  const categories = ["all", "Central Govt", "State Govt", "Banking", "Railways", "Defence / Police"];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.qualification.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (selectedCategory === "Central Govt") matchesCategory = job.state === "Central Govt";
    else if (selectedCategory === "State Govt") matchesCategory = job.state !== "Central Govt";
    else if (selectedCategory === "Banking") matchesCategory = job.department.toLowerCase().includes("bank");
    else if (selectedCategory === "Railways") matchesCategory = job.department.toLowerCase().includes("railway") || job.title.toLowerCase().includes("rrb");
    else if (selectedCategory === "Defence / Police") matchesCategory = job.department.toLowerCase().includes("police") || job.title.toLowerCase().includes("police");

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto py-2">
      
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-brand-dark to-brand-blue text-white rounded-3xl p-6 sm:p-10 shadow-xl border-l-8 border-amber-400 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-300 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-amber-400/30">
            <ShieldCheck className="h-4 w-4" />
            <span>100% Verified Government Recruitment Portal</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Latest Sarkari Naukri & Government Jobs
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Real-time verified recruitment notifications from SSC, UPSC, Indian Railways, Banking (IBPS/SBI), Defence, State Police, and Teaching commissions. Free official portal links and NetDuniya Kendra assisted form filling.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/appointment"
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs py-2.5 px-4 rounded-xl shadow transition flex items-center space-x-1.5"
            >
              <Users className="h-4 w-4" />
              <span>Assisted Form Filling at Kendra</span>
            </Link>
            <Link
              href="/services"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2.5 px-4 rounded-xl border border-white/20 transition"
            >
              Explore Certificate Services →
            </Link>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Strip */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-200 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title, SSC, Railway, Police, Qualification..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-brand-blue text-white shadow"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {cat === "all" ? "All Jobs" : cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Job Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-2xl shadow-card border border-slate-200 hover:border-brand-blue hover:shadow-lg transition-all p-5 sm:p-6 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="inline-flex items-center space-x-1 text-[11px] font-extrabold uppercase px-2.5 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  <Building className="h-3 w-3" />
                  <span>{job.department}</span>
                </span>
                <span className="inline-flex items-center space-x-1 text-[11px] font-black uppercase px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>100% Verified</span>
                </span>
              </div>

              {/* Title */}
              <h2 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-brand-blue transition">
                {job.title}
              </h2>

              {/* Key Specs Pills */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Vacancies</span>
                  <span className="font-extrabold text-slate-800">{job.totalVacancies}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Salary / Scale</span>
                  <span className="font-bold text-emerald-700">{job.salaryScale || "Government Norms"}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Qualification</span>
                  <span className="font-bold text-slate-700 truncate block">{job.qualification}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Last Date</span>
                  <span className="font-extrabold text-rose-600">{job.lastDate}</span>
                </div>
              </div>
            </div>

            {/* Actions Bottom Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              {job.notificationUrl && (
                <a
                  href={job.notificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-slate-600 hover:text-brand-blue flex items-center space-x-1"
                >
                  <span>Official Notice</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-blue hover:bg-brand-primary text-white font-bold text-xs py-2 px-4 rounded-xl shadow transition flex items-center space-x-1.5 ml-auto"
              >
                <span>Apply on Official Portal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
