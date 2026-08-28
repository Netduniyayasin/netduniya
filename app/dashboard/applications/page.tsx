"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { subscribeToUserApplications } from "@/lib/firestore-service";
import { ServiceApplication } from "@/lib/types";
import { formatCurrency, formatDateTime, getStatusBadgeClass, formatStatusLabel } from "@/lib/utils";

export default function UserApplicationsPage() {
  const { user } = useAuth();
  const [apps, setApps] = useState<ServiceApplication[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedApp, setExpandedApp] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToUserApplications(user.uid, (data) => {
      setApps(data);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const filtered = apps.filter((a) => {
    const matchesStatus = selectedStatus === "all" || a.status === selectedStatus;
    const matchesSearch = searchQuery === "" || 
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
        <div>
          <h1 className="text-lg font-black text-slate-900">My Service Applications</h1>
          <p className="text-xs text-slate-500">Track and inspect all submitted digital service applications.</p>
        </div>

        <Link
          href="/services"
          className="bg-brand-blue hover:bg-brand-primary text-white text-xs font-bold py-2 px-4 rounded-lg shadow text-center"
        >
          + Apply for New Service
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID or service name..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
          {["all", "submitted", "in_processing", "approved", "completed", "rejected"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex-shrink-0 ${
                selectedStatus === st ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st === "all" ? "All" : formatStatusLabel(st)}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <p className="text-xs text-slate-400 py-8 text-center">Loading applications...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-300 rounded-xl space-y-2">
          <FileText className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No applications found.</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any applications matching the selected criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => {
            const isExpanded = expandedApp === app.id;
            return (
              <div
                key={app.id}
                className="border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow transition"
              >
                <div 
                  onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                  className="p-4 sm:p-5 bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-brand-blue text-xs">{app.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(app.status)}`}>
                        {formatStatusLabel(app.status)}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-slate-900">{app.serviceName}</h3>
                    <p className="text-[11px] text-slate-500">Submitted on: {formatDateTime(app.createdAt)}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-4">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase">Fee Paid</span>
                      <span className="text-xs font-black text-emerald-700">{formatCurrency(app.feePaid)}</span>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 bg-white border-t border-slate-200 space-y-5 animate-fadeIn text-xs">
                    
                    {app.adminNotes && (
                      <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-900">
                        <strong className="block mb-0.5 font-bold">Admin / Verification Note:</strong>
                        <p>{app.adminNotes}</p>
                      </div>
                    )}

                    {/* Timeline */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                        Application Processing Steps:
                      </h4>
                      <div className="pl-4 border-l-2 border-brand-blue/40 ml-2 space-y-3">
                        {app.timeline?.map((tl, i) => (
                          <div key={i} className="relative">
                            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-brand-blue" />
                            <div className="flex justify-between font-bold text-slate-800">
                              <span>{tl.title}</span>
                              <span className="text-[10px] text-slate-400 font-normal">{formatDateTime(tl.timestamp)}</span>
                            </div>
                            <p className="text-slate-600 text-[11px]">{tl.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Attached Documents */}
                    {app.documents && app.documents.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                          Attached Verification Documents:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {app.documents.map((doc, idx) => (
                            <a
                              key={idx}
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between hover:bg-slate-100 transition"
                            >
                              <span className="font-medium text-slate-800 truncate">{doc.fileName}</span>
                              <ExternalLink className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 ml-2" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <Link
                        href={`/track?id=${app.id}`}
                        className="text-brand-blue font-bold hover:underline inline-flex items-center text-xs"
                      >
                        Open Public Tracking Page →
                      </Link>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
