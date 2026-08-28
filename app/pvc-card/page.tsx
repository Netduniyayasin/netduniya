"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Wallet, 
  AlertCircle, 
  Sparkles,
  Printer,
  PhoneCall,
  MessageCircle,
  HelpCircle,
  Hash,
  User,
  MapPin
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { 
  createPVCOrder, 
  executeWalletTransaction, 
  createPaymentRecord,
  subscribeToSiteSettings,
  DEFAULT_SITE_SETTINGS
} from "@/lib/firestore-service";
import { PVCCardOrder, SiteSettings } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import PaymentModal from "@/components/payment/PaymentModal";

interface CardOption {
  type: PVCCardOrder['cardType'];
  title: string;
  hindiTitle: string;
  placeholder: string;
  icon: string;
}

const CARD_OPTIONS: CardOption[] = [
  {
    type: 'Aadhaar Card',
    title: 'Aadhaar Card',
    hindiTitle: 'आधार कार्ड',
    placeholder: 'Enter 12-digit Aadhaar Number (e.g. 1234 5678 9012)',
    icon: '🆔'
  },
  {
    type: 'Voter ID',
    title: 'Voter ID Card (EPIC)',
    hindiTitle: 'वोटर कार्ड',
    placeholder: 'Enter Voter EPIC Number (e.g. ABC1234567)',
    icon: '🗳️'
  },
  {
    type: 'Driving Licence',
    title: 'Driving Licence (DL)',
    hindiTitle: 'ड्राइविंग लाइसेंस',
    placeholder: 'Enter Driving Licence Number (e.g. DL-0420110012345)',
    icon: '🚗'
  },
  {
    type: 'Ayushman Card',
    title: 'Ayushman Bharat Card',
    hindiTitle: 'आयुष्मान गोल्डन कार्ड',
    placeholder: 'Enter ABHA / PM-JAY ID (e.g. 14-digit ABHA Number)',
    icon: '🏥'
  },
  {
    type: 'PAN Card',
    title: 'PAN Card',
    hindiTitle: 'पैन कार्ड',
    placeholder: 'Enter 10-character PAN (e.g. ABCDE1234F)',
    icon: '💳'
  },
  {
    type: 'Custom ID',
    title: 'Other Smart Card / ID',
    hindiTitle: 'अन्य स्मार्ट कार्ड',
    placeholder: 'Enter Card Identifier / Reference Number',
    icon: '✨'
  },
];

