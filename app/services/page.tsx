"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ServicesGrid from "@/components/home/ServicesGrid";
import { Sparkles, ShieldCheck } from "lucide-react";

function ServicesContent() {
  const searchParams = useSearchParams();
  const cat = searchParams.get("category") || undefined;

  return (
    <div className="space-y-6">
      <div className="bg-brand-blue text-white rounded-xl p-6 sm:p-8 shadow-card border-b-4 border-brand-accent">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300 bg-white/10 px-3 py-1 rounded">
            All Digital Citizen Services
          </span>
          <h1 className="text-2xl sm:text-4xl font-black mt-2 tracking-tight">
            E-Governance & Documentation Services Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
            Browse government, documentation, banking, tax, and citizen services. Fill the assisted application form online and receive real-time verification and processing.
          </p>
        </div>
      </div>

      <ServicesGrid initialCategory={cat} />
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading digital services...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
