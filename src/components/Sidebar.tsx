import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Trello, Compass, PieChart, Settings, LogOut, Zap, MessageSquare } from "lucide-react";
import api from "../api/axios";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
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
      <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-[#d0d7de] fixed left-0 top-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1a7f37] flex items-center justify-center shadow-lg shadow-[#1a7f37]/20">
            <span className="text-white font-black text-sm">J</span>
          </div>
          <span className="font-bold text-[#1c2128] text-lg tracking-tight">Jobrixa</span>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? "bg-[#f6f8fa] text-[#1c2128] font-semibold"
                    : "text-[#57606a] hover:bg-[#f6f8fa] hover:text-[#1c2128]"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-[#1a7f37] rounded-r-full" />
                )}
                <span className={`transition-colors duration-200 ${
                  isActive ? "text-[#1a7f37]" : "text-[#57606a] group-hover:text-[#1c2128]"
                }`}>
                  {item.icon}
                </span>
                <span className="text-sm">{item.label}</span>
                {item.label === "Analytics" && missedCount > 0 && (
                  <span className="ml-auto text-[10px] bg-[#cf222e] text-white px-1.5 py-0.5 rounded-full font-bold">
                    {missedCount}
                  </span>
                )}
              </NavLink>
            );
          })}
          
          <div className="px-4 mt-4">
            <button
               data-tally-open="YOUR_TALLY_ID"
               data-tally-layout="modal"
               className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#57606a] hover:bg-[#f6f8fa] hover:text-[#1c2128] transition-all w-full border border-[#d0d7de]"
            >
               <MessageSquare size={20} />
               <span>Send Feedback</span>
            </button>
          </div>
        </div>

        {!isPro && !isEarlyAdopter && (
          <div className="px-4 mb-6">
            <div className="bg-gradient-to-br from-[#f6f8fa] to-[#eaeef2] rounded-2xl p-4 border border-[#d0d7de] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-3 shadow-sm">
                <Zap size={20} className="text-[#9a6700]" />
              </div>
              <h4 className="text-sm font-bold text-[#1c2128] mb-1">Upgrade to Pro</h4>
              <p className="text-xs text-[#57606a] mb-4">{totalAppsCreated ?? 0}/30 apps used</p>
              <button 
                onClick={() => navigate('/pricing')}
                className="w-full py-2 bg-[#1a7f37] hover:bg-[#2da44e] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-[#d0d7de]">
          <div className="flex items-center justify-between px-2 py-2 group">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}&backgroundColor=1a7f37&fontFamily=Inter`}
                alt={userName}
                className={`w-9 h-9 rounded-full shrink-0 object-cover border-2 ${isPro ? 'border-[#0969da]' : 'border-[#d0d7de]'}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1c2128] truncate">{userName}</p>
                <p className="text-[10px] text-[#57606a] uppercase tracking-wider">{isPro ? 'Pro Member' : 'Early Adopter'}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-[#57606a] hover:text-[#cf222e] hover:bg-[#cf222e]/10 transition-all opacity-0 group-hover:opacity-100 shrink-0"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar — Light Mode */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-[#d0d7de] z-50 px-4 py-3 pb-safe-area flex items-center justify-between h-[max(64px,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        {navItems.filter(item => ["Dashboard", "Pipeline", "Analytics", "Settings"].includes(item.label)).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 transition-all ${
                isActive ? "text-[#0969da] scale-110" : "text-[#57606a]"
              }`
            }
          >
            {item.icon}
            <span className="text-[9px] mt-1.5 font-bold uppercase tracking-wider">{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center flex-1 text-[#cf222e] hover:opacity-80 transition-all font-bold"
        >
          <LogOut size={20} />
          <span className="text-[9px] mt-1.5 uppercase tracking-wider">Logout</span>
        </button>
      </div>
    </>
  );
}
