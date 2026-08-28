"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  Wallet, 
  Search, 
  ShieldCheck, 
  AlertCircle, 
  Edit3, 
  CheckCircle2, 
  History,
  UserPlus,
  Lock,
  Mail,
  Phone,
  User,
  Loader2,
  Filter,
  Trash2,
  Ban,
  CheckCircle,
  PlusCircle,
  MinusCircle,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { 
  collection, 
  query, 
  limit,
  onSnapshot
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { 
  executeWalletTransaction, 
  createOrUpdateUser, 
  subscribeToUserWalletTransactions,
  recordAuditLog,
  deleteUserProfile,
  toggleUserBlockStatus
} from "@/lib/firestore-service";
import { UserProfile, WalletTransaction, UserRole } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function AdminUsersPage() {
  const { profile: adminProfile, user: adminUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit User Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("user");
  const [savingEdit, setSavingEdit] = useState(false);
  const [editMsg, setEditMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Create Staff / Admin Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPassword, setNewStaffPassword] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<UserRole>("admin");
  const [newStaffRules, setNewStaffRules] = useState<string[]>(["all"]);
  const [creatingStaff, setCreatingStaff] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  // Wallet Adjustment State
  const [adjustAmount, setAdjustAmount] = useState<number>(100);
  const [adjustType, setAdjustType] = useState<'credit' | 'debit'>('debit');
  const [adjustReason, setAdjustReason] = useState("");
  const [adjusting, setAdjusting] = useState(false);
  const [walletFeedback, setWalletFeedback] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Block / Delete State
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "users"), limit(200));
    const unsub = onSnapshot(q, (snap) => {
      const uList = snap.docs.map(d => ({ uid: d.id, ...d.data() }) as UserProfile);
      setUsers(uList);
      
      // Keep selected user updated with real-time data
      if (selectedUser) {
        const updated = uList.find(u => u.uid === selectedUser.uid);
        if (updated) setSelectedUser(updated);
      } else if (uList.length > 0) {
        setSelectedUser(uList[0]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [selectedUser?.uid]);

  useEffect(() => {
    if (!selectedUser) return;
    const unsub = subscribeToUserWalletTransactions(selectedUser.uid, (txns) => {
      setTransactions(txns);
    });
    return () => unsub();
  }, [selectedUser?.uid]);

  const filtered = users.filter(u => {
    const isStaff = ['super_admin', 'admin', 'service_manager', 'finance_manager', 'content_manager', 'support_manager'].includes(u.role);
    const isBlocked = u.isActive === false;
    const matchesRole = 
      roleFilter === "all" ? true :
      roleFilter === "staff" ? isStaff :
      roleFilter === "citizens" ? !isStaff :
      roleFilter === "blocked" ? isBlocked :
      u.role === roleFilter;

    const matchesSearch = searchQuery === "" ||
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phoneNumber && u.phoneNumber.includes(searchQuery)) ||
      u.uid.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRole && matchesSearch;
  });

  // Open Edit Modal
  const openEditModal = (u: UserProfile) => {
    setEditName(u.fullName || "");
    setEditEmail(u.email || "");
    setEditPhone(u.phoneNumber || "");
    setEditRole(u.role || "user");
    setEditMsg(null);
    setEditModalOpen(true);
  };

  // Save Edit User
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSavingEdit(true);
    setEditMsg(null);

    try {
      await createOrUpdateUser({
        uid: selectedUser.uid,
        fullName: editName.trim(),
        email: editEmail.trim().toLowerCase(),
        phoneNumber: editPhone.trim(),
        role: editRole,
      });

      await recordAuditLog({
        actorId: adminUser?.uid || "admin",
        actorName: adminProfile?.fullName || "Admin",
        actorRole: adminProfile?.role || "admin",
        action: "edit_user_profile",
        module: "users",
        recordId: selectedUser.uid,
        details: `Admin updated user details for ${editEmail.trim()}`,
      });

      setEditMsg({ type: "success", text: "User profile updated successfully in Firestore!" });
      setTimeout(() => {
        setEditModalOpen(false);
        setEditMsg(null);
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setEditMsg({ type: "error", text: err.message || "Failed to update user profile" });
    } finally {
      setSavingEdit(false);
    }
  };

  // Toggle Block / Unblock User
  const handleToggleBlock = async () => {
    if (!selectedUser) return;
    const currentlyActive = selectedUser.isActive !== false;
    const confirmText = currentlyActive
      ? `Are you sure you want to BLOCK / SUSPEND ${selectedUser.fullName} (${selectedUser.email})? They will be logged out and cannot access any services.`
      : `Unblock ${selectedUser.fullName} (${selectedUser.email}) and restore normal account access?`;

    if (!confirm(confirmText)) return;

    setActionLoading(true);
    try {
      await toggleUserBlockStatus(selectedUser.uid, !currentlyActive, adminProfile?.fullName || "Admin");
      alert(currentlyActive ? "User has been BLOCKED." : "User has been UNBLOCKED.");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to update block status");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete User
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    if (selectedUser.role === 'super_admin' && adminProfile?.role !== 'super_admin') {
      alert("Only a Master Super Admin can delete another Super Admin.");
      return;
    }

    const confirmText = `CRITICAL WARNING: Are you sure you want to PERMANENTLY DELETE user "${selectedUser.fullName}" (${selectedUser.email})?\n\nThis will remove their profile and records from NetDuniya Firestore. This action CANNOT be undone.`;
    if (!confirm(confirmText)) return;

    const typedConfirmation = prompt(`Type "DELETE" to confirm permanent deletion of ${selectedUser.email}:`);
    if (typedConfirmation !== "DELETE") {
      alert("Deletion cancelled. You must type DELETE to confirm.");
      return;
    }

    setActionLoading(true);
    try {
      const deletedUid = selectedUser.uid;
      await deleteUserProfile(deletedUid, adminProfile?.fullName || "Admin");
      setSelectedUser(null);
      alert("User profile has been permanently deleted from Firestore.");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete user profile");
    } finally {
      setActionLoading(false);
    }
  };

  // Quick Wallet Deduct / Credit
  const handleQuickWallet = async (amount: number, type: 'credit' | 'debit') => {
    if (!selectedUser) return;
    const actionLabel = type === 'credit' ? 'Add' : 'Deduct';
    const reason = prompt(`Reason for ${actionLabel} ₹${amount} ${type === 'credit' ? 'to' : 'from'} ${selectedUser.fullName}'s wallet:`, `${actionLabel} by Admin`);
    if (!reason) return;

    setAdjusting(true);
    setWalletFeedback(null);
    try {
      const res = await executeWalletTransaction(
        selectedUser.uid,
        amount,
        type === 'credit' ? 'adjustment' : 'debit',
        'admin_adjustment',
        `Admin manual ${type}: ${reason.trim()}`,
        undefined,
        adminProfile?.fullName || adminUser?.email || 'admin'
      );

      if (!res.success) throw new Error(res.error);

      await recordAuditLog({
        actorId: adminUser?.uid || "admin",
        actorName: adminProfile?.fullName || "Admin",
        actorRole: adminProfile?.role || "admin",
        action: `wallet_quick_${type}`,
        module: "users",
        recordId: selectedUser.uid,
        details: `Quick ${type.toUpperCase()} of ₹${amount} for ${selectedUser.email}. Reason: ${reason}`,
      });

      setWalletFeedback({ type: 'success', text: `Success: ${type === 'credit' ? '+' : '-'}₹${amount}. New Balance: ₹${res.newBalance}` });
      setTimeout(() => setWalletFeedback(null), 4000);
    } catch (err: any) {
      console.error(err);
      setWalletFeedback({ type: 'error', text: err.message || "Transaction failed" });
    } finally {
      setAdjusting(false);
    }
  };

  // Custom Wallet Adjustment Form
  const handleAdjustWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !adjustReason.trim() || adjustAmount <= 0) return;

    if (!confirm(`Confirm: ${adjustType === 'credit' ? 'Credit (+)' : 'Deduct (-)'} ₹${adjustAmount} to ${selectedUser.fullName}'s wallet?`)) return;

    setAdjusting(true);
    setWalletFeedback(null);
    try {
      const res = await executeWalletTransaction(
        selectedUser.uid,
        adjustAmount,
        adjustType === 'credit' ? 'adjustment' : 'debit',
        'admin_adjustment',
        `Admin manual adjustment: ${adjustReason.trim()}`,
        undefined,
        adminProfile?.fullName || adminUser?.email || 'admin'
      );

      if (!res.success) throw new Error(res.error);

      await recordAuditLog({
        actorId: adminUser?.uid || "admin",
        actorName: adminProfile?.fullName || "Admin",
        actorRole: adminProfile?.role || "admin",
        action: `wallet_adjustment_${adjustType}`,
        module: "users",
        recordId: selectedUser.uid,
        details: `${adjustType.toUpperCase()} of ₹${adjustAmount} to ${selectedUser.email}. Reason: ${adjustReason}`,
      });

      setWalletFeedback({ type: 'success', text: `Wallet updated successfully! New Balance: ₹${res.newBalance}` });
      setAdjustReason("");
      setTimeout(() => setWalletFeedback(null), 4000);
    } catch (err: any) {
      console.error(err);
      setWalletFeedback({ type: 'error', text: err.message || "Failed to adjust wallet balance" });
    } finally {
      setAdjusting(false);
    }
  };

  // Create Staff Account
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);
    setCreatingStaff(true);

    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: newStaffName,
          email: newStaffEmail,
          password: newStaffPassword,
          role: newStaffRole,
          rules: newStaffRules,
          phoneNumber: newStaffPhone,
          creatorName: adminProfile?.fullName || "Super Admin",
          creatorId: adminUser?.uid || "admin",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create staff account");
      }

      setCreateSuccess(`Staff account created! ${newStaffName} (${newStaffEmail}) can now log in directly at /login with their password.`);
      setNewStaffName("");
      setNewStaffEmail("");
      setNewStaffPassword("");
      setNewStaffPhone("");

      setTimeout(() => {
        setCreateModalOpen(false);
        setCreateSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setCreateError(err.message || "Failed to create staff account");
    } finally {
      setCreatingStaff(false);
    }
  };

  const staffCount = users.filter(u => ['super_admin', 'admin', 'service_manager', 'finance_manager', 'content_manager', 'support_manager'].includes(u.role)).length;
  const blockedCount = users.filter(u => u.isActive === false).length;

  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-200 p-6 space-y-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center space-x-2">
            <Users className="h-6 w-6 text-brand-blue" />
            <span>Real-time Citizen & User Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full admin control: view users, edit details, block/unblock, delete, and add/deduct digital wallet balance in real time.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="bg-brand-accent hover:bg-brand-accentHover text-white text-xs font-black py-2.5 px-4 rounded-xl shadow-lg transition flex items-center space-x-2 cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          <span>+ Create Staff / Admin Account</span>
        </button>
      </div>

      {/* Role Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setRoleFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              roleFilter === "all" ? "bg-brand-blue text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter("staff")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              roleFilter === "staff" ? "bg-amber-500 text-slate-900 shadow font-black" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Staff & Admins ({staffCount})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter("citizens")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              roleFilter === "citizens" ? "bg-brand-blue text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Citizens ({users.length - staffCount})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter("blocked")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              roleFilter === "blocked" ? "bg-rose-600 text-white shadow" : "bg-slate-100 text-rose-600 hover:bg-rose-50"
            }`}
          >
            Blocked ({blockedCount})
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, phone, or UID..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Main Grid: User List + User Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: User Directory (5 cols) */}
        <div className="lg:col-span-5 space-y-2 max-h-[640px] overflow-y-auto pr-1">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading user records from Firestore...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center border border-dashed rounded-xl text-slate-400 text-xs">
              No matching users found.
            </div>
          ) : (
            filtered.map((u) => {
              const isSelected = selectedUser?.uid === u.uid;
              const isStaff = ['super_admin', 'admin', 'service_manager', 'finance_manager', 'content_manager'].includes(u.role);
              const isBlocked = u.isActive === false;

              return (
                <div
                  key={u.uid}
                  onClick={() => setSelectedUser(u)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition text-xs space-y-1.5 ${
                    isSelected
                      ? "border-brand-blue bg-blue-50/80 shadow-md ring-2 ring-brand-blue"
                      : isBlocked
                      ? "border-rose-300 bg-rose-50/40 hover:bg-rose-50"
                      : isStaff
                      ? "border-amber-200 bg-amber-50/40 hover:bg-amber-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 truncate">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                        {u.fullName?.charAt(0) || u.email?.charAt(0) || "U"}
                      </div>
                      <h4 className="font-bold text-slate-900 truncate">{u.fullName || "Unnamed User"}</h4>
                    </div>

                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      {isBlocked && (
                        <span className="bg-rose-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded uppercase">
                          BLOCKED
                        </span>
                      )}
                      <span className={`font-mono text-[9px] px-2 py-0.5 rounded font-extrabold uppercase ${
                        u.role === 'super_admin' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                        isStaff ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-500 text-[11px] truncate">{u.email}</p>
                  
                  <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-100">
                    <span className="text-slate-400">{u.phoneNumber || "No Phone"}</span>
                    <span className="font-black text-emerald-700">Wallet: {formatCurrency(u.walletBalance || 0)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Selected User Inspection & Full Admin Control (7 cols) */}
        <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-5">
          {selectedUser ? (
            <>
              {/* Selected User Header Card */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center font-black text-base shadow">
                      {selectedUser.fullName?.charAt(0) || selectedUser.email?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-base font-black text-slate-900">{selectedUser.fullName}</h2>
                        {selectedUser.role === 'super_admin' && (
                          <span className="text-[10px] uppercase font-black bg-rose-600 text-white px-2 py-0.5 rounded">
                            Master Super Admin
                          </span>
                        )}
                        {selectedUser.isActive === false ? (
                          <span className="text-[10px] uppercase font-black bg-rose-600 text-white px-2 py-0.5 rounded">
                            BLOCKED
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-black bg-emerald-600 text-white px-2 py-0.5 rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{selectedUser.email} &bull; {selectedUser.phoneNumber || "No Phone Registered"}</p>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">UID: {selectedUser.uid}</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                    Role: <strong className="text-slate-900 uppercase">{selectedUser.role.replace('_', ' ')}</strong>
                  </span>
                </div>

                {/* ADMIN ACTION TOOLBAR: EDIT, BLOCK/UNBLOCK, DELETE */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(selectedUser)}
                    className="bg-blue-50 hover:bg-blue-100 text-brand-blue font-bold text-xs px-3 py-1.5 rounded-lg border border-blue-200 flex items-center space-x-1.5 cursor-pointer transition shadow-sm"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit User Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleBlock}
                    disabled={actionLoading}
                    className={`font-bold text-xs px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 cursor-pointer transition shadow-sm ${
                      selectedUser.isActive === false
                        ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300"
                        : "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300"
                    }`}
                  >
                    {selectedUser.isActive === false ? (
                      <>
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Unblock User</span>
                      </>
                    ) : (
                      <>
                        <Ban className="h-3.5 w-3.5" />
                        <span>Block / Suspend User</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteUser}
                    disabled={actionLoading}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-rose-200 flex items-center space-x-1.5 cursor-pointer transition shadow-sm ml-auto"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                    <span>Delete User</span>
                  </button>
                </div>
              </div>

              {/* Digital Wallet Control Center */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Citizen Digital Wallet Ledger
                    </span>
                    <span className="text-3xl font-black text-emerald-700">
                      {formatCurrency(selectedUser.walletBalance || 0)}
                    </span>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <Wallet className="h-7 w-7 text-emerald-600" />
                  </div>
                </div>

                {/* Quick Detect / Deduct & Credit Shortcuts */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-600 block">Quick 1-Click Balance Adjustments:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      disabled={adjusting}
                      onClick={() => handleQuickWallet(50, 'debit')}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-black py-1.5 px-2 rounded-lg transition flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <MinusCircle className="h-3.5 w-3.5 text-rose-600" />
                      <span>- Deduct ₹50</span>
                    </button>
                    <button
                      type="button"
                      disabled={adjusting}
                      onClick={() => handleQuickWallet(100, 'debit')}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-black py-1.5 px-2 rounded-lg transition flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <MinusCircle className="h-3.5 w-3.5 text-rose-600" />
                      <span>- Deduct ₹100</span>
                    </button>
                    <button
                      type="button"
                      disabled={adjusting}
                      onClick={() => handleQuickWallet(100, 'credit')}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-black py-1.5 px-2 rounded-lg transition flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <PlusCircle className="h-3.5 w-3.5 text-emerald-600" />
                      <span>+ Add ₹100</span>
                    </button>
                    <button
                      type="button"
                      disabled={adjusting}
                      onClick={() => handleQuickWallet(500, 'credit')}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-black py-1.5 px-2 rounded-lg transition flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <PlusCircle className="h-3.5 w-3.5 text-emerald-600" />
                      <span>+ Add ₹500</span>
                    </button>
                  </div>
                </div>

                {/* Feedback Message */}
                {walletFeedback && (
                  <div className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                    walletFeedback.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
                  }`}>
                    {walletFeedback.type === 'success' ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" /> : <AlertCircle className="h-4 w-4 flex-shrink-0" />}
                    <span>{walletFeedback.text}</span>
                  </div>
                )}

                {/* Custom Adjustment Form */}
                <form onSubmit={handleAdjustWallet} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-black uppercase text-slate-900">
                    Custom Wallet Adjustment (Logged in Audit Trail)
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Action Type</label>
                      <select
                        value={adjustType}
                        onChange={(e) => setAdjustType(e.target.value as any)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold"
                      >
                        <option value="debit">Deduct Money (- Debit)</option>
                        <option value="credit">Add Money (+ Credit)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹ INR)</label>
                      <input
                        type="number"
                        min={1}
                        value={adjustAmount}
                        onChange={(e) => setAdjustAmount(Number(e.target.value))}
                        required
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mandatory Reason / Note *</label>
                    <input
                      type="text"
                      value={adjustReason}
                      onChange={(e) => setAdjustReason(e.target.value)}
                      required
                      placeholder="e.g. Service fee deduction / Refund for failed application / Cash deposited at Kendra"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={adjusting}
                    className="w-full bg-brand-blue hover:bg-brand-primary text-white font-black text-xs py-2.5 rounded-lg shadow transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    {adjusting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Updating Firestore Ledger...</span>
                      </>
                    ) : (
                      <span>{adjustType === 'debit' ? 'Execute Deduction (- Debit)' : 'Execute Deposit (+ Credit)'}</span>
                    )}
                  </button>
                </form>
              </div>

              {/* Transactions Passbook */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-slate-700 flex items-center space-x-1.5">
                  <History className="h-3.5 w-3.5 text-slate-500" />
                  <span>Real-time Wallet Passbook ({transactions.length} entries):</span>
                </h3>
                {transactions.length === 0 ? (
                  <p className="text-xs text-slate-400 bg-white p-4 rounded-xl border text-center">No wallet transactions recorded yet.</p>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {transactions.map((t) => (
                      <div key={t.id} className="bg-white p-2.5 border rounded-lg text-xs flex justify-between items-center shadow-xs">
                        <div>
                          <p className="font-semibold text-slate-800">{t.description}</p>
                          <span className="text-[10px] text-slate-400">{formatDateTime(t.createdAt)} &bull; By: {t.createdBy}</span>
                        </div>
                        <div className="text-right">
                          <span className={`font-black text-xs block ${t.type === 'credit' || t.type === 'adjustment' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {t.type === 'credit' || (t.type === 'adjustment' && t.amount > 0) ? `+ ₹${t.amount}` : `- ₹${t.amount}`}
                          </span>
                          <span className="text-[9px] text-slate-400">Bal: ₹{t.balanceAfter}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400 text-center py-16">Select a user from the directory to inspect.</p>
          )}
        </div>

      </div>

      {/* EDIT USER DETAILS MODAL */}
      {editModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Edit3 className="h-5 w-5 text-brand-blue" />
                <h3 className="text-base font-black text-slate-900">Edit User Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {editMsg && (
              <div className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                editMsg.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}>
                {editMsg.type === 'success' ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" /> : <AlertCircle className="h-4 w-4 flex-shrink-0" />}
                <span>{editMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">User Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-bold"
                >
                  <option value="user">Citizen / Regular User</option>
                  <option value="operator">Front Desk Operator</option>
                  <option value="service_manager">Service Manager</option>
                  <option value="finance_manager">Finance Manager</option>
                  <option value="admin">Operations Admin</option>
                  <option value="super_admin">Super Admin (Master)</option>
                </select>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 py-2.5 bg-brand-blue hover:bg-brand-primary text-white font-black text-xs rounded-xl shadow transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  {savingEdit ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <span>Save to Firestore</span>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* CREATE STAFF / ADMIN ACCOUNT MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5 text-brand-blue" />
                <h3 className="text-base font-black text-slate-900">Create Staff / Admin Account</h3>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Create an official login account. The staff member will be able to sign in immediately at <strong>/login</strong> using this email and password.
            </p>

            {createError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            {createSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>{createSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Staff Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    required
                    placeholder="e.g. Md Sazzidul Islam"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-brand-blue"
                  />
                  <User className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Staff Email / Gmail ID *</label>
                <div className="relative">
                  <input
                    type="email"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    required
                    placeholder="e.g. staff@netduniya.in or name@gmail.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-brand-blue"
                  />
                  <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Login Password * (Min 6 chars)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={newStaffPassword}
                    onChange={(e) => setNewStaffPassword(e.target.value)}
                    required
                    placeholder="e.g. Staff@NetDuniya2026"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs font-mono focus:ring-2 focus:ring-brand-blue"
                  />
                  <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Staff Role *</label>
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value as UserRole)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold"
                  >
                    <option value="super_admin">Super Admin (Full Master)</option>
                    <option value="admin">Operations Admin</option>
                    <option value="service_manager">Service Manager</option>
                    <option value="finance_manager">Finance Manager</option>
                    <option value="operator">Front Desk Operator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone (Optional)</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={newStaffPhone}
                      onChange={(e) => setNewStaffPhone(e.target.value)}
                      placeholder="10-digit mobile"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-2 py-2 text-xs"
                    />
                    <Phone className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Administrative Rules & Permissions
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: "all", label: "Full Master Access" },
                    { id: "manage_applications", label: "Applications & PVC" },
                    { id: "manage_services", label: "Services & Schemes" },
                    { id: "manage_users", label: "Users & Wallets" },
                    { id: "manage_cms", label: "CMS, Notices & Banners" },
                    { id: "manage_settings", label: "Portal Configuration" },
                  ].map((rule) => {
                    const checked = newStaffRules.includes(rule.id);
                    return (
                      <label
                        key={rule.id}
                        className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition ${
                          checked ? "bg-amber-50 border-amber-300 text-amber-950 font-bold" : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (rule.id === "all") {
                              setNewStaffRules(e.target.checked ? ["all"] : []);
                            } else {
                              const withoutAll = newStaffRules.filter(r => r !== "all");
                              if (e.target.checked) {
                                setNewStaffRules([...withoutAll, rule.id]);
                              } else {
                                setNewStaffRules(withoutAll.filter(r => r !== rule.id));
                              }
                            }
                          }}
                          className="rounded text-brand-blue"
                        />
                        <span className="text-[11px] leading-tight">{rule.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingStaff}
                  className="flex-1 py-2.5 bg-brand-accent hover:bg-brand-accentHover text-white font-black text-xs rounded-xl shadow transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  {creatingStaff ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Create & Activate Staff</span>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
