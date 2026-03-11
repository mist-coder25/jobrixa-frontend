import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import { toast } from "../components/Toast";
import { CheckCircle2, Loader2 } from "lucide-react";
import { fadeUp, staggerContainer } from "../hooks/useAnimatedMount";

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
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="hidden md:flex flex-1 flex-col justify-center px-12 lg:px-24 bg-surface border-r border-border relative overflow-hidden"
      >
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-teal/20 via-primary to-primary opacity-50 z-0 mix-blend-screen pointer-events-none"></div>

        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7Z" fill="white" fillOpacity="0.9"/>
                <path d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M13 13L11.5 15.5L13 14H11L12.5 11.5L11 13H13Z" fill="#0A0A0F"/>
              </svg>
            </div>
            <h1 className="text-3xl font-display font-bold tracking-wide">Jobrixa</h1>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.55 }}
            className="text-4xl lg:text-5xl font-display font-bold leading-tight mb-6"
          >
            Join the <span className="text-accent-teal">top 1%</span><br />
            of candidates.
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-textSecondary text-lg mb-10 leading-relaxed font-sans"
          >
            Track your applications effortlessly, prepare smartly, and land your next dream role with precision.
          </motion.p>

          <div className="space-y-4 text-textSecondary font-sans">
            {[
              "End-to-end application lifecycle tracking",
              "Interactive kanban boards & custom stages",
              "Smart analytics and conversion insights"
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-accent-teal flex-shrink-0" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right side form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 md:py-0 relative">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7Z" fill="white" fillOpacity="0.9"/>
                <path d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M13 13L11.5 15.5L13 14H11L12.5 11.5L11 13H13Z" fill="#0A0A0F"/>
              </svg>
            </div>
            <h1 className="text-2xl font-display font-bold tracking-wide text-textPrimary">Jobrixa</h1>
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "backOut" } } }}
            className="bg-surface/60 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-2xl relative z-10"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-display font-bold mb-2 text-textPrimary">Create Account</h3>
              <p className="text-textSecondary font-sans">Start tracking perfectly. It's free.</p>
            </div>

            <motion.form
              onSubmit={handleRegister}
              className="space-y-5 font-sans"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeUp} custom={0} className="space-y-2">
                <label className="text-sm font-medium text-textSecondary uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-primary/50 border border-border rounded-lg px-4 py-3 text-textPrimary placeholder:text-textSecondary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="John Doe"
                  required
                />
              </motion.div>

              <motion.div variants={fadeUp} custom={1} className="space-y-2">
                <label className="text-sm font-medium text-textSecondary uppercase tracking-wider block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-primary/50 border border-border rounded-lg px-4 py-3 text-textPrimary placeholder:text-textSecondary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="name@example.com"
                  required
                />
              </motion.div>

              <motion.div variants={fadeUp} custom={2} className="space-y-2">
                <label className="text-sm font-medium text-textSecondary uppercase tracking-wider block">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-primary/50 border border-border rounded-lg px-4 py-3 text-textPrimary placeholder:text-textSecondary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                />
              </motion.div>

              <motion.div variants={fadeUp} custom={3} className="space-y-2">
                <label className="text-sm font-medium text-textSecondary uppercase tracking-wider block">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-primary/50 border border-border rounded-lg px-4 py-3 text-textPrimary placeholder:text-textSecondary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                />
              </motion.div>

              <motion.button
                variants={fadeUp}
                custom={4}
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-accent hover:bg-[#5A52E8] text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed btn-glow mt-4"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
              </motion.button>
            </motion.form>

            <div className="mt-8 text-center text-sm text-textSecondary font-sans">
              Already have an account?{" "}
              <Link to="/login" className="text-accent font-medium hover:text-accent/80 transition-colors">
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
