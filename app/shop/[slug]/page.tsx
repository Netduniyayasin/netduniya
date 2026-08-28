"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShoppingBag, 
  ArrowLeft, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  Wallet, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Lock
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { 
  createShopOrder, 
  executeWalletTransaction, 
  createPaymentRecord 
} from "@/lib/firestore-service";
import { 
  getDocs, 
  query, 
  collection, 
  where, 
  limit 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ShopProduct } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import PaymentModal from "@/components/payment/PaymentModal";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { user, profile, walletBalance, refreshProfile } = useAuth();

  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Address Form
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
    async function load() {
      if (!slug) return;
      setLoading(true);
      try {
        const q = query(collection(db, "products"), where("slug", "==", slug), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setProduct({ id: snap.docs[0].id, ...snap.docs[0].data() } as ShopProduct);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <Loader2 className="h-10 w-10 text-brand-blue animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-600">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center bg-white rounded-xl shadow p-8">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">This product is out of stock or does not exist.</p>
        <Link href="/shop" className="mt-4 inline-block bg-brand-blue text-white text-xs font-bold px-4 py-2 rounded">
          ← Back to Shop
        </Link>
      </div>
    );
  }

  const unitPrice = product.discountPrice || product.price;
  const totalPrice = unitPrice * quantity;

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!user) {
      router.push(`/login?redirect=/shop/${slug}`);
      return;
    }

    if (!fullName || !phone || !street || !city || !state || !pincode) {
      setErrorMsg("Please complete shipping address details.");
      return;
    }

    setIsPaymentModalOpen(true);
  };

  const handleFinalShopOrder = async (paymentDetails: {
    paymentId: string;
    method: 'wallet' | 'razorpay' | 'upi';
    amount: number;
    referenceId?: string;
  }) => {
    if (!user || !product) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      if (paymentDetails.amount > 0 && paymentDetails.method !== 'wallet') {
        await createPaymentRecord({
          userId: user.uid,
          userEmail: user.email || "",
          userName: fullName,
          amount: totalPrice,
          currency: "INR",
          purpose: "shop_order",
          referenceId: product.id,
          status: "success",
        });
      }

      const order = await createShopOrder({
        userId: user.uid,
        userName: fullName,
        userEmail: user.email || "",
        userPhone: phone,
        items: [
          {
            productId: product.id,
            productName: product.name,
            price: unitPrice,
            quantity,
            imageUrl: product.imageUrl,
          }
        ],
        totalAmount: totalPrice,
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
      setErrorMsg(err.message || "Failed to complete purchase");
    } finally {
      setSubmitting(false);
    }
  };

  if (successOrderId) {
    return (
      <div className="max-w-2xl mx-auto py-10 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-elevated border border-emerald-200 p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Order Placed Successfully
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
              Order ID: <span className="text-brand-blue">{successOrderId}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Your order for <strong>{product.name} (Qty: {quantity})</strong> has been received with fee payment of {formatCurrency(totalPrice)}. Courier dispatch tracking will be updated shortly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`/track?id=${successOrderId}`}
              className="w-full sm:w-auto bg-brand-blue hover:bg-brand-primary text-white font-bold text-xs py-3 px-6 rounded-lg shadow transition"
            >
              Track Dispatch Status
            </Link>
            <Link
              href="/dashboard/orders"
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 px-6 rounded-lg transition"
            >
              My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/shop" className="hover:text-brand-blue flex items-center">
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Back to Shop
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left: Product Media & Details (5 cols) */}
        <div className="md:col-span-5 bg-white rounded-xl shadow-card border border-slate-200 p-6 space-y-4">
          <div className="h-60 w-full bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center p-4 border border-slate-100">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.imageUrl} alt={product.name} className="max-h-full max-w-full object-contain" />
            ) : (
              <ShoppingBag className="h-16 w-16 text-slate-300" />
            )}
          </div>

          <div>
            <span className="text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
              {product.category || "Supplies"}
            </span>
            <h1 className="text-xl font-black text-slate-900 mt-2">{product.name}</h1>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>

          <div className="border-t border-slate-100 pt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{formatCurrency(unitPrice)}</span>
            {product.discountPrice && (
              <span className="text-xs text-slate-400 line-through">{formatCurrency(product.price)}</span>
            )}
          </div>
        </div>

        {/* Right: Checkout & Address Form (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-xl shadow-card border border-slate-200 p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-black text-slate-900 border-b pb-3">Delivery Address & Payment</h2>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleBuy} className="space-y-4">
            
            {/* Quantity */}
            <div className="flex items-center space-x-3">
              <label className="text-xs font-bold text-slate-700">Quantity:</label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuantity(num)}
                    className={`h-8 w-10 rounded font-bold text-xs border ${
                      quantity === num ? "bg-brand-blue text-white border-brand-blue" : "bg-slate-50 text-slate-700"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address *</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State & PIN *</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    placeholder="State"
                    className="w-1/2 bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                    placeholder="PIN"
                    className="w-1/2 bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Order Payment Summary */}
            <div className="border-t border-slate-200 pt-5 space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Total Payable</span>
                  <span className="text-lg font-black text-slate-900">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Wallet / UPI / Cards</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-blue hover:bg-brand-primary text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Proceed to Pay {formatCurrency(totalPrice)} & Order</span>
                </>
              )}
            </button>

          </form>
        </div>

      </div>

      {product && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          amount={totalPrice}
          title={`Order: ${product.name} (Qty: ${quantity})`}
          referenceId={`ORD-${product.slug.substring(0, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`}
          userEmail={user?.email || ""}
          userName={fullName}
          userPhone={phone}
          onSuccess={handleFinalShopOrder}
        />
      )}

    </div>
  );
}
