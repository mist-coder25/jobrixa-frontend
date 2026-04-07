import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import { toast } from "../components/Toast";
import { Loader2 } from "lucide-react";
import PasswordStrength from "../components/PasswordStrength";

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showStrength, setShowStrength] = useState(false);

  const handleGoogleAuth = () => {
    toast.success('Google login coming soon! Use email for now 🚀');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/register", { fullName, email, password });
      localStorage.setItem("jobrixa_token", response.data.token);
      localStorage.setItem("jobrixa_user", fullName);
      localStorage.setItem("jobrixa_plan", "FREE");
      navigate("/dashboard");
      toast.success("Account created successfully!");
    } catch (err) {
      toast.error("Registration failed. Email might be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#ffffff] flex overflow-hidden">
      {/* Left side — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-y-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#4F8EF7]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#2da44e]/6 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-sm bg-[#ffffff] border border-[#d0d7de] rounded-2xl p-8 z-10 shadow-2xl">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#4F8EF7] flex items-center justify-center">
                <span className="text-[#f6f8fa] font-black text-sm">J</span>
              </div>
              <span className="font-bold text-[#1c2128] text-lg">Jobrixa</span>
            </div>
            <h1 className="text-xl font-semibold text-[#1c2128]">Create an account</h1>
            <p className="text-sm text-[#57606a] mt-1">Start tracking your applications</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#1c2128] border border-[#d0d7de] rounded-lg text-black text-sm placeholder:text-[#8c959f] focus:outline-none focus:border-[#4F8EF7] font-medium transition-colors shadow-inner"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#ffffff] border border-[#d0d7de] rounded-lg text-[#1c2128] text-sm placeholder:text-[#8c959f] focus:outline-none focus:border-[#4F8EF7] focus:ring-1 focus:ring-[#4F8EF7] transition-colors shadow-sm"
                placeholder="Email address"
                required
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setShowStrength(true); }}
                onFocus={() => setShowStrength(true)}
                className="w-full px-4 py-2.5 bg-[#ffffff] border border-[#d0d7de] rounded-lg text-[#1c2128] text-sm placeholder:text-[#8c959f] focus:outline-none focus:border-[#4F8EF7] focus:ring-1 focus:ring-[#4F8EF7] transition-colors shadow-sm"
                placeholder="Password"
                required
              />
              {showStrength && <PasswordStrength password={password} />}
            </div>

            <div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#ffffff] border border-[#d0d7de] rounded-lg text-[#1c2128] text-sm placeholder:text-[#8c959f] focus:outline-none focus:border-[#4F8EF7] focus:ring-1 focus:ring-[#4F8EF7] transition-colors shadow-sm"
                placeholder="Confirm password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || password.length < 8 || [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(password)).length < 2}
              className="w-full py-2.5 mt-2 bg-[#4F8EF7] hover:bg-[#3B7DE8] text-[#f6f8fa] font-semibold rounded-lg text-sm transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#d0d7de]" />
            <span className="text-xs text-[#57606a]">or</span>
            <div className="flex-1 h-px bg-[#d0d7de]" />
          </div>

          <button type="button" onClick={handleGoogleAuth} className="w-full py-2.5 bg-[#f6f8fa] hover:bg-[#22272E] border border-[#d0d7de] text-[#1c2128] font-medium rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="mt-6 text-center text-sm text-[#57606a]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#4F8EF7] font-medium hover:text-[#3B7DE8] transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Right side — clean info panel */}
      <div className="hidden lg:flex flex-1 bg-[#ffffff] border-l border-[#f6f8fa] flex-col items-center justify-center p-12 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4F8EF7]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#2da44e]/5 rounded-full blur-3xl" />
        
        <div className="text-center max-w-sm relative z-10">
          <div className="text-6xl mb-8">🎯</div>
          <h2 className="text-3xl font-bold text-[#1c2128] mb-4">
            Your job hunt,<br />
            <span className="text-[#4F8EF7]">finally organized.</span>
          </h2>
          <p className="text-[#57606a] mb-10 text-sm leading-relaxed">
            Track every application, ace every interview, and land the job you deserve.
          </p>

          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3 bg-[#f6f8fa] border border-[#d0d7de] rounded-xl px-4 py-3">
              <span className="text-xl">📋</span>
              <div>
                <p className="text-[#1c2128] text-sm font-medium">Track every application</p>
                <p className="text-[#57606a] text-xs">Kanban board across all stages</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-[#f6f8fa] border border-[#d0d7de] rounded-xl px-4 py-3">
              <span className="text-xl">📊</span>
              <div>
                <p className="text-[#1c2128] text-sm font-medium">Real-time analytics</p>
                <p className="text-[#57606a] text-xs">Response rates, interview rates, more</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-[#f6f8fa] border border-[#d0d7de] rounded-xl px-4 py-3">
              <span className="text-xl">🔔</span>
              <div>
                <p className="text-[#1c2128] text-sm font-medium">Never miss a deadline</p>
                <p className="text-[#57606a] text-xs">Auto-tracks OAs and interviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
