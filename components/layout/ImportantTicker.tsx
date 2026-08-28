"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { subscribeToNotices } from "@/lib/firestore-service";
import { NoticeTicker } from "@/lib/types";

export default function ImportantTicker() {
  const [notices, setNotices] = useState<NoticeTicker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToNotices((items) => {
      setNotices(items);
      setLoading(false);
    }, true);

    return () => unsubscribe();
  }, []);

  const defaultText = "★ Welcome to NetDuniya: Your Trusted Digital E-Governance, Documentation, Banking & Citizen Online Application Kendra.";
  const displayNotices = notices.length > 0 ? notices : [{ id: 'def', text: defaultText, priority: 1, isActive: true, createdAt: Date.now() }];

  return (
    <div className="bg-brand-accent text-white py-2 px-3 sm:px-4 shadow-inner overflow-hidden border-y border-amber-600">
      <div className="max-w-7xl mx-auto flex items-center">
        
        {/* Left Orange Tag Badge */}
        <div className="flex-shrink-0 flex items-center space-x-1.5 bg-brand-dark px-3 py-1 rounded text-xs font-black tracking-wider uppercase shadow text-amber-300 mr-3 border border-amber-500/30">
          <AlertCircle className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
          <span>IMPORTANT</span>
        </div>

        {/* Marquee Scrolling Content */}
        <div className="flex-1 overflow-hidden relative text-xs sm:text-sm font-semibold tracking-wide">
          <div className="animate-marquee flex items-center space-x-8 cursor-pointer">
            {displayNotices.map((n, idx) => (
              <span key={`${n.id}-${idx}`} className="flex items-center space-x-2">
                {n.link ? (
                  <Link href={n.link} className="hover:underline flex items-center text-white">
                    {n.text}
                  </Link>
                ) : (
                  <span>{n.text}</span>
                )}
                <span className="text-amber-300 font-bold ml-6">✦</span>
              </span>
            ))}
            {/* Duplicate for seamless infinite marquee loop */}
            {displayNotices.map((n, idx) => (
              <span key={`dup-${n.id}-${idx}`} className="flex items-center space-x-2">
                {n.link ? (
                  <Link href={n.link} className="hover:underline flex items-center text-white">
                    {n.text}
                  </Link>
                ) : (
                  <span>{n.text}</span>
                )}
                <span className="text-amber-300 font-bold ml-6">✦</span>
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
