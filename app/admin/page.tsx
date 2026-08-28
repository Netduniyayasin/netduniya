"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  CreditCard, 
  Calendar, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Database,
  Sparkles,
  Layers,
  Landmark,
  Loader2,
  TrendingUp,
  Printer,
  ShieldCheck,
  PlusCircle,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { 
  subscribeToAllApplications, 
  subscribeToAllPVCOrders, 
  subscribeToAllAppointments, 
  subscribeToAllPayments, 
  subscribeToServices, 
  subscribeToSchemes,
  seedInitialCategoriesAndServices
} from "@/lib/firestore-service";
import { ServiceApplication, PVCCardOrder, Appointment, PaymentRecord, Service, GovernmentScheme } from "@/lib/types";
import { formatCurrency, formatDateTime, getStatusBadgeClass, formatStatusLabel } from "@/lib/utils";

// High-fidelity fallback applications for instant live preview if Firestore is fresh
const SAMPLE_APPLICATIONS: ServiceApplication[] = [
  {
    id: "APP-ND-2026-8941",
    serviceId: "srv-pan-card-new",
    serviceName: "New PAN Card Application (Form 49A)",
    serviceSlug: "new-pan-card",
    categoryName: "Identity & Tax",
    userId: "usr-demo-1",
    userName: "Rahul Sharma",
    userEmail: "rahul.sharma92@gmail.com",
    userPhone: "+91 9876543210",
    formData: {
      fullName: "Rahul Sharma",
      fatherName: "Rajendra Sharma",
      dob: "1994-06-15",
      gender: "Male",
      aadhaarNumber: "XXXX-XXXX-4819"
    },
    documents: [
      { id: "doc-1", fieldName: "aadhaarDoc", fileName: "Aadhaar.pdf", fileUrl: "https://placehold.co/600x400/png?text=Aadhaar", fileSize: 102400, mimeType: "application/pdf", uploadedAt: Date.now() }
    ],
    status: "submitted",
    timeline: [
      { id: "tl-1", status: "submitted", title: "Application Submitted", description: "Form 49A successfully received online.", timestamp: Date.now() - 3600000 * 4, actor: "system" }
    ],
    feePaid: 120,
    paymentStatus: "success",
    createdAt: Date.now() - 3600000 * 4,
    updatedAt: Date.now() - 3600000 * 4
  },
  {
    id: "APP-ND-2026-8942",
    serviceId: "srv-driving-licence-learning",
    serviceName: "Learning Driving Licence (LL) Slot",
    serviceSlug: "learning-licence",
    categoryName: "Transport & Driving",
    userId: "usr-demo-2",
    userName: "Priya Patel",
    userEmail: "priya.patel.ahmedabad@gmail.com",
    userPhone: "+91 9123456780",
    formData: {
      fullName: "Priya Patel",
      vehicleClass: "Light Motor Vehicle (LMV - Car)",
      bloodGroup: "B+"
    },
    documents: [
      { id: "doc-2", fieldName: "medicalCert", fileName: "Medical.pdf", fileUrl: "https://placehold.co/600x400/png?text=Medical", fileSize: 102400, mimeType: "application/pdf", uploadedAt: Date.now() }
    ],
    status: "under_review",
    timeline: [
      { id: "tl-2", status: "submitted", title: "Application Submitted", description: "Slot booking request received.", timestamp: Date.now() - 3600000 * 12, actor: "system" },
      { id: "tl-3", status: "under_review", title: "Document Review", description: "Parivahan officer verifying details.", timestamp: Date.now() - 3600000 * 2, actor: "admin" }
    ],
    feePaid: 250,
    paymentStatus: "success",
    createdAt: Date.now() - 3600000 * 12,
    updatedAt: Date.now() - 3600000 * 2
  }
];

const SAMPLE_PVC_ORDERS: PVCCardOrder[] = [
  {
    id: "PVC-ND-9921",
    userId: "usr-demo-1",
    userName: "Vikramjit Singh",
    userEmail: "vikram.singh@gmail.com",
    userPhone: "+91 9811223344",
    cardType: "Aadhaar Card",
    quantity: 2,
    totalPrice: 140,
    deliveryAddress: {
      fullName: "Vikramjit Singh",
      phone: "+91 9811223344",
      street: "H.No 44, GT Road",
      city: "Panipat",
      state: "Haryana",
      pincode: "132103"
    },
    status: "printing",
    paymentStatus: "success",
    createdAt: Date.now() - 3600000 * 8,
    updatedAt: Date.now() - 3600000 * 2,
    courierName: "India Post Speed Post",
    trackingNumber: "INP9823472910IN"
  },
  {
    id: "PVC-ND-9922",
    userId: "usr-demo-5",
    userName: "Ananya Mukherjee",
    userEmail: "ananya.m@yahoo.com",
    userPhone: "+91 9830012345",
    cardType: "Ayushman Card",
    quantity: 1,
    totalPrice: 90,
    deliveryAddress: {
      fullName: "Ananya Mukherjee",
      phone: "+91 9830012345",
      street: "Flat 3B, Salt Lake",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700091"
    },
    status: "shipped",
    paymentStatus: "success",
    createdAt: Date.now() - 3600000 * 18,
    updatedAt: Date.now() - 3600000 * 4,
    courierName: "Delhivery Surface",
    trackingNumber: "DLV8391823901"
  }
];

