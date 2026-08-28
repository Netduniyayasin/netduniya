import React from "react";
import Link from "next/link";
import { 
  FileText, 
  Upload, 
  CreditCard, 
  Search, 
  CheckCircle2, 
  Truck, 
  ArrowRight,
  ShieldCheck,
  Clock
} from "lucide-react";

export const metadata = {
  title: "How It Works | NetDuniya Citizen Services",
  description: "Step-by-step guide on how NetDuniya facilitates online e-governance applications, document verification, and smart PVC card deliveries.",
};

const STEPS = [
  {
    num: "01",
    title: "Select Service & Fill Dynamic Form",
    desc: "Browse our 30+ citizen services catalog (PAN Card, Voter ID, Certificates, etc.) and complete the simplified application form on your phone or laptop.",
    icon: FileText,
  },
  {
    num: "02",
    title: "Upload Required Documents Securely",
    desc: "Attach photos or PDF copies of your identity proofs (Aadhaar, old card, photo) directly via our 256-bit encrypted upload portal.",
    icon: Upload,
  },
  {
    num: "03",
    title: "Pay Nominal Facilitation Fee",
    desc: "Checkout securely via NetDuniya Digital Wallet, UPI, QR code, or Debit/Credit Cards powered by Razorpay gateway.",
    icon: CreditCard,
  },
  {
    num: "04",
    title: "Staff Review & Government Submission",
    desc: "Our trained Kendra operations team verifies your documents, eliminates errors, and submits your application directly to the official government department portal.",
    icon: ShieldCheck,
  },
  {
    num: "05",
    title: "Real-Time Tracking & Delivery",
    desc: "Track every step live using your tracking ID (ND-APP-2026-XXXXXX). Receive SMS updates and doorstep speed post delivery of physical cards/certificates.",
    icon: Truck,
  },
];

export default function HowItWorksPage() {
  return (
    <div className="space-y-12 animate-fadeIn max-w-4xl mx-auto">
      
      {/* Header */}
      <section className="text-center space-y-3">
        <span className="bg-blue-100 text-brand-blue font-extrabold uppercase tracking-wider text-xs px-3 py-1 rounded-full">
          Simple 5-Step Process
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          How NetDuniya Citizen Services Work
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          We eliminate long queues, complex government portals, and document formatting errors with transparent online facilitation.
        </p>
      </section>

      {/* Steps vertical list */}
      <section className="space-y-6">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-card border border-slate-200 flex flex-col sm:flex-row sm:items-start gap-6 relative overflow-hidden"
            >
              <div className="flex items-center space-x-4 sm:flex-col sm:items-center sm:space-x-0 sm:space-y-2 flex-shrink-0">
                <span className="text-2xl sm:text-3xl font-black text-brand-accent">{s.num}</span>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center font-bold">
                  <Icon className="h-6 w-6" />
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <h3 className="text-base sm:text-lg font-black text-slate-900">{s.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* CTA */}
      <section className="bg-brand-blue text-white rounded-2xl p-8 text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-black">Ready to get started?</h2>
        <p className="text-xs sm:text-sm text-slate-200 max-w-md mx-auto">
          Choose a service now or book a walk-in appointment at our Kendra center.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/services"
            className="bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-xl shadow transition"
          >
            Browse Services
          </Link>
          <Link
            href="/track"
            className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-xl border border-white/20 transition"
          >
            Track Existing Application
          </Link>
        </div>
      </section>

    </div>
  );
}
