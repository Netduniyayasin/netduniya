import React from "react";
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, Phone, Mail, MapPin } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | NetDuniya Digital Services Portal",
  description: "Official Privacy Policy & Data Security terms for NetDuniya Digital Services Portal.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 bg-white p-6 sm:p-10 rounded-2xl shadow-card border border-slate-200 text-slate-800 animate-fadeIn">
      
      {/* Header */}
      <div className="border-b pb-5 space-y-2">
        <div className="flex items-center space-x-2 text-brand-blue">
          <ShieldCheck className="h-6 w-6 text-brand-blue" />
          <span className="text-xs uppercase font-extrabold tracking-wider bg-blue-50 text-brand-blue px-3 py-1 rounded-full border border-blue-200">
            Citizen Privacy & Data Security
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Privacy Policy</h1>
        <p className="text-xs text-slate-500 font-bold">Effective Date: 26 August 2026</p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 space-y-6">
        <p className="font-medium text-slate-800">
          NetDuniya (“NetDuniya”, “we”, “us”, or “our”) respects your privacy and is committed to protecting the personal information you provide while using our website, digital services, application assistance, appointment services, document-related services and payment facilities.
        </p>

        <p>
          By using NetDuniya, you agree to the practices described in this Privacy Policy.
        </p>

        {/* Section 1 */}
        <section className="space-y-2 bg-slate-50/70 p-5 rounded-xl border border-slate-200">
          <h2 className="text-base font-black text-slate-900">1. Information We May Collect</h2>
          <p>Depending on the service selected, we may collect:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2 text-slate-700 font-medium">
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Full name</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Mobile number</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Email address</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Address</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Date of birth</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Government document details</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Aadhaar-related information where required for a requested service</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>PAN-related information</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Voter ID details</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Driving Licence details</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Bank/account-related information where required for a requested service</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Application information</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Uploaded documents and photographs</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Appointment details</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Order/service information</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Payment and transaction references</span></li>
            <li className="flex items-center space-x-2 sm:col-span-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Communication and support information</span></li>
          </ul>
          <p className="pt-2 text-xs text-slate-500 italic">We only request information that is reasonably required to provide or process the requested service.</p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">2. How We Use Your Information</h2>
          <p>Your information may be used to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700">
            <li>Process your selected service</li>
            <li>Submit or assist with applications</li>
            <li>Process appointments and orders</li>
            <li>Verify submitted information</li>
            <li>Communicate application updates</li>
            <li>Provide customer support</li>
            <li>Process payments</li>
            <li>Maintain transaction records</li>
            <li>Prevent fraud and misuse</li>
            <li>Improve our website and services</li>
            <li>Meet applicable legal and regulatory requirements</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">3. Government Documents</h2>
          <p>Some services may require sensitive identity or government-document information.</p>
          <p>Such information is used only for the purpose for which it was submitted or as otherwise permitted by applicable law.</p>
          <p className="font-semibold text-slate-900">NetDuniya does not represent that it is a government department merely because it provides assistance for government-related services.</p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">4. Payment Security</h2>
          <p>Online payments are processed through the payment gateway integrated with NetDuniya.</p>
          <p>NetDuniya does not intentionally store complete card numbers, CVV numbers, UPI PINs, passwords or other payment credentials on its own servers.</p>
          <p>Payment processing is handled through the applicable payment gateway infrastructure.</p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">5. Data Security</h2>
          <p>We use reasonable technical and organisational measures to protect information against unauthorised access, alteration, disclosure, misuse or destruction.</p>
          <p>However, no internet-based system can be guaranteed to be completely secure.</p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">6. Data Sharing</h2>
          <p>We may share information where necessary with:</p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700">
            <li>Government portals or authorised service platforms</li>
            <li>Service providers assisting us in delivering requested services</li>
            <li>Payment gateway/payment service providers</li>
            <li>Technology and hosting providers</li>
            <li>Legal or regulatory authorities where required by law</li>
          </ul>
          <p className="font-bold text-slate-900 pt-1">We do not sell personal information to third parties for unrelated commercial purposes.</p>
        </section>

        {/* Section 7 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">7. Data Retention</h2>
          <p>Information may be retained for as long as reasonably necessary to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700">
            <li>Complete the requested service</li>
            <li>Maintain transaction records</li>
            <li>Resolve disputes</li>
            <li>Meet legal, accounting or regulatory requirements</li>
          </ul>
          <p>Information that is no longer required may be deleted or anonymised subject to applicable legal requirements.</p>
        </section>

        {/* Section 8 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">8. Cookies</h2>
          <p>NetDuniya may use cookies or similar technologies to maintain sessions, remember preferences, improve website functionality and understand website usage.</p>
        </section>

        {/* Section 9 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">9. Third-Party Websites</h2>
          <p>Our website may contain links to government portals, payment services and other third-party websites.</p>
          <p>Once you leave NetDuniya, the third party's own privacy policy and terms apply.</p>
        </section>

        {/* Section 10 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">10. Children's Privacy</h2>
          <p>Our services are not intentionally designed to collect unnecessary personal information from children.</p>
          <p>Where a service involves a minor, the information should be provided by or with the involvement of an appropriate parent, guardian or authorised person where applicable.</p>
        </section>

        {/* Section 11 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">11. Privacy Requests</h2>
          <p>For privacy-related questions, corrections or requests concerning your information, contact us through the support details published on our website.</p>
        </section>

        {/* Section 12 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">12. Policy Updates</h2>
          <p>NetDuniya may update this Privacy Policy when required because of changes in our services, technology or applicable law.</p>
          <p>The latest version will be published on this page.</p>
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
