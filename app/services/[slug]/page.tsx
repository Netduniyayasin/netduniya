"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FileText, 
  Clock, 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  CreditCard, 
  Wallet, 
  Lock,
  Loader2,
  FileCheck
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { 
  getServiceBySlug, 
  uploadDocument, 
  createServiceApplication, 
  executeWalletTransaction,
  createPaymentRecord
} from "@/lib/firestore-service";
import { Service, DynamicFormField, ApplicationDocument } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import PaymentModal from "@/components/payment/PaymentModal";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { user, profile, walletBalance, refreshProfile } = useAuth();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, ApplicationDocument>>({});
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successAppId, setSuccessAppId] = useState<string | null>(null);

  useEffect(() => {
    async function loadService() {
      if (!slug) return;
      setLoading(true);
      const s = await getServiceBySlug(slug);
      setService(s);
      setLoading(false);
    }
    loadService();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <Loader2 className="h-10 w-10 text-brand-blue animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-600">Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center bg-white rounded-xl shadow p-8">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Service Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">The requested service does not exist or has been unpublished.</p>
        <Link href="/services" className="mt-4 inline-block bg-brand-blue text-white text-xs font-bold px-4 py-2 rounded">
          ← Back to All Services
        </Link>
      </div>
    );
  }

  const finalFee = service.discountPrice || service.price;

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleFileUpload = async (field: DynamicFormField, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please upload a smaller document.");
      return;
    }

    setUploadingField(field.name);
    try {
      const uploadRes = await uploadDocument(file, `applications/${slug}`, (prog) => {
        setUploadProgress(prog);
      });

      const docObj: ApplicationDocument = {
        id: `doc-${Date.now()}`,
        fieldName: field.name,
        fileName: uploadRes.fileName,
        fileUrl: uploadRes.url,
        fileSize: uploadRes.fileSize,
        mimeType: uploadRes.mimeType,
        uploadedAt: Date.now(),
      };

      setUploadedDocs(prev => ({ ...prev, [field.name]: docObj }));
      setFormData(prev => ({ ...prev, [field.name]: uploadRes.url }));
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to upload document");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!user) {
      router.push(`/login?redirect=/services/${slug}`);
      return;
    }

    // Validate required text/select fields (No mandatory photo upload on website)
    for (const field of service.formFields) {
      if (field.required && field.type !== 'file') {
        if (!formData[field.name] || formData[field.name].toString().trim() === '') {
          setErrorMsg(`Please fill required field: ${field.label}`);
          return;
        }
      }
    }

    if (finalFee > 0) {
      setIsPaymentModalOpen(true);
      return;
    }

    await handleFinalSubmit({
      paymentId: "FREE",
      method: "wallet",
      amount: 0,
    });
  };

  const handleFinalSubmit = async (paymentDetails: {
    paymentId: string;
    method: 'wallet' | 'razorpay' | 'upi';
    amount: number;
    referenceId?: string;
  }) => {
    if (!user || !service) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      if (paymentDetails.amount > 0 && paymentDetails.method !== 'wallet') {
        await createPaymentRecord({
          userId: user.uid,
          userEmail: user.email || "",
          userName: profile?.fullName || formData['fullName'] || user.email || "Applicant",
          amount: paymentDetails.amount,
          currency: "INR",
          purpose: "service_fee",
          referenceId: service.id,
          status: "success",
        });
      }

      const application = await createServiceApplication({
        userId: user.uid,
        userEmail: user.email || "",
        userName: profile?.fullName || formData['fullName'] || user.email || "Applicant",
        userPhone: profile?.phoneNumber || formData['mobileNumber'] || "",
        serviceId: service.id,
        serviceName: service.name,
        serviceSlug: service.slug,
        categoryName: service.categoryName || "Digital Services",
        feePaid: paymentDetails.amount,
        paymentId: paymentDetails.paymentId,
        paymentStatus: 'success',
        status: 'submitted',
        formData: formData,
        documents: Object.values(uploadedDocs),
      });

      setSuccessAppId(application.id);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  // Success Application Screen
  if (successAppId) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <div className="bg-white rounded-2xl shadow-elevated border border-emerald-200 p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Application Successfully Submitted
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
              Application ID: <span className="text-brand-blue">{successAppId}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto">
              Your application for <strong>{service.name}</strong> has been received with fee payment of {formatCurrency(finalFee)}. Our verification team will review your submitted documents.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Service:</span>
              <span className="font-bold text-slate-900">{service.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estimated Processing:</span>
              <span className="font-bold text-emerald-700">{service.processingTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Documents Attached:</span>
              <span className="font-bold text-slate-900">{Object.keys(uploadedDocs).length} files</span>
            </div>
          </div>

          {/* WhatsApp Document Submission Banner */}
          <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-4 text-left space-y-2.5">
            <span className="font-extrabold text-xs text-emerald-900 flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1.5 text-emerald-600" />
              Document Submission via WhatsApp (Required for Processing)
            </span>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              Aapka Application ID: <strong>{successAppId}</strong> hai. Kripya apne required documents (Aadhaar / Photo / Certificate copy) hamare official WhatsApp number par send karein.
            </p>
            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi NetDuniya, I have submitted Application ID: ${successAppId} for ${service.name}. Please find my documents attached.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-1.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2.5 px-4 rounded-xl shadow transition active:scale-98"
            >
              <span>Send Documents on WhatsApp &rarr;</span>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`/track?id=${successAppId}`}
              className="w-full sm:w-auto bg-brand-blue hover:bg-brand-primary text-white font-bold text-xs py-3 px-6 rounded-lg shadow transition"
            >
              Track Application Status
            </Link>
            <Link
              href="/dashboard/applications"
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 px-6 rounded-lg transition"
            >
              View in My Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/services" className="hover:text-brand-blue flex items-center">
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Back to Services
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">{service.name}</span>
      </div>

      {/* Service Overview Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-card border-l-8 border-brand-accent">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white/10 text-amber-300 px-3 py-1 rounded-md border border-white/10">
              {service.categoryName || "Citizen Service"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{service.name}</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">{service.shortDescription}</p>
            
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
              <span className="flex items-center">
                <Clock className="h-4 w-4 text-amber-400 mr-1.5" />
                Processing: <strong>{service.processingTime}</strong>
              </span>
              <span className="flex items-center">
                <ShieldCheck className="h-4 w-4 text-emerald-400 mr-1.5" />
                100% Government Compliant
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/20 text-center flex-shrink-0">
            <span className="text-[11px] uppercase tracking-wider text-slate-300 block font-semibold">Service Fee</span>
            <div className="flex items-baseline justify-center space-x-2 mt-1">
              <span className="text-3xl font-black text-amber-300">{formatCurrency(finalFee)}</span>
              {service.discountPrice && service.discountPrice < service.price && (
                <span className="text-sm text-slate-400 line-through">{formatCurrency(service.price)}</span>
              )}
            </div>
            <span className="text-[10px] text-emerald-300 block mt-1">Includes Online Assistance & Form Filing</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Form vs Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Dynamic Application Form (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow-card border border-slate-200 p-6 sm:p-8">
          <div className="border-b border-slate-200 pb-4 mb-6">
            <h2 className="text-lg font-black text-slate-900">Application & Verification Form</h2>
            <p className="text-xs text-slate-500 mt-0.5">Please fill the exact details matching your government identity documents.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {service.formFields.map((field) => {
              if (field.type === 'file') {
                return (
                  <div key={field.id} className="space-y-1.5 p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-800">
                        {field.label} (Document ID / Number)
                      </label>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded">
                        Send via WhatsApp
                      </span>
                    </div>
                    
                    <input
                      type="text"
                      value={formData[field.name] || ""}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={`Enter ${field.label} Number / Details (Optional)`}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-brand-blue focus:outline-none"
                    />
                    <p className="text-[11px] text-emerald-700">
                      Physical photo / PDF document form submit karne ke baad hamare official WhatsApp par Application ID ke saath bhej sakte hain.
                    </p>
                  </div>
                );
              }

              if (field.type === 'select') {
                return (
                  <div key={field.id} className="space-y-1">
                    <label className="block text-xs font-bold text-slate-800">
                      {field.label} {field.required && <span className="text-rose-500">*</span>}
                    </label>
                    <select
                      value={formData[field.name] || ""}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      required={field.required}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-brand-blue focus:outline-none"
                    >
                      <option value="">-- Select {field.label} --</option>
                      {field.options?.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (field.type === 'textarea') {
                return (
                  <div key={field.id} className="space-y-1">
                    <label className="block text-xs font-bold text-slate-800">
                      {field.label} {field.required && <span className="text-rose-500">*</span>}
                    </label>
                    <textarea
                      value={formData[field.name] || ""}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      rows={3}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-brand-blue focus:outline-none"
                    />
                  </div>
                );
              }

              return (
                <div key={field.id} className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    {field.label} {field.required && <span className="text-rose-500">*</span>}
                  </label>
                  <input
                    type={field.type}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-brand-blue focus:outline-none"
                  />
                  {field.helpText && <p className="text-[11px] text-slate-400">{field.helpText}</p>}
                </div>
              );
            })}

            {/* Payment Summary */}
            <div className="border-t border-slate-200 pt-6 space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Total Application Fee</span>
                  <span className="text-xl font-black text-slate-900">{formatCurrency(finalFee)}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Wallet / UPI / Razorpay Checkout</span>
                </div>
              </div>
            </div>

            {/* Terms & Submit Button */}
            <div className="pt-4 space-y-4">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                By clicking "Pay & Submit Application", you confirm that the information provided is correct and authorize NetDuniya Kendra to submit and verify your application.
              </p>

              <button
                type="submit"
                disabled={submitting || uploadingField !== null}
                className="w-full bg-brand-accent hover:bg-brand-accentHover text-white font-extrabold text-sm py-3.5 px-6 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing Application & Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Proceed to Pay {formatCurrency(finalFee)} & Submit</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right: Requirements & Instructions Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Required Documents Card */}
          <div className="bg-white rounded-xl shadow-card border border-slate-200 p-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 mb-3">
              Required Documents
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {service.requiredDocuments?.map((docItem, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{docItem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Full Description & Steps */}
          <div className="bg-white rounded-xl shadow-card border border-slate-200 p-5 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              About This Service
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {service.fullDescription}
            </p>
          </div>

        </div>

      </div>

      {service && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          amount={finalFee}
          title={`${service.name} Application Fee`}
          referenceId={`APP-${service.slug.substring(0, 10).toUpperCase()}-${Date.now().toString().slice(-4)}`}
          userEmail={user?.email || ""}
          userName={profile?.fullName || formData['fullName'] || ""}
          userPhone={profile?.phoneNumber || formData['mobileNumber'] || ""}
          onSuccess={handleFinalSubmit}
        />
      )}

    </div>
  );
}
