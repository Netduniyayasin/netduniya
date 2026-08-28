import React from "react";
import Link from "next/link";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  HelpCircle, 
  LifeBuoy, 
  FileText, 
  Search, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export const metadata = {
  title: "Help & Support | NetDuniya Digital Services Portal",
  description: "Get dedicated assistance and customer support for all digital, government and citizen services on NetDuniya.",
};

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-card border-b-4 border-amber-500">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-black uppercase tracking-wider bg-white/10 text-amber-300 px-3 py-1 rounded">
            Dedicated Customer Care
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            How can we help you today?
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Need help with your application, payment, appointment or PVC card order? Our certified e-governance support team is here to assist you.
          </p>
        </div>
      </div>

      {/* Support Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-200 space-y-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-brand-blue flex items-center justify-center mx-auto">
            <Phone className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Helpline Phone</h3>
          <p className="text-xs text-slate-500">Mon - Sat: 9:00 AM - 8:00 PM</p>
          <a
            href="tel:+916001716993"
            className="block text-xs font-black text-brand-blue hover:underline bg-blue-50 py-2 rounded-lg border border-blue-100"
          >
            +91 6001716993
          </a>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-200 space-y-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <Mail className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Email Support</h3>
          <p className="text-xs text-slate-500">24/7 Response Desk</p>
          <a
            href="mailto:netduniya@gmail.com"
            className="block text-xs font-black text-emerald-700 hover:underline bg-emerald-50 py-2 rounded-lg border border-emerald-100"
          >
            netduniya@gmail.com
          </a>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-200 space-y-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <MapPin className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Center Location</h3>
          <p className="text-xs text-slate-500">Digital Center Address</p>
          <span className="block text-xs font-black text-amber-900 bg-amber-50 py-2 rounded-lg border border-amber-100">
            Khangra Bazar
          </span>
        </div>

      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-200 space-y-3">
          <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
            <Search className="h-5 w-5 text-brand-blue" />
            <span>Track Application or PVC Card</span>
          </h3>
          <p className="text-xs text-slate-600">
            Already applied? Check live progress, review notes, and download approved certificates directly.
          </p>
          <Link
            href="/track"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-blue hover:text-brand-primary"
          >
            <span>Go to Tracking Portal</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-200 space-y-3">
          <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-emerald-600" />
            <span>Support Ticket Desk</span>
          </h3>
          <p className="text-xs text-slate-600">
            Create a support ticket for payment clarification, refund requests, or urgent application corrections.
          </p>
          <Link
            href="/dashboard/support"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            <span>Open Support Ticket</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}
