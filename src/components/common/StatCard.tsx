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
    if (trend === 'neutral') return 'text-[#6f7e75]';
    if (isGoodTrend === undefined) {
      return trend === 'up' ? 'text-[#059669]' : 'text-rose-600';
    }
    return isGoodTrend ? 'text-[#059669]' : 'text-rose-600';
  };

  return (
    <div
      onClick={onClick}
      className={`bg-[#fbfbfa] border border-[#e2e2d8] p-4 sm:p-5 font-mono transition-all ${
        onClick ? 'cursor-pointer hover:border-[#0c2619] hover:bg-[#f5f5ee]' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="text-[10px] text-[#6f7e75] uppercase tracking-wider block font-bold">
          {title}
        </span>
        <div className="w-7 h-7 bg-[#f5f5ee] border border-[#dcdcd2] flex items-center justify-center text-[#101512]">
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-2xl font-extrabold text-[#101512] tabular-nums tracking-tight">{value}</span>
        {unit && <span className="text-xs text-[#6f7e75] font-semibold">{unit}</span>}
      </div>

      {(change || subtitle) && (
        <div className="mt-2 pt-2 border-t border-[#ebebe2] flex items-center justify-between text-[11px]">
          {change && (
            <span className={`flex items-center gap-1 font-bold ${getTrendColor()}`}>
              {trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3" />}
              {trend === 'neutral' && <Minus className="w-3 h-3" />}
              <span>{change}</span>
            </span>
          )}
          {subtitle && <span className="text-[#6f7e75]">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
