import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import { toast } from "../components/Toast";
import { Loader2, Target, CheckCircle2 } from "lucide-react";

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
      localStorage.setItem("jobrixa_user", response.data.user?.fullName || email.split('@')[0]);
      if (response.data.user?.plan) {
        localStorage.setItem("jobrixa_plan", response.data.user.plan);
      }
      navigate("/dashboard");
      toast.success("Successfully logged in!");
    } catch (err) {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex">
      {/* Left side — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-12 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white">
              <span className="font-black text-lg">J</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Jobrixa</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-[var(--text-secondary)]">Sign in to your Jobrixa account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" style={{ marginBottom: 0 }}>Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-[var(--primary)] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-xs text-[var(--text-tertiary)] font-bold uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <button 
            type="button" 
            onClick={handleGoogleAuth} 
            className="w-full btn-outline py-3.5 flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
            Don't have an account?{" "}
            <Link to="/register" className="text-[var(--primary)] font-bold hover:underline ml-1">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right side — Branding */}
      <div className="hidden lg:flex flex-1 bg-[var(--bg-card)] border-l border-[var(--border)] items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[100px]" />
        
        <div className="max-w-md text-center">
          <div className="mb-10 inline-flex p-6 rounded-3xl bg-gradient-to-br from-pink-500/10 to-purple-600/10 border border-white/5 shadow-2xl">
            <Target size={80} className="text-transparent bg-clip-content bg-gradient-to-br from-pink-500 to-purple-600" style={{ fill: 'none', stroke: 'url(#target-gradient)' }} />
            <svg width="0" height="0">
              <linearGradient id="target-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#9333ea" />
              </linearGradient>
            </svg>
          </div>
          <h2 className="text-4xl font-bold mb-6">
            Your job hunt, <br />
            <span className="text-[var(--primary)]">finally organized.</span>
          </h2>
          
          <div className="space-y-4 text-left mt-12 bg-[var(--bg-main)]/50 p-6 rounded-2xl border border-[var(--border)]">
            {[
              "Track every application with ease",
              "Real-time analytics & response tracking",
              "Never miss a deadline again"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[var(--primary)] flex-shrink-0" />
                <span className="text-[var(--text-secondary)] font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
