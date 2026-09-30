import React, { useState } from 'react';
import {
  Download,
  Calendar,
  Zap,
  TrendingDown,
  TrendingUp,
  Leaf,
  BarChart3,
  Activity,
  FileSpreadsheet,
  FileText,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';
import {
  HOURLY_CONSUMPTION_DATA,
  WEEKLY_CONSUMPTION_DATA,
  FACILITY_COMPARISON_DATA,
} from '../../data/mockData';
import { PlatformShell } from '../common/PlatformShell';
import { PageId } from '../../types';

interface EnergyAnalyticsPageProps {
  onExport: (format: string) => void;
  onNavigate?: (page: PageId) => void;
}

export const EnergyAnalyticsPage: React.FC<EnergyAnalyticsPageProps> = ({
  onExport,
  onNavigate = () => {},
}) => {
  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d' | 'ytd'>('30d');
  const [metricType, setMetricType] = useState<'kwh' | 'inr' | 'co2'>('kwh');

  // Baseline simulated comparison data
  const demandWithBaseline = HOURLY_CONSUMPTION_DATA.map((d) => ({
    ...d,
    baseline: Math.round(d.total * 0.93),
  }));

  const CustomAnalyticsTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white text-slate-800 p-3 rounded-lg border border-slate-200 shadow-lg text-xs">
          <div className="font-semibold pb-1.5 mb-1.5 border-b border-slate-100 flex items-center justify-between text-slate-500">
            <span>Interval: {label}</span>
            {(label === '14:00' || label === '16:00') && (
              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-bold">
                TOD Peak
              </span>
            )}
          </div>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={`entry-${index}`} className="flex items-center justify-between gap-6 py-0.5">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}
                </span>
                <span className="font-bold text-slate-900">
                  {entry.value.toLocaleString()} kW
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <PlatformShell
      pageTitle="Energy Analytics & Load Profiles"
      pageCategory="Telemetry Diagnostics"
      pageDescription="Multivariate analytical modeling of diurnal demand, baseline regression, and end-use equipment load distribution."
      onNavigate={onNavigate}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-white shadow-xs">
            {(['24h', '7d', '30d', 'ytd'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer transition-colors ${
                  dateRange === range
                    ? 'bg-green-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => onExport('CSV Telemetry Package')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Data</span>
          </button>
        </div>
      }
    >
      {/* 1. Analytics KPI Control Bar */}
      <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Average Energy Intensity</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">0.99</span>
              <span className="text-xs font-bold text-slate-500">kWh/sq ft</span>
            </div>
            <span className="text-[11px] text-green-700 font-semibold block mt-1">
              ✓ Complies with BEE 5-star baseline
            </span>
          </div>

          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Model Variance</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">+3.2%</span>
            </div>
            <span className="text-[11px] text-slate-600 block mt-1">
              Compared to 90-day regression baseline
            </span>
          </div>

          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Off-Hours Baseload</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">18.4%</span>
            </div>
            <span className="text-[11px] text-green-700 font-semibold block mt-1">
              Optimal (Target &lt; 20%)
            </span>
          </div>

          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Avoided Scope 2 Carbon</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-green-700">1,240</span>
              <span className="text-xs font-bold text-slate-500">Tonnes</span>
            </div>
            <span className="text-[11px] text-green-700 font-semibold block mt-1">
              ISO 50001 verified
            </span>
          </div>
        </div>
      </section>

      {/* 2. Measured Demand vs. Regression Baseline Profile */}
      <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Demand Load Profile vs. Calibrated Baseline
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Identifies un-optimized chiller staging during early afternoon peak tariff windows.
            </p>
          </div>

          <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-slate-50">
            <button
              onClick={() => setMetricType('kwh')}
              className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer transition-colors ${
                metricType === 'kwh'
                  ? 'bg-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Power (kW)
            </button>
            <button
              onClick={() => setMetricType('inr')}
              className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer transition-colors ${
                metricType === 'inr'
                  ? 'bg-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cost (₹)
            </button>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={demandWithBaseline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomAnalyticsTooltip />} />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 11, paddingBottom: 8 }} />

              <ReferenceArea
                x1="14:00"
                x2="17:00"
                fill="#fef3c7"
                fillOpacity={0.4}
                label={{
                  value: 'Peak Tariff',
                  position: 'insideTopRight',
                  fill: '#b45309',
                  fontSize: 10,
                  fontWeight: 700,
                }}
              />

              <Line
                type="monotone"
                dataKey="total"
                name="Measured Load (kW)"
                stroke="#15803d"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="baseline"
                name="Expected Baseline (kW)"
                stroke="#94a3b8"
                strokeWidth={1.8}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 3. Multi-Facility Energy Intensity Benchmark */}
      <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Campus Energy Intensity Benchmark (kWh / sq ft / month)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Normalizes consumption across varying campus square footage to rank efficiency.
            </p>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={FACILITY_COMPARISON_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value: any) => [`${value} kWh/sqft`, 'Intensity']} />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 11, paddingBottom: 8 }} />
              <Bar dataKey="efficiency" name="Energy Intensity (kWh/sq ft)" fill="#16a34a" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </PlatformShell>
  );
};
