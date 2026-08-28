"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  FileText, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Send,
  Loader2,
  FileCheck
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { 
  subscribeToAllApplications, 
  updateApplicationStatus 
} from "@/lib/firestore-service";
import { ServiceApplication, ApplicationStatus } from "@/lib/types";
import { formatDateTime, formatCurrency, getStatusBadgeClass, formatStatusLabel } from "@/lib/utils";

function AdminApplicationsContent() {
  const searchParams = useSearchParams();
  const highlightedId = searchParams.get("id");
  const { profile, user } = useAuth();

  const [apps, setApps] = useState<ServiceApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<ServiceApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Status Change Form
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('under_review');
  const [timelineTitle, setTimelineTitle] = useState("");
  const [timelineDesc, setTimelineDesc] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const unsub = subscribeToAllApplications((data) => {
      setApps(data);
      if (highlightedId) {
        const found = data.find(a => a.id === highlightedId);
        if (found) {
          setSelectedApp(found);
          setNewStatus(found.status);
          setAdminNotes(found.adminNotes || "");
        }
      } else if (data.length > 0 && !selectedApp) {
        setSelectedApp(data[0]);
        setNewStatus(data[0].status);
        setAdminNotes(data[0].adminNotes || "");
      }
      setLoading(false);
    });
    return () => unsub();
  }, [highlightedId]);

  const filtered = apps.filter((a) => {
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    const matchesSearch = searchQuery === "" ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSelectApp = (app: ServiceApplication) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setAdminNotes(app.adminNotes || "");
    setTimelineTitle("");
    setTimelineDesc("");
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setUpdating(true);
    try {
      const defaultTitle = `Status updated to ${formatStatusLabel(newStatus)}`;
      const defaultDesc = `Application status changed by staff ${profile?.fullName || user?.email || 'admin'}.`;

      await updateApplicationStatus(
        selectedApp.id,
        newStatus,
        timelineTitle.trim() || defaultTitle,
        timelineDesc.trim() || defaultDesc,
        profile?.fullName || user?.email || 'Admin Staff',
        adminNotes
      );

      alert(`Application ${selectedApp.id} status updated to ${newStatus}`);
      setTimelineTitle("");
      setTimelineDesc("");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to update application status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2">
        <div>
          <h1 className="text-lg font-black text-slate-900">Application Management & Verification</h1>
          <p className="text-xs text-slate-500">Review incoming citizen applications, inspect uploaded documents, and update status timelines.</p>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
          Total: {apps.length} Applications
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, name, email or service..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
          {["all", "submitted", "under_review", "in_processing", "approved", "completed", "rejected"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex-shrink-0 ${
                statusFilter === st ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st === "all" ? "All" : formatStatusLabel(st)}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Application List (5 cols) */}
        <div className="lg:col-span-5 space-y-2 max-h-[650px] overflow-y-auto pr-1">
          {loading ? (
            <p className="text-xs text-slate-400 py-6 text-center">Loading applications...</p>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center border border-dashed rounded-xl text-slate-400 text-xs">
              No applications match filter.
            </div>
          ) : (
            filtered.map((app) => {
              const isSelected = selectedApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => handleSelectApp(app)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition text-xs space-y-1.5 ${
                    isSelected
                      ? "border-brand-blue bg-blue-50/70 shadow-sm ring-1 ring-brand-blue"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-brand-blue">{app.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getStatusBadgeClass(app.status)}`}>
                      {formatStatusLabel(app.status)}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 truncate">{app.serviceName}</h4>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>{app.userName}</span>
                    <span className="font-bold text-emerald-700">{formatCurrency(app.feePaid)}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">{formatDateTime(app.createdAt)}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Application Inspection & Status Update Form (7 cols) */}
        <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-6 space-y-6">
          {selectedApp ? (
            <>
              {/* Header Info */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-brand-blue">{selectedApp.id}</span>
                  <h2 className="text-base font-black text-slate-900 mt-0.5">{selectedApp.serviceName}</h2>
                  <p className="text-xs text-slate-500">
                    Applicant: <strong>{selectedApp.userName}</strong> ({selectedApp.userEmail}, {selectedApp.userPhone})
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(selectedApp.status)}`}>
                  {formatStatusLabel(selectedApp.status)}
                </span>
              </div>

              {/* Form Data Fields Submitted */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Submitted Form Data:</h3>
                <div className="bg-white p-3 rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                  {selectedApp.formData && Object.entries(selectedApp.formData).map(([k, v]) => {
                    if (typeof v === 'string' && (v.startsWith('http') || v.includes('storage'))) return null;
                    return (
                      <div key={k} className="p-1">
                        <span className="text-slate-400 text-[10px] uppercase block">{k}:</span>
                        <strong className="text-slate-800 break-words">{String(v)}</strong>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Uploaded Documents */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Attached Documents:</h3>
                {selectedApp.documents && selectedApp.documents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedApp.documents.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs hover:border-brand-blue shadow-sm"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <FileCheck className="h-4 w-4 text-brand-blue flex-shrink-0" />
                          <span className="truncate font-semibold text-slate-800">{doc.fileName}</span>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 ml-1" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No documents attached.</p>
                )}
              </div>

              {/* Status Update Action Form */}
              <form onSubmit={handleStatusUpdate} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b pb-2">
                  Update Application Status & Timeline Note
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">New Status *</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900"
                    >
                      <option value="under_review">Under Review</option>
                      <option value="in_processing">In Processing</option>
                      <option value="documents_required">Documents Required</option>
                      <option value="approved">Approved</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Timeline Step Title</label>
                    <input
                      type="text"
                      value={timelineTitle}
                      onChange={(e) => setTimelineTitle(e.target.value)}
                      placeholder="e.g. Documents Verified / Application Dispatched"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Public Timeline Description</label>
                  <textarea
                    value={timelineDesc}
                    onChange={(e) => setTimelineDesc(e.target.value)}
                    rows={2}
                    placeholder="Details visible to the applicant on their tracking screen..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Internal Staff Note / Instructions</label>
                  <input
                    type="text"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Internal reference or action note"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full bg-brand-blue hover:bg-brand-primary text-white font-bold text-xs py-2.5 rounded-lg shadow transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Updating Status...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Save & Broadcast Status Change</span>
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Select an application from the left list to inspect details.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default function AdminApplicationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading applications...</div>}>
      <AdminApplicationsContent />
    </Suspense>
  );
}
