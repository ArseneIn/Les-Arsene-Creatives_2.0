import React from 'react';

interface NovaLogoProps {
  className?: string;
  size?: number;
  variant?: 'full' | 'mark';
  theme?: 'light' | 'dark' | 'orange' | 'brand';
}

const NovaLogo: React.FC<NovaLogoProps> = ({ className = '', size = 40, variant = 'full', theme = 'brand' }) => {
  const brandOrange = '#FF4F00';
  
  // Detect dark mode if theme is 'brand'
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const activeTheme = theme === 'brand' ? (isDarkMode ? 'dark' : 'light') : theme;

  // Structural Reset: Black nodes become White in dark mode for perfect visibility
  const dotColorPrimary = activeTheme === 'dark' ? '#FFFFFF' : '#000000';
  const textColor = activeTheme === 'dark' ? '#FFFFFF' : '#0F172A';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* BRAND LOCK: MATHEMATICALLY PERFECT 3x3 GRID */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Row 1 */}
        <circle cx="20" cy="20" r="8" fill={dotColorPrimary} />
        <circle cx="50" cy="20" r="8" fill={brandOrange} />
        <circle cx="80" cy="20" r="8" fill={dotColorPrimary} />
        
        {/* Row 2 (Connected Path) */}
        <path d="M20 50 H 50" stroke={brandOrange} strokeWidth="8" strokeLinecap="round" />
        <circle cx="20" cy="50" r="8" fill={brandOrange} />
        <circle cx="50" cy="50" r="8" fill={brandOrange} />
        <circle cx="80" cy="50" r="8" fill={dotColorPrimary} />
        
        {/* Row 3 */}
        <circle cx="20" cy="80" r="8" fill={dotColorPrimary} />
        <circle cx="50" cy="80" r="8" fill={brandOrange} />
        <circle cx="80" cy="80" r="8" fill={brandOrange} />
      </svg>

      {variant === 'full' && (
        <div className="flex flex-col leading-[0.8] select-none uppercase">
          <span 
            className="text-xl font-black tracking-[0.18em] brand-font" 
            style={{ color: textColor }}
          >
            NOVA
          </span>
          <span 
            className="text-[10px] font-black tracking-[0.45em] brand-font" 
            style={{ color: brandOrange }}
          >
            TREND
          </span>
        </div>
      )}
    </div>
  );
};

export default NovaLogo;