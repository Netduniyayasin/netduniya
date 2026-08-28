"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Wallet, 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Lock,
  ArrowRight,
  Smartphone
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { executeWalletTransaction } from "@/lib/firestore-service";
import { formatCurrency } from "@/lib/utils";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  title: string;
  description?: string;
  referenceId: string;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  onSuccess: (paymentDetails: {
    paymentId: string;
    method: 'wallet' | 'razorpay' | 'upi';
    amount: number;
    referenceId?: string;
  }) => Promise<void> | void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  title,
  description,
  referenceId,
  userEmail,
  userName,
  userPhone,
  onSuccess,
}: PaymentModalProps) {
  const { user, profile, walletBalance, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'wallet' | 'online' | 'upi'>('wallet');
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes session

  // Default UPI VPA for NetDuniya
  const merchantUpiId = "9864761058@ybl";
  const merchantName = "NetDuniya Kendra";

  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(600);
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Encoded UPI Intent Link
  const upiIntentString = `upi://pay?pa=${encodeURIComponent(merchantUpiId)}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`NetDuniya_${referenceId}`)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiIntentString)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(merchantUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // 1. Process Wallet Payment
  const handleWalletPay = async () => {
    if (!user) {
      setErrorMsg("Please log in to pay with your digital wallet.");
      return;
    }
    if (walletBalance < amount) {
      setErrorMsg(`Insufficient Wallet Balance. Required: ₹${amount}, Available: ₹${walletBalance}. Please recharge or use UPI / Online payment.`);
      return;
    }

    setProcessing(true);
    setErrorMsg(null);
    try {
      const debitRes = await executeWalletTransaction(
        user.uid,
        amount,
        'debit',
        'service_payment',
        `Payment for ${title} (${referenceId})`,
        referenceId,
        profile?.fullName || user.email || 'citizen'
      );

      if (!debitRes.success) {
        throw new Error(debitRes.error || "Wallet debit failed");
      }

      await refreshProfile();
      await onSuccess({
        paymentId: `WAL-${Date.now()}`,
        method: 'wallet',
        amount,
        referenceId,
      });
      onClose();
    } catch (err: any) {
      console.error("Wallet payment error:", err);
      setErrorMsg(err.message || "Failed to process wallet debit. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // 2. Process Razorpay Online Payment Gateway
  const handleRazorpayPay = async () => {
    setProcessing(true);
    setErrorMsg(null);

    try {
      // 1. Fetch Razorpay Order from server
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: "INR",
          receipt: referenceId,
          notes: {
            title,
            userId: user?.uid || "guest",
            userEmail: userEmail || user?.email || "",
          },
        }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.error || "Failed to initiate payment gateway");
      }

      const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      // Check if Razorpay Checkout SDK is loaded
      const loadRazorpayScript = () => {
        return new Promise<boolean>((resolve) => {
          if (typeof window !== "undefined" && (window as any).Razorpay) {
            resolve(true);
            return;
          }
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const scriptLoaded = await loadRazorpayScript();

      if (scriptLoaded && key_id && key_id.startsWith("rzp_") && !key_id.includes("placeholder")) {
        const options = {
          key: key_id,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "NetDuniya Kendra",
          description: title,
          order_id: orderData.id,
          prefill: {
            name: userName || profile?.fullName || "Citizen",
            email: userEmail || user?.email || "",
            contact: userPhone || profile?.phoneNumber || "",
          },
          theme: {
            color: "#1a365d",
          },
          handler: async function (response: any) {
            try {
              // Verify signature
              const verifyRes = await fetch("/api/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              const verifyData = await verifyRes.json();
              if (verifyData.verified) {
                await onSuccess({
                  paymentId: response.razorpay_payment_id,
                  method: 'razorpay',
                  amount,
                  referenceId,
                });
                onClose();
              } else {
                throw new Error(verifyData.error || "Signature verification failed");
              }
            } catch (err: any) {
              console.error(err);
              setErrorMsg(err.message || "Payment verification failed");
            }
          },
          modal: {
            ondismiss: function () {
              setProcessing(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Fallback to Instant UPI payment tab if Razorpay live merchant keys are pending
        setActiveTab('upi');
        setErrorMsg("Razorpay merchant gateway is in test mode. Please use Instant UPI QR / App Checkout below to complete real payment.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to start online payment. Please try UPI QR payment.");
    } finally {
      setProcessing(false);
    }
  };

  // 3. Process Instant UPI Payment with UTR confirmation
  const handleUpiConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length < 6) {
      setErrorMsg("Please enter a valid 12-digit UPI Reference Number / UTR from your UPI payment app.");
      return;
    }

    setProcessing(true);
    setErrorMsg(null);
    try {
      await onSuccess({
        paymentId: `UPI-${cleanUtr}`,
        method: 'upi',
        amount,
        referenceId,
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to confirm UPI payment.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-brand-blue to-blue-900 text-white p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black shadow">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black leading-tight">Secure Payment Checkout</h2>
              <p className="text-xs text-slate-300">Official NetDuniya E-Governance Gateway</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Order Summary Strip */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Payable For</span>
            <span className="text-xs font-black text-slate-900 truncate max-w-[240px] block">{title}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Total Amount</span>
            <span className="text-xl font-black text-emerald-700">{formatCurrency(amount)}</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-5 mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Payment Method Tabs */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => { setActiveTab('wallet'); setErrorMsg(null); }}
              className={`py-2 px-1 text-xs font-bold rounded-lg transition flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                activeTab === 'wallet'
                  ? "bg-white text-brand-blue shadow-sm font-black ring-1 ring-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Wallet className="h-4 w-4 text-amber-500" />
              <span>Digital Wallet</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('online'); setErrorMsg(null); }}
              className={`py-2 px-1 text-xs font-bold rounded-lg transition flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                activeTab === 'online'
                  ? "bg-white text-brand-blue shadow-sm font-black ring-1 ring-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CreditCard className="h-4 w-4 text-blue-500" />
              <span>Razorpay / Cards</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('upi'); setErrorMsg(null); }}
              className={`py-2 px-1 text-xs font-bold rounded-lg transition flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                activeTab === 'upi'
                  ? "bg-white text-brand-blue shadow-sm font-black ring-1 ring-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <QrCode className="h-4 w-4 text-emerald-500" />
              <span>Instant UPI QR</span>
            </button>
          </div>

          {/* TAB 1: DIGITAL WALLET */}
          {activeTab === 'wallet' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-4 rounded-2xl border border-white/10 shadow-inner flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block">
                    Available Wallet Balance
                  </span>
                  <span className="text-2xl font-black text-amber-300">
                    {formatCurrency(walletBalance)}
                  </span>
                </div>
                <div className="p-2.5 rounded-full bg-amber-400/20 text-amber-400">
                  <Wallet className="h-6 w-6" />
                </div>
              </div>

              {walletBalance >= amount ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center space-x-2.5 text-xs text-emerald-900">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <strong className="block font-bold">Sufficient Balance Available</strong>
                    <span>Instant 1-click payment with 0% extra transaction fee.</span>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-2 text-xs text-amber-900">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                    <strong>Low Wallet Balance</strong>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    You need <strong>{formatCurrency(amount - walletBalance)}</strong> more. Top up wallet or switch to <strong>Instant UPI QR</strong> or <strong>Razorpay</strong> tab above.
                  </p>
                </div>
              )}

              <button
                type="button"
                disabled={walletBalance < amount || processing}
                onClick={handleWalletPay}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-black text-sm rounded-xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing Wallet Debit...</span>
                  </>
                ) : (
                  <>
                    <span>Pay {formatCurrency(amount)} from Wallet &rarr;</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 2: RAZORPAY ONLINE GATEWAY */}
          {activeTab === 'online' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                  <Lock className="h-4 w-4 text-brand-blue" />
                  <span>Razorpay 256-Bit Encrypted Payment Gateway</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pay securely using Credit / Debit Card (Visa, Mastercard, RuPay), NetBanking (SBI, HDFC, ICICI, Axis), UPI, or Mobile Wallets.
                </p>
                <div className="flex items-center space-x-2 text-[10px] text-slate-400 pt-1">
                  <span>Supported:</span>
                  <span className="font-bold text-slate-600">UPI</span> &bull;
                  <span className="font-bold text-slate-600">Cards</span> &bull;
                  <span className="font-bold text-slate-600">NetBanking</span> &bull;
                  <span className="font-bold text-slate-600">Wallets</span>
                </div>
              </div>

              <button
                type="button"
                disabled={processing}
                onClick={handleRazorpayPay}
                className="w-full py-3.5 px-4 bg-brand-blue hover:bg-brand-primary text-white font-black text-sm rounded-xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Opening Payment Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>Pay {formatCurrency(amount)} via Razorpay &rarr;</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 3: INSTANT UPI QR CODE & DIRECT APPS */}
          {activeTab === 'upi' && (
            <div className="space-y-4 animate-fadeIn text-center">
              
              {/* Session Countdown */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border">
                <span>Scan with Any UPI App</span>
                <span className="font-mono font-bold text-amber-600">Expires in: {formattedTime}</span>
              </div>

              {/* QR Code Container */}
              <div className="bg-white p-3 rounded-2xl border-2 border-brand-blue/30 shadow-md inline-block mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={qrCodeUrl} 
                  alt="UPI QR Code" 
                  className="w-44 h-44 sm:w-48 sm:h-48 mx-auto rounded-lg"
                />
              </div>

              {/* UPI ID Copy Strip */}
              <div className="flex items-center justify-center space-x-2 text-xs">
                <span className="text-slate-500">UPI ID:</span>
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border">
                  {merchantUpiId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="p-1 text-brand-blue hover:text-brand-primary font-bold flex items-center space-x-1 cursor-pointer"
                  title="Copy UPI ID"
                >
                  {copiedUpi ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              {/* Direct UPI App Intent Trigger on Mobile */}
              <div className="sm:hidden">
                <a
                  href={upiIntentString}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center space-x-2"
                >
                  <Smartphone className="h-4 w-4" />
                  <span>Open GPay / PhonePe / Paytm Directly</span>
                </a>
              </div>

              {/* UTR Reference Input Form */}
              <form onSubmit={handleUpiConfirm} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left space-y-2.5">
                <label className="block text-xs font-bold text-slate-700">
                  After payment, enter 12-digit UPI UTR / Ref No: *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    required
                    placeholder="e.g. 423456789012"
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                  <button
                    type="submit"
                    disabled={processing}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2 rounded-lg shadow transition cursor-pointer flex items-center space-x-1 flex-shrink-0"
                  >
                    {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Verify & Submit</span>}
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Found in PhonePe / GPay / Paytm payment details receipt.
                </span>
              </form>

            </div>
          )}

        </div>

        {/* Modal Footer Trust Bar */}
        <div className="bg-slate-100 p-3 border-t border-slate-200 text-center text-[10px] text-slate-500 flex items-center justify-center space-x-4">
          <span className="flex items-center space-x-1">
            <Lock className="h-3 w-3 text-slate-400" />
            <span>256-Bit SSL Secured</span>
          </span>
          <span>&bull;</span>
          <span>Instant Confirmation</span>
          <span>&bull;</span>
          <span>Official NetDuniya Receipt</span>
        </div>

      </div>
    </div>
  );
}
