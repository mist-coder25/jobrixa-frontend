import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PasswordStrength from '../components/PasswordStrength';

type Step = 'email' | 'otp' | 'reset' | 'done';

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const sendOtp = async () => {
    setLoading(true); setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setStep('otp');
    } catch { setError('Email not found'); }
    finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      setResetToken(data.resetToken);
      setStep('reset');
    } catch { setError('Invalid or expired OTP'); }
    finally { setLoading(false); }
  };

  const resetPassword = async () => {
    setLoading(true); setError('');
    try {
      await api.post('/auth/reset-password', { resetToken, newPassword });
      setStep('done');
    } catch { setError('Failed to reset password'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#58a6ff]/8 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative w-full max-w-sm bg-[#161B22] border border-[#30363D] rounded-2xl p-8  ">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#58a6ff] flex items-center justify-center">
            <span className="text-white font-black text-sm">J</span>
          </div>
          <span className="font-bold text-[#E6EDF3] text-lg">Jobrixa</span>
        </div>

        {step === 'email' && (
          <>
            <h2 className="text-lg font-semibold text-[#E6EDF3] text-center mb-1">Forgot password?</h2>
            <p className="text-sm text-[#7D8590] text-center mb-6">We'll send an OTP to your email</p>
            <input value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Email address" type="email"
              className="w-full px-4 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg text-[#E6EDF3] text-sm placeholder:text-[#484F58] focus:outline-none focus:border-[#58a6ff] mb-4 transition-colors" />
            {error && <p className="text-xs text-[#F85149] mb-3">{error}</p>}
            <button onClick={sendOtp} disabled={!email || loading}
              className="w-full py-2.5 bg-[#58a6ff] hover:bg-[#1f6feb] text-white font-semibold rounded-lg text-sm disabled:opacity-50 transition-colors">
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </>
        )}

        {step === 'otp' && (
          <>
            <h2 className="text-lg font-semibold text-[#E6EDF3] text-center mb-1">Check your email</h2>
            <p className="text-sm text-[#7D8590] text-center mb-6">Enter the 6-digit OTP sent to <span className="text-[#E6EDF3]">{email}</span></p>
            <input value={otp} onChange={e => setOtp(e.target.value)}
              placeholder="000000" maxLength={6}
              className="w-full px-4 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg text-[#E6EDF3] text-sm text-center tracking-widest text-lg font-mono placeholder:text-[#484F58] focus:outline-none focus:border-[#58a6ff] mb-4 transition-colors" />
            {error && <p className="text-xs text-[#F85149] mb-3">{error}</p>}
            <button onClick={verifyOtp} disabled={otp.length !== 6 || loading}
              className="w-full py-2.5 bg-[#58a6ff] hover:bg-[#1f6feb] text-white font-semibold rounded-lg text-sm disabled:opacity-50 transition-colors">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button onClick={() => setStep('email')} className="w-full mt-2 text-xs text-[#7D8590] hover:text-[#E6EDF3]">
              ← Back
            </button>
          </>
        )}

        {step === 'reset' && (
          <>
            <h2 className="text-lg font-semibold text-[#E6EDF3] text-center mb-1">New password</h2>
            <p className="text-sm text-[#7D8590] text-center mb-6">Choose a strong password</p>
            <input value={newPassword} onChange={e => setNewPassword(e.target.value)}
              placeholder="New password" type="password"
              className="w-full px-4 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg text-[#E6EDF3] text-sm placeholder:text-[#484F58] focus:outline-none focus:border-[#58a6ff] mb-2 transition-colors" />
            <PasswordStrength password={newPassword} />
            {error && <p className="text-xs text-[#F85149] mb-3 mt-2">{error}</p>}
            <button onClick={resetPassword} disabled={newPassword.length < 8 || loading}
              className="w-full mt-4 py-2.5 bg-[#58a6ff] hover:bg-[#1f6feb] text-white font-semibold rounded-lg text-sm disabled:opacity-50 transition-colors">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </>
        )}

        {step === 'done' && (
          <div className="text-center">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-lg font-semibold text-[#E6EDF3] mb-2">Password reset!</h2>
            <p className="text-sm text-[#7D8590] mb-6">You can now sign in with your new password</p>
            <button onClick={() => navigate('/login')}
              className="w-full py-2.5 bg-[#58a6ff] hover:bg-[#1f6feb] text-white font-semibold rounded-lg text-sm transition-colors">
              Go to Login
            </button>
          </div>
        )}

        {step !== 'done' && (
          <p className="text-center text-xs text-[#7D8590] mt-4">
            Remember it? <span onClick={() => navigate('/login')} className="text-[#58a6ff] cursor-pointer hover:underline">Sign in</span>
          </p>
        )}
      </div>
    </div>
  );
}
