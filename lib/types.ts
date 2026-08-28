export type UserRole = 'super_admin' | 'admin' | 'service_manager' | 'finance_manager' | 'content_manager' | 'support_manager' | 'user';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  walletBalance: number;
  avatarUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface AdminRecord {
  uid: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  rules?: string[];
  isActive: boolean;
  createdBy?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: number;
}

export type FieldType = 
  | 'text' 
  | 'number' 
  | 'email' 
  | 'tel' 
  | 'date' 
  | 'select' 
  | 'radio' 
  | 'checkbox' 
  | 'textarea' 
  | 'file';

export interface DynamicFormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, radio
  helpText?: string;
  sortOrder: number;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName?: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  discountPrice?: number;
  processingTime: string;
  requiredDocuments: string[];
  formFields: DynamicFormField[];
  termsAndConditions?: string;
  iconName?: string;
  imageUrl?: string;
  status: 'draft' | 'published' | 'disabled';
  isFeatured: boolean;
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
}

export type ApplicationStatus = 
  | 'draft'
  | 'payment_pending'
  | 'paid'
  | 'submitted'
  | 'under_review'
  | 'documents_required'
  | 'in_processing'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export interface ApplicationTimeline {
  id: string;
  status: ApplicationStatus;
  title: string;
  description: string;
  timestamp: number;
  actor: string; // admin name or 'system' or 'user'
}

export interface ApplicationDocument {
  id: string;
  fieldName: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: number;
}

export interface ServiceApplication {
  id: string; // ND-APP-2026-XXXXXX
  userId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  serviceId: string;
  serviceName: string;
  serviceSlug: string;
  categoryName: string;
  feePaid: number;
  paymentId?: string;
  paymentStatus: 'pending' | 'success' | 'failed' | 'refunded';
  status: ApplicationStatus;
  formData: Record<string, any>;
  documents: ApplicationDocument[];
  timeline: ApplicationTimeline[];
  adminNotes?: string;
  assignedTo?: string;
  createdAt: number;
  updatedAt: number;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: string; // ND-APT-2026-XXXXXX
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  serviceName: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM - 10:30 AM"
  status: AppointmentStatus;
  notes?: string;
  adminNotes?: string;
  feePaid: number;
  paymentStatus: 'pending' | 'success' | 'exempt';
  paymentId?: string;
  createdAt: number;
  updatedAt: number;
}

export type PVCOrderStatus = 
  | 'pending'
  | 'payment_pending'
  | 'paid'
  | 'processing'
  | 'printing'
  | 'ready'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface PVCCardOrder {
  id: string; // ND-PVC-2026-XXXXXX
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  cardType: 'Aadhaar Card' | 'PAN Card' | 'Voter ID' | 'Driving Licence' | 'Ayushman Card' | 'Custom ID';
  cardIdentifier?: string;
  quantity: number;
  totalPrice: number;
  deliveryAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  frontDocUrl?: string;
  backDocUrl?: string;
  status: PVCOrderStatus;
  trackingNumber?: string;
  courierName?: string;
  paymentStatus: 'pending' | 'success' | 'failed';
  paymentId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ShopProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
  createdAt: number;
}

export interface ShopOrder {
  id: string; // ND-ORD-2026-XXXXXX
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  }[];
  totalAmount: number;
  deliveryAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  paymentStatus: 'pending' | 'success' | 'failed';
  paymentId?: string;
  createdAt: number;
  updatedAt: number;
}

export type TransactionType = 'credit' | 'debit' | 'refund' | 'adjustment';

export interface WalletTransaction {
  id: string; // ND-TXN-XXXXXX
  userId: string;
  amount: number;
  type: TransactionType;
  source: 'razorpay' | 'upi' | 'service_payment' | 'pvc_payment' | 'admin_adjustment' | 'refund';
  referenceId?: string; // Application ID, Order ID, or Razorpay Payment ID
  description: string;
  balanceAfter: number;
  createdAt: number;
  createdBy: string;
}

export interface PaymentRecord {
  id: string; // ND-PAY-XXXXXX
  userId: string;
  userEmail: string;
  userName?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  purpose: 'wallet_topup' | 'service_fee' | 'pvc_order' | 'shop_order' | 'appointment_fee';
  referenceId: string;
  status: 'created' | 'success' | 'failed' | 'refunded';
  createdAt: number;
  updatedAt: number;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  slug: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  requiredDocuments: string[];
  state: string;
  department: string;
  officialWebsite: string;
  applicationUrl: string;
  imageUrl?: string;
  lastVerifiedDate: string;
  isFeatured: boolean;
  status: 'draft' | 'published' | 'archived';
  createdAt: number;
  updatedAt: number;
}

export interface ImportantLink {
  id: string;
  name: string;
  description?: string;
  url: string;
  category: 'Government' | 'Banking' | 'State' | 'National' | 'Education' | 'Certificate' | 'Other';
  iconName?: string;
  openInNewTab: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt: number;
}

export interface GovernmentJob {
  id: string;
  title: string;
  slug: string;
  department: string;
  state: string; // "Central Govt" or state name
  totalVacancies: number | string;
  qualification: string;
  salaryScale?: string;
  ageLimit?: string;
  lastDate: string;
  notificationUrl?: string;
  applyUrl: string;
  isVerified: boolean;
  status: 'active' | 'expired' | 'upcoming';
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
}

export interface NoticeTicker {
  id: string;
  text: string;
  link?: string;
  priority: number;
  isActive: boolean;
  createdAt: number;
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: number;
}

export interface FounderData {
  name: string;
  designation: string;
  imageUrl: string;
  quote: string;
  description: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  isVisible: boolean;
  updatedAt: number;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  imageUrl?: string;
  category: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  views: number;
  publishedAt: number;
  createdAt: number;
  updatedAt: number;
}

export interface SupportMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'admin';
  message: string;
  attachmentUrl?: string;
  timestamp: number;
}

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface SupportTicket {
  id: string; // ND-TKT-XXXXXX
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  subject: string;
  category: string;
  status: TicketStatus;
  priority: 'low' | 'medium' | 'high';
  messages: SupportMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  module: string;
  recordId: string;
  details: string;
  timestamp: number;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  address: string;
  workingHours: string;
  enableShop: boolean;
  enableAppointments: boolean;
  enablePVC: boolean;
  enableWallet: boolean;
  minWalletRecharge: number;
  maxWalletRecharge: number;
  pvcCardPrice?: number;
  pvcCardOriginalPrice?: number;
  pvcDeliveryFee?: number;
  infoCardHeading: string;
  infoCardDescription: string;
  infoCardBullets: string[];
  aboutUsContent?: string;
  privacyPolicyContent?: string;
  termsConditionsContent?: string;
  refundPolicyContent?: string;
  helpSupportContent?: string;
  disclaimerLegalContent?: string;
  developerInfoLocked?: boolean;
  updatedAt: number;
}