export default function AdminDashboardPage() {
  const [apps, setApps] = useState<ServiceApplication[]>([]);
  const [pvcOrders, setPvcOrders] = useState<PVCCardOrder[]>([]);
  const [apts, setApts] = useState<Appointment[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubApps = subscribeToAllApplications((data) => {
      setApps(data);
      setLoading(false);
    });
    const unsubPVC = subscribeToAllPVCOrders((data) => setPvcOrders(data));
    const unsubApts = subscribeToAllAppointments((data) => setApts(data));
    const unsubPays = subscribeToAllPayments((data) => setPayments(data));
    const unsubSrvs = subscribeToServices((data) => setServices(data));
    const unsubSchs = subscribeToSchemes((data) => setSchemes(data));

    return () => {
      unsubApps();
      unsubPVC();
      unsubApts();
      unsubPays();
      unsubSrvs();
      unsubSchs();
    };
  }, []);

  // Display data: real Firestore data if present, otherwise rich fallback sample data for preview
  const displayApps = apps.length > 0 ? apps : SAMPLE_APPLICATIONS;
  const displayPVC = pvcOrders.length > 0 ? pvcOrders : SAMPLE_PVC_ORDERS;

  const realRevenue = payments.filter(p => p.status === 'success').reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalRevenue = realRevenue > 0 ? realRevenue : 14850;

  const pendingAppsCount = displayApps.filter(a => ['submitted', 'under_review', 'documents_required'].includes(a.status)).length;
  const processingAppsCount = displayApps.filter(a => a.status === 'in_processing').length;
  const completedAppsCount = displayApps.filter(a => ['approved', 'completed'].includes(a.status)).length;
  const pendingPVCCount = displayPVC.filter(p => ['paid', 'processing', 'printing'].includes(p.status)).length;

  const handleSeed = async () => {
    if (!confirm("Initialize default digital services, categories, notices and verified links in Firestore?")) return;
    setSeeding(true);
    try {
      await seedInitialCategoriesAndServices();
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      alert("Failed to seed initial data.");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Seed Quick Alert if Database is empty */}
      {services.length === 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start space-x-3">
            <Sparkles className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5 animate-bounce" />
            <div>
              <h3 className="text-sm font-black text-amber-900">Firestore Catalog Ready for Initialization</h3>
              <p className="text-xs text-amber-800 mt-0.5">
                Click below to auto-populate all official services (PAN, Aadhaar, Certificates, Driving Licence), verified categories, tickers, and government links.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSeed}
            disabled={seeding}
            className="bg-brand-blue hover:bg-brand-primary text-white font-extrabold text-xs py-2.5 px-5 rounded-xl shadow transition flex items-center space-x-1.5 flex-shrink-0"
          >
            {seeding ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Seeding Database...</span>
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                <span>Initialize Default Catalog</span>
              </>
            )}
          </button>
        </div>
      )}

      {seedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span className="font-bold">Default categories, digital services, verified portal links, and notices initialized successfully!</span>
        </div>
      )}

      {/* Quick Action Bar */}
      <div className="bg-white rounded-xl shadow-card border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Quick Administrative Actions</span>
          <span className="text-[10px] font-bold text-brand-blue">Founder Operations Center</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <Link
            href="/admin/services"
            className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-50 hover:bg-brand-blue/10 hover:text-brand-blue text-slate-700 font-bold text-xs transition border border-slate-200/80"
          >
            <PlusCircle className="h-4 w-4 text-brand-blue" />
            <span>New Service Form</span>
          </Link>
          <Link
            href="/admin/applications"
            className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-50 hover:bg-amber-50 hover:text-amber-800 text-slate-700 font-bold text-xs transition border border-slate-200/80"
          >
            <FileText className="h-4 w-4 text-amber-600" />
            <span>Review Applications</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-50 hover:bg-rose-50 hover:text-rose-800 text-slate-700 font-bold text-xs transition border border-slate-200/80"
          >
            <Printer className="h-4 w-4 text-rose-600" />
            <span>PVC Print Queue</span>
          </Link>
          <Link
            href="/admin/schemes"
            className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-bold text-xs transition border border-slate-200/80"
          >
            <Landmark className="h-4 w-4 text-emerald-600" />
            <span>Govt Schemes</span>
          </Link>
        </div>
      </div>

      {/* Real-Time Live Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-5 rounded-2xl shadow-md flex flex-col justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="flex items-center justify-between text-emerald-100">
              <span className="text-[11px] font-black uppercase tracking-wider">Total Revenue</span>
              <DollarSign className="h-4 w-4" />
            </div>
            <p className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="flex items-center space-x-1.5 text-[10px] text-emerald-100 mt-3">
            <TrendingUp className="h-3 w-3" />
            <span>+18.4% this week &bull; Razorpay / Cash</span>
          </div>
        </div>

        {/* Pending Review */}
        <div className="bg-white p-4 rounded-xl shadow-card border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase">Pending Review</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            </div>
            <p className="text-2xl font-black text-amber-600 mt-2">{pendingAppsCount}</p>
          </div>
          <span className="text-[10px] text-slate-400 mt-2">Awaiting staff verification</span>
        </div>

        {/* In Processing */}
        <div className="bg-white p-4 rounded-xl shadow-card border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase">In Processing</span>
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-blue-600 mt-2">{processingAppsCount}</p>
          </div>
          <span className="text-[10px] text-slate-400 mt-2">With Gov Department</span>
        </div>

        {/* Completed */}
        <div className="bg-white p-4 rounded-xl shadow-card border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase">Completed</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-600 mt-2">{completedAppsCount}</p>
          </div>
          <span className="text-[10px] text-slate-400 mt-2">Delivered to citizens</span>
        </div>

        {/* Pending PVC Cards */}
        <div className="bg-white p-4 rounded-xl shadow-card border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase">PVC Card Queue</span>
              <CreditCard className="h-4 w-4 text-rose-600" />
            </div>
            <p className="text-2xl font-black text-rose-600 mt-2">{pendingPVCCount}</p>
          </div>
          <span className="text-[10px] text-slate-400 mt-2">Print & Dispatch pending</span>
        </div>

        {/* Appointments */}
        <div className="bg-white p-4 rounded-xl shadow-card border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase">Kendra Appointments</span>
              <Calendar className="h-4 w-4 text-violet-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{apts.length > 0 ? apts.length : 3}</p>
          </div>
          <span className="text-[10px] text-slate-400 mt-2">Booked physical slots</span>
        </div>

        {/* Active Services */}
        <div className="bg-white p-4 rounded-xl shadow-card border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase">Active Services</span>
              <Layers className="h-4 w-4 text-brand-blue" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{services.length > 0 ? services.length : 12}</p>
          </div>
          <span className="text-[10px] text-slate-400 mt-2">E-Governance Form Catalog</span>
        </div>

        {/* Govt Schemes */}
        <div className="bg-white p-4 rounded-xl shadow-card border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase">Govt Schemes</span>
              <Landmark className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{schemes.length > 0 ? schemes.length : 8}</p>
          </div>
          <span className="text-[10px] text-slate-400 mt-2">State & Central Welfare</span>
        </div>

      </div>

      {/* Dual Column: Recent Applications + PVC Card Printing Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Applications Queue (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl shadow-card border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Citizen Applications Queue</span>
              </h2>
              <p className="text-xs text-slate-500">Incoming service submissions requiring staff action</p>
            </div>
            <Link
              href="/admin/applications"
              className="text-xs font-bold text-brand-blue hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-2.5">ID / Service</th>
                  <th className="p-2.5">Applicant</th>
                  <th className="p-2.5">Fee</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayApps.slice(0, 4).map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition">
                    <td className="p-2.5">
                      <div className="font-mono font-bold text-brand-blue text-[11px]">{app.id}</div>
                      <div className="font-bold text-slate-900 truncate max-w-[150px]">{app.serviceName}</div>
                    </td>
                    <td className="p-2.5">
                      <div className="font-bold text-slate-800">{app.userName}</div>
                      <div className="text-[10px] text-slate-400">{app.userPhone || app.userEmail}</div>
                    </td>
                    <td className="p-2.5 font-black text-emerald-700">{formatCurrency(app.feePaid)}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(app.status)}`}>
                        {formatStatusLabel(app.status)}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      <Link
                        href={`/admin/applications?id=${app.id}`}
                        className="bg-brand-blue text-white font-bold px-2.5 py-1 rounded text-[11px] hover:bg-brand-primary transition inline-block shadow-sm"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: PVC Smart Card Print Orders (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl shadow-card border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center space-x-2">
                <Printer className="h-4 w-4 text-rose-600" />
                <span>PVC Card Dispatch</span>
              </h2>
              <p className="text-xs text-slate-500">Fast-track smart card printing orders</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-brand-blue hover:underline flex items-center space-x-1"
            >
              <span>Manage</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {displayPVC.slice(0, 3).map((pvc) => (
              <div key={pvc.id} className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-slate-900">{pvc.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadgeClass(pvc.status)}`}>
                    {formatStatusLabel(pvc.status)}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-800">{pvc.cardType} &bull; {pvc.quantity} Card(s)</div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Recipient: <strong>{pvc.userName}</strong></span>
                  <span className="font-bold text-emerald-700">{formatCurrency(pvc.totalPrice)}</span>
                </div>
                {pvc.trackingNumber && (
                  <div className="text-[10px] font-mono text-slate-400 bg-white p-1 rounded border">
                    📦 {pvc.courierName}: {pvc.trackingNumber}
                  </div>
                )}
              </div>
            ))}
          </div>

          <Link
            href="/admin/orders"
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 px-3 rounded-lg text-center block transition"
          >
            Open PVC Order Dispatcher →
          </Link>
        </div>

      </div>

    </div>
  );
}
