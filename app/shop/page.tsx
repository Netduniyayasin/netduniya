"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Search, 
  Tag, 
  ShieldCheck, 
  Truck, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { subscribeToShopProducts } from "@/lib/firestore-service";
import { ShopProduct } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function ShopPage() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToShopProducts((data) => {
      setProducts(data);
      setLoading(false);
    }, true);
    return () => unsub();
  }, []);

  const filtered = products.filter(p => {
    return searchQuery === "" || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Banner */}
      <div className="bg-brand-blue text-white rounded-xl p-6 sm:p-8 shadow-card border-b-4 border-pink-500">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-pink-300 bg-white/10 px-3 py-1 rounded">
            E-Kendra Equipment & Citizen Supplies
          </span>
          <h1 className="text-2xl sm:text-4xl font-black mt-2 tracking-tight">
            Digital Hardware, Card Readers & Seva Accessories
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
            Certified biometric fingerprint scanners, smart card reader devices, thermal receipt paper rolls, laminating pouches, and PVC printing supplies for digital seva centers and citizens.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-dashed border-slate-300 space-y-2">
          <ShoppingBag className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No products listed right now.</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Products, biometric devices, and hardware can be added and managed directly from the Admin Panel.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-xl shadow-card hover:shadow-elevated border border-slate-200 overflow-hidden flex flex-col justify-between transition-all duration-200 group"
            >
              <div>
                <div className="h-44 w-full bg-slate-100 overflow-hidden flex items-center justify-center p-2">
                  {prod.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={prod.imageUrl} alt={prod.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                  ) : (
                    <ShoppingBag className="h-12 w-12 text-slate-300" />
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {prod.category || "Supplies"}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-blue transition line-clamp-2">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{prod.description}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-base font-black text-slate-900">
                    {formatCurrency(prod.discountPrice || prod.price)}
                  </span>
                  {prod.discountPrice && (
                    <span className="text-xs text-slate-400 line-through block">
                      {formatCurrency(prod.price)}
                    </span>
                  )}
                </div>

                <Link
                  href={`/shop/${prod.slug}`}
                  className="bg-brand-blue hover:bg-brand-primary text-white text-xs font-bold py-2 px-3 rounded-lg shadow transition"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
