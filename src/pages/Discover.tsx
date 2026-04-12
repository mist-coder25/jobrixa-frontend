import { useState } from "react";
import CompanyLogo from "../components/CompanyLogo";
import { Search, Briefcase, Clock, ExternalLink, Plus, MapPin, Wifi } from "lucide-react";
import TopBar from "../components/TopBar";
import AddApplicationModal from "../components/AddApplicationModal";
import FilterPanel, { DEFAULT_FILTERS } from "../components/FilterPanel";
import type { FilterState } from "../components/FilterPanel";
import { toast } from "../components/Toast";
import { MOCK_JOBS } from "../api/jobSearch";
import type { NormalizedJob } from "../api/jobSearch";
import { trackEvent } from "../utils/analytics";
import api from "../api/axios";

function TrustBadge({ score }: { score: number }) {
  const trustColor = score > 80 ? 'var(--primary)' : score > 60 ? 'var(--accent-orange)' : 'var(--accent-red)';
  return (
    <span style={{ color: trustColor, borderColor: `${trustColor}30`, backgroundColor: `${trustColor}10` }}
      className="text-[10px] px-2 py-0.5 rounded-full border font-bold shrink-0 uppercase tracking-tight">
      Trust {score}
    </span>
  );
}

function JobCard({ job, onAddToTracker }: { job: NormalizedJob; onAddToTracker: (job: NormalizedJob) => void }) {
  const inferredDomain = `${job.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-5 hover:border-[var(--text-tertiary)] hover:brightness-110 transition-all group">
      {/* Header */}
      <div className="flex items-start gap-4">
        <CompanyLogo 
          companyName={job.company} 
          domain={inferredDomain} 
          size={56} 
          className="rounded-xl ring-1 ring-white/10 shrink-0" 
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-bold text-white text-base leading-tight truncate group-hover:text-[var(--primary)] transition-colors">{job.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5 truncate font-medium">{job.company}</p>
            </div>
            <TrustBadge score={job.trustScore} />
          </div>
        </div>
      </div>

      {/* Meta Pills */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-main)] border border-[var(--border)] rounded-full text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wide">
          <MapPin size={10} /> {job.location}
        </div>
        {job.isRemote && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20 rounded-full text-[11px] font-bold text-[var(--accent-green)] uppercase tracking-wide">
            <Wifi size={10} /> Remote
          </div>
        )}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-main)] border border-[var(--border)] rounded-full text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wide">
          <Briefcase size={10} /> {job.employmentType}
        </div>
      </div>

      {/* Salary & Source */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-[var(--accent-green)] font-bold text-lg">{job.salaryLabel}</span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">{job.source}</span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--text-tertiary)] border-l border-[var(--border)] pl-3">
            <Clock size={10} /> {job.postedLabel}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--border)]">
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('job_viewed', { source: job.source })}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-white hover:border-white text-xs font-bold uppercase tracking-wider transition-all"
        >
          <ExternalLink size={14} /> View
        </a>
        <button
          onClick={() => onAddToTracker(job)}
          className="flex items-center justify-center gap-2 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[var(--primary)]/10"
        >
          <Plus size={14} /> Tracker
        </button>
      </div>
    </div>
  );
}

const CATEGORIES = [
  { id: 'software', label: 'Software', icon: '💻' },
  { id: 'marketing', label: 'Marketing', icon: '📊' },
  { id: 'finance', label: 'Finance', icon: '💰' },
  { id: 'design', label: 'Design', icon: '🎨' },
  { id: 'engineering', label: 'Engineering', icon: '⚙️' },
  { id: 'product', label: 'Product', icon: '🚀' },
  { id: 'data', label: 'Data', icon: '📉' }
];

export default function Discover() {
  const [inputValue, setInputValue] = useState("");
  const [_searchQuery, setSearchQuery] = useState('jobs India');
  const [_page, _setPage] = useState(1);
  const [jobs, _setJobs] = useState<NormalizedJob[]>(MOCK_JOBS);
  const [_loading, _setLoading] = useState(false);
  const [trackerJob, setTrackerJob] = useState<NormalizedJob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const handleAddApplication = async (formData: any) => {
    try {
      const backendData = {
        companyName: formData.companyName,
        jobTitle: formData.jobRole,
        jobUrl: formData.jobLink,
        status: formData.status,
        appliedDate: formData.appliedDate,
        source: "Discover"
      };

      const response = await api.post('/applications', backendData);
      if (response.data) {
        toast.success("✅ Added to your pipeline!");
        setIsModalOpen(false);
        setTrackerJob(null);
      }
    } catch (error) {
      console.error('Failed to add application:', error);
      toast.error("❌ Failed to add to tracker.");
    }
  };

  const [_hasAPIKey] = useState(!!(import.meta.env.VITE_ADZUNA_APP_ID && import.meta.env.VITE_ADZUNA_APP_KEY));

  const handleSearch = (q?: string) => {
    const newQuery = q || inputValue || 'jobs India';
    setSearchQuery(newQuery);
    _setPage(1);
    trackEvent('job_searched', { query: newQuery });
    // In demo mode or if API fails, we just keep MOCK_JOBS or similar
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <TopBar 
        title="Discover Jobs" 
        subtitle="Curated for your profile" 
      />

      <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto w-full">
        
        {/* Search & Search Controls */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 space-y-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                    <input
                        type="text"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSearch()}
                        placeholder="Job title, skill, or company..."
                        className="w-full pl-12 pr-4 py-4 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl text-white placeholder:text-[var(--text-tertiary)]"
                    />
                </div>
                <div className="w-full md:w-64 relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                    <input
                        type="text"
                        value={filters.location}
                        onChange={e => setFilters({ ...filters, location: e.target.value })}
                        placeholder="Location"
                        className="w-full pl-10 pr-4 py-4 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl text-white placeholder:text-[var(--text-tertiary)]"
                    />
                </div>
                <button
                    onClick={() => handleSearch()}
                    className="btn-primary px-8 py-4"
                >
                    Search
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <button onClick={() => setFilterOpen(true)} className="btn-outline py-2 px-4 text-xs font-bold uppercase tracking-widest">
                    More Filters
                </button>
                <div className="h-4 w-px bg-[var(--border)]" />
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => handleSearch(`${cat.label} jobs`)}
                        className="px-4 py-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-full text-xs font-bold text-[var(--text-secondary)] hover:text-white hover:border-[var(--text-tertiary)] transition-colors"
                    >
                        {cat.icon} {cat.label}
                    </button>
                ))}
                <span className="ml-auto text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">
                    Showing {jobs.length} jobs
                </span>
            </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {jobs.map(job => (
                <JobCard 
                    key={job.id} 
                    job={job} 
                    onAddToTracker={(j) => {
                        setTrackerJob(j);
                        setIsModalOpen(true);
                    }} 
                />
            ))}
        </div>

      </div>

      <AddApplicationModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setTrackerJob(null); }}
        onSubmit={handleAddApplication}
        initialStatus="SAVED"
        prefill={trackerJob ? {
          companyName: trackerJob.company,
          jobTitle: trackerJob.title,
          jobUrl: trackerJob.url,
        } : undefined}
      />

      <FilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
        mode="discover"
      />
    </div>
  );
}
