import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import { toast } from "../components/Toast";
import { CheckCircle2, Loader2 } from "lucide-react";

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
    <div className="min-h-screen flex flex-col md:flex-row bg-primary text-textPrimary">
      {/* Left side brand/hero */}
      <div className="hidden md:flex flex-1 flex-col justify-center px-12 lg:px-24 bg-surface border-r border-border relative overflow-hidden">
        {/* Abstract background art */}
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-teal/20 via-primary to-primary opacity-50 z-0 mix-blend-screen pointer-events-none"></div>

        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center font-display font-bold text-white text-xl">
              J
            </div>
            <h1 className="text-3xl font-display font-bold tracking-wide">Jobrixa</h1>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-display font-bold leading-tight mb-6">
            Join the <span className="text-accent-teal">top 1%</span><br />
            of candidates.
          </h2>
          
          <p className="text-textSecondary text-lg mb-10 leading-relaxed font-sans">
            Track your applications effortlessly, prepare smartly, and land your next dream role with precision.
          </p>

          <div className="space-y-4 text-textSecondary font-sans">
            {[
              "End-to-end application lifecycle tracking",
              "Interactive kanban boards & custom stages",
              "Smart analytics and conversion insights"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent-teal flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 md:py-0 relative">
        <div className="w-full max-w-md">
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="md:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-display font-bold text-white text-lg">
              J
            </div>
            <h1 className="text-2xl font-display font-bold tracking-wide text-textPrimary">Jobrixa</h1>
          </div>
          <div className="bg-surface/60 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-2xl relative z-10">
            <div className="mb-8">
              <h3 className="text-2xl font-display font-bold mb-2 text-textPrimary">Create Account</h3>
              <p className="text-textSecondary font-sans">Start tracking perfectly. It's free.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5 font-sans">
              <div className="space-y-2">
                <label className="text-sm font-medium text-textSecondary uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-primary/50 border border-border rounded-lg px-4 py-3 text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-textSecondary uppercase tracking-wider block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-primary/50 border border-border rounded-lg px-4 py-3 text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-textSecondary uppercase tracking-wider block">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-primary/50 border border-border rounded-lg px-4 py-3 text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-textSecondary uppercase tracking-wider block">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-primary/50 border border-border rounded-lg px-4 py-3 text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-[#5A52E8] text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(108,99,255,0.3)] hover:shadow-[0_0_20px_rgba(108,99,255,0.5)] mt-4"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-textSecondary font-sans">
              Already have an account?{" "}
              <Link to="/login" className="text-accent font-medium hover:text-accent/80 transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
