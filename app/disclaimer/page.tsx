import React from "react";
import { AlertTriangle, Landmark, ShieldCheck, CheckCircle2, ExternalLink, Phone, Mail, MapPin } from "lucide-react";

export const metadata = {
  title: "Government Portal Disclaimer | NetDuniya Digital Services",
  description: "Official clarification and non-government disclaimer for NetDuniya Digital Services Portal.",
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 bg-white p-6 sm:p-10 rounded-2xl shadow-card border border-slate-200 text-slate-800 animate-fadeIn">
      
      {/* Header */}
      <div className="border-b pb-5 space-y-2">
        <div className="flex items-center space-x-2 text-amber-600">
          <AlertTriangle className="h-6 w-6 text-amber-600" />
          <span className="text-xs uppercase font-extrabold tracking-wider bg-amber-50 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
            Official Clarification
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Government Portal Disclaimer</h1>
        <p className="text-xs text-slate-500 font-bold">Notice to all citizens and portal visitors</p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 space-y-6">
        
        {/* Core Non-Gov Notice */}
        <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-3 text-amber-950">
          <p className="font-bold text-sm leading-snug">
            NetDuniya is an independent digital service assistance platform and is not a government website.
          </p>
          <p className="font-medium text-xs text-amber-900">
            NetDuniya is not affiliated with, owned by, sponsored by, endorsed by or officially operated by any Central Government, State Government, ministry, department or government authority unless specifically stated otherwise.
          </p>
        </div>

        {/* Government Services */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">Government Services</h2>
          <p>NetDuniya may provide assistance for accessing or submitting applications related to government services and schemes.</p>
          <p>Examples may include:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2 text-slate-700">
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /><span>Aadhaar-related assistance</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /><span>PAN services</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /><span>Voter ID services</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /><span>Driving Licence services</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /><span>Ration Card services</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /><span>Ayushman Card services</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /><span>Government certificates</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /><span>Government schemes</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /><span>Scholarship applications</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /><span>Farmer-related services</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /><span>Labour-related services</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" /><span>Other online government services</span></li>
          </ul>
          <p className="font-semibold text-slate-900 pt-2">
            The actual government service, eligibility criteria, approval, rejection, processing time and issuance of documents remain under the control of the relevant government authority.
          </p>
        </section>

        {/* External Government Links */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">External Government Links</h2>
          <p>NetDuniya may provide links to official government portals for user convenience.</p>
          <p>When users click an external government link, they are leaving the NetDuniya website and will be subject to the policies and terms of that external website.</p>
        </section>

        {/* No Guarantee of Approval */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">No Guarantee of Approval</h2>
          <p>Payment of a NetDuniya service charge does not guarantee government approval or successful completion of an application.</p>
          <p>Government authorities may reject an application for reasons including:</p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700">
            <li>Ineligibility</li>
            <li>Incorrect information</li>
            <li>Missing documents</li>
            <li>Document mismatch</li>
            <li>Verification failure</li>
            <li>Technical issues</li>
            <li>Government rules or policy changes</li>
          </ul>
        </section>

        {/* Official Sources */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">Official Sources</h2>
          <p className="font-semibold text-slate-900">
            Users should always verify important information, deadlines, eligibility requirements and government announcements through the relevant official government portal.
          </p>
        </section>

        {/* Official Contact Details Box */}
        <div className="bg-blue-50/70 p-5 rounded-xl border border-blue-200 space-y-2 text-xs text-slate-800 mt-8">
          <h3 className="font-black text-slate-900 text-sm">NetDuniya Support Contact Details</h3>
          <p className="flex items-center space-x-2 font-medium"><Phone className="h-4 w-4 text-brand-blue flex-shrink-0" /><span><strong>Phone:</strong> +91 6001716993</span></p>
          <p className="flex items-center space-x-2 font-medium"><Mail className="h-4 w-4 text-brand-blue flex-shrink-0" /><span><strong>Email:</strong> netduniya@gmail.com</span></p>
          <p className="flex items-center space-x-2 font-medium"><MapPin className="h-4 w-4 text-brand-blue flex-shrink-0" /><span><strong>Location:</strong> Khangra Bazar</span></p>
        </div>

      </div>

    </div>
  );
}
