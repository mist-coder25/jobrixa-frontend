import { formatDistanceToNow, parseISO } from "date-fns";
import CompanyLogo from "./CompanyLogo";

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
  const daysAppliedText = app.appliedAt 
    ? formatDistanceToNow(parseISO(app.appliedAt), { addSuffix: true }) 
    : "Date unknown";

  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      onClick={onClick}
      className={`mx-3 mb-2 bg-[#161B22] border border-[#30363D] rounded-lg p-3 cursor-pointer hover:border-[#4F8EF7]/40 hover:shadow-md hover:shadow-black/40 transition-all group ${
        isDragging ? "border-[#4F8EF7] shadow-[0_4px_24px_rgba(0,0,0,0.4)] scale-[1.02]" : ""
      }`}
    >
      {/* Top row — company + source */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* Company logo */}
          <CompanyLogo 
            companyName={app.companyName} 
            domain={app.companyDomain} 
            size={24} 
            containerPadding="p-0.5"
            className="rounded"
          />
          <span className="text-xs font-semibold text-[#E6EDF3]">{app.companyName}</span>
        </div>
        <span className="text-[10px] text-[#484F58]">{daysAppliedText}</span>
      </div>

      {/* Job title */}
      <p className="text-xs text-[#7D8590] mb-3 leading-relaxed">{app.jobTitle}</p>

      {/* Bottom row — source badge + salary */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#21262D] text-[#7D8590] border border-[#30363D]">
          {app.source || "Other"}
        </span>
        {app.salaryMin && app.salaryMax && (
          <span className="text-[10px] font-medium text-[#3FB950]">${app.salaryMin/1000}k-${app.salaryMax/1000}k</span>
        )}
      </div>
    </div>
  );
}
