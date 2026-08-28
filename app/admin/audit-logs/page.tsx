"use client";

import React, { useEffect, useState } from "react";
import { Activity, ShieldCheck, Search, Filter } from "lucide-react";
import { subscribeToAuditLogs } from "@/lib/firestore-service";
import { AuditLog } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAuditLogs((data) => {
      setLogs(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = logs.filter(l =>
    searchQuery === "" ||
    l.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
        <div>
          <h1 className="text-lg font-black text-slate-900">Security & Administrative Audit Trail</h1>
          <p className="text-xs text-slate-500">Immutable ledger recording all staff actions, wallet balance changes, status updates, and settings changes.</p>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg flex items-center space-x-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>{logs.length} Recorded Actions</span>
        </span>
      </div>

      <div className="relative max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by staff name, action, or details..."
          className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none"
        />
        <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
      </div>

      {loading ? (
        <p className="text-xs text-slate-400 py-6 text-center">Loading audit logs...</p>
      ) : filtered.length === 0 ? (
        <p className="text-xs text-slate-400 py-8 text-center border rounded">No audit events recorded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Staff Actor</th>
                <th className="p-3">Module</th>
                <th className="p-3">Action</th>
                <th className="p-3">Record Ref</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="p-3 text-slate-500 whitespace-nowrap">{formatDateTime(log.timestamp)}</td>
                  <td className="p-3 font-sans">
                    <strong className="text-slate-900 block">{log.actorName}</strong>
                    <span className="text-[10px] text-slate-400">({log.actorRole})</span>
                  </td>
                  <td className="p-3 font-bold text-brand-blue uppercase text-[10px]">{log.module}</td>
                  <td className="p-3 font-bold text-slate-800">{log.action}</td>
                  <td className="p-3 text-slate-500 text-[11px]">{log.recordId || "—"}</td>
                  <td className="p-3 font-sans text-slate-700 max-w-md">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
