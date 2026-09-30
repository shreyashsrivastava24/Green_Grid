import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  isGoodTrend?: boolean;
  subtitle?: string;
  icon: LucideIcon;
  accentColor?: 'emerald' | 'blue' | 'amber' | 'purple' | 'rose';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  change,
  trend = 'neutral',
  isGoodTrend,
  subtitle,
  icon: Icon,
  onClick,
}) => {
  const getTrendColor = () => {
    if (trend === 'neutral') return 'text-slate-500 bg-slate-50 border-slate-200';
    if (isGoodTrend === undefined) {
      return trend === 'up'
        ? 'text-green-700 bg-green-50 border-green-200'
        : 'text-rose-700 bg-rose-50 border-rose-200';
    }
    return isGoodTrend
      ? 'text-green-700 bg-green-50 border-green-200'
      : 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200 rounded-lg p-5 shadow-xs transition-all ${
        onClick
          ? 'cursor-pointer hover:border-green-300 hover:shadow-sm'
          : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-semibold text-slate-500 tracking-normal uppercase">
          {title}
        </span>
        <div className="w-8 h-8 rounded-md bg-green-50 border border-green-100 flex items-center justify-center text-green-700 shrink-0">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {value}
        </span>
        {unit && <span className="text-xs font-medium text-slate-500">{unit}</span>}
      </div>

      {(change || subtitle) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
          {change && (
            <span
              className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded border text-[11px] ${getTrendColor()}`}
            >
              {trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3" />}
              {trend === 'neutral' && <Minus className="w-3 h-3" />}
              <span>{change}</span>
            </span>
          )}
          {subtitle && <span className="text-slate-500 truncate">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
