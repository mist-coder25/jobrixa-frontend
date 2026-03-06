import { formatDistanceToNow, parseISO } from "date-fns";
import { useState } from "react";

export interface JobApplication {
  id: string;
  companyName: string;
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

const PRIORITY_COLORS: Record<string, string> = {
  DREAM: "bg-danger",
  HIGH: "bg-warning",
  MEDIUM: "bg-[#00D4AA]",
  LOW: "bg-textSecondary"
};

const SOURCE_COLORS: Record<string, string> = {
  LINKEDIN: "bg-[#0A66C2]/20 text-[#0A66C2]",
  Wellfound: "bg-[#FF4F40]/20 text-[#FF4F40]",
  Naukri: "bg-[#183EA3]/20 text-[#183EA3]",
  Referral: "bg-accent/20 text-accent",
  Campus: "bg-warning/20 text-warning"
};

export default function ApplicationCard({ app, onClick, innerRef, draggableProps, dragHandleProps, isDragging }: ApplicationCardProps) {
  const [logoError, setLogoError] = useState(false);
  
  // Clearbit URL
  const domain = app.companyName.split(" ")[0].toLowerCase();
  const logoUrl = `https://logo.clearbit.com/${domain}.com`;

  const priorityColor = PRIORITY_COLORS[app.priority?.toUpperCase() || "MEDIUM"] || PRIORITY_COLORS.MEDIUM;
  
  // Safe badge color
  const srcUpper = app.source?.toUpperCase() || "OTHER";
  let badgeClasses = "bg-border text-textSecondary";
  if (app.source && SOURCE_COLORS[app.source]) badgeClasses = SOURCE_COLORS[app.source];
  else if (app.source && SOURCE_COLORS[srcUpper]) badgeClasses = SOURCE_COLORS[srcUpper];

  const daysAppliedText = app.appliedAt 
    ? formatDistanceToNow(parseISO(app.appliedAt), { addSuffix: true }) 
    : "Date unknown";

  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      onClick={onClick}
      className={`group relative p-4 rounded-xl border bg-surface/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all cursor-pointer ${
        isDragging ? "border-accent shadow-[0_0_15px_rgba(108,99,255,0.2)] scale-[1.02]" : "border-border hover:border-textSecondary/30"
      }`}
    >
      <div className="absolute top-4 right-4 flex gap-1 items-center">
        <div className={`w-2.5 h-2.5 rounded-full ${priorityColor}`} title={`Priority: ${app.priority || 'MEDIUM'}`}></div>
      </div>

      <div className="flex items-start gap-4">
        {/* Logo */}
        {!logoError ? (
          <img 
            src={logoUrl} 
            alt={app.companyName}
            onError={() => setLogoError(true)}
            className="w-12 h-12 rounded-lg bg-surface border border-border object-contain p-1 shrink-0"
          />
        ) : (
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0 border border-border/50"
            style={{background: `hsl(${app.companyName.charCodeAt(0) * 7 % 360}, 60%, 40%)`}}
          >
            {app.companyName.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 pr-4">
          <h3 className="font-display font-semibold text-textPrimary line-clamp-1">{app.companyName}</h3>
          <p className="text-sm text-textSecondary mt-0.5 line-clamp-1">{app.jobTitle}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className={`text-[10px] font-bold tracking-wider px-2 py-1 rounded-md uppercase ${badgeClasses}`}>
          {app.source || "Other"}
        </span>
        <span className="text-xs font-medium text-textSecondary">{daysAppliedText}</span>
      </div>
    </div>
  );
}