export default function PVCCardOrderPage() {
  const { user, profile, walletBalance, refreshProfile } = useAuth();

  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [selectedCard, setSelectedCard] = useState<CardOption>(CARD_OPTIONS[0]);
  const [cardIdentifier, setCardIdentifier] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  // Delivery Address
  const [fullName, setFullName] = useState(profile?.fullName || "");
  const [phone, setPhone] = useState(profile?.phoneNumber || "");
  const [street, setStreet] = useState(profile?.address || "");
  const [city, setCity] = useState(profile?.city || "");
  const [state, setState] = useState(profile?.state || "");
  const [pincode, setPincode] = useState(profile?.pincode || "");

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToSiteSettings((s) => setSettings(s));
    return () => unsub();
  }, []);

  // Admin dynamic price
  const pricePerCard = settings.pvcCardPrice ?? 50;
  const originalPrice = settings.pvcCardOriginalPrice ?? (pricePerCard * 2);
  const totalPrice = quantity * pricePerCard;
  const whatsappNumber = settings.whatsappNumber || "919876543210";

  const handleCardTypeSelect = (opt: CardOption) => {
    setSelectedCard(opt);
    setCardIdentifier("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!cardIdentifier.trim()) {
      setErrorMsg(`Please enter your ${selectedCard.title} Number / ID.`);
      return;
    }

    if (!fullName || !phone || !street || !city || !state || !pincode) {
      setErrorMsg("Please fill complete delivery address fields.");
      return;
    }

    setIsPaymentModalOpen(true);
  };

  const handleFinalPVCOrder = async (paymentDetails: {
    paymentId: string;
    method: 'wallet' | 'razorpay' | 'upi';
    amount: number;
    referenceId?: string;
  }) => {
    setSubmitting(true);
    setErrorMsg(null);

    const currentUserId = user?.uid || `guest-${Date.now()}`;
    const userEmail = user?.email || "citizen@netduniya.in";

    try {
      if (paymentDetails.amount > 0 && paymentDetails.method !== 'wallet') {
        await createPaymentRecord({
          userId: currentUserId,
          userEmail: userEmail,
          userName: fullName,
          amount: totalPrice,
          currency: "INR",
          purpose: "pvc_order",
          referenceId: `PVC-${selectedCard.type}`,
          status: "success",
        });
      }

      const order = await createPVCOrder({
        userId: currentUserId,
        userName: fullName,
        userEmail: userEmail,
        userPhone: phone,
        cardType: selectedCard.type,
        cardIdentifier: cardIdentifier.trim(),
        quantity,
        totalPrice,
        deliveryAddress: {
          fullName,
          phone,
          street,
          city,
          state,
          pincode,
        },
        status: 'paid',
        paymentStatus: 'success',
        paymentId: paymentDetails.paymentId,
      });

      setSuccessOrderId(order.id);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to submit PVC Card order");
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (successOrderId) {
    const whatsappMsg = `Hi NetDuniya, I have placed PVC Card Order ID: ${successOrderId} for ${quantity} copy of ${selectedCard.type} (Card ID: ${cardIdentifier}). Please find my document attached for printing.`;
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(whatsappMsg)}`;

    return (
      <div className="max-w-2xl mx-auto py-8 px-4 animate-fadeIn">
        <div className="bg-white rounded-3xl shadow-xl border border-emerald-200 p-6 sm:p-10 text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="h-12 w-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-black tracking-widest text-emerald-700 bg-emerald-100 px-4 py-1.5 rounded-full border border-emerald-200">
              Order Placed Successfully
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              PVC Order ID: <span className="text-brand-blue">{successOrderId}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Your order for <strong>{quantity} × {selectedCard.title}</strong> has been received and logged into our printing queue.
            </p>
          </div>

          {/* CRITICAL WHATSAPP SUBMISSION BANNER */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-500 rounded-2xl p-5 text-left space-y-3 shadow-md">
            <div className="flex items-center space-x-2 text-emerald-900 font-extrabold text-sm">
              <MessageCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <span>Aapka Document Hamen WhatsApp Par Bhejein (Next Step)</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Card printing shuru karne ke liye kripya apna card PDF ya clear photo hamare WhatsApp number par bhejein. Message mein aapka <strong>Order ID: {successOrderId}</strong> jarur likhein.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm py-3 px-5 rounded-xl shadow-lg transition active:scale-98"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Send Card PDF / Photo on WhatsApp &rarr;</span>
            </a>
          </div>

          {/* Order Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2.5">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Card Type:</span>
              <span className="font-extrabold text-slate-900">{selectedCard.title}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Customer Card Number / ID:</span>
              <span className="font-mono font-bold text-brand-blue">{cardIdentifier}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Quantity:</span>
              <span className="font-bold text-slate-900">{quantity} Card(s)</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Total Price:</span>
              <span className="font-black text-emerald-700 text-sm">{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery Address:</span>
              <span className="font-semibold text-slate-800 text-right max-w-xs truncate">
                {fullName}, {street}, {city}, {state} - {pincode}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`/track?id=${successOrderId}`}
              className="w-full sm:w-auto bg-brand-blue hover:bg-brand-primary text-white font-bold text-xs py-3 px-6 rounded-xl shadow transition"
            >
              Track Order Status
            </Link>
            <Link
              href="/pvc-card"
              onClick={() => {
                setSuccessOrderId(null);
                setCardIdentifier("");
              }}
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 px-6 rounded-xl transition"
            >
              Order Another Card
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn py-2">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-brand-dark to-brand-blue text-white rounded-3xl p-6 sm:p-10 shadow-xl border-l-8 border-amber-400 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-300 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-amber-400/30">
            <Printer className="h-4 w-4" />
            <span>High-Definition Waterproof UV Print</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Order Smart PVC Plastic Cards
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Pocket-sized, unbreakable PVC cards with high-grade thermal lamination and micro-text clarity. Standard government credit-card dimensions (85.60 × 53.98 mm). Speed post delivery across all India pin codes.
          </p>

          <div className="flex items-center space-x-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
              <span className="text-[10px] text-slate-300 uppercase block font-semibold">Special Offer Price</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-amber-400">{formatCurrency(pricePerCard)}</span>
                <span className="text-xs text-slate-400 line-through">{formatCurrency(originalPrice)}</span>
                <span className="text-[10px] bg-emerald-500 text-white font-extrabold px-1.5 py-0.5 rounded">SAVE 50%</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-300">
              <Truck className="h-4 w-4 text-amber-400" />
              <span>Doorstep Delivery via Speed Post</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Order Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-card border border-slate-200 p-6 sm:p-8 space-y-8">
        
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center space-x-3 text-rose-700 text-xs">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Select Card Type */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b pb-2">
            <span className="w-6 h-6 rounded-full bg-brand-blue text-white font-black text-xs flex items-center justify-center">1</span>
            <h2 className="text-base sm:text-lg font-black text-slate-900">Select Card Type (कार्ड का प्रकार चुनें)</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CARD_OPTIONS.map((opt) => {
              const isSelected = selectedCard.type === opt.type;
              return (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => handleCardTypeSelect(opt)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                    isSelected
                      ? "border-brand-blue bg-blue-50/70 shadow-md ring-2 ring-brand-blue/20"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                  }`}
                >
                  <div className="text-2xl mb-2">{opt.icon}</div>
                  <div className="font-extrabold text-xs sm:text-sm text-slate-900">{opt.title}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{opt.hindiTitle}</div>
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-brand-blue text-white rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: Enter Card Number / Customer ID Box (Appears on Card Selection) */}
        <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center space-x-2">
            <Hash className="h-4 w-4 text-brand-blue" />
            <label className="text-xs sm:text-sm font-black text-slate-900">
              Enter {selectedCard.title} Number / Customer ID *
            </label>
          </div>
          <p className="text-[11px] text-slate-500">
            Aapka card number ya application reference number likhein jo print karwana hai.
          </p>
          <input
            type="text"
            value={cardIdentifier}
            onChange={(e) => setCardIdentifier(e.target.value)}
            placeholder={selectedCard.placeholder}
            required
            className="w-full bg-white border-2 border-slate-300 focus:border-brand-blue rounded-xl p-3 text-xs sm:text-sm font-mono font-bold text-slate-900 outline-none transition"
          />
        </div>

        {/* STEP 3: Quantity Selector & Live Price Calculation */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b pb-2">
            <span className="w-6 h-6 rounded-full bg-brand-blue text-white font-black text-xs flex items-center justify-center">2</span>
            <h2 className="text-base sm:text-lg font-black text-slate-900">Quantity (कितने कार्ड चाहिए)</h2>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {[1, 2, 3, 5, 10].map((qty) => (
              <button
                key={qty}
                type="button"
                onClick={() => setQuantity(qty)}
                className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all ${
                  quantity === qty
                    ? "bg-brand-blue text-white shadow-md ring-2 ring-brand-blue/30 scale-105"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {qty} {qty === 1 ? "Copy" : "Copies"}
              </button>
            ))}

            <div className="ml-auto bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-right">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">Total Amount</span>
              <span className="text-lg font-black text-slate-900">{formatCurrency(totalPrice)}</span>
              <span className="text-[10px] text-slate-500 block">({quantity} × {formatCurrency(pricePerCard)})</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Document Notice (NO Photo upload required!) */}
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-start space-x-3 text-xs text-emerald-900">
          <MessageCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-extrabold block">No File Upload Needed on Website!</span>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Order place karne ke baad aap apna card PDF ya clear document photo seedhe hamare official WhatsApp par bhej sakte hain. Website par photo upload karne ki jarurat nahi hai.
            </p>
          </div>
        </div>

        {/* STEP 4: Delivery Address */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b pb-2">
            <span className="w-6 h-6 rounded-full bg-brand-blue text-white font-black text-xs flex items-center justify-center">3</span>
            <h2 className="text-base sm:text-lg font-black text-slate-900">Delivery Address (कार्ड प्राप्त करने का पता)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Receiver Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name as on postal address"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mobile Number (For Delivery & WhatsApp) *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-brand-blue"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Street Address / House No / Landmark *</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="House No, Street, Ward, Village / Landmark"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">City / Town / Tehsil *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City / Town"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-brand-blue"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">State *</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-brand-blue"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">PIN Code *</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="6-digit PIN"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-brand-blue"
                />
              </div>
            </div>
          </div>
        </div>

        {/* STEP 4: Payment Summary & Pay Button */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center space-x-2 border-b pb-2">
            <span className="w-6 h-6 rounded-full bg-brand-blue text-white font-black text-xs flex items-center justify-center">4</span>
            <h2 className="text-base sm:text-lg font-black text-slate-900">Payment & Place Order</h2>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Total Order Payable</span>
              <span className="text-xl font-black text-emerald-700">{formatCurrency(totalPrice)}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{quantity} × {selectedCard.title}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Wallet / UPI / Razorpay Checkout</span>
            </div>
          </div>

          {/* Pay Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-blue hover:bg-brand-primary text-white font-black text-sm sm:text-base py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Printer className="h-5 w-5" />
            <span>
              {submitting ? "Processing Order..." : `Proceed to Pay ${formatCurrency(totalPrice)} & Place Order`}
            </span>
          </button>
        </div>

      </form>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={totalPrice}
        title={`PVC Card Printing (${quantity} × ${selectedCard.type})`}
        referenceId={`PVC-${selectedCard.type.substring(0, 4).toUpperCase()}-${Date.now().toString().slice(-4)}`}
        userEmail={user?.email || "citizen@netduniya.in"}
        userName={fullName}
        userPhone={phone}
        onSuccess={handleFinalPVCOrder}
      />

    </div>
  );
}
