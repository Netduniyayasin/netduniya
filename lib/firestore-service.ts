import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  runTransaction,
  serverTimestamp,
  type Unsubscribe,
  type DocumentData
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import { 
  UserProfile, 
  Service, 
  Category, 
  ServiceApplication, 
  Appointment, 
  PVCCardOrder, 
  ShopProduct, 
  ShopOrder, 
  WalletTransaction, 
  PaymentRecord, 
  GovernmentScheme, 
  GovernmentJob,
  ImportantLink, 
  NoticeTicker, 
  BannerItem, 
  FounderData, 
  BlogArticle, 
  SupportTicket, 
  AuditLog, 
  SiteSettings,
  AdminRecord 
} from "./types";
import { generateUniqueId } from "./utils";
import { REAL_GOVERNMENT_SCHEMES_100 } from "./data/government-schemes";

// --- SITE SETTINGS ---
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "NetDuniya",
  tagline: "Your Trusted Digital & E-Governance Services Portal",
  contactEmail: "netduniya@gmail.com",
  contactPhone: "+91 6001716993",
  whatsappNumber: "919864761058",
  whatsappDefaultMessage: "Hello NetDuniya, I need assistance with an online service.",
  address: "Khangra Bazar",
  workingHours: "Mon - Sat: 9:00 AM - 8:00 PM",
  enableShop: true,
  enableAppointments: true,
  enablePVC: true,
  enableWallet: true,
  pvcCardPrice: 50,
  pvcCardOriginalPrice: 99,
  pvcDeliveryFee: 40,
  minWalletRecharge: 10,
  maxWalletRecharge: 50000,
  infoCardHeading: "NetDuniya Digital Center - Government, Banking & Citizen Services",
  infoCardDescription: "Online assistance for Aadhaar, PAN Card, Certificates, Ration Card, State & Central Govt Schemes, Job Applications, Driving Licence, PVC Card Printing & Fast Track E-Governance.",
  infoCardBullets: [
    "100% Secure & Fast Online Application Processing",
    "Real-time Application & PVC Card Status Tracking",
    "Assisted Form Filling & Verification by Certified Experts",
    "Direct WhatsApp & Dedicated Ticket Support"
  ],
  aboutUsContent: "NetDuniya is India's leading digital citizen services and e-governance assistance platform. Established with the mission to bridge the digital divide, NetDuniya empowers citizens and rural entrepreneurs across India with verified assistance for PAN cards, certificates, government welfare schemes, identity card printing, and e-district portal services.",
  privacyPolicyContent: "NetDuniya respects citizen privacy and is strictly committed to protecting personal information provided for online services. We collect only required details (name, contact, application metadata) to process citizen applications. Data is protected with 256-bit encryption and is never shared with unauthorized third parties.",
  termsConditionsContent: "By accessing NetDuniya, citizens and partners agree to standard terms of service. NetDuniya operates as an authorized facilitation center and assistance provider for citizen services, digital e-governance, and smart PVC card printing. Applications are processed with official government portals.",
  refundPolicyContent: "NetDuniya follows a transparent citizen-friendly refund policy. If an application or order cannot be processed due to a technical error before submission to the government portal, 100% refund is credited back to the customer's wallet or original payment method within 3-5 business days.",
  helpSupportContent: "NetDuniya Customer Care & Grievance Support Desk is available Monday through Saturday (9:00 AM - 8:00 PM). Citizens can reach out via WhatsApp at +91 98647 61058, Email at netduniya@gmail.com, or through our online Support Ticket system for real-time resolution.",
  disclaimerLegalContent: "NetDuniya is a private digital services facilitation and customer assistance portal. We assist citizens in submitting forms, verifying documents, and printing cards. Official government fees and departmental guidelines apply as per respective state and central authorities.",
  developerInfoLocked: true,
  updatedAt: Date.now(),
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const docRef = doc(db, "settings", "general");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as SiteSettings;
    }
    // Initialize default if missing
    await setDoc(docRef, DEFAULT_SITE_SETTINGS);
    return DEFAULT_SITE_SETTINGS;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return DEFAULT_SITE_SETTINGS;
  }
}

export function subscribeToSiteSettings(callback: (settings: SiteSettings) => void): Unsubscribe {
  const docRef = doc(db, "settings", "general");
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as SiteSettings);
    } else {
      callback(DEFAULT_SITE_SETTINGS);
    }
  }, (err) => {
    console.error("Site settings subscription error:", err);
    callback(DEFAULT_SITE_SETTINGS);
  });
}

export async function updateSiteSettings(settings: Partial<SiteSettings>, actorId: string, actorName: string): Promise<void> {
  const docRef = doc(db, "settings", "general");
  await setDoc(docRef, { ...settings, updatedAt: Date.now() }, { merge: true });
  await recordAuditLog({
    actorId,
    actorName,
    actorRole: 'admin',
    action: 'update_settings',
    module: 'settings',
    recordId: 'general',
    details: 'Updated global site settings',
  });
}

