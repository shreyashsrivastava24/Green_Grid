import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  showBadge = true,
}) => {
  const isLight = variant === 'light'; // Light for green background
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const iconContainerSize = isSm ? 'w-7 h-7' : isLg ? 'w-10 h-10' : 'w-8 h-8 sm:w-9 sm:h-9';
  const svgSize = isSm ? 'w-4 h-4' : isLg ? 'w-5 h-5' : 'w-4 h-4 sm:w-5 sm:h-5';
  const brandTextSize = isSm ? 'text-lg' : isLg ? 'text-2xl' : 'text-xl sm:text-2xl';

  return (
    <div className="inline-flex items-center gap-2.5 sm:gap-3 select-none group">
      {/* Handcrafted Geometric Green Energy Emblem */}
      <div
        className={`${iconContainerSize} rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-200 ${
          isLight
            ? 'bg-emerald-400 text-green-950 shadow-xs ring-1 ring-white/20'
            : 'bg-green-700 text-white shadow-xs'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${svgSize} stroke-current stroke-[2.2]`}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Elegant curved leaf outline */}
          <path d="M12 2C6.5 2 3 6.5 3 12c0 5 4 9 9 9 6.5 0 9-4.5 9-10 0-5.5-4.5-9-9-9z" />
          {/* Central grid axis */}
          <path d="M12 21V9" />
          {/* Clean energy telemetry matrix lines */}
          <path d="M8 13.5l4-3 4 3" />
          <path d="M6.5 17.5l5.5-3.5 5.5 3.5" />
        </svg>
      </div>

      {/* Brand Typography Lockup */}
      <div className="flex flex-col leading-none">
        <div className={`font-bold tracking-tight ${brandTextSize} flex items-center`}>
          <span className={isLight ? 'text-white' : 'text-slate-900'}>Green</span>
          <span className={isLight ? 'text-emerald-300' : 'text-green-700'}>Grid</span>
        </div>
        {showBadge && (
          <span
            className={`text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold mt-1 ${
              isLight ? 'text-emerald-200/90' : 'text-slate-500'
            }`}
          >
            Energy Intelligence
          </span>
        )}
      </div>
    </div>
  );
};
