import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Check, Zap,
} from 'lucide-react';


export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#1c2128] overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff]/80 backdrop-blur-md border-b border-[#f6f8fa] shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#4F8EF7] to-[#3B7DE8] flex items-center justify-center shadow-lg shadow-[#4F8EF7]/20">
              <span className="text-[#f6f8fa] font-black text-base">J</span>
            </div>
            <span className="font-bold text-[#1c2128] text-lg tracking-tight">Jobrixa</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-[#57606a]">
            <span onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-[#1c2128] cursor-pointer transition-colors">Features</span>
            <span onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-[#1c2128] cursor-pointer transition-colors">How it works</span>
            <span onClick={() => navigate('/pricing')}
              className="hover:text-[#1c2128] cursor-pointer transition-colors">Pricing</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')}
              className="text-sm text-[#57606a] hover:text-[#1c2128] transition-colors px-3 py-1.5">
              Sign in
            </button>
            <button onClick={() => navigate('/register')}
              className="text-sm bg-[#4F8EF7] hover:bg-[#3B7DE8] text-[#f6f8fa] font-medium px-4 py-1.5 rounded-lg transition-colors">
              Get started free
            </button>
          </div>
        </div>
      </nav>

      {/* BETA BANNER */}
      <div style={{
        background: 'linear-gradient(90deg, #1e293b, #0f172a)',
        borderBottom: '1px solid #4F8EF7',
        padding: '10px 24px',
        textAlign: 'center' as const,
        fontSize: '14px',
        color: '#3B7DE8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '56px' // offset for fixed nav
      }}>
        <span>🎉</span>
        <span>
          <strong>Beta Launch:</strong> All Pro features are completely free for the first 1,000 students. 
          <a href="/register" style={{ color: '#0969da', marginLeft: '6px', textDecoration: 'underline' }}>
            Register now to lock in your early access →
          </a>
        </span>
      </div>

      {/* HERO */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden" style={{
        backgroundColor: '#ffffff',
        backgroundImage: 'radial-gradient(circle, #4F8EF720 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        position: 'relative'
      }}>
        {/* Glow blob behind illustration */}
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, #4F8EF718 0%, transparent 70%)',
          borderRadius: '50%',
          right: '-50px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          {/* Left Column */}
          <div className="flex-1 text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-[#4F8EF715] border border-[#4F8EF730] rounded-full px-4 py-1.5 text-xs text-[#3B7DE8] font-medium mb-6"
            >
              <Zap size={11} />
              Built for Indian students & fresh graduates
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                fontSize: '52px',
                fontWeight: 700,
                lineHeight: 1.2,
                background: 'linear-gradient(135deg, #f6f8fa 0%, #4F8EF7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '24px'
              }}
            >
              Stop losing track of<br />
              your job applications
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-[#57606a] mb-8 leading-relaxed max-w-lg"
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
              className="flex items-center gap-4 flex-wrap"
            >
              <button onClick={() => navigate('/register')}
                className="flex items-center gap-2 bg-[#4F8EF7] hover:bg-[#3B7DE8] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all hover:scale-105 shadow-sm">
                Start tracking for free
                <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate('/login')}
                className="flex items-center gap-2 bg-white hover:bg-[#f6f8fa] border border-[#d0d7de] text-[#f6f8fa] font-medium px-6 py-3 rounded-xl text-sm transition-colors shadow-sm">
                Sign in
              </button>
            </motion.div>

            {/* Social Proof Line */}
            <p style={{ color: '#57606a', fontSize: '13px', marginTop: '16px' }}>
              🎓 Built for Indian placement season · Free for students
            </p>
          </div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex-1 flex justify-center order-last md:order-none"
          >
            <img
              src="/images/hero-student.jpg"
              alt="Student searching for jobs"
              style={{
                width: '100%',
                maxWidth: '480px',
                height: '420px',
                objectFit: 'cover',
                borderRadius: '20px',
                boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
                border: '1px solid #f6f8fa'
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-20 px-10 border-t border-[#f6f8fa]">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center gap-[60px]">
          {/* Left Column - Image */}
          <div className="flex-1 flex justify-center">
            <img
              src="/images/stressed-student.jpg"
              alt="Stressed student during placement season"
              style={{
                width: '100%',
                maxWidth: '440px',
                height: '360px',
                objectFit: 'cover',
                borderRadius: '16px',
                boxShadow: '0 16px 48px rgba(0,0,0,0.5)'
              }}
            />
          </div>
          {/* Right Column - Text */}
          <div className="flex-1">
            <p style={{ color: '#4F8EF7', fontSize: '13px', fontWeight: 600, 
              letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
              Sound familiar?
            </p>
            <h2 style={{ color: '#fff', fontSize: '36px', fontWeight: 700, 
              lineHeight: 1.3, marginBottom: '20px' }}>
              Placement season is overwhelming
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                '😓 Tracking 40+ applications in a messy Excel sheet',
                '⏰ Missing OA deadlines because you forgot to check',
                '👻 No idea which companies are ghosting you',
                '📊 Zero visibility into your own job search progress'
              ].map((pain, i) => (
                <p key={i} style={{ color: '#57606a', fontSize: '15px', 
                  display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  {pain}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 border-t border-[#f6f8fa]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1c2128] mb-4">
              Everything you need to land the job
            </h2>
            <p className="text-[#57606a] max-w-xl mx-auto">
              Built specifically for placement season — not a generic todo app repurposed for job hunting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                icon: '📋', 
                title: 'Never Miss a Deadline', 
                desc: 'Track every OA and interview date in one place.',
                image: '/images/job-application.jpg'
              },
              { 
                icon: '📊', 
                title: 'Track Every Interview', 
                desc: 'Organize your prep and feedback for every round and stage.',
                image: '/images/interview-table.jpg'
              },
              { icon: '🏢', title: 'Real Company Logos', desc: 'Every card shows the company logo automatically.' },
              { icon: '🔍', title: 'Discover Jobs', desc: 'Find openings from real sources, built for Indian students.' },
              { icon: '😔', title: 'Track Rejections Too', desc: 'Rejections are data. Learn from every one.' },
              { icon: '🆓', title: 'Free for First 1,000', desc: 'You\'re early. All Pro features are yours at no cost.' },
            ].map(f => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                style={{
                  background: '#ffffff',
                  border: '1px solid #d0d7de',
                  borderRadius: '12px',
                  padding: '24px',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                }}
                className="hover:translate-y-[-4px] hover:shadow-[0_8px_24px_rgba(140,149,159,0.15)] hover:border-[#3B7DE840] cursor-default overflow-hidden shadow-sm"
              >
                {('image' in f) && (
                  <img
                    src={f.image as string}
                    alt={f.title}
                    style={{
                      width: '100%',
                      height: '140px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '16px'
                    }}
                  />
                )}
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-[#f6f8fa] mb-2">{f.title}</h3>
                <p className="text-sm text-[#57606a] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 border-t border-[#f6f8fa] bg-[#f6f8fa]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#f6f8fa] mb-12">
            What students are saying 💬
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Priya S.",
                college: "VIT Vellore, CSE 4th year",
                text: "I was tracking 30 apps in Google Sheets and missing deadlines. Jobrixa saved my placement season.",
                seed: "priya"
              },
              {
                name: "Rahul M.",
                college: "BITS Pilani, ECE 3rd year",
                text: "The ghosting tracker is genius. I finally know which companies never reply so I stop wasting time.",
                seed: "rahul"
              },
              {
                name: "Ananya K.",
                college: "NIT Trichy, IT 4th year",
                text: "Looks exactly like a professional product. My friends thought I was using some paid tool.",
                seed: "ananya"
              }
            ].map(t => (
              <div key={t.name} style={{
                background: '#ffffff',
                border: '1px solid #d0d7de',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.seed}&backgroundColor=b6e3f4`}
                    alt={t.name}
                    style={{ width: '44px', height: '44px', borderRadius: '50%' }}
                  />
                  <div>
                    <p className="text-[#f6f8fa] font-bold text-sm">{t.name}</p>
                    <p className="text-[#57606a] text-xs">{t.college}</p>
                  </div>
                </div>
                <p style={{ color: '#f6f8fa', fontStyle: 'italic', fontSize: '14px', lineHeight: '1.6' }}>
                  "{t.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 px-6 border-t border-[#f6f8fa]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#f6f8fa] mb-3">How it works</h2>
            <p className="text-[#57606a]">Three steps to a organised job hunt</p>
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
                <div className="text-5xl font-black text-[#f6f8fa] mb-4">{s.step}</div>
                <h3 className="text-base font-semibold text-[#f6f8fa] mb-2">{s.title}</h3>
                <p className="text-sm text-[#57606a] leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="py-20 px-6 border-t border-[#f6f8fa]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#f6f8fa] mb-3">Simple pricing</h2>
            <p className="text-[#57606a]">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Free */}
            <div className="bg-[#ffffff] border border-[#d0d7de] rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-semibold text-[#57606a] uppercase tracking-wider mb-2">Free</p>
              <div className="text-3xl font-bold text-[#f6f8fa] mb-1">₹0</div>
              <p className="text-xs text-[#57606a] mb-6">Forever free</p>
              <div className="space-y-2 mb-6">
                {['Up to 30 applications', 'Kanban pipeline', 'Basic analytics', 'Chrome extension'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-[#57606a]">
                    <Check size={14} className="text-[#3B7DE8]" />
                    {f}
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/register')}
                className="w-full py-2.5 border border-[#d0d7de] text-[#f6f8fa] font-semibold rounded-lg text-sm hover:bg-[#f6f8fa] transition-colors">
                Get started free
              </button>
            </div>
            {/* Pro */}
            <div className="bg-[#ffffff] border-[#d0d7de] border-[#4F8EF7]/50 rounded-2xl p-6 relative shadow-sm">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4F8EF7] text-[#1c2128] text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
              <p className="text-xs font-semibold text-[#4F8EF7] uppercase tracking-wider mb-2">Pro</p>
              <div className="text-3xl font-bold text-[#f6f8fa] mb-1">₹149<span className="text-base font-normal text-[#57606a]">/month</span></div>
              <p className="text-xs text-[#57606a] mb-6">For serious job hunters</p>
              <div className="space-y-2 mb-6">
                {['Unlimited applications', 'Full analytics & insights', 'Gmail auto-detection', 'Missed & ghosted tracker', 'Priority support'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-[#f6f8fa]">
                    <Check size={14} className="text-[#4F8EF7]" />
                    {f}
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/pricing')}
                className="w-full py-2.5 bg-[#4F8EF7] hover:bg-[#3B7DE8] text-[#1c2128] font-semibold rounded-lg text-sm transition-colors">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-20 px-6 border-t border-[#d0d7de]">
        <div style={{
          background: '#ffffff',
          border: '1px solid #d0d7de',
          borderRadius: '16px',
          padding: '60px 40px',
          textAlign: 'center',
          margin: '60px auto',
          maxWidth: '700px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src="/images/interview-success.jpg"
              alt="Confident student at interview"
              style={{
                width: '200px',
                height: '200px',
                objectFit: 'cover',
                objectPosition: 'top',
                borderRadius: '50%',
                border: '3px solid #4F8EF7',
                marginBottom: '24px',
                boxShadow: '0 8px 32px rgba(79,142,247,0.3)'
              }}
            />
          </div>
          <div className="text-5xl mb-6">🚀</div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#f6f8fa] mb-4">
            Your placement season starts now
          </h2>
          <p className="text-[#57606a] mb-10 max-w-md mx-auto">
            Free for the first 1,000 students. No credit card. No catch.
          </p>
          <button onClick={() => navigate('/register')}
            style={{
              background: '#4F8EF7',
              color: 'white',
              padding: '14px 32px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
            className="hover:bg-[#3B7DE8] hover:scale-[1.02] shadow-lg shadow-[#4F8EF720]">
            Get Started Now
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#f6f8fa] py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#4F8EF7] flex items-center justify-center">
              <span className="text-[#f6f8fa] font-black text-xs">J</span>
            </div>
            <span className="text-sm font-bold text-[#1c2128]">Jobrixa</span>
            <span className="text-xs text-[#8c959f] ml-2">© 2026</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-[#8c959f]">
            <span className="hover:text-[#57606a] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#57606a] cursor-pointer">Terms</span>
            <span className="hover:text-[#57606a] cursor-pointer">Contact</span>
            <span className="text-[#8c959f]">support@jobrixa.app</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
