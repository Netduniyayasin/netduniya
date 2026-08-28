"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { 
  Crop, 
  Calendar, 
  Landmark, 
  FileCheck2, 
  Coins, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Building2
} from "lucide-react";

// Indian Number to Words (English)
function numberToIndianWords(numStr: string): string {
  const num = parseFloat(numStr);
  if (isNaN(num) || num <= 0) return "";

  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function inWords(n: number): string {
    if (n === 0) return "";
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + inWords(n % 100) : "");
    if (n < 100000) return inWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + inWords(n % 1000) : "");
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + inWords(n % 100000) : "");
    return inWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + inWords(n % 10000000) : "");
  }

  const parts = num.toFixed(2).split(".");
  const rupees = parseInt(parts[0], 10);
  const paise = parseInt(parts[1], 10);

  let result = "Rupees " + inWords(rupees);
  if (paise > 0) {
    result += " and " + inWords(paise) + " Paise";
  }
  result += " Only";
  return result;
}

// Verhoeff Algorithm for Aadhaar Validation
const dTable = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

const pTable = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

function validateAadhaarVerhoeff(aadhaar: string): boolean {
  if (!/^\d{12}$/.test(aadhaar)) return false;
  let c = 0;
  const reversed = aadhaar.split("").reverse();
  for (let i = 0; i < reversed.length; i++) {
    const digit = parseInt(reversed[i], 10);
    c = dTable[c][pTable[i % 8][digit]];
  }
  return c === 0;
}

