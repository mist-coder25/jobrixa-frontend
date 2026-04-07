import { useState } from "react";

interface CompanyLogoProps {
  companyName: string;
  companyDomain?: string;
  size?: number;
  className?: string;
  /** Extra padding inside the avatar image container (default: "p-1") */
  containerPadding?: string;
}

const COLORS = [
  "#6C63FF", "#00D4AA", "#F59E0B", "#EF4444", "#3B82F6",
  "#8B5CF6", "#EC4899", "#10B981", "#F97316", "#06B6D4",
];

function getColor(name: string): string {
  const idx = (name || "?").charCodeAt(0) % COLORS.length;
  return COLORS[idx];
}

/**
 * CompanyLogo — uses Clearbit Logo API if domain is provided.
 * Falls back to UI Avatars (free, no signup, no CORS issues).
 */
export default function CompanyLogo({
  companyName,
  companyDomain,
  size = 36,
  className = "",
  containerPadding = "p-1",
}: CompanyLogoProps) {
  const [errorStep, setErrorStep] = useState(0);

  const name = companyName || "?";
  const bgColor = getColor(name);
  const bgHex = bgColor.replace("#", "");

  // Fallback chain: Clearbit -> Google Favicon -> UI Avatars
  let logoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bgHex}&color=fff&size=${size * 2}&bold=true&length=1&format=png`;

  if (companyDomain) {
    if (errorStep === 0) {
      logoUrl = `https://logo.clearbit.com/${companyDomain}`;
    } else if (errorStep === 1) {
      logoUrl = `https://www.google.com/s2/favicons?domain=${companyDomain}&sz=128`;
    }
  }

  return (
    <div 
      className={`rounded-lg overflow-hidden flex-shrink-0 bg-[#21262D] border border-[#30363D] flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={logoUrl}
        alt={name}
        className={`w-full h-full object-contain ${containerPadding}`}
        onError={() => setErrorStep(prev => prev + 1)}
        loading="lazy"
      />
    </div>
  );
}
