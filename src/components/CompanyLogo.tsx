import { useState } from "react";

interface CompanyLogoProps {
  companyName: string;
  domain?: string;
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
 * CompanyLogo — uses Clearbit Logo API with domain, or UI Avatars as fallback.
 */
export default function CompanyLogo({
  companyName,
  domain,
  size = 36,
  className = "",
  containerPadding = "p-1",
}: CompanyLogoProps) {
  const [imgError, setImgError] = useState(false);

  const name = companyName || "?";
  const initial = name.charAt(0).toUpperCase();
  const bgColor = getColor(name);
  const bgHex = bgColor.replace("#", "");

  // Clearbit Logo API URL
  const clearbitUrl = domain 
    ? `https://logo.clearbit.com/${domain}`
    : null;

  // UI Avatars: fallback
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bgHex}&color=fff&size=${size * 2}&bold=true&length=1&format=png`;

  if (imgError || !clearbitUrl) {
    if (imgError && clearbitUrl) {
        // Fallback to UI Avatars if Clearbit fails
        return (
            <img
            src={avatarUrl}
            alt={name}
            width={size}
            height={size}
            className={`rounded-lg flex-shrink-0 object-cover ${containerPadding} ${className}`}
            loading="lazy"
          />
        );
    }

    return (
      <div
        className={`flex items-center justify-center font-bold text-white rounded-lg flex-shrink-0 ${className}`}
        style={{ width: size, height: size, background: bgColor, fontSize: size * 0.42 }}
        aria-label={name}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={clearbitUrl}
      alt={name}
      width={size}
      height={size}
      className={`rounded-lg flex-shrink-0 object-contain bg-white p-0.5 ${className}`}
      onError={() => setImgError(true)}
      loading="lazy"
    />
  );
}
