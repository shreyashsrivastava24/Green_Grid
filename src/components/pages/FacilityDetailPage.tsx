import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Radio,
  SunMedium,
  Zap,
  Activity,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  Cpu,
  Layers,
  Clock,
  ArrowRight,
  TrendingUp,
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
  ReferenceArea,
  ReferenceLine,
} from 'recharts';
import { Facility, Alert, Recommendation, PageId } from '../../types';
import { HOURLY_CONSUMPTION_DATA, WEEKLY_CONSUMPTION_DATA } from '../../data/mockData';

interface FacilityDetailPageProps {
  facility: Facility;
  facilities: Facility[];
  alerts: Alert[];
  recommendations: Recommendation[];
  onBack: () => void;
  onSelectFacility: (id: string) => void;
  onNavigate: (page: PageId) => void;
  onResolveAlert: (alertId: string) => void;
  onApplyRecommendation: (recId: string) => void;
}

export const FacilityDetailPage: React.FC<FacilityDetailPageProps> = ({
  facility,
  facilities,
  alerts,
  recommendations,
  onBack,
  onSelectFacility,
  onNavigate,
  onResolveAlert,
  onApplyRecommendation,
}) => {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly'>('daily');

  // Filter alerts & recommendations for this specific facility
  const facilityAlerts = alerts.filter((a) => a.facilityId === facility.id);
  const facilityRecs = recommendations.filter((r) => r.facilityId === facility.id);

  // Scaled consumption data for this specific facility
  const scale = facility.currentConsumptionKw / 400;
  const scaledData = (timeRange === 'daily' ? HOURLY_CONSUMPTION_DATA : WEEKLY_CONSUMPTION_DATA).map(
    (item) => ({
      ...item,
      grid: Math.round(item.grid * scale),
      solar: Math.round(item.solar * (facility.solarCapacityKwp / 150)),
      total: Math.round(item.grid * scale + item.solar * (facility.solarCapacityKwp / 150)),
    })
  );

  const usagePercent = Math.round((facility.currentConsumptionKw / facility.peakThresholdKw) * 100);
  const isOverload = usagePercent > 100;
  const isWarning = usagePercent > 80 && !isOverload;
  const energyIntensity = (facility.monthlyConsumptionKwh / facility.floorAreaSqFt).toFixed(2);

  // Custom Editorial Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#101512] text-[#fbfbfa] p-3 rounded-xs border border-[#2a3830] shadow-xl text-xs font-mono">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/10">
            <span className="text-white/60 tracking-wider">
              {timeRange === 'daily' ? `TIME // ${label}` : `DAY // ${label}`}
            </span>
            {(label === '14:00' || label === '16:00') && (
              <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 py-0.2">
                TOD PEAK
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
    <div className="space-y-10 pb-16">
      {/* ========================================================
          1. CONTROL ROOM HERO
          ======================================================== */}
      <section className="pt-2">
        {/* Navigation Datum & Facility Switcher */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e2e2d8] font-mono text-xs">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#525f56] hover:text-[#101512] font-bold tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO FLEET CONSOLE</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-[#8e9e94] hidden sm:inline">SWITCH FACILITY:</span>
            <select
              value={facility.id}
              onChange={(e) => onSelectFacility(e.target.value)}
              className="bg-[#ebebe2] border border-[#d6d6cb] px-2.5 py-1 text-xs font-mono text-[#101512] font-semibold cursor-pointer focus:outline-hidden"
            >
              {facilities.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.location.split(',')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* The Control Room Monumental Header */}
        <div className="mt-6 flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-[#e2e2d8]">
          <div className="space-y-3">
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-[#059669] font-bold tracking-widest uppercase">
                {facility.id} // {facility.type}
              </span>
              <span className="text-[#8e9e94]">·</span>
              <span className="flex items-center gap-1.5 text-[#059669]">
                <Radio className="w-3.5 h-3.5 signal-pulse" />
                <span>IOT SUBMETER BUS ACTIVE (8s)</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#101512] tracking-tight leading-[1.05] font-editorial uppercase">
              {facility.name}
            </h1>

            <div className="flex items-center gap-2 text-sm text-[#525f56] font-sans">
              <MapPin className="w-4 h-4 text-[#8e9e94] shrink-0" />
              <span>{facility.location}</span>
              <span>·</span>
              <span>{facility.floorAreaSqFt.toLocaleString()} sq ft</span>
              <span>·</span>
              <span className="font-mono text-xs font-semibold text-[#101512]">
                Intensity: {energyIntensity} kWh/sq ft
              </span>
            </div>
          </div>

          {/* High-Impact Hero Telemetry Readout */}
          <div className="flex items-center gap-6 sm:gap-10 border-t lg:border-t-0 lg:border-l border-[#e2e2d8] pt-6 lg:pt-0 lg:pl-10 font-mono">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#6f7e75] block font-bold">
                LIVE DEMAND LOAD
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className={`text-4xl sm:text-5xl font-extrabold tabular-nums tracking-tight ${isOverload ? 'text-rose-600' : 'text-[#101512]'}`}>
                  {facility.currentConsumptionKw.toFixed(1)}
                </span>
                <span className="text-sm font-bold text-[#6f7e75]">kW</span>
              </div>
              <span className="text-xs text-[#6f7e75] mt-1 block">
                Contract cap: {facility.peakThresholdKw} kW
              </span>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#6f7e75] block font-bold">
                CAPACITY RATIO
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span
                  className={`text-4xl sm:text-5xl font-extrabold tabular-nums tracking-tight ${
                    isOverload ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-[#059669]'
                  }`}
                >
                  {usagePercent}%
                </span>
              </div>
              <span
                className={`text-xs font-bold mt-1 block uppercase ${
                  isOverload ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-[#059669]'
                }`}
              >
                {isOverload ? 'SANCTIONED OVERLOAD' : isWarning ? 'HIGH USAGE' : 'NOMINAL LOAD'}
              </span>
            </div>
          </div>
        </div>

        {/* Control Room Horizontal Instrumentation Rail */}
        <div className="border-b border-[#e2e2d8] bg-[#f5f5ee] divide-y md:divide-y-0 md:divide-x divide-[#dcdcd2] grid grid-cols-2 md:grid-cols-5 font-mono">
          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">SOLAR PV INVERTER</span>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-[#059669] tabular-nums">
                {facility.solarCapacityKwp}
              </span>
              <span className="text-xs text-[#6f7e75]">kWp</span>
            </div>
            <span className="text-[11px] text-[#059669] mt-0.5 block">{facility.renewableSharePercent}% solar share</span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">GRID DRAW SHARE</span>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-[#0284c7] tabular-nums">
                {facility.gridSharePercent}%
              </span>
            </div>
            <span className="text-[11px] text-[#6f7e75] mt-0.5 block">11kV Feeder bus</span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">MONTHLY UNITS</span>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-[#101512] tabular-nums">
                {(facility.monthlyConsumptionKwh / 1000).toFixed(1)}
              </span>
              <span className="text-xs text-[#6f7e75]">MWh</span>
            </div>
            <span className="text-[11px] text-[#6f7e75] mt-0.5 block">Recorded MTD</span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">PROJECTED COST</span>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-[#101512] tabular-nums">
                ₹{(facility.estimatedCostInr / 1000).toFixed(0)}k
              </span>
            </div>
            <span className="text-[11px] text-[#059669] mt-0.5 block">-₹{(facility.monthlySavingsInr / 1000).toFixed(0)}k saved</span>
          </div>

          <div className="p-4 sm:p-5 col-span-2 md:col-span-1">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">TOD TARIFF WINDOW</span>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-[#9a3412] tabular-nums">
                14:00 – 17:30
              </span>
            </div>
            <span className="text-[11px] text-[#9a3412] mt-0.5 block">₹11.20/kWh peak rate</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. CENTRAL CONTROL ROOM VISUALIZATION: CAMPUS BUS TOPOLOGY
          ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e2e2d8]">
          <div>
            <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#6f7e75]">
              INTERNAL SUBMETER DISTRIBUTION CIRCUIT
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#101512] tracking-tight font-editorial mt-0.5">
              CAMPUS SWITCHGEAR &amp; SUBMETER BUS
            </h2>
          </div>
          <span className="text-xs font-mono text-[#059669] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#059669] signal-pulse" />
            <span>4 PRIMARY SUBMETER LOOPS ONLINE</span>
          </span>
        </div>

        {/* Bus Topology Grid / Instrumentation Rail */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          <div className="p-5 bg-[#f5f5ee] border border-[#dcdcd2]">
            <div className="flex items-center justify-between text-xs text-[#6f7e75] mb-2">
              <span className="font-bold">BUS 01 // INCOMER</span>
              <Cpu className="w-4 h-4 text-[#0284c7]" />
            </div>
            <h4 className="text-sm font-bold text-[#101512] font-sans">
              11kV Step-Down Transformer
            </h4>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#0284c7] tabular-nums">
                {Math.round(facility.currentConsumptionKw * 0.65)}
              </span>
              <span className="text-xs text-[#6f7e75]">kW</span>
            </div>
            <p className="mt-2 text-xs text-[#6f7e75] font-sans">
              Primary grid feeder from state transmission discom. 65% total load share.
            </p>
          </div>

          <div className="p-5 bg-[#f5f5ee] border border-[#dcdcd2]">
            <div className="flex items-center justify-between text-xs text-[#6f7e75] mb-2">
              <span className="font-bold">BUS 02 // HVAC LOOP</span>
              <Activity className="w-4 h-4 text-[#d97706]" />
            </div>
            <h4 className="text-sm font-bold text-[#101512] font-sans">
              Chillers &amp; Cooling Towers
            </h4>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#d97706] tabular-nums">
                {Math.round(facility.currentConsumptionKw * 0.48)}
              </span>
              <span className="text-xs text-[#6f7e75]">kW</span>
            </div>
            <p className="mt-2 text-xs text-[#6f7e75] font-sans">
              Centrifugal chiller loop. Major contributor to current peak window demand surge.
            </p>
          </div>

          <div className="p-5 bg-[#f5f5ee] border border-[#dcdcd2]">
            <div className="flex items-center justify-between text-xs text-[#6f7e75] mb-2">
              <span className="font-bold">BUS 03 // SOLAR PV</span>
              <SunMedium className="w-4 h-4 text-[#059669]" />
            </div>
            <h4 className="text-sm font-bold text-[#101512] font-sans">
              Rooftop Inverter Array
            </h4>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#059669] tabular-nums">
                +{facility.solarCapacityKwp}
              </span>
              <span className="text-xs text-[#6f7e75]">kWp</span>
            </div>
            <p className="mt-2 text-xs text-[#6f7e75] font-sans">
              12 string inverters direct-feeding 415V secondary bus. Zero grid export limit active.
            </p>
          </div>

          <div className="p-5 bg-[#f5f5ee] border border-[#dcdcd2]">
            <div className="flex items-center justify-between text-xs text-[#6f7e75] mb-2">
              <span className="font-bold">BUS 04 // CRITICAL POD</span>
              <Zap className="w-4 h-4 text-[#101512]" />
            </div>
            <h4 className="text-sm font-bold text-[#101512] font-sans">
              Data Pods &amp; Labs (UPS)
            </h4>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#101512] tabular-nums">
                48.2
              </span>
              <span className="text-xs text-[#6f7e75]">kW</span>
            </div>
            <p className="mt-2 text-xs text-[#6f7e75] font-sans">
              Online double-conversion UPS battery bank. 100% mission-critical uptime guarantee.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. DEMAND CURVE & TOD TARIFF BAND TELEMETRY
          ======================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 border-b border-[#e2e2d8] gap-3">
          <div>
            <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#6f7e75]">
              LIVE TELEMETRY // LOAD PROFILE
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#101512] tracking-tight font-editorial mt-0.5">
              DEMAND RHYTHM &amp; TOD TARIFF SCHEDULE
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-[#ebebe2] p-0.5 border border-[#d6d6cb] font-mono text-xs">
            <button
              onClick={() => setTimeRange('daily')}
              className={`px-3 py-1 cursor-pointer transition-colors ${
                timeRange === 'daily'
                  ? 'bg-[#101512] text-[#fbfbfa] font-bold'
                  : 'text-[#525f56] hover:text-[#101512]'
              }`}
            >
              24-Hour Day Profile
            </button>
            <button
              onClick={() => setTimeRange('weekly')}
              className={`px-3 py-1 cursor-pointer transition-colors ${
                timeRange === 'weekly'
                  ? 'bg-[#101512] text-[#fbfbfa] font-bold'
                  : 'text-[#525f56] hover:text-[#101512]'
              }`}
            >
              7-Day Weekly Profile
            </button>
          </div>
        </div>

        <div className="bg-[#fbfbfa] border border-[#e2e2d8] p-5 sm:p-7 relative overflow-hidden">
          <div className="w-full h-[320px] sm:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scaledData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#e8e8df" vertical={false} />
                <XAxis dataKey="time" stroke="#8e9e94" fontSize={11} tickLine={false} fontFamily="var(--font-mono)" />
                <YAxis stroke="#8e9e94" fontSize={11} tickLine={false} fontFamily="var(--font-mono)" />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="plainline"
                  wrapperStyle={{ fontSize: '11px', paddingBottom: '12px', fontFamily: 'var(--font-mono)' }}
                />

                {timeRange === 'daily' && (
                  <ReferenceArea
                    x1="14:00"
                    x2="16:00"
                    fill="#d97706"
                    fillOpacity={0.08}
                  />
                )}

                <ReferenceLine
                  y={facility.peakThresholdKw}
                  stroke="#e11d48"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: `SANCTIONED CEILING: ${facility.peakThresholdKw} kW`,
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
                  name="Facility Demand (kW)"
                  stroke="#101512"
                  strokeWidth={2.5}
                  dot={{ r: 2.5, fill: '#101512' }}
                  activeDot={{ r: 5, fill: '#059669' }}
                />
                <Line
                  type="monotone"
                  dataKey="grid"
                  name="11kV Grid Incomer (kW)"
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
            <span>TOD Surcharge Window: 14:00 – 17:30 IST (₹11.20/kWh)</span>
            <span className="text-[#059669] font-bold">Power Factor: 0.96 Lagging · Voltage THD: 1.8%</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. ASYMMETRIC SECTION: SITE ALERTS + SITE AI DISPATCH
          ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Site AI Dispatch Recommendation */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e2e2d8]">
            <h3 className="text-lg font-bold text-[#101512] font-editorial uppercase tracking-tight">
              ENERGY OPPORTUNITY DISPATCH
            </h3>
            <button
              onClick={() => onNavigate('recommendations')}
              className="text-xs font-mono text-[#059669] font-bold hover:underline"
            >
              ALL DISPATCHES →
            </button>
          </div>

          {facilityRecs.length === 0 ? (
            <div className="p-6 bg-[#f5f5ee] border border-[#dcdcd2] text-xs font-mono text-[#6f7e75]">
              No active load shift recommendations for {facility.name}. Current setpoints are optimal.
            </div>
          ) : (
            <div className="space-y-4">
              {facilityRecs.map((rec) => (
                <div key={rec.id} className="p-6 bg-[#f5f5ee] border border-[#dcdcd2]">
                  <div className="flex items-start justify-between gap-4 font-mono">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#6f7e75] block">
                        AUTOMATED SETPOINT RECOMMENDATION
                      </span>
                      <h4 className="text-base font-bold text-[#101512] font-sans mt-0.5">
                        {rec.title}
                      </h4>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-[#6f7e75] uppercase block">ESTIMATED SAVING</span>
                      <span className="text-xl font-extrabold text-[#059669]">
                        ₹{rec.estimatedCostSavingInr.toLocaleString()}/MO
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-[#525f56] font-sans leading-relaxed">
                    {rec.reason}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#dcdcd2] flex items-center justify-between font-mono text-xs">
                    <span className="text-[#059669] font-bold">-{rec.estimatedSavingPercent}% Peak kW Reduction</span>
                    <button
                      onClick={() => onApplyRecommendation(rec.id)}
                      disabled={rec.isApplied}
                      className={`px-3 py-1.5 font-bold transition-all cursor-pointer ${
                        rec.isApplied
                          ? 'bg-[#dcdcd2] text-[#6f7e75] cursor-not-allowed'
                          : 'bg-[#059669] hover:bg-[#047857] text-white shadow-sm'
                      }`}
                    >
                      {rec.isApplied ? 'DISPATCH APPLIED' : 'EXECUTE LOAD SHIFT'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Site Overload & Operations Timeline */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e2e2d8]">
            <h3 className="text-lg font-bold text-[#101512] font-editorial uppercase tracking-tight">
              SITE OPERATIONS TIMELINE
            </h3>
            <span className="text-xs font-mono text-[#6f7e75]">TODAY</span>
          </div>

          <div className="border border-[#e2e2d8] divide-y divide-[#e2e2d8] bg-[#fbfbfa]">
            {facilityAlerts.length === 0 ? (
              <div className="p-4 text-xs font-mono text-[#6f7e75]">
                Zero active overload or power factor alerts at this facility.
              </div>
            ) : (
              facilityAlerts.map((al) => (
                <div key={al.id} className="p-4 font-mono text-xs hover:bg-[#f5f5ee] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[#8e9e94]">{al.timestamp.split(' ')[1] || al.timestamp}</span>
                      <span className={`w-2 h-2 rounded-full ${al.status === 'Resolved' ? 'bg-[#8e9e94]' : 'bg-rose-600 signal-pulse'}`} />
                      <span className="font-bold text-rose-600 uppercase">{al.severity}</span>
                    </div>
                    {al.status !== 'Resolved' && (
                      <button
                        onClick={() => onResolveAlert(al.id)}
                        className="font-bold text-[#059669] hover:text-[#047857] cursor-pointer"
                      >
                        RESOLVE
                      </button>
                    )}
                  </div>
                  <h4 className="mt-1 font-bold text-[#101512] font-sans text-xs">
                    {al.title}
                  </h4>
                  <p className="text-[11px] text-[#6f7e75] font-sans mt-0.5">
                    {al.description}
                  </p>
                  <div className="mt-1 text-[10px] text-[#8e9e94]">
                    Recorded: <span className="font-bold text-rose-600">{al.currentValue}</span> / Cap {al.thresholdValue}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
