import React from 'react';

interface StatusBadgeProps {
  status:
    | 'Normal'
    | 'High Usage'
    | 'Critical'
    | 'Active'
    | 'Acknowledged'
    | 'Resolved'
    | 'Paid'
    | 'Due'
    | 'Overdue'
    | 'High'
    | 'Medium'
    | 'Low'
    | 'Warning'
    | 'Info';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const isSm = size === 'sm';

  switch (status) {
    case 'Normal':
    case 'Resolved':
    case 'Paid':
    case 'Low':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold text-[#0c3822] bg-[#eef7f2] border border-[#c4e4d2] rounded-xs px-2 py-0.5 ${
            isSm ? 'text-[10px]' : 'text-xs'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#059669] shrink-0" />
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
          className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold text-[#854d0e] bg-[#fefce8] border border-[#fef08a] rounded-xs px-2 py-0.5 ${
            isSm ? 'text-[10px]' : 'text-xs'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] shrink-0" />
          <span>{status}</span>
        </span>
      );
    case 'Critical':
    case 'Active':
    case 'Overdue':
    case 'High':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold text-[#9f1239] bg-[#fff1f2] border border-[#fecdd3] rounded-xs px-2 py-0.5 ${
            isSm ? 'text-[10px]' : 'text-xs'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48] shrink-0 signal-pulse" />
          <span>{status}</span>
        </span>
      );
    case 'Info':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold text-[#0e7490] bg-[#ecfeff] border border-[#a5f3fc] rounded-xs px-2 py-0.5 ${
            isSm ? 'text-[10px]' : 'text-xs'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#0891b2] shrink-0" />
          <span>{status}</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#4a544e] bg-[#f0f0ea] border border-[#d8d8ce] rounded-xs px-2 py-0.5 uppercase tracking-wider">
          {status}
        </span>
      );
  }
};
