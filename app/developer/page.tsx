import React from "react";
import Link from "next/link";
import { 
  Globe, 
  Smartphone, 
  Cpu, 
  Mail, 
  MessageCircle, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Terminal,
  Monitor,
  CodeXml,
  Layers,
  Award
} from "lucide-react";

export const metadata = {
  title: "Developer Showcase | Sazzidul Corporation",
  description: "Designed & Developed by Sazzidul Corporation - Modern Websites, Web Applications and Custom Software Solutions.",
};

export default function DeveloperPage() {
  return (
    <div className="space-y-12 animate-fadeIn max-w-5xl mx-auto py-4">
      
      {/* Hero Profile Showcase with Ultra HD Top Developer Image */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-14 shadow-2xl border border-slate-800">
        
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          
          {/* High-Definition Developer Photo Card */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="relative group">
              {/* Outer Golden Gradient Ring */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 opacity-90 blur-sm group-hover:opacity-100 transition duration-500"></div>
              
              {/* Image Container with Crisp Ultra-HD proportions */}
              <div className="relative w-48 h-64 sm:w-60 sm:h-80 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-300 bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/developer.jpg"
                  alt="MD Sazzidul Islam - Lead Software Architect & Founder, Sazzidul Corporation"
                  className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.05] group-hover:scale-105 transition-transform duration-500"
                  style={{ imageRendering: "auto" }}
                />
                
                {/* Bottom Gradient Overlay on Image */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-3 text-center">
                  <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider drop-shadow-md">
                    Lead Tech Architect
                  </span>
                </div>
              </div>
            </div>

            {/* High-Def Verification Badge below photo */}
            <div className="mt-4 inline-flex items-center space-x-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-xs px-4 py-1.5 rounded-full font-black shadow-md border border-amber-200">
              <Award className="h-4 w-4 text-slate-950" />
              <span>Verified Principal Developer</span>
            </div>
          </div>

          {/* Intro & Company Profile */}
          <div className="flex-1 text-center md:text-left space-y-4">
            
            <div className="inline-flex items-center space-x-2 bg-white/10 text-amber-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-white/15 backdrop-blur-md shadow-inner">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>Official Technology Company</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Sazzidul Corporation
              </h1>
              <p className="text-sm sm:text-base font-bold text-amber-300 mt-1">
                Designed & Developed by Sazzidul Corporation
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
              <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider mb-1">About Company</h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Sazzidul Corporation is a digital technology company specializing in modern websites, high-performance web applications, mobile apps, and custom software solutions for businesses and e-governance platforms.
              </p>
            </div>

            {/* Quick Contact Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <a
                href="https://api.whatsapp.com/send?phone=919864761058&text=Hello%20Sazzidul%20Corporation,%20I%20would%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-xs font-black py-3 px-5 rounded-xl shadow-lg transition"
              >
                <MessageCircle className="h-4 w-4 fill-white" />
                <span>WhatsApp: +91 98647 61058</span>
              </a>

              <a
                href="mailto:support.sazzidulcorp@gmail.com"
                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold py-3 px-4 rounded-xl border border-white/20 transition"
              >
                <Mail className="h-4 w-4 text-sky-400" />
                <span>support.sazzidulcorp@gmail.com</span>
              </a>
            </div>

          </div>

        </div>

      </section>

      {/* Services Grid with HD Vector Icons */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-brand-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Professional Engineering
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Services by Sazzidul Corporation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            High-standard architecture, clean code, responsive design, and enterprise-grade reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-200 space-y-3 hover:-translate-y-1 transition duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-blue-100 group-hover:bg-blue-600 text-brand-blue group-hover:text-white flex items-center justify-center font-bold transition">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="font-black text-sm text-slate-900">Website Development</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Modern, SEO-optimized, blazing-fast business and corporate websites with pixel-perfect responsive layouts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-200 space-y-3 hover:-translate-y-1 transition duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 group-hover:bg-indigo-600 text-indigo-700 group-hover:text-white flex items-center justify-center font-bold transition">
              <Monitor className="h-6 w-6" />
            </div>
            <h3 className="font-black text-sm text-slate-900">Web Application Development</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full-stack Next.js, React, Node.js, and Cloud Firestore powered enterprise portals and dashboards.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-200 space-y-3 hover:-translate-y-1 transition duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 group-hover:bg-emerald-600 text-emerald-700 group-hover:text-white flex items-center justify-center font-bold transition">
              <Smartphone className="h-6 w-6" />
            </div>
            <h3 className="font-black text-sm text-slate-900">Mobile App Development</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Modern iOS and Android applications with intuitive user experience, instant notifications, and offline support.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-200 space-y-3 hover:-translate-y-1 transition duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 group-hover:bg-amber-600 text-amber-700 group-hover:text-white flex items-center justify-center font-bold transition">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="font-black text-sm text-slate-900">Custom Software Solutions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tailored business software, billing systems, automated verification APIs, and secure database solutions.
            </p>
          </div>

        </div>
      </section>

      {/* Project Case Study: NetDuniya */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-blue-800">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-white/10 text-amber-300 px-3 py-1 rounded-full text-xs font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Flagship Platform Project</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Project: NetDuniya
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Custom digital service platform designed and developed by <strong>Sazzidul Corporation</strong>. Built for high-concurrency citizen applications, seamless tracking, multi-admin permissions, and encrypted transactions.
            </p>

            <ul className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-200">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Next.js 14 & React Architecture</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Cloud Firestore Live Database</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Role-Based Multi-Admin System</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>256-Bit SSL Encrypted Security</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center space-y-3 flex-shrink-0 w-full sm:w-auto">
            <span className="text-xs text-slate-300 font-bold uppercase tracking-wider block">Platform Status</span>
            <span className="text-2xl font-black text-emerald-400 block">100% Live & Operational</span>
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-3 px-6 rounded-xl shadow transition"
            >
              <span>Explore NetDuniya</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* Official Developer Contact Cards */}
      <section className="bg-white rounded-3xl shadow-card border border-slate-200 p-6 sm:p-10 space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-2xl font-black text-slate-900">Developer Contact & Support</h2>
          <p className="text-xs text-slate-500 mt-1">
            For website design, app development, or custom enterprise software inquiries, reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Official Email</span>
            <p className="text-sm sm:text-base font-black text-slate-900">support.sazzidulcorp@gmail.com</p>
            <a
              href="mailto:support.sazzidulcorp@gmail.com"
              className="inline-flex items-center space-x-1 text-xs font-bold text-brand-blue hover:underline pt-2"
            >
              <span>Send Official Email</span>
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
            <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Direct WhatsApp Chat</span>
            <p className="text-sm sm:text-base font-black text-emerald-950">+91 98647 61058</p>
            <a
              href="https://api.whatsapp.com/send?phone=919864761058&text=Hello%20Sazzidul%20Corporation,%20I%20want%20to%20develop%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 hover:underline pt-2"
            >
              <span>Open Direct WhatsApp</span>
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>

        </div>
      </section>

    </div>
  );
}
