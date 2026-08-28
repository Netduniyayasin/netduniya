"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  FileText, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink, 
  Building, 
  Calendar, 
  FileCheck,
  AlertCircle,
  Loader2
} from "lucide-react";
import { getSchemeBySlug } from "@/lib/firestore-service";
import { GovernmentScheme } from "@/lib/types";

export default function SchemeDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [scheme, setScheme] = useState<GovernmentScheme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      const res = await getSchemeBySlug(slug);
      setScheme(res);
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <Loader2 className="h-10 w-10 text-brand-blue animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-600">Loading scheme guidelines...</p>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center bg-white rounded-xl shadow p-8">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Scheme Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">This scheme does not exist or has been archived.</p>
        <Link href="/schemes" className="mt-4 inline-block bg-brand-blue text-white text-xs font-bold px-4 py-2 rounded">
          ← Back to All Schemes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/schemes" className="hover:text-brand-blue flex items-center">
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Back to Schemes
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">{scheme.name}</span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-card border-l-8 border-amber-400">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider bg-white/10 text-amber-300 px-3 py-1 rounded-md border border-white/10">
              {scheme.state || "Central Government"}
            </span>
            {scheme.lastVerifiedDate && (
              <span className="text-xs text-emerald-300 flex items-center bg-emerald-950/60 px-2.5 py-1 rounded">
                <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                Verified: {scheme.lastVerifiedDate}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{scheme.name}</h1>
          
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <Building className="h-4 w-4 text-emerald-400" />
            <span>Department: <strong>{scheme.department || "Government of India"}</strong></span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2">
          Scheme Overview & Objectives
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {scheme.description}
        </p>
      </div>

      {/* Benefits & Eligibility 2-Col Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Benefits Card */}
        <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-emerald-800 border-b border-emerald-100 pb-2 flex items-center">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2" />
            Key Benefits & Subsidies
          </h3>
          <ul className="space-y-2 text-xs text-slate-700">
            {scheme.benefits?.map((b, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Eligibility Card */}
        <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-brand-blue border-b border-blue-100 pb-2 flex items-center">
            <FileCheck className="h-4 w-4 text-brand-blue mr-2" />
            Eligibility Criteria
          </h3>
          <ul className="space-y-2 text-xs text-slate-700">
            {scheme.eligibility?.map((e, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Required Documents */}
      {scheme.requiredDocuments && scheme.requiredDocuments.length > 0 && (
        <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            Required Documents for Application
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {scheme.requiredDocuments.map((docItem, i) => (
              <div key={i} className="flex items-center space-x-2 text-xs text-slate-700 bg-slate-50 p-2 rounded">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                <span>{docItem}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer Bar */}
      <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">Apply on Official Portal</h4>
          <p className="text-xs text-slate-400">Direct link to official ministry or state application gateway.</p>
        </div>

        <div className="flex items-center space-x-3">
          {scheme.officialWebsite && (
            <a
              href={scheme.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2.5 px-4 rounded-lg border border-white/20 transition flex items-center space-x-1"
            >
              <span>Guidelines Portal</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          {scheme.applicationUrl && (
            <a
              href={scheme.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-accent hover:bg-brand-accentHover text-white text-xs font-bold py-2.5 px-5 rounded-lg shadow transition flex items-center space-x-1"
            >
              <span>Apply Online Now</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

    </div>
  );
}
