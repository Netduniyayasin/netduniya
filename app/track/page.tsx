"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  CreditCard, 
  Calendar, 
  Truck, 
  ArrowRight,
  ShieldCheck,
  Building
} from "lucide-react";
import { getApplicationById } from "@/lib/firestore-service";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ServiceApplication, PVCCardOrder, Appointment } from "@/lib/types";
import { formatDateTime, formatCurrency, getStatusBadgeClass, formatStatusLabel } from "@/lib/utils";

function TrackContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [searchId, setSearchId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: 'application' | 'pvc' | 'appointment' | null;
    data: any;
  } | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (idToSearch: string) => {
    const cleanId = idToSearch.trim().toUpperCase();
    if (!cleanId) return;

    setLoading(true);
    setNotFound(false);
    setResult(null);

    try {
      if (cleanId.startsWith("ND-APP") || cleanId.includes("APP")) {
        const app = await getApplicationById(cleanId);
        if (app) {
          setResult({ type: 'application', data: app });
          setLoading(false);
          return;
        }
      }

      if (cleanId.startsWith("ND-PVC") || cleanId.includes("PVC")) {
        const snap = await getDoc(doc(db, "pvcOrders", cleanId));
        if (snap.exists()) {
          setResult({ type: 'pvc', data: snap.data() });
          setLoading(false);
          return;
        }
      }

      if (cleanId.startsWith("ND-APT") || cleanId.includes("APT")) {
        const snap = await getDoc(doc(db, "appointments", cleanId));
        if (snap.exists()) {
          setResult({ type: 'appointment', data: snap.data() });
          setLoading(false);
          return;
        }
      }

      // Fallback search across collections
      const appSnap = await getDoc(doc(db, "applications", cleanId));
      if (appSnap.exists()) {
        setResult({ type: 'application', data: appSnap.data() });
        setLoading(false);
        return;
      }

      const pvcSnap = await getDoc(doc(db, "pvcOrders", cleanId));
      if (pvcSnap.exists()) {
        setResult({ type: 'pvc', data: pvcSnap.data() });
        setLoading(false);
        return;
      }

      const aptSnap = await getDoc(doc(db, "appointments", cleanId));
      if (aptSnap.exists()) {
        setResult({ type: 'appointment', data: aptSnap.data() });
        setLoading(false);
        return;
      }

      // Demo Sample Fallback for instant preview / testing
      if (cleanId === "ND-APP-894210" || cleanId.includes("894210")) {
        setResult({
          type: 'application',
          data: {
            id: "ND-APP-894210",
            serviceName: "Instant New PAN Card (UTI/NSDL)",
            applicantName: "Rahul Sharma",
            status: "in_progress",
            feePaid: 107,
            createdAt: Date.now() - 86400000,
            adminNotes: "Physical documents verified. Government submission under processing.",
            timeline: [
              { title: "Application Submitted", timestamp: Date.now() - 86400000, description: "Application received and payment confirmed." },
              { title: "Document Verified", timestamp: Date.now() - 43200000, description: "Aadhaar e-KYC and signature verified by Kendra staff." },
              { title: "Under Processing", timestamp: Date.now() - 14400000, description: "Forwarded to Income Tax Department portal." }
            ]
          }
        });
        setLoading(false);
        return;
      }

      if (cleanId === "ND-PVC-441092" || cleanId.includes("441092")) {
        setResult({
          type: 'pvc',
          data: {
            id: "ND-PVC-441092",
            cardType: "Aadhaar Smart PVC Card",
            quantity: 2,
            status: "dispatched",
            courierName: "Speed Post India",
            trackingNumber: "EW987654321IN",
            deliveryAddress: {
              fullName: "Pooja Verma",
              street: "House 12, Civil Lines",
              city: "Jaipur",
              state: "Rajasthan",
              pincode: "302001"
            }
          }
        });
        setLoading(false);
        return;
      }

      if (cleanId === "ND-APT-772109" || cleanId.includes("772109")) {
        setResult({
          type: 'appointment',
          data: {
            id: "ND-APT-772109",
            serviceName: "Passport Seva Kendra Appointment & Documentation",
            userName: "Suresh Patel",
            appointmentDate: "Tomorrow",
            timeSlot: "11:00 AM - 12:00 PM",
            status: "approved"
          }
        });
        setLoading(false);
        return;
      }

      setNotFound(true);
    } catch (err) {
      console.error(err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      handleSearch(initialId);
    }
  }, [initialId]);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Banner */}
      <div className="bg-brand-blue text-white rounded-xl p-6 sm:p-8 shadow-card border-b-4 border-sky-400 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-sky-300 bg-white/10 px-3 py-1 rounded">
          Real-time Citizen Tracking Portal
        </span>
        <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
          Track Application, PVC Card & Appointment
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-xl mx-auto">
          Enter your unique Tracking ID (e.g. ND-APP-2026-XXXXXX, ND-PVC-2026-XXXXXX) to view instant processing status, document verification notes, and speed post updates.
        </p>

        {/* Search Box */}
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchId); }} className="mt-6 max-w-lg mx-auto flex">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter ID (ND-APP-..., ND-PVC-..., ND-APT-...)"
            className="flex-1 bg-white text-slate-900 px-4 py-3 rounded-l-xl text-xs sm:text-sm font-semibold uppercase focus:outline-none placeholder:normal-case placeholder:text-slate-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-accent hover:bg-brand-accentHover text-white px-6 py-3 rounded-r-xl font-bold text-xs sm:text-sm shadow transition flex items-center"
          >
            {loading ? "Searching..." : "Track Now"}
          </button>
        </form>

        {/* Quick Sample Tracking Numbers for 1-Click Testing */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs text-white/80">
          <span className="text-white/60">Quick Sample Preview:</span>
          <button
            type="button"
            onClick={() => {
              setSearchId("ND-APP-894210");
              handleSearch("ND-APP-894210");
            }}
            className="bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-full text-white font-mono text-[11px] border border-white/20 transition active:scale-95"
          >
            PAN: ND-APP-894210
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchId("ND-PVC-441092");
              handleSearch("ND-PVC-441092");
            }}
            className="bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-full text-white font-mono text-[11px] border border-white/20 transition active:scale-95"
          >
            PVC: ND-PVC-441092
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchId("ND-APT-772109");
              handleSearch("ND-APT-772109");
            }}
            className="bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-full text-white font-mono text-[11px] border border-white/20 transition active:scale-95"
          >
            Appointment: ND-APT-772109
          </button>
        </div>
      </div>

      {/* Result Display */}
      {notFound && (
        <div className="bg-white rounded-xl p-8 border border-rose-200 text-center shadow-card space-y-2">
          <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Record Found</h3>
          <p className="text-xs text-slate-500">
            We could not find any active application or order with ID "{searchId}". Please verify your reference number.
          </p>
        </div>
      )}

      {result && result.type === 'application' && (
        <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2">
            <div>
              <span className="text-[10px] uppercase font-extrabold bg-blue-50 text-brand-blue px-2.5 py-1 rounded">
                Digital Service Application
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">{result.data.serviceName}</h2>
              <p className="text-xs text-slate-500 font-mono">ID: {result.data.id}</p>
            </div>

            <div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusBadgeClass(result.data.status)}`}>
                {formatStatusLabel(result.data.status)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-2.5 rounded">
              <span className="text-slate-400 block">Applicant:</span>
              <span className="font-bold text-slate-800">{result.data.userName}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded">
              <span className="text-slate-400 block">Submitted:</span>
              <span className="font-bold text-slate-800">{formatDateTime(result.data.createdAt)}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded">
              <span className="text-slate-400 block">Fee Paid:</span>
              <span className="font-bold text-emerald-700">{formatCurrency(result.data.feePaid)}</span>
            </div>
          </div>

          {result.data.adminNotes && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 space-y-1">
              <span className="font-bold uppercase tracking-wide flex items-center">
                <AlertCircle className="h-4 w-4 mr-1 text-amber-600" />
                Staff / Verification Note:
              </span>
              <p>{result.data.adminNotes}</p>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b pb-2">
              Application Timeline & Processing Steps
            </h3>
            
            <div className="space-y-4 pl-4 border-l-2 border-brand-blue/30 ml-2">
              {result.data.timeline?.map((item: any, idx: number) => (
                <div key={idx} className="relative space-y-1">
                  <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-brand-blue ring-4 ring-blue-100" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{item.title}</span>
                    <span className="text-[10px] text-slate-400">{formatDateTime(item.timestamp)}</span>
                  </div>
                  <p className="text-xs text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {result && result.type === 'pvc' && (
        <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2">
            <div>
              <span className="text-[10px] uppercase font-extrabold bg-rose-50 text-rose-700 px-2.5 py-1 rounded">
                Smart PVC Card Order
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">{result.data.cardType} ({result.data.quantity} Copies)</h2>
              <p className="text-xs text-slate-500 font-mono">ID: {result.data.id}</p>
            </div>

            <div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusBadgeClass(result.data.status)}`}>
                {formatStatusLabel(result.data.status)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded">
              <span className="text-slate-400 block mb-1">Courier / Speed Post:</span>
              <span className="font-bold text-slate-800">
                {result.data.trackingNumber ? `${result.data.courierName || "India Post"}: ${result.data.trackingNumber}` : "Will be updated after printing"}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded">
              <span className="text-slate-400 block mb-1">Delivery Address:</span>
              <span className="font-semibold text-slate-800">
                {result.data.deliveryAddress?.fullName}, {result.data.deliveryAddress?.street}, {result.data.deliveryAddress?.city}, {result.data.deliveryAddress?.state} - {result.data.deliveryAddress?.pincode}
              </span>
            </div>
          </div>
        </div>
      )}

      {result && result.type === 'appointment' && (
        <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2">
            <div>
              <span className="text-[10px] uppercase font-extrabold bg-violet-50 text-violet-700 px-2.5 py-1 rounded">
                Center Appointment Reservation
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">{result.data.serviceName}</h2>
              <p className="text-xs text-slate-500 font-mono">ID: {result.data.id}</p>
            </div>

            <div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusBadgeClass(result.data.status)}`}>
                {formatStatusLabel(result.data.status)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-2.5 rounded">
              <span className="text-slate-400 block">Date:</span>
              <span className="font-bold text-slate-900">{result.data.appointmentDate}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded">
              <span className="text-slate-400 block">Time Slot:</span>
              <span className="font-bold text-slate-900">{result.data.timeSlot}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded">
              <span className="text-slate-400 block">Candidate:</span>
              <span className="font-bold text-slate-900">{result.data.userName}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading tracking portal...</div>}>
      <TrackContent />
    </Suspense>
  );
}
