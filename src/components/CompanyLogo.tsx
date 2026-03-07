import { useState } from "react";

interface CompanyLogoProps {
  companyName: string;
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
 * CompanyLogo — uses UI Avatars API (free, no signup, no CORS issues).
 * Falls back to a coloured initial block if the image errors.
 * Replaces Clearbit logo.clearbit.com which was shut down.
 */
export default function CompanyLogo({
  companyName,
  size = 36,
  className = "",
  containerPadding = "p-1",
}: CompanyLogoProps) {
  const [imgError, setImgError] = useState(false);

  const name = companyName || "?";
  const initial = name.charAt(0).toUpperCase();
  const bgColor = getColor(name);
  const bgHex = bgColor.replace("#", "");

  // UI Avatars: free, no auth, no CORS, always resolves
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bgHex}&color=fff&size=${size * 2}&bold=true&length=1&format=png`;

  if (imgError) {
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
      src={avatarUrl}
      alt={name}
      width={size}
      height={size}
      className={`rounded-lg flex-shrink-0 object-cover ${containerPadding} ${className}`}
      onError={() => setImgError(true)}
      loading="lazy"
    />
  );
}
