import { Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";

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
  const navigate = useNavigate();
  const userName = localStorage.getItem("jobrixa_user") || "User";

  return (
    <header className="h-16 bg-[var(--bg-main)] border-b border-[var(--border)] flex items-center justify-between px-6 md:px-8 sticky top-0 z-40 w-full">
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-white leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-[var(--text-tertiary)] font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        {showSearch && (
          <div className="hidden lg:flex relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-sm text-white placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary)] transition-all"
            />
          </div>
        )}

        {/* Filter */}
        {onFilterClick && (
          <button 
            onClick={onFilterClick}
            className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-white transition-all relative"
          >
            <Filter size={18} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--primary)] rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
            {children}
        </div>

        {/* User */}
        <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-[var(--border)] ml-2 invisible lg:visible">
            <div 
                onClick={() => navigate('/settings')}
                className="cursor-pointer hover:scale-105 transition-transform"
            >
                <Avatar 
                    name={userName} 
                    size="small" 
                    backgroundColor="#5B9FFF"
                />
            </div>
        </div>
      </div>
    </header>
  );
}
