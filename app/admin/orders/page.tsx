"use client";

import React, { useEffect, useState } from "react";
import { 
  CreditCard, 
  ShoppingBag, 
  Truck, 
  Search, 
  ExternalLink, 
  Printer, 
  CheckCircle2, 
  Loader2 
} from "lucide-react";
import { 
  subscribeToAllPVCOrders, 
  updatePVCOrderStatus, 
  subscribeToAllShopOrders, 
  updateShopOrderStatus,
  getSiteSettings,
  updateSiteSettings
} from "@/lib/firestore-service";
import { PVCCardOrder, ShopOrder, PVCOrderStatus } from "@/lib/types";
import { formatCurrency, formatDateTime, getStatusBadgeClass, formatStatusLabel } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [tab, setTab] = useState<'pvc' | 'shop'>('pvc');
  const [pvcOrders, setPvcOrders] = useState<PVCCardOrder[]>([]);
  const [shopOrders, setShopOrders] = useState<ShopOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPVC, setSelectedPVC] = useState<PVCCardOrder | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courierName, setCourierName] = useState("India Post");
  const [pvcStatus, setPvcStatus] = useState<PVCOrderStatus>('processing');
  const [updating, setUpdating] = useState(false);
  const [pvcUnitPrice, setPvcUnitPrice] = useState<number>(50);
  const [savingPrice, setSavingPrice] = useState(false);

  useEffect(() => {
    const unsubPVC = subscribeToAllPVCOrders((data) => {
      setPvcOrders(data);
      if (data.length > 0 && !selectedPVC) {
        setSelectedPVC(data[0]);
        setTrackingNumber(data[0].trackingNumber || "");
        setCourierName(data[0].courierName || "India Post");
        setPvcStatus(data[0].status);
      }
    });
    const unsubShop = subscribeToAllShopOrders((data) => setShopOrders(data));

    getSiteSettings().then((s) => {
      if (s && s.pvcCardPrice) setPvcUnitPrice(s.pvcCardPrice);
    });

    return () => {
      unsubPVC();
      unsubShop();
    };
  }, []);

  const handleSavePrice = async () => {
    setSavingPrice(true);
    try {
      await updateSiteSettings({ pvcCardPrice: Number(pvcUnitPrice) }, "admin", "Admin Staff");
      alert(`PVC Card Price successfully updated to ₹${pvcUnitPrice}! Customers will now see ₹${pvcUnitPrice} per card.`);
    } catch (err: any) {
      alert("Failed to update PVC card price");
    } finally {
      setSavingPrice(false);
    }
  };

  const filteredPVC = pvcOrders.filter(p => 
    searchQuery === "" || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.cardType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdatePVC = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPVC) return;
    setUpdating(true);
    try {
      await updatePVCOrderStatus(selectedPVC.id, pvcStatus, trackingNumber, courierName);
      alert(`PVC Order ${selectedPVC.id} updated.`);
    } catch (err) {
      console.error(err);
      alert("Failed to update PVC Order");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
        <div>
          <h1 className="text-lg font-black text-slate-900">Orders & Smart Card Logistics</h1>
          <p className="text-xs text-slate-500">Manage PVC ID printing queue, delivery address, and courier tracking numbers.</p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setTab('pvc')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
              tab === 'pvc' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
            }`}
          >
            PVC Cards ({pvcOrders.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('shop')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
              tab === 'shop' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
            }`}
          >
            Shop Hardware ({shopOrders.length})
          </button>
        </div>
      </div>

      {tab === 'pvc' && (
        <div className="space-y-4">
          {/* Admin PVC Pricing Setting Bar */}
          <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-4 rounded-xl border border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded">
                  Admin Price Setting
                </span>
                <span className="text-xs font-bold text-slate-200">Customer PVC Card Rate:</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Set price per card (e.g. ₹50, ₹100, ₹200). Directly syncs with public PVC Card Order form.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-black text-emerald-400">₹</span>
              <input
                type="number"
                min="10"
                max="1000"
                value={pvcUnitPrice}
                onChange={(e) => setPvcUnitPrice(Number(e.target.value))}
                className="w-24 bg-white text-slate-950 font-black text-sm px-3 py-1.5 rounded-lg border border-slate-300 text-center"
              />
              <button
                type="button"
                onClick={handleSavePrice}
                disabled={savingPrice}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs px-4 py-2 rounded-lg transition shadow"
              >
                {savingPrice ? "Saving..." : "Set Price"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: PVC Order Queue (5 cols) */}
          <div className="lg:col-span-5 space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredPVC.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No PVC orders found.</p>
            ) : (
              filteredPVC.map((p) => {
                const isSelected = selectedPVC?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedPVC(p);
                      setPvcStatus(p.status);
                      setTrackingNumber(p.trackingNumber || "");
                      setCourierName(p.courierName || "India Post");
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition text-xs space-y-1.5 ${
                      isSelected
                        ? "border-rose-600 bg-rose-50/70 shadow-sm ring-1 ring-rose-500"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-brand-blue">{p.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getStatusBadgeClass(p.status)}`}>
                        {formatStatusLabel(p.status)}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900">{p.cardType} (Qty: {p.quantity})</h4>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>{p.userName}</span>
                      <span className="font-black text-emerald-700">{formatCurrency(p.totalPrice)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right: PVC Order Details & Tracking Form (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-5">
            {selectedPVC ? (
              <>
                <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-brand-blue">{selectedPVC.id}</span>
                    <h2 className="text-base font-black text-slate-900 mt-0.5">{selectedPVC.cardType} ({selectedPVC.quantity} Copies)</h2>
                    <p className="text-xs text-slate-500">Recipient: <strong>{selectedPVC.userName}</strong> ({selectedPVC.userPhone})</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(selectedPVC.status)}`}>
                    {formatStatusLabel(selectedPVC.status)}
                  </span>
                </div>

                {/* Delivery Address */}
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Shipping Destination:</span>
                  <p className="font-semibold text-slate-900">
                    {selectedPVC.deliveryAddress?.fullName}, {selectedPVC.deliveryAddress?.street}, {selectedPVC.deliveryAddress?.city}, {selectedPVC.deliveryAddress?.state} - {selectedPVC.deliveryAddress?.pincode}
                  </p>
                </div>

                {/* Customer Card Number / Identification */}
                {selectedPVC.cardIdentifier && (
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-700 block">Customer ID / Card Number:</span>
                      <span className="font-mono font-black text-sm text-brand-blue">{selectedPVC.cardIdentifier}</span>
                    </div>
                    {selectedPVC.userPhone && (
                      <a
                        href={`https://wa.me/${selectedPVC.userPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedPVC.userName}, regarding your PVC Card order ${selectedPVC.id} (${selectedPVC.cardType} - ${selectedPVC.cardIdentifier}):`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition flex items-center space-x-1"
                      >
                        <span>WhatsApp Customer</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                )}

                {/* Card Documents to Print */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Print Source Files:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedPVC.frontDocUrl && (
                      <a
                        href={selectedPVC.frontDocUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-brand-blue flex items-center justify-between hover:bg-slate-100"
                      >
                        <span>Front Side Document</span>
                        <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </a>
                    )}
                    {selectedPVC.backDocUrl && (
                      <a
                        href={selectedPVC.backDocUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-brand-blue flex items-center justify-between hover:bg-slate-100"
                      >
                        <span>Back Side Document</span>
                        <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Update PVC Order Form */}
                <form onSubmit={handleUpdatePVC} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-black uppercase text-slate-900 border-b pb-2">
                    Update Printing & Dispatch Status
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                      <select
                        value={pvcStatus}
                        onChange={(e) => setPvcStatus(e.target.value as PVCOrderStatus)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                      >
                        <option value="paid">Paid (Queued)</option>
                        <option value="processing">Processing</option>
                        <option value="printing">Printing</option>
                        <option value="ready">Ready for Dispatch</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Courier Partner</label>
                      <input
                        type="text"
                        value={courierName}
                        onChange={(e) => setCourierName(e.target.value)}
                        placeholder="e.g. India Post / DTDC"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Courier Tracking / Consignment Number</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. EM123456789IN"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono uppercase"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-lg shadow transition flex items-center justify-center space-x-1"
                  >
                    {updating ? "Saving..." : "Update Order & Tracking"}
                  </button>
                </form>
              </>
            ) : (
              <p className="text-xs text-slate-400 text-center py-10">Select a PVC order to manage.</p>
            )}
          </div>

        </div>
      </div>
      )}

      {tab === 'shop' && (
        <div className="space-y-3">
          {shopOrders.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No shop orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Tracking</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shopOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-brand-blue">{ord.id}</td>
                      <td className="p-3 font-bold text-slate-900">{ord.userName}</td>
                      <td className="p-3">
                        {ord.items?.map((it, i) => <span key={i} className="block">• {it.productName} (x{it.quantity})</span>)}
                      </td>
                      <td className="p-3 font-black text-emerald-700">{formatCurrency(ord.totalAmount)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(ord.status)}`}>
                          {formatStatusLabel(ord.status)}
                        </span>
                      </td>
                      <td className="p-3 font-mono">{ord.trackingNumber || "Pending"}</td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={async () => {
                            const newSt = prompt("Enter new status (paid, processing, shipped, delivered):", ord.status);
                            if (newSt) {
                              const track = prompt("Enter tracking number (optional):", ord.trackingNumber || "");
                              await updateShopOrderStatus(ord.id, newSt as any, track || undefined);
                            }
                          }}
                          className="bg-brand-blue text-white font-bold px-3 py-1 rounded text-[11px]"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
