"use client";

import React, { useEffect, useState } from "react";
import { DollarSign, Search, ShieldCheck, ArrowDownLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import { subscribeToAllPayments } from "@/lib/firestore-service";
import { PaymentRecord } from "@/lib/types";
import { formatCurrency, formatDateTime, getStatusBadgeClass, formatStatusLabel } from "@/lib/utils";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAllPayments((data) => {
      setPayments(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const totalSuccess = payments.filter(p => p.status === 'success').reduce((s, p) => s + p.amount, 0);

  const filtered = payments.filter(p =>
    searchQuery === "" ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
        <div>
          <h1 className="text-lg font-black text-slate-900">Payments & Gateway Transactions</h1>
          <p className="text-xs text-slate-500">Real-time record of Razorpay orders, application fees, wallet top-ups, and refunds.</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-right">
          <span className="text-[10px] uppercase font-bold text-emerald-800 block">Total Revenue Captured</span>
          <span className="text-lg font-black text-emerald-700">{formatCurrency(totalSuccess)}</span>
        </div>
      </div>

      <div className="relative max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Payment ID, user email, or purpose..."
          className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none"
        />
        <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
      </div>

      {loading ? (
        <p className="text-xs text-slate-400 py-6 text-center">Loading payment records...</p>
      ) : filtered.length === 0 ? (
        <p className="text-xs text-slate-400 py-8 text-center border border-dashed rounded-xl">No payments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Payment ID</th>
                <th className="p-3">Customer Email</th>
                <th className="p-3">Purpose</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Gateway Ref</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-brand-blue">{p.id}</td>
                  <td className="p-3 text-slate-800">{p.userEmail}</td>
                  <td className="p-3">
                    <span className="font-semibold text-slate-900 uppercase text-[10px] bg-slate-100 px-2 py-0.5 rounded">
                      {p.purpose.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 font-black text-emerald-700">{formatCurrency(p.amount)}</td>
                  <td className="p-3 font-mono text-[11px] text-slate-500">{p.referenceId || "—"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(p.status)}`}>
                      {formatStatusLabel(p.status)}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">{formatDateTime(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
