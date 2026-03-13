import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Terminal, 
  Search, 
  Trello, 
  Zap, 
  ArrowRight, 
  Github, 
  Globe, 
  Shield, 
  ChevronRight,
  Layout,
  PieChart,
  Target
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3] selection:bg-[#4F8EF7]/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D1117]/80 backdrop-blur-md border-b border-[#21262D]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#4F8EF7] to-[#3B7DE8] flex items-center justify-center shadow-lg shadow-[#4F8EF7]/20">
              <span className="text-white font-black text-base tracking-tighter">J</span>
            </div>
            <span className="font-display font-bold text-lg tracking-tight">Jobrixa</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-[#7D8590] hover:text-[#E6EDF3] transition-colors">Features</a>
            <a href="#workflow" className="text-sm text-[#7D8590] hover:text-[#E6EDF3] transition-colors">Workflow</a>
            <a href="#pricing" className="text-sm text-[#7D8590] hover:text-[#E6EDF3] transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/login")}
              className="text-sm font-medium text-[#7D8590] hover:text-[#E6EDF3] transition-colors"
            >
              Sign in
            </button>
            <button 
              onClick={() => navigate("/register")}
              className="px-4 py-2 bg-[#E6EDF3] hover:bg-[#FFFFFF] text-[#0D1117] rounded-lg text-sm font-bold shadow-sm transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#4F8EF7]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#3B7DE8]/10 rounded-full blur-[80px] pointer-events-none animate-pulse" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4F8EF7]/10 border border-[#4F8EF7]/20 text-[#4F8EF7] text-xs font-bold mb-8">
              <Zap size={14} className="fill-current" />
              <span>THE MODERN JOB TRACKER FOR ENGINEERS</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight mb-6 leading-[1.1]">
              Stop using <span className="text-[#7D8590] line-through decoration-[#F85149]">spreadsheets</span><br />
              Track jobs like a <span className="text-[#4F8EF7]">pro</span>.
            </h1>
            
            <p className="text-xl text-[#7D8590] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Jobrixa helps you organize your job hunt pipeline, discover top openings, 
              and track every stage from application to offer. All in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <button 
                onClick={() => navigate("/register")}
                className="w-full sm:w-auto px-8 py-4 bg-[#4F8EF7] hover:bg-[#3B7DE8] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#4F8EF7]/20 transition-all transform hover:translate-y-[-2px] active:translate-y-[0px]"
              >
                Start for free <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => window.open('https://github.com/your-username/jobrixa', '_blank')}
                className="w-full sm:w-auto px-8 py-4 bg-[#161B22] border border-[#30363D] hover:border-[#4F8EF7]/50 text-[#E6EDF3] rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Github size={18} /> View on GitHub
              </button>
            </div>

            {/* Dashboard Mockup Shadow */}
            <div className="relative max-w-5xl mx-auto mt-12 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#4F8EF7]/30 to-[#3B7DE8]/30 rounded-2xl blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
              <div className="relative bg-[#0D1117] border border-[#30363D] rounded-2xl overflow-hidden shadow-2xl">
                {/* Simulated UI Glass Header */}
                <div className="h-8 bg-[#161B22] border-b border-[#30363D] flex items-center gap-1.5 px-4">
                  <div className="w-2 h-2 rounded-full bg-[#F85149]" />
                  <div className="w-2 h-2 rounded-full bg-[#D29922]" />
                  <div className="w-2 h-2 rounded-full bg-[#3FB950]" />
                </div>
                <img 
                  src="https://illustrations.popsy.co/amber/remote-work.svg" 
                  alt="Jobrixa Pipeline illustration" 
                  className="w-full h-auto max-h-[500px] object-cover bg-[#0D1117]/50 p-12"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 relative bg-[#0D1117]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Built for clarity.</h2>
            <p className="text-[#7D8590] max-w-xl mx-auto font-medium">Everything you need to manage a high-volume job search without the burnout.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Trello className="text-[#4F8EF7]" />,
                title: "Visual Pipeline",
                desc: "Drag-and-drop Kanban board to manage job stages from Saved to Offer."
              },
              {
                icon: <Search className="text-[#3FB950]" />,
                title: "Job Discovery",
                desc: "Integrated search to find roles across LinkedIn, JSearch, and more in real-time."
              },
              {
                icon: <PieChart className="text-amber-500" />,
                title: "Real Analytics",
                desc: "Track your conversion rates, response times, and identify where you're ghosted."
              },
              {
                icon: <Terminal className="text-[#4F8EF7]" />,
                title: "Fast API Engine",
                desc: "Powered by Spring Boot 3 for lightning-fast performance and data security."
              },
              {
                icon: <Shield className="text-[#F85149]" />,
                title: "Secure Auth",
                desc: "Google OAuth integration and robust JWT-based session management."
              },
              {
                icon: <Globe className="text-[#4F8EF7]" />,
                title: "Universal Access",
                desc: "Fully responsive mobile experience so you can update status on the go."
              }
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 bg-[#161B22] border border-[#21262D] rounded-2xl hover:border-[#4F8EF7]/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0D1117] border border-[#30363D] flex items-center justify-center mb-6 group-hover:bg-[#4F8EF7]/10 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-sm text-[#7D8590] leading-relaxed line-clamp-2">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Content */}
      <section id="workflow" className="py-24 px-6 border-t border-[#21262D] bg-[#0D1117]/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                Your entire job hunt <br />
                <span className="text-[#4F8EF7]">on autopilot.</span>
              </h2>
              
              <div className="space-y-6">
                {[
                  { icon: <Target />, title: "Track Goals", desc: "Set weekly application targets and see your progress in real-time." },
                  { icon: <Layout />, title: "Custom Stages", desc: "Adapt the pipeline to your specific interview process and flow." },
                  { icon: <ChevronRight />, title: "Smart Reminders", desc: "Get alerted about the assessments or interviews you might miss." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#4F8EF7]/10 text-[#4F8EF7] flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#E6EDF3]">{item.title}</h4>
                      <p className="text-sm text-[#7D8590] mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#4F8EF7]/20 to-transparent rounded-full blur-3xl" />
              <img 
                src="https://illustrations.popsy.co/amber/man-with-a-laptop.svg" 
                alt="Productivity illustration" 
                className="w-full max-w-md mx-auto relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#4F8EF7]/5" />
        <div className="max-w-5xl mx-auto bg-gradient-to-tr from-[#161B22] to-[#0D1117] border border-[#4F8EF7]/30 rounded-[32px] p-12 md:p-20 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-6">Ready to get hired?</h2>
          <p className="text-[#7D8590] text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
            Join thousands of developers using Jobrixa to track their journey 
            and land their dream roles.
          </p>
          <button 
            onClick={() => navigate("/register")}
            className="px-10 py-5 bg-[#4F8EF7] hover:bg-[#3B7DE8] text-white rounded-2xl font-black text-lg shadow-xl shadow-[#4F8EF7]/30 transition-all transform hover:scale-105 active:scale-95"
          >
            Create Your Account — It's Free
          </button>
          <p className="mt-6 text-xs text-[#484F58] font-bold uppercase tracking-widest">NO CREDIT CARD REQUIRED</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#21262D]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 opacity-60">
            <div className="w-6 h-6 rounded bg-[#7D8590] flex items-center justify-center">
              <span className="text-[#0D1117] font-black text-xs">J</span>
            </div>
            <span className="font-display font-bold text-sm tracking-tight">Jobrixa</span>
            <span className="text-[#484F58] text-[10px] ml-2">© 2026 Jobrixa Platform. Built with passion.</span>
          </div>

          <div className="flex items-center gap-8 text-[#484F58] font-bold text-xs uppercase tracking-widest">
            <a href="#" className="hover:text-[#7D8590] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#7D8590] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#7D8590] transition-colors">Security</a>
            <a href="https://github.com/your-username/jobrixa" target="_blank" rel="noopener noreferrer" className="hover:text-[#7D8590] transition-colors">Github</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
