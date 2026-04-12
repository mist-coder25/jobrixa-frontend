import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Trello, Compass, PieChart, Settings, LogOut, Zap, MessageSquare } from "lucide-react";
import api from "../api/axios";
import Avatar from "./Avatar";
import FeedbackModal from "./FeedbackModal";

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
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

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
    
    return () => {
      window.removeEventListener("planUpdated", handlePlanUpdate);
    };
  }, [plan]);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-[#0A0E27] border-r border-[#1E293B] fixed left-0 top-0 z-50">
        <div className="flex items-center gap-3 px-6 py-8">
            <div className="w-8 h-8 rounded-lg bg-[#5B9FFF] flex items-center justify-center shadow-lg shadow-[#5B9FFF]/20 text-white">
                <span className="font-black text-base">J</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Jobrixa</span>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-4">
          <div className="px-3 pb-2">
            <span className="text-[10px] font-bold text-[#718096] uppercase tracking-[0.2em]">
              Menu
            </span>
          </div>
          
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-[#5B9FFF]/10 text-[#5B9FFF] font-bold'
                    : 'text-[#A0AEC0] hover:text-white hover:bg-[#0F1419]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`${isActive ? 'text-[#5B9FFF]' : 'text-[#718096] group-hover:text-[#A0AEC0]'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div 
                        layoutId="active-pill"
                        className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[#5B9FFF]"
                    />
                  )}
                  {item.label === "Analytics" && missedCount > 0 && (
                    <span className="ml-auto text-[10px] bg-[#FF4757] text-white px-1.5 py-0.5 rounded-full font-bold">
                      {missedCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
          
          <div className="pt-6">
            <button
               onClick={() => setIsFeedbackOpen(true)}
               className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#A0AEC0] hover:text-white hover:bg-[#0F1419] transition-all w-full border border-[#1E293B] border-dashed"
            >
               <MessageSquare size={20} className="text-[#718096]" />
               <span>Feedback</span>
            </button>
          </div>
        </nav>

        <div className="p-4 space-y-4">
          {/* Upgrade Section */}
          {!isPro && !isEarlyAdopter && (
            <div className="bg-[#0F1419] border border-[#1E293B] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-[#718096] uppercase tracking-widest">Plan: Free</span>
                <button onClick={() => navigate('/pricing')} className="text-[10px] font-bold text-[#5B9FFF] hover:underline uppercase">Upgrade</button>
              </div>
              <div className="h-1.5 bg-[#0A0E27] rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-[#5B9FFF] rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(((totalAppsCreated || 0) / 30) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-[#A0AEC0]">
                {totalAppsCreated ?? 0}/30 applications used
              </p>
            </div>
          )}

          {/* User Section */}
          <div className="flex items-center gap-3 p-2 bg-[#0F1419] border border-[#1E293B] rounded-2xl">
            <Avatar name={userName} size="medium" />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-white truncate">{userName}</p>
                    {isPro && <Zap size={10} className="text-[#5B9FFF] fill-[#5B9FFF]" />}
                </div>
                <p className="text-[10px] text-[#A0AEC0] truncate">{isPro ? 'Pro Member' : 'Free Plan'}</p>
            </div>
            <button 
                onClick={handleLogout}
                className="p-2 text-[#718096] hover:text-[#FF4757] hover:bg-[#FF4757]/10 rounded-lg transition-colors"
                title="Logout"
            >
                <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0A0E27]/95 backdrop-blur-xl border-t border-[#1E293B] z-50 px-4 py-3 pb-safe-area flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {navItems.filter(item => ["Dashboard", "Pipeline", "Analytics", "Settings"].map(l => l.toLowerCase()).includes(item.label.toLowerCase())).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 transition-all ${
                isActive ? "text-[#5B9FFF]" : "text-[#718096]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? "scale-110" : ""}>{item.icon}</span>
                <span className="text-[9px] mt-1 font-bold uppercase tracking-widest">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
        <button
          onClick={() => setIsFeedbackOpen(true)}
          className="flex flex-col items-center justify-center flex-1 text-[#718096] transition-all"
        >
          <MessageSquare size={20} />
          <span className="text-[9px] mt-1 font-bold uppercase tracking-widest">Feed</span>
        </button>
      </div>

      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
        _page={location.pathname}
      />
    </>
  );
}
