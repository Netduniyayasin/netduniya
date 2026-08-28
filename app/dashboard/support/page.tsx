"use client";

import React, { useEffect, useState } from "react";
import { 
  HelpCircle, 
  PlusCircle, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  ShieldCheck 
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { 
  subscribeToUserTickets, 
  createSupportTicket, 
  sendTicketReply 
} from "@/lib/firestore-service";
import { SupportTicket } from "@/lib/types";
import { formatDateTime, getStatusBadgeClass, formatStatusLabel } from "@/lib/utils";

export default function UserSupportPage() {
  const { user, profile } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Service Application");
  const [initialMessage, setInitialMessage] = useState("");
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToUserTickets(user.uid, (data) => {
      setTickets(data);
      if (activeTicket) {
        const updated = data.find(t => t.id === activeTicket.id);
        if (updated) setActiveTicket(updated);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [user, activeTicket]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !subject || !initialMessage) return;
    setSubmitting(true);
    try {
      const now = Date.now();
      const ticket = await createSupportTicket({
        userId: user.uid,
        userName: profile?.fullName || user.email || "User",
        userEmail: user.email || "",
        userPhone: profile?.phoneNumber || "",
        subject,
        category,
        status: 'open',
        priority: 'medium',
        messages: [
          {
            id: `msg-${now}`,
            senderId: user.uid,
            senderName: profile?.fullName || "User",
            senderRole: 'user',
            message: initialMessage,
            timestamp: now,
          }
        ],
      });

      setNewModalOpen(false);
      setSubject("");
      setInitialMessage("");
      setActiveTicket(ticket);
    } catch (err) {
      console.error(err);
      alert("Failed to create support ticket");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeTicket || !replyText.trim()) return;
    try {
      await sendTicketReply(activeTicket.id, {
        senderId: user.uid,
        senderName: profile?.fullName || "User",
        senderRole: 'user',
        message: replyText.trim(),
      });
      setReplyText("");
    } catch (err) {
      console.error(err);
      alert("Failed to send reply");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
        <div>
          <h1 className="text-lg font-black text-slate-900">Help & Support Tickets</h1>
          <p className="text-xs text-slate-500">Direct message center with our Kendra operations & verification team.</p>
        </div>

        <button
          type="button"
          onClick={() => setNewModalOpen(true)}
          className="bg-brand-blue hover:bg-brand-primary text-white text-xs font-bold py-2 px-4 rounded-lg shadow flex items-center space-x-1.5"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Support Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Ticket List (5 cols) */}
        <div className="md:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Ticket Queue</h3>
          
          {loading ? (
            <p className="text-xs text-slate-400">Loading tickets...</p>
          ) : tickets.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">No support tickets created yet.</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {tickets.map((t) => {
                const isSelected = activeTicket?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setActiveTicket(t)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition text-xs space-y-1.5 ${
                      isSelected
                        ? "border-brand-blue bg-blue-50/70 shadow-sm"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-500 text-[10px]">{t.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getStatusBadgeClass(t.status)}`}>
                        {formatStatusLabel(t.status)}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 truncate">{t.subject}</h4>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>{t.category}</span>
                      <span>{formatDateTime(t.updatedAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Live Conversation Chat Area (7 cols) */}
        <div className="md:col-span-7 border border-slate-200 rounded-xl overflow-hidden flex flex-col h-[500px]">
          {activeTicket ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-brand-blue font-bold">{activeTicket.id}</span>
                  <h3 className="text-sm font-black text-slate-900 truncate">{activeTicket.subject}</h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(activeTicket.status)}`}>
                  {formatStatusLabel(activeTicket.status)}
                </span>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40">
                {activeTicket.messages?.map((msg, idx) => {
                  const isStaff = msg.senderRole === 'admin';
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col ${isStaff ? "items-start" : "items-end"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed space-y-1 shadow-sm ${
                          isStaff
                            ? "bg-white border border-blue-200 text-slate-900 rounded-tl-none"
                            : "bg-brand-blue text-white rounded-tr-none"
                        }`}
                      >
                        <div className="flex items-center space-x-1 font-bold text-[10px] opacity-75">
                          {isStaff ? <ShieldCheck className="h-3 w-3 text-brand-blue inline" /> : <User className="h-3 w-3 inline" />}
                          <span>{msg.senderName} {isStaff && "(Verified Staff)"}</span>
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

              {/* Reply Input */}
              <form onSubmit={handleSendReply} className="p-3 bg-white border-t border-slate-200 flex space-x-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-brand-blue focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="bg-brand-blue hover:bg-brand-primary text-white px-4 py-2 rounded-lg font-bold text-xs shadow flex items-center space-x-1 disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
              <MessageSquare className="h-10 w-10 text-slate-300" />
              <p className="text-xs">Select a ticket from the left queue to view messages or click "New Support Ticket".</p>
            </div>
          )}
        </div>

      </div>

      {/* New Ticket Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-sm font-black text-slate-900">Create New Support Ticket</h3>
              <button onClick={() => setNewModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                >
                  <option value="Service Application">Service Application Query</option>
                  <option value="PVC Card Order">PVC Card Order</option>
                  <option value="Wallet & Payment">Wallet & Payment Issue</option>
                  <option value="Appointment">Kendra Appointment</option>
                  <option value="General Inquiry">General Citizen Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  placeholder="e.g. Need update on PAN card application"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Message *</label>
                <textarea
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  required
                  rows={4}
                  placeholder="Explain your inquiry or issue..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 bg-brand-blue hover:bg-brand-primary text-white font-bold text-xs rounded-lg shadow"
                >
                  {submitting ? "Submitting..." : "Submit Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