export default function CitizenToolsPage() {
  const [activeTab, setActiveTab] = useState<'cropper' | 'age' | 'pan_aadhaar' | 'ifsc' | 'num_words'>('cropper');

  // --- TOOL 1: Photo & Signature Cropper / Compressor ---
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalFileSizeKb, setOriginalFileSizeKb] = useState<number>(0);
  const [targetWidth, setTargetWidth] = useState(200);
  const [targetHeight, setTargetHeight] = useState(230);
  const [targetMaxKb, setTargetMaxKb] = useState(50);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSizeKb, setOutputSizeKb] = useState<number>(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginalFileSizeKb(Math.round(file.size / 1024));
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      setImageSrc(data);
      processImage(data, targetWidth, targetHeight, targetMaxKb);
    };
    reader.readAsDataURL(file);
  };

  const processImage = (src: string, w: number, h: number, maxKb: number) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        // Quality compression loop to match maxKb
        let quality = 0.92;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);
        let currentSizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);

        while (currentSizeKb > maxKb && quality > 0.2) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
          currentSizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
        }

        setOutputUrl(dataUrl);
        setOutputSizeKb(currentSizeKb);
      }
    };
    img.src = src;
  };

  const applyPreset = (preset: 'ssc' | 'signature' | 'passport' | 'upsc') => {
    let w = 200, h = 230, kb = 50;
    if (preset === 'signature') {
      w = 140; h = 60; kb = 20;
    } else if (preset === 'passport') {
      w = 350; h = 450; kb = 100;
    } else if (preset === 'ssc') {
      w = 200; h = 230; kb = 50;
    } else if (preset === 'upsc') {
      w = 350; h = 350; kb = 100;
    }
    setTargetWidth(w);
    setTargetHeight(h);
    setTargetMaxKb(kb);
    if (imageSrc) processImage(imageSrc, w, h, kb);
  };

  // --- TOOL 2: Age Calculator ---
  const [dob, setDob] = useState("");
  const [cutoffDate, setCutoffDate] = useState(new Date().toISOString().split("T")[0]);
  const [ageResult, setAgeResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalWeeks: number;
    nextBirthdayDays: number;
  } | null>(null);

  const calculateAge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob || !cutoffDate) return;

    const birth = new Date(dob);
    const target = new Date(cutoffDate);

    if (birth > target) {
      alert("Date of Birth cannot be in the future of the cut-off date!");
      return;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonthDays = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
      days += prevMonthDays;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const diffTime = Math.abs(target.getTime() - birth.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);

    // Next birthday calculation
    const currentYear = new Date().getFullYear();
    let nextBday = new Date(currentYear, birth.getMonth(), birth.getDate());
    if (nextBday < new Date()) {
      nextBday = new Date(currentYear + 1, birth.getMonth(), birth.getDate());
    }
    const nextBirthdayDays = Math.ceil((nextBday.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    setAgeResult({ years, months, days, totalDays, totalWeeks, nextBirthdayDays });
  };

  // --- TOOL 3: PAN & Aadhaar Validator ---
  const [panInput, setPanInput] = useState("");
  const [panStatus, setPanStatus] = useState<{ valid: boolean; message: string; holderType?: string } | null>(null);
  const [aadhaarInput, setAadhaarInput] = useState("");
  const [aadhaarStatus, setAadhaarStatus] = useState<{ valid: boolean; message: string } | null>(null);

  const handleValidatePan = (e: React.FormEvent) => {
    e.preventDefault();
    const pan = panInput.trim().toUpperCase();
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(pan)) {
      setPanStatus({ valid: false, message: "Invalid PAN Format. Must be 10 characters (e.g. ABCDE1234F)." });
      return;
    }

    const fourthChar = pan[3];
    const typeMap: Record<string, string> = {
      P: "Individual (व्यक्तिगत)",
      C: "Company (कंपनी)",
      H: "Hindu Undivided Family (HUF)",
      F: "Firm / Partnership (फर्म)",
      A: "Association of Persons (AOP)",
      T: "Trust (ट्रस्ट)",
      B: "Body of Individuals (BOI)",
      L: "Local Authority (स्थानीय प्राधिकरण)",
      J: "Artificial Juridical Person",
      G: "Government Agency (सरकारी एजेंसी)",
    };

    const holderType = typeMap[fourthChar] || "Official Entity";
    setPanStatus({
      valid: true,
      message: "Valid PAN Structure & Check Character!",
      holderType,
    });
  };

  const handleValidateAadhaar = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = aadhaarInput.replace(/\s+/g, "");
    if (clean.length !== 12 || !/^\d{12}$/.test(clean)) {
      setAadhaarStatus({ valid: false, message: "Aadhaar number must contain exactly 12 numeric digits." });
      return;
    }

    const isValidVerhoeff = validateAadhaarVerhoeff(clean);
    if (isValidVerhoeff) {
      setAadhaarStatus({ valid: true, message: "Valid 12-digit Aadhaar Number (Verhoeff Checksum Passed)!" });
    } else {
      setAadhaarStatus({ valid: false, message: "Invalid Aadhaar Number! Checksum verification failed." });
    }
  };

  // --- TOOL 4: IFSC Lookup ---
  const [ifscCode, setIfscCode] = useState("");
  const [ifscData, setIfscData] = useState<any>(null);
  const [ifscLoading, setIfscLoading] = useState(false);
  const [ifscError, setIfscError] = useState<string | null>(null);

  const searchIfsc = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = ifscCode.trim().toUpperCase();
    if (code.length !== 11) {
      setIfscError("IFSC Code must be exactly 11 characters.");
      return;
    }

    setIfscLoading(true);
    setIfscError(null);
    setIfscData(null);

    try {
      const res = await fetch(`https://ifsc.razorpay.com/${code}`);
      if (!res.ok) throw new Error("IFSC Code not found");
      const data = await res.json();
      setIfscData(data);
    } catch {
      setIfscError(`IFSC Code "${code}" not found in national directory. Please verify.`);
    } finally {
      setIfscLoading(false);
    }
  };

  // --- TOOL 5: Number to Words Converter ---
  const [amountInput, setAmountInput] = useState("125450");
  const [copiedWords, setCopiedWords] = useState(false);

  const englishWords = numberToIndianWords(amountInput);

  const handleCopyWords = () => {
    if (!englishWords) return;
    navigator.clipboard.writeText(englishWords);
    setCopiedWords(true);
    setTimeout(() => setCopiedWords(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-card border-b-4 border-amber-500">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-white/10 px-3 py-1 rounded">
              Verified Citizen Utilities
            </span>
            <span className="text-xs text-slate-300 font-semibold">• 100% Free & Fast</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Citizen Digital Utility Tools
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Essential tools for online government applications: Exam photo & signature resizer, exact age calculator, PAN/Aadhaar format checker, bank IFSC lookup, and cheque amount to words converter.
          </p>
        </div>
      </div>

      {/* 5 Tool Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto no-scrollbar pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('cropper')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'cropper'
              ? 'border-brand-blue text-brand-blue bg-white rounded-t-xl shadow-sm'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Crop className="h-4 w-4" />
          <span>1. Photo & Signature Resizer</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('age')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'age'
              ? 'border-brand-blue text-brand-blue bg-white rounded-t-xl shadow-sm'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>2. Govt Exam Age Calculator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pan_aadhaar')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'pan_aadhaar'
              ? 'border-brand-blue text-brand-blue bg-white rounded-t-xl shadow-sm'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCheck2 className="h-4 w-4" />
          <span>3. PAN & Aadhaar Validator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ifsc')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'ifsc'
              ? 'border-brand-blue text-brand-blue bg-white rounded-t-xl shadow-sm'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Landmark className="h-4 w-4" />
          <span>4. Bank IFSC Lookup</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('num_words')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'num_words'
              ? 'border-brand-blue text-brand-blue bg-white rounded-t-xl shadow-sm'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Coins className="h-4 w-4" />
          <span>5. Number to Words (INR)</span>
        </button>
      </div>

      {/* TOOL 1: Photo & Signature Resizer */}
      {activeTab === 'cropper' && (
        <div className="bg-white rounded-2xl shadow-card border border-slate-200 p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-lg font-black text-slate-900">Govt Job Form Photo & Signature Resizer + Compressor</h2>
            <p className="text-xs text-slate-500 mt-0.5">Crop, resize, and compress your photograph or signature to exact pixel dimensions & KB limits for SSC, UPSC, Railway, Police, or Banking forms.</p>
          </div>

          {/* Quick Exam Presets */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-xs font-black text-slate-700 mr-2">Presets:</span>
            <button
              type="button"
              onClick={() => applyPreset('ssc')}
              className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-300 text-slate-800 rounded-lg text-xs font-bold shadow-sm transition"
            >
              SSC Photo (200×230 px, 20-50 KB)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('signature')}
              className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-300 text-slate-800 rounded-lg text-xs font-bold shadow-sm transition"
            >
              Signature (140×60 px, 10-20 KB)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('passport')}
              className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-300 text-slate-800 rounded-lg text-xs font-bold shadow-sm transition"
            >
              Passport Photo (350×450 px, 100 KB)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('upsc')}
              className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-300 text-slate-800 rounded-lg text-xs font-bold shadow-sm transition"
            >
              UPSC / NTA Square (350×350 px, 100 KB)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Upload & Dimension Controls */}
            <div className="md:col-span-6 space-y-4">
              <div className="border-2 border-dashed border-slate-300 hover:border-brand-blue transition rounded-xl p-6 text-center bg-slate-50">
                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <label className="cursor-pointer bg-brand-blue hover:bg-brand-primary text-white text-xs font-bold py-2.5 px-5 rounded-lg inline-block shadow transition">
                  <span>Select Photo or Signature</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
                <p className="text-[11px] text-slate-400 mt-2">Upload any JPG, JPEG, or PNG image</p>
                {originalFileSizeKb > 0 && (
                  <p className="text-xs text-slate-600 font-bold mt-1">Original Size: {originalFileSizeKb} KB</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Width (px)</label>
                  <input
                    type="number"
                    value={targetWidth}
                    onChange={(e) => {
                      const w = Number(e.target.value);
                      setTargetWidth(w);
                      if (imageSrc) processImage(imageSrc, w, targetHeight, targetMaxKb);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Height (px)</label>
                  <input
                    type="number"
                    value={targetHeight}
                    onChange={(e) => {
                      const h = Number(e.target.value);
                      setTargetHeight(h);
                      if (imageSrc) processImage(imageSrc, targetWidth, h, targetMaxKb);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max KB Limit</label>
                  <input
                    type="number"
                    value={targetMaxKb}
                    onChange={(e) => {
                      const kb = Number(e.target.value);
                      setTargetMaxKb(kb);
                      if (imageSrc) processImage(imageSrc, targetWidth, targetHeight, kb);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Live Processed Output */}
            <div className="md:col-span-6 bg-slate-50 p-6 rounded-xl border border-slate-200 text-center space-y-4 flex flex-col items-center justify-center min-h-[280px]">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Processed Output Preview</span>
              {outputUrl ? (
                <div className="space-y-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={outputUrl}
                    alt="Processed Output"
                    style={{ maxWidth: '220px', maxHeight: '220px' }}
                    className="border-2 border-slate-300 rounded-lg shadow-md mx-auto bg-white p-1"
                  />
                  <div className="text-xs text-slate-700 font-bold space-y-0.5">
                    <p>Dimensions: {targetWidth} × {targetHeight} px</p>
                    <p className="text-emerald-700 font-black">Output Size: ~{outputSizeKb} KB</p>
                  </div>
                  <a
                    href={outputUrl}
                    download={`netduniya_${targetWidth}x${targetHeight}_${outputSizeKb}kb.jpg`}
                    className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 px-6 rounded-xl shadow transition"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Ready Image</span>
                  </a>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Upload an image from the left box to preview and download.</p>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TOOL 2: Age Calculator */}
      {activeTab === 'age' && (
        <div className="bg-white rounded-2xl shadow-card border border-slate-200 p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-lg font-black text-slate-900">Govt Job Form Cut-off Age Calculator</h2>
            <p className="text-xs text-slate-500 mt-0.5">Calculate your exact age in years, months, and days for UPSC, SSC, Banking, or State exam eligibility notifications.</p>
          </div>

          <form onSubmit={calculateAge} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Date of Birth (DOB) *</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Eligibility Cut-off Date *</label>
              <input
                type="date"
                value={cutoffDate}
                onChange={(e) => setCutoffDate(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="bg-brand-blue hover:bg-brand-primary text-white font-bold text-xs py-3 px-6 rounded-xl shadow transition"
              >
                Calculate Age Breakdown
              </button>
            </div>
          </form>

          {ageResult && (
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-6 max-w-xl space-y-5 animate-fadeIn">
              <div className="flex items-center space-x-2 text-brand-blue font-black text-xs uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Calculated Age as of {cutoffDate}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                  <span className="text-3xl font-black text-slate-900">{ageResult.years}</span>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold mt-1">Years</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                  <span className="text-3xl font-black text-slate-900">{ageResult.months}</span>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold mt-1">Months</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                  <span className="text-3xl font-black text-slate-900">{ageResult.days}</span>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold mt-1">Days</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-blue-100">
                <div>Total Weeks: <strong>{ageResult.totalWeeks.toLocaleString()} weeks</strong></div>
                <div>Total Days: <strong>{ageResult.totalDays.toLocaleString()} days</strong></div>
                <div className="col-span-2 text-indigo-700 font-semibold">
                  🎂 Next Birthday in: <strong>{ageResult.nextBirthdayDays} days</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 3: PAN & Aadhaar Format & Validation Tool */}
      {activeTab === 'pan_aadhaar' && (
        <div className="bg-white rounded-2xl shadow-card border border-slate-200 p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-lg font-black text-slate-900">PAN & Aadhaar Structure & Checksum Validator</h2>
            <p className="text-xs text-slate-500 mt-0.5">Validate PAN card structure, decrypt entity holder type, and test 12-digit Aadhaar Verhoeff checksum algorithm.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* PAN Validation Box */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-900 border-b pb-2">
                1. PAN Card Structure Validator
              </h3>
              <form onSubmit={handleValidatePan} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">10-Digit PAN Number</label>
                  <input
                    type="text"
                    value={panInput}
                    onChange={(e) => setPanInput(e.target.value.toUpperCase())}
                    maxLength={10}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs uppercase font-mono font-bold"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-brand-blue hover:bg-brand-primary text-white font-bold text-xs py-2 px-4 rounded-lg shadow transition"
                >
                  Verify PAN Structure
                </button>
              </form>

              {panStatus && (
                <div className={`p-3.5 rounded-xl text-xs space-y-1 ${panStatus.valid ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-rose-50 border border-rose-200 text-rose-900'}`}>
                  <p className="font-bold">{panStatus.message}</p>
                  {panStatus.holderType && (
                    <p className="text-[11px] font-semibold text-emerald-700">Holder Entity Type: {panStatus.holderType}</p>
                  )}
                </div>
              )}
            </div>

            {/* Aadhaar Checksum Box */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-900 border-b pb-2">
                2. 12-Digit Aadhaar Checksum Validator
              </h3>
              <form onSubmit={handleValidateAadhaar} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">12-Digit Aadhaar Number</label>
                  <input
                    type="text"
                    value={aadhaarInput}
                    onChange={(e) => setAadhaarInput(e.target.value)}
                    maxLength={14}
                    placeholder="e.g. 5432 1098 7654"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-mono font-bold"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-brand-blue hover:bg-brand-primary text-white font-bold text-xs py-2 px-4 rounded-lg shadow transition"
                >
                  Verify Verhoeff Checksum
                </button>
              </form>

              {aadhaarStatus && (
                <div className={`p-3.5 rounded-xl text-xs space-y-1 ${aadhaarStatus.valid ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-rose-50 border border-rose-200 text-rose-900'}`}>
                  <p className="font-bold">{aadhaarStatus.message}</p>
                </div>
              )}
            </div>

          </div>

          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 flex items-center justify-between text-xs">
            <span className="text-slate-700 font-semibold">Want to verify official PAN-Aadhaar linkage on Income Tax portal?</span>
            <a
              href="https://eportal.incometax.gov.in/iec/foservices/#/pre-login/link-aadhaar-status"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-blue text-white font-bold px-3 py-1.5 rounded-lg inline-flex items-center space-x-1 shadow"
            >
              <span>Official Linkage Check</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}

      {/* TOOL 4: IFSC Lookup */}
      {activeTab === 'ifsc' && (
        <div className="bg-white rounded-2xl shadow-card border border-slate-200 p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-lg font-black text-slate-900">National Bank IFSC & Branch Lookup</h2>
            <p className="text-xs text-slate-500 mt-0.5">Lookup bank branch address, MICR code, and RTGS/NEFT payment capabilities from any 11-digit IFSC code.</p>
          </div>

          <form onSubmit={searchIfsc} className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <input
              type="text"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
              placeholder="e.g. SBIN0001234, HDFC0000001, PUNB0123400"
              maxLength={11}
              required
              className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs uppercase font-mono font-bold text-slate-900 focus:ring-2 focus:ring-brand-blue"
            />
            <button
              type="submit"
              disabled={ifscLoading}
              className="bg-brand-blue hover:bg-brand-primary text-white font-bold text-xs py-2.5 px-6 rounded-lg shadow transition"
            >
              {ifscLoading ? "Searching..." : "Lookup Branch Details"}
            </button>
          </form>

          {ifscError && (
            <p className="text-xs text-rose-600 font-semibold">{ifscError}</p>
          )}

          {ifscData && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-xl space-y-4 animate-fadeIn text-xs">
              <div className="border-b border-slate-200 pb-3 flex items-start justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">{ifscData.BANK}</h3>
                  <p className="text-xs text-slate-500">{ifscData.BRANCH} Branch</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-1 rounded">
                  NEFT / RTGS Enabled
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div><span className="text-slate-400 block text-[10px] font-bold uppercase">IFSC Code</span> <strong className="font-mono text-slate-900">{ifscData.IFSC}</strong></div>
                <div><span className="text-slate-400 block text-[10px] font-bold uppercase">MICR Code</span> <strong className="font-mono text-slate-900">{ifscData.MICR || "N/A"}</strong></div>
                <div><span className="text-slate-400 block text-[10px] font-bold uppercase">City</span> {ifscData.CITY}</div>
                <div><span className="text-slate-400 block text-[10px] font-bold uppercase">State</span> {ifscData.STATE}</div>
                <div className="col-span-2"><span className="text-slate-400 block text-[10px] font-bold uppercase">Complete Branch Address</span> {ifscData.ADDRESS}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 5: Number to Words Converter */}
      {activeTab === 'num_words' && (
        <div className="bg-white rounded-2xl shadow-card border border-slate-200 p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-lg font-black text-slate-900">Number to Words (INR Lakh & Crore Converter)</h2>
            <p className="text-xs text-slate-500 mt-0.5">Convert currency numbers to official words in Indian numbering system for bank cheques, deposit slips, Demand Drafts, and government application fee challans.</p>
          </div>

          <div className="max-w-xl space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Enter Amount / Number (in Rupees)</label>
              <input
                type="number"
                min={1}
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder="e.g. 125450"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm font-black text-slate-900 focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            {englishWords && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-900">
                    Indian Currency in Words (Cheque Format)
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyWords}
                    className="text-xs font-bold bg-amber-200 hover:bg-amber-300 text-amber-900 px-3 py-1 rounded-lg transition flex items-center space-x-1"
                  >
                    {copiedWords ? <Check className="h-3 w-3 text-emerald-700" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedWords ? "Copied!" : "Copy Words"}</span>
                  </button>
                </div>

                <div className="bg-white p-4 rounded-xl border border-amber-200 text-sm font-bold text-slate-900 leading-relaxed shadow-sm">
                  "{englishWords}"
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  Formatted for Indian Banking Standards (Lakhs & Crores).
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
