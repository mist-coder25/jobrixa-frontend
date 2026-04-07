import { formatDistanceToNow, parseISO } from "date-fns";

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
          <div className="w-8 h-8 rounded-lg bg-[#21262D] border border-[#30363D] overflow-hidden flex items-center justify-center shrink-0">
            {app.companyDomain ? (
              <img 
                src={`https://logo.clearbit.com/${app.companyDomain}`} 
                alt={app.companyName}
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `<span class="text-xs font-bold text-[#4F8EF7]">${app.companyName.charAt(0).toUpperCase()}</span>`;
                }}
              />
            ) : (
              <span className="text-xs font-bold text-[#4F8EF7]">{app.companyName.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-[#E6EDF3] block truncate">{app.companyName}</span>
            <span className="text-[10px] text-[#484F58]">{daysAppliedText}</span>
          </div>
        </div>
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
