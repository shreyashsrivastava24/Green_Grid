import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  action,
  children,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      <div className="w-full flex-1 min-h-0">{children}</div>
    </div>
  );
};
