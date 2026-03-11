import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import { toast } from "../components/Toast";
import { Loader2 } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
      navigate("/pipeline");
      toast.success("Account created successfully!");
    } catch (err) {
      toast.error("Registration failed. Email might be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-4 bg-[#0D1117] text-[#E6EDF3]">
      <div className="w-full max-w-sm bg-[#161B22] border border-[#30363D] rounded-2xl p-8 relative z-10 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mb-4">
            <path d="M20 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7Z" fill="#E6EDF3" fillOpacity="0.9"/>
            <path d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7" stroke="#E6EDF3" strokeWidth="2" strokeLinecap="round"/>
            <path d="M13 13L11.5 15.5L13 14H11L12.5 11.5L11 13H13Z" fill="#161B22"/>
          </svg>
          <h1 className="text-xl font-semibold text-[#E6EDF3]">Create an account</h1>
          <p className="text-sm text-[#7D8590] mt-1">Start tracking your applications</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg text-[#E6EDF3] text-sm placeholder:text-[#484F58] focus:outline-none focus:border-[#4F8EF7] focus:ring-1 focus:ring-[#4F8EF7] transition-colors"
              placeholder="Full name"
              required
            />
          </div>

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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg text-[#E6EDF3] text-sm placeholder:text-[#484F58] focus:outline-none focus:border-[#4F8EF7] focus:ring-1 focus:ring-[#4F8EF7] transition-colors"
              placeholder="Password"
              required
            />
          </div>

          <div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg text-[#E6EDF3] text-sm placeholder:text-[#484F58] focus:outline-none focus:border-[#4F8EF7] focus:ring-1 focus:ring-[#4F8EF7] transition-colors"
              placeholder="Confirm password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 bg-[#4F8EF7] hover:bg-[#3B7DE8] text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#30363D]" />
          <span className="text-xs text-[#7D8590]">or</span>
          <div className="flex-1 h-px bg-[#30363D]" />
        </div>

        <button className="w-full py-2.5 bg-[#1C2128] hover:bg-[#22272E] border border-[#30363D] text-[#E6EDF3] font-medium rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="mt-6 text-center text-sm text-[#7D8590]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#4F8EF7] font-medium hover:text-[#3B7DE8] transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
