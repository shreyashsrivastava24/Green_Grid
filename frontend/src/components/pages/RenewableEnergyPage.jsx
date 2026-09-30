import React, { useState } from 'react';
import {
  SunMedium,
  Leaf,
  Flame,
  TreePine,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { HOURLY_CONSUMPTION_DATA } from '../../data/mockData';
import { PlatformShell } from '../common/PlatformShell';

export const RenewableEnergyPage = ({
  onNavigate = () => {},
}) => {
  const [selectedInverter, setSelectedInverter] = useState(null);

  // Inverter fleet telemetry
  const inverters = [
    { id: 1, name: 'INV-BLR-01', location: 'Bangalore Block A', kwp: 40, yieldKw: 38.2, eff: 95.4, status: 'Nominal' },
    { id: 2, name: 'INV-BLR-02', location: 'Bangalore Block B', kwp: 40, yieldKw: 39.1, eff: 96.1, status: 'Nominal' },
    { id: 3, name: 'INV-BLR-03', location: 'Bangalore Block C', kwp: 40, yieldKw: 37.8, eff: 94.8, status: 'Nominal' },
    { id: 4, name: 'INV-BLR-04', location: 'Bangalore Rooftop 4', kwp: 40, yieldKw: 18.4, eff: 68.2, status: 'Warning' },
    { id: 5, name: 'INV-PNE-01', location: 'Pune Plant Shed 1', kwp: 60, yieldKw: 58.4, eff: 95.8, status: 'Nominal' },
    { id: 6, name: 'INV-PNE-02', location: 'Pune Plant Shed 2', kwp: 60, yieldKw: 57.9, eff: 95.2, status: 'Nominal' },
    { id: 7, name: 'INV-PNE-03', location: 'Pune Warehouse', kwp: 60, yieldKw: 59.1, eff: 96.0, status: 'Nominal' },
    { id: 8, name: 'INV-GGN-01', location: 'Gurugram Tower Canopy', kwp: 60, yieldKw: 56.2, eff: 93.6, status: 'Nominal' },
    { id: 9, name: 'INV-CHN-01', location: 'Chennai Cold Hub West', kwp: 60, yieldKw: 58.9, eff: 96.4, status: 'Nominal' },
    { id: 10, name: 'INV-CHN-02', location: 'Chennai Cold Hub East', kwp: 60, yieldKw: 57.4, eff: 95.0, status: 'Nominal' },
    { id: 11, name: 'INV-HYD-01', location: 'Hyderabad Innovation R1', kwp: 45, yieldKw: 43.8, eff: 95.8, status: 'Nominal' },
    { id: 12, name: 'INV-HYD-02', location: 'Hyderabad Innovation R2', kwp: 45, yieldKw: 44.1, eff: 96.2, status: 'Nominal' },
  ];

  return (
    <PlatformShell
      pageTitle="Rooftop Solar PV & Microgrid Orchestration"
      pageCategory="Renewables & Clean Energy"
      pageDescription="Real-time performance ratio (PR), string inverter diagnostics, and net-metering dispatch across 1,480 kWp distributed solar arrays."
      onNavigate={onNavigate}
      actions={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-xs font-semibold text-emerald-800 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 signal-pulse" />
            <SunMedium className="w-3.5 h-3.5 text-emerald-600" />
            <span>12 Inverters Online · 890 W/m² Irradiance</span>
          </div>
        </div>
      }
    >
      {/* 1. Solar Array Panorama & Live Yield Strip */}
      <section
        className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Photo Preview Thumbnail */}
          <div className="lg:col-span-4 relative min-h-[170px] overflow-hidden bg-slate-100 group">
            <img
              src="/images/greengrid_hero_solar.jpg"
              alt="Monitored Commercial Rooftop Solar Array"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
            <div className="absolute bottom-3.5 left-4 right-4 text-white text-xs">
              <span className="font-bold text-sm tracking-tight text-white block">Monitored Photovoltaic Array</span>
              <p className="text-[11px] text-emerald-300 font-medium mt-0.5">Tier-1 Monocrystalline PERC modules · 12 Combiners</p>
            </div>
          </div>

          {/* Core Telemetry Metrics */}
          <div className="lg:col-span-8 p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <div className="pt-2 sm:pt-0 sm:px-4">
              <div className="text-xs text-slate-500 font-medium">Installed Array</div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">1,480</span>
                <span className="text-xs font-bold text-slate-400">kWp</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                12 String Combiners
              </span>
            </div>

            <div className="pt-2 sm:pt-0 sm:px-4">
              <div className="text-xs text-slate-500 font-medium">Current Generation</div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">481.0</span>
                <span className="text-xs font-bold text-slate-400">kW</span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">
                34.2% campus load offset
              </span>
            </div>

            <div className="pt-2 sm:pt-0 sm:px-4">
              <div className="text-xs text-slate-500 font-medium">Today's Generation</div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">2,380</span>
                <span className="text-xs font-bold text-slate-400">kWh</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                ₹19,040 net savings
              </span>
            </div>

            <div className="pt-2 sm:pt-0 sm:px-4">
              <div className="text-xs text-slate-500 font-medium">Fleet PR Ratio</div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">81.4%</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                ✓ Optimal Performance
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Diurnal Solar Output vs Grid Consumption Curve */}
      <section
        className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Diurnal Solar Generation vs. Grid Intake (24 Hours)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Notice how peak solar generation (10:00 - 14:00) eliminates commercial grid demand during high-cost intervals.
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200/80">
            Net Metering Active
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={HOURLY_CONSUMPTION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-xl text-xs space-y-1.5 min-w-[170px]">
                        <div className="font-semibold text-slate-500 pb-1 border-b border-slate-100 flex justify-between">
                          <span>Time: {label}</span>
                        </div>
                        {payload.map((item, i) => (
                          <div key={i} className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-slate-600">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                              {item.name}
                            </span>
                            <span className="font-bold text-slate-900 font-mono">{item.value} kW</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 11, paddingBottom: 8 }} />
              <Area type="monotone" dataKey="solar" name="Rooftop Solar PV (kW)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#solarGradient)" />
              <Area type="monotone" dataKey="grid" name="Utility Grid Draw (kW)" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#gridGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 3. 12 String Inverter Fleet Diagnostics Grid */}
      <section
        className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              12 String Inverter Telemetry Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live Modbus RTU telemetry monitoring DC voltage, AC active power, and conversion efficiency.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-lg self-start sm:self-auto">
            Click inverter card to inspect registers
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {inverters.map((inv) => {
            const isWarning = inv.status === 'Warning';
            const isSelected = selectedInverter === inv.id;

            return (
              <div
                key={inv.id}
                onClick={() => setSelectedInverter(isSelected ? null : inv.id)}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/50 shadow-sm'
                    : isWarning
                    ? 'border-amber-300 bg-amber-50/40 hover:shadow-md hover:-translate-y-0.5'
                    : 'border-slate-200/80 bg-white hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 font-mono">{inv.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isWarning
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100/80 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 truncate">{inv.location}</div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Yield</span>
                    <span className="font-bold text-slate-900 font-mono">{inv.yieldKw} kW</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Efficiency</span>
                    <span
                      className={`font-bold font-mono ${
                        isWarning ? 'text-amber-700' : 'text-emerald-600'
                      }`}
                    >
                      {inv.eff}%
                    </span>
                  </div>
                </div>

                {isWarning && (
                  <div className="mt-2.5 text-[10px] text-amber-800 font-semibold bg-amber-100/70 p-1.5 rounded-lg">
                    ⚠️ Potential DC string soiling
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Verified Ecological Impact Ledger */}
      <section
        className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
      >
        <h3 className="text-base font-bold text-slate-900 pb-3 mb-4 border-b border-slate-100 tracking-tight">
          Verified Ecological &amp; ESG Carbon Abatement
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 to-emerald-100/30 flex items-start gap-3.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-950 tracking-tight">1,240 T</div>
              <div className="text-xs font-bold text-emerald-700 mt-0.5">CO₂e Emissions Avoided</div>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                Calculated using CEA Indian national grid carbon emission factor (0.82 kg CO₂/kWh).
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-slate-100/60 flex items-start gap-3.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">496 MT</div>
              <div className="text-xs font-bold text-slate-700 mt-0.5">Coal Combustion Displaced</div>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                Equivalent thermal coal burn avoided at regional state utility power generation stations.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-teal-50/70 to-teal-100/30 flex items-start gap-3.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <TreePine className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-teal-950 tracking-tight">56,800</div>
              <div className="text-xs font-bold text-teal-700 mt-0.5">Forest Sequestration Equivalent</div>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                Environmental offset equivalent based on 10-year mature tree urban forestry standards.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PlatformShell>
  );
};
