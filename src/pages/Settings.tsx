import { useState, useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import {
  User, Bell, Shield, Linkedin, GraduationCap,
  IndianRupee, X, Plus, Eye, EyeOff, AlertTriangle, Loader2, Save, Check, Trash2, Zap, CreditCard, Mail, RefreshCw, Unlink, CheckCircle2
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import TopBar from "../components/TopBar";
import api from "../api/axios";
import { toast } from "../components/Toast";
import AvatarSelector from "../components/AvatarSelector";
import { trackEvent } from "../utils/analytics";

type Tab = "profile" | "notifications" | "account" | "billing" | "integrations";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  college: string;
  graduationYear: number;
  linkedinUrl: string;
  targetCtcMin: number;
  targetCtcMax: number;
  avatarUrl: string | null;
}

const SKILL_SUGGESTIONS = ["React", "TypeScript", "Java", "Spring Boot", "Python", "Node.js", "AWS", "ML/AI", "SQL", "System Design"];

export default function Settings() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // --- Gmail Integration State ---
  const [gmailStatus, setGmailStatus] = useState<{ connected: boolean; lastScanned: string } | null>(null);
  const [scanning, setScanning] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  // Detect ?gmail=connected callback from OAuth redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const gmailParam = params.get("gmail");
    if (gmailParam === "connected") {
      toast.success("✅ Gmail connected successfully!");
      setActiveTab("integrations");
      window.history.replaceState({}, "", "/settings");
    } else if (gmailParam === "error") {
      toast.error("Gmail connection failed. Please try again.");
      window.history.replaceState({}, "", "/settings");
    }
  }, [location.search]);

  useEffect(() => {
    trackEvent('settings_tab_viewed', { tab: activeTab });
  }, [activeTab]);

  const fetchGmailStatus = async () => {
    try {
      const r = await api.get("/gmail/status");
      setGmailStatus(r.data as { connected: boolean; lastScanned: string });
    } catch { /* not configured yet */ }
  };

  const connectGmail = async () => {
    try {
      const r = await api.get("/gmail/auth-url");
      window.location.href = (r.data as { authUrl: string }).authUrl;
    } catch {
      toast.error("Failed to get auth URL. Please check backend configuration.");
    }
  };

  const scanNow = async () => {
    setScanning(true);
    try {
      const r = await api.post("/gmail/scan");
      const data = r.data as { detected: number };
      toast.success(`Gmail scan complete — ${data.detected} emails matched to your pipeline!`);
      fetchGmailStatus();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Scan failed";
      toast.error(msg);
    } finally {
      setScanning(false);
    }
  };

  const disconnectGmail = async () => {
    setDisconnecting(true);
    try {
      await api.post("/gmail/disconnect");
      setGmailStatus({ connected: false, lastScanned: "Never" });
      toast.success("Gmail disconnected.");
    } catch {
      toast.error("Failed to disconnect");
    } finally {
      setDisconnecting(false);
    }
  };

  // --- Profile State ---
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [targetCtcMin, setTargetCtcMin] = useState("");
  const [targetCtcMax, setTargetCtcMax] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const skillInputRef = useRef<HTMLInputElement>(null);

  // --- Billing State ---
  const [billingStatus, setBillingStatus] = useState<{
    plan: string; isActive: boolean; planExpiresAt: string | null;
    payments: { id: string; plan: string; amount: number; status: string; createdAt: string }[];
  } | null>(null);

  // --- Notification State ---
  const [notifs, setNotifs] = useState({
    emailDigest: true,
    followUpReminders: true,
    interviewReminders: true,
    browserNotifications: false,
  });

  // --- Account State ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/me");
        const data = res.data as UserProfile;
        setProfile(data);
        setName(data.name || "");
        setCollege(data.college || "");
        setGraduationYear(data.graduationYear ? String(data.graduationYear) : "");
        setLinkedinUrl(data.linkedinUrl || "");
        setTargetCtcMin(data.targetCtcMin ? String(data.targetCtcMin) : "");
        setTargetCtcMax(data.targetCtcMax ? String(data.targetCtcMax) : "");
        const cached = localStorage.getItem("jobrixa_skills");
        if (cached) setSkills(JSON.parse(cached));
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
    api.get("/payments/status")
      .then(r => setBillingStatus(r.data as typeof billingStatus))
      .catch(() => {});
    fetchGmailStatus();
  }, []);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await api.put("/users/me", {
        name,
        college,
        graduationYear: graduationYear ? Number(graduationYear) : null,
        linkedinUrl,
        targetCtcMin: targetCtcMin ? Number(targetCtcMin) : null,
        targetCtcMax: targetCtcMax ? Number(targetCtcMax) : null,
      });
      // Store skills in localStorage
      localStorage.setItem("jobrixa_skills", JSON.stringify(skills));
      // Update stored name too
      localStorage.setItem("jobrixa_user", name);
      toast.success("✅ Profile updated successfully");
      trackEvent('profile_updated');
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed) && skills.length < 20) {
      setSkills(prev => [...prev, trimmed]);
    }
    setSkillInput("");
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(skillInput);
    } else if (e.key === "Backspace" && skillInput === "" && skills.length > 0) {
      setSkills(prev => prev.slice(0, -1));
    }
  };

  const removeSkill = (skill: string) => setSkills(prev => prev.filter(s => s !== skill));

  const avatarBg = `hsl(${(profile?.name?.charCodeAt(0) ?? 0) * 7 % 360}, 60%, 40%)`;

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile",      label: "Profile",       icon: <User size={16} /> },
    { id: "notifications",label: "Notifications",  icon: <Bell size={16} /> },
    { id: "integrations", label: "Integrations",   icon: <Mail size={16} /> },
    { id: "billing",      label: "Billing",        icon: <CreditCard size={16} /> },
    { id: "account",      label: "Account",        icon: <Shield size={16} /> },
  ];

  return (
    <div className="h-full flex flex-col bg-primary overflow-y-auto custom-scrollbar">
      <TopBar title="Settings" />

      <div className="p-8 max-w-4xl mx-auto w-full">

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-surface border border-border rounded-xl p-1 mt-2 mb-6">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                activeTab === tab.id
                  ? "bg-accent text-white shadow-[0_2px_8px_rgba(108,99,255,0.35)]"
                  : "text-textSecondary hover:text-textPrimary hover:bg-white/5"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── PROFILE TAB ── */}
        {activeTab === "profile" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {loadingProfile ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-accent" />
              </div>
            ) : (
              <>
                {/* Avatar */}
                <div className="flex justify-center">
                  <AvatarSelector
                    currentInitial={profile?.name?.charAt(0).toUpperCase() || 'U'}
                    currentColor={profile?.avatarUrl || avatarBg}
                    customStyle={profile?.avatarUrl ? {} : { backgroundColor: avatarBg }}
                    onSelect={(_avatarId, bg) => {
                      setProfile(prev => prev ? ({ ...prev, avatarUrl: bg }) : prev);
                    }}
                  />
                </div>

                {/* Fields */}
                <div className="bg-surface border border-border rounded-xl p-6 space-y-5">
                  <h3 className="text-sm font-semibold text-textPrimary uppercase tracking-wider border-b border-border pb-3">Personal Info</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider font-medium text-textSecondary">Full Name</label>
                      <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-primary border border-border rounded-lg px-3 py-2.5 text-sm text-textPrimary focus:outline-none focus:border-accent transition-colors"
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider font-medium text-textSecondary">Email (read-only)</label>
                      <input
                        value={profile?.email ?? ""}
                        readOnly
                        className="w-full bg-primary/50 border border-border/50 rounded-lg px-3 py-2.5 text-sm text-textSecondary cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider font-medium text-textSecondary flex items-center gap-1.5">
                        <GraduationCap size={12} /> College / University
                      </label>
                      <input
                        value={college}
                        onChange={e => setCollege(e.target.value)}
                        className="w-full bg-primary border border-border rounded-lg px-3 py-2.5 text-sm text-textPrimary focus:outline-none focus:border-accent transition-colors"
                        placeholder="e.g. IIT Bombay"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider font-medium text-textSecondary">Graduation Year</label>
                      <input
                        type="number"
                        value={graduationYear}
                        onChange={e => setGraduationYear(e.target.value)}
                        min="2000" max="2035"
                        className="w-full bg-primary border border-border rounded-lg px-3 py-2.5 text-sm text-textPrimary focus:outline-none focus:border-accent transition-colors"
                        placeholder="e.g. 2025"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs uppercase tracking-wider font-medium text-textSecondary flex items-center gap-1.5">
                        <Linkedin size={12} /> LinkedIn URL
                      </label>
                      <input
                        value={linkedinUrl}
                        onChange={e => setLinkedinUrl(e.target.value)}
                        className="w-full bg-primary border border-border rounded-lg px-3 py-2.5 text-sm text-textPrimary focus:outline-none focus:border-accent transition-colors"
                        placeholder="https://linkedin.com/in/yourname"
                      />
                    </div>
                  </div>
                </div>

                {/* Target CTC */}
                <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-textPrimary uppercase tracking-wider border-b border-border pb-3 flex items-center gap-2">
                    <IndianRupee size={14} className="text-accent" /> Target CTC
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider font-medium text-textSecondary">Min LPA (₹)</label>
                      <input
                        type="number"
                        value={targetCtcMin}
                        onChange={e => setTargetCtcMin(e.target.value)}
                        min="0"
                        className="w-full bg-primary border border-border rounded-lg px-3 py-2.5 text-sm text-textPrimary focus:outline-none focus:border-accent transition-colors"
                        placeholder="e.g. 10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider font-medium text-textSecondary">Max LPA (₹)</label>
                      <input
                        type="number"
                        value={targetCtcMax}
                        onChange={e => setTargetCtcMax(e.target.value)}
                        min="0"
                        className="w-full bg-primary border border-border rounded-lg px-3 py-2.5 text-sm text-textPrimary focus:outline-none focus:border-accent transition-colors"
                        placeholder="e.g. 20"
                      />
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-textPrimary uppercase tracking-wider border-b border-border pb-3">Skills</h3>
                  <div
                    className="flex flex-wrap gap-2 min-h-[44px] bg-primary border border-border rounded-lg p-2 cursor-text focus-within:border-accent transition-colors"
                    onClick={() => skillInputRef.current?.focus()}
                  >
                    {skills.map(skill => (
                      <span key={skill} className="flex items-center gap-1.5 px-3 py-1 bg-accent/15 border border-accent/25 text-accent text-xs font-medium rounded-full">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="hover:text-white transition-colors">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                    <input
                      ref={skillInputRef}
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      className="bg-transparent border-none outline-none text-sm text-textPrimary placeholder:text-textSecondary/40 min-w-[120px] flex-1"
                      placeholder={skills.length === 0 ? "Type a skill and press Enter..." : "Add more..."}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SKILL_SUGGESTIONS.filter(s => !skills.includes(s)).slice(0, 6).map(s => (
                      <button
                        key={s}
                        onClick={() => addSkill(s)}
                        className="px-2.5 py-1 bg-surface border border-border rounded-full text-xs text-textSecondary hover:border-accent hover:text-accent transition-colors flex items-center gap-1"
                      >
                        <Plus size={10} /> {s}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-accent hover:bg-[#5A52E8] text-white rounded-xl font-semibold text-sm transition-all shadow-[0_0_20px_rgba(108,99,255,0.25)] disabled:opacity-70"
                >
                  {savingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>
        )}

        {/* ── NOTIFICATIONS TAB ── */}
        {activeTab === "notifications" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-surface border border-border rounded-xl divide-y divide-border overflow-hidden">
              {([
                {
                  key: "emailDigest",
                  label: "Email Digest",
                  desc: "Receive a weekly summary of your application activity",
                },
                {
                  key: "followUpReminders",
                  label: "Follow-up Reminders",
                  desc: "Nudges for applications you haven't heard back from",
                },
                {
                  key: "interviewReminders",
                  label: "Interview Reminders",
                  desc: "Day-before alerts for scheduled interviews",
                },
                {
                  key: "browserNotifications",
                  label: "Browser Notifications",
                  desc: "Push notifications in your browser (requires permission)",
                },
              ] as const).map(item => (
                <div key={item.key} className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors">
                  <div>
                    <p className="text-sm font-medium text-textPrimary">{item.label}</p>
                    <p className="text-xs text-textSecondary mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifs(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className={`relative w-12 h-6 rounded-full transition-all duration-200 shrink-0 ${
                      notifs[item.key] ? "bg-accent" : "bg-border"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
                        notifs[item.key] ? "left-7" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => toast.success("✅ Notification preferences saved")}
              className="w-full flex items-center justify-center gap-2 py-3 bg-accent hover:bg-[#5A52E8] text-white rounded-xl font-semibold text-sm transition-all shadow-[0_0_20px_rgba(108,99,255,0.25)]"
            >
              <Check size={16} /> Save Preferences
            </button>
          </div>
        )}

        {/* ── BILLING TAB ── */}
        {activeTab === "billing" && (
          <div className="space-y-6 animate-in fade-in duration-200">

            {/* Current Plan Card */}
            <div className={`rounded-2xl p-6 border ${
              (billingStatus?.plan?.toUpperCase().startsWith("PRO") || billingStatus?.plan?.toUpperCase() === "CAMPUS") && billingStatus.isActive
                ? "bg-accent/10 border-accent/30 shadow-[0_0_20px_rgba(108,99,255,0.1)]"
                : "bg-surface border-border"
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider font-medium text-textSecondary mb-1">Current Plan</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-display font-bold text-textPrimary">
                      {billingStatus?.plan?.toUpperCase() ?? "FREE"}
                    </span>
                    {billingStatus?.plan?.toUpperCase() !== "FREE" && billingStatus?.isActive && (
                      <span className="text-accent text-lg">✦</span>
                    )}
                  </div>
                  {billingStatus?.planExpiresAt && billingStatus.isActive && (
                    <p className="text-xs text-textSecondary mt-1">
                      Expires: {new Date(billingStatus.planExpiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  )}
                  {billingStatus?.plan?.toUpperCase() === "FREE" && (
                    <p className="text-xs text-textSecondary mt-1">30 application limit</p>
                  )}
                </div>
                {(billingStatus?.plan?.toUpperCase() === "FREE" || !billingStatus?.isActive) && (
                  <Link
                    to="/pricing"
                    className="flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-[#5A52E8] text-white rounded-lg text-sm font-semibold transition-all shadow-[0_0_16px_rgba(108,99,255,0.3)]"
                  >
                    <Zap size={14} /> Upgrade Plan
                  </Link>
                )}
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-textPrimary uppercase tracking-wider">Payment History</h3>
              </div>
              {(() => {
                const successfulPayments = billingStatus?.payments?.filter(p => 
                  ['SUCCESS', 'success', 'COMPLETED', 'completed'].includes(p.status)
                ) || [];

                if (successfulPayments.length === 0) {
                  return (
                    <div className="px-6 py-8 text-center">
                      <CreditCard size={28} className="text-textSecondary/30 mx-auto mb-2" />
                      <p className="text-textSecondary text-sm">No payments yet</p>
                      <Link to="/pricing" className="text-accent text-sm hover:underline mt-1 inline-block">View pricing plans →</Link>
                    </div>
                  );
                }

                return (
                  <div className="divide-y divide-border">
                    {successfulPayments.map(p => (
                      <div key={p.id} className="px-6 py-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-textPrimary">{p.plan} Plan</p>
                          <p className="text-xs text-textSecondary">{new Date(p.createdAt).toLocaleDateString("en-IN")}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-textPrimary">₹{(p.amount / 100).toFixed(0)}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-500/15 text-emerald-400">
                            SUCCESS
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <p className="text-xs text-textSecondary/60 text-center">
              Need help? Email{" "}
              <a href="mailto:support@jobrixa.app" className="text-accent hover:underline">support@jobrixa.app</a>
            </p>
          </div>
        )}

        {/* ── INTEGRATIONS TAB ── */}
        {activeTab === "integrations" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Gmail Integration Card */}
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-border flex items-center gap-4">
                <div className="w-11 h-11 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="text-red-400" size={22} />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-textPrimary">Gmail Integration</h3>
                  <p className="text-sm text-textSecondary mt-0.5">Auto-detect job emails and sync your pipeline</p>
                </div>
                {gmailStatus?.connected && (
                  <span className="flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Connected
                  </span>
                )}
              </div>

              <div className="p-6 space-y-4">
                {gmailStatus?.connected ? (
                  <>
                    <div className="flex items-center gap-2 text-sm text-textSecondary">
                      <RefreshCw size={13} className="shrink-0" />
                      Last scanned: <span className="text-textPrimary font-medium">
                        {gmailStatus.lastScanned === "Never" ? "Never" :
                          new Date(gmailStatus.lastScanned).toLocaleString("en-IN", {
                            day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                          })}
                      </span>
                    </div>

                    <button
                      onClick={scanNow}
                      disabled={scanning}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-accent hover:bg-[#5A52E8] text-white rounded-xl font-semibold text-sm transition-all shadow-[0_0_20px_rgba(108,99,255,0.2)] disabled:opacity-70"
                    >
                      {scanning
                        ? <><Loader2 size={16} className="animate-spin" /> Scanning inbox...</>
                        : <><RefreshCw size={16} /> Scan Gmail Now</>}
                    </button>

                    <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/5 border border-emerald-500/15 rounded-lg text-sm text-emerald-400/80">
                      <CheckCircle2 size={14} className="shrink-0" />
                      Jobrixa reads <strong>subject lines only</strong> — never email body content
                    </div>

                    <button
                      onClick={disconnectGmail}
                      disabled={disconnecting}
                      className="flex items-center gap-2 text-sm text-textSecondary hover:text-danger transition-colors"
                    >
                      <Unlink size={13} />
                      {disconnecting ? "Disconnecting..." : "Disconnect Gmail"}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-textSecondary leading-relaxed">
                      Connect Gmail to automatically detect application confirmations, interview invites, OA links, and rejections — and have them update your pipeline instantly.
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {[
                        { icon: "✅", text: "Application confirmations" },
                        { icon: "📋", text: "OA / Assessment links" },
                        { icon: "🗓️", text: "Interview invites" },
                        { icon: "❌", text: "Rejection emails" },
                      ].map(item => (
                        <div key={item.text} className="flex items-center gap-2 px-3 py-2 bg-primary border border-border rounded-lg text-textSecondary">
                          <span>{item.icon}</span>
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={connectGmail}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                    >
                      <Mail size={16} /> Connect Gmail
                    </button>

                    <p className="text-xs text-textSecondary/60 text-center">
                      Requires Gmail read access. We only read subject lines — not email body content.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Future integrations placeholder */}
            <div className="bg-surface/50 border border-border/50 rounded-xl p-6 opacity-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-border/30 rounded-xl" />
                <div>
                  <p className="text-sm font-medium text-textSecondary">More integrations coming soon</p>
                  <p className="text-xs text-textSecondary/60">Outlook, Notion, Slack...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ACCOUNT TAB ── */}
        {activeTab === "account" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Current Email */}
            <div className="bg-surface border border-border rounded-xl p-6 space-y-2">
              <h3 className="text-sm font-semibold text-textPrimary uppercase tracking-wider border-b border-border pb-3">Account Email</h3>
              <p className="text-textSecondary text-sm">Your account is registered with:</p>
              <p className="text-textPrimary font-medium">{profile?.email ?? "—"}</p>
            </div>

            {/* Change Password */}
            <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-textPrimary uppercase tracking-wider border-b border-border pb-3">Change Password</h3>

              {[
                { label: "Current Password", value: currentPassword, setter: setCurrentPassword },
                { label: "New Password", value: newPassword, setter: setNewPassword },
                { label: "Confirm New Password", value: confirmPassword, setter: setConfirmPassword },
              ].map(field => (
                <div key={field.label} className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-medium text-textSecondary">{field.label}</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={field.value}
                      onChange={e => field.setter(e.target.value)}
                      className="w-full bg-primary border border-border rounded-lg px-3 py-2.5 pr-10 text-sm text-textPrimary focus:outline-none focus:border-accent transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  if (!currentPassword || !newPassword || !confirmPassword) {
                    toast.error("Please fill all password fields");
                    return;
                  }
                  if (newPassword !== confirmPassword) {
                    toast.error("New passwords don't match");
                    return;
                  }
                  if (newPassword.length < 6) {
                    toast.error("Password must be at least 6 characters");
                    return;
                  }
                  toast.success("✅ Password updated");
                  setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
                }}
                className="w-full py-2.5 bg-accent hover:bg-[#5A52E8] text-white rounded-lg text-sm font-medium transition-all"
              >
                Update Password
              </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-danger/5 border border-danger/30 rounded-xl p-6 space-y-4">
              <h3 className="text-danger font-display font-bold flex items-center gap-2">
                <AlertTriangle size={16} /> Danger Zone
              </h3>
              <p className="text-sm text-textSecondary">
                This will permanently delete your account and <strong className="text-textPrimary">all your data</strong>. This cannot be undone.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-danger/50 text-danger rounded-lg text-sm font-medium hover:bg-danger hover:text-white hover:border-danger transition-all"
              >
                <Trash2 size={14} /> Delete Account
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-surface border border-danger/30 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={22} className="text-danger" />
            </div>
            <h3 className="font-display font-bold text-lg text-center text-textPrimary mb-1">Delete Account</h3>
            <p className="text-sm text-textSecondary text-center mb-4">
              Type <strong className="text-danger font-mono">DELETE</strong> to confirm permanent deletion.
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={e => setDeleteConfirmText(e.target.value)}
              className="w-full bg-primary border border-border rounded-lg px-3 py-2.5 text-sm text-textPrimary focus:outline-none focus:border-danger mb-4 font-mono text-center"
              placeholder="Type DELETE"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(""); }}
                className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={deleteConfirmText !== "DELETE"}
                onClick={() => toast.error("Account deletion is disabled in demo mode")}
                className="flex-1 py-2.5 bg-danger hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-all"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
