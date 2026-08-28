"use client";

import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { subscribeToSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/firestore-service";

export default function WhatsAppButton() {
  const [phone, setPhone] = useState(DEFAULT_SITE_SETTINGS.whatsappNumber || "919864761058");
  const [defaultMsg, setDefaultMsg] = useState(
    DEFAULT_SITE_SETTINGS.whatsappDefaultMessage || "Hello NetDuniya, I need assistance with an online service."
  );

  useEffect(() => {
    const unsub = subscribeToSiteSettings((settings) => {
      if (settings?.whatsappNumber) setPhone(settings.whatsappNumber);
      if (settings?.whatsappDefaultMessage) setDefaultMsg(settings.whatsappDefaultMessage);
    });
    return () => unsub();
  }, []);

  // Format clean international phone number (ensure India 91 prefix if 10 digits)
  let cleanDigits = phone.replace(/[^0-9]/g, "");
  if (cleanDigits.length === 10) {
    cleanDigits = `91${cleanDigits}`;
  } else if (!cleanDigits) {
    cleanDigits = "919864761058";
  }

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanDigits}&text=${encodeURIComponent(defaultMsg)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white focus:outline-none"
        aria-label="Direct WhatsApp Assistance"
      >
        <MessageCircle className="h-8 w-8 fill-white text-emerald-500" />
        
        {/* Hover Tooltip on Desktop */}
        <span className="hidden sm:group-hover:block absolute right-16 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap border border-slate-700">
          Chat on WhatsApp: +91 98647 61058
        </span>

        {/* Pulse Ripple Effect */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-30 group-hover:animate-ping -z-10" />
      </a>
    </div>
  );
}
