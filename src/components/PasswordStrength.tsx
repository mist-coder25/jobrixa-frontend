import { useMemo } from 'react';

interface Props { password?: string; }

export default function PasswordStrength({ password = '' }: Props) {
  const checks = useMemo(() => [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Uppercase & Lowercase', pass: /[A-Z]/.test(password) && /[a-z]/.test(password) },
    { label: 'Number (0-9)', pass: /[0-9]/.test(password) },
    { label: 'Special character', pass: /[^A-Za-z0-9]/.test(password) },
  ], [password]);

  const score = checks.filter(c => c.pass).length;
  const strength = score <= 1 ? 'Weak' : score <= 2 ? 'Fair' : score === 3 ? 'Good' : 'Strong';
  const colors: Record<string, string> = { 
    Weak: '#FF4757', 
    Fair: '#FFA500', 
    Good: '#5B9FFF', 
    Strong: '#00D084' 
  };
  const color = colors[strength];

  if (!password) return null;

  return (
    <div className="mt-3 space-y-2 p-3 bg-[var(--bg-main)] rounded-lg border border-[var(--border)]">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{ background: i <= score ? color : '#1E293B' }} />
          ))}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>{strength}</span>
      </div>
      {/* Checklist */}
      <div className="grid grid-cols-2 gap-y-1 gap-x-2">
        {checks.map(c => (
          <div key={c.label} className="flex items-center gap-1.5 leading-none">
            <span className="text-[10px]" style={{ color: c.pass ? '#00D084' : '#484F58' }}>
              {c.pass ? '●' : '○'}
            </span>
            <span className="text-[10px] font-medium" style={{ color: c.pass ? '#A0AEC0' : '#484F58' }}>
              {stepLabel(c.label)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function stepLabel(label: string) {
    if (label.includes('characters')) return '8+ characters';
    if (label.includes('Uppercase')) return 'Upper & Lower';
    return label;
}
