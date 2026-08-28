"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Clock, CheckCircle2, XCircle, Search, AlertCircle } from "lucide-react";
import { subscribeToAllAppointments, updateAppointmentStatus } from "@/lib/firestore-service";
import { Appointment, AppointmentStatus } from "@/lib/types";
import { formatDateTime, getStatusBadgeClass, formatStatusLabel } from "@/lib/utils";

export default function AdminAppointmentsPage() {
  const [apts, setApts] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAllAppointments((data) => {
      setApts(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = apts.filter(a => {
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    const matchesSearch = searchQuery === "" ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (id: string, currentStatus: AppointmentStatus) => {
    const newStatus = prompt("Change Status to (confirmed, completed, rescheduled, cancelled, no_show):", currentStatus);
    if (newStatus && ['pending', 'confirmed', 'rescheduled', 'completed', 'cancelled', 'no_show'].includes(newStatus)) {
      const notes = prompt("Staff note (optional):", "");
      await updateAppointmentStatus(id, newStatus as AppointmentStatus, notes || undefined);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
        <div>
          <h1 className="text-lg font-black text-slate-900">Appointment Management & Kendra Slots</h1>
          <p className="text-xs text-slate-500">Manage citizen appointment bookings, attendance, and rescheduling.</p>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
          Total: {apts.length} Bookings
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, phone or service..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-none"
          />
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((st) => (
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

      {loading ? (
        <p className="text-xs text-slate-400 py-6 text-center">Loading appointments...</p>
      ) : filtered.length === 0 ? (
        <p className="text-xs text-slate-400 py-8 text-center border border-dashed rounded-xl">No appointments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Appointment ID</th>
                <th className="p-3">Candidate</th>
                <th className="p-3">Service Required</th>
                <th className="p-3">Date & Slot</th>
                <th className="p-3">Status</th>
                <th className="p-3">Notes</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-brand-blue">{apt.id}</td>
                  <td className="p-3">
                    <span className="font-bold text-slate-900 block">{apt.userName}</span>
                    <span className="text-[10px] text-slate-400">{apt.userPhone}</span>
                  </td>
                  <td className="p-3 font-semibold text-slate-800">{apt.serviceName}</td>
                  <td className="p-3">
                    <span className="font-bold text-slate-900 block">{apt.appointmentDate}</span>
                    <span className="text-[11px] text-amber-600 font-semibold">{apt.timeSlot}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(apt.status)}`}>
                      {formatStatusLabel(apt.status)}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 max-w-xs truncate">{apt.notes || apt.adminNotes || "—"}</td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(apt.id, apt.status)}
                      className="bg-brand-blue hover:bg-brand-primary text-white font-bold px-3 py-1 rounded text-[11px]"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
