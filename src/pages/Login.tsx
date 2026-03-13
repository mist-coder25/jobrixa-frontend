import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import { toast } from "../components/Toast";
import { Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = () => {
    toast.success('Google login coming soon! Use email for now 🚀');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("jobrixa_token", response.data.token);
      localStorage.setItem("jobrixa_user", email.split('@')[0]);
      navigate("/pipeline");
      toast.success("Successfully logged in!");
    } catch (err) {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] flex">
      {/* Left side — form */}
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#4F8EF7]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#A371F7]/6 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-sm bg-[#161B22] border border-[#30363D] rounded-2xl p-8 shadow-2xl shadow-black/50">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#4F8EF7] flex items-center justify-center">
                <span className="text-white font-black text-sm">J</span>
              </div>
              <span className="font-bold text-[#E6EDF3] text-lg">Jobrixa</span>
            </div>
            <h1 className="text-xl font-semibold text-[#E6EDF3]">Welcome back</h1>
            <p className="text-sm text-[#7D8590] mt-1">Sign in to your Jobrixa account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg text-[#E6EDF3] text-sm placeholder:text-[#484F58] focus:outline-none focus:border-[#4F8EF7] focus:ring-1 focus:ring-[#4F8EF7] transition-colors"
                placeholder="Email address"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-end mb-1">
                <span onClick={() => navigate('/forgot-password')} className="text-xs text-[#4F8EF7] hover:text-[#3B7DE8] transition-colors cursor-pointer hover:underline">Forgot password?</span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg text-[#E6EDF3] text-sm placeholder:text-[#484F58] focus:outline-none focus:border-[#4F8EF7] focus:ring-1 focus:ring-[#4F8EF7] transition-colors"
                placeholder="Password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 bg-[#4F8EF7] hover:bg-[#3B7DE8] text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#30363D]" />
            <span className="text-xs text-[#7D8590]">or</span>
            <div className="flex-1 h-px bg-[#30363D]" />
          </div>

          <button type="button" onClick={handleGoogleAuth} className="w-full py-2.5 bg-[#1C2128] hover:bg-[#22272E] border border-[#30363D] text-[#E6EDF3] font-medium rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="mt-6 text-center text-sm text-[#7D8590]">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#4F8EF7] font-medium hover:text-[#3B7DE8] transition-colors">
              Create one
            </Link>
          </div>
        </div>
      </div>

      {/* Right side — illustration panel */}
      <div className="hidden lg:flex flex-1 bg-[#161B22] border-l border-[#21262D] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4F8EF7]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#3FB950]/5 rounded-full blur-3xl" />
        
        <img
          src="https://illustrations.popsy.co/gray/work-from-home.svg"
          alt="Job tracking illustration"
          className="w-72 h-72 object-contain mb-8 opacity-90"
        />
        
        <h2 className="text-2xl font-bold text-[#E6EDF3] text-center mb-3">
          Your job hunt,<br />
          <span style={{color: '#4F8EF7'}}>finally organized.</span>
        </h2>
        <p className="text-sm text-[#7D8590] text-center max-w-xs leading-relaxed">
          Track every application, ace every interview, and land the job you deserve.
        </p>

        <div className="mt-8 space-y-3 w-full max-w-xs">
          {[
            { icon: '📋', title: 'Track every application', desc: 'Kanban board across all stages' },
            { icon: '📊', title: 'Real-time analytics', desc: 'Response rates, interview rates, more' },
            { icon: '🔔', title: 'Never miss a deadline', desc: 'Auto-tracks OAs and interviews' },
          ].map(f => (
            <div key={f.title} className="flex items-center gap-3 bg-[#1C2128] border border-[#30363D] rounded-xl px-4 py-3">
              <span style={{ fontSize: '16px' }}>{f.icon}</span>
              <div>
                <p className="text-xs font-semibold text-[#E6EDF3]">{f.title}</p>
                <p className="text-xs text-[#7D8590]">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
