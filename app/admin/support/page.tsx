"use client";

import React, { useEffect, useState } from "react";
import { 
  HelpCircle, 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  User, 
  Search, 
  CheckCircle2,
  Clock
} from "lucide-react";
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { sendTicketReply, updateSupportTicketStatus } from "@/lib/firestore-service";
import { SupportTicket, TicketStatus } from "@/lib/types";
import { formatDateTime, getStatusBadgeClass, formatStatusLabel } from "@/lib/utils";

export default function AdminSupportPage() {
  const { profile, user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "support_tickets"), orderBy("updatedAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }) as SupportTicket);
      setTickets(list);
      if (selectedTicket) {
        const found = list.find(t => t.id === selectedTicket.id);
        if (found) setSelectedTicket(found);
      } else if (list.length > 0) {
        setSelectedTicket(list[0]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [selectedTicket]);

  const filtered = tickets.filter(t => statusFilter === "all" || t.status === statusFilter);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim() || !user) return;
    try {
      await sendTicketReply(selectedTicket.id, {
        senderId: user.uid,
        senderName: profile?.fullName || "Kendra Support Staff",
        senderRole: 'admin',
        message: replyText.trim(),
      });
      setReplyText("");
    } catch (err) {
      console.error(err);
      alert("Failed to send staff response");
    }
  };

  const handleStatusUpdate = async (newStatus: TicketStatus) => {
    if (!selectedTicket) return;
    await updateSupportTicketStatus(selectedTicket.id, newStatus);
  };

  return (
    <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
        <div>
          <h1 className="text-lg font-black text-slate-900">Support Desk & Inquiries</h1>
          <p className="text-xs text-slate-500">Live citizen inquiries, verification follow-ups, and customer tickets.</p>
        </div>

        <div className="flex items-center space-x-1">
          {["all", "open", "in_progress", "resolved", "closed"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                statusFilter === st ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {st === "all" ? "All" : formatStatusLabel(st)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Ticket Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {loading ? (
            <p className="text-xs text-slate-400 py-6 text-center">Loading tickets...</p>
          ) : filtered.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center border rounded">No support tickets found.</p>
          ) : (
            filtered.map((t) => {
              const isSelected = selectedTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition text-xs space-y-1.5 ${
                    isSelected
                      ? "border-brand-blue bg-blue-50/70 shadow-sm ring-1 ring-brand-blue"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-brand-blue text-[10px]">{t.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getStatusBadgeClass(t.status)}`}>
                      {formatStatusLabel(t.status)}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 truncate">{t.subject}</h4>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{t.userName}</span>
                    <span>{formatDateTime(t.updatedAt)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Conversation & Status Changer (7 cols) */}
        <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex flex-col h-[550px]">
          {selectedTicket ? (
            <>
              {/* Header */}
              <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">{selectedTicket.subject}</h3>
                  <p className="text-xs text-slate-500">
                    From: <strong>{selectedTicket.userName}</strong> ({selectedTicket.userEmail}, {selectedTicket.userPhone})
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleStatusUpdate(e.target.value as TicketStatus)}
                    className="bg-slate-100 border border-slate-300 rounded p-1 text-xs font-bold"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
                {selectedTicket.messages?.map((msg, idx) => {
                  const isStaff = msg.senderRole === 'admin';
                  return (
                    <div key={idx} className={`flex flex-col ${isStaff ? "items-end" : "items-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed space-y-1 shadow-sm ${
                          isStaff
                            ? "bg-brand-blue text-white rounded-tr-none"
                            : "bg-white border border-slate-200 text-slate-900 rounded-tl-none"
                        }`}
                      >
                        <div className="flex items-center space-x-1 font-bold text-[10px] opacity-80">
                          {isStaff ? <ShieldCheck className="h-3 w-3 inline text-amber-300" /> : <User className="h-3 w-3 inline text-slate-400" />}
                          <span>{msg.senderName} {isStaff && "(Official Staff Response)"}</span>
                        </div>
                        <p className="whitespace-pre-line">{msg.message}</p>
                        <span className="text-[9px] block text-right opacity-60">
                          {formatDateTime(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Staff Reply Box */}
              <form onSubmit={handleSendReply} className="p-3 bg-white border-t border-slate-200 flex space-x-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type official staff response..."
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-brand-blue"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="bg-brand-blue hover:bg-brand-primary text-white px-4 py-2 rounded-lg font-bold text-xs shadow flex items-center space-x-1 disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Reply</span>
                </button>
              </form>
            </>
          ) : (
            <p className="text-xs text-slate-400 text-center py-20">Select a support ticket to respond.</p>
          )}
        </div>

      </div>

    </div>
  );
}
