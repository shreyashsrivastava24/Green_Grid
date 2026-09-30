import React from 'react';
import { PageId } from '../../types';
import { Building2, Activity, ShieldCheck, ArrowLeft, ExternalLink } from 'lucide-react';

interface PlatformShellProps {
  pageTitle: string;
  pageCategory?: string;
  pageDescription?: string;
  activeFacilityName?: string;
  onNavigate: (page: PageId) => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const PlatformShell: React.FC<PlatformShellProps> = ({
  pageTitle,
  pageCategory = 'Operations Console',
  pageDescription,
  activeFacilityName,
  onNavigate,
  children,
  actions,
}) => {
  return (
    <div className="w-full space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. Environmental Platform Header Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs relative overflow-hidden">
        {/* Subtle dot matrix pattern in header */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(21, 128, 61, 0.15) 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            {/* Breadcrumb & Node Scope Pill */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
              <button
                onClick={() => onNavigate('landing')}
                className="text-slate-500 hover:text-green-700 transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <span>GreenGrid EMIS</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-green-700 uppercase tracking-wider">{pageCategory}</span>
              {activeFacilityName && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-medium">
                    <Building2 className="w-3 h-3 text-green-700" />
                    <span>{activeFacilityName}</span>
                  </span>
                </>
              )}
            </div>

            {/* Page Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {pageTitle}
            </h1>

            {/* Natural Description */}
            {pageDescription && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {pageDescription}
              </p>
            )}
          </div>

          {/* Right Action / Telemetry Status Zone */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
            {actions}
          </div>
        </div>
      </div>

      {/* 2. Platform Content Children */}
      <div className="space-y-6">{children}</div>

      {/* 3. Unified GreenGrid Platform Status & Compliance Footer */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-600 signal-pulse" />
          <span className="font-semibold text-slate-800">5 Enterprise Telemetry Bridges Synchronized</span>
          <span className="text-slate-300 hidden sm:inline">·</span>
          <span className="text-slate-500 hidden sm:inline">15-minute interval cycle</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="inline-flex items-center gap-1 text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-green-700" />
            <span>ASHRAE 90.1 &amp; ISO 50001 Certified</span>
          </span>
          <button
            onClick={() => onNavigate('landing')}
            className="text-green-700 hover:text-green-800 font-semibold cursor-pointer"
          >
            Product Overview →
          </button>
        </div>
      </div>
    </div>
  );
};
