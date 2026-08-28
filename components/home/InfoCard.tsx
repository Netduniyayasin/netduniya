"use client";

import React, { useEffect, useState } from "react";
import { Info, CheckCircle2, ShieldAlert } from "lucide-react";
import { subscribeToSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/firestore-service";
import { SiteSettings } from "@/lib/types";

export default function InfoCard() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    const unsub = subscribeToSiteSettings((s) => setSettings(s));
    return () => unsub();
  }, []);

  return (
    <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-xl shadow-lg p-5 sm:p-7 border-l-8 border-brand-accent my-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left Content */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400">
            <Info className="h-5 w-5 flex-shrink-0" />
            <span className="text-xs font-bold uppercase tracking-widest bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30">
              Citizen Notice & Portal Guidelines
            </span>
          </div>

          <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white leading-snug">
            {settings.infoCardHeading || "NetDuniya Digital Center - Government, Banking & Citizen Services"}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            {settings.infoCardDescription || "Online assistance for Aadhaar, PAN Card, Certificates, Ration Card, State & Central Govt Schemes, Job Applications, Driving Licence, PVC Card Printing & Fast Track E-Governance."}
          </p>

          {/* Bullet Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {(settings.infoCardBullets && settings.infoCardBullets.length > 0 ? settings.infoCardBullets : DEFAULT_SITE_SETTINGS.infoCardBullets).map((bullet, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-xs text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Badge / Action Callout */}
        <div className="w-full md:w-auto flex-shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-2 border border-amber-400/30">
            <span className="text-2xl">🇮🇳</span>
          </div>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Online Assistance</span>
          <span className="text-[11px] text-slate-300 mt-1">Verified & Secure Portal</span>
          <a
            href="/services"
            className="mt-3 inline-block bg-brand-accent hover:bg-brand-accentHover text-white text-xs font-bold py-2 px-4 rounded-lg shadow transition"
          >
            Explore All Services
          </a>
        </div>

      </div>
    </section>
  );
}
