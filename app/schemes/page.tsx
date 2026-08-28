"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Calendar, 
  ArrowRight,
  Sparkles,
  Building,
  CheckCircle2,
  Users
} from "lucide-react";
import { subscribeToSchemes } from "@/lib/firestore-service";
import { GovernmentScheme } from "@/lib/types";

const CATEGORIES = [
  { id: "all", label: "All 100+ Schemes", icon: "🇮🇳" },
  { id: "farmer", label: "Farmers & Agriculture", icon: "🌾" },
  { id: "health", label: "Healthcare & Medical", icon: "🏥" },
  { id: "women", label: "Women & Child", icon: "👩" },
  { id: "housing", label: "Housing & Living", icon: "🏠" },
  { id: "pension", label: "Pension & Security", icon: "🛡️" },
  { id: "business", label: "MSME & Loans", icon: "💼" },
  { id: "education", label: "Scholarships & Youth", icon: "🎓" },
  { id: "social", label: "Social Justice & Divyang", icon: "🤝" },
];

export default function SchemesPage() {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(24);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToSchemes((data) => {
      setSchemes(data);
      setLoading(false);
    }, true);

    return () => unsub();
  }, []);

  const filteredSchemes = schemes.filter((scheme) => {
    const textToSearch = `${scheme.name} ${scheme.description} ${scheme.department} ${scheme.state}`.toLowerCase();
    const matchesSearch = searchQuery === "" || textToSearch.includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (selectedCategory === "farmer") {
      matchesCategory = textToSearch.includes("kisan") || textToSearch.includes("farmer") || textToSearch.includes("agriculture") || textToSearch.includes("fasal") || textToSearch.includes("krishi") || textToSearch.includes("matsya");
    } else if (selectedCategory === "health") {
      matchesCategory = textToSearch.includes("health") || textToSearch.includes("ayushman") || textToSearch.includes("medical") || textToSearch.includes("aushadhi") || textToSearch.includes("arogya") || textToSearch.includes("poshan");
    } else if (selectedCategory === "women") {
      matchesCategory = textToSearch.includes("women") || textToSearch.includes("mahila") || textToSearch.includes("kanya") || textToSearch.includes("sukanya") || textToSearch.includes("matru") || textToSearch.includes("shakti") || textToSearch.includes("behna") || textToSearch.includes("ujjwala");
    } else if (selectedCategory === "housing") {
      matchesCategory = textToSearch.includes("awas") || textToSearch.includes("housing") || textToSearch.includes("jal") || textToSearch.includes("swachh") || textToSearch.includes("toilet") || textToSearch.includes("svanidhi");
    } else if (selectedCategory === "pension") {
      matchesCategory = textToSearch.includes("pension") || textToSearch.includes("bima") || textToSearch.includes("yojana") && (textToSearch.includes("atal") || textToSearch.includes("jeevan") || textToSearch.includes("suraksha") || textToSearch.includes("maandhan"));
    } else if (selectedCategory === "business") {
      matchesCategory = textToSearch.includes("mudra") || textToSearch.includes("msme") || textToSearch.includes("udyam") || textToSearch.includes("vishwakarma") || textToSearch.includes("pmegp") || textToSearch.includes("loan") || textToSearch.includes("business") || textToSearch.includes("startup");
    } else if (selectedCategory === "education") {
      matchesCategory = textToSearch.includes("scholarship") || textToSearch.includes("student") || textToSearch.includes("education") || textToSearch.includes("kaushal") || textToSearch.includes("skill") || textToSearch.includes("yasasvi") || textToSearch.includes("school");
    } else if (selectedCategory === "social") {
      matchesCategory = textToSearch.includes("disability") || textToSearch.includes("divyang") || textToSearch.includes("udid") || textToSearch.includes("adip") || textToSearch.includes("tribal") || textToSearch.includes("sc/st") || textToSearch.includes("minority") || textToSearch.includes("ration");
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto py-2">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-brand-dark to-brand-blue text-white rounded-3xl p-6 sm:p-10 shadow-xl border-l-8 border-emerald-400 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-400/20 text-emerald-300 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-400/30">
            <ShieldCheck className="h-4 w-4" />
            <span>100+ Verified Government Welfare Schemes</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Central & State Government Schemes Directory
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Direct access to 100+ authentic government subsidies, farmer benefits (PM-Kisan), free health insurance (Ayushman Bharat), women welfare (Sukanya Samriddhi, PMMVY), housing grants (PMAY), education scholarships, and zero-collateral Mudra loans.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/appointment"
              className="bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-black text-xs py-2.5 px-4 rounded-xl shadow transition flex items-center space-x-1.5"
            >
              <Users className="h-4 w-4" />
              <span>Assisted Application at Kendra</span>
            </Link>
            <div className="bg-white/10 px-3.5 py-2 rounded-xl text-xs text-slate-200 border border-white/15">
              Live Database: <strong className="text-emerald-300 font-extrabold">{schemes.length} Schemes</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Strip */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-200 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(24);
              }}
              placeholder="Search by scheme name, PM-Kisan, Ayushman, Mudra, State..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          <div className="text-xs text-slate-500 font-bold">
            Showing {Math.min(visibleCount, filteredSchemes.length)} of {filteredSchemes.length} schemes
          </div>

        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                setVisibleCount(24);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition flex items-center space-x-1.5 ${
                selectedCategory === cat.id
                  ? "bg-brand-blue text-white shadow-md"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-56 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredSchemes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 space-y-3">
          <FileText className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No schemes found matching "{searchQuery}".</h3>
          <p className="text-xs text-slate-500">Try searching for other terms like Kisan, Health, Housing, Scholarship, or Loan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSchemes.slice(0, visibleCount).map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-2xl shadow-card hover:shadow-lg border border-slate-200 hover:border-emerald-400 p-5 flex flex-col justify-between space-y-4 transition-all duration-200 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {scheme.state}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {scheme.lastVerifiedDate || "Verified"}
                  </span>
                </div>

                <h2 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition line-clamp-2">
                  {scheme.name}
                </h2>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {scheme.description}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center space-x-1.5 text-xs text-slate-500">
                  <Building className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{scheme.department}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/schemes/${scheme.slug}`}
                  className="text-xs font-bold text-slate-600 hover:text-brand-blue"
                >
                  View Details
                </Link>

                <a
                  href={scheme.applicationUrl || scheme.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 px-3.5 rounded-xl shadow transition flex items-center space-x-1"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredSchemes.length && (
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 24)}
            className="bg-brand-blue hover:bg-brand-primary text-white font-extrabold text-xs py-3 px-8 rounded-full shadow-lg transition active:scale-95"
          >
            Load More Schemes ({filteredSchemes.length - visibleCount} Remaining) &darr;
          </button>
        </div>
      )}

    </div>
  );
}