// --- AUDIT LOGS ---
export async function recordAuditLog(log: Omit<AuditLog, "id" | "timestamp">): Promise<void> {
  try {
    const logId = `AUD-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const docRef = doc(db, "auditLogs", logId);
    await setDoc(docRef, {
      ...log,
      id: logId,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.warn("Failed to record audit log:", error);
  }
}

export function subscribeToAuditLogs(callback: (logs: AuditLog[]) => void, limitCount = 50): Unsubscribe {
  const q = query(collection(db, "auditLogs"), orderBy("timestamp", "desc"), limit(limitCount));
  return onSnapshot(q, (snapshot) => {
    const logs = snapshot.docs.map(d => d.data() as AuditLog);
    callback(logs);
  }, (err) => {
    console.error("Error in audit logs subscription:", err);
    callback([]);
  });
}

// --- USER PROFILE & WALLET ---
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, "users", uid);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as UserProfile) : null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export function subscribeToUserProfile(uid: string, callback: (user: UserProfile | null) => void): Unsubscribe {
  const docRef = doc(db, "users", uid);
  return onSnapshot(docRef, (snap) => {
    callback(snap.exists() ? (snap.data() as UserProfile) : null);
  }, (err) => {
    console.error("Error subscribing to user profile:", err);
    callback(null);
  });
}

export async function createOrUpdateUser(profile: Partial<UserProfile> & { uid: string }): Promise<void> {
  const docRef = doc(db, "users", profile.uid);
  const snap = await getDoc(docRef);
  const now = Date.now();
  if (!snap.exists()) {
    const newProfile: UserProfile = {
      fullName: "NetDuniya User",
      email: "",
      phoneNumber: "",
      role: "user",
      walletBalance: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      ...profile,
      uid: profile.uid,
    };
    await setDoc(docRef, newProfile);
  } else {
    await updateDoc(docRef, {
      ...profile,
      updatedAt: now,
    });
  }
}

export async function deleteUserProfile(userId: string, actorName = 'admin'): Promise<void> {
  const docRef = doc(db, "users", userId);
  const snap = await getDoc(docRef);
  const userData = snap.exists() ? (snap.data() as UserProfile) : null;
  await deleteDoc(docRef);
  await recordAuditLog({
    actorId: actorName,
    actorName,
    actorRole: 'admin',
    action: 'delete_user',
    module: 'users',
    recordId: userId,
    details: `Permanently deleted user: ${userData?.email || userId} (${userData?.fullName || 'User'})`,
  });
}

export async function toggleUserBlockStatus(userId: string, isActive: boolean, actorName = 'admin'): Promise<void> {
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, {
    isActive,
    updatedAt: Date.now(),
  });
  await recordAuditLog({
    actorId: actorName,
    actorName,
    actorRole: 'admin',
    action: isActive ? 'unblock_user' : 'block_user',
    module: 'users',
    recordId: userId,
    details: `${isActive ? 'Unblocked' : 'Blocked / Suspended'} user ${userId}`,
  });
}

// Wallet Transaction with Firestore Atomic Transaction
export async function executeWalletTransaction(
  userId: string, 
  amount: number, 
  type: 'credit' | 'debit' | 'refund' | 'adjustment', 
  source: WalletTransaction['source'], 
  description: string, 
  referenceId?: string,
  createdBy = 'system'
): Promise<{ success: boolean; newBalance?: number; error?: string }> {
  try {
    const userRef = doc(db, "users", userId);
    const txnId = generateUniqueId('TXN');
    const txnRef = doc(db, "users", userId, "walletTransactions", txnId);

    const result = await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw new Error("User account not found");
      }
      const userData = userDoc.data() as UserProfile;
      const currentBalance = userData.walletBalance || 0;

      let newBalance = currentBalance;
      if (type === 'credit' || type === 'refund') {
        newBalance = currentBalance + amount;
      } else if (type === 'debit') {
        if (currentBalance < amount) {
          throw new Error("Insufficient wallet balance");
        }
        newBalance = currentBalance - amount;
      } else if (type === 'adjustment') {
        newBalance = currentBalance + amount; // amount can be positive or negative
        if (newBalance < 0) {
          throw new Error("Adjustment results in negative balance");
        }
      }

      const txnData: WalletTransaction = {
        id: txnId,
        userId,
        amount: Math.abs(amount),
        type,
        source,
        referenceId: referenceId || "",
        description,
        balanceAfter: newBalance,
        createdAt: Date.now(),
        createdBy,
      };

      transaction.update(userRef, { 
        walletBalance: newBalance,
        updatedAt: Date.now() 
      });
      transaction.set(txnRef, txnData);

      return { success: true, newBalance };
    });

    return result;
  } catch (error: any) {
    console.error("Wallet transaction failed:", error);
    return { success: false, error: error.message || "Failed to process wallet transaction" };
  }
}

export function subscribeToUserWalletTransactions(userId: string, callback: (txns: WalletTransaction[]) => void): Unsubscribe {
  const q = query(
    collection(db, "users", userId, "walletTransactions"), 
    orderBy("createdAt", "desc"), 
    limit(50)
  );
  return onSnapshot(q, (snap) => {
    const txns = snap.docs.map(d => d.data() as WalletTransaction);
    callback(txns);
  }, (err) => {
    console.error("Error subscribing to wallet transactions:", err);
    callback([]);
  });
}

// --- SERVICES & CATEGORIES ---
export function subscribeToCategories(callback: (categories: Category[]) => void): Unsubscribe {
  const q = query(collection(db, "categories"), orderBy("sortOrder", "asc"));
  return onSnapshot(q, (snap) => {
    const cats = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Category);
    callback(cats);
  }, (err) => {
    console.error("Error subscribing to categories:", err);
    callback([]);
  });
}

export async function saveCategory(category: Category): Promise<void> {
  const docRef = doc(db, "categories", category.id);
  await setDoc(docRef, category, { merge: true });
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, "categories", id));
}

export function subscribeToServices(callback: (services: Service[]) => void, publishedOnly = false): Unsubscribe {
  let q;
  if (publishedOnly) {
    q = query(
      collection(db, "services"), 
      where("status", "==", "published"), 
      orderBy("sortOrder", "asc")
    );
  } else {
    q = query(collection(db, "services"), orderBy("sortOrder", "asc"));
  }
  
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Service);
    callback(items);
  }, (err) => {
    console.error("Error subscribing to services:", err);
    callback([]);
  });
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const q = query(collection(db, "services"), where("slug", "==", slug), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docData = snap.docs[0];
      return { id: docData.id, ...docData.data() } as Service;
    }
    return null;
  } catch (error) {
    console.error("Error fetching service by slug:", error);
    return null;
  }
}

export async function saveService(service: Service): Promise<void> {
  const docRef = doc(db, "services", service.id);
  await setDoc(docRef, { ...service, updatedAt: Date.now() }, { merge: true });
}

export async function deleteService(id: string): Promise<void> {
  await deleteDoc(doc(db, "services", id));
}

// --- APPLICATIONS ---
export async function createServiceApplication(appData: Omit<ServiceApplication, "id" | "createdAt" | "updatedAt" | "timeline">): Promise<ServiceApplication> {
  const id = generateUniqueId('APP');
  const now = Date.now();
  const initialTimeline = [
    {
      id: `TL-${now}-1`,
      status: appData.status,
      title: 'Application Submitted',
      description: 'Your application has been received and is waiting for document verification.',
      timestamp: now,
      actor: appData.userName || 'user',
    }
  ];

  const fullApp: ServiceApplication = {
    ...appData,
    id,
    timeline: initialTimeline,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = doc(db, "applications", id);
  await setDoc(docRef, fullApp);
  return fullApp;
}

export function subscribeToUserApplications(userId: string, callback: (apps: ServiceApplication[]) => void): Unsubscribe {
  const q = query(
    collection(db, "applications"), 
    where("userId", "==", userId), 
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }) as ServiceApplication);
    callback(items);
  }, (err) => {
    console.error("Error subscribing to user applications:", err);
    callback([]);
  });
}

export function subscribeToAllApplications(callback: (apps: ServiceApplication[]) => void): Unsubscribe {
  const q = query(collection(db, "applications"), orderBy("createdAt", "desc"), limit(100));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }) as ServiceApplication);
    callback(items);
  }, (err) => {
    console.error("Error subscribing to all applications:", err);
    callback([]);
  });
}

export async function getApplicationById(id: string): Promise<ServiceApplication | null> {
  try {
    const docRef = doc(db, "applications", id);
    const snap = await getDoc(docRef);
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as ServiceApplication) : null;
  } catch (error) {
    console.error("Error fetching application:", error);
    return null;
  }
}

export async function updateApplicationStatus(
  id: string, 
  status: ServiceApplication['status'], 
  timelineTitle: string, 
  timelineDesc: string, 
  actorName: string,
  adminNotes?: string
): Promise<void> {
  const docRef = doc(db, "applications", id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) throw new Error("Application not found");

  const appData = snap.data() as ServiceApplication;
  const now = Date.now();
  const newTimelineItem = {
    id: `TL-${now}-${Math.random().toString(36).substring(2, 6)}`,
    status,
    title: timelineTitle,
    description: timelineDesc,
    timestamp: now,
    actor: actorName,
  };

  const updatedTimeline = [...(appData.timeline || []), newTimelineItem];
  const updatePayload: any = {
    status,
    timeline: updatedTimeline,
    updatedAt: now,
  };
  if (adminNotes !== undefined) {
    updatePayload.adminNotes = adminNotes;
  }

  await updateDoc(docRef, updatePayload);
  await recordAuditLog({
    actorId: actorName,
    actorName,
    actorRole: 'admin',
    action: 'update_application_status',
    module: 'applications',
    recordId: id,
    details: `Changed status to ${status}: ${timelineTitle}`,
  });
}

// --- APPOINTMENTS ---
export async function createAppointment(apt: Omit<Appointment, "id" | "createdAt" | "updatedAt">): Promise<Appointment> {
  const id = generateUniqueId('APT');
  const now = Date.now();
  const fullApt: Appointment = {
    ...apt,
    id,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(doc(db, "appointments", id), fullApt);
  return fullApt;
}

export function subscribeToUserAppointments(userId: string, callback: (apts: Appointment[]) => void): Unsubscribe {
  const q = query(
    collection(db, "appointments"), 
    where("userId", "==", userId), 
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Appointment));
  }, (err) => {
    console.error("Error subscribing to user appointments:", err);
    callback([]);
  });
}

export function subscribeToAllAppointments(callback: (apts: Appointment[]) => void): Unsubscribe {
  const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"), limit(100));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Appointment));
  }, (err) => {
    console.error("Error subscribing to all appointments:", err);
    callback([]);
  });
}

export async function updateAppointmentStatus(id: string, status: Appointment['status'], adminNotes?: string): Promise<void> {
  const docRef = doc(db, "appointments", id);
  const payload: any = { status, updatedAt: Date.now() };
  if (adminNotes !== undefined) payload.adminNotes = adminNotes;
  await updateDoc(docRef, payload);
}

// --- PVC CARD ORDERS ---
export async function createPVCOrder(order: Omit<PVCCardOrder, "id" | "createdAt" | "updatedAt">): Promise<PVCCardOrder> {
  const id = generateUniqueId('PVC');
  const now = Date.now();
  const fullOrder: PVCCardOrder = {
    ...order,
    id,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(doc(db, "pvcOrders", id), fullOrder);
  return fullOrder;
}

export function subscribeToUserPVCOrders(userId: string, callback: (orders: PVCCardOrder[]) => void): Unsubscribe {
  const q = query(collection(db, "pvcOrders"), where("userId", "==", userId), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as PVCCardOrder));
  }, (err) => {
    console.error("Error subscribing to user PVC orders:", err);
    callback([]);
  });
}

export function subscribeToAllPVCOrders(callback: (orders: PVCCardOrder[]) => void): Unsubscribe {
  const q = query(collection(db, "pvcOrders"), orderBy("createdAt", "desc"), limit(100));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as PVCCardOrder));
  }, (err) => {
    console.error("Error subscribing to all PVC orders:", err);
    callback([]);
  });
}

export async function updatePVCOrderStatus(id: string, status: PVCCardOrder['status'], trackingNumber?: string, courierName?: string): Promise<void> {
  const docRef = doc(db, "pvcOrders", id);
  const payload: any = { status, updatedAt: Date.now() };
  if (trackingNumber) payload.trackingNumber = trackingNumber;
  if (courierName) payload.courierName = courierName;
  await updateDoc(docRef, payload);
}

// --- SHOP PRODUCTS & ORDERS ---
export function subscribeToShopProducts(callback: (products: ShopProduct[]) => void, activeOnly = true): Unsubscribe {
  let q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  if (activeOnly) {
    q = query(collection(db, "products"), where("isActive", "==", true), orderBy("createdAt", "desc"));
  }
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as ShopProduct));
  }, (err) => {
    console.error("Error subscribing to shop products:", err);
    callback([]);
  });
}

export async function saveShopProduct(product: ShopProduct): Promise<void> {
  await setDoc(doc(db, "products", product.id), product, { merge: true });
}

export async function deleteShopProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, "products", id));
}

export async function createShopOrder(order: Omit<ShopOrder, "id" | "createdAt" | "updatedAt">): Promise<ShopOrder> {
  const id = generateUniqueId('ORD');
  const now = Date.now();
  const fullOrder: ShopOrder = {
    ...order,
    id,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(doc(db, "orders", id), fullOrder);
  return fullOrder;
}

export function subscribeToUserShopOrders(userId: string, callback: (orders: ShopOrder[]) => void): Unsubscribe {
  const q = query(collection(db, "orders"), where("userId", "==", userId), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as ShopOrder));
  }, (err) => {
    console.error("Error subscribing to user shop orders:", err);
    callback([]);
  });
}

export function subscribeToAllShopOrders(callback: (orders: ShopOrder[]) => void): Unsubscribe {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(100));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as ShopOrder));
  }, (err) => {
    console.error("Error subscribing to all shop orders:", err);
    callback([]);
  });
}

export async function updateShopOrderStatus(id: string, status: ShopOrder['status'], trackingNumber?: string): Promise<void> {
  const docRef = doc(db, "orders", id);
  const payload: any = { status, updatedAt: Date.now() };
  if (trackingNumber) payload.trackingNumber = trackingNumber;
  await updateDoc(docRef, payload);
}

// --- GOVERNMENT SCHEMES ---
export function subscribeToSchemes(callback: (schemes: GovernmentScheme[]) => void, publishedOnly = true): Unsubscribe {
  let q;
  if (publishedOnly) {
    q = query(collection(db, "schemes"), where("status", "==", "published"), orderBy("createdAt", "desc"));
  } else {
    q = query(collection(db, "schemes"), orderBy("createdAt", "desc"));
  }
  return onSnapshot(q, (snap) => {
    if (snap.empty) {
      callback(REAL_GOVERNMENT_SCHEMES_100);
    } else {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as GovernmentScheme));
    }
  }, (err) => {
    console.error("Error subscribing to schemes, using 100+ schemes fallback:", err);
    callback(REAL_GOVERNMENT_SCHEMES_100);
  });
}

export async function getSchemeBySlug(slug: string): Promise<GovernmentScheme | null> {
  try {
    const q = query(collection(db, "schemes"), where("slug", "==", slug), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return { id: snap.docs[0].id, ...snap.docs[0].data() } as GovernmentScheme;
    }
    const local = REAL_GOVERNMENT_SCHEMES_100.find(s => s.slug === slug);
    return local || null;
  } catch (error) {
    console.error("Error fetching scheme by slug:", error);
    const local = REAL_GOVERNMENT_SCHEMES_100.find(s => s.slug === slug);
    return local || null;
  }
}

export async function saveScheme(scheme: GovernmentScheme): Promise<void> {
  await setDoc(doc(db, "schemes", scheme.id), { ...scheme, updatedAt: Date.now() }, { merge: true });
}

export async function deleteScheme(id: string): Promise<void> {
  await deleteDoc(doc(db, "schemes", id));
}

// --- 100% VERIFIED GOVERNMENT JOBS ---
export const DEFAULT_GOVERNMENT_JOBS: GovernmentJob[] = [
  {
    id: "job-ssc-cgl-2026",
    title: "SSC Combined Graduate Level (CGL) Recruitment 2026",
    slug: "ssc-cgl-recruitment-2026",
    department: "Staff Selection Commission (Govt of India)",
    state: "Central Govt",
    totalVacancies: "14,582 Posts",
    qualification: "Bachelor Degree in Any Stream",
    salaryScale: "Level 4 to Level 8 (₹25,500 - ₹1,51,100)",
    ageLimit: "18 to 32 Years",
    lastDate: "30 Sep 2026",
    notificationUrl: "https://ssc.gov.in",
    applyUrl: "https://ssc.gov.in",
    isVerified: true,
    status: "active",
    sortOrder: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "job-rrb-ntpc-2026",
    title: "Railway RRB Non-Technical Popular Categories (NTPC)",
    slug: "railway-rrb-ntpc-recruitment-2026",
    department: "Railway Recruitment Control Board (Indian Railways)",
    state: "Central Govt",
    totalVacancies: "11,558 Posts",
    qualification: "12th Pass / Graduate Degree",
    salaryScale: "Level 2 to Level 6 (₹19,900 - ₹92,300)",
    ageLimit: "18 to 33 Years",
    lastDate: "15 Oct 2026",
    notificationUrl: "https://indianrailways.gov.in",
    applyUrl: "https://rrbapply.gov.in",
    isVerified: true,
    status: "active",
    sortOrder: 2,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "job-ibps-po-2026",
    title: "IBPS Probationary Officers (PO/MT) CRP XIV",
    slug: "ibps-po-recruitment-2026",
    department: "Institute of Banking Personnel Selection",
    state: "Central Govt",
    totalVacancies: "4,455 Posts",
    qualification: "Any Graduation Degree from Recognized University",
    salaryScale: "₹52,000 - ₹58,000 Monthly CTC",
    ageLimit: "20 to 30 Years",
    lastDate: "25 Sep 2026",
    notificationUrl: "https://ibps.in",
    applyUrl: "https://ibps.in",
    isVerified: true,
    status: "active",
    sortOrder: 3,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "job-state-police-si-2026",
    title: "State Police Sub-Inspector (SI) & Armed Police",
    slug: "state-police-sub-inspector-2026",
    department: "State Police Recruitment & Promotion Board",
    state: "State Govt",
    totalVacancies: "3,890 Posts",
    qualification: "Graduate Degree + Physical Standards",
    salaryScale: "Level 6 (₹35,400 - ₹1,12,400)",
    ageLimit: "21 to 28 Years",
    lastDate: "05 Oct 2026",
    notificationUrl: "https://edistrict.gov.in",
    applyUrl: "https://police.gov.in",
    isVerified: true,
    status: "active",
    sortOrder: 4,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
];

export function subscribeToJobs(callback: (jobs: GovernmentJob[]) => void, activeOnly = true): Unsubscribe {
  let q;
  if (activeOnly) {
    q = query(collection(db, "jobs"), where("status", "==", "active"), orderBy("createdAt", "desc"));
  } else {
    q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
  }
  return onSnapshot(q, (snap) => {
    if (snap.empty) {
      callback(DEFAULT_GOVERNMENT_JOBS);
    } else {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as GovernmentJob));
    }
  }, (err) => {
    console.error("Error subscribing to jobs, using fallback:", err);
    callback(DEFAULT_GOVERNMENT_JOBS);
  });
}

export async function saveJob(job: GovernmentJob): Promise<void> {
  await setDoc(doc(db, "jobs", job.id), { ...job, updatedAt: Date.now() }, { merge: true });
}

export async function deleteJob(id: string): Promise<void> {
  await deleteDoc(doc(db, "jobs", id));
}

// --- IMPORTANT LINKS ---
export function subscribeToImportantLinks(callback: (links: ImportantLink[]) => void, activeOnly = true): Unsubscribe {
  let q = query(collection(db, "importantLinks"), orderBy("sortOrder", "asc"));
  if (activeOnly) {
    q = query(collection(db, "importantLinks"), where("isActive", "==", true), orderBy("sortOrder", "asc"));
  }
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as ImportantLink));
  }, (err) => {
    console.error("Error subscribing to important links:", err);
    callback([]);
  });
}

export async function saveImportantLink(link: ImportantLink): Promise<void> {
  await setDoc(doc(db, "importantLinks", link.id), link, { merge: true });
}

export async function deleteImportantLink(id: string): Promise<void> {
  await deleteDoc(doc(db, "importantLinks", id));
}

// --- NOTICES & TICKERS ---
export function subscribeToNotices(callback: (notices: NoticeTicker[]) => void, activeOnly = true): Unsubscribe {
  let q = query(collection(db, "notices"), orderBy("priority", "desc"));
  if (activeOnly) {
    q = query(collection(db, "notices"), where("isActive", "==", true), orderBy("priority", "desc"));
  }
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as NoticeTicker));
  }, (err) => {
    console.error("Error subscribing to notices:", err);
    callback([]);
  });
}

export async function saveNotice(notice: NoticeTicker): Promise<void> {
  await setDoc(doc(db, "notices", notice.id), notice, { merge: true });
}

export async function deleteNotice(id: string): Promise<void> {
  await deleteDoc(doc(db, "notices", id));
}

// --- BANNERS ---
export function subscribeToBanners(callback: (banners: BannerItem[]) => void, activeOnly = true): Unsubscribe {
  let q = query(collection(db, "banners"), orderBy("sortOrder", "asc"));
  if (activeOnly) {
    q = query(collection(db, "banners"), where("isActive", "==", true), orderBy("sortOrder", "asc"));
  }
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as BannerItem));
  }, (err) => {
    console.error("Error subscribing to banners:", err);
    callback([]);
  });
}

export async function saveBanner(banner: BannerItem): Promise<void> {
  await setDoc(doc(db, "banners", banner.id), banner, { merge: true });
}

export async function deleteBanner(id: string): Promise<void> {
  await deleteDoc(doc(db, "banners", id));
}

// --- FOUNDER SECTION ---
export const DEFAULT_FOUNDER_DATA: FounderData = {
  name: "Yasin Khan",
  designation: "Founder & Managing Director, NetDuniya",
  imageUrl: "/images/founder.jpg",
  quote: "Empowering every Indian citizen and rural entrepreneur with seamless digital access, government certifications, and hassle-free online service assistance.",
  description: "NetDuniya was established with the core vision of bridging the digital divide across India. From urgent certificates and banking assistance to government schemes and identity card verification, our platform ensures speed, transparency, and verified assistance.",
  socialLinks: {
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    facebook: "https://facebook.com",
  },
  isVisible: true,
  updatedAt: Date.now(),
};

export async function getFounderData(): Promise<FounderData> {
  try {
    const docRef = doc(db, "content", "founder");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as FounderData;
    }
    await setDoc(docRef, DEFAULT_FOUNDER_DATA);
    return DEFAULT_FOUNDER_DATA;
  } catch (error) {
    console.error("Error fetching founder data:", error);
    return DEFAULT_FOUNDER_DATA;
  }
}

export function subscribeToFounderData(callback: (founder: FounderData) => void): Unsubscribe {
  const docRef = doc(db, "content", "founder");
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as FounderData);
    } else {
      callback(DEFAULT_FOUNDER_DATA);
    }
  }, (err) => {
    console.error("Error subscribing to founder:", err);
    callback(DEFAULT_FOUNDER_DATA);
  });
}

export async function saveFounderData(data: FounderData): Promise<void> {
  await setDoc(doc(db, "content", "founder"), { ...data, updatedAt: Date.now() });
}

// --- BLOG ARTICLES ---
export function subscribeToBlogs(callback: (blogs: BlogArticle[]) => void, publishedOnly = true): Unsubscribe {
  let q;
  if (publishedOnly) {
    q = query(collection(db, "blogs"), where("status", "==", "published"), orderBy("publishedAt", "desc"));
  } else {
    q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
  }
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as BlogArticle));
  }, (err) => {
    console.error("Error subscribing to blogs:", err);
    callback([]);
  });
}

export async function getBlogBySlug(slug: string): Promise<BlogArticle | null> {
  try {
    const q = query(collection(db, "blogs"), where("slug", "==", slug), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return { id: snap.docs[0].id, ...snap.docs[0].data() } as BlogArticle;
    }
    return null;
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return null;
  }
}

export async function saveBlog(blog: BlogArticle): Promise<void> {
  await setDoc(doc(db, "blogs", blog.id), { ...blog, updatedAt: Date.now() }, { merge: true });
}

export async function deleteBlog(id: string): Promise<void> {
  await deleteDoc(doc(db, "blogs", id));
}

// --- SUPPORT TICKETS ---
export async function createSupportTicket(ticketData: Omit<SupportTicket, "id" | "createdAt" | "updatedAt">): Promise<SupportTicket> {
  const id = generateUniqueId('TKT');
  const now = Date.now();
  const fullTicket: SupportTicket = {
    ...ticketData,
    id,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(doc(db, "supportTickets", id), fullTicket);
  return fullTicket;
}

export function subscribeToUserTickets(userId: string, callback: (tickets: SupportTicket[]) => void): Unsubscribe {
  const q = query(collection(db, "supportTickets"), where("userId", "==", userId), orderBy("updatedAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as SupportTicket));
  }, (err) => {
    console.error("Error subscribing to user tickets:", err);
    callback([]);
  });
}

export function subscribeToAllTickets(callback: (tickets: SupportTicket[]) => void): Unsubscribe {
  const q = query(collection(db, "supportTickets"), orderBy("updatedAt", "desc"), limit(100));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as SupportTicket));
  }, (err) => {
    console.error("Error subscribing to all tickets:", err);
    callback([]);
  });
}

export async function sendTicketReply(ticketId: string, message: Omit<SupportTicket['messages'][0], "id" | "timestamp">): Promise<void> {
  const docRef = doc(db, "supportTickets", ticketId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) throw new Error("Ticket not found");

  const ticket = snap.data() as SupportTicket;
  const now = Date.now();
  const newMessage = {
    ...message,
    id: `MSG-${now}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: now,
  };

  const updatedMessages = [...(ticket.messages || []), newMessage];
  await updateDoc(docRef, {
    messages: updatedMessages,
    status: message.senderRole === 'admin' ? 'in_progress' : 'open',
    updatedAt: now,
  });
}

