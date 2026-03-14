import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Zap, GraduationCap, Sparkles, ArrowRight } from "lucide-react";
import { usePayment } from "../api/usePayment";

const FREE_FEATURES = [
  "Track up to 30 applications",
  "Basic Kanban pipeline",
  "Manual application add",
  "Basic analytics dashboard",
  "Activity timeline",
  "Resume library (3 max)",
];

const PRO_MONTHLY_FEATURES = [
  "Unlimited applications",
  "Full analytics & insights",
  "Activity timeline & events",
  "Follow-up reminders",
  "Priority email support",
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
  { text: "Missed & ghosted tracker", badge: "Yearly" },
  { text: "Export data to CSV", badge: "Yearly" },
  { text: "Application deadline reminders via email", badge: "Yearly" },
];

export default function Pricing() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("jobrixa_token");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const { initiatePayment } = usePayment(() => {
    setTimeout(() => navigate("/dashboard"), 1500);
  });

  const handleUpgrade = (plan: "PRO") => {
    if (!isLoggedIn) {
      navigate("/register");
      return;
    }
    initiatePayment(plan);
  };

  return (
    <div className="min-h-screen bg-primary text-textPrimary">

      {/* Nav */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 bg-primary/90 backdrop-blur-md z-30">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-display font-bold text-white">J</div>
          <span className="text-xl font-display font-bold text-textPrimary tracking-wide">Jobrixa</span>
        </Link>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <Link to="/dashboard" className="text-sm text-textSecondary hover:text-textPrimary transition-colors">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="text-sm text-textSecondary hover:text-textPrimary transition-colors">Login</Link>
              <Link to="/register" className="text-sm bg-accent hover:bg-[#5A52E8] text-white px-4 py-2 rounded-lg transition-all">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
            <Sparkles size={14} /> Simple, transparent pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-textPrimary mb-4">
            Invest in your career,<br />
            <span className="text-accent">not your spreadsheets</span>
          </h1>
          <p className="text-textSecondary text-lg max-w-2xl mx-auto">
            Start free. Upgrade when you need more. No credit card required to get started.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium ${billing === "monthly" ? "text-textPrimary" : "text-textSecondary"}`}>
            Monthly (₹149/mo)
          </span>
          <button
            onClick={() => setBilling(b => b === "monthly" ? "yearly" : "monthly")}
            className={`relative w-12 h-6 rounded-full transition-all duration-200 ${billing === "yearly" ? "bg-accent" : "bg-border"}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${billing === "yearly" ? "left-7" : "left-1"}`} />
          </button>
          <span className={`text-sm font-medium ${billing === "yearly" ? "text-textPrimary" : "text-textSecondary"}`}>
            Yearly (₹999/yr) <span className="text-emerald-400 text-xs font-bold ml-1">Save ₹789</span>
          </span>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">

          {/* Free */}
          <div className="bg-surface border border-border rounded-2xl p-8 flex flex-col h-full">
            <div className="mb-6">
              <p className="text-textSecondary text-sm font-medium uppercase tracking-wider mb-2">Free Plan</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-display font-bold text-textPrimary">₹0</span>
                <span className="text-textSecondary text-sm mb-1">forever</span>
              </div>
              <p className="text-textSecondary text-sm mt-2">Perfect for trying out Jobrixa</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-textSecondary">
                  <Check size={15} className="text-textSecondary/50 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              to={isLoggedIn ? "/dashboard" : "/register"}
              className="w-full py-3 text-center border border-border rounded-xl text-sm font-semibold text-textSecondary hover:text-textPrimary hover:border-accent/40 transition-all"
            >
              {isLoggedIn ? "Current Plan" : "Get Started Free"}
            </Link>
          </div>

          {/* Pro — Hero */}
          <div className="relative bg-accent rounded-3xl p-8 flex flex-col shadow-[0_0_60px_rgba(108,99,255,0.3)] border border-accent/50 h-full scale-105">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="px-4 py-1 bg-white text-accent text-xs font-bold rounded-full shadow-lg">
                ✦ MOST POPULAR
              </span>
            </div>

            <div className="mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <Zap size={20} className="text-white" />
              </div>
              <p className="text-white/70 text-sm font-medium uppercase tracking-wider mb-2">Pro Plan</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-display font-bold text-white">
                  ₹{billing === "monthly" ? "149" : "999"}
                </span>
                <span className="text-white/60 text-sm mb-1">
                  /{billing === "monthly" ? "month" : "year"}
                </span>
              </div>
              {billing === "yearly" ? (
                <p className="text-white/60 text-xs mt-1">Billed once annually · Save ₹789</p>
              ) : (
                <p className="text-white/70 text-sm mt-2">For serious job hunters</p>
              )}
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {billing === "monthly" ? (
                PRO_MONTHLY_FEATURES.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/90">
                    <Check size={15} className="text-white shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))
              ) : (
                PRO_YEARLY_FEATURES.map(f => (
                  <li key={f.text} className="flex items-start gap-2.5 text-sm text-white/90">
                    <Check size={15} className="text-white shrink-0 mt-0.5" />
                    <span>
                      {f.text}
                      {f.badge && (
                        <span className="ml-2 px-1.5 py-0.5 bg-emerald-400 text-[#000] text-[9px] font-black rounded uppercase">
                          {f.badge}
                        </span>
                      )}
                    </span>
                  </li>
                ))
              )}
            </ul>

            <button
              onClick={() => handleUpgrade("PRO")}
              className="w-full py-3 bg-white text-accent rounded-xl text-sm font-bold hover:bg-white/90 transition-all flex items-center justify-center gap-2"
            >
              Upgrade to Pro <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* FAQ strip */}
        <div className="mt-16 text-center">
          <p className="text-textSecondary text-sm">
            Payments secured by Razorpay. Cancel anytime. For questions, email{" "}
            <a href="mailto:support@jobrixa.app" className="text-accent hover:underline">support@jobrixa.app</a>
          </p>
        </div>
      </div>
    </div>
  );
}
