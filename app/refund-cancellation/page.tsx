import React from "react";
import { RefreshCw, CheckCircle2, AlertCircle, HelpCircle, Phone, Mail, MapPin } from "lucide-react";

export const metadata = {
  title: "Refund & Cancellation Policy | NetDuniya Digital Services Portal",
  description: "Official Refund & Cancellation Policy for NetDuniya Digital Services Portal.",
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 bg-white p-6 sm:p-10 rounded-2xl shadow-card border border-slate-200 text-slate-800 animate-fadeIn">
      
      {/* Header */}
      <div className="border-b pb-5 space-y-2">
        <div className="flex items-center space-x-2 text-brand-blue">
          <RefreshCw className="h-6 w-6 text-brand-blue" />
          <span className="text-xs uppercase font-extrabold tracking-wider bg-blue-50 text-brand-blue px-3 py-1 rounded-full border border-blue-200">
            Payment & Cancellation Terms
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Refund & Cancellation Policy</h1>
        <p className="text-xs text-slate-500 font-bold">Effective Date: 26 August 2026</p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 space-y-6">
        <p className="font-medium text-slate-800">
          NetDuniya provides digital assistance, application processing, appointment assistance and other online services.
        </p>
        <p>
          Because some services may involve immediate processing or third-party/government portal charges, refunds are handled according to the nature and status of the service.
        </p>

        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">1. Before Processing</h2>
          <p>If a user requests cancellation before NetDuniya has started processing the service, the request may be eligible for a refund subject to applicable deductions, if any.</p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">2. After Processing Has Started</h2>
          <p>Once the application/service has entered processing, the service charge may become non-refundable because work may already have been performed.</p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">3. Government Portal Fees</h2>
          <p>Government fees or third-party charges that have already been paid or consumed may not be refundable where the relevant authority or service provider does not provide a refund.</p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">4. Failed Transaction</h2>
          <p>If money is deducted from the customer's bank account but the NetDuniya payment is not successfully recorded, the transaction will be checked.</p>
          <p>If the amount is received by NetDuniya but the service/order cannot be fulfilled, the eligible amount may be refunded.</p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">5. Duplicate Payment</h2>
          <p>If a customer accidentally makes a duplicate payment for the same transaction, the duplicate transaction may be reviewed and refunded where applicable.</p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">6. Application Rejection</h2>
          <p>Government application rejection by itself does not automatically make the NetDuniya service charge refundable.</p>
          <p className="font-semibold text-slate-900">The service charge covers assistance/processing and not a guarantee of government approval.</p>
        </section>

        {/* Section 7 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">7. Appointment Cancellation</h2>
          <p>Appointment cancellation/refund depends on:</p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700">
            <li>Appointment status</li>
            <li>Cancellation timing</li>
            <li>Whether processing has started</li>
            <li>Third-party appointment rules</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">8. Refund Processing</h2>
          <p>Approved refunds will normally be initiated to the original payment method.</p>
          <p>The actual time for the amount to appear in the customer's account may depend on the bank/payment provider. Razorpay's documentation notes that normal refunds can take several working days and that the merchant/business, rather than Razorpay, handles the underlying refund decision.</p>
        </section>

        {/* Section 9 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">9. Refund Request</h2>
          <p>For a refund request, the customer should provide:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2 text-slate-700 font-medium">
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Name</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Mobile number</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Application/Order ID</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Payment ID/transaction reference</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Payment date</span></li>
            <li className="flex items-center space-x-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>Reason for refund</span></li>
          </ul>
        </section>

        {/* Section 10 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">10. Fraudulent Transactions</h2>
          <p>Refunds may be denied or investigated where there is evidence of:</p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700">
            <li>Fraud</li>
            <li>Payment abuse</li>
            <li>False information</li>
            <li>Duplicate misuse</li>
            <li>Unauthorised use</li>
            <li>Violation of these Terms</li>
          </ul>
        </section>

        {/* Section 11 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">11. Contact</h2>
          <p>Refund and cancellation requests should be submitted through the NetDuniya support/contact channel displayed on the website.</p>
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
