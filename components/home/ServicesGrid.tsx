"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  CreditCard, 
  Layers, 
  Clock, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  Search,
  Filter
} from "lucide-react";
import { subscribeToServices, subscribeToCategories } from "@/lib/firestore-service";
import { Service, Category } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function ServicesGrid({ initialCategory }: { initialCategory?: string }) {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>(initialCategory || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubServices = subscribeToServices((data) => {
      setServices(data);
      setLoading(false);
    }, true);

    const unsubCategories = subscribeToCategories((cats) => {
      setCategories(cats.filter(c => c.isActive));
    });

    return () => {
      unsubServices();
      unsubCategories();
    };
  }, []);

  const filteredServices = services.filter((srv) => {
    const matchesCat = selectedCat === "all" || srv.categoryId === selectedCat;
    const matchesSearch = searchQuery === "" || 
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      srv.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (srv.categoryName && srv.categoryName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <section className="my-10" id="digital-services">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-3 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Digital Seva Kendra</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            E-Governance & Citizen Digital Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fast, secure online application assistance with end-to-end document verification.
          </p>
        </div>

        {/* Quick Search in Services */}
        <div className="w-full md:w-72">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services (PAN, Income, DL...)"
              className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      {categories.length > 0 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCat("all")}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition shadow-sm ${
              selectedCat === "all"
                ? "bg-brand-blue text-white shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            All Services ({services.length})
          </button>
          {categories.map((cat) => {
            const count = services.filter(s => s.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.id)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition shadow-sm ${
                  selectedCat === cat.id
                    ? "bg-brand-blue text-white shadow-md"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat.name} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>
      )}

      {/* Services Grid Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-xl p-5 border border-slate-200 animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 rounded w-3/4" />
              <div className="h-16 bg-slate-100 rounded" />
              <div className="h-8 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-dashed border-slate-300">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No services available right now.</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {searchQuery ? "No services match your search query. Try another keyword or clear filter." : "The portal administrator can add and publish citizen services from the Admin Panel."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-card hover:shadow-elevated border border-slate-200 overflow-hidden flex flex-col justify-between transition-all duration-300 group service-card"
            >
              <div className="p-5">
                
                {/* Category & Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-brand-blue bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                    {service.categoryName || "Citizen Service"}
                  </span>
                  {service.isFeatured && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center">
                      ★ Popular
                    </span>
                  )}
                </div>

                {/* Service Title */}
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-brand-blue transition line-clamp-2 leading-snug">
                  {service.name}
                </h3>

                {/* Short Description */}
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {service.shortDescription}
                </p>

                {/* Processing Time */}
                {service.processingTime && (
                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 mt-3 bg-slate-50 p-1.5 rounded">
                    <Clock className="h-3.5 w-3.5 text-amber-500" />
                    <span>Processing: <strong>{service.processingTime}</strong></span>
                  </div>
                )}

              </div>

              {/* Price & Apply CTA Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Assistance Fee</span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-lg font-black text-slate-900">
                      {formatCurrency(service.discountPrice || service.price)}
                    </span>
                    {service.discountPrice && service.discountPrice < service.price && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatCurrency(service.price)}
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center space-x-1.5 bg-brand-blue hover:bg-brand-primary text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow transition group-hover:translate-x-0.5"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </section>
  );
}
