export interface JSearchJob {
  job_id: string;
  employer_name: string;
  employer_logo: string | null;
  job_title: string;
  job_city: string;
  job_country: string;
  job_is_remote: boolean;
  job_min_salary: number | null;
  job_max_salary: number | null;
  job_salary_currency: string | null;
  job_posted_at_datetime_utc: string;
  job_apply_link: string;
  job_employment_type: string;
  job_description: string;
  job_publisher: string;
}

export interface NormalizedJob {
  id: string;
  company: string;
  logoUrl: string | null;
  title: string;
  location: string;
  isRemote: boolean;
  salaryLabel: string;
  postedLabel: string;
  url: string;
  source: string;
  trustScore: number;
  employmentType: string;
}

const MOCK_JOBS: NormalizedJob[] = [
  { id: '1', company: 'Google', logoUrl: null, title: 'Software Engineer', location: 'Bangalore', isRemote: false, salaryLabel: '₹25–40 LPA', postedLabel: '2 days ago', url: 'https://careers.google.com', source: 'LinkedIn', trustScore: 92, employmentType: 'Full-time' },
  { id: '2', company: 'Microsoft', logoUrl: null, title: 'Backend Developer', location: 'Hyderabad', isRemote: false, salaryLabel: '₹20–35 LPA', postedLabel: '1 day ago', url: 'https://careers.microsoft.com', source: 'LinkedIn', trustScore: 89, employmentType: 'Full-time' },
  { id: '3', company: 'Razorpay', logoUrl: null, title: 'Java Developer', location: 'Bangalore', isRemote: false, salaryLabel: '₹15–25 LPA', postedLabel: '3 days ago', url: 'https://razorpay.com/jobs', source: 'Internshala', trustScore: 76, employmentType: 'Full-time' },
  { id: '4', company: 'Swiggy', logoUrl: null, title: 'Full Stack Engineer', location: 'Bangalore', isRemote: false, salaryLabel: '₹18–28 LPA', postedLabel: '5 days ago', url: 'https://careers.swiggy.com', source: 'Naukri', trustScore: 81, employmentType: 'Full-time' },
  { id: '5', company: 'CRED', logoUrl: null, title: 'React Developer', location: 'Remote', isRemote: true, salaryLabel: '₹12–20 LPA', postedLabel: '1 week ago', url: 'https://careers.cred.club', source: 'Wellfound', trustScore: 74, employmentType: 'Full-time' },
  { id: '6', company: 'Zerodha', logoUrl: null, title: 'Backend Engineer', location: 'Bangalore', isRemote: false, salaryLabel: '₹15–22 LPA', postedLabel: '2 days ago', url: 'https://zerodha.com/careers', source: 'Referral', trustScore: 88, employmentType: 'Full-time' },
  { id: '7', company: 'Atlassian', logoUrl: null, title: 'Software Engineer II', location: 'Remote', isRemote: true, salaryLabel: '₹30–50 LPA', postedLabel: '4 days ago', url: 'https://www.atlassian.com/company/careers', source: 'LinkedIn', trustScore: 91, employmentType: 'Full-time' },
  { id: '8', company: 'Flipkart', logoUrl: null, title: 'SDE-1', location: 'Bangalore', isRemote: false, salaryLabel: '₹20–30 LPA', postedLabel: '6 days ago', url: 'https://www.flipkartcareers.com', source: 'Naukri', trustScore: 83, employmentType: 'Full-time' },
  { id: '9', company: 'Paytm', logoUrl: null, title: 'Android Developer', location: 'Noida', isRemote: false, salaryLabel: '₹10–18 LPA', postedLabel: '3 days ago', url: 'https://paytm.com/careers', source: 'LinkedIn', trustScore: 68, employmentType: 'Full-time' },
  { id: '10', company: 'Meesho', logoUrl: null, title: 'Data Engineer', location: 'Bangalore', isRemote: true, salaryLabel: '₹14–22 LPA', postedLabel: '2 days ago', url: 'https://meesho.io/careers', source: 'LinkedIn', trustScore: 79, employmentType: 'Full-time' },
  { id: '11', company: 'Groww', logoUrl: null, title: 'Frontend Engineer', location: 'Bangalore', isRemote: false, salaryLabel: '₹12–25 LPA', postedLabel: '1 week ago', url: 'https://groww.in/careers', source: 'Wellfound', trustScore: 85, employmentType: 'Full-time' },
  { id: '12', company: 'PhonePe', logoUrl: null, title: 'SDE-2 Backend', location: 'Bangalore', isRemote: false, salaryLabel: '₹22–38 LPA', postedLabel: '5 days ago', url: 'https://phonepe.com/en-in/careers', source: 'LinkedIn', trustScore: 87, employmentType: 'Full-time' },
];

function postedLabel(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 14) return '1 week ago';
    return `${Math.floor(days / 7)} weeks ago`;
  } catch {
    return 'Recently';
  }
}

function salaryLabel(min: number | null, max: number | null, currency: string | null): string {
  if (!min && !max) return 'Not disclosed';
  const fmt = (n: number) => currency === 'INR' ? `₹${(n / 100000).toFixed(0)}L` : `${currency ?? '$'}${(n / 1000).toFixed(0)}K`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

function normalize(job: JSearchJob): NormalizedJob {
  const loc = [job.job_city, job.job_country].filter(Boolean).join(', ');
  return {
    id: job.job_id,
    company: job.employer_name,
    logoUrl: job.employer_logo ?? null,
    title: job.job_title,
    location: loc || (job.job_is_remote ? 'Remote' : 'Unknown'),
    isRemote: job.job_is_remote,
    salaryLabel: salaryLabel(job.job_min_salary, job.job_max_salary, job.job_salary_currency),
    postedLabel: postedLabel(job.job_posted_at_datetime_utc),
    url: job.job_apply_link,
    source: job.job_publisher ?? 'JSearch',
    trustScore: Math.floor(60 + Math.random() * 35),
    employmentType: job.job_employment_type ?? 'Full-time',
  };
}

export async function searchJobs(query: string, location: string): Promise<NormalizedJob[]> {
  const apiKey = import.meta.env.VITE_RAPIDAPI_KEY ?? '';

  if (!apiKey) {
    // Return filtered mock data
    await new Promise(r => setTimeout(r, 700)); // simulate latency
    const q = query.toLowerCase();
    return MOCK_JOBS.filter(j =>
      !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q)
    );
  }

  try {
    const params = new URLSearchParams({
      query: location ? `${query} in ${location}` : query,
      num_pages: '1',
      page: '1',
    });
    const res = await fetch(`https://jsearch.p.rapidapi.com/search?${params}`, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
      },
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return (data.data as JSearchJob[]).map(normalize);
  } catch {
    // Fallback to mock
    return MOCK_JOBS;
  }
}

export { MOCK_JOBS };
