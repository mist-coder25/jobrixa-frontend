import { NavLink, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
      .catch(() => {});
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
      <aside className="hidden md:flex flex-col w-60 h-screen bg-[#0D1117] border-r border-[#30363D] fixed left-0 top-0">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-6"
        >
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7Z" fill="#E6EDF3" fillOpacity="0.9"/>
              <path d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7" stroke="#E6EDF3" strokeWidth="2" strokeLinecap="round"/>
              <path d="M13 13L11.5 15.5L13 14H11L12.5 11.5L11 13H13Z" fill="#0D1117"/>
            </svg>
            <h1 className="text-xl font-display font-semibold text-[#E6EDF3] tracking-wide">Jobrixa</h1>
          </div>
        </motion.div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item, i) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.35, ease: "easeOut" }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 relative ${
                    isActive
                      ? 'bg-[#1C2128] text-[#E6EDF3] font-medium'
                      : 'text-[#7D8590] hover:text-[#E6EDF3] hover:bg-[#1C2128]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active left border indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#4F8EF7] rounded-full" />
                    )}
                    <span className="relative z-10">{item.icon}</span>
                    <span className="relative z-10">{item.label}</span>
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        <div className="border-t border-border">
          <PlanBadge plan={planStatus.plan} isActive={planStatus.isActive} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="px-4 pb-4 pt-1 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-textSecondary overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${userName}`} alt="Avatar" />
                </div>
                <span className="text-sm font-medium text-textPrimary truncate max-w-[100px]">{userName}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-auto"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </motion.div>
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
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center p-2 rounded-lg transition-colors text-red-400"
        >
          <LogOut size={20} />
          <span className="text-[10px] mt-1 font-medium">Logout</span>
        </button>
      </div>
    </>
  );
}