export async function updateSupportTicketStatus(ticketId: string, status: SupportTicket['status']): Promise<void> {
  const docRef = doc(db, "supportTickets", ticketId);
  await updateDoc(docRef, {
    status,
    updatedAt: Date.now(),
  });
}

// --- PAYMENTS & REFUNDS ---
export async function createPaymentRecord(payment: Omit<PaymentRecord, "id" | "createdAt" | "updatedAt">): Promise<PaymentRecord> {
  const id = generateUniqueId('PAY');
  const now = Date.now();
  const fullPayment: PaymentRecord = {
    ...payment,
    id,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(doc(db, "payments", id), fullPayment);
  return fullPayment;
}

export function subscribeToAllPayments(callback: (payments: PaymentRecord[]) => void): Unsubscribe {
  const q = query(collection(db, "payments"), orderBy("createdAt", "desc"), limit(100));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as PaymentRecord));
  }, (err) => {
    console.error("Error subscribing to payments:", err);
    callback([]);
  });
}

export function subscribeToUserPayments(userId: string, callback: (payments: PaymentRecord[]) => void): Unsubscribe {
  const q = query(collection(db, "payments"), where("userId", "==", userId), orderBy("createdAt", "desc"), limit(50));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as PaymentRecord));
  }, (err) => {
    console.error("Error subscribing to user payments:", err);
    callback([]);
  });
}

