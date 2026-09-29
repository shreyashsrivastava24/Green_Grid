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

interface EnergyAnalyticsPageProps {
  onExport: (format: string) => void;
}

export const EnergyAnalyticsPage: React.FC<EnergyAnalyticsPageProps> = ({ onExport }) => {
  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d' | 'quarter' | 'ytd'>('30d');
  const [metricType, setMetricType] = useState<'kwh' | 'inr' | 'co2'>('kwh');

  // Baseline simulated comparison data
  const demandWithBaseline = HOURLY_CONSUMPTION_DATA.map((d) => ({
    ...d,
    baseline: Math.round(d.total * 0.93),
  }));

  const CustomAnalyticsTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#101512] text-[#fbfbfa] p-3 rounded-xs border border-[#2a3830] shadow-xl text-xs font-mono">
          <div className="font-semibold pb-1.5 mb-1.5 border-b border-white/10 flex items-center justify-between">
            <span className="text-[#8e9e94]">PERIOD // {label}</span>
            {(label === '14:00' || label === '16:00') && (
              <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 py-0.2">
                TOD PEAK
              </span>
            )}
          </div>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex items-center justify-between gap-6 py-0.5">
                <span className="flex items-center gap-1.5 text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}
                </span>
                <span className="font-bold text-white tabular-nums">
                  {entry.value.toLocaleString()} {metricType === 'kwh' ? 'kW' : metricType === 'inr' ? '₹' : 'kg'}
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
    <div className="space-y-10 pb-16">
      {/* ========================================================
          1. EDITORIAL HEADER & WORKSPACE EXPORT CONTROLS
          ======================================================== */}
      <section className="pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e2e2d8]">
          <div className="space-y-2">
            <div className="text-[11px] font-mono tracking-[0.22em] text-[#059669] uppercase font-semibold">
              TELEMETRIC ANALYTICS // MULTI-SITE INGESTION
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#101512] tracking-tight leading-[1.08] font-editorial">
              ENERGY ANALYTICS &amp;<br />
              <span className="text-[#059669]">DEMAND PROFILES</span>
            </h1>
            <p className="text-sm sm:text-base text-[#525f56] font-sans max-w-xl">
              Cross-facility submeter regression, baseline variance tracking, and time-of-day tariff demand signatures.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs self-start sm:self-auto">
            <button
              onClick={() => onExport('CSV Telemetry Dataset')}
              className="px-3.5 py-2 border border-[#dcdcd2] hover:border-[#101512] text-[#101512] transition-colors flex items-center gap-2 cursor-pointer font-bold"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#059669]" />
              <span>EXPORT CSV</span>
            </button>
            <button
              onClick={() => onExport('PDF Analytical Report')}
              className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white font-bold tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>EXECUTIVE BRIEF</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#e2e2d8]">
          <div className="flex items-center gap-1 bg-[#ebebe2] p-0.5 border border-[#d6d6cb] font-mono text-xs overflow-x-auto">
            {[
              { id: '24h', label: '24 Hours' },
              { id: '7d', label: '7 Days' },
              { id: '30d', label: 'Last 30 Days' },
              { id: 'quarter', label: 'Quarter Q3' },
              { id: 'ytd', label: 'Fiscal YTD' },
            ].map((range) => (
              <button
                key={range.id}
                onClick={() => setDateRange(range.id as any)}
                className={`px-3 py-1 cursor-pointer transition-colors whitespace-nowrap ${
                  dateRange === range.id
                    ? 'bg-[#101512] text-[#fbfbfa] font-bold'
                    : 'text-[#525f56] hover:text-[#101512]'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-[#ebebe2] p-0.5 border border-[#d6d6cb] font-mono text-xs">
            <button
              onClick={() => setMetricType('kwh')}
              className={`px-3 py-1 cursor-pointer transition-colors ${
                metricType === 'kwh' ? 'bg-[#101512] text-[#fbfbfa] font-bold' : 'text-[#525f56]'
              }`}
            >
              kWh Power
            </button>
            <button
              onClick={() => setMetricType('inr')}
              className={`px-3 py-1 cursor-pointer transition-colors ${
                metricType === 'inr' ? 'bg-[#101512] text-[#fbfbfa] font-bold' : 'text-[#525f56]'
              }`}
            >
              ₹ Tariff Cost
            </button>
            <button
              onClick={() => setMetricType('co2')}
              className={`px-3 py-1 cursor-pointer transition-colors ${
                metricType === 'co2' ? 'bg-[#101512] text-[#fbfbfa] font-bold' : 'text-[#525f56]'
              }`}
            >
              CO₂ Tonnes
            </button>
          </div>
        </div>

        {/* Telemetry Instrumentation Rail */}
        <div className="mt-6 border border-[#dcdcd2] bg-[#f5f5ee] divide-y md:divide-y-0 md:divide-x divide-[#dcdcd2] grid grid-cols-2 md:grid-cols-4 font-mono">
          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">DAILY AVERAGE USAGE</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#101512] tabular-nums">
                6,240
              </span>
              <span className="text-xs text-[#6f7e75]">kWh</span>
            </div>
            <span className="text-[11px] text-[#059669] mt-1 block">-4.2% vs baseline (Load Factor 74.8%)</span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">PEAK DEMAND RECORDED</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 tabular-nums">
                1,866.0
              </span>
              <span className="text-xs text-[#6f7e75]">kW</span>
            </div>
            <span className="text-[11px] text-[#6f7e75] mt-1 block">Contract cap: 2,100 kW (88.8%)</span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">CARBON OFFSET AVOIDED</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#059669] tabular-nums">
                41.2
              </span>
              <span className="text-xs text-[#6f7e75]">tCO₂e</span>
            </div>
            <span className="text-[11px] text-[#059669] mt-1 block">+8.6% YoY clean generation</span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">ENERGY INTENSITY</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#101512] tabular-nums">
                0.24
              </span>
              <span className="text-xs text-[#6f7e75]">kWh/sq ft</span>
            </div>
            <span className="text-[11px] text-[#059669] mt-1 block">Top 10% commercial benchmark</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. ANNOTATED DEMAND WITH BASELINE REGRESSION
          ======================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 border-b border-[#e2e2d8] gap-3">
          <div>
            <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#6f7e75]">
              HISTORICAL BASELINE VARIANCE // EVENT MARKERS
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101512] tracking-tight font-editorial mt-0.5">
              ACTUAL CONSUMPTION VS 30-DAY BASELINE
            </h2>
            <p className="text-xs text-[#525f56] font-sans">
              Continuous actual load plotted alongside weather-normalized historical baseline and commercial peak tariff schedules.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#6f7e75]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#101512]" />
              <span>Actual Ingested</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#8e9e94] stroke-dasharray" />
              <span>Baseline Norm</span>
            </span>
          </div>
        </div>

        <div className="bg-[#fbfbfa] border border-[#e2e2d8] p-5 sm:p-7 relative overflow-hidden">
          <div className="w-full h-[320px] sm:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demandWithBaseline} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#e8e8df" vertical={false} />
                <XAxis dataKey="time" stroke="#8e9e94" fontSize={11} tickLine={false} fontFamily="var(--font-mono)" />
                <YAxis stroke="#8e9e94" fontSize={11} tickLine={false} fontFamily="var(--font-mono)" />
                <Tooltip content={<CustomAnalyticsTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="plainline"
                  wrapperStyle={{ fontSize: '11px', paddingBottom: '12px', fontFamily: 'var(--font-mono)' }}
                />

                {/* Event Marker: Peak Tariff Window */}
                <ReferenceArea
                  x1="14:00"
                  x2="16:00"
                  fill="#d97706"
                  fillOpacity={0.08}
                />

                <ReferenceLine
                  y={600}
                  stroke="#e11d48"
                  strokeDasharray="4 4"
                  label={{
                    value: 'CONTRACT CAP: 600 kW',
                    position: 'insideTopLeft',
                    fill: '#e11d48',
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="total"
                  name="Actual Monitored Load (kW)"
                  stroke="#101512"
                  strokeWidth={2.5}
                  dot={{ r: 2.5, fill: '#101512' }}
                  activeDot={{ r: 5, fill: '#059669' }}
                />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  name="30-Day Historical Baseline (kW)"
                  stroke="#8e9e94"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="solar"
                  name="Solar PV Harvest (kW)"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={{ r: 2, fill: '#059669' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-[#ebebe2] flex flex-wrap items-center justify-between text-xs font-mono text-[#6f7e75] gap-2">
            <span>Peak Window: 14:00 – 17:30 IST (+₹2.10/kWh)</span>
            <span className="text-[#059669] font-bold">Mid-Day Solar Harvest Reached 195 kW</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. 7-DAY LOAD SHIFT RHYTHM & CAMPUS INTENSITY
          ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left (7 cols): 7-Day Shift Rhythm */}
        <div className="lg:col-span-7 space-y-4">
          <div className="pb-3 border-b border-[#e2e2d8]">
            <h3 className="text-xl font-bold text-[#101512] font-editorial uppercase tracking-tight">
              7-DAY LOAD PROFILE &amp; WEEKEND BASELOAD
            </h3>
            <span className="text-xs font-mono text-[#6f7e75]">SHIFT PRODUCTION ANALYSIS</span>
          </div>

          <div className="bg-[#fbfbfa] border border-[#e2e2d8] p-5">
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_CONSUMPTION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#e8e8df" vertical={false} />
                  <XAxis dataKey="time" stroke="#8e9e94" fontSize={10} tickLine={false} fontFamily="var(--font-mono)" />
                  <YAxis stroke="#8e9e94" fontSize={10} tickLine={false} fontFamily="var(--font-mono)" />
                  <Tooltip content={<CustomAnalyticsTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="rect"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '8px', fontFamily: 'var(--font-mono)' }}
                  />
                  <Bar dataKey="grid" name="Utility Grid (kWh)" fill="#101512" />
                  <Bar dataKey="solar" name="Solar Self-Gen (kWh)" fill="#059669" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 pt-2 border-t border-[#ebebe2] flex items-center justify-between text-xs font-mono text-[#6f7e75]">
              <span>Weekend Baseload: 2,830 kWh/day</span>
              <span className="text-[#059669] font-bold">Sunday Clean Offset: 41.7%</span>
            </div>
          </div>
        </div>

        {/* Right (5 cols): Campus Intensity Benchmark */}
        <div className="lg:col-span-5 space-y-4">
          <div className="pb-3 border-b border-[#e2e2d8]">
            <h3 className="text-xl font-bold text-[#101512] font-editorial uppercase tracking-tight">
              CAMPUS INTENSITY BENCHMARK
            </h3>
            <span className="text-xs font-mono text-[#6f7e75]">KWH PER SQ FT</span>
          </div>

          <div className="bg-[#fbfbfa] border border-[#e2e2d8] p-5">
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={FACILITY_COMPARISON_DATA}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 30, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="2 2" stroke="#e8e8df" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="#8e9e94"
                    fontSize={10}
                    tickLine={false}
                    fontFamily="var(--font-mono)"
                    domain={[0, 0.35]}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#101512"
                    fontSize={10}
                    tickLine={false}
                    width={90}
                    fontFamily="var(--font-mono)"
                  />
                  <Tooltip
                    formatter={(val: any) => [`${val} kWh/sq ft`, 'Intensity']}
                    contentStyle={{
                      backgroundColor: '#101512',
                      borderColor: '#2a3830',
                      color: '#fbfbfa',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                  <ReferenceLine
                    x={0.25}
                    stroke="#d97706"
                    strokeDasharray="3 3"
                    label={{
                      value: 'TARGET 0.25',
                      position: 'top',
                      fill: '#d97706',
                      fontSize: 9,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                    }}
                  />
                  <Bar dataKey="efficiency" fill="#059669" barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 pt-2 border-t border-[#ebebe2] flex items-center justify-between text-xs font-mono text-[#6f7e75]">
              <span>Portfolio Mean: 0.24 kWh/sq ft</span>
              <span className="text-[#059669] font-bold">Hyderabad Best: 0.19</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
