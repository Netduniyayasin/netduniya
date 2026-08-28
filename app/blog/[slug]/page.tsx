"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  BookOpen, 
  ArrowLeft, 
  Calendar, 
  User, 
  Share2, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { getBlogBySlug } from "@/lib/firestore-service";
import { BlogArticle } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [blog, setBlog] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      const res = await getBlogBySlug(slug);
      setBlog(res);
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <Loader2 className="h-10 w-10 text-brand-blue animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-600">Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center bg-white rounded-xl shadow p-8">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Article Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">This article does not exist or has been removed.</p>
        <Link href="/blog" className="mt-4 inline-block bg-brand-blue text-white text-xs font-bold px-4 py-2 rounded">
          ← Back to All Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/blog" className="hover:text-brand-blue flex items-center">
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Back to Blog
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate">{blog.title}</span>
      </div>

      <article className="bg-white rounded-xl shadow-card border border-slate-200 p-6 sm:p-10 space-y-6">
        
        {/* Header Metadata */}
        <div className="space-y-3 border-b border-slate-100 pb-6">
          <span className="text-xs font-black uppercase text-indigo-700 bg-indigo-50 px-3 py-1 rounded">
            {blog.category || "E-Governance"}
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center space-x-4 text-xs text-slate-500 pt-2">
            <span className="flex items-center">
              <User className="h-3.5 w-3.5 mr-1 text-slate-400" />
              {blog.author || "NetDuniya Team"}
            </span>
            <span>•</span>
            <span className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1 text-slate-400" />
              {formatDate(blog.publishedAt || blog.createdAt)}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        {blog.imageUrl && (
          <div className="rounded-xl overflow-hidden shadow-md max-h-[380px] bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Lead Summary Box */}
        {blog.summary && (
          <div className="bg-slate-50 border-l-4 border-brand-blue p-4 rounded-r-lg text-xs sm:text-sm text-slate-700 font-medium leading-relaxed italic">
            "{blog.summary}"
          </div>
        )}

        {/* Article Body */}
        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-800 leading-relaxed space-y-4 whitespace-pre-line">
          {blog.content}
        </div>

        {/* Call to action */}
        <div className="mt-8 pt-6 border-t border-slate-100 bg-blue-50/50 p-6 rounded-xl border border-blue-100 text-center space-y-2">
          <h3 className="text-sm font-bold text-brand-blue">Need help with an online government application?</h3>
          <p className="text-xs text-slate-600">Our certified Kendra team can assist you with form filling, document verification, and tracking.</p>
          <Link
            href="/services"
            className="inline-block mt-2 bg-brand-blue hover:bg-brand-primary text-white text-xs font-bold py-2.5 px-6 rounded-lg shadow transition"
          >
            Explore Available Services
          </Link>
        </div>

      </article>

    </div>
  );
}
