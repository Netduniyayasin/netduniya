"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  User, 
  Phone, 
  Mail, 
  AlertCircle, 
  Loader2,
  ShieldCheck,
  Building,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { createAppointment } from "@/lib/firestore-service";
import { formatCurrency } from "@/lib/utils";

const TIME_SLOTS = [
  "09:30 AM - 10:00 AM",
  "10:00 AM - 10:30 AM",
  "10:30 AM - 11:00 AM",
  "11:00 AM - 11:30 AM",
  "11:30 AM - 12:00 PM",
  "12:00 PM - 12:30 PM",
  "02:00 PM - 02:30 PM",
  "02:30 PM - 03:00 PM",
  "03:00 PM - 03:30 PM",
  "03:30 PM - 04:00 PM",
  "04:00 PM - 04:30 PM",
  "04:30 PM - 05:00 PM",
];

const SERVICE_OPTIONS = [
  "Aadhaar Biometric & Update Verification",
  "Urgent PAN Card Documentation",
  "Income / Caste / Domicile Certificate Verification",
  "Passport Form Verification & Slot Assistance",
  "Driving Licence Document Verification",
  "Scholarship & Scheme Consultation",
  "General Citizen Seva Consultation",
  "Other / Miscellaneous Service (अन्य सेवा)",
];

export default function AppointmentBookingPage() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [serviceName, setServiceName] = useState(SERVICE_OPTIONS[0]);
  const [customService, setCustomService] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [fullName, setFullName] = useState(profile?.fullName || "");
  const [phone, setPhone] = useState(profile?.phoneNumber || "");
  const [email, setEmail] = useState(user?.email || "");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successAptId, setSuccessAptId] = useState<string | null>(null);

  // Minimum date today
  const todayStr = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!appointmentDate) {
      setErrorMsg("Please select an appointment date.");
      return;
    }

    if (!fullName || !phone) {
      setErrorMsg("Please enter your full name and mobile number.");
      return;
    }

    const effectiveServiceName = serviceName === "Other / Miscellaneous Service (अन्य सेवा)" && customService.trim()
      ? `Other: ${customService.trim()}`
      : serviceName;

    const effectiveUserId = user?.uid || `guest-${Date.now()}`;

    setSubmitting(true);
    try {
      const apt = await createAppointment({
        userId: effectiveUserId,
        userName: fullName,
        userEmail: email || (user?.email || "citizen@netduniya.in"),
        userPhone: phone,
        serviceName: effectiveServiceName,
        appointmentDate,
        timeSlot,
        status: 'pending',
        notes,
        feePaid: 0,
        paymentStatus: 'exempt',
      });

      setSuccessAptId(apt.id);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to reserve appointment slot");
    } finally {
      setSubmitting(false);
    }
  };

  if (successAptId) {
    return (
      <div className="max-w-2xl mx-auto py-10 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-elevated border border-emerald-200 p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Appointment Slot Reserved
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
              Appointment ID: <span className="text-brand-blue">{successAptId}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Your appointment for <strong>{serviceName}</strong> has been scheduled on <strong>{appointmentDate}</strong> at <strong>{timeSlot}</strong>.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Applicant:</span>
              <span className="font-bold text-slate-900">{fullName} ({phone})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Center Address:</span>
              <span className="font-bold text-slate-900">NetDuniya Digital Kendra, Main Road</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold text-amber-600">Pending Staff Confirmation</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`/track?id=${successAptId}`}
              className="w-full sm:w-auto bg-brand-blue hover:bg-brand-primary text-white font-bold text-xs py-3 px-6 rounded-lg shadow transition"
            >
              Track Appointment
            </Link>
            <Link
              href="/dashboard/appointments"
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 px-6 rounded-lg transition"
            >
              My Appointments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-violet-900 via-purple-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-card border-l-8 border-violet-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider bg-white/10 text-violet-300 px-3 py-1 rounded">
              Priority Kendra Assistance
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Book Center Appointment Slot
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Skip waiting in lines. Reserve a designated time slot with our certified e-governance service experts for assisted application filing and physical verification.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center flex-shrink-0">
            <span className="text-xs font-bold text-amber-300 uppercase block">Zero Wait Time</span>
            <span className="text-sm font-semibold text-white mt-1 block">Dedicated Desk Assistance</span>
          </div>
        </div>
      </div>

      {/* Form & Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-8 bg-white rounded-xl shadow-card border border-slate-200 p-6 sm:p-8">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-200 pb-3 mb-6 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-violet-600" />
            Select Service & Appointment Slot
          </h2>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Service Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                1. Service Required *
              </label>
              <select
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-violet-600"
              >
                {SERVICE_OPTIONS.map((srv, i) => (
                  <option key={i} value={srv}>{srv}</option>
                ))}
              </select>

              {serviceName === "Other / Miscellaneous Service (अन्य सेवा)" && (
                <div className="pt-1 animate-fadeIn">
                  <label className="block text-xs font-bold text-violet-900 mb-1">
                    Please describe required service / अन्य सेवा का नाम व विवरण *
                  </label>
                  <input
                    type="text"
                    value={customService}
                    onChange={(e) => setCustomService(e.target.value)}
                    required
                    placeholder="e.g. Caste Certificate Renewal / Land Record Copy / EPFO Claim Help"
                    className="w-full bg-violet-50/50 border border-violet-300 rounded-lg p-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-violet-600"
                  />
                </div>
              )}
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  2. Select Date *
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-violet-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  3. Select Time Slot *
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-violet-600"
                >
                  {TIME_SLOTS.map((slot, i) => (
                    <option key={i} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Applicant Details */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                4. Applicant Contact Information
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-700 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Your Full Name"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-700 font-semibold mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="10-digit mobile"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-700 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="youremail@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-700 font-semibold mb-1">Purpose / Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any specific instructions or urgent requirements"
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-sm py-3.5 px-6 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Reserving Slot...</span>
                </>
              ) : (
                <>
                  <CalendarIcon className="h-4 w-4" />
                  <span>Confirm Appointment Reservation</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl shadow-card border border-slate-200 p-5 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b pb-2">
              Appointment Instructions
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Please arrive 10 minutes prior to your booked slot.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Bring original identity documents and copies.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Rescheduling or cancellations can be done via dashboard.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}
