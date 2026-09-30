import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
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
import { HOURLY_CONSUMPTION_DATA, WEEKLY_CONSUMPTION_DATA } from '../../data/mockData';
import { PlatformShell } from '../common/PlatformShell';

export const FacilityDetailPage = ({
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
  const [timeRange, setTimeRange] = useState('daily');

  const fac = facility || (facilities && facilities[0]) || {};
  const facId = fac.id;

  // Filter alerts & recommendations for this specific facility
  const facilityAlerts = alerts.filter((a) => (a.facilityId === facId) || (a.facility === facId));
  const facilityRecs = recommendations.filter((r) => (r.facilityId === facId) || (r.facility === facId));

  const currentKw = fac.currentConsumptionKw ?? fac.current_consumption ?? 400;
  const peakCap = fac.peakThresholdKw ?? fac.peak_threshold_kw ?? 460;
  const solarCap = fac.solarCapacityKwp ?? fac.solar_capacity_kwp ?? 150;
  const monthlyKwh = fac.monthlyConsumptionKwh ?? fac.monthly_consumption ?? 0;
  const floorArea = fac.floorAreaSqFt ?? fac.floor_area_sq_ft ?? 100000;

  // Scaled consumption data for this specific facility
  const scale = currentKw / 400;
  const scaledData = (timeRange === 'daily' ? HOURLY_CONSUMPTION_DATA : WEEKLY_CONSUMPTION_DATA).map(
    (item) => ({
      ...item,
      grid: Math.round(item.grid * scale),
      solar: Math.round(item.solar * (solarCap / 150)),
      total: Math.round(item.grid * scale + item.solar * (solarCap / 150)),
    })
  );

  const usagePercent = Math.round((currentKw / (peakCap || 1)) * 100);
  const isOverload = usagePercent > 100;
  const isWarning = usagePercent > 80 && !isOverload;
  const energyIntensity = (monthlyKwh / (floorArea || 1)).toFixed(2);

  // Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white text-slate-800 p-3 rounded-lg border border-slate-200 shadow-lg text-xs">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-100 font-semibold text-slate-500">
            <span>{timeRange === 'daily' ? `Time: ${label}` : `Day: ${label}`}</span>
            {(label === '14:00' || label === '16:00') && (
              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-bold">
                TOD Peak
              </span>
            )}
          </div>
          <div className="space-y-1">
            {payload.map((entry, index) => (
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
      pageTitle={fac.name || 'Campus Detail'}
      pageCategory="Campus Node Detail"
      pageDescription={`${fac.location || ''} · ${fac.type || ''} · ${(floorArea).toLocaleString()} sq ft · BEE 5-Star Energy Efficiency Certified`}
      activeFacilityName={fac.name}
      onNavigate={onNavigate}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 font-semibold text-xs transition-all hover:shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Campuses</span>
          </button>
        </div>
      }
    >
      {/* 1. Quick Campus Switcher & Real-Time Readout Header */}
      <div
        className="bg-white border border-slate-200/80 rounded-2xl p-6"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                {fac.type || 'Commercial Tech Campus'}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 signal-pulse" />
                <span>IoT Submeter Bus Active (Modbus RTU)</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1 text-slate-700 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {fac.location || 'India'}
              </span>
              <span className="text-slate-300">·</span>
              <span>{(floorArea).toLocaleString()} sq ft</span>
              <span className="text-slate-300">·</span>
              <span className="font-semibold text-emerald-700">
                Energy Intensity: {energyIntensity} kWh/sq ft
              </span>
            </div>

            {/* Quick Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3.5 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-medium mr-1">Switch Site:</span>
              {facilities.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onSelectFacility(f.id)}
                  className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all cursor-pointer ${
                    f.id === facility.id
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold shadow-xs'
                      : 'bg-slate-100/80 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {f.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* High-Impact Readout */}
          <div className="flex items-center gap-6 sm:gap-8 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-8 shrink-0">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Live Demand Load
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className={`text-3xl font-extrabold tracking-tight font-mono ${isOverload ? 'text-rose-600' : 'text-slate-900'}`}>
                  {currentKw.toFixed(1)}
                </span>
                <span className="text-xs font-semibold text-slate-400">kW</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block font-mono">
                Cap: {peakCap} kW
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Cap Utilization
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span
                  className={`text-3xl font-extrabold tracking-tight font-mono ${
                    isOverload ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'
                  }`}
                >
                  {usagePercent}%
                </span>
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 block ${
                  isOverload ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'
                }`}
              >
                {isOverload ? 'Overload' : isWarning ? 'Elevated' : 'Nominal'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Instrumentation Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Solar PV Array
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-emerald-700 tracking-tight font-mono">
              {facility.solarCapacityKwp}
            </span>
            <span className="text-xs text-slate-400 font-medium">kWp</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block font-semibold">
            {facility.renewableSharePercent}% renewable share
          </span>
        </div>

        <div
          className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Peak Demand Window
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-slate-900 font-mono">
              {facility.peakUsageWindow}
            </span>
          </div>
          <span className="text-[11px] text-amber-700 mt-1 block font-medium">
            Time-of-day tariff surcharge zone
          </span>
        </div>

        <div
          className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Monthly Consumption
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
              {(facility.monthlyConsumptionKwh / 1000).toFixed(0)}
            </span>
            <span className="text-xs text-slate-400 font-medium">MWh / mo</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            ₹{(facility.estimatedCostInr / 100000).toFixed(2)}L estimated bill
          </span>
        </div>

        <div
          className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Solar Cost Savings
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-emerald-700 tracking-tight font-mono">
              ₹{(facility.monthlySavingsInr / 1000).toFixed(0)}k
            </span>
            <span className="text-xs text-slate-400 font-medium">/ month</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block font-semibold">
            Direct net-metering offset
          </span>
        </div>
      </div>

      {/* 3. Real-Time Telemetry Load Curve */}
      <section
        className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Submeter Diurnal Load Profile ({facility.name})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Instantaneous telemetry readings contrasting grid intake with solar PV offset.
            </p>
          </div>

          <div className="inline-flex rounded-xl border border-slate-200/80 p-1 bg-slate-100/70 shadow-xs">
            <button
              onClick={() => setTimeRange('daily')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                timeRange === 'daily'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today (24h)
            </button>
            <button
              onClick={() => setTimeRange('weekly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                timeRange === 'weekly'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7-Day Trend
            </button>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scaledData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 11, paddingBottom: 8 }} />

              {timeRange === 'daily' && (
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
              )}

              <ReferenceLine
                y={facility.peakThresholdKw}
                stroke="#e11d48"
                strokeDasharray="4 4"
                label={{
                  value: `Cap: ${facility.peakThresholdKw} kW`,
                  fill: '#e11d48',
                  fontSize: 10,
                  position: 'insideBottomRight',
                }}
              />

              <Line
                type="monotone"
                dataKey="total"
                name="Total Load (kW)"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="grid"
                name="Grid Draw (kW)"
                stroke="#0284c7"
                strokeWidth={1.8}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="solar"
                name="Solar Yield (kW)"
                stroke="#f59e0b"
                strokeWidth={1.8}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 4. Submeter Electrical Loop Breakdown */}
      <section
        className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
      >
        <h3 className="text-base font-bold text-slate-900 pb-3 mb-4 border-b border-slate-100 tracking-tight">
          Submeter Electrical Distribution Loops
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/80">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">HVAC Central Chiller Plant</span>
              <span className="font-bold text-slate-900 font-mono">
                {Math.round(facility.currentConsumptionKw * 0.44)} kW
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2.5 overflow-hidden">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '44%' }} />
            </div>
            <span className="text-[11px] text-slate-500 mt-1.5 block">44% of instant campus draw</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/80">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Server Room &amp; UPS Bus</span>
              <span className="font-bold text-slate-900 font-mono">
                {Math.round(facility.currentConsumptionKw * 0.28)} kW
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2.5 overflow-hidden">
              <div className="bg-sky-500 h-2 rounded-full" style={{ width: '28%' }} />
            </div>
            <span className="text-[11px] text-slate-500 mt-1.5 block">28% of instant campus draw</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/80">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Lighting, Plugs &amp; Elevators</span>
              <span className="font-bold text-slate-900 font-mono">
                {Math.round(facility.currentConsumptionKw * 0.28)} kW
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2.5 overflow-hidden">
              <div className="bg-amber-500 h-2 rounded-full" style={{ width: '28%' }} />
            </div>
            <span className="text-[11px] text-slate-500 mt-1.5 block">28% of instant campus draw</span>
          </div>
        </div>
      </section>

      {/* 5. Active Campus Recommendations */}
      {facilityRecs.length > 0 && (
        <section
          className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
        >
          <h3 className="text-base font-bold text-slate-900 pb-3 mb-4 border-b border-slate-100 tracking-tight">
            Active Setpoint Opportunities for this Campus
          </h3>

          <div className="space-y-3">
            {facilityRecs.map((rec) => (
              <div
                key={rec.id}
                className="p-4 sm:p-5 rounded-xl border border-slate-200/80 bg-slate-50/80 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{rec.title}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Save ₹{rec.estimatedCostSavingInr.toLocaleString()}/mo
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">{rec.reason}</p>
                </div>

                <button
                  onClick={() => onApplyRecommendation(rec.id)}
                  disabled={rec.isApplied}
                  className={`px-4 py-2 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                    rec.isApplied
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-sm hover:shadow'
                  }`}
                >
                  {rec.isApplied ? 'Setpoint Active' : 'Deploy Setpoint'}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </PlatformShell>
  );
};
