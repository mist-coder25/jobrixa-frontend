import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Trello, Compass, PieChart, FileText, Settings, LogOut, Zap } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("jobrixa_user") || "User";

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
      <aside className="hidden md:flex flex-col w-56 h-screen bg-[#0D1117] border-r border-[#21262D] fixed left-0 top-0">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-2.5 px-4 py-5 border-b border-[#21262D]">
            <div className="w-7 h-7 rounded-lg bg-[#4F8EF7] flex items-center justify-center">
              <span className="text-white font-black text-sm">J</span>
            </div>
            <span className="font-bold text-[#E6EDF3] text-base tracking-tight">Jobrixa</span>
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

        <div className="mt-auto border-t border-[#21262D] p-3 space-y-2">
          {/* Upgrade banner */}
          <div className="bg-[#4F8EF7]/10 border border-[#4F8EF7]/20 rounded-lg px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#4F8EF7] font-medium">Free Plan</span>
              <span className="text-xs text-[#4F8EF7] cursor-pointer hover:underline">Upgrade →</span>
            </div>
            <div className="mt-1 h-1 bg-[#21262D] rounded-full">
              <div className="h-1 bg-[#4F8EF7] rounded-full w-1/5" />
            </div>
            <span className="text-[10px] text-[#7D8590] mt-0.5 block">4/30 applications used</span>
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
