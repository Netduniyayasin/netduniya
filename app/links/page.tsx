"use client";

import React, { useEffect, useState } from "react";
import { 
  Globe, 
  ExternalLink, 
  Search, 
  ShieldCheck, 
  Landmark, 
  Building2, 
  GraduationCap, 
  FileCheck2 
} from "lucide-react";
import { subscribeToImportantLinks } from "@/lib/firestore-service";
import { ImportantLink } from "@/lib/types";

export default function LinksDirectoryPage() {
  const [links, setLinks] = useState<ImportantLink[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToImportantLinks((data) => {
      setLinks(data);
      setLoading(false);
    }, true);
    return () => unsub();
  }, []);

  const categories = ["all", "National", "Government", "Banking", "Certificate", "Education", "State", "Other"];

  const filtered = links.filter((link) => {
    const matchesCat = selectedCat === "all" || link.category === selectedCat;
    const matchesSearch = searchQuery === "" || 
      link.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (link.description && link.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Banking":
        return <Landmark className="h-5 w-5 text-emerald-600" />;
      case "National":
      case "Government":
        return <Building2 className="h-5 w-5 text-brand-blue" />;
      case "Education":
        return <GraduationCap className="h-5 w-5 text-purple-600" />;
      case "Certificate":
        return <FileCheck2 className="h-5 w-5 text-amber-600" />;
      default:
        return <Globe className="h-5 w-5 text-sky-600" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Banner */}
      <div className="bg-brand-blue text-white rounded-xl p-6 sm:p-8 shadow-card border-b-4 border-cyan-400">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-300 bg-white/10 px-3 py-1 rounded">
            Official E-Governance Gateway
          </span>
          <h1 className="text-2xl sm:text-4xl font-black mt-2 tracking-tight">
            Important Government & Public Service Links
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
            Verified direct URLs to Central Government, State E-District portals, Banking & Income Tax gateways, Passport Seva, Parivahan, UIDAI Aadhaar, DigiLocker, and National Voter Services.
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search portals (Aadhaar, Parivahan, DigiLocker...)"
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex-shrink-0 ${
                selectedCat === cat ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat === "all" ? "All Portals" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Links Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-dashed border-slate-300">
          <Globe className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-700">No links found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search keyword or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target={link.openInNewTab ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="bg-white rounded-xl p-5 border border-slate-200 hover:border-brand-blue shadow-card hover:shadow-elevated transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-blue-50 transition border border-slate-100">
                    {getCategoryIcon(link.category)}
                  </div>
                  <span className="text-[10px] font-extrabold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {link.category}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-blue transition line-clamp-1">
                  {link.name}
                </h3>
                {link.description && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{link.description}</p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold flex items-center text-[11px]">
                  <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                  Official Portal
                </span>
                <span className="text-brand-blue font-bold flex items-center group-hover:underline text-[11px]">
                  Open Gateway
                  <ExternalLink className="h-3.5 w-3.5 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </a>
          ))}
        </div>
      )}

    </div>
  );
}
