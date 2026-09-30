import React, { useState } from 'react';
import {
  ArrowRight,
  AlertTriangle,
  Building2,
  Sparkles,
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
import { EnergyFlowDiagram } from '../common/EnergyFlowDiagram';
import { PlatformShell } from '../common/PlatformShell';
import {
  HOURLY_CONSUMPTION_DATA,
  WEEKLY_CONSUMPTION_DATA,
} from '../../data/mockData';

export const DashboardPage = ({
  facilities,
  alerts,
  recommendations,
  onNavigate,
  onSelectFacilityDetail,
  onResolveAlert,
  onApplyRecommendation,
}) => {
  const [consumptionView, setConsumptionView] = useState('daily');

  // Aggregated operational metrics
  const totalCurrentKw = facilities.reduce((sum, f) => sum + (f.currentConsumptionKw ?? f.current_consumption ?? 0), 0);
  const totalMonthlyKwh = facilities.reduce((sum, f) => sum + (f.monthlyConsumptionKwh ?? f.monthly_consumption ?? 0), 0);
  const totalMonthlyCost = facilities.reduce((sum, f) => sum + (f.estimatedCostInr ?? f.estimated_cost ?? 0), 0);
  const totalSolarCapacity = facilities.reduce((sum, f) => sum + (f.solarCapacityKwp ?? f.solar_capacity_kwp ?? 0), 0);
  const totalPeakThreshold = facilities.reduce((sum, f) => sum + (f.peakThresholdKw ?? f.peak_threshold_kw ?? 0), 0);

  const consumptionChartData =
    consumptionView === 'daily' ? HOURLY_CONSUMPTION_DATA : WEEKLY_CONSUMPTION_DATA;

  // Clean Tooltip
  const CustomConsumptionTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white text-slate-800 p-3 rounded-lg border border-slate-200 shadow-lg text-xs">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-100 font-semibold text-slate-500">
            <span>{consumptionView === 'daily' ? `Time: ${label}` : `Day: ${label}`}</span>
            {(label === '14:00' || label === '16:00') && (
              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-bold">
                TOD Peak Tariff
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
    <PlatformShell
      pageTitle="Enterprise Energy Command Center"
      pageCategory="Supervisory Telemetry"
      pageDescription="Real-time supervisory telemetry across 5 enterprise campuses, 1,480 kWp distributed solar arrays, and automated BACnet building management loops."
      onNavigate={onNavigate}
      actions={
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-md text-xs">
            <span className="w-2 h-2 rounded-full bg-green-600 signal-pulse" />
            <span className="font-bold text-emerald-700">5 Campuses Online</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500 font-mono">50.02 Hz</span>
          </div>

          <button
            onClick={() => onNavigate('billing')}
            className="px-3.5 py-1.5 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Review Invoices
          </button>
        </div>
      }
    >
      {/* ========================================================
          1. IMPACT & TIME-OF-DAY ADVISORY STRIP
          ======================================================== */}
      <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-3.5 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs" style={{ boxShadow: '0 1px 3px rgba(217,119,6,0.06)' }}>
        <div className="flex items-center gap-2.5 text-amber-950">
          <div className="w-7 h-7 rounded-md bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-800">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold">Time-of-Day Peak Tariff Active (14:00 – 17:30 IST):</span>{' '}
            <span className="text-amber-800">
              Commercial rate: ₹11.20/kWh. Automatic pre-cooling rule saved ₹33,600 today.
            </span>
          </div>
        </div>
        <button
          onClick={() => onNavigate('recommendations')}
          className="inline-flex items-center gap-1.5 font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 px-3.5 py-1.5 rounded-md transition-colors shrink-0 self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <span>Review Automation Rules</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ========================================================
          2. OVERVIEW: INTEGRATED METRIC BAR (IMPACT & STATS)
          ======================================================== */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-600 signal-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Portfolio Telemetry Summary
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Aggregated real-time readings from 48 localized submeters
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Metric 1 */}
          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Instantaneous Demand</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {totalCurrentKw.toFixed(1)}
              </span>
              <span className="text-xs font-bold text-slate-500">kW</span>
            </div>
            <div className="mt-1 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <span>✓ 37.2 kW buffer under contract cap</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Rooftop Solar Offset</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
                481.0
              </span>
              <span className="text-xs font-bold text-slate-500">kWp</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-600 font-medium flex items-center gap-1">
              <span>34.2% clean generation offset</span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Monthly Billed Units</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {(totalMonthlyKwh / 1000).toFixed(1)}
              </span>
              <span className="text-xs font-bold text-slate-500">MWh</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-600 font-medium flex items-center gap-1">
              <span>₹{(totalMonthlyCost / 100000).toFixed(1)}L estimated cost</span>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Grid Power Factor</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                0.985
              </span>
              <span className="text-xs font-bold text-emerald-600">Lagging</span>
            </div>
            <div className="mt-1 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <span>Zero low-PF penalty applied</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. TOOLS: INTERACTIVE ENERGY DISTRIBUTION FLOW
          ======================================================== */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Live Energy Conduits &amp; Submeter Routing
            </h2>
          </div>
          <span className="text-[11px] text-slate-500">
            Click on Solar or Campus nodes to drill down
          </span>
        </div>

        <EnergyFlowDiagram
          totalDemandKw={totalCurrentKw}
          gridDrawKw={1385.0}
          solarGenKw={481.0}
          sanctionedLimitKw={totalPeakThreshold}
          renewablePercent={34.2}
          onSelectNode={(nodeKey) => {
            if (nodeKey === 'solar') onNavigate('renewable');
            if (nodeKey === 'facilities') onNavigate('facilities');
          }}
        />
      </section>

      {/* ========================================================
          4. TOOLS: REAL-TIME POWER DEMAND VS BASELINE PROFILE
          ======================================================== */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
              <h3 className="text-base font-bold text-slate-900">
                Diurnal Power Demand vs. Model Baseline
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              15-minute interval telemetry curve contrasting active draw against historical baseline and peak tariffs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-slate-50">
              <button
                onClick={() => setConsumptionView('daily')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                  consumptionView === 'daily'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Today (24h)
              </button>
              <button
                onClick={() => setConsumptionView('weekly')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                  consumptionView === 'weekly'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                7-Day Trend
              </button>
            </div>

            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors px-2 py-1 cursor-pointer"
            >
              Full Analytics →
            </button>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={consumptionChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip content={<CustomConsumptionTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ fontSize: 11, paddingBottom: 8 }}
              />

              {consumptionView === 'daily' && (
                <ReferenceArea
                  x1="14:00"
                  x2="17:00"
                  fill="#fef3c7"
                  fillOpacity={0.4}
                  label={{
                    value: 'TOD Peak Window',
                    position: 'insideTopRight',
                    fill: '#b45309',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />
              )}

              <ReferenceLine
                y={consumptionView === 'daily' ? 450 : 2500}
                stroke="#e11d48"
                strokeDasharray="4 4"
                label={{
                  value: 'Sanctioned Cap',
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
                activeDot={{ r: 4, stroke: '#15803d', strokeWidth: 2, fill: '#ffffff' }}
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
                name="Solar PV (kW)"
                stroke="#eab308"
                strokeWidth={1.8}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ========================================================
          5. ACTIONS & FLEET MATRIX: MONITORED CAMPUSES TABLE
          ======================================================== */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
              <h3 className="text-base font-bold text-slate-900">
                Monitored Enterprise Campuses
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live telemetry health, instantaneous draw, and energy intensity across 5 active facility nodes.
            </p>
          </div>

          <button
            onClick={() => onNavigate('facilities')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View All Campuses</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="pb-2.5 font-bold uppercase text-[10px]">Campus Name</th>
                <th className="pb-2.5 font-bold uppercase text-[10px]">Location</th>
                <th className="pb-2.5 font-bold uppercase text-[10px]">Live Draw</th>
                <th className="pb-2.5 font-bold uppercase text-[10px]">Solar PV</th>
                <th className="pb-2.5 font-bold uppercase text-[10px]">Contract Cap</th>
                <th className="pb-2.5 font-bold uppercase text-[10px]">Intensity</th>
                <th className="pb-2.5 font-bold uppercase text-[10px] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {facilities.map((fac) => {
                const currentKw = fac.currentConsumptionKw ?? fac.current_consumption ?? 0;
                const peakCap = fac.peakThresholdKw ?? fac.peak_threshold_kw ?? 1;
                const solarKwp = fac.solarCapacityKwp ?? fac.solar_capacity_kwp ?? 0;
                const monthlyKwh = fac.monthlyConsumptionKwh ?? fac.monthly_consumption ?? 0;
                const floorArea = fac.floorAreaSqFt ?? fac.floor_area_sq_ft ?? 1;

                const percentOfCap = Math.round((currentKw / (peakCap || 1)) * 100);
                const isWarning = percentOfCap >= 90;
                return (
                  <tr key={fac.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-green-700 shrink-0" />
                        <span>{fac.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-500">{fac.location}</td>
                    <td className="py-3 font-semibold text-slate-900 tabular-nums">
                      {currentKw} kW
                    </td>
                    <td className="py-3 font-medium text-green-700 tabular-nums">
                      {solarKwp} kWp
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isWarning ? 'bg-amber-500' : 'bg-green-600'
                            }`}
                            style={{ width: `${Math.min(100, percentOfCap)}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-600 tabular-nums">
                          {percentOfCap}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-600 font-medium">
                      {(monthlyKwh / (floorArea || 1)).toFixed(2)} kWh/sqft
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => onSelectFacilityDetail(fac.id)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-green-50 text-slate-700 hover:text-emerald-700 font-semibold text-[11px] transition-colors cursor-pointer"
                      >
                        Drill Down →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================
          6. ACTIONS: HIGH-PRIORITY ENERGY RECOMMENDATIONS
          ======================================================== */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-green-700" />
              <h3 className="text-base font-bold text-slate-900">
                Automated BMS Energy Optimization Rules
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Algorithmically generated setpoint modifications targeting high-tariff windows.
            </p>
          </div>

          <button
            onClick={() => onNavigate('recommendations')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <span>All Recommendations ({recommendations.length})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.slice(0, 2).map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-lg border border-slate-200 bg-slate-50/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-green-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    {rec.category}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    Save ₹{rec.estimatedCostSavingInr.toLocaleString()}/mo
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{rec.title}</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{rec.reason}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">
                  {rec.facilityName}
                </span>
                <button
                  onClick={() => onApplyRecommendation(rec.id)}
                  disabled={rec.isApplied}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                    rec.isApplied
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-xs'
                  }`}
                >
                  {rec.isApplied ? 'Setpoint Active' : 'Deploy BMS Rule'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PlatformShell>
  );
};
