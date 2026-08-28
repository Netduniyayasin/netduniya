"use client";

import React, { useEffect, useState } from "react";
import { 
  FileSpreadsheet, 
  PlusCircle, 
  Trash2, 
  Save, 
  CheckCircle2, 
  Globe, 
  AlertCircle, 
  User, 
  Layers,
  Image as ImageIcon
} from "lucide-react";
import { 
  subscribeToNotices, 
  saveNotice, 
  deleteNotice,
  subscribeToImportantLinks,
  saveImportantLink,
  deleteImportantLink,
  getFounderData,
  saveFounderData,
  getSiteSettings,
  updateSiteSettings,
  DEFAULT_FOUNDER_DATA,
  DEFAULT_SITE_SETTINGS,
  subscribeToJobs,
  saveJob,
  deleteJob,
  DEFAULT_GOVERNMENT_JOBS
} from "@/lib/firestore-service";
import { NoticeTicker, ImportantLink, FounderData, SiteSettings, GovernmentJob } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

export default function AdminContentPage() {
  const { profile, user } = useAuth();
  const [tab, setTab] = useState<'ticker' | 'jobs' | 'links' | 'policies' | 'founder' | 'infocard'>('ticker');

  // Notices State
  const [notices, setNotices] = useState<NoticeTicker[]>([]);
  const [noticeText, setNoticeText] = useState("");
  const [noticeLink, setNoticeLink] = useState("");
  const [noticePriority, setNoticePriority] = useState(10);

  // Jobs State
  const [jobs, setJobs] = useState<GovernmentJob[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDept, setJobDept] = useState("");
  const [jobState, setJobState] = useState("Central Govt");
  const [jobVacancies, setJobVacancies] = useState("");
  const [jobQual, setJobQual] = useState("");
  const [jobSalary, setJobSalary] = useState("");
  const [jobLastDate, setJobLastDate] = useState("");
  const [jobApplyUrl, setJobApplyUrl] = useState("");
  const [jobNoticeUrl, setJobNoticeUrl] = useState("");

  // Links State
  const [links, setLinks] = useState<ImportantLink[]>([]);
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkCategory, setLinkCategory] = useState<ImportantLink['category']>("National");

  // Founder State
  const [founder, setFounder] = useState<FounderData>(DEFAULT_FOUNDER_DATA);
  const [founderSaving, setFounderSaving] = useState(false);

  // Info Card State
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [infoHeading, setInfoHeading] = useState("");
  const [infoDesc, setInfoDesc] = useState("");
  const [bullets, setBullets] = useState<string[]>([]);
  const [newBullet, setNewBullet] = useState("");

  // Legal & CMS Policies State
  const [aboutUs, setAboutUs] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [termsPolicy, setTermsPolicy] = useState("");
  const [refundPolicy, setRefundPolicy] = useState("");
  const [helpSupport, setHelpSupport] = useState("");
  const [disclaimerLegal, setDisclaimerLegal] = useState("");
  const [savingPolicies, setSavingPolicies] = useState(false);

  useEffect(() => {
    const unsubNotices = subscribeToNotices((data) => setNotices(data), false);
    const unsubJobs = subscribeToJobs((data) => setJobs(data), false);
    const unsubLinks = subscribeToImportantLinks((data) => setLinks(data), false);

    getFounderData().then((f) => setFounder(f));
    getSiteSettings().then((s) => {
      setSettings(s);
      setInfoHeading(s.infoCardHeading || "");
      setInfoDesc(s.infoCardDescription || "");
      setBullets(s.infoCardBullets || []);
      setAboutUs(s.aboutUsContent || DEFAULT_SITE_SETTINGS.aboutUsContent || "");
      setPrivacyPolicy(s.privacyPolicyContent || DEFAULT_SITE_SETTINGS.privacyPolicyContent || "");
      setTermsPolicy(s.termsConditionsContent || DEFAULT_SITE_SETTINGS.termsConditionsContent || "");
      setRefundPolicy(s.refundPolicyContent || DEFAULT_SITE_SETTINGS.refundPolicyContent || "");
      setHelpSupport(s.helpSupportContent || DEFAULT_SITE_SETTINGS.helpSupportContent || "");
      setDisclaimerLegal(s.disclaimerLegalContent || DEFAULT_SITE_SETTINGS.disclaimerLegalContent || "");
    });

    return () => {
      unsubNotices();
      unsubJobs();
      unsubLinks();
    };
  }, []);

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !jobDept.trim() || !jobApplyUrl.trim()) return;
    const newJob: GovernmentJob = {
      id: `job-${Date.now()}`,
      title: jobTitle.trim(),
      slug: jobTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      department: jobDept.trim(),
      state: jobState,
      totalVacancies: jobVacancies.trim() || "Multiple Posts",
      qualification: jobQual.trim() || "Graduate / 12th Pass",
      salaryScale: jobSalary.trim() || "Government Pay Scale",
      ageLimit: "18 to 35 Years",
      lastDate: jobLastDate.trim() || "Active / Ongoing",
      applyUrl: jobApplyUrl.trim(),
      notificationUrl: jobNoticeUrl.trim() || jobApplyUrl.trim(),
      isVerified: true,
      status: "active",
      sortOrder: jobs.length + 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await saveJob(newJob);
    setJobTitle("");
    setJobDept("");
    setJobVacancies("");
    setJobQual("");
    setJobSalary("");
    setJobLastDate("");
    setJobApplyUrl("");
    setJobNoticeUrl("");
  };

  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeText.trim()) return;
    const nObj: NoticeTicker = {
      id: `notice-${Date.now()}`,
      text: noticeText.trim(),
      link: noticeLink.trim() || undefined,
      priority: Number(noticePriority),
      isActive: true,
      createdAt: Date.now(),
    };
    await saveNotice(nObj);
    setNoticeText("");
    setNoticeLink("");
    alert("Important ticker announcement added!");
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkName.trim() || !linkUrl.trim()) return;
    const lObj: ImportantLink = {
      id: `lnk-${Date.now()}`,
      name: linkName.trim(),
      url: linkUrl.trim(),
      category: linkCategory,
      openInNewTab: true,
      sortOrder: links.length + 1,
      isActive: true,
      createdAt: Date.now(),
    };
    await saveImportantLink(lObj);
    setLinkName("");
    setLinkUrl("");
    alert("Important Link added!");
  };

  const handleSaveFounder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFounderSaving(true);
    try {
      await saveFounderData(founder);
      alert("Founder profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save founder data");
    } finally {
      setFounderSaving(false);
    }
  };

  const handleSaveInfoCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSiteSettings(
        {
          infoCardHeading: infoHeading,
          infoCardDescription: infoDesc,
          infoCardBullets: bullets,
        },
        user?.uid || "admin",
        profile?.fullName || "Admin"
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update info card settings");
    }
  };

  const handleSavePolicies = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPolicies(true);
    try {
      await updateSiteSettings({
        aboutUsContent: aboutUs,
        privacyPolicyContent: privacyPolicy,
        termsConditionsContent: termsPolicy,
        refundPolicyContent: refundPolicy,
        helpSupportContent: helpSupport,
        disclaimerLegalContent: disclaimerLegal,
        developerInfoLocked: true,
      }, user?.uid || "admin", profile?.fullName || "Admin");
      alert("Policies, Legal Pages, and Help & Support updated successfully! Live pages updated.");
    } catch (err: any) {
      alert("Failed to save policies: " + err.message);
    } finally {
      setSavingPolicies(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
        <div>
          <h1 className="text-lg font-black text-slate-900">CMS & Homepage Dynamic Content</h1>
          <p className="text-xs text-slate-500">Control notice ticker, policies, legal support, refund policy, help center, and portal content.</p>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setTab('ticker')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
              tab === 'ticker' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
            }`}
          >
            Ticker Notices ({notices.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('jobs')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
              tab === 'jobs' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
            }`}
          >
            100% Verified Jobs ({jobs.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('policies')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
              tab === 'policies' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
            }`}
          >
            Policies & Legal CMS
          </button>
          <button
            type="button"
            onClick={() => setTab('links')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
              tab === 'links' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
            }`}
          >
            Portal Links ({links.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('infocard')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
              tab === 'infocard' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
            }`}
          >
            Info Notice Card
          </button>
          <button
            type="button"
            onClick={() => setTab('founder')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
              tab === 'founder' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
            }`}
          >
            Founder Section
          </button>
        </div>
      </div>

      {/* TAB: Government Jobs Management */}
      {tab === 'jobs' && (
        <div className="space-y-6">
          <form onSubmit={handleAddJob} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-black uppercase text-brand-blue">Add 100% Verified Government Job</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. SSC CGL 2026 or Railway NTPC"
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department / Commission *</label>
                <input
                  type="text"
                  value={jobDept}
                  onChange={(e) => setJobDept(e.target.value)}
                  placeholder="e.g. Staff Selection Commission"
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category / Sector</label>
                <select
                  value={jobState}
                  onChange={(e) => setJobState(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                >
                  <option value="Central Govt">Central Govt</option>
                  <option value="State Govt">State Govt</option>
                  <option value="Banking">Banking</option>
                  <option value="Railways">Railways</option>
                  <option value="Defence / Police">Defence / Police</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Vacancies</label>
                <input
                  type="text"
                  value={jobVacancies}
                  onChange={(e) => setJobVacancies(e.target.value)}
                  placeholder="e.g. 14,582 Posts"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Qualification</label>
                <input
                  type="text"
                  value={jobQual}
                  onChange={(e) => setJobQual(e.target.value)}
                  placeholder="e.g. Bachelor Degree / 12th Pass"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Salary / Scale</label>
                <input
                  type="text"
                  value={jobSalary}
                  onChange={(e) => setJobSalary(e.target.value)}
                  placeholder="e.g. Level 4 to Level 8 (₹25k - ₹1.5L)"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Last Date to Apply</label>
                <input
                  type="text"
                  value={jobLastDate}
                  onChange={(e) => setJobLastDate(e.target.value)}
                  placeholder="e.g. 30 Sep 2026"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Apply Link *</label>
                <input
                  type="url"
                  value={jobApplyUrl}
                  onChange={(e) => setJobApplyUrl(e.target.value)}
                  placeholder="https://ssc.gov.in"
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notification PDF URL</label>
                <input
                  type="url"
                  value={jobNoticeUrl}
                  onChange={(e) => setJobNoticeUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-5 rounded-lg shadow transition"
            >
              + Add & Publish Verified Job
            </button>
          </form>

          {/* Job List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-500">Live 100% Verified Govt Jobs ({jobs.length}):</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {jobs.map((j) => (
                <div key={j.id} className="p-4 border rounded-xl bg-slate-50 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {j.department}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteJob(j.id)}
                        className="text-rose-600 hover:text-rose-800 p-1"
                        title="Delete Job"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 mt-1">{j.title}</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Vacancies: <strong>{j.totalVacancies}</strong> &bull; Last Date: <strong className="text-rose-600">{j.lastDate}</strong>
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200 text-slate-500">
                    <span>Pay: {j.salaryScale || "Norms"}</span>
                    <a
                      href={j.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-blue font-bold hover:underline"
                    >
                      Portal Link &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: Ticker Notices */}
      {tab === 'ticker' && (
        <div className="space-y-6">
          <form onSubmit={handleAddNotice} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-black uppercase text-brand-blue">Add Scrolling Notice / Alert</h3>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8">
                <label className="block text-xs font-bold text-slate-700 mb-1">Announcement Text *</label>
                <input
                  type="text"
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                  placeholder="★ Important notice message scrolling on public header..."
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div className="sm:col-span-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Link (Optional)</label>
                <input
                  type="text"
                  value={noticeLink}
                  onChange={(e) => setNoticeLink(e.target.value)}
                  placeholder="/services or https://..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs py-2 px-5 rounded-lg shadow"
            >
              + Publish Notice Ticker
            </button>
          </form>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase text-slate-500">Live Ticker Items:</h3>
            {notices.map((n) => (
              <div key={n.id} className="p-3 border rounded-xl flex items-center justify-between bg-slate-50 text-xs">
                <div>
                  <p className="font-semibold text-slate-900">{n.text}</p>
                  {n.link && <span className="text-[10px] text-brand-blue">Link: {n.link}</span>}
                </div>
                <button
                  type="button"
                  onClick={() => deleteNotice(n.id)}
                  className="text-rose-600 hover:text-rose-800 font-bold ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Portal Links */}
      {tab === 'links' && (
        <div className="space-y-6">
          <form onSubmit={handleAddLink} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-black uppercase text-brand-blue">Add Official Portal Link</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Portal Name *</label>
                <input
                  type="text"
                  value={linkName}
                  onChange={(e) => setLinkName(e.target.value)}
                  placeholder="e.g. Parivahan Sarathi"
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL *</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={linkCategory}
                  onChange={(e) => setLinkCategory(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                >
                  <option value="National">National</option>
                  <option value="Government">Government</option>
                  <option value="Banking">Banking</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="bg-brand-blue hover:bg-brand-primary text-white font-bold text-xs py-2 px-5 rounded-lg shadow"
            >
              + Add Official Link
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {links.map((lnk) => (
              <div key={lnk.id} className="p-3 border rounded-xl flex items-center justify-between bg-slate-50 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">{lnk.category}</span>
                  <h4 className="font-bold text-slate-900">{lnk.name}</h4>
                  <span className="text-[11px] text-brand-blue truncate block max-w-xs">{lnk.url}</span>
                </div>
                <button
                  type="button"
                  onClick={() => deleteImportantLink(lnk.id)}
                  className="text-rose-500 hover:text-rose-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Info Notice Card */}
      {tab === 'infocard' && (
        <form onSubmit={handleSaveInfoCard} className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notice Card Heading *</label>
            <input
              type="text"
              value={infoHeading}
              onChange={(e) => setInfoHeading(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notice Card Description *</label>
            <textarea
              value={infoDesc}
              onChange={(e) => setInfoDesc(e.target.value)}
              required
              rows={3}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
            />
          </div>

          {/* Bullets */}
          <div className="border p-3.5 rounded-xl bg-slate-50 space-y-2">
            <label className="block text-xs font-bold text-slate-800">Highlight Points</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newBullet}
                onChange={(e) => setNewBullet(e.target.value)}
                placeholder="e.g. 100% Encrypted & Fast Processing"
                className="flex-1 bg-white border border-slate-300 rounded-lg p-1.5 text-xs"
              />
              <button
                type="button"
                onClick={() => { if (newBullet.trim()) { setBullets([...bullets, newBullet.trim()]); setNewBullet(""); } }}
                className="bg-brand-blue text-white text-xs px-3 py-1.5 rounded-lg font-bold"
              >
                + Add Point
              </button>
            </div>
            <div className="space-y-1 pt-1">
              {bullets.map((b, i) => (
                <div key={i} className="bg-white p-2 border rounded-md text-xs flex justify-between items-center">
                  <span>✓ {b}</span>
                  <button type="button" onClick={() => setBullets(bullets.filter((_, idx) => idx !== i))} className="text-rose-500 font-bold ml-2">✕</button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-brand-blue hover:bg-brand-primary text-white font-bold text-xs py-2.5 px-6 rounded-lg shadow"
          >
            Save Info Card Content
          </button>
        </form>
      )}

      {/* TAB 4: Founder Section */}
      {tab === 'founder' && (
        <form onSubmit={handleSaveFounder} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Founder Full Name *</label>
              <input
                type="text"
                value={founder.name}
                onChange={(e) => setFounder({ ...founder, name: e.target.value })}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Designation *</label>
              <input
                type="text"
                value={founder.designation}
                onChange={(e) => setFounder({ ...founder, designation: e.target.value })}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Founder Photo URL</label>
            <input
              type="url"
              value={founder.imageUrl}
              onChange={(e) => setFounder({ ...founder, imageUrl: e.target.value })}
              placeholder="https://..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Inspirational Quote *</label>
            <textarea
              value={founder.quote}
              onChange={(e) => setFounder({ ...founder, quote: e.target.value })}
              required
              rows={2}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mission / Vision Bio *</label>
            <textarea
              value={founder.description}
              onChange={(e) => setFounder({ ...founder, description: e.target.value })}
              required
              rows={3}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
            />
          </div>

          <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={founder.isVisible}
              onChange={(e) => setFounder({ ...founder, isVisible: e.target.checked })}
            />
            <span>Show Founder Section on Public Homepage</span>
          </label>

          <button
            type="submit"
            disabled={founderSaving}
            className="bg-brand-blue hover:bg-brand-primary text-white font-bold text-xs py-2.5 px-6 rounded-lg shadow"
          >
            {founderSaving ? "Saving..." : "Save Founder Profile"}
          </button>
        </form>
      )}

      {/* TAB: Legal Policies, Terms, Refund & Help Support CMS */}
      {tab === 'policies' && (
        <form onSubmit={handleSavePolicies} className="space-y-6 animate-fadeIn">
          
          <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-xl flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-brand-blue">Legal Support, Policies & Customer Center Content</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Edit website terms, citizen privacy policy, refund policy, help center, and legal disclosures. All changes reflect live instantly.
              </p>
            </div>
            <button
              type="submit"
              disabled={savingPolicies}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2.5 px-5 rounded-xl shadow transition flex items-center space-x-1.5 flex-shrink-0"
            >
              <Save className="h-4 w-4" />
              <span>{savingPolicies ? "Saving Policies..." : "Save All Policies"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* 1. About NetDuniya */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-black text-slate-900">
                1. About NetDuniya Content (/about)
              </label>
              <textarea
                value={aboutUs}
                onChange={(e) => setAboutUs(e.target.value)}
                rows={4}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 leading-relaxed focus:ring-1 focus:ring-brand-blue"
              />
            </div>

            {/* 2. Privacy Policy */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-black text-slate-900">
                2. Privacy Policy & Data Security (/privacy-policy)
              </label>
              <textarea
                value={privacyPolicy}
                onChange={(e) => setPrivacyPolicy(e.target.value)}
                rows={4}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 leading-relaxed focus:ring-1 focus:ring-brand-blue"
              />
            </div>

            {/* 3. Terms & Conditions */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-black text-slate-900">
                3. Terms & Conditions (/terms)
              </label>
              <textarea
                value={termsPolicy}
                onChange={(e) => setTermsPolicy(e.target.value)}
                rows={4}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 leading-relaxed focus:ring-1 focus:ring-brand-blue"
              />
            </div>

            {/* 4. Refund & Cancellation Policy */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-black text-slate-900">
                4. Refund & Cancellation Policy (/refund-cancellation)
              </label>
              <textarea
                value={refundPolicy}
                onChange={(e) => setRefundPolicy(e.target.value)}
                rows={4}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 leading-relaxed focus:ring-1 focus:ring-brand-blue"
              />
            </div>

            {/* 5. Help & Support / Customer Center */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-black text-slate-900">
                5. Help & Customer Support / Grievance Redressal (/support)
              </label>
              <textarea
                value={helpSupport}
                onChange={(e) => setHelpSupport(e.target.value)}
                rows={4}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 leading-relaxed focus:ring-1 focus:ring-brand-blue"
              />
            </div>

            {/* 6. Legal Disclaimer */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-black text-slate-900">
                6. Legal Disclaimer & Statutory Compliance (/disclaimer)
              </label>
              <textarea
                value={disclaimerLegal}
                onChange={(e) => setDisclaimerLegal(e.target.value)}
                rows={4}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 leading-relaxed focus:ring-1 focus:ring-brand-blue"
              />
            </div>

          </div>

          {/* 7. DEVELOPER INFORMATION - PROTECTED & LOCKED COMPONENT */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 flex-shrink-0 shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/developer.jpg"
                  alt="Developer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-black text-slate-900">Developer Profile & System Architecture</h4>
                  <span className="text-[10px] uppercase font-extrabold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full border border-amber-400">
                    🔒 Protected (Read-Only)
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Developer Name: <strong>Yasin Khan</strong> &bull; Core Full-Stack Next.js & Firebase Architecture.
                </p>
                <p className="text-[11px] text-amber-800 italic mt-0.5">
                  System Security Rule: Developer credentials and architecture information are permanently locked and cannot be modified from the CMS.
                </p>
              </div>
            </div>

            <span className="text-xs font-black text-amber-800 bg-white/70 px-3 py-1.5 rounded-lg border border-amber-300">
              Integrity Verified
            </span>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingPolicies}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 px-8 rounded-xl shadow-lg transition flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{savingPolicies ? "Saving Policies..." : "Save All Policies & Update Live Pages"}</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
