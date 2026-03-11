import { formatDistanceToNow, parseISO } from "date-fns";
import CompanyLogo from "./CompanyLogo";

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



export default function ApplicationCard({ app, onClick, innerRef, draggableProps, dragHandleProps, isDragging }: ApplicationCardProps) {
  const daysAppliedText = app.appliedAt 
    ? formatDistanceToNow(parseISO(app.appliedAt), { addSuffix: true }) 
    : "Date unknown";

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OFFER': return 'bg-[#3FB950]';
      case 'REJECTED': 
      case 'GHOSTED': return 'bg-[#F85149]';
      case 'INTERVIEW': return 'bg-[#D29922]';
      default: return 'bg-[#7D8590]';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'OA': return 'Assessment';
      default: return status.charAt(0) + status.slice(1).toLowerCase();
    }
  };

  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      onClick={onClick}
      className={`bg-[#161B22] border border-[#30363D] rounded-lg p-4 hover:border-[#4F8EF7]/50 transition-all cursor-pointer group relative ${
        isDragging ? "border-[#4F8EF7] shadow-[0_4px_24px_rgba(0,0,0,0.4)] scale-[1.02]" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Logo */}
        <CompanyLogo companyName={app.companyName} size={48} className="border border-[#30363D]" />

        {/* Content */}
        <div className="flex-1 pr-4">
          <h3 className="font-bold text-[#E6EDF3] line-clamp-1">{app.companyName}</h3>
          <p className="text-sm font-medium text-[#7D8590] mt-0.5 line-clamp-1">{app.jobTitle}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-[#1C2128] border border-[#30363D] text-[#7D8590]">
            <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(app.status)}`} />
            {getStatusLabel(app.status)}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-md bg-[#4F8EF7]/10 text-[#4F8EF7] border border-[#4F8EF7]/20">
            {app.source || "Other"}
          </span>
        </div>
        <span className="text-xs font-medium text-[#7D8590]">{daysAppliedText}</span>
      </div>
    </div>
  );
}
