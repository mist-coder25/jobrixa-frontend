import { useEffect, useCallback, useState, useRef } from "react";
import CompanyLogo from "../components/CompanyLogo";
import { Search, Briefcase, Clock, ExternalLink, Plus, Wifi, X } from "lucide-react";
import TopBar from "../components/TopBar";
import AddApplicationModal from "../components/AddApplicationModal";
import FilterPanel, { DEFAULT_FILTERS } from "../components/FilterPanel";
import type { FilterState } from "../components/FilterPanel";
import { toast } from "../components/Toast";
import { MOCK_JOBS } from "../api/jobSearch";
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
  const trustColor = score > 80 ? '#3FB950' : score > 60 ? '#D29922' : '#F85149';
  return (
    <span style={{ color: trustColor, borderColor: `${trustColor}30`, backgroundColor: `${trustColor}10` }}
      className="text-xs px-2 py-0.5 rounded-full border font-medium shrink-0">
      Trust {score}
    </span>
  );
}



function JobCard({ job, onAddToTracker }: { job: NormalizedJob; onAddToTracker: (job: NormalizedJob) => void }) {
  const srcColor = SOURCE_COLORS[job.source] ?? SOURCE_COLORS.default;

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 flex flex-col gap-4 hover:border-[#4F8EF7]/40 hover:shadow-lg hover:shadow-[#4F8EF7]/5 transition-all cursor-pointer">
      {/* Header */}
      <div className="flex items-start gap-3">
        <CompanyLogo companyName={job.company} size={48} className="border border-border/50" containerPadding="p-1.5" />
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
          {job.location}
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
        <span className="text-[#3FB950] font-semibold text-sm">{job.salaryLabel}</span>
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
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#4F8EF7] hover:bg-[#3B7DE8] text-white text-sm font-medium rounded-lg transition-colors"
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


const DEFAULT_QUERY = 'jobs India';

export default function Discover() {
  const [inputValue, setInputValue] = useState(""); // what user sees in box
  const [searchQuery, setSearchQuery] = useState(DEFAULT_QUERY); // used for API
  const [page, setPage] = useState(1);

  const [jobs, setJobs] = useState<NormalizedJob[]>(MOCK_JOBS);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [trackerJob, setTrackerJob] = useState<NormalizedJob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter state
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const fetchJobs = async (q: string, p: number) => {
    const apiQuery = filters.location ? `${q} in ${filters.location}` : q;
    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(apiQuery)}&page=${p}&num_pages=1&country=in`,
      {
        headers: {
          'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY!,
          'x-rapidapi-host': 'jsearch.p.rapidapi.com'
        }
      }
    );
    const data = await response.json();
    const rawJobs = data.data || [];
    return rawJobs.map((j: any) => ({
      id: j.job_id,
      company: j.employer_name,
      logoUrl: j.employer_logo || null,
      title: j.job_title,
      location: [j.job_city, j.job_country].filter(Boolean).join(', ') || (j.job_is_remote ? 'Remote' : 'India'),
      isRemote: j.job_is_remote || false,
      salaryLabel: j.job_min_salary ? `₹${(j.job_min_salary/100000).toFixed(0)}L - ₹${(j.job_max_salary/100000).toFixed(0)}L` : 'Not disclosed',
      postedLabel: j.job_posted_at_datetime_utc ? `${Math.floor((Date.now() - new Date(j.job_posted_at_datetime_utc).getTime()) / 86400000)}d ago` : 'Recently',
      url: j.job_apply_link,
      source: j.job_publisher || 'JSearch',
      trustScore: Math.floor(70 + Math.random() * 25),
      employmentType: j.job_employment_type || 'Full-time'
    }));
  };


  const runSearch = useCallback(async (isLoadMore = false) => {
    if (!import.meta.env.VITE_RAPIDAPI_KEY) {
      if (isLoadMore) return;
      setLoading(true);
      setTimeout(() => { setJobs(MOCK_JOBS); setLoading(false); }, 800);
      return;
    }

    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const currentPage = isLoadMore ? page + 1 : 1;
      const results = await fetchJobs(searchQuery, currentPage);
      
      if (isLoadMore) {
        setJobs(prev => {
          const combined = [...prev, ...results];
          return combined.filter((job, index, self) => 
            index === self.findIndex(j => j.id === job.id)
          );
        });
        setPage(currentPage);
      } else {
        setJobs(results);
        setPage(1);
      }
    } catch (err) {
      console.error("Search failed:", err);
      if (!isLoadMore) {
        toast.error("Search failed. Showing demo data.");
        setJobs(MOCK_JOBS);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchQuery, filters.location, page]);

  const handleSearch = (q?: string) => {
    const newQuery = q || inputValue.trim() || DEFAULT_QUERY;
    setSearchQuery(newQuery);
    setPage(1);
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        console.log("Discover: Starting initial simplified load for India...");
        const response = await fetch(
          'https://jsearch.p.rapidapi.com/search?query=software+engineer+India&page=1&num_pages=1&country=in',
          {
            headers: {
              'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY!,
              'x-rapidapi-host': 'jsearch.p.rapidapi.com'
            }
          }
        );
        const data = await response.json();
        console.log('API full response:', data);
        
        const rawJobs = data.data || [];
        const results = rawJobs.map((j: any) => ({
          id: j.job_id,
          company: j.employer_name,
          logoUrl: j.employer_logo || null,
          title: j.job_title,
          location: [j.job_city, j.job_country].filter(Boolean).join(', ') || (j.job_is_remote ? 'Remote' : 'India'),
          isRemote: j.job_is_remote || false,
          salaryLabel: j.job_min_salary ? `₹${(j.job_min_salary/100000).toFixed(0)}L - ₹${(j.job_max_salary/100000).toFixed(0)}L` : 'Not disclosed',
          postedLabel: j.job_posted_at_datetime_utc ? `${Math.floor((Date.now() - new Date(j.job_posted_at_datetime_utc).getTime()) / 86400000)}d ago` : 'Recently',
          url: j.job_apply_link,
          source: j.job_publisher || 'JSearch',
          trustScore: Math.floor(70 + Math.random() * 25),
          employmentType: j.job_employment_type || 'Full-time'
        }));
        
        setJobs(results);
      } catch (err) {
        console.error('Fetch failed:', err);
        setJobs(MOCK_JOBS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []); // Run once on mount

  // Search on query/filter changes (skipping mount)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    console.log("Deep search triggered:", searchQuery, filters.location);
    runSearch();
  }, [searchQuery, page, filters.location]); 

  const handleAddToTracker = (job: NormalizedJob) => {
    setTrackerJob(job);
    setIsModalOpen(true);
  };

  const hasAPIKey = !!import.meta.env.VITE_RAPIDAPI_KEY;

  // When using mock data (no API key), always show ALL jobs — only filter by roleType chip.
  // When using real API data, filter normally.
  const displayedJobs = (hasAPIKey ? jobs : MOCK_JOBS).filter(j => {
    if (filters.roleType && !j.employmentType.toLowerCase().includes(filters.roleType.toLowerCase())) return false;
    // Experience and Date Range filtering would happen in real API, but for mock data:
    if (filters.experience && !j.title.toLowerCase().includes(filters.experience.toLowerCase()) && !j.company.toLowerCase().includes(filters.experience.toLowerCase())) {
        // Simple mock behavior: if experience is selected, only show a subset
        // In reality, this is handled by searchJobs API call params
    }
    return true;
  });

  return (
    <div className="h-full flex flex-col bg-primary overflow-y-auto custom-scrollbar relative">
      <TopBar 
        title="Discover Jobs" 
        subtitle="Curated for your profile" 
        showSearch
        onFilterClick={() => setFilterOpen(true)}
        activeFilterCount={(filters.roleType ? 1 : 0) + (filters.experience ? 1 : 0) + (filters.dateRange !== 'all' ? 1 : 0) + (filters.location ? 1 : 0)}
      />

      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">

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
        <div className="space-y-4 mt-1">
          <div className="flex gap-3">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary group-focus-within:text-accent transition-colors" />
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Job title, skill, or company..."
                className="w-full pl-12 pr-4 py-3.5 bg-surface border border-border rounded-xl text-textPrimary placeholder:text-textSecondary/50 text-sm focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(108,99,255,0.15)] transition-all"
              />
              {inputValue && (
                <button onClick={() => setInputValue("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary">
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="px-6 py-3.5 bg-accent hover:bg-[#5A52E8] text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(108,99,255,0.3)] transition-all disabled:opacity-70 shrink-0"
            >
              <Search size={16} />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-2">
            
            <div className="relative">
              <input
                type="text"
                value={filters.location}
                onChange={e => setFilters({ ...filters, location: e.target.value })}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Location"
                className="pl-3 pr-3 py-2 bg-surface border border-border rounded-lg text-xs text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:border-accent transition-colors w-36"
              />
            </div>

            <button
               onClick={() => setFilterOpen(true)}
               className="flex items-center gap-1.5 px-3 py-2 bg-[#161B22] border border-[#30363D] rounded-lg text-xs font-semibold text-[#7D8590] hover:text-[#E6EDF3] hover:border-[#4F8EF7]/50 transition-all"
            >
               More Filters
            </button>

            {(filters.roleType || filters.experience || filters.dateRange !== 'all' || filters.location) && (
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="flex items-center gap-1 px-2.5 py-2 text-xs text-danger border border-danger/30 rounded-lg hover:bg-danger/5 transition-colors"
              >
                <X size={10} /> Clear filters
              </button>
            )}

            <span className="ml-auto text-xs text-textSecondary/60 shrink-0">
              {loading ? "Searching..." : `Showing ${displayedJobs.length} jobs`}
            </span>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { id: 'software engineer India', label: '💻 Software' },
              { id: 'marketing manager India', label: '📊 Marketing' },
              { id: 'finance analyst India', label: '💰 Finance' },
              { id: 'UI UX designer India', label: '🎨 Design' },
              { id: 'mechanical engineer India', label: '⚙️ Engineering' },
              { id: 'product manager India', label: '🚀 Product' },
              { id: 'data scientist India', label: '📉 Data' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSearch(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  searchQuery === cat.id 
                    ? 'bg-[#4F8EF7]/10 border-[#4F8EF7] text-[#4F8EF7]' 
                    : 'bg-[#161B22] border-[#30363D] text-[#7D8590] hover:text-[#E6EDF3] hover:border-[#4F8EF7]/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : displayedJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-5xl mb-4 block">🔍</span>
            <h3 className="text-xl font-display font-bold text-textPrimary mb-2">No jobs found</h3>
            <p className="text-textSecondary text-sm max-w-xs leading-relaxed">
              We couldn't find any jobs matching your criteria. Try adjusting your keywords or clearing filters.
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

            {/* Load More Button */}
            {hasAPIKey && displayedJobs.length > 0 && (
              <div className="flex justify-center pt-8">
                <button
                  onClick={() => runSearch(true)}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-[#1C2128] border border-[#30363D] text-textPrimary rounded-xl text-sm font-semibold hover:border-accent/50 hover:bg-accent/5 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      Loading more...
                    </>
                  ) : (
                    <>
                      <Plus size={16} /> Load More Jobs
                    </>
                  )}
                </button>
              </div>
            )}
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
