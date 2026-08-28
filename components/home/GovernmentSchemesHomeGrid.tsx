"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  ExternalLink, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Building,
  CheckCircle2
} from "lucide-react";
import { subscribeToSchemes } from "@/lib/firestore-service";
import { GovernmentScheme } from "@/lib/types";

export default function GovernmentSchemesHomeGrid() {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);

  useEffect(() => {
    const unsub = subscribeToSchemes((data) => {
      setSchemes(data);
    }, true);

    return () => unsub();
  }, []);

  if (schemes.length === 0) return null;

  return (
    <section className="my-10" id="government-schemes-home">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-3 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <span>Citizen Welfare Subsidies</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Verified Government Schemes (सरकारी योजनाएं)</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-emerald-300">
              100+ Live
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Explore 100+ verified welfare subsidies: PM-Kisan, Ayushman Bharat, PMAY Housing, Sukanya Samriddhi, and Mudra loans.
          </p>
        </div>

        <Link
          href="/schemes"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition group flex-shrink-0"
        >
          <span>Explore All 100+ Schemes</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid of Top 6 Featured Schemes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {schemes.slice(0, 6).map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-2xl shadow-card hover:shadow-lg border border-slate-200 hover:border-emerald-500 p-5 flex flex-col justify-between space-y-3 transition group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  {scheme.state}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Verified</span>
                </span>
              </div>

              <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition line-clamp-2">
                {scheme.name}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {scheme.description}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center space-x-1.5 text-[11px] text-slate-500">
                <Building className="h-3 w-3 text-slate-400 flex-shrink-0" />
                <span className="truncate">{scheme.department}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={`/schemes/${scheme.slug}`}
                className="text-xs font-bold text-slate-600 hover:text-emerald-700"
              >
                Details
              </Link>
              <a
                href={scheme.applicationUrl || scheme.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] py-1.5 px-3 rounded-lg shadow-sm transition flex items-center space-x-1"
              >
                <span>Official Portal</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
