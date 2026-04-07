import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Trello, Compass, PieChart, Settings, LogOut, Zap, MessageSquare } from "lucide-react";
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
  const [totalAppsCreated, setTotalAppsCreated] = useState<number | null>(null);
  const [plan, setPlan] = useState<string>(localStorage.getItem("jobrixa_plan") || "FREE");
  const [isEarlyAdopter, setIsEarlyAdopter] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("jobrixa_token");
    localStorage.removeItem("jobrixa_user");
    localStorage.removeItem("jobrixa_plan");
    navigate("/login");
  };

  const isPro = plan?.toUpperCase().startsWith('PRO') || plan?.toUpperCase() === 'CAMPUS';

  useEffect(() => {
    const token = localStorage.getItem("jobrixa_token");
    if (token) {
      api.get('/applications/missed')
        .then((r: any) => setMissedCount(r.data.missedCount))
        .catch(() => {});

        api.get('/applications/analytics')
        .then((r: any) => {
          const count = r.data.totalEverCreated ?? r.data.totalApplications ?? 0;
          setTotalAppsCreated(count);
        })
        .catch(() => {});

      api.get('/users/me')
        .then((r: any) => {
          const freshPlan = r.data.plan;
          if (freshPlan) {
            setPlan(freshPlan);
            localStorage.setItem("jobrixa_plan", freshPlan);
          }
          if (r.data.isEarlyAdopter || r.data.earlyAdopter) {
            setIsEarlyAdopter(true);
          }
        })
        .catch(() => {});
    }

    const handlePlanUpdate = () => {
      const p = localStorage.getItem("jobrixa_plan");
      if (p) setPlan(p);
    };

    window.addEventListener("planUpdated", handlePlanUpdate);
    
    // Auto-poll if on Free plan (to catch successful payments even if event fails)
    let interval: any;
    if (plan === "FREE") {
      interval = setInterval(() => {
        api.get('/users/me')
          .then((r: any) => {
            const freshPlan = r.data.plan;
            if (freshPlan && freshPlan.toUpperCase() !== "FREE") {
              setPlan(freshPlan);
              localStorage.setItem("jobrixa_plan", freshPlan);
              window.dispatchEvent(new Event("planUpdated"));
            }
          })
          .catch(() => {});
      }, 10000);
    }

    return () => {
      window.removeEventListener("planUpdated", handlePlanUpdate);
      if (interval) clearInterval(interval);
    };
  }, [plan]);

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
          
          <div className="mx-2">
            <button
               data-tally-open="YOUR_TALLY_ID"
               data-tally-layout="modal"
               className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#161B22] transition-all w-full mt-4 border border-[#30363D]"
            >
               <MessageSquare size={20} />
               <span>Send Feedback</span>
            </button>
          </div>
        </nav>

        <div className="mt-auto border-t border-[#21262D] p-3 space-y-2">
          {/* Upgrade warning at 25/30 apps — hidden for early adopters */}
          {!isPro && !isEarlyAdopter && totalAppsCreated !== null && totalAppsCreated >= 25 && (
            <div style={{
              background: '#422006',
              border: '1px solid #D29922',
              borderRadius: '6px',
              padding: '8px 10px',
              marginTop: '8px',
              fontSize: '11px',
              color: '#D29922'
            }}>
              ⚠️ {30 - totalAppsCreated} applications left. 
              <span 
                onClick={() => navigate('/pricing')}
                style={{cursor:'pointer', textDecoration:'underline', marginLeft:'4px'}}
              >
                Upgrade now
              </span>
            </div>
          )}

          {/* Upgrade banner — hidden for early adopters and pro users */}
          {!isPro && !isEarlyAdopter && (
            <div className="bg-[#4F8EF7]/10 border border-[#4F8EF7]/20 rounded-lg px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#4F8EF7] font-medium">Free Plan</span>
                <span 
                  onClick={() => navigate('/pricing')}
                  className="text-[10px] text-[#4F8EF7] cursor-pointer hover:underline font-bold uppercase tracking-wider"
                >
                  Upgrade →
                </span>
              </div>
              <div className="mt-1.5 h-1.5 bg-[#21262D] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#4F8EF7] rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(((totalAppsCreated || 0) / 30) * 100, 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-[#7D8590] mt-1.5 block">
                {totalAppsCreated ?? 0}/30 applications used
              </span>
            </div>
          )}

          {/* User Row - Enhanced for Pro */}
          <div className={`mt-2 flex items-center justify-between p-2 rounded-xl transition-colors group ${isPro ? 'bg-accent/5 border border-accent/20' : 'hover:bg-[#161B22]'}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}&backgroundColor=2ea043&fontFamily=Inter`}
                alt={userName}
                className={`w-9 h-9 rounded-full shrink-0 object-cover border-2 ${isPro ? 'border-accent shadow-[0_0_10px_rgba(108,99,255,0.3)]' : 'border-[#2ea043]'}`}
              />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-[#E6EDF3] truncate max-w-[90px]">{userName}</span>
                  {isPro && (
                    <span className="px-1.2 px-[5px] py-0.5 bg-accent text-[7px] font-black text-white rounded-[4px] shadow-[0_0_10px_rgba(108,99,255,0.4)] tracking-tighter shrink-0">
                      PRO
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#7D8590] truncate leading-none mt-0.5">
                  {isPro ? "Premium Member" : "Standard Account"}
                </span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-[#7D8590] hover:text-[#F85149] hover:bg-[#F85149]/10 transition-all opacity-0 group-hover:opacity-100 shrink-0"
              title="Logout"
            >
              <LogOut size={16} />
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
