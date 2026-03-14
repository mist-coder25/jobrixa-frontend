import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Trello, Compass, PieChart, Settings, LogOut, Zap } from "lucide-react";
import api from "../api/axios";

export default function Sidebar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("jobrixa_user") || "User";

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Pipeline", path: "/pipeline", icon: <Trello size={20} /> },
    { label: "Discover", path: "/discover", icon: <Compass size={20} /> },
    { label: "Analytics", path: "/analytics", icon: <PieChart size={20} /> },
    { label: "Pricing", path: "/pricing", icon: <Zap size={20} /> },
    { label: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  const [missedCount, setMissedCount] = useState(0);
  const [appCount, setAppCount] = useState<number | null>(null);
  const [plan, setPlan] = useState<string>(localStorage.getItem("jobrixa_plan") || "FREE");

  useEffect(() => {
    const token = localStorage.getItem("jobrixa_token");
    if (token) {
      api.get('/applications/missed')
        .then((r: any) => setMissedCount(r.data.missedCount))
        .catch(() => {});

      api.get('/applications/analytics')
        .then((r: any) => {
          const count = r.data.totalEverCreated ?? r.data.totalApplications ?? 0;
          setAppCount(count);
        })
        .catch(() => {});

      api.get('/users/me')
        .then((r: any) => {
          const freshPlan = r.data.plan || "FREE";
          setPlan(freshPlan);
          localStorage.setItem("jobrixa_plan", freshPlan);
        })
        .catch(() => {});
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jobrixa_token");
    localStorage.removeItem("jobrixa_user");
    navigate("/login");
  };

  const isPro = plan?.toUpperCase() === 'PRO';

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 h-screen bg-[#0D1117] border-r border-[#21262D] fixed left-0 top-0">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 px-6 py-6 border-b border-[#21262D]">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-[#4F8EF7] to-[#A371F7] rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000" />
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-[#4F8EF7] to-[#3B7DE8] flex items-center justify-center shadow-lg shadow-[#4F8EF7]/20">
                <span className="text-white font-black text-base tracking-tighter">J</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-[#E6EDF3] text-lg tracking-tight leading-none">Jobrixa</span>
            </div>
          </div>
        </motion.div>

        <div className="px-3 pt-4 pb-1">
          <span className="text-[10px] font-semibold text-[#484F58] uppercase tracking-widest">
            Navigation
          </span>
        </div>

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
                  `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm mx-2 transition-all relative ${
                    isActive
                      ? 'bg-[#1C2128] text-[#E6EDF3] font-medium'
                      : 'text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#161B22]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#4F8EF7] rounded-full" />
                    )}
                    <span className="relative z-10">{item.icon}</span>
                    <span className="relative z-10">{item.label}</span>
                    {item.label === "Analytics" && missedCount > 0 && (
                      <span className="ml-auto text-[10px] bg-[#F85149] text-white px-1.5 py-0.5 rounded-full font-bold relative z-10">
                        {missedCount}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        <div className="mt-auto border-t border-[#21262D] p-3 space-y-2">
          {/* Upgrade banner */}
          <div className={`${isPro ? "bg-[#3FB950]/10 border-[#3FB950]/20" : "bg-[#4F8EF7]/10 border-[#4F8EF7]/20"} border rounded-lg px-3 py-2`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${isPro ? "text-[#3FB950]" : "text-[#4F8EF7]"} font-medium`}>
                {isPro ? "Pro Plan" : "Free Plan"}
              </span>
              {!isPro && (
                <span 
                  onClick={() => navigate('/pricing')}
                  className="text-[10px] text-[#4F8EF7] cursor-pointer hover:underline font-bold uppercase tracking-wider"
                >
                  Upgrade →
                </span>
              )}
            </div>
            <div className="mt-1 h-1 bg-[#21262D] rounded-full overflow-hidden">
              <div 
                className={`h-1 ${isPro ? "bg-[#3FB950]" : "bg-[#4F8EF7]"} rounded-full transition-all duration-1000`} 
                style={{ width: isPro ? "100%" : `${Math.min(((appCount || 0) / 30) * 100, 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-[#7D8590] mt-0.5 block">
              {isPro ? "Unlimited applications" : `${appCount ?? 0}/30 applications used`}
            </span>
          </div>
          {/* User row */}
          <div className="flex items-center gap-2 px-1">
            <div className="w-7 h-7 rounded-full bg-[#4F8EF7] flex items-center justify-center text-xs font-bold text-white">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-[#C9D1D9] flex-1 truncate">{userName}</span>
            <button onClick={handleLogout} className="text-[#7D8590] hover:text-[#F85149] transition-colors">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0D1117]/95 backdrop-blur-xl border-t border-[#21262D] z-50 px-4 py-3 pb-safe-area flex items-center justify-between h-[max(72px,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {navItems.filter(item => ["Dashboard", "Pipeline", "Analytics", "Settings"].includes(item.label)).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 transition-all ${
                isActive ? "text-[#4F8EF7] scale-110" : "text-[#7D8590]"
              }`
            }
          >
            {item.icon}
            <span className="text-[9px] mt-1.5 font-bold uppercase tracking-wider">{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center flex-1 text-[#F85149] hover:opacity-80 transition-all font-bold"
        >
          <LogOut size={20} />
          <span className="text-[9px] mt-1.5 uppercase tracking-wider">Logout</span>
        </button>
      </div>
    </>
  );
}
