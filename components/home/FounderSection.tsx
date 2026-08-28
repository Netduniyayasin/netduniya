"use client";

import React, { useEffect, useState } from "react";
import { Quote, Linkedin, Twitter, Facebook, Award, ShieldCheck, Sparkles, Building2 } from "lucide-react";
import { subscribeToFounderData, DEFAULT_FOUNDER_DATA } from "@/lib/firestore-service";
import { FounderData } from "@/lib/types";

export default function FounderSection() {
  const [founder, setFounder] = useState<FounderData>(DEFAULT_FOUNDER_DATA);

  useEffect(() => {
    const unsub = subscribeToFounderData((data) => {
      if (data) setFounder(data);
    });
    return () => unsub();
  }, []);

  if (!founder.isVisible) return null;

  return (
    <section className="bg-white rounded-2xl shadow-card border border-slate-200 p-6 sm:p-8 my-8 relative overflow-hidden">
      {/* Decorative background accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full blur-3xl -z-0 opacity-70" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        
        {/* Founder Photo */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden shadow-elevated border-4 border-white ring-4 ring-brand-blue/20 bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={founder.imageUrl || "/images/founder.jpg"}
              alt={founder.name || "Founder, NetDuniya"}
              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/founder.jpg";
              }}
            />
          </div>

          <div className="mt-3 flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-bold">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Verified Founder</span>
          </div>
        </div>

        {/* Founder Content */}
        <div className="flex-1 text-center md:text-left space-y-3">
          
          <div className="inline-flex items-center space-x-2 bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider">
            <Award className="h-3.5 w-3.5" />
            <span>FOUNDER — NETDUNIYA</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {founder.name || "Yasin Khan"}
          </h3>

          <p className="text-xs sm:text-sm font-semibold text-brand-accent">
            {founder.designation || "Founder & Managing Director, NetDuniya"}
          </p>

          <div className="relative bg-slate-50 border-l-4 border-brand-accent p-4 rounded-r-lg">
            <Quote className="h-5 w-5 text-amber-500/40 absolute top-2 right-2" />
            <p className="text-xs sm:text-sm italic text-slate-700 font-medium leading-relaxed">
              "{founder.quote || DEFAULT_FOUNDER_DATA.quote}"
            </p>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {founder.description || DEFAULT_FOUNDER_DATA.description}
          </p>

          {/* Sazzidul Corporation Promotional Badge */}
          <div className="pt-2">
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-3 sm:px-4 sm:py-2.5 rounded-xl border border-indigo-500/30 shadow-md">
              <div className="flex items-center space-x-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <Building2 className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-300">A Digital Initiative & Venture of:</span>
              </div>
              <span className="text-xs sm:text-sm font-black text-amber-300 tracking-wide uppercase flex items-center space-x-1">
                <span>Sazzidul Corporation</span>
                <Sparkles className="h-3.5 w-3.5 text-amber-400 ml-1 inline" />
              </span>
            </div>
          </div>

          {/* Social Links */}
          {founder.socialLinks && (
            <div className="flex items-center justify-center md:justify-start space-x-3 pt-1">
              {founder.socialLinks.linkedin && (
                <a
                  href={founder.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-100 hover:bg-brand-blue hover:text-white text-slate-700 rounded-full transition shadow-sm"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {founder.socialLinks.twitter && (
                <a
                  href={founder.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-100 hover:bg-sky-500 hover:text-white text-slate-700 rounded-full transition shadow-sm"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {founder.socialLinks.facebook && (
                <a
                  href={founder.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-full transition shadow-sm"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
