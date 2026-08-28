"use client";

import React, { useEffect, useState } from "react";
import { 
  Wallet, 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  CheckCircle2,
  Lock
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { 
  subscribeToUserWalletTransactions, 
  executeWalletTransaction,
  createPaymentRecord
} from "@/lib/firestore-service";
import { WalletTransaction } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import PaymentModal from "@/components/payment/PaymentModal";

export default function UserWalletPage() {
  const { user, profile, walletBalance, refreshProfile } = useAuth();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [rechargeAmount, setRechargeAmount] = useState<number>(100);
  const [modalOpen, setModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToUserWalletTransactions(user.uid, (txns) => {
      setTransactions(txns);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || rechargeAmount <= 0) return;
    setModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handleFinalRecharge = async (paymentDetails: {
    paymentId: string;
    method: 'wallet' | 'razorpay' | 'upi';
    amount: number;
    referenceId?: string;
  }) => {
    if (!user) return;
    setProcessing(true);
    setErrorMsg(null);

    try {
      const payment = await createPaymentRecord({
        userId: user.uid,
        userEmail: user.email || "",
        userName: profile?.fullName || "Citizen",
        amount: rechargeAmount,
        currency: "INR",
        purpose: "wallet_topup",
        referenceId: `TOPUP-${Date.now()}`,
        status: "success",
      });

      const creditRes = await executeWalletTransaction(
        user.uid,
        rechargeAmount,
        'credit',
        paymentDetails.method === 'upi' ? 'upi' : 'razorpay',
        `Online Wallet Recharge (₹${rechargeAmount})`,
        payment.id,
        profile?.fullName || user.email || 'user'
      );

      if (!creditRes.success) {
        throw new Error(creditRes.error || "Failed to credit wallet balance");
      }

      await refreshProfile();
      setSuccessMsg(`Successfully added ${formatCurrency(rechargeAmount)} to your wallet!`);
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Recharge failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Wallet Balance Summary Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-card border-l-8 border-brand-accent flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-amber-400">
            <Wallet className="h-5 w-5" />
            <span className="text-xs uppercase font-extrabold tracking-wider">NetDuniya Digital Wallet</span>
          </div>
          <p className="text-xs text-slate-300">Available Pre-Paid Balance for Instant Service Payments</p>
          <div className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight">
            {formatCurrency(walletBalance)}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="bg-brand-accent hover:bg-brand-accentHover text-white text-xs sm:text-sm font-black py-3 px-6 rounded-xl shadow-lg transition flex items-center space-x-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Money to Wallet</span>
          </button>
        </div>
      </div>

      {/* Passbook / Ledger Transactions */}
      <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center space-x-2">
            <History className="h-4 w-4 text-brand-blue" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Wallet Passbook & Transaction History
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-semibold">{transactions.length} Transactions</span>
        </div>

        {loading ? (
          <p className="text-xs text-slate-400 py-8 text-center">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-300 rounded-xl space-y-2">
            <Wallet className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No transactions yet</h3>
            <p className="text-xs text-slate-500">
              Your wallet ledger is empty. Add money to start making instant service applications.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Transaction ID</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Balance After</th>
                  <th className="p-3">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((t) => {
                  const isCredit = t.type === 'credit' || t.type === 'refund';
                  return (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-700">{t.id}</td>
                      <td className="p-3 font-semibold text-slate-900">{t.description}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isCredit ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                        }`}>
                          {isCredit ? <ArrowDownLeft className="h-3 w-3 mr-0.5" /> : <ArrowUpRight className="h-3 w-3 mr-0.5" />}
                          {t.type.toUpperCase()}
                        </span>
                      </td>
                      <td className={`p-3 font-black text-sm ${isCredit ? "text-emerald-600" : "text-rose-600"}`}>
                        {isCredit ? `+ ${formatCurrency(t.amount)}` : `- ${formatCurrency(t.amount)}`}
                      </td>
                      <td className="p-3 font-bold text-slate-800">{formatCurrency(t.balanceAfter)}</td>
                      <td className="p-3 text-slate-500">{formatDateTime(t.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Money Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-5">
            
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Wallet className="h-5 w-5 text-brand-blue" />
                <h3 className="text-base font-black text-slate-900">Add Money to Wallet</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleAddMoney} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Enter Amount (INR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    min={10}
                    max={50000}
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-4 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex items-center space-x-2">
                {[100, 250, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setRechargeAmount(amt)}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-bold text-xs border"
                  >
                    + ₹{amt}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border text-[11px] text-slate-500 flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Secure Razorpay / UPI 256-bit Encrypted Checkout</span>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 py-2.5 bg-brand-accent hover:bg-brand-accentHover text-white font-black text-xs rounded-xl shadow transition flex items-center justify-center space-x-1"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-3.5 w-3.5" />
                      <span>Proceed to Pay {formatCurrency(rechargeAmount)}</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* REAL PAYMENT MODAL */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={rechargeAmount}
        title="NetDuniya Digital Wallet Recharge"
        referenceId={`TOPUP-${Date.now().toString().slice(-6)}`}
        userEmail={user?.email || ""}
        userName={profile?.fullName || "Citizen"}
        userPhone={profile?.phoneNumber || ""}
        onSuccess={handleFinalRecharge}
      />

    </div>
  );
}
