import React, { useState } from 'react';
import {
  Zap,
  IndianRupee,
  SunMedium,
  Clock,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  Activity,
  ArrowUpRight,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import { Facility, Alert, Recommendation, PageId } from '../../types';
import { EnergyFlowDiagram } from '../common/EnergyFlowDiagram';
import {
  HOURLY_CONSUMPTION_DATA,
  WEEKLY_CONSUMPTION_DATA,
} from '../../data/mockData';

interface DashboardPageProps {
  facilities: Facility[];
  alerts: Alert[];
  recommendations: Recommendation[];
  onNavigate: (page: PageId) => void;
  onSelectFacilityDetail: (facilityId: string) => void;
  onResolveAlert: (alertId: string) => void;
  onApplyRecommendation: (recommendationId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  facilities,
  alerts,
  recommendations,
  onNavigate,
  onSelectFacilityDetail,
  onResolveAlert,
  onApplyRecommendation,
}) => {
  const [consumptionView, setConsumptionView] = useState<'daily' | 'weekly'>('daily');
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'critical' | 'normal'>('all');

  // Compute aggregated operational stats
  const totalCurrentKw = facilities.reduce((sum, f) => sum + f.currentConsumptionKw, 0);
  const totalMonthlyKwh = facilities.reduce((sum, f) => sum + f.monthlyConsumptionKwh, 0);
  const totalMonthlyCost = facilities.reduce((sum, f) => sum + f.estimatedCostInr, 0);
  const totalSolarCapacity = facilities.reduce((sum, f) => sum + f.solarCapacityKwp, 0);
  const totalPeakThreshold = facilities.reduce((sum, f) => sum + f.peakThresholdKw, 0);

  const consumptionChartData =
    consumptionView === 'daily' ? HOURLY_CONSUMPTION_DATA : WEEKLY_CONSUMPTION_DATA;

  // Custom Editorial Tooltip
  const CustomConsumptionTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#101512] text-[#fbfbfa] p-3 rounded-xs border border-[#2a3830] shadow-xl text-xs font-mono">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/10">
            <span className="text-white/60 tracking-wider">
              {consumptionView === 'daily' ? `TIME // ${label}` : `DAY // ${label}`}
            </span>
            {(label === '14:00' || label === '16:00') && (
              <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 py-0.2 rounded-xs">
                PEAK TOD TARIFF
              </span>
            )}
          </div>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={`entry-${index}`} className="flex items-center justify-between gap-6 py-0.5">
                <span className="flex items-center gap-1.5 text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}
                </span>
                <span className="font-bold text-white tabular-nums">
                  {entry.value.toLocaleString()} {consumptionView === 'daily' ? 'kW' : 'kWh'}
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
          1. THE DASHBOARD HERO (Editorial Architecture)
          ======================================================== */}
      <section className="pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e2e2d8]">
          <div className="space-y-2">
            <div className="text-[11px] font-mono tracking-[0.22em] text-[#059669] uppercase font-semibold">
              GOOD AFTERNOON, ARJUN
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#101512] tracking-tight leading-[1.08] font-editorial">
              ENTERPRISE ENERGY<br />
              <span className="text-[#059669]">CONTROL CENTER</span>
            </h1>
            <p className="text-sm sm:text-base text-[#525f56] font-sans max-w-xl">
              A live telemetry overview of your multi-campus power network, real-time demand optimization, and distributed solar generation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <div className="text-left sm:text-right font-mono">
              <div className="flex items-center sm:justify-end gap-2 text-xs font-bold text-[#059669]">
                <span className="w-2 h-2 rounded-full bg-[#059669] signal-pulse" />
                <span>LIVE TELEMETRY</span>
              </div>
              <div className="text-2xl font-bold text-[#101512] tracking-tight mt-0.5">
                14:42 <span className="text-xs font-normal text-[#6f7e75]">IST</span>
              </div>
              <div className="text-[10px] text-[#6f7e75] tracking-widest uppercase">
                5 SITES CONNECTED · 50.02 Hz
              </div>
            </div>
          </div>
        </div>

        {/* TOD Peak Alert Strip: Operational Notice without generic card box */}
        <div className="mt-4 py-2.5 px-3.5 bg-[#fef7ee] border-l-2 border-amber-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-[#7c2d12]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <strong className="tracking-wide">PEAK TARIFF WINDOW ACTIVE (14:00 – 17:30 IST)</strong>
            <span className="text-[#9a3412] hidden md:inline">
              · Rate: ₹11.20/kWh · Gurugram Corporate Tower at 310.8 kW (+7.2% above limit)
            </span>
          </div>
          <button
            onClick={() => onNavigate('recommendations')}
            className="text-[11px] font-bold text-amber-900 hover:text-black flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>REVIEW LOAD SHEDDING DISPATCH</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </section>

      {/* ========================================================
          2. SIGNATURE LIVE VISUAL ENERGY NETWORK (Flow Circuit)
          ======================================================== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono tracking-[0.16em] uppercase text-[#6f7e75] flex items-center gap-2">
            <span>NETWORK TOPOLOGY // SCHEMATIC</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
          </div>
          <span className="text-[11px] font-mono text-[#525f56]">
            Interactive Power Path Routing
          </span>
        </div>
        
        {/* Custom Living SVG Energy Network Canvas */}
        <EnergyFlowDiagram
          totalDemandKw={totalCurrentKw}
          gridDrawKw={1385.0}
          solarGenKw={481.0}
          sanctionedLimitKw={totalPeakThreshold}
          renewablePercent={34.2}
          onSelectNode={(nodeKey) => {
            if (nodeKey === 'solar') onNavigate('renewable');
            if (nodeKey === 'industrial' || nodeKey === 'commercial') onNavigate('facilities');
          }}
        />
      </section>

      {/* ========================================================
          3. HORIZONTAL TELEMETRY RAIL (Continuous Instrumentation Strip)
          ======================================================== */}
      <section>
        <div className="border-y border-[#dcdcd2] bg-[#f5f5ee] divide-y md:divide-y-0 md:divide-x divide-[#dcdcd2] grid grid-cols-2 md:grid-cols-5 font-mono">
          {/* Rail 01: TOTAL LOAD */}
          <div className="p-4 sm:p-5 hover:bg-[#ecece4] transition-colors">
            <div className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] flex items-center justify-between">
              <span>TOTAL LOAD</span>
              <Activity className="w-3.5 h-3.5 text-[#525f56]" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#101512] tabular-nums tracking-tight">
                {(totalMonthlyKwh / 1000).toFixed(1)}
              </span>
              <span className="text-xs font-semibold text-[#6f7e75]">MWh</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px]">
              <span className="text-[#059669] font-medium">+3.2% vs baseline</span>
              <span className="text-[#6f7e75]">{totalCurrentKw.toFixed(0)} kW instant</span>
            </div>
          </div>

          {/* Rail 02: GRID DRAW */}
          <div className="p-4 sm:p-5 hover:bg-[#ecece4] transition-colors">
            <div className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] flex items-center justify-between">
              <span>GRID DRAW</span>
              <Zap className="w-3.5 h-3.5 text-[#0284c7]" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0284c7] tabular-nums tracking-tight">
                137.1
              </span>
              <span className="text-xs font-semibold text-[#6f7e75]">MWh</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px]">
              <span className="text-[#6f7e75]">-1.8% optimized</span>
              <span className="text-[#6f7e75]">73.7% draw</span>
            </div>
          </div>

          {/* Rail 03: SOLAR HARVEST */}
          <div className="p-4 sm:p-5 hover:bg-[#ecece4] transition-colors">
            <div className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] flex items-center justify-between">
              <span>SOLAR YIELD</span>
              <SunMedium className="w-3.5 h-3.5 text-[#059669]" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#059669] tabular-nums tracking-tight">
                48.9
              </span>
              <span className="text-xs font-semibold text-[#6f7e75]">MWh</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px]">
              <span className="text-[#059669] font-medium">+12.4% vs clear day</span>
              <span className="text-[#6f7e75]">{totalSolarCapacity} kWp array</span>
            </div>
          </div>

          {/* Rail 04: RENEWABLE SHARE */}
          <div className="p-4 sm:p-5 hover:bg-[#ecece4] transition-colors">
            <div className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] flex items-center justify-between">
              <span>RENEWABLE SHARE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#101512] tabular-nums tracking-tight">
                34.2
              </span>
              <span className="text-xs font-semibold text-[#6f7e75]">%</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px]">
              <span className="text-[#059669] font-medium">+4.1% offset</span>
              <span className="text-[#6f7e75]">41.2t CO₂ avoided</span>
            </div>
          </div>

          {/* Rail 05: MONTHLY COST */}
          <div className="p-4 sm:p-5 hover:bg-[#ecece4] transition-colors col-span-2 md:col-span-1">
            <div className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] flex items-center justify-between">
              <span>ESTIMATED BILL</span>
              <IndianRupee className="w-3.5 h-3.5 text-[#525f56]" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#101512] tabular-nums tracking-tight">
                ₹{(totalMonthlyCost / 100000).toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-[#6f7e75]">Lakh</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px]">
              <span className="text-[#059669] font-medium">-₹3.68L solar save</span>
              <span className="text-[#6f7e75]">Budget ₹15.5L</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. EDITORIAL ENERGY CANVAS: "TODAY'S ENERGY RHYTHM"
          ======================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 border-b border-[#e2e2d8] gap-3">
          <div>
            <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#6f7e75]">
              LOAD CURVE TELEMETRY // 24-HOUR PROFILE
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101512] tracking-tight font-editorial mt-0.5">
              TODAY'S ENERGY RHYTHM
            </h2>
            <p className="text-xs text-[#525f56] font-sans">
              Instantaneous aggregate power demand plotted against the sanctioned ceiling and time-of-day tariff window.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
            <div className="inline-flex bg-[#ebebe2] p-0.5 border border-[#d6d6cb]">
              <button
                onClick={() => setConsumptionView('daily')}
                className={`px-3 py-1 cursor-pointer transition-colors ${
                  consumptionView === 'daily'
                    ? 'bg-[#101512] text-[#fbfbfa] font-bold'
                    : 'text-[#525f56] hover:text-[#101512]'
                }`}
              >
                24-Hour Day Profile
              </button>
              <button
                onClick={() => setConsumptionView('weekly')}
                className={`px-3 py-1 cursor-pointer transition-colors ${
                  consumptionView === 'weekly'
                    ? 'bg-[#101512] text-[#fbfbfa] font-bold'
                    : 'text-[#525f56] hover:text-[#101512]'
                }`}
              >
                7-Day Weekly Rhythm
              </button>
            </div>
          </div>
        </div>

        {/* Editorial Chart Canvas */}
        <div className="bg-[#fbfbfa] border border-[#e2e2d8] p-5 sm:p-7 relative overflow-hidden">
          {/* Editorial Callout Annotations on Canvas */}
          <div className="hidden lg:grid grid-cols-3 gap-4 pb-4 mb-2 border-b border-[#ebebe2] text-xs font-mono">
            <div className="border-l-2 border-amber-600 pl-2.5">
              <span className="text-[10px] text-[#9a3412] uppercase block tracking-wider font-bold">14:00 — 17:30</span>
              <span className="font-bold text-[#101512]">PEAK TARIFF SURCHARGE</span>
              <p className="text-[11px] text-[#6f7e75] font-sans mt-0.5">
                Elevated commercial tariff rate of ₹11.20/kWh applied across state discom grid.
              </p>
            </div>

            <div className="border-l-2 border-rose-600 pl-2.5">
              <span className="text-[10px] text-rose-600 uppercase block tracking-wider font-bold">14:24</span>
              <span className="font-bold text-[#101512]">DEMAND SPIKE DETECTED</span>
              <p className="text-[11px] text-[#6f7e75] font-sans mt-0.5">
                Gurugram HVAC chiller staging caused temporary 310.8 kW surge (+7.2%).
              </p>
            </div>

            <div className="border-l-2 border-[#059669] pl-2.5">
              <span className="text-[10px] text-[#059669] uppercase block tracking-wider font-bold">17:30</span>
              <span className="font-bold text-[#101512]">OFF-PEAK TRANSITION</span>
              <p className="text-[11px] text-[#6f7e75] font-sans mt-0.5">
                Tariff resets to base rate ₹7.80/kWh; factory shift change load decline expected.
              </p>
            </div>
          </div>

          <div className="w-full h-[320px] sm:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={consumptionChartData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#e8e8df" vertical={false} />
                <XAxis
                  dataKey="time"
                  stroke="#8e9e94"
                  fontSize={11}
                  tickLine={false}
                  fontFamily="var(--font-mono)"
                />
                <YAxis
                  stroke="#8e9e94"
                  fontSize={11}
                  tickLine={false}
                  fontFamily="var(--font-mono)"
                  domain={[0, 'auto']}
                />
                <Tooltip content={<CustomConsumptionTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="plainline"
                  wrapperStyle={{ fontSize: '11px', paddingBottom: '12px', fontFamily: 'var(--font-mono)' }}
                />

                {/* Tariff Peak Window Reference Area */}
                {consumptionView === 'daily' && (
                  <ReferenceArea
                    x1="14:00"
                    x2="16:00"
                    fill="#d97706"
                    fillOpacity={0.08}
                  />
                )}

                {/* Peak Sanctioned Demand Limit Reference Line */}
                <ReferenceLine
                  y={600}
                  stroke="#e11d48"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: 'SANCTIONED CEILING: 600 kW',
                    position: 'top',
                    fill: '#e11d48',
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="total"
                  name="Aggregate Demand (kW)"
                  stroke="#101512"
                  strokeWidth={2.5}
                  dot={{ r: 2.5, fill: '#101512' }}
                  activeDot={{ r: 5, fill: '#059669' }}
                />
                <Line
                  type="monotone"
                  dataKey="grid"
                  name="Grid Utility Draw (kW)"
                  stroke="#0284c7"
                  strokeWidth={1.8}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="solar"
                  name="Rooftop Solar PV (kW)"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={{ r: 2, fill: '#059669' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-[#ebebe2] flex flex-wrap items-center justify-between text-xs font-mono text-[#6f7e75] gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-amber-500/20 border border-amber-600 inline-block" />
                <span>TOD Tariff Surcharge Zone</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-rose-600 inline-block" />
                <span>Contract Demand Ceiling</span>
              </span>
            </div>
            <div>
              Generated with Submeter Ingester v2.4 · 99.8% Packet Integrity
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. FACILITY COMMAND BOARD (Numbered Instrumentation Rows)
          ======================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 border-b border-[#e2e2d8] gap-3">
          <div>
            <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#6f7e75]">
              OPERATIONAL NODES // MULTI-SITE TELEMETRY
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101512] tracking-tight font-editorial mt-0.5">
              FACILITY COMMAND BOARD
            </h2>
            <p className="text-xs text-[#525f56] font-sans">
              Live power utilization, sanctioned demand ratios, and distributed rooftop solar yield by site.
            </p>
          </div>

          <button
            onClick={() => onNavigate('facilities')}
            className="text-xs font-mono font-bold text-[#059669] hover:text-[#047857] flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>VIEW ALL 5 SITES IN COMMAND VIEW</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Command Board Table / Rail List */}
        <div className="border border-[#e2e2d8] divide-y divide-[#e2e2d8] bg-[#fbfbfa]">
          {facilities.map((fac, idx) => {
            const usagePercent = Math.round((fac.currentConsumptionKw / fac.peakThresholdKw) * 100);
            const isOverload = usagePercent > 100;
            const isWarning = usagePercent > 85 && !isOverload;

            return (
              <div
                key={fac.id}
                onClick={() => onSelectFacilityDetail(fac.id)}
                className="p-4 sm:p-5 hover:bg-[#f5f5ee] transition-all cursor-pointer group flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-mono"
              >
                {/* Index + Name & Location */}
                <div className="flex items-start gap-4 min-w-[280px]">
                  <span className="text-lg font-bold text-[#8e9e94] group-hover:text-[#059669] transition-colors tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-[#101512] tracking-tight group-hover:text-[#059669] transition-colors font-sans">
                        {fac.name}
                      </h3>
                      <span className="text-[10px] uppercase tracking-wider text-[#6f7e75] bg-[#ebebe2] px-1.5 py-0.2">
                        {fac.type}
                      </span>
                    </div>
                    <p className="text-xs text-[#6f7e75] mt-0.5">
                      {fac.location}
                    </p>
                  </div>
                </div>

                {/* Instant Load & Capacity */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 lg:gap-10">
                  <div>
                    <span className="text-[10px] text-[#6f7e75] uppercase block">LIVE DEMAND</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className={`text-xl sm:text-2xl font-bold tabular-nums ${isOverload ? 'text-rose-600' : 'text-[#101512]'}`}>
                        {fac.currentConsumptionKw.toFixed(1)}
                      </span>
                      <span className="text-xs text-[#6f7e75]">kW</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#6f7e75] uppercase block">CONTRACT CAP</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xl sm:text-2xl font-bold text-[#525f56] tabular-nums">
                        {fac.peakThresholdKw}
                      </span>
                      <span className="text-xs text-[#6f7e75]">kW</span>
                    </div>
                  </div>

                  <div className="hidden sm:block">
                    <span className="text-[10px] text-[#6f7e75] uppercase block">ROOFTOP SOLAR</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xl sm:text-2xl font-bold text-[#059669] tabular-nums">
                        {fac.solarCapacityKwp}
                      </span>
                      <span className="text-xs text-[#6f7e75]">kWp</span>
                    </div>
                  </div>
                </div>

                {/* Load Bar + Status Indicator */}
                <div className="flex items-center gap-6 lg:min-w-[260px]">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#6f7e75]">Utilization</span>
                      <span className={`font-bold tabular-nums ${isOverload ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-[#059669]'}`}>
                        {usagePercent}%
                      </span>
                    </div>
                    <div className="w-full bg-[#e2e2d8] h-1.5 overflow-hidden">
                      <div
                        className={`h-full ${isOverload ? 'bg-rose-600' : isWarning ? 'bg-amber-600' : 'bg-[#059669]'}`}
                        style={{ width: `${Math.min(usagePercent, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isOverload
                          ? 'bg-rose-600 signal-pulse'
                          : isWarning
                          ? 'bg-amber-500'
                          : 'bg-[#059669]'
                      }`}
                    />
                    <span className="text-xs font-bold text-[#101512] uppercase tracking-wider">
                      {isOverload ? 'OVERLOAD' : isWarning ? 'HIGH' : 'NORMAL'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#8e9e94] group-hover:translate-x-1 group-hover:text-[#101512] transition-all" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          6. ASYMMETRIC SECTION: AI ENERGY OPPORTUNITY (7 cols) + OPERATIONS LOG (5 cols)
          ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        {/* Left Column (7 cols): AI Energy Opportunity (Intelligent Analyst Editorial) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e2e2d8]">
            <div>
              <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#059669] font-bold">
                INTELLIGENT ENERGY DISPATCH // AI CO-PILOT
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#101512] tracking-tight font-editorial mt-0.5">
                ENERGY OPPORTUNITY
              </h2>
            </div>
            <button
              onClick={() => onNavigate('recommendations')}
              className="text-xs font-mono text-[#059669] hover:text-[#047857] font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>ALL DISPATCHES</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {recommendations.slice(0, 2).map((rec) => (
              <div
                key={rec.id}
                className="p-5 sm:p-6 bg-[#f5f5ee] border border-[#dcdcd2] relative"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 font-mono">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#6f7e75] block">
                      SITE: {rec.facilityName.toUpperCase()}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#101512] font-sans mt-0.5">
                      {rec.title}
                    </h3>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <span className="text-[10px] text-[#6f7e75] uppercase block">ESTIMATED MONTHLY SAVING</span>
                    <div className="text-xl sm:text-2xl font-extrabold text-[#059669] tabular-nums">
                      ₹{rec.estimatedCostSavingInr.toLocaleString()}
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-[#525f56] font-sans leading-relaxed">
                  {rec.reason}
                </p>

                <div className="mt-4 pt-3 border-t border-[#dcdcd2] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-3 text-[#6f7e75]">
                    <span className="text-[#059669] font-bold">-{rec.estimatedSavingPercent}% Peak Reduction</span>
                    <span>·</span>
                    <span>92% Confidence Score</span>
                    <span>·</span>
                    <span>Ready for Setpoint Dispatch</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onApplyRecommendation(rec.id)}
                      disabled={rec.isApplied}
                      className={`px-3 py-1.5 font-mono text-xs font-bold transition-all cursor-pointer ${
                        rec.isApplied
                          ? 'bg-[#dcdcd2] text-[#6f7e75] cursor-not-allowed'
                          : 'bg-[#059669] hover:bg-[#047857] text-white shadow-sm'
                      }`}
                    >
                      {rec.isApplied ? 'DISPATCH EXECUTED' : 'EXECUTE LOAD SHIFT'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 cols): Operations Log Timeline */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e2e2d8]">
            <div>
              <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#6f7e75]">
                INCIDENT DISPATCH // CHRONOLOGICAL LOG
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#101512] tracking-tight font-editorial mt-0.5">
                OPERATIONS LOG
              </h2>
            </div>
            <button
              onClick={() => onNavigate('alerts')}
              className="text-xs font-mono text-[#059669] hover:text-[#047857] font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>OPERATIONS LOG ({alerts.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#e2e2d8] border border-[#e2e2d8] bg-[#fbfbfa]">
            {alerts.slice(0, 4).map((al) => {
              const isResolved = al.status === 'Resolved';
              const isCritical = al.severity === 'Critical';

              return (
                <div key={al.id} className="p-4 hover:bg-[#f5f5ee] transition-colors font-mono">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[#8e9e94] tabular-nums font-bold">
                        {al.timestamp.split(' ')[1] || al.timestamp}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isResolved
                            ? 'bg-[#8e9e94]'
                            : isCritical
                            ? 'bg-rose-600 signal-pulse'
                            : 'bg-amber-500'
                        }`}
                      />
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          isResolved
                            ? 'text-[#8e9e94]'
                            : isCritical
                            ? 'text-rose-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {isResolved ? 'RESOLVED' : al.severity.toUpperCase()}
                      </span>
                    </div>

                    {!isResolved && (
                      <button
                        onClick={() => onResolveAlert(al.id)}
                        className="text-[11px] font-bold text-[#059669] hover:text-[#047857] cursor-pointer"
                      >
                        ACKNOWLEDGE
                      </button>
                    )}
                  </div>

                  <div className="mt-1.5">
                    <h4 className="text-xs font-bold text-[#101512] font-sans">
                      {al.facilityName} — {al.title}
                    </h4>
                    <p className="text-[11px] text-[#6f7e75] font-sans mt-0.5">
                      {al.description}
                    </p>
                    <div className="mt-1 text-[10px] text-[#8e9e94]">
                      Recorded Value: <span className="font-bold text-[#101512]">{al.currentValue}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
