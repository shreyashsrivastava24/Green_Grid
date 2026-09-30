import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Radio,
  SunMedium,
  Zap,
  Activity,
  ShieldAlert,
  ChevronRight,
  Cpu,
  Layers,
  ArrowRight,
  TrendingUp,
  Building2,
  CheckCircle2,
  AlertTriangle,
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
import { PlatformShell } from '../common/PlatformShell';

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

  // Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
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
      pageTitle={facility.name}
      pageCategory="Campus Node Detail"
      pageDescription={`${facility.location} · ${facility.type} · ${facility.floorAreaSqFt.toLocaleString()} sq ft · BEE 5-Star Energy Efficiency Certified`}
      activeFacilityName={facility.name}
      onNavigate={onNavigate}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Campuses</span>
          </button>
        </div>
      }
    >
      {/* 1. Quick Campus Switcher & Real-Time Readout Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                {facility.type}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-green-700 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 signal-pulse" />
                <span>IoT Submeter Bus Active (Modbus RTU)</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1 text-slate-700 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {facility.location}
              </span>
              <span className="text-slate-300">·</span>
              <span>{facility.floorAreaSqFt.toLocaleString()} sq ft</span>
              <span className="text-slate-300">·</span>
              <span className="font-semibold text-green-700">
                Energy Intensity: {energyIntensity} kWh/sq ft
              </span>
            </div>

            {/* Quick Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-medium mr-1">Switch Site:</span>
              {facilities.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onSelectFacility(f.id)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                    f.id === facility.id
                      ? 'bg-green-700 text-white font-semibold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
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
              <span className="text-xs font-semibold text-slate-500 uppercase block">
                Live Demand Load
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className={`text-3xl font-bold ${isOverload ? 'text-rose-600' : 'text-slate-900'}`}>
                  {facility.currentConsumptionKw.toFixed(1)}
                </span>
                <span className="text-xs font-semibold text-slate-500">kW</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Contract cap: {facility.peakThresholdKw} kW
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase block">
                Cap Utilization
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span
                  className={`text-3xl font-bold ${
                    isOverload ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-green-700'
                  }`}
                >
                  {usagePercent}%
                </span>
              </div>
              <span
                className={`text-[11px] font-bold mt-0.5 block ${
                  isOverload ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-green-700'
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
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">
            Solar PV Array
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-green-700">
              {facility.solarCapacityKwp}
            </span>
            <span className="text-xs text-slate-500">kWp Installed</span>
          </div>
          <span className="text-[11px] text-green-700 mt-1 block font-medium">
            {facility.renewableSharePercent}% renewable share
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">
            Peak Demand Window
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-slate-900">
              {facility.peakUsageWindow}
            </span>
          </div>
          <span className="text-[11px] text-amber-700 mt-1 block font-medium">
            Time-of-day tariff surcharge zone
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">
            Monthly Consumption
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-slate-900">
              {(facility.monthlyConsumptionKwh / 1000).toFixed(0)}
            </span>
            <span className="text-xs text-slate-500">MWh / month</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            ₹{(facility.estimatedCostInr / 100000).toFixed(2)}L estimated bill
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">
            Solar Cost Savings
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-green-700">
              ₹{(facility.monthlySavingsInr / 1000).toFixed(0)}k
            </span>
            <span className="text-xs text-slate-500">/ month</span>
          </div>
          <span className="text-[11px] text-green-700 mt-1 block font-medium">
            Direct net-metering offset
          </span>
        </div>
      </div>

      {/* 3. Real-Time Telemetry Load Curve */}
      <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Submeter Diurnal Load Profile ({facility.name})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Instantaneous telemetry readings contrasting grid intake with solar PV offset.
            </p>
          </div>

          <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-slate-50">
            <button
              onClick={() => setTimeRange('daily')}
              className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer transition-colors ${
                timeRange === 'daily'
                  ? 'bg-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today (24h)
            </button>
            <button
              onClick={() => setTimeRange('weekly')}
              className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer transition-colors ${
                timeRange === 'weekly'
                  ? 'bg-green-700 text-white shadow-xs'
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
                stroke="#15803d"
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
                stroke="#eab308"
                strokeWidth={1.8}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 4. Submeter Electrical Loop Breakdown */}
      <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 pb-3 mb-4 border-b border-slate-100">
          Submeter Electrical Distribution Loops
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-slate-200 bg-[#fbfbfa]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">HVAC Central Chiller Plant</span>
              <span className="font-bold text-slate-900">
                {Math.round(facility.currentConsumptionKw * 0.44)} kW
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
              <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '44%' }} />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">44% of instant campus draw</span>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-[#fbfbfa]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Server Room &amp; UPS Bus</span>
              <span className="font-bold text-slate-900">
                {Math.round(facility.currentConsumptionKw * 0.28)} kW
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
              <div className="bg-sky-600 h-1.5 rounded-full" style={{ width: '28%' }} />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">28% of instant campus draw</span>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-[#fbfbfa]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Lighting, Plugs &amp; Elevators</span>
              <span className="font-bold text-slate-900">
                {Math.round(facility.currentConsumptionKw * 0.28)} kW
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '28%' }} />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">28% of instant campus draw</span>
          </div>
        </div>
      </section>

      {/* 5. Active Campus Recommendations */}
      {facilityRecs.length > 0 && (
        <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 pb-3 mb-4 border-b border-slate-100">
            Active Setpoint Opportunities for this Campus
          </h3>

          <div className="space-y-3">
            {facilityRecs.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-lg border border-slate-200 bg-[#fbfbfa] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{rec.title}</span>
                    <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.2 rounded">
                      Save ₹{rec.estimatedCostSavingInr.toLocaleString()}/mo
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">{rec.reason}</p>
                </div>

                <button
                  onClick={() => onApplyRecommendation(rec.id)}
                  disabled={rec.isApplied}
                  className={`px-3.5 py-1.5 rounded font-bold transition-all shrink-0 cursor-pointer ${
                    rec.isApplied
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : 'bg-green-700 hover:bg-green-800 text-white shadow-xs'
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
