# NetDuniya - Digital Citizen Services & E-Governance Kendra Portal

[![Next.js](https://img.shields.io/badge/Next.js-14.2.35-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.13.0-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Ready-0C2340?style=flat-square&logo=razorpay)](https://razorpay.com/)

NetDuniya is an enterprise-grade digital services portal and citizen facilitation platform. It provides real-time assisted form filling, document verification, smart PVC identity card printing, government scheme guidance, job alerts, and Kendra appointment bookings.

---

## 🌟 Key Capabilities

* **Real-time Two-way Synchronization:** Firebase Firestore listeners connect the User Panel and Admin Panel seamlessly.
* **Service Management & Dynamic Forms:** Admins can publish new services, customize form fields, required documents, and pricing on the fly.
* **Instant Wallet & Payment Gateway:** Supports Razorpay online payments (Cards, UPI, Netbanking), dynamic UPI QR with UTR verification, and atomic user wallet debits/credits.
* **Smart PVC Card Ordering:** Citizen PVC card printing workflow with tracking numbers and India Post / courier integration.
* **Public Tracking Desk (`/track`):** Citizens can track service applications, PVC card deliveries, and appointments using their unique reference ID without logging in.
* **Staff Access Control:** Multi-tier role permissions (`super_admin`, `admin`, `service_manager`, `finance_manager`, etc.) with auditable security logs.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/netduniya.git
cd netduniya

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deployment & Handover

For the complete step-by-step handover guide, Firebase rules setup, and Vercel deployment instructions, please refer to:
👉 **[CLIENT_HANDOVER.md](./CLIENT_HANDOVER.md)**

---

## 📄 License
Private and Confidential. Developed for NetDuniya Kendra.
