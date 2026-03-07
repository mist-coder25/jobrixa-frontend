import { Search, Filter, Plus, Upload, Link2 } from "lucide-react";

interface TopBarProps {
  title: string;
  onAddApplication?: () => void;
  onQuickAdd?: () => void;
  actionLabel?: string;
  actionIcon?: "plus" | "upload";
}

export default function TopBar({
  title,
  onAddApplication,
  onQuickAdd,
  actionLabel = "Add Application",
  actionIcon = "plus",
}: TopBarProps) {
  const Icon = actionIcon === "upload" ? Upload : Plus;

  return (
    <header className="h-16 border-b border-border bg-primary/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-display font-semibold text-textPrimary">{title}</h2>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Search — desktop only */}
        <div className="hidden md:flex relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary group-focus-within:text-accent w-4 h-4 transition-colors" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm text-textPrimary placeholder:text-textSecondary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent w-52 transition-all"
          />
        </div>

        <button className="hidden md:flex items-center justify-center p-2 rounded-lg bg-surface border border-border text-textSecondary hover:text-textPrimary hover:border-textSecondary transition-all">
          <Filter className="w-4 h-4" />
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
