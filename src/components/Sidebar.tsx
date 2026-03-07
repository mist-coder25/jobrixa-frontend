import { NavLink, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { LayoutDashboard, Trello, Compass, PieChart, FileText, Settings, LogOut, Zap, Tag } from "lucide-react";
import api from "../api/axios";

interface PlanStatus {
  plan: string;
  isActive: boolean;
  planExpiresAt: string | null;
}

function PlanBadge({ plan, isActive }: { plan: string; isActive: boolean }) {
  const active = plan !== "FREE" && isActive;

  if (plan === "PRO" && active) {
    return (
      <div className="px-3 py-1.5 mt-1">
        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-accent/15 border border-accent/30 rounded-full text-accent text-xs font-bold shadow-[0_0_8px_rgba(108,99,255,0.2)]">
          <Zap size={10} /> Pro ✦
        </span>
      </div>
    );
  }
  if (plan === "CAMPUS" && active) {
    return (
      <div className="px-3 py-1.5 mt-1">
        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-500/15 border border-teal-500/25 rounded-full text-teal-400 text-xs font-bold">
          <Tag size={10} /> Campus ✦
        </span>
      </div>
    );
  }
  // FREE
  return (
    <div className="px-3 py-1.5 mt-1">
      <Link
        to="/pricing"
        className="flex items-center gap-1.5 px-2.5 py-1 bg-border/50 border border-border rounded-full text-textSecondary text-xs font-medium hover:border-accent/40 hover:text-accent transition-colors"
      >
        <Zap size={10} /> Free Plan · Upgrade →
      </Link>
    </div>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("jobrixa_user") || "User";
  const [planStatus, setPlanStatus] = useState<PlanStatus>({ plan: "FREE", isActive: false, planExpiresAt: null });

  useEffect(() => {
    api.get("/payments/status")
      .then(r => setPlanStatus(r.data as PlanStatus))
      .catch(() => {}); // silently fail — just show FREE badge
  }, []);

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Pipeline", path: "/pipeline", icon: <Trello size={20} /> },
    { label: "Discover", path: "/discover", icon: <Compass size={20} /> },
    { label: "Analytics", path: "/analytics", icon: <PieChart size={20} /> },
    { label: "Resumes", path: "/resumes", icon: <FileText size={20} /> },
    { label: "Pricing", path: "/pricing", icon: <Zap size={20} /> },
    { label: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("jobrixa_token");
    localStorage.removeItem("jobrixa_user");
    navigate("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 h-screen bg-surface border-r border-border fixed left-0 top-0">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-display font-bold text-white">J</div>
            <h1 className="text-xl font-display font-bold text-textPrimary tracking-wide">Jobrixa</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ease-out text-sm ${
                  isActive
                    ? "bg-accent/10 border border-accent/20 text-accent font-semibold shadow-[0_0_10px_rgba(108,99,255,0.1)]"
                    : item.label === "Pricing"
                      ? "text-accent/80 hover:bg-accent/5 hover:text-accent font-medium"
                      : "text-textSecondary hover:bg-secondary hover:text-textPrimary font-medium"
                }`
              }
            >
              {item.icon}
              {item.label}
              {item.label === "Pricing" && planStatus.plan === "FREE" && (
                <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 bg-accent/20 text-accent rounded-full">NEW</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border">
          <PlanBadge plan={planStatus.plan} isActive={planStatus.isActive} />
          <div className="px-4 pb-4 pt-1 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-textSecondary overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${userName}`} alt="Avatar" />
              </div>
              <span className="text-sm font-medium text-textPrimary truncate max-w-[100px]">{userName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-textSecondary hover:text-danger p-2 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-surface border-t border-border z-50 px-2 py-2 flex items-center justify-around h-16">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                isActive ? "text-accent" : "text-textSecondary"
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </>
  );
}
