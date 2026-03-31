import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart2, Briefcase, Bell, Chrome, Mail,
  ArrowRight, Check, Zap, Target, TrendingUp
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3] overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D1117]/80 backdrop-blur-md border-b border-[#21262D]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#4F8EF7] flex items-center justify-center">
              <span className="text-white font-black text-sm">J</span>
            </div>
            <span className="font-bold text-[#E6EDF3] text-base">Jobrixa</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-[#7D8590]">
            <span onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-[#E6EDF3] cursor-pointer transition-colors">Features</span>
            <span onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-[#E6EDF3] cursor-pointer transition-colors">How it works</span>
            <span onClick={() => navigate('/pricing')}
              className="hover:text-[#E6EDF3] cursor-pointer transition-colors">Pricing</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')}
              className="text-sm text-[#7D8590] hover:text-[#E6EDF3] transition-colors px-3 py-1.5">
              Sign in
            </button>
            <button onClick={() => navigate('/register')}
              className="text-sm bg-[#4F8EF7] hover:bg-[#3B7DE8] text-white font-medium px-4 py-1.5 rounded-lg transition-colors">
              Get started free
            </button>
          </div>
        </div>
      </nav>

      {/* BETA BANNER */}
      <div style={{
        background: 'linear-gradient(90deg, #1a3a2a, #0d2b1a)',
        borderBottom: '1px solid #2ea043',
        padding: '10px 24px',
        textAlign: 'center' as const,
        fontSize: '14px',
        color: '#3fb950',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '56px' // offset for fixed nav
      }}>
        <span>🎉</span>
        <span>
          <strong>Beta Launch:</strong> All Pro features are completely free for the first 1,000 students. 
          <a href="/register" style={{ color: '#58a6ff', marginLeft: '6px', textDecoration: 'underline' }}>
            Register now to lock in your early access →
          </a>
        </span>
      </div>

      {/* HERO */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#4F8EF7]/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-[#A371F7]/4 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-[#4F8EF7]/10 border border-[#4F8EF7]/20 rounded-full px-4 py-1.5 text-xs text-[#4F8EF7] font-medium mb-6"
          >
            <Zap size={11} />
            Built for Indian students & fresh graduates
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-[#E6EDF3] leading-tight tracking-tight mb-6"
          >
            Stop losing track of<br />
            <span style={{ color: '#4F8EF7' }}>your job applications</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-[#7D8590] max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Jobrixa tracks every application, reminds you about OAs and interviews,
            and shows you exactly why you're not getting responses.
            Your placement season, finally under control.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <button onClick={() => navigate('/register')}
              className="flex items-center gap-2 bg-[#4F8EF7] hover:bg-[#3B7DE8] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all hover:scale-105">
              Start tracking for free
              <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/login')}
              className="flex items-center gap-2 bg-[#161B22] hover:bg-[#1C2128] border border-[#30363D] text-[#E6EDF3] font-medium px-6 py-3 rounded-xl text-sm transition-colors">
              Sign in to your account
            </button>
          </motion.div>


        </div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="max-w-5xl mx-auto mt-16 relative"
        >
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            {/* Mock browser bar */}
            <div className="bg-[#1C2128] border-b border-[#30363D] px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#F85149]/60" />
                <div className="w-3 h-3 rounded-full bg-[#D29922]/60" />
                <div className="w-3 h-3 rounded-full bg-[#3FB950]/60" />
              </div>
              <div className="flex-1 mx-4 bg-[#0D1117] rounded-md px-3 py-1 text-xs text-[#484F58]">
                jobrixa-frontend.vercel.app/pipeline
              </div>
            </div>
            {/* Mock pipeline */}
            <div className="p-6 overflow-x-auto">
              <div className="flex gap-4 min-w-max">
                {[
                  { label: 'SAVED', color: '#7D8590', cards: ['Swiggy — SDE', 'Razorpay — Backend'] },
                  { label: 'APPLIED', color: '#4F8EF7', cards: ['Google — SWE', 'Microsoft — Intern'] },
                  { label: 'OA/ASSESSMENT', color: '#D29922', cards: ['Flipkart — SDE2'] },
                  { label: 'INTERVIEW', color: '#A371F7', cards: ['CRED — Frontend'] },
                  { label: 'OFFER', color: '#3FB950', cards: [] },
                ].map(col => (
                  <div key={col.label} className="w-48 flex-shrink-0">
                    <div className="bg-[#1C2128] rounded-lg border border-[#30363D] overflow-hidden"
                      style={{ borderTop: `2px solid ${col.color}` }}>
                      <div className="px-3 py-2 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: col.color }}>{col.label}</span>
                        <span className="text-[10px] text-[#484F58] bg-[#21262D] px-1.5 rounded">
                          {col.cards.length}
                        </span>
                      </div>
                      <div className="px-2 pb-2 space-y-1.5">
                        {col.cards.map(card => (
                          <div key={card} className="bg-[#0D1117] border border-[#21262D] rounded-md px-2.5 py-2">
                            <p className="text-xs text-[#E6EDF3] font-medium">{card.split('—')[0]}</p>
                            <p className="text-[10px] text-[#7D8590]">{card.split('—')[1]}</p>
                          </div>
                        ))}
                        {col.cards.length === 0 && (
                          <div className="text-center py-3">
                            <span className="text-lg">🎉</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Glow under mockup */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-[#4F8EF7]/10 blur-2xl rounded-full" />
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-6 border-t border-[#21262D]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#E6EDF3] mb-3">
              Everything you need to land the job
            </h2>
            <p className="text-[#7D8590] max-w-xl mx-auto">
              Built specifically for placement season — not a generic todo app repurposed for job hunting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: <Briefcase size={20} />,
                color: '#4F8EF7',
                title: 'Kanban Pipeline',
                desc: 'Drag and drop applications across Saved, Applied, OA, Interview, Offer, and Rejected stages.'
              },
              {
                icon: <Bell size={20} />,
                color: '#D29922',
                title: 'Never Miss a Deadline',
                desc: 'Set deadlines for OAs and interviews. Jobrixa automatically marks them missed if you forget.'
              },
              {
                icon: <BarChart2 size={20} />,
                color: '#3FB950',
                title: 'Real Analytics',
                desc: 'See your response rate, interview rate, and offer rate. Know exactly where your funnel leaks.'
              },
              {
                icon: <Target size={20} />,
                color: '#A371F7',
                title: 'Ghosted Tracker',
                desc: 'Applications with no response after 14 days are automatically marked as ghosted. Know who ghosted you.'
              },
              {
                icon: <Chrome size={20} />,
                color: '#F0883E',
                title: 'Chrome Extension',
                desc: 'One-click add from LinkedIn, Naukri, Internshala, and Wellfound. No copy-pasting required.'
              },
              {
                icon: <Mail size={20} />,
                color: '#EC4899',
                title: 'Gmail Auto-Detect',
                desc: 'Connect Gmail and Jobrixa automatically detects application confirmations, OA links, and rejections.'
              },
            ].map(f => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 hover:border-[#4F8EF7]/30 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: `${f.color}15`, color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold text-[#E6EDF3] mb-2">{f.title}</h3>
                <p className="text-xs text-[#7D8590] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 px-6 border-t border-[#21262D]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#E6EDF3] mb-3">How it works</h2>
            <p className="text-[#7D8590]">Three steps to a organised job hunt</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Add your applications', desc: 'Paste a job URL, use the Chrome extension, or add manually. Takes 10 seconds per job.' },
              { step: '02', title: 'Track every stage', desc: 'Move cards across your pipeline as you progress. Set deadlines so you never miss an OA.' },
              { step: '03', title: 'Analyse and improve', desc: 'See your conversion rates, spot where you\'re getting ghosted, and fix your approach.' },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative"
              >
                <div className="text-5xl font-black text-[#21262D] mb-4">{s.step}</div>
                <h3 className="text-base font-semibold text-[#E6EDF3] mb-2">{s.title}</h3>
                <p className="text-sm text-[#7D8590] leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="py-20 px-6 border-t border-[#21262D]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#E6EDF3] mb-3">Simple pricing</h2>
            <p className="text-[#7D8590]">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Free */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6">
              <p className="text-xs font-semibold text-[#7D8590] uppercase tracking-wider mb-2">Free</p>
              <div className="text-3xl font-bold text-[#E6EDF3] mb-1">₹0</div>
              <p className="text-xs text-[#7D8590] mb-6">Forever free</p>
              <div className="space-y-2 mb-6">
                {['Up to 30 applications', 'Kanban pipeline', 'Basic analytics', 'Chrome extension'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-[#7D8590]">
                    <Check size={14} className="text-[#3FB950]" />
                    {f}
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/register')}
                className="w-full py-2.5 border border-[#30363D] text-[#E6EDF3] rounded-lg text-sm hover:bg-[#1C2128] transition-colors">
                Get started free
              </button>
            </div>
            {/* Pro */}
            <div className="bg-[#161B22] border-2 border-[#4F8EF7]/50 rounded-2xl p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4F8EF7] text-white text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
              <p className="text-xs font-semibold text-[#4F8EF7] uppercase tracking-wider mb-2">Pro</p>
              <div className="text-3xl font-bold text-[#E6EDF3] mb-1">₹149<span className="text-base font-normal text-[#7D8590]">/month</span></div>
              <p className="text-xs text-[#7D8590] mb-6">For serious job hunters</p>
              <div className="space-y-2 mb-6">
                {['Unlimited applications', 'Full analytics & insights', 'Gmail auto-detection', 'Missed & ghosted tracker', 'Priority support'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-[#E6EDF3]">
                    <Check size={14} className="text-[#4F8EF7]" />
                    {f}
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/pricing')}
                className="w-full py-2.5 bg-[#4F8EF7] hover:bg-[#3B7DE8] text-white font-semibold rounded-lg text-sm transition-colors">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-6 border-t border-[#21262D]">
        <div className="max-w-2xl mx-auto text-center">
          <TrendingUp size={32} className="text-[#4F8EF7] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-[#E6EDF3] mb-4">
            Your next offer is one<br />organised job hunt away
          </h2>
          <p className="text-[#7D8590] mb-8">
            Stop tracking jobs in a spreadsheet. Start using a tool built for this.
          </p>
          <button onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 bg-[#4F8EF7] hover:bg-[#3B7DE8] text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-all hover:scale-105">
            Start for free — no credit card needed
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#21262D] py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#4F8EF7] flex items-center justify-center">
              <span className="text-white font-black text-xs">J</span>
            </div>
            <span className="text-sm font-bold text-[#E6EDF3]">Jobrixa</span>
            <span className="text-xs text-[#484F58] ml-2">© 2026</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-[#484F58]">
            <span className="hover:text-[#7D8590] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#7D8590] cursor-pointer">Terms</span>
            <span className="hover:text-[#7D8590] cursor-pointer">Contact</span>
            <span className="text-[#484F58]">support@jobrixa.app</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
