export const Logo = () => {
  return (
    <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Scales of justice - minimalist icon */}
      <g className="logo-icon">
        {/* Base */}
        <rect x="18" y="32" width="14" height="2" fill="currentColor" />
        {/* Stand */}
        <rect x="24" y="8" width="2" height="24" fill="currentColor" />
        {/* Beam */}
        <rect x="16" y="8" width="18" height="2" fill="currentColor" />
        {/* Left scale */}
        <path d="M16 8 L16 12 L12 12 L12 14 L20 14 L20 12 L16 12 Z" fill="currentColor" opacity="0.7" />
        {/* Right scale */}
        <path d="M34 8 L34 12 L30 12 L30 14 L38 14 L38 12 L34 12 Z" fill="currentColor" opacity="0.7" />
      </g>

      {/* Text "spezi" with modern sans-serif font */}
      <text x="50" y="28" fontFamily="Inter, 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" fontSize="20" fontWeight="500" letterSpacing="1.5" fill="currentColor">
        spezi
      </text>
    </svg>
  );
};
