import React from "react";
import { FileText, ShieldAlert, CheckCircle2, Phone, Mail, MapPin } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | NetDuniya Digital Services Portal",
  description: "Official Terms & Conditions of Service for NetDuniya Digital Services Portal.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 bg-white p-6 sm:p-10 rounded-2xl shadow-card border border-slate-200 text-slate-800 animate-fadeIn">
      
      {/* Header */}
      <div className="border-b pb-5 space-y-2">
        <div className="flex items-center space-x-2 text-brand-blue">
          <FileText className="h-6 w-6 text-brand-blue" />
          <span className="text-xs uppercase font-extrabold tracking-wider bg-blue-50 text-brand-blue px-3 py-1 rounded-full border border-blue-200">
            Terms of Service
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Terms & Conditions</h1>
        <p className="text-xs text-slate-500 font-bold">Effective Date: 26 August 2026</p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 space-y-6">
        <p className="font-medium text-slate-800">
          Welcome to NetDuniya.
        </p>

        <p>
          By accessing or using this website, you agree to these Terms & Conditions.
        </p>

        <p className="font-semibold text-rose-700 bg-rose-50 p-3 rounded-lg border border-rose-200">
          If you do not agree with these terms, please do not use our services.
        </p>

        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">1. Nature of NetDuniya Services</h2>
          <p>NetDuniya provides online assistance and facilitation for various:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2 text-slate-700">
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Government-related services</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Identity/document services</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Banking and certificate-related services</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Online applications</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Government scheme applications</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Bill payment services</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Printing and photo services</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>PVC card services</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Appointment services</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Other digital assistance services</span></li>
          </ul>
          <p className="font-semibold text-slate-900 pt-2">
            NetDuniya acts as a service assistance/facilitation platform unless a particular service is expressly identified as being provided directly by a government authority or other authorised organisation.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">2. User Responsibility</h2>
          <p>Users are responsible for providing:</p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700">
            <li>Correct personal information</li>
            <li>Correct documents</li>
            <li>Valid mobile number</li>
            <li>Correct application details</li>
            <li>Accurate payment information</li>
          </ul>
          <p className="font-bold text-slate-900">
            NetDuniya is not responsible for delays or rejection caused by incorrect, incomplete, false or outdated information provided by the user.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">3. Government Applications</h2>
          <p>Submission of an application through NetDuniya does not guarantee:</p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700">
            <li>Approval</li>
            <li>Certificate issuance</li>
            <li>Government benefit</li>
            <li>Licence issuance</li>
            <li>Scholarship approval</li>
            <li>Scheme eligibility</li>
            <li>Any particular processing time</li>
          </ul>
          <p className="font-bold text-slate-900">
            The final decision belongs to the relevant government department, authority or service provider.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">4. Service Charges</h2>
          <p>Service charges are displayed before payment wherever applicable.</p>
          <p>Government fees, portal fees, convenience charges, processing charges and NetDuniya service charges may be separate depending on the selected service.</p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">5. Payments</h2>
          <p>Payments may be processed through Razorpay or another authorised payment gateway configured by NetDuniya.</p>
          <p>Once a payment is successfully completed, the transaction may be recorded against the relevant application/order.</p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">6. User Account and Wallet</h2>
          <p>Certain features may require a user account.</p>
          <p>Users must keep their login credentials secure.</p>
          <p>Wallet balance, where available, is an internal service balance associated with the user's account and is not a bank account or deposit account.</p>
          <p>Users cannot add wallet funds without an authenticated account.</p>
        </section>

        {/* Section 7 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">7. Appointments</h2>
          <p>Appointment availability depends on the available slots configured by NetDuniya or the relevant service provider.</p>
          <p>An appointment request does not automatically guarantee an appointment unless it is confirmed.</p>
        </section>

        {/* Section 8 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">8. Prohibited Activities</h2>
          <p>Users must not:</p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700">
            <li>Submit fraudulent information</li>
            <li>Upload documents belonging to another person without authorisation</li>
            <li>Attempt unauthorised access</li>
            <li>Manipulate payment systems</li>
            <li>Abuse refunds</li>
            <li>Use the website for unlawful purposes</li>
            <li>Attempt to compromise the website or its infrastructure</li>
          </ul>
        </section>

        {/* Section 9 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">9. Website Availability</h2>
          <p>We try to keep NetDuniya available and functional, but temporary downtime may occur due to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700">
            <li>Maintenance</li>
            <li>Hosting problems</li>
            <li>Internet/network issues</li>
            <li>Government portal downtime</li>
            <li>Payment gateway problems</li>
            <li>Third-party service failures</li>
            <li>Technical issues</li>
          </ul>
        </section>

        {/* Section 10 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">10. Changes to Services</h2>
          <p>NetDuniya may add, remove, modify or temporarily suspend services when necessary.</p>
        </section>

        {/* Section 11 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">11. Intellectual Property</h2>
          <p>The NetDuniya name, branding, original website design, content, graphics and software components owned by NetDuniya may not be copied, reproduced or redistributed without permission.</p>
        </section>

        {/* Section 12 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">12. Acceptance</h2>
          <p className="font-bold text-slate-900">By using NetDuniya, you acknowledge that you have read and accepted these Terms & Conditions.</p>
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
