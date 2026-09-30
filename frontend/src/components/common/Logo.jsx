import React from 'react';

export const Logo = ({
  variant = 'light',
  size = 'md',
  showBadge = true,
}) => {
  const isLight = variant === 'light'; // Light for green background
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const iconContainerSize = isSm ? 'w-7 h-7' : isLg ? 'w-11 h-11' : 'w-9 h-9 sm:w-10 sm:h-10';
  const svgSize = isSm ? 'w-4 h-4' : isLg ? 'w-6 h-6' : 'w-5 h-5 sm:w-5.5 sm:h-5.5';
  const brandTextSize = isSm ? 'text-lg' : isLg ? 'text-2xl' : 'text-xl sm:text-2xl';

  return (
    <div className="inline-flex items-center gap-2.5 sm:gap-3 select-none group">
      {/* Refined Energy Emblem with Glow */}
      <div
        className={`${iconContainerSize} rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105 ${
          isLight
            ? 'bg-gradient-to-br from-emerald-300 to-emerald-400 text-emerald-950 shadow-md ring-1 ring-white/25'
            : 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-md'
        }`}
        style={{
          boxShadow: isLight
            ? '0 0 16px rgba(52, 211, 153, 0.3), 0 2px 8px rgba(0,0,0,0.1)'
            : '0 0 12px rgba(16, 185, 129, 0.2), 0 2px 6px rgba(0,0,0,0.15)',
        }}
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
        <div className={`font-extrabold tracking-tight ${brandTextSize} flex items-center`}>
          <span className={isLight ? 'text-white' : 'text-slate-900'}>Green</span>
          <span className={isLight ? 'text-emerald-300' : 'text-gradient-green'}>Grid</span>
        </div>
        {showBadge && (
          <span
            className={`text-[10px] sm:text-[11px] uppercase tracking-[0.14em] font-semibold mt-1 ${
              isLight ? 'text-emerald-200/80' : 'text-slate-500'
            }`}
          >
            Energy Intelligence
          </span>
        )}
      </div>
    </div>
  );
};
