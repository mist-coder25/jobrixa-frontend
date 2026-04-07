import { Search, Filter } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  onFilterClick?: () => void;
  activeFilterCount?: number;
  children?: React.ReactNode;
}

export default function TopBar({
  title,
  subtitle,
  showSearch = false,
  onFilterClick,
  activeFilterCount = 0,
  children
}: TopBarProps) {
  return (
    <header className="h-16 bg-[#0d1117]/80 backdrop-blur-md border-b border-[#161B22] flex items-center justify-between px-8 sticky top-0 z-40 w-full transition-all ">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-base font-semibold text-[#C9D1D9]">{title}</h1>
          {subtitle && <p className="text-xs text-[#8B949E]">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search — only if showSearch=true */}
        {showSearch && (
          <div className="hidden md:flex relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484F58]" />
            <input
              type="text"
              placeholder="Search..."
              className="w-52 pl-8 pr-3 py-1.5 bg-[#0d1117] border border-[#30363D] rounded-md text-sm text-[#C9D1D9] placeholder:text-[#484F58] focus:outline-none focus:border-[#58a6ff] transition-colors "
            />
          </div>
        )}

        {/* Filter — only if onFilterClick provided */}
        {onFilterClick && (
          <div className="relative">
            <button 
              onClick={onFilterClick}
              className="group flex p-1.5 rounded-md border border-[#30363D] text-[#8B949E] hover:text-[#C9D1D9] bg-[#0d1117] transition-all relative"
            >
              <Filter size={14} className="group-hover:rotate-12 transition-transform" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#58a6ff] rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Page-specific action buttons */}
        {children}

        {/* User Avatar */}
        <div className="hidden md:flex items-center gap-4 ml-2 pl-4 border-l border-[#161B22]">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(localStorage.getItem("jobrixa_user") || "User")}&backgroundColor=4F8EF7&fontFamily=Inter`}
            alt="User"
            className="w-8 h-8 rounded-full border border-[#58a6ff]  /20"
          />
        </div>
      </div>
    </header>
  );
}
