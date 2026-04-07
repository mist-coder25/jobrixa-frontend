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
    <header className="h-16 bg-[#ffffff]/80 backdrop-blur-md border-b border-[#f6f8fa] flex items-center justify-between px-8 sticky top-0 z-40 w-full transition-all shadow-sm">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-base font-semibold text-[#1c2128]">{title}</h1>
          {subtitle && <p className="text-xs text-[#57606a]">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search — only if showSearch=true */}
        {showSearch && (
          <div className="hidden md:flex relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c959f]" />
            <input
              type="text"
              placeholder="Search..."
              className="w-52 pl-8 pr-3 py-1.5 bg-[#ffffff] border border-[#d0d7de] rounded-md text-sm text-[#1c2128] placeholder:text-[#8c959f] focus:outline-none focus:border-[#4F8EF7] transition-colors shadow-sm"
            />
          </div>
        )}

        {/* Filter — only if onFilterClick provided */}
        {onFilterClick && (
          <div className="relative">
            <button 
              onClick={onFilterClick}
              className="group flex p-1.5 rounded-md border border-[#d0d7de] text-[#57606a] hover:text-[#1c2128] bg-[#ffffff] transition-all relative"
            >
              <Filter size={14} className="group-hover:rotate-12 transition-transform" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#4F8EF7] rounded-full text-[#f6f8fa] text-[9px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Page-specific action buttons */}
        {children}

        {/* User Avatar */}
        <div className="hidden md:flex items-center gap-4 ml-2 pl-4 border-l border-[#f6f8fa]">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(localStorage.getItem("jobrixa_user") || "User")}&backgroundColor=2ea043&fontFamily=Inter`}
            alt="User"
            className="w-8 h-8 rounded-full border border-[#1a7f37] shadow-sm shadow-[#1a7f37]/20"
          />
        </div>
      </div>
    </header>
  );
}
