import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Zap, Sparkles, ShieldCheck } from "lucide-react";
import { usePayment } from "../api/usePayment";
import { trackEvent } from "../utils/analytics";

const FREE_FEATURES = [
  "Track up to 30 applications",
  "Basic Kanban pipeline",
  "Manual application add",
  "Basic analytics dashboard",
  "Activity timeline",
  "Resume library (3 max)",
];

const PRO_YEARLY_FEATURES = [
  { text: "Unlimited applications", badge: null },
  { text: "Full analytics & insights", badge: null },
  { text: "Activity timeline & events", badge: null },
  { text: "Follow-up reminders", badge: null },
  { text: "Priority email support", badge: null },
  { text: "All resume versions", badge: null },
  { text: "Trust score on job listings", badge: null },
  { text: "Early access to new features", badge: null },
  { text: "Missed & ghosted tracker", badge: "YEARLY" },
  { text: "Export data to CSV", badge: "YEARLY" },
  { text: "Application deadline reminders via email", badge: "YEARLY" },
];

export default function Pricing() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("jobrixa_token");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const { initiatePayment } = usePayment(() => {
    setTimeout(() => navigate("/dashboard"), 1500);
  });

  const handleUpgrade = () => {
    if (!isLoggedIn) {
      navigate(`/login?returnUrl=/pricing`);
      return;
    }
    const amount = billing === "monthly" ? 14900 : 99900;
    const planType = billing === "monthly" ? "PRO_MONTHLY" : "PRO_YEARLY";
    trackEvent('upgrade_clicked', { plan: planType });
    initiatePayment(planType, amount);
  };

  const proPrice = billing === "monthly" ? 149 : 999;
  const proSuffix = billing === "monthly" ? "/month" : "/year";

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-white flex flex-col">

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-[var(--bg-main)]/80 backdrop-blur-md border-b border-[var(--border)] h-16">
        <div className="container-custom h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center font-bold text-white shadow-lg shadow-[var(--primary)]/20">J</div>
            <span className="text-xl font-bold tracking-tight">Jobrixa</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors">Home</Link>
            {isLoggedIn ? (
              <Link to="/dashboard" className="btn-primary text-xs py-2 px-4 shadow-none">Go to Dashboard</Link>
            ) : (
              <Link to="/login" className="btn-outline text-xs py-2 px-4">Sign In</Link>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 container-custom py-16 md:py-24">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] text-xs font-bold uppercase tracking-[0.15em] mb-6"
          >
            <Sparkles size={12} /> Simple, transparent pricing
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Invest in your career,<br />
            <span className="text-[var(--primary)]">not your spreadsheets</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Start free. Upgrade when you need more. No credit card required to get started.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-5 mb-16">
          <span className={`text-sm font-bold uppercase tracking-widest ${billing === "monthly" ? "text-white" : "text-[var(--text-tertiary)]"}`}>Monthly</span>
          <button
            onClick={() => setBilling(b => b === "monthly" ? "yearly" : "monthly")}
            className="w-14 h-8 rounded-full bg-[var(--bg-card)] border border-[var(--border)] relative p-1 transition-all"
          >
            <div className={`w-5 h-5 rounded-full bg-[var(--primary)] shadow-lg shadow-[var(--primary)]/40 transition-all ${billing === "yearly" ? "translate-x-7" : "translate-x-0"}`} />
          </button>
          <div className="flex flex-col">
            <span className={`text-sm font-bold uppercase tracking-widest ${billing === "yearly" ? "text-white" : "text-[var(--text-tertiary)]"}`}>Yearly</span>
            <span className="text-[10px] text-[var(--accent-green)] font-black uppercase tracking-tighter">Save ₹789</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* Free Plan */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-8 md:p-10 flex flex-col hover:border-[var(--text-tertiary)] transition-colors">
            <div className="mb-10">
              <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em] mb-4 block">Free Plan</span>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-bold">₹0</span>
                <span className="text-[var(--text-tertiary)] font-medium underline decoration-[var(--border)] underline-offset-4">forever</span>
              </div>
              <p className="text-[var(--text-secondary)] text-sm font-medium italic">"Perfect for trying out Jobrixa"</p>
            </div>

            <div className="space-y-4 mb-12 flex-1">
              {FREE_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[var(--bg-main)] border border-[var(--border)] flex items-center justify-center shrink-0">
                    <Check size={12} className="text-[var(--text-tertiary)]" />
                  </div>
                  <span className="text-sm font-medium text-[var(--text-secondary)]">{f}</span>
                </div>
              ))}
            </div>

            <button
                disabled
                className="w-full py-4 rounded-xl border border-[var(--border)] text-[var(--text-tertiary)] font-bold uppercase tracking-widest text-xs cursor-default"
            >
                Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-[var(--primary)]/90 to-[var(--primary-hover)] rounded-3xl p-8 md:p-10 flex flex-col relative overflow-hidden shadow-2xl shadow-[var(--primary)]/20 text-white">
            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                <Zap size={200} fill="white" />
            </div>
            
            <div className="mb-10 relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-white/90 uppercase tracking-[0.2em]">Pro Plan</span>
                    <span className="bg-white/20 backdrop-blur-sm text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">MOST POPULAR</span>
                </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-black">₹{proPrice}</span>
                <span className="text-white/70 font-bold uppercase tracking-widest text-xs">{proSuffix}</span>
              </div>
              {billing === "yearly" && (
                <p className="text-white/90 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <Zap size={10} fill="white" /> Billed once annually - Save ₹789
                </p>
              )}
              <p className="text-white font-medium mt-3 italic underline decoration-white/20 underline-offset-4 font-serif">"For serious job hunters"</p>
            </div>

            <div className="space-y-4 mb-12 flex-1 relative z-10">
              {PRO_YEARLY_FEATURES.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold leading-tight">{f.text}</span>
                    {f.badge && <span className="text-[8px] font-black bg-white text-[var(--primary)] px-1.5 py-0.5 rounded-sm mt-1 w-fit tracking-tighter">{f.badge}</span>}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleUpgrade}
              className="w-full py-5 bg-white text-[var(--primary)] rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>

        {/* Trust Footer */}
        <div className="mt-24 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-[var(--text-tertiary)] font-bold text-xs uppercase tracking-widest">
                <ShieldCheck size={16} />
                Payments secured by Razorpay
            </div>
            <p className="text-[var(--text-secondary)] text-sm max-w-sm mx-auto leading-relaxed italic">
                Cancel anytime. No hidden fees. For student queries, email <a href="mailto:support@jobrixa.app" className="text-[var(--primary)] hover:underline">support@jobrixa.app</a>
            </p>
        </div>
      </div>
    </div>
  );
}
