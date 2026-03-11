import { Search, Filter, Plus, Upload, Link2 } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
  onAddApplication?: () => void;
  onQuickAdd?: () => void;
  actionLabel?: string;
  actionIcon?: "plus" | "upload";
}

export default function TopBar({
  title,
  subtitle,
  onAddApplication,
  onQuickAdd,
  actionLabel = "Add Application",
  actionIcon = "plus",
}: TopBarProps) {
  const Icon = actionIcon === "upload" ? Upload : Plus;

  return (
    <header className="h-14 bg-[#0D1117] border-b border-[#21262D] flex items-center justify-between px-6 sticky top-0 z-40 w-full">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-base font-semibold text-[#E6EDF3]">{title}</h1>
          {subtitle && <p className="text-xs text-[#7D8590]">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search — desktop only */}
        <div className="hidden md:flex relative group">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484F58]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-52 pl-8 pr-3 py-1.5 bg-[#161B22] border border-[#30363D] rounded-md text-sm text-[#E6EDF3] placeholder:text-[#484F58] focus:outline-none focus:border-[#4F8EF7] transition-colors"
          />
        </div>

        <button className="hidden md:flex p-1.5 rounded-md border border-[#30363D] text-[#7D8590] hover:text-[#E6EDF3] hover:border-[#484F58] transition-colors bg-[#161B22]">
          <Filter size={14} />
        </button>

        {/* From URL button — shown when onQuickAdd is supplied */}
        {onQuickAdd && (
          <button
            onClick={onQuickAdd}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface border border-border rounded-lg text-sm font-medium text-textSecondary hover:text-accent hover:border-accent/50 transition-all"
            title="Quick Add from URL"
          >
            <Link2 className="w-4 h-4" />
            <span className="hidden md:inline">From URL</span>
          </button>
        )}

        {/* Primary Add Application CTA */}
        {onAddApplication && (
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-accent rounded-lg blur opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse" />
            <button
              onClick={onAddApplication}
              className="relative bg-accent hover:bg-[#5A52E8] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(108,99,255,0.4)] transition-all"
            >
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{actionLabel}</span>
            </button>
          </div>
        )}
      </div>

      {/* FAB for Mobile — primary add */}
      {onAddApplication && (
        <button
          onClick={onAddApplication}
          className="md:hidden fixed bottom-20 right-4 w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform z-50"
        >
          <Icon className="w-6 h-6" />
        </button>
      )}
    </header>
  );
}
