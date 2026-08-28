import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate unique formatted IDs like ND-APP-2026-AB1234
export function generateUniqueId(prefix: 'APP' | 'APT' | 'PVC' | 'ORD' | 'TXN' | 'PAY' | 'TKT'): string {
  const year = new Date().getFullYear();
  const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ND-${prefix}-${year}-${randomChars}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export function formatDate(timestamp: number | string | Date): string {
  if (!timestamp) return 'N/A';
  const d = typeof timestamp === 'number' || typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(timestamp: number | string | Date): string {
  if (!timestamp) return 'N/A';
  const d = typeof timestamp === 'number' || typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'approved':
    case 'completed':
    case 'delivered':
    case 'published':
    case 'success':
    case 'confirmed':
      return 'bg-emerald-100 text-emerald-800 border border-emerald-300';
    case 'in_processing':
    case 'printing':
    case 'shipped':
    case 'in_progress':
    case 'under_review':
      return 'bg-blue-100 text-blue-800 border border-blue-300';
    case 'pending':
    case 'payment_pending':
    case 'draft':
    case 'documents_required':
      return 'bg-amber-100 text-amber-800 border border-amber-300';
    case 'rejected':
    case 'cancelled':
    case 'failed':
    case 'disabled':
    case 'no_show':
      return 'bg-rose-100 text-rose-800 border border-rose-300';
    case 'refunded':
    case 'archived':
      return 'bg-purple-100 text-purple-800 border border-purple-300';
    default:
      return 'bg-slate-100 text-slate-800 border border-slate-300';
  }
}

export function formatStatusLabel(status: string): string {
  if (!status) return 'Unknown';
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
