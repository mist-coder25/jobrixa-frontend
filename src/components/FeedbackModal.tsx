import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Loader2, MessageSquare } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  _page?: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  _page = 'unknown',
}) => {
  const [_unused] = useState(_page);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim().length < 10) {
      setError('Feedback must be at least 10 characters long');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Real API call would be:
      // const response = await fetch('/api/feedback', { ... });
      // if (!response.ok) throw new Error(...)

      setSuccess(true);
      setMessage('');

      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
        setTimeout(() => setSuccess(false), 500); // Reset state after animation
      }, 2000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMsg);
      console.error('Feedback error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-8 py-6 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                    <MessageSquare size={20} />
                 </div>
                 <h2 className="text-xl font-bold">Send Feedback</h2>
              </div>
              <button
                onClick={onClose}
                className="text-[var(--text-tertiary)] hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              {success ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20 flex items-center justify-center mb-6">
                    <CheckCircle2 size={32} className="text-[var(--accent-green)]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Thank you!</h3>
                  <p className="text-[var(--text-secondary)]">Your feedback helps us make Jobrixa better for everyone.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        setError(null);
                      }}
                      placeholder="Tell us what you think... What can we improve?"
                      className="w-full h-32 bg-[var(--bg-main)] border border-[var(--border)] rounded-2xl p-4 text-sm focus:border-[var(--primary)] outline-none resize-none transition-all placeholder:text-[var(--text-tertiary)]"
                      disabled={isLoading}
                    />
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
                        <span className={message.length < 10 ? 'text-[var(--accent-red)]' : 'text-[var(--text-tertiary)]'}>
                            {message.length} Characters
                        </span>
                        <span className="text-[var(--text-tertiary)]">Min 10</span>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-[var(--accent-red)] text-xs font-bold bg-[var(--accent-red)]/5 border border-[var(--accent-red)]/10 p-3 rounded-xl">
                      <AlertCircle size={14} />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || message.trim().length < 10}
                    className="w-full btn-primary py-4 shadow-xl shadow-[var(--primary)]/20 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Submit Feedback"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;
