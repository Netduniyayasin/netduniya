"use client";

import React, { useEffect, useState } from "react";
import { 
  Landmark, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  CheckCircle2, 
  Calendar,
  Search,
  Building
} from "lucide-react";
import { subscribeToSchemes, saveScheme, deleteScheme } from "@/lib/firestore-service";
import { GovernmentScheme } from "@/lib/types";
import { slugify } from "@/lib/utils";

export default function AdminSchemesPage() {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [state, setState] = useState("Central Govt");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [eligibility, setEligibility] = useState<string[]>(["Indian Citizen", "Annual Family Income < 2.5 Lakhs"]);
  const [benefits, setBenefits] = useState<string[]>(["Direct Bank Transfer Subsidy"]);
  const [requiredDocs, setRequiredDocs] = useState<string[]>(["Aadhaar Card", "Income Certificate", "Bank Passbook"]);
  const [officialWebsite, setOfficialWebsite] = useState("");
  const [applicationUrl, setApplicationUrl] = useState("");
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('published');
  const [isFeatured, setIsFeatured] = useState(false);

  const [newEl, setNewEl] = useState("");
  const [newBen, setNewBen] = useState("");
  const [newDoc, setNewDoc] = useState("");

  useEffect(() => {
    const unsub = subscribeToSchemes((data) => setSchemes(data), false);
    return () => unsub();
  }, []);

  const openNew = () => {
    setEditId(null);
    setName("");
    setState("Central Govt");
    setDepartment("");
    setDescription("");
    setEligibility(["Indian Citizen", "Annual Income Eligibility"]);
    setBenefits(["Direct Subsidy"]);
    setRequiredDocs(["Aadhaar Card", "Bank Passbook"]);
    setOfficialWebsite("");
    setApplicationUrl("");
    setStatus('published');
    setIsFeatured(false);
    setModalOpen(true);
  };

  const openEdit = (s: GovernmentScheme) => {
    setEditId(s.id);
    setName(s.name);
    setState(s.state);
    setDepartment(s.department);
    setDescription(s.description);
    setEligibility(s.eligibility || []);
    setBenefits(s.benefits || []);
    setRequiredDocs(s.requiredDocuments || []);
    setOfficialWebsite(s.officialWebsite || "");
    setApplicationUrl(s.applicationUrl || "");
    setStatus(s.status);
    setIsFeatured(s.isFeatured || false);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const schemeObj: GovernmentScheme = {
      id: editId || `sch-${Date.now()}`,
      name: name.trim(),
      slug: slugify(name),
      state,
      department,
      description,
      eligibility,
      benefits,
      requiredDocuments: requiredDocs,
      officialWebsite,
      applicationUrl,
      lastVerifiedDate: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      status,
      isFeatured,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await saveScheme(schemeObj);
    setModalOpen(false);
    alert("Scheme saved successfully!");
  };

  const filteredSchemes = schemes.filter(s => 
    !searchQuery.trim() || 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.state?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
        <div>
          <h1 className="text-lg font-black text-slate-900">Government Welfare Schemes ({schemes.length})</h1>
          <p className="text-xs text-slate-500">Manage verified central and state welfare programs, eligibility, subsidies, and official portal URLs.</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 100+ schemes..."
              className="bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>

          <button
            type="button"
            onClick={openNew}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-4 rounded-lg shadow flex items-center space-x-1.5 flex-shrink-0"
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ Add Scheme</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
            <tr>
              <th className="p-3">Scheme Name</th>
              <th className="p-3">State</th>
              <th className="p-3">Department</th>
              <th className="p-3">Verified Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSchemes.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-900">{s.name}</td>
                <td className="p-3">{s.state}</td>
                <td className="p-3 text-slate-600">{s.department}</td>
                <td className="p-3 text-slate-500">{s.lastVerifiedDate}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    s.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {s.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => openEdit(s)} className="text-brand-blue font-bold hover:underline">
                    Edit
                  </button>
                  <button onClick={() => deleteScheme(s.id)} className="text-rose-600 font-bold hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto my-8">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-sm font-black text-slate-900">{editId ? "Edit Scheme" : "Add Government Scheme"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Scheme Title *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. PM Kisan Samman Nidhi Yojana"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State / Jurisdiction</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Central Govt or Uttar Pradesh"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Ministry of Agriculture"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Overview Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              {/* Subsidies & Benefits */}
              <div className="border p-3 rounded-lg bg-slate-50 space-y-2">
                <label className="block text-xs font-bold text-slate-800">Benefits & Subsidies</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBen}
                    onChange={(e) => setNewBen(e.target.value)}
                    placeholder="e.g. ₹6,000 yearly in 3 installments"
                    className="flex-1 bg-white border border-slate-300 rounded p-1.5 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => { if (newBen.trim()) { setBenefits([...benefits, newBen.trim()]); setNewBen(""); }}}
                    className="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded font-bold"
                  >
                    + Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {benefits.map((b, i) => (
                    <span key={i} className="bg-white border text-xs px-2 py-1 rounded flex items-center space-x-1">
                      <span>{b}</span>
                      <button type="button" onClick={() => setBenefits(benefits.filter((_, idx) => idx !== i))} className="text-rose-500 font-bold ml-1">✕</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Portal Website</label>
                  <input
                    type="url"
                    value={officialWebsite}
                    onChange={(e) => setOfficialWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Direct Apply Link</label>
                  <input
                    type="url"
                    value={applicationUrl}
                    onChange={(e) => setApplicationUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-bold text-slate-700">Status:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="bg-slate-50 border border-slate-300 rounded p-1 text-xs font-bold"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg shadow"
                  >
                    Save Scheme
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
