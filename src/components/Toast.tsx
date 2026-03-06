import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastOptions {
  message: string;
  type: ToastType;
}

// Simple event emitter for toasts
type ToastListener = (options: ToastOptions) => void;
const listeners = new Set<ToastListener>();

export const toast = {
  success: (message: string) => {
    listeners.forEach((listener) => listener({ message, type: 'success' }));
  },
  error: (message: string) => {
    listeners.forEach((listener) => listener({ message, type: 'error' }));
  },
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<(ToastOptions & { id: number })[]>([]);

  useEffect(() => {
    const handleToast = (options: ToastOptions) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { ...options, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };

    listeners.add(handleToast);
    return () => {
      listeners.delete(handleToast);
    };
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 w-80 animate-in slide-in-from-right-4 fade-in duration-300 ${
            t.type === 'success'
              ? 'bg-surface border-[#00D4AA]/30 text-textPrimary'
              : 'bg-surface border-danger/30 text-textPrimary'
          }`}
        >
          {t.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-[#00D4AA]" />
          ) : (
            <XCircle className="w-5 h-5 text-danger" />
          )}
          <span className="flex-1 text-sm font-medium">{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="text-textSecondary hover:text-textPrimary">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
