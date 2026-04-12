import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart2, Briefcase, Bell, Chrome, Mail,
  ArrowRight, Ghost, Laptop, Mic, Trophy, Rocket, Clipboard, Menu, X
} from 'lucide-react';
import { useState } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How it works', href: '#how' },
    { name: 'Pricing', href: '/pricing' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] overflow-x-hidden">
      
      {/* BETA BANNER */}
      <div className="bg-[#00D084] text-white py-2.5 px-4 text-center text-sm font-medium z-[60] relative">
        <span>🎉 Beta Launch: All Pro features are completely free for the first 1,000 students. </span>
        <button onClick={() => navigate('/register')} className="underline font-bold ml-1 hover:text-white/80 transition-colors">
          Register now to lock in your early access →
        </button>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[var(--bg-main)]/80 backdrop-blur-md border-b border-[var(--border)] h-16">
        <div className="container-custom h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/20 text-white">
              <span className="font-black text-lg">J</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Jobrixa</span>
          </div>

          {/* Nav Links - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[var(--text-secondary)] hover:text-white transition-colors text-sm font-medium"
                onClick={(e) => {
                  if (link.href.startsWith('#')) {
                    e.preventDefault();
                    document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate(link.href);
                  }
                }}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-white px-4 py-2 transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/register')}
              className="btn-primary py-2 px-5 text-sm"
            >
              Get started free
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-[var(--text-secondary)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-[var(--bg-main)] border-b border-[var(--border)] p-6 fade-in">
            <nav className="flex flex-col gap-4 mb-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-[var(--text-secondary)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/login')}
                className="btn-outline w-full"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/register')}
                className="btn-primary w-full"
              >
                Get started free
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="section-spacing relative overflow-hidden flex items-center justify-center min-h-[calc(100vh-104px)]">
        {/* Background Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-full px-4 py-1.5 text-xs text-[var(--text-secondary)] font-medium mb-8"
              >
                <span className="text-[var(--primary)] text-lg">⚡</span>
                Built for Indian students & fresh graduates
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-8"
              >
                Stop losing track of <br />
                <span className="text-[var(--primary)]">your job applications</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto lg:mx-0 mb-10 leading-relaxed"
              >
                Jobrixa tracks every application, reminds you about OAs and interviews, and shows you exactly why you're not getting responses. Your placement season, finally under control.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <button
                  onClick={() => navigate('/register')}
                  className="btn-primary text-base px-8 py-4 shadow-xl shadow-[var(--primary)]/20 w-full sm:w-auto"
                >
                  Start tracking for free
                  <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-secondary text-base px-8 py-4 w-full sm:w-auto"
                >
                  Sign in to your account
                </button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="absolute -inset-4 bg-[var(--primary)]/10 blur-3xl rounded-full" />
              <img 
                src="/images/career-growth.png" 
                alt="Career growth illustration" 
                className="relative w-full h-auto max-w-[550px] mx-auto drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* PIPELINE PREVIEW */}
      <section className="py-20 bg-[var(--bg-main)]/50 border-y border-[var(--border)]">
        <div className="container-custom">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl">
            {/* Header Mockup */}
            <div className="bg-[var(--bg-main)]/50 border-b border-[var(--border)] px-6 py-4 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="flex-1 text-center text-xs text-[var(--text-tertiary)] font-mono">
                jobrixa.app/dashboard/pipeline
              </div>
            </div>

            <div className="p-6 md:p-8 overflow-x-auto">
              <div className="flex gap-6 min-w-max">
                {[
                  { label: 'SAVED', icon: <Rocket size={14} />, count: 2, color: 'var(--text-tertiary)', companies: [{ name: 'Swiggy', pos: 'SDE-1' }, { name: 'Razorpay', pos: 'Backend Intern' }] },
                  { label: 'APPLIED', icon: <Clipboard size={14} />, count: 2, color: 'var(--primary)', companies: [{ name: 'Google', pos: 'Software Engineer' }, { name: 'Microsoft', pos: 'Program Manager' }] },
                  { label: 'OA/ASSESSMENT', icon: <Laptop size={14} />, count: 1, color: 'var(--accent-orange)', companies: [{ name: 'Flipkart', pos: 'Associate SDE' }] },
                  { label: 'INTERVIEW', icon: <Mic size={14} />, count: 1, color: 'var(--accent-purple)', companies: [{ name: 'CRED', pos: 'Frontend Dev' }] },
                  { label: 'OFFER', icon: <Trophy size={14} />, count: 1, color: 'var(--accent-green)', companies: [{ name: 'Zomato', pos: 'SDE' }] },
                ].map(col => (
                  <div key={col.label} className="w-64 flex-shrink-0">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <div className="flex items-center gap-2">
                        <span style={{ color: col.color }}>{col.icon}</span>
                        <span className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                          {col.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold bg-[var(--border)] text-[var(--text-secondary)] px-2 py-0.5 rounded-full">
                        {col.count}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {col.companies.map((comp, idx) => (
                        <div key={idx} className="bg-[var(--bg-main)] border border-[var(--border)] rounded-xl p-4 shadow-sm">
                          <p className="text-sm font-bold text-white mb-1">{comp.name}</p>
                          <p className="text-xs text-[var(--text-secondary)]">{comp.pos}</p>
                        </div>
                      ))}
                      {col.companies.length === 0 && (
                        <div className="border border-dashed border-[var(--border)] rounded-xl h-24 flex items-center justify-center text-[var(--text-tertiary)] text-xs">
                          No items yet
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="section-spacing">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to land the job</h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto mb-16">
            Built specifically for placement season — not a generic todo app repurposed for job hunting.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Kanban Pipeline',
                desc: 'Drag and drop applications across Saved, Applied, OA, Interview, Offer, and Rejected stages.',
                icon: <Briefcase className="text-[var(--primary)]" />
              },
              {
                title: 'Never Miss a Deadline',
                desc: 'Set deadlines for OAs and interviews. Jobrixa automatically marks them missed if you forget.',
                icon: <Bell className="text-[var(--accent-orange)]" />
              },
              {
                title: 'Real Analytics',
                desc: 'See your response rate, interview rate, and offer rate. Know exactly where your funnel leaks.',
                icon: <BarChart2 className="text-[var(--accent-green)]" />
              },
              {
                title: 'Ghosted Tracker',
                desc: 'Applications with no response after 14 days are automatically marked as ghosted. Know who ghosted you.',
                icon: <Ghost className="text-[var(--accent-purple)]" />
              },
              {
                title: 'Chrome Extension',
                desc: 'One-click add from LinkedIn, Naukri, Internshala, and Wellfound. No copy-pasting required.',
                icon: <Chrome className="text-[#F0883E]" />
              },
              {
                title: 'Gmail Auto-Detect',
                desc: 'Connect Gmail and Jobrixa automatically detects application confirmations, OA links, and rejections.',
                icon: <Mail className="text-[var(--accent-red)]" />
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="card card-hover text-left flex flex-col gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-main)] border border-[var(--border)] flex items-center justify-center text-xl shadow-inner">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="section-spacing bg-[var(--bg-card)]/30 border-y border-[var(--border)]">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
          <p className="text-[var(--text-secondary)] mb-16 underline-offset-4">Three steps to a organised job hunt</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Step Connectors (Desktop) */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px border-t border-dashed border-[var(--border)] z-0" />
            
            {[
              {
                num: '01',
                title: 'Add your applications',
                desc: 'Paste a job URL, use the Chrome extension, or add manually. Takes 10 seconds per job.'
              },
              {
                num: '02',
                title: 'Track every stage',
                desc: 'Move cards across your pipeline as you progress. Set deadlines so you never miss an OA.'
              },
              {
                num: '03',
                title: 'Analyse and improve',
                desc: 'See your conversion rates, spot where you\'re getting ghosted, and fix your approach.'
              }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className="text-5xl md:text-6xl font-black text-[var(--border)]/50 mb-6 group-hover:text-[var(--primary)]/20 transition-colors">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{
        padding: '80px 20px',
        backgroundColor: '#0A0E27',
        textAlign: 'center',
        borderTop: '1px solid #1E293B',
      }}>
        <div className="container-custom">
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '12px',
            color: '#FFFFFF',
          }}>
            Simple pricing
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#A0AEC0',
            marginBottom: '48px',
          }}>
            Start free. Upgrade when you need more.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            maxWidth: '900px',
            margin: '0 auto',
          }}>
            {/* FREE PLAN */}
            <div style={{
              backgroundColor: '#0F1419',
              border: '1px solid #1E293B',
              borderRadius: '12px',
              padding: '40px 32px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '700',
                textTransform: 'uppercase',
                color: '#A0AEC0',
                marginBottom: '16px',
                letterSpacing: '0.1em'
              }}>
                FREE
              </h3>
              <div style={{
                fontSize: '48px',
                fontWeight: '800',
                marginBottom: '8px',
                color: '#FFFFFF',
              }}>
                ₹0
              </div>
              <p style={{
                fontSize: '14px',
                color: '#A0AEC0',
                marginBottom: '32px',
              }}>
                Forever
              </p>

              <ul style={{
                textAlign: 'left',
                listStyle: 'none',
                padding: 0,
                marginBottom: '32px',
                flex: 1
              }}>
                {[
                  'Up to 30 applications',
                  'Kanban pipeline',
                  'Basic analytics',
                  'Chrome extension'
                ].map((f, i) => (
                  <li key={i} style={{
                    padding: '12px 0',
                    fontSize: '13px',
                    color: '#A0AEC0',
                    borderBottom: i === 3 ? 'none' : '1px solid #1E293B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ color: '#00D084' }}>✓</span> {f}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => navigate('/register')}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: 'transparent',
                  border: '1px solid #1E293B',
                  color: '#5B9FFF',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '700',
                  transition: 'all 0.2s'
                }}
              >
                Get started free
              </button>
            </div>

            {/* PRO PLAN */}
            <div style={{
              backgroundColor: '#5B9FFF',
              borderRadius: '12px',
              padding: '40px 32px',
              textAlign: 'center',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(91, 159, 255, 0.2)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                position: 'absolute',
                top: '-14px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#FFFFFF',
                color: '#5B9FFF',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '800',
                textTransform: 'uppercase',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                MOST POPULAR
              </div>

              <h3 style={{
                fontSize: '14px',
                fontWeight: '700',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                marginBottom: '16px',
                marginTop: '8px',
                letterSpacing: '0.1em'
              }}>
                PRO
              </h3>
              <div style={{
                fontSize: '48px',
                fontWeight: '800',
                marginBottom: '8px',
                color: '#FFFFFF',
              }}>
                ₹149
              </div>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '32px',
              }}>
                /month
              </p>

              <ul style={{
                textAlign: 'left',
                listStyle: 'none',
                padding: 0,
                marginBottom: '32px',
                color: '#FFFFFF',
                flex: 1
              }}>
                {[
                  'Unlimited applications',
                  'Full analytics & insights',
                  'Gmail auto-detection',
                  'Ghosted tracker',
                  'Priority support',
                  'CSV export'
                ].map((f, i) => (
                  <li key={i} style={{
                    padding: '12px 0',
                    fontSize: '13px',
                    borderBottom: i === 5 ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>✓</span> {f}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => navigate('/pricing')}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#FFFFFF',
                  color: '#5B9FFF',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '700',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION - MUST BE CENTERED */}
      <section style={{
        textAlign: 'center',
        padding: '80px 24px',
        backgroundColor: '#0A0E27',
        borderTop: '1px solid #1E293B',
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#FFFFFF',
          }}>
            Your next offer is one organised job hunt away
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#A0AEC0',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            Stop tracking jobs in a spreadsheet. Start using a tool built for this.
          </p>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '16px 32px',
              backgroundColor: '#5B9FFF',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(91, 159, 255, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Start for free — no credit card needed →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-[var(--border)]">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--primary)] flex items-center justify-center text-white text-[10px] font-bold">
              J
            </div>
            <span className="font-bold text-lg">Jobrixa</span>
          </div>
          
          <div className="flex gap-8 text-[var(--text-tertiary)] text-sm">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">support@jobrixa.app</span>
          </div>
          
          <div className="text-[var(--text-tertiary)] text-sm">
            © 2026 Jobrixa. Made for students.
          </div>
        </div>
      </footer>
    </div>
  );
}
