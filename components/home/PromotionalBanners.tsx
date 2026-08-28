"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Shield, Zap, Sparkles } from "lucide-react";
import { subscribeToBanners } from "@/lib/firestore-service";
import { BannerItem } from "@/lib/types";

export default function PromotionalBanners() {
  const [banners, setBanners] = useState<BannerItem[]>([]);

  useEffect(() => {
    const unsub = subscribeToBanners((data) => {
      setBanners(data);
    }, true);
    return () => unsub();
  }, []);

  return (
    <div className="my-6">
      {banners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="relative rounded-xl overflow-hidden shadow-card border border-slate-200 group bg-slate-900 min-h-[160px] flex items-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="relative z-10 p-6 text-white space-y-2 max-w-md">
                <h3 className="text-lg font-black">{banner.title}</h3>
                {banner.subtitle && <p className="text-xs text-slate-200">{banner.subtitle}</p>}
                {banner.linkUrl && (
                  <Link
                    href={banner.linkUrl}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-amber-300 hover:text-amber-200 mt-2"
                  >
                    <span>Check Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Default Visual Banner Feature Row */
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-xl p-4 text-white shadow-card flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">100% Verified</h4>
              <p className="text-xs font-semibold text-white">Government Certified Portals</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-xl p-4 text-white shadow-card flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <Zap className="h-5 w-5 text-amber-200" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200">Express Delivery</h4>
              <p className="text-xs font-semibold text-white">Fast-Track PVC & Application Processing</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-700 to-teal-900 rounded-xl p-4 text-white shadow-card flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">Doorstep Assistance</h4>
              <p className="text-xs font-semibold text-white">WhatsApp & Ticket Support</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
