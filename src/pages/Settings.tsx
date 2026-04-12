import { useState, useEffect } from "react";
import {
  User, Bell, Shield, Zap, CreditCard, Mail
} from "lucide-react";
import TopBar from "../components/TopBar";
import api from "../api/axios";
import { toast } from "../components/Toast";
import Avatar from "../components/Avatar";
import { motion, AnimatePresence } from "framer-motion";

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

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const [_gmailStatus, _setGmailStatus] = useState<{ connected: boolean; lastScanned: string } | null>(null);
  const [_scanning, _setScanning] = useState(false);
  
  const [_profile, setProfile] = useState<UserProfile | null>(null);
  const [_loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  
  const [billingStatus, setBillingStatus] = useState<any>(null);

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
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
    api.get("/payments/status")
      .then(r => setBillingStatus(r.data))
      .catch(() => {});
  }, []);

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile",      label: "Profile",       icon: <User size={18} /> },
    { id: "account",      label: "Account",        icon: <Shield size={18} /> },
    { id: "billing",      label: "Subscription",   icon: <CreditCard size={18} /> },
    { id: "notifications",label: "Notifications",  icon: <Bell size={18} /> },
    { id: "integrations", label: "Integrations",   icon: <Mail size={18} /> },
  ];

  const handleSave = async () => {
    setSavingProfile(true);
    try {
      await api.put("/users/me", { name, college, graduationYear: Number(graduationYear), linkedinUrl });
      localStorage.setItem("jobrixa_user", name);
      toast.success("Settings saved!");
    } catch { toast.error("Failed to save"); }
    finally { setSavingProfile(false); }
  };

  return (
    <div className="h-full flex flex-col">
      <TopBar title="Settings" subtitle="Manage your account & preferences" />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-64 border-r border-[var(--border)] bg-[var(--bg-main)] p-6 hidden md:block">
            <h3 className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em] mb-6">Settings</h3>
            <nav className="space-y-1">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all relative ${
                            activeTab === tab.id 
                                ? "text-white bg-[var(--primary)]/10" 
                                : "text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-card)]"
                        }`}
                    >
                        {activeTab === tab.id && <motion.div layoutId="tab-pill" className="absolute left-0 w-1 h-6 bg-[var(--primary)] rounded-full" />}
                        <span className={activeTab === tab.id ? "text-[var(--primary)]" : ""}>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar bg-[var(--bg-card)]/30">
            <div className="max-w-2xl mx-auto space-y-12 pb-20">
                
                <header>
                    <h1 className="text-3xl font-bold mb-2 capitalize">{activeTab} Settings</h1>
                    <p className="text-[var(--text-secondary)]">Manage your {activeTab} information and preferences.</p>
                </header>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'profile' && (
                            <div className="space-y-8">
                                <section>
                                    <div className="flex items-center gap-8 mb-12">
                                        <Avatar name={name} size="large" />
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">Profile Photo</h3>
                                            <p className="text-sm text-[var(--text-tertiary)] mb-4">Updating your photo helps recruiters recognize you.</p>
                                            <div className="flex gap-3">
                                                <button className="btn-primary py-2 px-4 text-xs shadow-none">Upload New</button>
                                                <button className="btn-outline py-2 px-4 text-xs">Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Full Name</label>
                                            <input 
                                                value={name} onChange={e => setName(e.target.value)}
                                                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none transition-all" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Email Address</label>
                                            <input 
                                                readOnly value={_profile?.email || ""}
                                                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm opacity-50 cursor-not-allowed" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">College Name</label>
                                            <input 
                                                value={college} onChange={e => setCollege(e.target.value)}
                                                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Graduation Year</label>
                                            <input 
                                                value={graduationYear} onChange={e => setGraduationYear(e.target.value)}
                                                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none" 
                                            />
                                        </div>
                                    </div>
                                </section>
                                <button onClick={handleSave} className="btn-primary w-full py-4 shadow-xl shadow-[var(--primary)]/10" disabled={savingProfile}>
                                    {savingProfile ? "Saving..." : "Save Profile Details"}
                                </button>
                            </div>
                        )}

                        {activeTab === 'billing' && (
                            <div className="space-y-8">
                                <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] rounded-3xl p-8 text-white relative overflow-hidden">
                                     <Zap size={140} className="absolute -right-10 -bottom-10 opacity-10" />
                                     <div className="relative z-10">
                                         <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">Current Subscription</p>
                                         <h3 className="text-3xl font-black mb-4">{billingStatus?.plan?.toUpperCase() || "FREE"} PLAN</h3>
                                         <div className="flex items-center gap-2 mb-8">
                                             <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold">ACTIVE</div>
                                             {billingStatus?.planExpiresAt && <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Renews on {new Date(billingStatus.planExpiresAt).toLocaleDateString()}</p>}
                                         </div>
                                         <button className="px-6 py-3 bg-white text-[var(--primary)] rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg">Manage Subscription</button>
                                     </div>
                                </div>
                                
                                <section>
                                    <h3 className="text-sm font-bold mb-4 uppercase tracking-widest border-b border-[var(--border)] pb-4">Payment Methods</h3>
                                    <div className="flex items-center justify-between p-4 bg-[var(--bg-main)] border border-[var(--border)] rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-8 bg-gray-600 rounded-md flex items-center justify-center font-bold text-[8px] text-white">VISA</div>
                                            <div>
                                                <p className="text-sm font-medium">Visa ending in 4242</p>
                                                <p className="text-xs text-[var(--text-tertiary)]">Expires 12/26</p>
                                            </div>
                                        </div>
                                        <button className="text-xs font-bold text-[var(--primary)] hover:underline">Edit</button>
                                    </div>
                                </section>
                            </div>
                        )}
                        
                        {(activeTab === 'account' || activeTab === 'notifications' || activeTab === 'integrations') && (
                            <div className="py-20 flex flex-col items-center justify-center text-center opacity-50 grayscale">
                                <div className="w-20 h-20 rounded-full bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center mb-6">
                                    {TABS.find(t => t.id === activeTab)?.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{TABS.find(t => t.id === activeTab)?.label} in Maintenance</h3>
                                <p className="text-sm max-w-xs">We're currently updating this section to match our new design system. Please check back soon.</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </main>
      </div>
    </div>
  );
}
