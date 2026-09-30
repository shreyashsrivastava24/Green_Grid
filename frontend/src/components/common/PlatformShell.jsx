import React from 'react';
import { Building2, ShieldCheck } from 'lucide-react';

export const PlatformShell = ({
  pageTitle,
  pageCategory = 'Operations Console',
  pageDescription,
  activeFacilityName,
  onNavigate,
  children,
  actions,
}) => {
  return (
    <div className="w-full space-y-6 pb-12 page-enter">
      {/* 1. Premium Page Header with Gradient Mesh */}
      <div
        className="relative bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 overflow-hidden"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)' }}
      >
        {/* Decorative gradient orbs */}
        <div className="absolute -top-20 -right-20 w-48 h-48 orb orb-green opacity-30" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 orb orb-teal opacity-20" />

        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(16, 185, 129, 0.12) 1px, transparent 0)',
            backgroundSize: '22px 22px',
          }}
        />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium">
              <button
                onClick={() => onNavigate('landing')}
                className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <span>GreenGrid EMIS</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-emerald-600 uppercase tracking-wider font-semibold">{pageCategory}</span>
              {activeFacilityName && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md font-medium">
                    <Building2 className="w-3 h-3 text-emerald-600" />
                    <span>{activeFacilityName}</span>
                  </span>
                </>
              )}
            </div>

            {/* Page Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {pageTitle}
            </h1>

            {/* Description */}
            {pageDescription && (
              <p className="text-sm text-slate-500 leading-relaxed font-normal max-w-2xl">
                {pageDescription}
              </p>
            )}
          </div>

          {/* Right Action Zone */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
            {actions}
          </div>
        </div>
      </div>

      {/* 2. Content */}
      <div className="space-y-6">{children}</div>

      {/* 3. Premium Status Footer */}
      <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 signal-pulse" />
          <span className="font-semibold text-slate-600">5 Enterprise Telemetry Bridges Synchronized</span>
          <span className="text-slate-300 hidden sm:inline">·</span>
          <span className="text-slate-400 hidden sm:inline">15-minute interval cycle</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="inline-flex items-center gap-1.5 text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>ASHRAE 90.1 &amp; ISO 50001 Certified</span>
          </span>
          <button
            onClick={() => onNavigate('landing')}
            className="text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer transition-colors"
          >
            Product Overview →
          </button>
        </div>
      </div>
    </div>
  );
};
