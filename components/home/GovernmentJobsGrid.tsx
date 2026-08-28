"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  ShieldCheck, 
  Building, 
  ArrowRight, 
  Calendar, 
  ExternalLink,
  Sparkles
} from "lucide-react";
import { subscribeToJobs } from "@/lib/firestore-service";
import { GovernmentJob } from "@/lib/types";

export default function GovernmentJobsGrid() {
  const [jobs, setJobs] = useState<GovernmentJob[]>([]);

  useEffect(() => {
    const unsub = subscribeToJobs((data) => {
      setJobs(data);
    }, true);

    return () => unsub();
  }, []);

  if (jobs.length === 0) return null;

  return (
    <section className="my-10" id="govt-jobs-section">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-3 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Recruitment Alerts</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <span>100% Verified Government Jobs</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold uppercase px-2 py-0.5 rounded-full border border-emerald-300">
              Live Notifications
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Verified recruitment drives across Central Ministries, Indian Railways, SSC, Banking, and State Police.
          </p>
        </div>

        <Link
          href="/jobs"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-blue hover:text-brand-accent transition group flex-shrink-0"
        >
          <span>Browse All ({jobs.length}) Jobs</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {jobs.slice(0, 4).map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-xl shadow-card border border-slate-200 hover:border-brand-blue hover:shadow-md transition-all p-4 flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase truncate max-w-[130px]">
                  {job.department}
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded border border-emerald-200">
                  Verified
                </span>
              </div>

              <h3 className="text-sm font-black text-slate-900 group-hover:text-brand-blue transition line-clamp-2">
                {job.title}
              </h3>

              <div className="space-y-1 text-xs pt-1">
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400 text-[11px]">Vacancies:</span>
                  <span className="font-bold text-slate-900">{job.totalVacancies}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400 text-[11px]">Last Date:</span>
                  <span className="font-extrabold text-rose-600">{job.lastDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/jobs"
                className="text-xs font-bold text-brand-blue hover:underline"
              >
                Details
              </Link>
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-blue hover:bg-brand-primary text-white text-[11px] font-bold py-1.5 px-3 rounded-lg shadow-sm transition flex items-center space-x-1"
              >
                <span>Apply</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
