import { useState, useEffect, useCallback } from "react";
import { Search, MapPin, Briefcase, Clock, ExternalLink, Plus, SlidersHorizontal, Wifi, X } from "lucide-react";
import TopBar from "../components/TopBar";
import AddApplicationModal from "../components/AddApplicationModal";
import { toast } from "../components/Toast";
import { searchJobs, MOCK_JOBS } from "../api/jobSearch";
import type { NormalizedJob } from "../api/jobSearch";

const SOURCE_COLORS: Record<string, string> = {
  LinkedIn: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  Naukri: "bg-orange-500/15 text-orange-400 border-orange-500/25",
  Internshala: "bg-green-500/15 text-green-400 border-green-500/25",
  Wellfound: "bg-purple-500/15 text-purple-400 border-purple-500/25",
  Referral: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  default: "bg-border text-textSecondary border-border",
};

function TrustBadge({ score }: { score: number }) {
  const color =
    score >= 70 ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" :
    score >= 40 ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" :
                  "bg-red-500/15 text-red-400 border-red-500/30";
  return (
    <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold flex items-center gap-1 shrink-0 ${color}`}>
      <span className="opacity-70">Trust</span> {score}
    </span>
  );
}

function trustBorderColor(score: number): string {
  if (score >= 70) return "border-l-emerald-500";
  if (score >= 40) return "border-l-yellow-500";
  return "border-l-red-500";
}

function LogoFallback({ company }: { company: string }) {
  const bg = `hsl(${company.charCodeAt(0) * 7 % 360}, 55%, 38%)`;
  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0 border border-border/50"
      style={{ background: bg }}
    >
      {company.charAt(0).toUpperCase()}
    </div>
  );
}

function JobCard({ job, onAddToTracker }: { job: NormalizedJob; onAddToTracker: (job: NormalizedJob) => void }) {
  const [logoErr, setLogoErr] = useState(false);
  const logoUrl = job.logoUrl ?? `https://logo.clearbit.com/${job.company.split(" ")[0].toLowerCase()}.com`;
  const srcColor = SOURCE_COLORS[job.source] ?? SOURCE_COLORS.default;

  const borderAccent = trustBorderColor(job.trustScore);

  return (
    <div className={`group bg-surface border border-border border-l-2 ${borderAccent} rounded-xl p-5 flex flex-col gap-4 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 transition-all duration-200 hover:-translate-y-0.5`}>
      {/* Header */}
      <div className="flex items-start gap-3">
        {!logoErr ? (
          <div className="w-12 h-12 rounded-xl bg-white border border-border/50 flex items-center justify-center overflow-hidden shrink-0">
            <img
              src={logoUrl}
              alt={job.company}
              onError={() => setLogoErr(true)}
              className="w-full h-full object-contain p-1.5"
            />
          </div>
        ) : (
          <LogoFallback company={job.company} />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-display font-bold text-textPrimary text-sm leading-tight truncate">{job.title}</h3>
              <p className="text-xs text-textSecondary mt-0.5 truncate">{job.company}</p>
            </div>
            <TrustBadge score={job.trustScore} />
          </div>
        </div>
      </div>

      {/* Meta Pills */}
      <div className="flex flex-wrap gap-1.5">
        <span className="flex items-center gap-1 px-2.5 py-1 bg-primary border border-border rounded-full text-xs text-textSecondary">
          <MapPin size={10} /> {job.location}
        </span>
        {job.isRemote && (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-accent/10 border border-accent/20 rounded-full text-xs text-accent font-medium">
            <Wifi size={10} /> Remote
          </span>
        )}
        <span className="flex items-center gap-1 px-2.5 py-1 bg-primary border border-border rounded-full text-xs text-textSecondary">
          <Briefcase size={10} /> {job.employmentType}
        </span>
      </div>

      {/* Salary + Meta Row */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-emerald-400 font-semibold">{job.salaryLabel}</span>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${srcColor}`}>{job.source}</span>
          <span className="flex items-center gap-1 text-textSecondary/60">
            <Clock size={10} /> {job.postedLabel}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-1 border-t border-border">
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border text-textSecondary hover:text-textPrimary hover:border-accent/40 text-xs font-medium transition-all"
        >
          <ExternalLink size={12} /> View Job
        </a>
        <button
          onClick={() => onAddToTracker(job)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-accent hover:bg-[#5A52E8] text-white text-xs font-medium transition-all shadow-[0_0_12px_rgba(108,99,255,0.25)]"
        >
          <Plus size={12} /> Add to Tracker
        </button>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-border/40 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-border/40 rounded w-3/4" />
          <div className="h-3 bg-border/40 rounded w-1/2" />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-border/40 rounded-full w-24" />
        <div className="h-6 bg-border/40 rounded-full w-20" />
      </div>
      <div className="flex justify-between mb-4">
        <div className="h-3 bg-border/40 rounded w-20" />
        <div className="h-3 bg-border/40 rounded w-24" />
      </div>
      <div className="flex gap-2 pt-3 border-t border-border">
        <div className="flex-1 h-8 bg-border/40 rounded-lg" />
        <div className="flex-1 h-8 bg-border/40 rounded-lg" />
      </div>
    </div>
  );
}

export default function Discover() {
  const [query, setQuery] = useState("Software Engineer");
  const [location, setLocation] = useState("");
  const [roleType, setRoleType] = useState("");
  const [experience, setExperience] = useState("");
  const [dateRange, setDateRange] = useState("");

  const [jobs, setJobs] = useState<NormalizedJob[]>(MOCK_JOBS);
  const [loading, setLoading] = useState(false);

  const [trackerJob, setTrackerJob] = useState<NormalizedJob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const runSearch = useCallback(async () => {
    setLoading(true);
    try {
      const results = await searchJobs(query || "Software Engineer", location);
      setJobs(results);
    } catch {
      toast.error("Search failed. Showing sample jobs.");
      setJobs(MOCK_JOBS);
    } finally {
      setLoading(false);
    }
  }, [query, location]);

  // Load defaults on mount
  useEffect(() => {
    runSearch();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddToTracker = (job: NormalizedJob) => {
    setTrackerJob(job);
    setIsModalOpen(true);
  };

  const hasAPIKey = !!import.meta.env.VITE_RAPIDAPI_KEY;

  // When using mock data (no API key), always show ALL jobs — only filter by roleType chip.
  // When using real API data, filter normally.
  const displayedJobs = (hasAPIKey ? jobs : MOCK_JOBS).filter(j => {
    if (roleType && !j.employmentType.toLowerCase().includes(roleType.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="h-full flex flex-col bg-primary overflow-y-auto custom-scrollbar">
      {/* No search/action in TopBar on this page — we have our own prominent search bar below */}
      <TopBar title="Discover Jobs" />

      <div className="p-6 md:p-8 space-y-6">

        {/* API Key Notice */}
        {!hasAPIKey && (
          <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/25 rounded-xl p-4 text-sm">
            <span className="text-yellow-400 mt-0.5 shrink-0">💡</span>
            <div>
              <p className="text-yellow-300 font-medium">Showing demo data</p>
              <p className="text-yellow-400/70 text-xs mt-0.5">
                Add your free <strong>VITE_RAPIDAPI_KEY</strong> from{" "}
                <a href="https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch" target="_blank" rel="noopener noreferrer" className="underline">rapidapi.com/jsearch</a>{" "}
                to <code className="bg-yellow-500/10 px-1 rounded">.env.local</code> to search real jobs.
              </p>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary group-focus-within:text-accent transition-colors" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && runSearch()}
                placeholder="Job title, skill, or company..."
                className="w-full pl-12 pr-4 py-3.5 bg-surface border border-border rounded-xl text-textPrimary placeholder:text-textSecondary/50 text-sm focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(108,99,255,0.15)] transition-all"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary">
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={runSearch}
              disabled={loading}
              className="px-6 py-3.5 bg-accent hover:bg-[#5A52E8] text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(108,99,255,0.3)] transition-all disabled:opacity-70 shrink-0"
            >
              <Search size={16} />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal size={14} className="text-textSecondary shrink-0" />
            
            <div className="relative">
              <MapPin size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary pointer-events-none" />
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                onKeyDown={e => e.key === "Enter" && runSearch()}
                placeholder="Location"
                className="pl-8 pr-3 py-2 bg-surface border border-border rounded-lg text-xs text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:border-accent transition-colors w-36"
              />
            </div>

            {[
              {
                label: "Role Type",
                value: roleType,
                setter: setRoleType,
                options: ["", "Full-time", "Internship", "Contract", "Remote"] as const,
              },
              {
                label: "Experience",
                value: experience,
                setter: setExperience,
                options: ["", "Fresher", "0-2 years", "2-5 years", "5+ years"] as const,
              },
              {
                label: "Date Posted",
                value: dateRange,
                setter: setDateRange,
                options: ["", "Last 24h", "Last week", "Last month"] as const,
              },
            ].map(f => (
              <select
                key={f.label}
                value={f.value}
                onChange={e => f.setter(e.target.value)}
                className="py-2 px-3 bg-surface border border-border rounded-lg text-xs text-textPrimary focus:outline-none focus:border-accent transition-colors cursor-pointer"
              >
                <option value="">{f.label}</option>
                {f.options.filter(Boolean).map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ))}

            {(roleType || experience || dateRange || location) && (
              <button
                onClick={() => { setRoleType(""); setExperience(""); setDateRange(""); setLocation(""); }}
                className="flex items-center gap-1 px-2.5 py-2 text-xs text-danger border border-danger/30 rounded-lg hover:bg-danger/5 transition-colors"
              >
                <X size={10} /> Clear filters
              </button>
            )}

            <span className="ml-auto text-xs text-textSecondary/60 shrink-0">
              {loading ? "Searching..." : `${displayedJobs.length} jobs found`}
            </span>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : displayedJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl bg-surface border border-border flex items-center justify-center mb-5">
              <Search size={32} className="text-textSecondary opacity-30" />
            </div>
            <h3 className="text-lg font-display font-semibold text-textPrimary mb-2">No jobs found</h3>
            <p className="text-textSecondary text-sm max-w-xs">
              No jobs found for your search. Try different keywords or clear your filters.
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-textSecondary/60">
              {loading ? "Searching..." : `Showing ${displayedJobs.length} job${displayedJobs.length !== 1 ? 's' : ''}${!hasAPIKey ? ' · Demo mode' : ''}`}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedJobs.map(job => (
                <JobCard key={job.id} job={job} onAddToTracker={handleAddToTracker} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add to Tracker Modal (pre-filled) */}
      <AddApplicationModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setTrackerJob(null); }}
        onAdded={() => toast.success("✅ Added to your pipeline!")}
        initialStatus="SAVED"
        prefill={trackerJob ? {
          companyName: trackerJob.company,
          jobTitle: trackerJob.title,
          jobUrl: trackerJob.url,
          source: "Discover",
        } : undefined}
      />
    </div>
  );
}
