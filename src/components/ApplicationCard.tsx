import { formatDistanceToNow, parseISO, isValid } from "date-fns";
import CompanyLogo from "./CompanyLogo";
import { MapPin, Calendar, ExternalLink } from "lucide-react";

export interface JobApplication {
  id: string;
  companyName: string;
  companyDomain?: string;
  jobTitle: string;
  status: string;
  jobUrl?: string;
  source?: string;
  priority?: string;
  salaryMin?: number;
  salaryMax?: number;
  appliedAt?: string;
  location?: string;
  isRemote?: boolean;
  tags?: string[] | string;
  jobDescription?: string;
  notes?: string;
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApplicationCardProps {
  app: JobApplication;
  onClick: () => void;
  innerRef: React.Ref<HTMLDivElement>;
  draggableProps: any;
  dragHandleProps: any;
  isDragging: boolean;
}

export default function ApplicationCard({ app, onClick, innerRef, draggableProps, dragHandleProps, isDragging }: ApplicationCardProps) {
  const dateStr = app.appliedAt || app.createdAt;
  const daysAppliedText = dateStr && isValid(parseISO(dateStr))
    ? formatDistanceToNow(parseISO(dateStr), { addSuffix: true }) 
    : "Recently";

  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      onClick={onClick}
      className={`mx-3 mb-3 bg-[var(--bg-card)] border-[var(--border)] rounded-xl p-4 cursor-pointer transition-all duration-200 group active:scale-[0.98] ${
        isDragging 
            ? "border-[var(--primary)] shadow-2xl scale-[1.05] z-50 bg-[var(--bg-main)]" 
            : "border hover:border-[var(--text-tertiary)] hover:bg-[var(--bg-main)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <CompanyLogo 
            companyName={app.companyName} 
            domain={app.companyDomain} 
            size={36} 
            className="rounded-lg ring-1 ring-white/10"
          />
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white truncate">{app.companyName}</h4>
            <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-tertiary)] font-medium">
                <Calendar size={10} />
                <span>{daysAppliedText}</span>
            </div>
          </div>
        </div>
        
        {app.jobUrl && (
            <a 
                href={app.jobUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
                title="View Job"
            >
                <ExternalLink size={14} />
            </a>
        )}
      </div>

      <p className="text-xs font-semibold text-[var(--text-secondary)] mb-4 leading-relaxed line-clamp-2">
        {app.jobTitle}
      </p>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border)]/50">
        <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[var(--bg-main)] text-[var(--text-tertiary)] border border-[var(--border)] uppercase tracking-wide">
                {app.source || "Direct"}
            </span>
            {app.isRemote && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/20 uppercase tracking-wide">
                    Remote
                </span>
            )}
        </div>
        
        {app.location && (
            <div className="flex items-center gap-1 text-[9px] text-[var(--text-tertiary)] font-bold truncate max-w-[80px]">
                <MapPin size={9} />
                <span className="truncate">{app.location}</span>
            </div>
        )}
      </div>
    </div>
  );
}
