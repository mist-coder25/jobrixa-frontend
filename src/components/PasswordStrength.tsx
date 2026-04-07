import { useMemo } from 'react';

interface Props { password?: string; }

export default function PasswordStrength({ password = '' }: Props) {
  const checks = useMemo(() => [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Uppercase letter (A-Z)', pass: /[A-Z]/.test(password) },
    { label: 'Lowercase letter (a-z)', pass: /[a-z]/.test(password) },
    { label: 'Number (0-9)', pass: /[0-9]/.test(password) },
    { label: 'Special character (!@#$...)', pass: /[^A-Za-z0-9]/.test(password) },
  ], [password]);

  const score = checks.filter(c => c.pass).length;
  const strength = score <= 1 ? 'Weak' : score <= 3 ? 'Fair' : score === 4 ? 'Good' : 'Strong';
  const colors: Record<string, string> = { Weak: '#F85149', Fair: '#D29922', Good: '#58a6ff', Strong: '#3FB950' };
  const color = colors[strength];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{ background: i <= score ? color : '#21262D' }} />
          ))}
        </div>
        <span className="text-xs font-medium" style={{ color }}>{strength}</span>
      </div>
      {/* Checklist */}
      <div className="grid grid-cols-1 gap-1">
        {checks.map(c => (
          <div key={c.label} className="flex items-center gap-1.5">
            <span className="text-xs" style={{ color: c.pass ? '#3FB950' : '#484F58' }}>
              {c.pass ? '✓' : '○'}
            </span>
            <span className="text-xs" style={{ color: c.pass ? '#7D8590' : '#484F58' }}>
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
