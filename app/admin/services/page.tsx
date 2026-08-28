"use client";

import React, { useEffect, useState } from "react";
import { 
  Layers, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  FileText, 
  FolderPlus, 
  ArrowRight,
  Plus,
  Save,
  X
} from "lucide-react";
import { 
  subscribeToServices, 
  subscribeToCategories, 
  saveService, 
  deleteService, 
  saveCategory, 
  deleteCategory 
} from "@/lib/firestore-service";
import { Service, Category, DynamicFormField, FieldType } from "@/lib/types";
import { formatCurrency, slugify } from "@/lib/utils";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'services' | 'categories'>('services');

  // Service Editor State
  const [editorOpen, setEditorOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [price, setPrice] = useState(100);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(undefined);
  const [processingTime, setProcessingTime] = useState("3 to 5 Days");
  const [requiredDocs, setRequiredDocs] = useState<string[]>(["Aadhaar Card Copy", "Passport Photo"]);
  const [newDocText, setNewDocText] = useState("");
  const [formFields, setFormFields] = useState<DynamicFormField[]>([]);
  const [status, setStatus] = useState<'draft' | 'published' | 'disabled'>('published');
  const [isFeatured, setIsFeatured] = useState(false);

  // Field Editor Sub-state
  const [fieldLabel, setFieldLabel] = useState("");
  const [fieldType, setFieldType] = useState<FieldType>("text");
  const [fieldRequired, setFieldRequired] = useState(true);
  const [fieldOptions, setFieldOptions] = useState("");

  // Category Editor State
  const [catName, setCatName] = useState("");

  useEffect(() => {
    const unsubServices = subscribeToServices((data) => setServices(data));
    const unsubCats = subscribeToCategories((cats) => {
      setCategories(cats);
      if (cats.length > 0 && !categoryId) setCategoryId(cats[0].id);
    });

    return () => {
      unsubServices();
      unsubCats();
    };
  }, []);

  const openNewService = () => {
    setEditId(null);
    setName("");
    setShortDesc("");
    setFullDesc("");
    setPrice(100);
    setDiscountPrice(undefined);
    setProcessingTime("3 to 5 Days");
    setRequiredDocs(["Aadhaar Card Copy", "Passport Photo"]);
    setFormFields([
      { id: "f1", name: "fullName", label: "Full Name (as per ID)", type: "text", required: true, sortOrder: 1 },
      { id: "f2", name: "mobileNumber", label: "Mobile Number", type: "tel", required: true, sortOrder: 2 },
      { id: "f3", name: "idProof", label: "Identity Proof Document", type: "file", required: true, sortOrder: 3 },
    ]);
    setStatus('published');
    setIsFeatured(false);
    setEditorOpen(true);
  };

  const openEditService = (srv: Service) => {
    setEditId(srv.id);
    setName(srv.name);
    setCategoryId(srv.categoryId);
    setShortDesc(srv.shortDescription);
    setFullDesc(srv.fullDescription);
    setPrice(srv.price);
    setDiscountPrice(srv.discountPrice);
    setProcessingTime(srv.processingTime);
    setRequiredDocs(srv.requiredDocuments || []);
    setFormFields(srv.formFields || []);
    setStatus(srv.status);
    setIsFeatured(srv.isFeatured || false);
    setEditorOpen(true);
  };

  const handleAddField = () => {
    if (!fieldLabel.trim()) return;
    const fieldName = slugify(fieldLabel);
    const newField: DynamicFormField = {
      id: `fld-${Date.now()}`,
      name: fieldName,
      label: fieldLabel.trim(),
      type: fieldType,
      required: fieldRequired,
      options: fieldType === 'select' || fieldType === 'radio' ? fieldOptions.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      sortOrder: formFields.length + 1,
    };
    setFormFields([...formFields, newField]);
    setFieldLabel("");
    setFieldOptions("");
  };

  const handleRemoveField = (id: string) => {
    setFormFields(formFields.filter(f => f.id !== id));
  };

  const handleAddDoc = () => {
    if (!newDocText.trim()) return;
    setRequiredDocs([...requiredDocs, newDocText.trim()]);
    setNewDocText("");
  };

  const handleRemoveDoc = (idx: number) => {
    setRequiredDocs(requiredDocs.filter((_, i) => i !== idx));
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const matchedCat = categories.find(c => c.id === categoryId);
    const srvObj: Service = {
      id: editId || `srv-${Date.now()}`,
      name: name.trim(),
      slug: slugify(name),
      categoryId,
      categoryName: matchedCat?.name || "Citizen Services",
      shortDescription: shortDesc,
      fullDescription: fullDesc,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      processingTime,
      requiredDocuments: requiredDocs,
      formFields,
      status,
      isFeatured,
      sortOrder: services.length + 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await saveService(srvObj);
    setEditorOpen(false);
    alert("Service saved successfully!");
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    await deleteService(id);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    const catId = `cat-${slugify(catName)}`;
    await saveCategory({
      id: catId,
      name: catName.trim(),
      slug: slugify(catName),
      sortOrder: categories.length + 1,
      isActive: true,
      createdAt: Date.now(),
    });
    setCatName("");
    alert("Category created!");
  };

  return (
    <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 space-y-6">
      
      {/* Top Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
        <div>
          <h1 className="text-lg font-black text-slate-900">Services & Dynamic Form Builder</h1>
          <p className="text-xs text-slate-500">Configure online digital services, application form fields, required documents, and pricing.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'services' ? "bg-brand-blue text-white shadow" : "bg-slate-100 text-slate-700"
            }`}
          >
            Services ({services.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'categories' ? "bg-brand-blue text-white shadow" : "bg-slate-100 text-slate-700"
            }`}
          >
            Categories ({categories.length})
          </button>
        </div>
      </div>

      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={openNewService}
              className="bg-brand-accent hover:bg-brand-accentHover text-white text-xs font-bold py-2 px-4 rounded-lg shadow flex items-center space-x-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              <span>+ Create New Service</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Service Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Fields</th>
                  <th className="p-3">Processing</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((srv) => (
                  <tr key={srv.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{srv.name}</td>
                    <td className="p-3 text-slate-600">{srv.categoryName}</td>
                    <td className="p-3 font-black text-emerald-700">{formatCurrency(srv.discountPrice || srv.price)}</td>
                    <td className="p-3 text-slate-500">{srv.formFields?.length || 0} fields</td>
                    <td className="p-3 text-slate-500">{srv.processingTime}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        srv.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {srv.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => openEditService(srv)}
                        className="text-brand-blue font-bold hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(srv.id)}
                        className="text-rose-600 font-bold hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveCategory} className="flex gap-2 max-w-md">
            <input
              type="text"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="New Category Name (e.g. Banking Services)"
              required
              className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
            />
            <button
              type="submit"
              className="bg-brand-blue text-white font-bold text-xs px-4 py-2 rounded-lg shadow"
            >
              Add Category
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <div key={cat.id} className="p-3.5 border rounded-xl flex items-center justify-between bg-slate-50">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{cat.name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">slug: {cat.slug}</span>
                </div>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="text-rose-500 hover:text-rose-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Editor Modal & Dynamic Form Builder */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto my-8">
            
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-sm font-black text-slate-900">
                {editId ? "Edit Service & Form Fields" : "Create New Digital Service"}
              </h3>
              <button onClick={() => setEditorOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Service Title *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. New PAN Card Online Application (eKYC)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Processing Time *</label>
                  <input
                    type="text"
                    value={processingTime}
                    onChange={(e) => setProcessingTime(e.target.value)}
                    placeholder="e.g. 3 to 5 Days"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Standard Fee (INR) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Discount Price (Optional)</label>
                  <input
                    type="number"
                    value={discountPrice || ""}
                    onChange={(e) => setDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 99"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description *</label>
                <input
                  type="text"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Brief 1-sentence overview"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Detailed Guidelines</label>
                <textarea
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              {/* Required Documents Editor */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                <label className="block text-xs font-bold text-slate-800">Required Documents Checklist</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDocText}
                    onChange={(e) => setNewDocText(e.target.value)}
                    placeholder="e.g. Ration Card Copy"
                    className="flex-1 bg-white border border-slate-300 rounded-lg p-1.5 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddDoc}
                    className="bg-brand-blue text-white text-xs px-3 py-1.5 rounded-lg font-bold"
                  >
                    + Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {requiredDocs.map((doc, idx) => (
                    <span key={idx} className="bg-white border text-xs px-2 py-1 rounded-md flex items-center space-x-1">
                      <span>{doc}</span>
                      <button type="button" onClick={() => handleRemoveDoc(idx)} className="text-rose-500 font-bold ml-1">✕</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Dynamic Form Field Builder */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <h4 className="text-xs font-black uppercase text-brand-blue">
                  Dynamic Application Form Field Builder
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600">Field Label</label>
                    <input
                      type="text"
                      value={fieldLabel}
                      onChange={(e) => setFieldLabel(e.target.value)}
                      placeholder="e.g. Father Name"
                      className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600">Input Type</label>
                    <select
                      value={fieldType}
                      onChange={(e) => setFieldType(e.target.value as FieldType)}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs"
                    >
                      <option value="text">Text Input</option>
                      <option value="number">Number</option>
                      <option value="tel">Phone / Tel</option>
                      <option value="date">Date Picker</option>
                      <option value="file">File / Document Upload</option>
                      <option value="select">Dropdown Select</option>
                      <option value="textarea">Textarea</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddField}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 rounded"
                    >
                      + Insert Field
                    </button>
                  </div>
                </div>

                {/* Form Fields List */}
                <div className="space-y-1 pt-1">
                  {formFields.map((f, i) => (
                    <div key={f.id} className="bg-white p-2 border rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{i + 1}. {f.label}</span>
                        <span className="text-[10px] text-slate-400 ml-2">({f.type} {f.required ? "• required" : ""})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveField(f.id)}
                        className="text-rose-500 hover:text-rose-700 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status and Visibility */}
              <div className="flex items-center space-x-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 mr-2">Publish Status:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="bg-slate-50 border border-slate-300 rounded p-1 text-xs font-bold"
                  >
                    <option value="published">Published (Live)</option>
                    <option value="draft">Draft</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>

                <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              <div className="flex space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-blue hover:bg-brand-primary text-white font-bold text-xs rounded-lg shadow"
                >
                  Save Service
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
