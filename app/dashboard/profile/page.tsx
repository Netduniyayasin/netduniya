"use client";

import React, { useState } from "react";
import { User, Phone, Mail, MapPin, Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { createOrUpdateUser } from "@/lib/firestore-service";

export default function UserProfilePage() {
  const { user, profile, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || "");
  const [address, setAddress] = useState(profile?.address || "");
  const [city, setCity] = useState(profile?.city || "");
  const [state, setState] = useState(profile?.state || "");
  const [pincode, setPincode] = useState(profile?.pincode || "");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await createOrUpdateUser({
        uid: user.uid,
        fullName,
        phoneNumber,
        address,
        city,
        state,
        pincode,
      });
      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 sm:p-8 space-y-6">
      
      <div className="border-b pb-4">
        <h1 className="text-lg font-black text-slate-900">Account Profile & Address</h1>
        <p className="text-xs text-slate-500">Manage your contact details and default delivery address for instant auto-filling.</p>
      </div>

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4 max-w-xl">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">Full Name *</label>
          <div className="relative">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-brand-blue"
            />
            <User className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Email Address (Read-only)</label>
            <div className="relative">
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-500 cursor-not-allowed"
              />
              <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Mobile Phone</label>
            <div className="relative">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="10-digit mobile"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-brand-blue"
              />
              <Phone className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">Street Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="House / Flat No, Street, Colony, Landmark"
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:ring-2 focus:ring-brand-blue"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">PIN Code</label>
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="PIN"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-brand-blue hover:bg-brand-primary text-white font-bold text-xs py-2.5 px-6 rounded-lg shadow transition flex items-center space-x-1.5 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Update Profile</span>
              </>
            )}
          </button>
        </div>
      </form>

    </div>
  );
}
