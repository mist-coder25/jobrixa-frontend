import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AVATARS = [
  { id: 'A', bg: 'bg-purple-500', emoji: null },
  { id: 'B', bg: 'bg-blue-500', emoji: null },
  { id: 'C', bg: 'bg-green-500', emoji: null },
  { id: 'D', bg: 'bg-orange-500', emoji: null },
  { id: 'E', bg: 'bg-pink-500', emoji: null },
  { id: 'F', bg: 'bg-red-500', emoji: null },
  { id: 'G', bg: 'bg-teal-500', emoji: null },
  { id: 'H', bg: 'bg-yellow-500', emoji: null },
  { id: '🚀', bg: 'bg-indigo-500', emoji: '🚀' },
  { id: '💼', bg: 'bg-slate-500', emoji: '💼' },
  { id: '🎯', bg: 'bg-cyan-500', emoji: '🎯' },
  { id: '⚡', bg: 'bg-violet-500', emoji: '⚡' },
];

interface Props {
  currentInitial: string;
  currentColor?: string;
  onSelect: (avatarId: string, bg: string) => void;
}

export default function AvatarSelector({ currentInitial, currentColor = 'bg-accent', onSelect }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Current Avatar */}
      <div
        onClick={() => setOpen(!open)}
        className={`w-20 h-20 rounded-full ${currentColor} flex items-center justify-center text-2xl font-bold text-white cursor-pointer hover:opacity-90 transition-opacity relative mx-auto`}
      >
        {currentInitial}
        <div className="absolute bottom-0 right-0 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-xs">
          ✏️
        </div>
      </div>

      {/* Avatar Picker */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 bg-surface border border-border rounded-2xl p-4 shadow-2xl z-50 w-64"
          >
            <p className="text-xs text-textSecondary mb-3 text-center">Choose your avatar</p>
            <div className="grid grid-cols-4 gap-2">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  onClick={() => { onSelect(av.id, av.bg); setOpen(false); }}
                  className={`w-12 h-12 rounded-full ${av.bg} flex items-center justify-center text-white font-bold text-sm hover:scale-110 transition-transform`}
                >
                  {av.emoji || av.id}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
