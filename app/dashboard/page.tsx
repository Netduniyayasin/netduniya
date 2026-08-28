"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  Calendar, 
  CreditCard, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle 
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { 
  subscribeToUserApplications, 
  subscribeToUserAppointments, 
  subscribeToUserPVCOrders 
} from "@/lib/firestore-service";
import { ServiceApplication, Appointment, PVCCardOrder } from "@/lib/types";
import { formatCurrency, formatDateTime, getStatusBadgeClass, formatStatusLabel } from "@/lib/utils";

export default function DashboardOverviewPage() {
  const { user, walletBalance } = useAuth();
  const [apps, setApps] = useState<ServiceApplication[]>([]);
  const [apts, setApts] = useState<Appointment[]>([]);
  const [pvcOrders, setPvcOrders] = useState<PVCCardOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsubApps = subscribeToUserApplications(user.uid, (data) => {
      setApps(data);
      setLoading(false);
    });
    const unsubApts = subscribeToUserAppointments(user.uid, (data) => setApts(data));
    const unsubPVC = subscribeToUserPVCOrders(user.uid, (data) => setPvcOrders(data));

    return () => {
      unsubApps();
      unsubApts();
      unsubPVC();
    };
  }, [user]);

  const pendingApps = apps.filter(a => ['submitted', 'under_review', 'in_processing', 'documents_required'].includes(a.status));
  const completedApps = apps.filter(a => ['approved', 'completed'].includes(a.status));

  return (
    <div className="space-y-6">
      
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-xl shadow-card border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Active Applications</span>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{pendingApps.length}</p>
          <span className="text-[10px] text-slate-400">In Verification / Processing</span>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-card border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Completed</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{completedApps.length}</p>
          <span className="text-[10px] text-slate-400">Approved & Delivered</span>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-card border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">PVC & Orders</span>
            <CreditCard className="h-4 w-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{pvcOrders.length}</p>
          <span className="text-[10px] text-slate-400">Smart PVC Cards</span>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-card border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Appointments</span>
            <Calendar className="h-4 w-4 text-violet-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{apts.length}</p>
          <span className="text-[10px] text-slate-400">Kendra Slots</span>
        </div>

      </div>

      {/* Recent Applications Table */}
      <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
            Recent Service Applications
          </h2>
          <Link href="/dashboard/applications" className="text-xs font-bold text-brand-blue hover:underline">
            View All ({apps.length})
          </Link>
        </div>

        {loading ? (
          <p className="text-xs text-slate-400">Loading records...</p>
        ) : apps.length === 0 ? (
          <div className="text-center py-8 text-slate-500 space-y-2">
            <FileText className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="text-xs font-bold">You haven't submitted any service applications yet.</p>
            <Link href="/services" className="inline-block bg-brand-blue text-white text-xs font-bold py-2 px-4 rounded-lg shadow">
              Apply for a Digital Service
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Application ID</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Fee Paid</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Submitted</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {apps.slice(0, 5).map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-brand-blue">{app.id}</td>
                    <td className="p-3 font-bold text-slate-900">{app.serviceName}</td>
                    <td className="p-3 text-emerald-700 font-bold">{formatCurrency(app.feePaid)}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(app.status)}`}>
                        {formatStatusLabel(app.status)}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{formatDateTime(app.createdAt)}</td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/track?id=${app.id}`}
                        className="text-brand-blue font-bold hover:underline"
                      >
                        Track →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/services"
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-brand-blue shadow-card hover:shadow-md transition flex items-center justify-between group"
        >
          <div>
            <span className="text-[10px] uppercase font-bold text-brand-blue">Apply for New Service</span>
            <h3 className="text-sm font-black text-slate-900 mt-0.5">Explore PAN, Aadhaar & E-District</h3>
            <p className="text-xs text-slate-500 mt-1">Start a new online application</p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-brand-blue group-hover:translate-x-1 transition" />
        </Link>

        <Link
          href="/pvc-card"
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-rose-400 shadow-card hover:shadow-md transition flex items-center justify-between group"
        >
          <div>
            <span className="text-[10px] uppercase font-bold text-rose-600">Smart Cards</span>
            <h3 className="text-sm font-black text-slate-900 mt-0.5">Order Smart PVC Cards</h3>
            <p className="text-xs text-slate-500 mt-1">₹50/card with doorstep delivery</p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition" />
        </Link>
      </div>

    </div>
  );
}
