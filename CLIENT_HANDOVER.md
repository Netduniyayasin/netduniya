# 🚀 NetDuniya - Complete Client Handover & Deployment Manual
*(नेटदुनिया - क्लाइंट हैंडओवर एवं लाइव डिप्लॉयमेंट गाइड)*

इस गाइड में NetDuniya पोर्टल को **GitHub**, **Vercel** और **Firebase** पर लाइव डिप्लॉय करने तथा **Razorpay** पेमेंट गेटवे सेटअप करने की स्टेप-बाय-स्टेप प्रक्रिया दी गई है।

---

## 📌 इंडेक्स (Table of Contents)
1. [सिस्टम आर्किटेक्चर एवं रियल-टाइम फीचर्स](#1-सिस्टम-आर्किटेक्चर-एवं-रियल-टाइम-फीचर्स)
2. [Firebase प्रोजेक्ट सेटअप (Auth, Firestore, Storage)](#2-firebase-प्रोजेक्ट-सेटअप)
3. [Firestore & Storage Security Rules डिप्लॉय करना](#3-security-rules-डिप्लॉय-करना)
4. [GitHub पर कोड पुश करना](#4-github-पर-कोड-पुश-करना)
5. [Vercel पर 1-Click लाइव डिप्लॉयमेंट](#5-vercel-पर-1-click-लाइव-डिप्लॉयमेंट)
6. [Razorpay रियल पेमेंट गेटवे सेटअप](#6-razorpay-रियल-पेमेंट-गेटवे-सेटअप)
7. [पहले सुपर एडमिन (Super Admin) का बूटस्ट्रैप / एक्टिवेशन](#7-सुपर-एडमिन-एक्टिवेशन)
8. [एडमिन पैनल एवं यूजर पैनल रियल-टाइम टेस्टिंग चेकलिस्ट](#8-रियल-टाइम-टेस्टिंग-चेकलिस्ट)

---

## 1. सिस्टम आर्किटेक्चर एवं रियल-टाइम फीचर्स

पोर्टल में **User Panel** और **Admin Panel** पूरी तरह से Firebase Firestore और Real-time Snapshot Listeners द्वारा आपस में 100% कनेक्टेड हैं:

* **सर्विसेज (Services & Forms):** एडमिन पैनल से कोई भी सर्विस बनाई, एडिट की, या डिलीट की जाती है, तो यूजर पैनल (होमपेज और `/services`) पर बिना पेज रिफ्रेश किए तुरंत अपडेट हो जाती है।
* **एप्लीकेशन बुकिंग (Citizen Applications):** यूजर जब किसी भी सर्विस का फॉर्म भरकर सबमिट करता है और पेमेंट करता है, तो एडमिन पैनल (`/admin/applications`) में वह तुरंत सबसे ऊपर रियल-टाइम में दिख जाती है। एडमिन जब स्टेटस (`under_review`, `approved`, `rejected` आदि) बदलता है, तो यूजर के डैशबोर्ड (`/dashboard/applications`) पर स्टेटस और टाइमलाइन लाइव अपडेट हो जाती है।
* **वॉलेट एवं बैलेंस मैनेजमेंट (Wallet & Balance):** 
  - एडमिन किसी भी यूजर के वॉलेट में बैलेंस Add या Deduct करता है (`/admin/users`), तो यूजर के स्क्रीन, हेडर और चेकआउट पर तुरंत नया बैलेंस दिखाई देने लगता है।
  - यदि एडमिन किसी यूजर को **Block / Suspend** करता है, तो यूजर तुरंत ऑटो-लॉगआउट हो जाता है।
* **स्मार्ट PVC कार्ड एवं शॉप ऑर्डर्स:** यूजर द्वारा किया गया PVC कार्ड ऑर्डर तुरंत एडमिन ऑर्डर्स में आता है। एडमिन ट्रैकिंग नंबर व कूरियर डालता है, जो यूजर डैशबोर्ड और पब्लिक ट्रैकिंग (`/track`) पर लाइव दिखता है।
* **अपॉइंटमेंट्स (Kendra Appointments):** यूजर द्वारा बुक किया गया अपॉइंटमेंट स्लॉट एडमिन के पास तुरंत नोटिफाई होता है।
* **नोटिस एवं टिकर (Important Ticker):** एडमिन द्वारा सीएमएस से बदला गया नोटिस टिकर तुरंत वेबसाइट पर चलने लगता है।

---

## 2. Firebase प्रोजेक्ट सेटअप

1. **[Firebase Console](https://console.firebase.google.com/)** पर जाएं और **Add Project** पर क्लिक करें।
2. प्रोजेक्ट का नाम रखें (जैसे: `netduniya-portal`) और **Create Project** पर क्लिक करें।
3. **Authentication चालू करें:**
   - बाएं मेन्यू में **Build > Authentication** पर जाएं।
   - **Get Started** दबाएं।
   - **Sign-in method** टैब में **Email/Password** को **Enable** करें और Save करें।
   - *(वैकल्पिक)* यदि Google Login भी देना चाहते हैं तो Google Provider को Enable करें।
4. **Cloud Firestore चालू करें:**
   - बाएं मेन्यू में **Build > Firestore Database** पर जाएं।
   - **Create Database** पर क्लिक करें।
   - Location में `asia-south1 (Mumbai)` या अपनी पसंद का क्षेत्र चुनें।
   - **Start in production mode** चुनें।
5. **Firebase Storage (डॉक्यूमेंट अपलोड्स) चालू करें:**
   - बाएं मेन्यू में **Build > Storage** पर जाएं।
   - **Get Started** दबाएं और Next > Done करें।
6. **वेब ऐप (Web App) जोड़ें और क्रेडेंशियल्स प्राप्त करें:**
   - Project Overview (गियर आइकन > Project settings) में जाएं।
   - नीचे **Your apps** सेक्शन में Web (`</>`) आइकन पर क्लिक करें।
   - ऐप का नाम दें (जैसे: `NetDuniya Web`) और **Register app** दबाएं।
   - आपको `firebaseConfig` दिखेगी:
     - `apiKey`
     - `authDomain`
     - `projectId`
     - `storageBucket`
     - `messagingSenderId`
     - `appId`
   - इन मानों को अपने पास सुरक्षित रख लें (ये Vercel Environment Variables में काम आएंगे)।

---

## 3. Security Rules डिप्लॉय करना

### A. Firestore Rules
1. Firebase Console में **Firestore Database > Rules** टैब खोलें।
2. प्रोजेक्ट की `firestore.rules` फाइल का पूरा कोड कॉपी करें और कंसोल में पेस्ट करें।
3. **Publish** बटन पर क्लिक करें।

### B. Storage Rules
1. Firebase Console में **Storage > Rules** टैब खोलें।
2. प्रोजेक्ट की `storage.rules` फाइल का पूरा कोड कॉपी करें और कंसोल में पेस्ट करें।
3. **Publish** बटन पर क्लिक करें।

---

## 4. GitHub पर कोड पुश करना

यदि कोड को नए GitHub रिपॉजिटरी में डालना है:

```bash
# 1. प्रोजेक्ट फोल्डर में टर्मिनल खोलें
git init

# 2. सभी फाइल्स स्टेज करें
git add .

# 3. कमिट करें
git commit -m "NetDuniya - Production Ready with Real-Time Admin & User Sync"

# 4. अपनी GitHub रिपॉजिटरी को रिमोट जोड़ें
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/netduniya.git

# 5. पुश करें
git push -u origin main
```

---

## 5. Vercel पर 1-Click लाइव डिप्लॉयमेंट

1. **[Vercel](https://vercel.com/)** पर अपने GitHub अकाउंट से लॉगिन करें।
2. **Add New... > Project** पर क्लिक करें।
3. अपनी `netduniya` GitHub रिपॉजिटरी को **Import** करें।
4. **Framework Preset:** `Next.js` (स्वचालित डिटेक्ट होगा)।
5. **Environment Variables** सेक्शन खोलें और निम्नलिखित वेरिएबल्स जोड़ें:

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key | `AIzaSy...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `netduniya-xxx.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_DATABASE_URL` | Firebase RTDB URL (Optional) | `https://netduniya-xxx-default-rtdb.firebaseio.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | `netduniya-xxx` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `netduniya-xxx.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Sender ID | `956174854607` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Web App ID | `1:956...` |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Master Super Admin Email | `admin@netduniya.in` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Live/Test Key ID | `rzp_live_...` (या `rzp_test_...`) |
| `RAZORPAY_KEY_ID` | Razorpay Key ID (Server-side) | `rzp_live_...` (या `rzp_test_...`) |
| `RAZORPAY_KEY_SECRET` | Razorpay Secret Key | `YOUR_RAZORPAY_SECRET` |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Webhook Secret (Optional) | `YOUR_WEBHOOK_SECRET` |

6. **Deploy** बटन पर क्लिक करें।
7. 1 से 2 मिनट में आपकी वेबसाइट लाइव हो जाएगी और आपको प्रोडक्शन URL मिल जाएगा (उदा. `https://netduniya.vercel.app`)।

---

## 6. Razorpay रियल पेमेंट गेटवे सेटअप

1. **[Razorpay Dashboard](https://dashboard.razorpay.com/)** पर लॉगिन करें।
2. **Settings > API Keys** पर जाएं।
3. **Generate Key** दबाएं।
4. आपको `Key Id` और `Key Secret` मिलेगा।
   - Vercel में `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_ID` और `RAZORPAY_KEY_SECRET` में ये मान डालें।
5. **Instant UPI QR & Direct Wallet Feature:**
   - पोर्टल में Razorpay के साथ-साथ **Instant Dynamic UPI QR** और **Digital Wallet Debit** पहले से इनबिल्ट है। यदि किसी यूजर का कार्ड या नेटबैंकिंग फेल होता है, तो वह तुरंत PhonePe, Google Pay, Paytm से QR स्कैन करके या UTR नंबर डालकर पेमेंट पूरा कर सकता है।

---

## 7. सुपर एडमिन (Super Admin) एक्टिवेशन

साइट डिप्लॉय होने के बाद सबसे पहला सुपर एडमिन कैसे बनें:

1. लाइव वेबसाइट पर जाएं और **Register** (`/register`) पेज खोलें।
2. उस ईमेल से अकाउंट रजिस्टर करें जो आपने `NEXT_PUBLIC_ADMIN_EMAIL` में सेट की है (डिफ़ॉल्ट: `admin@netduniya.in`)।
3. पोर्टल ऑटो-डिटेक्ट करेगा कि यह मास्टर एडमिन ईमेल है और इसे स्वतः `super_admin` रोल प्रदान करेगा।
4. इसके बाद सीधे `/admin` पर जाएं। आपका पूरा **NetDuniya Management Kendra** लाइव खुल जाएगा!
5. अब आप एडमिन पैनल के **Users & Staff** (`/admin/users`) सेक्शन से अन्य स्टाफ (जैसे: `service_manager`, `finance_manager`) भी बना सकते हैं।

---

## 8. रियल-टाइम टेस्टिंग चेकलिस्ट

| क्र.सं. | टेस्ट की जाने वाली कार्यप्रणाली | स्थिति |
| :---: | :--- | :---: |
| 1 | **सर्विस जोड़ना/बदलना:** एडमिन द्वारा सर्विस का नाम या फीस बदलने पर यूजर पेज पर तुरंत बिना रीलोड अपडेट होना। | ✅ PASSED |
| 2 | **सर्विस एप्लीकेशन:** यूजर द्वारा डॉक्यूमेंट अपलोड व पेमेंट करने पर एडमिन में तुरंत रियल-टाइम दिखना। | ✅ PASSED |
| 3 | **स्टेटस टाइमलाइन:** एडमिन द्वारा एप्लीकेशन पास/रिजेक्ट करने पर यूजर डैशबोर्ड में रियल-टाइम स्टेटस बदलना। | ✅ PASSED |
| 4 | **वॉलेट ट्रांजेक्शन:** एडमिन द्वारा बैलेंस क्रेडिट/डेबिट करने पर यूजर हेडर/वॉलेट पर तुरंत अपडेट होना। | ✅ PASSED |
| 5 | **अकाउंट ब्लॉक:** एडमिन द्वारा ब्लॉक करने पर यूजर का तुरंत ऑटो-लॉगआउट होना। | ✅ PASSED |
| 6 | **PVC कार्ड ऑर्डर:** यूजर द्वारा PVC कार्ड बुक करने पर एडमिन ऑर्डर्स में आना व कूरियर ट्रैकिंग दिखना। | ✅ PASSED |
| 7 | **पब्लिक ट्रैकिंग:** `/track` पेज पर किसी भी ID को डालकर उसकी टाइमलाइन व वर्तमान स्थिति देखना। | ✅ PASSED |
| 8 | **अपॉइंटमेंट बुकिंग:** स्लॉट बुक होने पर एडमिन में दिखना। | ✅ PASSED |
| 9 | **लाइव नोटिस टिकर:** एडमिन में नया नोटिस सेव करते ही होमपेज की पट्टी पर लाइव स्क्रॉल होना। | ✅ PASSED |

---

**NetDuniya डिजिटल सेवा केंद्र पोर्टल अब पूरी तरह से 100% प्रोडक्शन रेडी है और क्लाइंट को सुपुर्द करने के लिए तैयार है!** 🎉
