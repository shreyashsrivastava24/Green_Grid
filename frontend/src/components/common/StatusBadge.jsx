import React from 'react';

export const StatusBadge = ({ status, size = 'md' }) => {
  const isSm = size === 'sm';
  const sizeClasses = isSm ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5';

  switch (status) {
    case 'Normal':
    case 'Resolved':
    case 'Paid':
    case 'Low':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-green-50 text-green-700 border border-green-200 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-600 shrink-0" />
          <span>{status}</span>
        </span>
      );
    case 'High Usage':
    case 'Acknowledged':
    case 'Medium':
    case 'Due':
    case 'Warning':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-amber-50 text-amber-800 border border-amber-200 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
          <span>{status}</span>
        </span>
      );
    case 'Critical':
    case 'Active':
    case 'Overdue':
    case 'High':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
          <span>{status}</span>
        </span>
      );
    case 'Info':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-sky-50 text-sky-700 border border-sky-200 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-sky-600 shrink-0" />
          <span>{status}</span>
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
          <span>{status}</span>
        </span>
      );
  }
};
