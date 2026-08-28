"use client";

import React, { useEffect, useState } from "react";
import { 
  Settings, 
  Save, 
  Database, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Loader2 
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { 
  getSiteSettings, 
  updateSiteSettings, 
  seedInitialCategoriesAndServices, 
  DEFAULT_SITE_SETTINGS 
} from "@/lib/firestore-service";
import { SiteSettings } from "@/lib/types";

export default function AdminSettingsPage() {
  const { profile, user } = useAuth();
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    getSiteSettings().then(s => setSettings(s));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);
    try {
      await updateSiteSettings(settings, user?.uid || "admin", profile?.fullName || "Admin");
      setSuccess("Site settings saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSeedDatabase = async () => {
    if (!confirm("Are you sure you want to initialize default categories, services, notices, and important links? Existing items with different IDs will not be deleted.")) return;
    setSeeding(true);
    try {
      await seedInitialCategoriesAndServices();
      setSuccess("Database initialized with default digital service catalog!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to seed database.");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
        <div>
          <h1 className="text-lg font-black text-slate-900">Portal Configuration & Database Seeder</h1>
          <p className="text-xs text-slate-500">Manage contact information, WhatsApp helpline, Kendra working hours, and initial database setup.</p>
        </div>

        <button
          type="button"
          onClick={handleSeedDatabase}
          disabled={seeding}
          className="bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs py-2 px-4 rounded-lg shadow flex items-center space-x-1.5"
        >
          {seeding ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Seeding Catalog...</span>
            </>
          ) : (
            <>
              <Database className="h-4 w-4" />
              <span>Seed Initial Database</span>
            </>
          )}
        </button>
      </div>

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Portal Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Portal Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Support Phone</label>
            <div className="relative">
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-2 text-xs"
              />
              <Phone className="h-4 w-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Helpline (with country code)</label>
            <div className="relative">
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                required
                placeholder="+91..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-2 text-xs"
              />
              <Phone className="h-4 w-4 text-emerald-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Official Support Email</label>
            <div className="relative">
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-2 text-xs"
              />
              <Mail className="h-4 w-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Kendra Physical Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Working Hours</label>
            <input
              type="text"
              value={settings.workingHours}
              onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
            />
          </div>
        </div>

        {/* PVC Card Pricing & Delivery Setup */}
        <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-3">
          <h3 className="text-xs font-black uppercase text-amber-900">Smart PVC Card Pricing & Delivery (Live Config)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">PVC Offer Price (₹ per Card)</label>
              <input
                type="number"
                min={1}
                value={settings.pvcCardPrice ?? 50}
                onChange={(e) => setSettings({ ...settings, pvcCardPrice: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-black text-emerald-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Original MRP Price (₹)</label>
              <input
                type="number"
                min={1}
                value={settings.pvcCardOriginalPrice ?? 99}
                onChange={(e) => setSettings({ ...settings, pvcCardOriginalPrice: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Doorstep Courier Fee (₹)</label>
              <input
                type="number"
                min={0}
                value={settings.pvcDeliveryFee ?? 40}
                onChange={(e) => setSettings({ ...settings, pvcDeliveryFee: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold"
              />
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <h3 className="text-xs font-black uppercase text-slate-900">Module Feature Toggles</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableWallet}
                onChange={(e) => setSettings({ ...settings, enableWallet: e.target.checked })}
              />
              <span>Enable Pre-paid Citizen Wallet</span>
            </label>

            <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enablePVC}
                onChange={(e) => setSettings({ ...settings, enablePVC: e.target.checked })}
              />
              <span>Enable Smart PVC Card Ordering</span>
            </label>

            <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableAppointments}
                onChange={(e) => setSettings({ ...settings, enableAppointments: e.target.checked })}
              />
              <span>Enable Kendra Appointments</span>
            </label>

            <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableShop}
                onChange={(e) => setSettings({ ...settings, enableShop: e.target.checked })}
              />
              <span>Enable Digital Hardware Shop</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-brand-blue hover:bg-brand-primary text-white font-bold text-xs py-2.5 px-6 rounded-lg shadow transition flex items-center space-x-1.5"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving Portal Settings...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Portal Settings</span>
            </>
          )}
        </button>

      </form>

    </div>
  );
}
