"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Calendar, 
  User, 
  ArrowRight, 
  Eye, 
  Search,
  Sparkles
} from "lucide-react";
import { subscribeToBlogs } from "@/lib/firestore-service";
import { BlogArticle } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<BlogArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToBlogs((data) => {
      setBlogs(data);
      setLoading(false);
    }, true);
    return () => unsub();
  }, []);

  const filtered = blogs.filter((b) => {
    return searchQuery === "" ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Banner */}
      <div className="bg-brand-blue text-white rounded-xl p-6 sm:p-8 shadow-card border-b-4 border-indigo-500">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-300 bg-white/10 px-3 py-1 rounded">
            E-Governance & Citizen Knowledgebase
          </span>
          <h1 className="text-2xl sm:text-4xl font-black mt-2 tracking-tight">
            Latest E-District News, Scheme Updates & Guides
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
            Step-by-step application walkthroughs, rule changes in Aadhaar/PAN linking, scholarship eligibility dates, and digital service announcements.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles and guides..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Blog Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-dashed border-slate-300">
          <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-700">No blog articles published yet.</h3>
          <p className="text-xs text-slate-500 mt-1">Articles and e-governance guides can be published directly from the Admin Panel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((blog) => (
            <article
              key={blog.id}
              className="bg-white rounded-xl shadow-card hover:shadow-elevated border border-slate-200 overflow-hidden flex flex-col justify-between transition-all duration-200 group"
            >
              <div>
                {blog.imageUrl && (
                  <div className="h-44 w-full overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-extrabold uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {blog.category || "Guide"}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(blog.publishedAt || blog.createdAt)}
                    </span>
                  </div>

                  <h2 className="text-base font-black text-slate-900 group-hover:text-brand-blue transition line-clamp-2 leading-snug">
                    {blog.title}
                  </h2>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {blog.summary}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 flex items-center">
                  <User className="h-3.5 w-3.5 mr-1" />
                  {blog.author || "NetDuniya Editorial"}
                </span>

                <Link
                  href={`/blog/${blog.slug}`}
                  className="text-xs font-bold text-brand-blue hover:underline flex items-center"
                >
                  <span>Read Article</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

    </div>
  );
}
