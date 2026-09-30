import React, { useState } from 'react';
import { Download } from 'lucide-react';
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
} from 'recharts';
import {
  HOURLY_CONSUMPTION_DATA,
  FACILITY_COMPARISON_DATA,
} from '../../data/mockData';
import { PlatformShell } from '../common/PlatformShell';

export const EnergyAnalyticsPage = ({
  onExport,
  onNavigate = () => {},
}) => {
  const [dateRange, setDateRange] = useState('30d');
  const [metricType, setMetricType] = useState('kwh');

  // Baseline simulated comparison data
  const demandWithBaseline = HOURLY_CONSUMPTION_DATA.map((d) => ({
    ...d,
    baseline: Math.round(d.total * 0.93),
  }));

  const CustomAnalyticsTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200/80 shadow-xl text-xs space-y-2 min-w-[190px]">
          <div className="font-semibold pb-1.5 border-b border-slate-100 flex items-center justify-between text-slate-500">
            <span>Interval: {label}</span>
            {(label === '14:00' || label === '16:00') && (
              <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                TOD Peak
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            {payload.map((entry, index) => (
              <div key={`entry-${index}`} className="flex items-center justify-between gap-6 py-0.5">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}
                </span>
                <span className="font-bold text-slate-900 font-mono">
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
          <div className="inline-flex rounded-xl border border-slate-200/80 p-1 bg-slate-100/70 shadow-xs">
            {['24h', '7d', '30d', 'ytd'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                  dateRange === range
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => onExport('CSV Telemetry Package')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 font-semibold text-xs transition-all hover:shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Data</span>
          </button>
        </div>
      }
    >
      {/* 1. Analytics KPI Control Bar */}
      <section
        className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Average Energy Intensity</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">0.99</span>
              <span className="text-xs font-bold text-slate-400">kWh/sq ft</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
              ✓ Complies with BEE 5-star baseline
            </span>
          </div>

          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Model Variance</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">+3.2%</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              Compared to 90-day regression baseline
            </span>
          </div>

          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Off-Hours Baseload</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">18.4%</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
              Optimal (Target &lt; 20%)
            </span>
          </div>

          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Avoided Scope 2 Carbon</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight font-mono">1,240</span>
              <span className="text-xs font-bold text-slate-400">Tonnes</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
              ISO 50001 verified
            </span>
          </div>
        </div>
      </section>

      {/* 2. Measured Demand vs. Regression Baseline Profile */}
      <section
        className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Demand Load Profile vs. Calibrated Baseline
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Identifies un-optimized chiller staging during early afternoon peak tariff windows.
            </p>
          </div>

          <div className="inline-flex rounded-xl border border-slate-200/80 p-1 bg-slate-100/70 shadow-xs">
            <button
              onClick={() => setMetricType('kwh')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                metricType === 'kwh'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Power (kW)
            </button>
            <button
              onClick={() => setMetricType('inr')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                metricType === 'inr'
                  ? 'bg-white text-emerald-800 shadow-sm'
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
                stroke="#10b981"
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
      <section
        className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
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
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-xl text-xs space-y-1">
                        <div className="font-semibold text-slate-900">{label}</div>
                        <div className="text-emerald-700 font-bold font-mono">
                          {payload[0].value} kWh/sq ft
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 11, paddingBottom: 8 }} />
              <Bar dataKey="efficiency" name="Energy Intensity (kWh/sq ft)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </PlatformShell>
  );
};
