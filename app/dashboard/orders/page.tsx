"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, ShoppingBag, Truck, CheckCircle2, ExternalLink } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { subscribeToUserPVCOrders, subscribeToUserShopOrders } from "@/lib/firestore-service";
import { PVCCardOrder, ShopOrder } from "@/lib/types";
import { formatCurrency, formatDateTime, getStatusBadgeClass, formatStatusLabel } from "@/lib/utils";

export default function UserOrdersPage() {
  const { user } = useAuth();
  const [pvcOrders, setPvcOrders] = useState<PVCCardOrder[]>([]);
  const [shopOrders, setShopOrders] = useState<ShopOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsubPVC = subscribeToUserPVCOrders(user.uid, (data) => {
      setPvcOrders(data);
      setLoading(false);
    });
    const unsubShop = subscribeToUserShopOrders(user.uid, (data) => setShopOrders(data));

    return () => {
      unsubPVC();
      unsubShop();
    };
  }, [user]);

  return (
    <div className="space-y-6">
      
      {/* PVC Orders Card */}
      <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-rose-600" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Smart PVC Card Orders
            </h2>
          </div>
          <Link
            href="/pvc-card"
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow"
          >
            + Order PVC Card
          </Link>
        </div>

        {pvcOrders.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No PVC card orders placed yet.</p>
        ) : (
          <div className="space-y-3">
            {pvcOrders.map((ord) => (
              <div key={ord.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-brand-blue">{ord.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(ord.status)}`}>
                    {formatStatusLabel(ord.status)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{ord.cardType} ({ord.quantity} Copies)</span>
                  <span className="font-black text-emerald-700">{formatCurrency(ord.totalPrice)}</span>
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>Ordered: {formatDateTime(ord.createdAt)}</span>
                  <span>Tracking: <strong>{ord.trackingNumber || "Pending Courier"}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Digital Shop Orders */}
      <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-brand-blue" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Digital Shop Orders
            </h2>
          </div>
        </div>

        {shopOrders.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No hardware or product orders yet.</p>
        ) : (
          <div className="space-y-3">
            {shopOrders.map((ord) => (
              <div key={ord.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-brand-blue">{ord.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(ord.status)}`}>
                    {formatStatusLabel(ord.status)}
                  </span>
                </div>
                <div>
                  {ord.items.map((it, idx) => (
                    <span key={idx} className="font-semibold text-slate-800 block">
                      • {it.productName} × {it.quantity}
                    </span>
                  ))}
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between pt-1 border-t border-slate-200">
                  <span>Total: <strong className="text-emerald-700">{formatCurrency(ord.totalAmount)}</strong></span>
                  <span>{formatDateTime(ord.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
