"use client";

import React, { useEffect, useState } from "react";
import { 
  ExternalLink, 
  Globe, 
  Landmark, 
  Building2, 
  GraduationCap, 
  FileCheck2, 
  ShieldCheck 
} from "lucide-react";
import { subscribeToImportantLinks } from "@/lib/firestore-service";
import { ImportantLink } from "@/lib/types";

export default function ImportantLinksGrid() {
  const [links, setLinks] = useState<ImportantLink[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToImportantLinks((data) => {
      setLinks(data);
      setLoading(false);
    }, true);

    return () => unsub();
  }, []);

  const categories = ["all", "National", "Government", "Banking", "Certificate", "Education"];

  const filteredLinks = links.filter((link) => {
    return selectedCategory === "all" || link.category === selectedCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Banking":
        return <Landmark className="h-4 w-4 text-emerald-600" />;
      case "National":
      case "Government":
        return <Building2 className="h-4 w-4 text-brand-blue" />;
      case "Education":
        return <GraduationCap className="h-4 w-4 text-purple-600" />;
      case "Certificate":
        return <FileCheck2 className="h-4 w-4 text-amber-600" />;
      default:
        return <Globe className="h-4 w-4 text-sky-600" />;
    }
  };

  return (
    <section className="my-10" id="important-links">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-slate-200 gap-2">
        <div>
          <div className="flex items-center space-x-1.5 text-brand-blue font-bold text-xs uppercase tracking-wider mb-1">
            <Globe className="h-4 w-4 text-sky-500" />
            <span>Official E-Portals</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Important Government & Citizen Links
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Direct access to official central and state government portals and verification gateways.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                selectedCategory === cat
                  ? "bg-brand-blue text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat === "all" ? "All Portals" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Links Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredLinks.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-dashed border-slate-300">
          <Globe className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-600">No important links found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target={link.openInNewTab ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="bg-white rounded-lg p-4 border border-slate-200 hover:border-brand-blue shadow-sm hover:shadow-md transition-all duration-200 flex items-start justify-between group"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-blue-50 transition">
                  {getCategoryIcon(link.category)}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-brand-blue transition line-clamp-1">
                    {link.name}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {link.category}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center">
                      <ShieldCheck className="h-3 w-3 mr-0.5" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-brand-blue group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0 mt-1" />
            </a>
          ))}
        </div>
      )}

    </section>
  );
}
