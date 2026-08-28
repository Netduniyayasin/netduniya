"use client";

import React, { useEffect, useState } from "react";
import { BookOpen, PlusCircle, Trash2, Edit3, Save, Eye } from "lucide-react";
import { subscribeToBlogs, saveBlog, deleteBlog } from "@/lib/firestore-service";
import { BlogArticle } from "@/lib/types";
import { slugify, formatDate } from "@/lib/utils";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogArticle[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("E-Governance");
  const [author, setAuthor] = useState("NetDuniya Editorial");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('published');

  useEffect(() => {
    const unsub = subscribeToBlogs((data) => setBlogs(data), false);
    return () => unsub();
  }, []);

  const openNew = () => {
    setEditId(null);
    setTitle("");
    setCategory("E-Governance");
    setAuthor("NetDuniya Editorial");
    setSummary("");
    setContent("");
    setImageUrl("");
    setStatus('published');
    setModalOpen(true);
  };

  const openEdit = (b: BlogArticle) => {
    setEditId(b.id);
    setTitle(b.title);
    setCategory(b.category);
    setAuthor(b.author);
    setSummary(b.summary);
    setContent(b.content);
    setImageUrl(b.imageUrl || "");
    setStatus(b.status);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const bObj: BlogArticle = {
      id: editId || `blog-${Date.now()}`,
      title: title.trim(),
      slug: slugify(title),
      category,
      author,
      summary,
      content,
      imageUrl: imageUrl.trim() || undefined,
      status,
      views: 0,
      publishedAt: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await saveBlog(bObj);
    setModalOpen(false);
    alert("Blog article saved!");
  };

  return (
    <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
        <div>
          <h1 className="text-lg font-black text-slate-900">Blog Articles & Guides CMS</h1>
          <p className="text-xs text-slate-500">Publish citizen knowledgebase guides, scheme explanations, and procedural announcements.</p>
        </div>

        <button
          type="button"
          onClick={openNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-4 rounded-lg shadow flex items-center space-x-1.5"
        >
          <PlusCircle className="h-4 w-4" />
          <span>+ Create New Article</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Author</th>
              <th className="p-3">Published Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {blogs.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-900">{b.title}</td>
                <td className="p-3">{b.category}</td>
                <td className="p-3 text-slate-600">{b.author}</td>
                <td className="p-3 text-slate-500">{formatDate(b.publishedAt || b.createdAt)}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    b.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {b.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => openEdit(b)} className="text-brand-blue font-bold hover:underline">
                    Edit
                  </button>
                  <button onClick={() => deleteBlog(b.id)} className="text-rose-600 font-bold hover:underline">
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
              <h3 className="text-sm font-black text-slate-900">{editId ? "Edit Article" : "Write New Blog Article"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Article Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. How to Link Aadhaar with PAN Card Online Step by Step"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Aadhaar Guides"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Featured Cover Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Summary / Excerpt *</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  required
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Article Content *</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={8}
                  placeholder="Write the full guide, step by step instructions..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-sans"
                />
              </div>

              <div className="flex justify-between items-center pt-2 border-t">
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
                    className="px-5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg shadow"
                  >
                    Save Article
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
