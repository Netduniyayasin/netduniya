"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, CheckCircle2, AlertCircle, Phone } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { subscribeToUserAppointments } from "@/lib/firestore-service";
import { Appointment } from "@/lib/types";
import { formatDateTime, getStatusBadgeClass, formatStatusLabel } from "@/lib/utils";

export default function UserAppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToUserAppointments(user.uid, (data) => {
      setAppointments(data);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  return (
    <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
        <div>
          <h1 className="text-lg font-black text-slate-900">My Kendra Appointments</h1>
          <p className="text-xs text-slate-500">Scheduled time slots for document verification & citizen services.</p>
        </div>

        <Link
          href="/appointment"
          className="bg-brand-blue hover:bg-brand-primary text-white text-xs font-bold py-2 px-4 rounded-lg shadow text-center"
        >
          + Book New Slot
        </Link>
      </div>

      {loading ? (
        <p className="text-xs text-slate-400 py-8 text-center">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-300 rounded-xl space-y-2">
          <Calendar className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No appointments scheduled</h3>
          <p className="text-xs text-slate-500">You don't have any pending or past center appointments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="border border-slate-200 rounded-xl p-5 shadow-sm space-y-3 bg-slate-50/50"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-brand-blue">{apt.id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(apt.status)}`}>
                  {formatStatusLabel(apt.status)}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{apt.serviceName}</h3>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Date: <strong>{apt.appointmentDate}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                  <span>Time: <strong>{apt.timeSlot}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-3.5 w-3.5 text-rose-500" />
                  <span>NetDuniya Seva Kendra, Main Market</span>
                </div>
              </div>

              {apt.adminNotes && (
                <div className="bg-amber-50 border border-amber-200 p-2 rounded text-[11px] text-amber-900">
                  <strong>Staff Note:</strong> {apt.adminNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
