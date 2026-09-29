import React, { useState } from 'react';
import {
  SunMedium,
  Zap,
  Leaf,
  Activity,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Flame,
  TreePine,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { HOURLY_CONSUMPTION_DATA, SOLAR_DAILY_YIELD } from '../../data/mockData';

export const RenewableEnergyPage: React.FC = () => {
  const [selectedInverter, setSelectedInverter] = useState<number | null>(null);

  // Inverter fleet mock telemetry
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

  const facilitySolarBreakdown = [
    { name: 'Bangalore Tech Park', capacity: 160, todayKwh: 640, share: 36, offsetInr: 135000 },
    { name: 'Pune Manufacturing', capacity: 180, todayKwh: 710, share: 28, offsetInr: 154000 },
    { name: 'Gurugram Tower', capacity: 60, todayKwh: 220, share: 19, offsetInr: 48000 },
    { name: 'Chennai Logistics Hub', capacity: 120, todayKwh: 480, share: 45, offsetInr: 68000 },
    { name: 'Hyderabad R&D Hub', capacity: 90, todayKwh: 360, share: 32, offsetInr: 72000 },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* ========================================================
          1. EDITORIAL HEADER & METRICS
          ======================================================== */}
      <section className="pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e2e2d8]">
          <div className="space-y-2">
            <div className="text-[11px] font-mono tracking-[0.22em] text-[#059669] uppercase font-semibold">
              CLEAN TELEMETRY // 450 kWp PV ARRAY
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#101512] tracking-tight leading-[1.08] font-editorial">
              RENEWABLE ENERGY<br />
              <span className="text-[#059669]">GENERATION</span>
            </h1>
            <p className="text-sm sm:text-base text-[#525f56] font-sans max-w-xl">
              Real-time rooftop solar irradiance, 12 string inverters, diurnal offset profiles, and avoided greenhouse emissions.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f5f5ee] border border-[#dcdcd2] text-[#059669] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#059669] signal-pulse" />
              <span>11 / 12 STRINGS NOMINAL</span>
            </div>
          </div>
        </div>

        {/* Telemetry Strip */}
        <div className="mt-6 border border-[#dcdcd2] bg-[#f5f5ee] divide-y md:divide-y-0 md:divide-x divide-[#dcdcd2] grid grid-cols-2 md:grid-cols-4 font-mono">
          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">GENERATED CLEAN TODAY</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#059669] tabular-nums">
                1,840
              </span>
              <span className="text-xs text-[#6f7e75]">kWh</span>
            </div>
            <span className="text-[11px] text-[#059669] mt-1 block">Peak 215 kW at 12:45</span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">MONTHLY PV GENERATION</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#101512] tabular-nums">
                48.9
              </span>
              <span className="text-xs text-[#6f7e75]">MWh</span>
            </div>
            <span className="text-[11px] text-[#6f7e75] mt-1 block">97.8% of monthly target</span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">RENEWABLE MIX SHARE</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#059669] tabular-nums">
                34.2
              </span>
              <span className="text-xs text-[#6f7e75]">%</span>
            </div>
            <span className="text-[11px] text-[#059669] mt-1 block">+4.1% YoY expansion</span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">CO₂ EMISSIONS AVOIDED</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#101512] tabular-nums">
                41.2
              </span>
              <span className="text-xs text-[#6f7e75]">tCO₂e</span>
            </div>
            <span className="text-[11px] text-[#059669] mt-1 block">~1,840 mature trees</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. THE VISUAL STORY: 4-STAGE CLEAN ENERGY JOURNEY
          ======================================================== */}
      <section className="space-y-4">
        <div className="pb-2 border-b border-[#e2e2d8]">
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#6f7e75]">
            ENERGY LIFECYCLE STORY // CLEAN CONVERSION CHAIN
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#101512] tracking-tight font-editorial mt-0.5">
            FROM PHOTON TO PRODUCTION
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
          {/* Stage 1: Solar Generated */}
          <div className="p-5 bg-[#f5f5ee] border border-[#dcdcd2] relative">
            <div className="text-[10px] text-[#6f7e75] uppercase tracking-wider font-bold">
              01 // SOLAR GENERATED
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#059669] tabular-nums">48.9</span>
              <span className="text-xs text-[#6f7e75]">MWh</span>
            </div>
            <p className="mt-2 text-xs text-[#525f56] font-sans">
              Harvested across 450 kWp rooftop mono-PERC arrays under 890 W/m² peak sun irradiance.
            </p>
            <div className="mt-3 text-[10px] text-[#059669] font-bold flex items-center gap-1">
              <span>CONTINUOUS INVERTER HARVEST</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Stage 2: Facility Consumption */}
          <div className="p-5 bg-[#f5f5ee] border border-[#dcdcd2] relative">
            <div className="text-[10px] text-[#6f7e75] uppercase tracking-wider font-bold">
              02 // FACILITY LOAD
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#101512] tabular-nums">186.0</span>
              <span className="text-xs text-[#6f7e75]">MWh</span>
            </div>
            <p className="mt-2 text-xs text-[#525f56] font-sans">
              Gross operational power consumed by chiller loops, data servers, assembly lines, and factory bays.
            </p>
            <div className="mt-3 text-[10px] text-[#525f56] font-bold flex items-center gap-1">
              <span>DIRECT ON-SITE UTILIZATION</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Stage 3: Grid Offset */}
          <div className="p-5 bg-[#f5f5ee] border border-[#dcdcd2] relative">
            <div className="text-[10px] text-[#6f7e75] uppercase tracking-wider font-bold">
              03 // GRID OFFSET
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0284c7] tabular-nums">34.2%</span>
            </div>
            <p className="mt-2 text-xs text-[#525f56] font-sans">
              Displaced high-tariff 11kV thermal power from state utilities, saving ₹3.68 Lakh this month.
            </p>
            <div className="mt-3 text-[10px] text-[#0284c7] font-bold flex items-center gap-1">
              <span>ZERO THERMAL EMISSION</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Stage 4: CO2 Avoided */}
          <div className="p-5 bg-[#f5f5ee] border border-[#dcdcd2] relative">
            <div className="text-[10px] text-[#6f7e75] uppercase tracking-wider font-bold">
              04 // CO₂ AVOIDED
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#059669] tabular-nums">41.2</span>
              <span className="text-xs text-[#6f7e75]">tCO₂e</span>
            </div>
            <p className="mt-2 text-xs text-[#525f56] font-sans">
              Audited carbon offset registered for enterprise ESG compliance and BRSR statutory filing.
            </p>
            <div className="mt-3 text-[10px] text-[#059669] font-bold flex items-center gap-1">
              <span>CERTIFIED SCOPE-2 REDUCTION</span>
              <CheckCircle2 className="w-3 h-3" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. LARGE EDITORIAL SOLAR HARVEST CANVAS (SUNRISE -> PEAK -> SUNSET)
          ======================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 border-b border-[#e2e2d8] gap-3">
          <div>
            <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#6f7e75]">
              DIURNAL IRRADIANCE PROFILE // 24-HOUR SOLAR RHYTHM
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101512] tracking-tight font-editorial mt-0.5">
              TODAY'S SOLAR GENERATION ARC
            </h2>
            <p className="text-xs text-[#525f56] font-sans">
              Flowing solar curve plotted alongside gross building load demand to reveal the daytime grid displacement.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#6f7e75]">
            <span className="text-[#059669] font-bold">Peak Irradiance: 890 W/m² (12:45 IST)</span>
          </div>
        </div>

        <div className="bg-[#fbfbfa] border border-[#e2e2d8] p-5 sm:p-7 relative overflow-hidden">
          {/* Day Milestones Callout Bar */}
          <div className="grid grid-cols-3 gap-4 pb-4 mb-2 border-b border-[#ebebe2] text-xs font-mono">
            <div className="border-l-2 border-amber-500 pl-3">
              <span className="text-[10px] text-amber-600 uppercase font-bold block">05:48 IST</span>
              <span className="font-bold text-[#101512]">SUNRISE // INVERTER WAKE</span>
              <p className="text-[11px] text-[#6f7e75] font-sans mt-0.5">
                MPPT controllers initialize as solar irradiance crosses 50 W/m² threshold.
              </p>
            </div>

            <div className="border-l-2 border-[#059669] pl-3">
              <span className="text-[10px] text-[#059669] uppercase font-bold block">12:45 IST</span>
              <span className="font-bold text-[#101512]">SOLAR PEAK HARVEST</span>
              <p className="text-[11px] text-[#6f7e75] font-sans mt-0.5">
                Maximum clean power generation reaches 215 kW; 35.1% instantaneous facility offset.
              </p>
            </div>

            <div className="border-l-2 border-[#8e9e94] pl-3">
              <span className="text-[10px] text-[#6f7e75] uppercase font-bold block">18:32 IST</span>
              <span className="font-bold text-[#101512]">SUNSET // GRID TRANSITION</span>
              <p className="text-[11px] text-[#6f7e75] font-sans mt-0.5">
                Inverters sleep; secondary switchgear seamlessly transfers building baseload to grid.
              </p>
            </div>
          </div>

          <div className="w-full h-[320px] sm:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_CONSUMPTION_DATA} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="solarFlowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="demandLineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#101512" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#101512" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke="#e8e8df" vertical={false} />
                <XAxis dataKey="time" stroke="#8e9e94" fontSize={11} tickLine={false} fontFamily="var(--font-mono)" />
                <YAxis stroke="#8e9e94" fontSize={11} tickLine={false} fontFamily="var(--font-mono)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#101512',
                    borderColor: '#2a3830',
                    color: '#fbfbfa',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="plainline"
                  wrapperStyle={{ fontSize: '11px', paddingBottom: '12px', fontFamily: 'var(--font-mono)' }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Gross Facility Load (kW)"
                  stroke="#8e9e94"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fill="url(#demandLineGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="solar"
                  name="Solar PV Harvest (kW)"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fill="url(#solarFlowGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-[#ebebe2] flex flex-wrap items-center justify-between text-xs font-mono text-[#6f7e75] gap-2">
            <span>Production Window: 06:00 – 18:00 IST</span>
            <span className="text-[#059669] font-bold">1,840 kWh Total Clean Yield Today</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. INVERTER FLEET MATRIX (12 STRINGS) & 28-DAY HARVEST
          ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left (7 cols): Inverter String Fleet Matrix */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e2e2d8]">
            <h3 className="text-xl font-bold text-[#101512] font-editorial uppercase tracking-tight">
              INVERTER STRING FLEET (12 STRINGS)
            </h3>
            <span className="text-xs font-mono text-[#6f7e75]">415V SECONDARY BUS</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
            {inverters.map((inv) => {
              const isWarning = inv.status === 'Warning';

              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInverter(inv.id)}
                  className={`p-3.5 border transition-all cursor-pointer ${
                    isWarning
                      ? 'bg-[#fef7ee] border-amber-500'
                      : 'bg-[#f5f5ee] border-[#dcdcd2] hover:border-[#059669]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#101512]">{inv.name}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isWarning ? 'bg-amber-500' : 'bg-[#059669]'
                      }`}
                    />
                  </div>
                  <div className="text-[10px] text-[#6f7e75] truncate mt-0.5">{inv.location}</div>
                  <div className="mt-2.5 flex items-baseline justify-between">
                    <span className="text-lg font-extrabold text-[#101512] tabular-nums">
                      {inv.yieldKw} <span className="text-xs font-normal text-[#6f7e75]">kW</span>
                    </span>
                    <span className={`text-xs font-bold ${isWarning ? 'text-amber-600' : 'text-[#059669]'}`}>
                      {inv.eff}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-xs font-mono text-[#6f7e75] flex items-center justify-between pt-1">
            <span>INV-BLR-04: Dust soiling / cleaning scheduled tonight</span>
            <span className="text-[#059669] font-bold">Total AC Output: 481.0 kW</span>
          </div>
        </div>

        {/* Right (5 cols): 28-Day Solar Harvest Yield */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e2e2d8]">
            <h3 className="text-xl font-bold text-[#101512] font-editorial uppercase tracking-tight">
              28-DAY HARVEST YIELD
            </h3>
            <span className="text-xs font-mono text-[#6f7e75]">DAILY KWH</span>
          </div>

          <div className="bg-[#fbfbfa] border border-[#e2e2d8] p-5">
            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SOLAR_DAILY_YIELD} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#e8e8df" vertical={false} />
                  <XAxis dataKey="day" stroke="#8e9e94" fontSize={10} tickLine={false} fontFamily="var(--font-mono)" />
                  <YAxis stroke="#8e9e94" fontSize={10} tickLine={false} fontFamily="var(--font-mono)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#101512',
                      borderColor: '#2a3830',
                      color: '#fbfbfa',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                  <Bar dataKey="yieldKwh" name="Yield (kWh)" fill="#059669" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 pt-2 border-t border-[#ebebe2] flex items-center justify-between text-xs font-mono text-[#6f7e75]">
              <span>Avg Daily: 1,747 kWh</span>
              <span className="text-[#059669] font-bold">Fleet Peak: 1,890 kWh</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. ROOFTOP SOLAR ALLOCATION COMMAND TABLE
          ======================================================== */}
      <section className="space-y-4">
        <div className="pb-2 border-b border-[#e2e2d8]">
          <h3 className="text-xl font-bold text-[#101512] font-editorial uppercase tracking-tight">
            CAMPUS ROOFTOP PV ALLOCATION
          </h3>
        </div>

        <div className="border border-[#e2e2d8] divide-y divide-[#e2e2d8] bg-[#fbfbfa] font-mono text-xs">
          <div className="p-4 bg-[#f5f5ee] font-bold text-[#6f7e75] uppercase text-[10px] grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div>CAMPUS SITE</div>
            <div className="text-right">PV CAPACITY</div>
            <div className="text-right">TODAY HARVEST</div>
            <div className="text-right">CLEAN MIX</div>
            <div className="text-right">MONTHLY SAVING</div>
          </div>

          {facilitySolarBreakdown.map((row, idx) => (
            <div key={idx} className="p-4 hover:bg-[#f5f5ee] transition-colors grid grid-cols-2 sm:grid-cols-5 gap-4 items-center">
              <div className="font-bold text-[#101512] font-sans text-sm">{row.name}</div>
              <div className="text-right text-[#059669] font-bold tabular-nums">{row.capacity} kWp</div>
              <div className="text-right text-[#525f56] tabular-nums">{row.todayKwh} kWh</div>
              <div className="text-right text-[#059669] font-bold tabular-nums">{row.share}%</div>
              <div className="text-right text-[#101512] font-extrabold tabular-nums">₹{(row.offsetInr / 1000).toFixed(0)}k/mo</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
