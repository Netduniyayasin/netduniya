import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Users, 
  Award, 
  Landmark, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  Phone,
  Mail,
  FileText,
  CreditCard,
  Building2,
  Printer,
  Sparkles,
  Zap
} from "lucide-react";
import FounderSection from "@/components/home/FounderSection";

export const metadata = {
  title: "About Us | NetDuniya Digital Services Portal",
  description: "Making Digital Services Simple, Secure & Accessible for everyone across India.",
};

export default function AboutPage() {
  return (
    <div className="space-y-10 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-14 shadow-card border-b-8 border-amber-500 text-center space-y-4">
        <span className="bg-amber-400/20 text-amber-300 font-extrabold uppercase tracking-wider text-xs px-3.5 py-1.5 rounded-full border border-amber-400/30">
          About NetDuniya
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
          Making Digital Services Simple, Secure & Accessible
        </h1>
        <p className="text-sm sm:text-base text-slate-200 max-w-3xl mx-auto leading-relaxed">
          NetDuniya was created with a simple vision — to make digital services easier, faster and more accessible for everyone. We aim to provide a convenient platform where users can find assistance for a wide range of government, documentation, banking, certificate, online application, payment and digital services in one place.
        </p>
      </section>

      {/* Categorized Services Overview */}
      <section className="bg-white rounded-2xl shadow-card border border-slate-200 p-6 sm:p-10 space-y-8">
        <div className="border-b pb-4">
          <h2 className="text-2xl font-black text-slate-900 flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-brand-blue" />
            <span>Our Comprehensive Services</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            NetDuniya brings multiple categories of citizen and digital services together under one unified portal:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Category 1 */}
          <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-200 space-y-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-blue-900 flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-blue-700" />
              <span>1. ID Cards & Government Documents</span>
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" /><span>Aadhaar Card</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" /><span>Voter ID Card</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" /><span>PAN Card</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" /><span>ABHA Card</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" /><span>Ayushman Card</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" /><span>APAAR ID Card</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" /><span>e-Shram Card</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" /><span>Driving Licence</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" /><span>RC PVC Card</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" /><span>Ration Card PVC</span></li>
            </ul>
          </div>

          {/* Category 2 */}
          <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 space-y-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-emerald-900 flex items-center space-x-2">
              <Landmark className="h-4 w-4 text-emerald-700" />
              <span>2. Banking, Certificates & Online Services</span>
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /><span>Money Transfer</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /><span>Account Opening</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /><span>Cash Withdrawal</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /><span>Flight Ticket Booking</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /><span>Railway Ticket Booking</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /><span>Income Certificate</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /><span>Birth Certificate</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /><span>Pollution Certificate</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /><span>e-Khajana</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /><span>Online Form Fill-Up</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /><span>Voter Certified Copy</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /><span>Jamabandi</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /><span>Udyam Registration</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /><span>Learner Licence</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /><span>Driving Licence Services</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /><span>Bio-data / Resume</span></li>
              <li className="flex items-center space-x-1.5 col-span-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /><span>Educational admission assistance</span></li>
            </ul>
          </div>

          {/* Category 3 */}
          <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 space-y-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-amber-900 flex items-center space-x-2">
              <Zap className="h-4 w-4 text-amber-700" />
              <span>3. Government Schemes & Bill Payments</span>
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /><span>PMMVY</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /><span>PM Kisan</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /><span>Farmer Registry</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /><span>PMFBY</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /><span>PMKVY</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /><span>PMAY</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /><span>Orunodoi</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /><span>Mobile Recharge</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /><span>Electricity Bill</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /><span>DTH Recharge</span></li>
              <li className="flex items-center space-x-1.5 col-span-2"><CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /><span>Other available bill-payment services</span></li>
            </ul>
          </div>

          {/* Category 4 */}
          <div className="bg-purple-50/60 p-5 rounded-2xl border border-purple-200 space-y-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-purple-900 flex items-center space-x-2">
              <Printer className="h-4 w-4 text-purple-700" />
              <span>4. Printing & Photo Services</span>
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-purple-600 flex-shrink-0" /><span>Xerox</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-purple-600 flex-shrink-0" /><span>Printout</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-purple-600 flex-shrink-0" /><span>Lamination</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-purple-600 flex-shrink-0" /><span>Passport Photo</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-purple-600 flex-shrink-0" /><span>Photo Frame</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-purple-600 flex-shrink-0" /><span>Binding</span></li>
            </ul>
          </div>

        </div>
      </section>

      {/* Mission & Approach */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-card border border-slate-200 space-y-3">
          <h3 className="text-lg font-black text-slate-900">Our Mission</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Our mission is to make digital services easier to understand and access, especially for people who may need assistance with online applications and digital processes.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-card border border-slate-200 space-y-3">
          <h3 className="text-lg font-black text-slate-900">Our Approach</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /><span>Simple user experience</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /><span>Transparent service info</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /><span>Secure payments</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /><span>Clear application tracking</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /><span>Accessible digital assistance</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /><span>Responsive customer support</span></li>
          </ul>
        </div>
      </section>

      {/* Important Notice */}
      <section className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 sm:p-8 space-y-2 text-xs text-amber-950">
        <h3 className="text-sm font-black uppercase tracking-wider text-amber-900">Important Notice</h3>
        <p className="font-semibold">
          NetDuniya is an independent service-assistance platform. It does not claim to be a government department or official government portal.
        </p>
        <p className="text-amber-900">
          Government applications, approvals and decisions remain under the authority of the relevant government department or authorised organisation.
        </p>
      </section>

      {/* Founder Section */}
      <FounderSection />

      {/* Support & Need Help Section */}
      <section className="bg-white rounded-2xl shadow-card border border-slate-200 p-6 sm:p-8 space-y-4">
        <h3 className="text-xl font-black text-slate-900">Need Help?</h3>
        <p className="text-xs sm:text-sm text-slate-600">
          If you have a question regarding: Application status, Payment, Appointment, Service request, Order, Refund, Technical issue, or Account & wallet, please contact NetDuniya through our official support details below:
        </p>
        <div className="bg-blue-50/70 p-5 rounded-xl border border-blue-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-800 font-medium">
          <p className="flex items-center space-x-2"><Phone className="h-4 w-4 text-brand-blue flex-shrink-0" /><span><strong>Phone:</strong> +91 6001716993</span></p>
          <p className="flex items-center space-x-2"><Mail className="h-4 w-4 text-brand-blue flex-shrink-0" /><span><strong>Email:</strong> netduniya@gmail.com</span></p>
          <p className="flex items-center space-x-2"><MapPin className="h-4 w-4 text-brand-blue flex-shrink-0" /><span><strong>Location:</strong> Khangra Bazar</span></p>
        </div>
        <div className="pt-2 flex justify-center">
          <Link
            href="/services"
            className="bg-brand-accent hover:bg-brand-accentHover text-white font-black text-xs sm:text-sm py-3 px-8 rounded-xl shadow-lg transition flex items-center space-x-1.5"
          >
            <span>Explore All Services</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