// --- FILE UPLOAD TO FIREBASE STORAGE ---
export async function uploadDocument(
  file: File, 
  pathPrefix: string,
  onProgress?: (progress: number) => void
): Promise<{ url: string; fileName: string; fileSize: number; mimeType: string }> {
  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${pathPrefix}/${Date.now()}_${cleanFileName}`;
    const storageRef = ref(storage, storagePath);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return {
      url: downloadUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type || 'application/octet-stream',
    };
  } catch (error: any) {
    console.error("Storage upload failed:", error);
    throw new Error(error.message || "Failed to upload file to storage");
  }
}

// --- ADMIN SEEDING / INITIAL SETUP UTILITY ---
export async function seedInitialCategoriesAndServices(): Promise<void> {
  const categories: Category[] = [
    { id: "cat-identity", name: "Aadhaar & Identity", slug: "aadhaar-identity", sortOrder: 1, isActive: true, createdAt: Date.now() },
    { id: "cat-tax-pan", name: "PAN & Tax Services", slug: "pan-tax", sortOrder: 2, isActive: true, createdAt: Date.now() },
    { id: "cat-certificates", name: "Certificates & E-District", slug: "certificates-edistrict", sortOrder: 3, isActive: true, createdAt: Date.now() },
    { id: "cat-govt-schemes", name: "Govt Scheme Applications", slug: "govt-schemes", sortOrder: 4, isActive: true, createdAt: Date.now() },
    { id: "cat-transport", name: "Driving & Transport", slug: "driving-transport", sortOrder: 5, isActive: true, createdAt: Date.now() },
    { id: "cat-passport", name: "Passport & Travel", slug: "passport-travel", sortOrder: 6, isActive: true, createdAt: Date.now() },
  ];

  for (const cat of categories) {
    await setDoc(doc(db, "categories", cat.id), cat, { merge: true });
  }

  const sampleServices: Service[] = [
    {
      id: "srv-pan-new",
      name: "New Instant PAN Card Application (e-KYC)",
      slug: "new-pan-card-application",
      categoryId: "cat-tax-pan",
      categoryName: "PAN & Tax Services",
      shortDescription: "Apply for a fresh PAN Card with instant biometric/OTP or document assistance.",
      fullDescription: "Complete end-to-end online assistance for obtaining a brand new PAN card under Form 49A. We verify your Aadhaar linkage, proof of identity, address, and date of birth before submitting.",
      price: 150,
      discountPrice: 130,
      processingTime: "3 to 5 Working Days",
      requiredDocuments: ["Aadhaar Card Front & Back", "Passport Size Photograph", "Applicant Signature on White Paper"],
      formFields: [
        { id: "f1", name: "fullName", label: "Full Name (as per Aadhaar)", type: "text", required: true, placeholder: "e.g. Rahul Sharma", sortOrder: 1 },
        { id: "f2", name: "fatherName", label: "Father's Full Name", type: "text", required: true, placeholder: "e.g. Ramesh Sharma", sortOrder: 2 },
        { id: "f3", name: "dob", label: "Date of Birth", type: "date", required: true, sortOrder: 3 },
        { id: "f4", name: "gender", label: "Gender", type: "select", required: true, options: ["Male", "Female", "Other"], sortOrder: 4 },
        { id: "f5", name: "aadhaarNumber", label: "12 Digit Aadhaar Number", type: "text", required: true, placeholder: "XXXX-XXXX-XXXX", sortOrder: 5 },
        { id: "f6", name: "mobileNumber", label: "Mobile Number (linked to Aadhaar)", type: "tel", required: true, placeholder: "10-digit mobile", sortOrder: 6 },
        { id: "f7", name: "address", label: "Current Delivery Address", type: "textarea", required: true, placeholder: "House No, Street, Landmark, City, State, PIN", sortOrder: 7 },
        { id: "f8", name: "photoDoc", label: "Passport Size Photograph", type: "file", required: true, helpText: "Clear image in JPG or PNG format", sortOrder: 8 },
        { id: "f9", name: "signatureDoc", label: "Applicant Signature on Paper", type: "file", required: true, helpText: "Signature scan/photo", sortOrder: 9 },
        { id: "f10", name: "aadhaarDoc", label: "Aadhaar Card Copy", type: "file", required: true, helpText: "PDF or clear photo", sortOrder: 10 },
      ],
      termsAndConditions: "I hereby confirm that all submitted documents and information are accurate. NetDuniya assists in government application verification and submission.",
      status: "published",
      isFeatured: true,
      sortOrder: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: "srv-income-certificate",
      name: "Income Certificate Application",
      slug: "income-certificate-application",
      categoryId: "cat-certificates",
      categoryName: "Certificates & E-District",
      shortDescription: "State Revenue Department income certificate assistance for scholarships and schemes.",
      fullDescription: "Apply for official Tehsil/Revenue Department verified Income Certificate required for educational subsidies, scholarship forms, ration card upgrades, and government schemes.",
      price: 120,
      discountPrice: 99,
      processingTime: "7 to 10 Working Days",
      requiredDocuments: ["Aadhaar Card", "Ration Card or Voter ID", "Salary Slip or Self Income Declaration", "Passport Size Photo"],
      formFields: [
        { id: "ic1", name: "applicantName", label: "Applicant Full Name", type: "text", required: true, placeholder: "Name", sortOrder: 1 },
        { id: "ic2", name: "annualIncome", label: "Declared Annual Family Income (INR)", type: "number", required: true, placeholder: "e.g. 75000", sortOrder: 2 },
        { id: "ic3", name: "occupation", label: "Primary Occupation", type: "text", required: true, placeholder: "e.g. Agriculture / Small Business / Labor", sortOrder: 3 },
        { id: "ic4", name: "state", label: "State", type: "text", required: true, placeholder: "e.g. Uttar Pradesh, Bihar, etc.", sortOrder: 4 },
        { id: "ic5", name: "district", label: "District / Tehsil", type: "text", required: true, placeholder: "District Name", sortOrder: 5 },
        { id: "ic6", name: "rationCard", label: "Ration Card / ID Proof Document", type: "file", required: true, sortOrder: 6 },
        { id: "ic7", name: "aadhaarProof", label: "Aadhaar Proof Document", type: "file", required: true, sortOrder: 7 },
      ],
      status: "published",
      isFeatured: true,
      sortOrder: 2,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: "srv-voter-card",
      name: "New Voter ID Registration (Form 6)",
      slug: "voter-id-registration-form-6",
      categoryId: "cat-identity",
      categoryName: "Aadhaar & Identity",
      shortDescription: "Enroll as a new voter with Election Commission of India (ECI) NVSP assistance.",
      fullDescription: "Complete assistance for new voter registration for citizens turning 18 or relocating assembly constituencies with doorstep tracking.",
      price: 100,
      processingTime: "15 to 20 Working Days",
      requiredDocuments: ["Age Proof (Aadhaar/10th Marksheet)", "Address Proof (Electricity Bill/Ration Card)", "Passport Photograph"],
      formFields: [
        { id: "v1", name: "fullName", label: "Full Name", type: "text", required: true, sortOrder: 1 },
        { id: "v2", name: "dob", label: "Date of Birth", type: "date", required: true, sortOrder: 2 },
        { id: "v3", name: "stateAssembly", label: "Assembly Constituency / District", type: "text", required: true, sortOrder: 3 },
        { id: "v4", name: "photoDoc", label: "Passport Photo", type: "file", required: true, sortOrder: 4 },
        { id: "v5", name: "addressProofDoc", label: "Address Proof", type: "file", required: true, sortOrder: 5 },
      ],
      status: "published",
      isFeatured: true,
      sortOrder: 3,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: "srv-driving-licence-learning",
      name: "Learning Driving Licence (LL) Application",
      slug: "learning-driving-licence-application",
      categoryId: "cat-transport",
      categoryName: "Driving & Transport",
      shortDescription: "Sarathi Parivahan LL online slot booking, mock test assistance & form filling.",
      fullDescription: "Get your Learning Driving Licence application processed smoothly with Parivahan portal verification, document verification, and test slot assistance.",
      price: 250,
      processingTime: "2 to 4 Working Days",
      requiredDocuments: ["Aadhaar Card (Mobile Linked)", "Blood Group Report", "Medical Form 1A", "Passport Photo"],
      formFields: [
        { id: "dl1", name: "fullName", label: "Full Name", type: "text", required: true, sortOrder: 1 },
        { id: "dl2", name: "bloodGroup", label: "Blood Group", type: "select", required: true, options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], sortOrder: 2 },
        { id: "dl3", name: "vehicleClass", label: "Vehicle Class", type: "select", required: true, options: ["Motorcycle with Gear (MCWG)", "Motorcycle without Gear (MCWOG)", "Light Motor Vehicle (LMV - Car)", "Both MCWG + LMV"], sortOrder: 3 },
        { id: "dl4", name: "rtoLocation", label: "RTO Office Location", type: "text", required: true, sortOrder: 4 },
        { id: "dl5", name: "aadhaarDoc", label: "Aadhaar Card Document", type: "file", required: true, sortOrder: 5 },
      ],
      status: "published",
      isFeatured: true,
      sortOrder: 4,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  ];

  for (const srv of sampleServices) {
    await setDoc(doc(db, "services", srv.id), srv, { merge: true });
  }

  // Initial Important Links
  const initialLinks: ImportantLink[] = [
    { id: "lnk-uidai", name: "UIDAI - Aadhaar Self Service Portal", url: "https://myaadhaar.uidai.gov.in", category: "National", openInNewTab: true, sortOrder: 1, isActive: true, createdAt: Date.now() },
    { id: "lnk-nvsp", name: "Election Commission of India (NVSP/Voters)", url: "https://voters.eci.gov.in", category: "Government", openInNewTab: true, sortOrder: 2, isActive: true, createdAt: Date.now() },
    { id: "lnk-parivahan", name: "Parivahan Sarathi (Driving & Vehicle Portal)", url: "https://parivahan.gov.in", category: "Government", openInNewTab: true, sortOrder: 3, isActive: true, createdAt: Date.now() },
    { id: "lnk-incometax", name: "Income Tax e-Filing & Instant PAN", url: "https://www.incometax.gov.in", category: "Banking", openInNewTab: true, sortOrder: 4, isActive: true, createdAt: Date.now() },
    { id: "lnk-digilocker", name: "DigiLocker - National Digital Document Wallet", url: "https://www.digilocker.gov.in", category: "National", openInNewTab: true, sortOrder: 5, isActive: true, createdAt: Date.now() },
    { id: "lnk-edistrict", name: "State E-District Services Portal", url: "https://edistrict.up.gov.in", category: "Certificate", openInNewTab: true, sortOrder: 6, isActive: true, createdAt: Date.now() },
  ];

  for (const lnk of initialLinks) {
    await setDoc(doc(db, "importantLinks", lnk.id), lnk, { merge: true });
  }

  // Initial Notice Ticker
  const initialNotice: NoticeTicker = {
    id: "notice-1",
    text: "★ Welcome to NetDuniya: Real-time Aadhaar, PAN Card, Citizen Certificates, PVC Card Printing & Online Service Assistance Kendra is Live!",
    priority: 10,
    isActive: true,
    createdAt: Date.now(),
  };
  await setDoc(doc(db, "notices", initialNotice.id), initialNotice, { merge: true });
}

// =========================================================================
// ADMINS COLLECTION GOVERNANCE
// =========================================================================
export async function isFirstAdminUser(): Promise<boolean> {
  try {
    const adminQuery = query(collection(db, "admins"), limit(1));
    const snap = await getDocs(adminQuery);
    if (!snap.empty) return false;

    // Check users collection as backup
    const usersAdminQuery = query(collection(db, "users"), where("role", "in", ["super_admin", "admin"]), limit(1));
    const userSnap = await getDocs(usersAdminQuery);
    return userSnap.empty;
  } catch (err) {
    console.error("Error checking first admin:", err);
    return false;
  }
}

export async function createAdminRecord(adminData: AdminRecord): Promise<void> {
  await setDoc(doc(db, "admins", adminData.uid), adminData, { merge: true });
}

export function subscribeToAllAdmins(callback: (admins: AdminRecord[]) => void): Unsubscribe {
  const q = query(collection(db, "admins"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const admins = snap.docs.map(d => ({ ...d.data(), uid: d.id } as AdminRecord));
    callback(admins);
  }, (err) => {
    console.error("Error subscribing to admins:", err);
    callback([]);
  });
}

export async function deleteAdminRecord(uid: string): Promise<void> {
  await deleteDoc(doc(db, "admins", uid));
}

