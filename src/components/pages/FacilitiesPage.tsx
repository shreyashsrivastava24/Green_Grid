import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  ChevronRight,
  ShieldAlert,
  SunMedium,
  Zap,
  IndianRupee,
  Activity,
  ArrowRight,
  Radio,
  SlidersHorizontal,
  Compass,
} from 'lucide-react';
import { Facility, FacilityStatus } from '../../types';
import { AddFacilityModal } from '../modals/AddFacilityModal';

interface FacilitiesPageProps {
  facilities: Facility[];
  onSelectFacilityDetail: (facilityId: string) => void;
  onAddFacility: (facility: Facility) => void;
}

export const FacilitiesPage: React.FC<FacilitiesPageProps> = ({
  facilities,
  onSelectFacilityDetail,
  onAddFacility,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | FacilityStatus>('All');
  const [activeGeoNode, setActiveGeoNode] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter facilities
  const filteredFacilities = facilities.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.location.toLowerCase().includes(search.toLowerCase()) ||
      f.type.toLowerCase().includes(search.toLowerCase()) ||
      f.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalKw = facilities.reduce((sum, f) => sum + f.currentConsumptionKw, 0);
  const totalCap = facilities.reduce((sum, f) => sum + f.peakThresholdKw, 0);
  const totalSolar = facilities.reduce((sum, f) => sum + f.solarCapacityKwp, 0);

  // Geographic coordinates approximation for Indian nodes in a 600x400 SVG box
  const geoNodes: Record<string, { x: number; y: number; label: string; code: string }> = {
    'fac-gurugram': { x: 260, y: 110, label: 'Gurugram Tower', code: 'NCR' },
    'fac-pune': { x: 210, y: 240, label: 'Pune Plant', code: 'MH' },
    'fac-hyderabad': { x: 280, y: 250, label: 'Hyderabad R&D', code: 'TS' },
    'fac-bangalore': { x: 270, y: 310, label: 'Bangalore Campus', code: 'KA' },
    'fac-chennai': { x: 310, y: 320, label: 'Chennai Hub', code: 'TN' },
  };

  return (
    <div className="space-y-10 pb-16">
      {/* ========================================================
          1. EDITORIAL HEADER & FLEET METRICS
          ======================================================== */}
      <section className="pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e2e2d8]">
          <div className="space-y-2">
            <div className="text-[11px] font-mono tracking-[0.22em] text-[#059669] uppercase font-semibold">
              FLEET TELEMETRY // 5 INDUSTRIAL HUBS
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#101512] tracking-tight leading-[1.08] font-editorial">
              FACILITY COMMAND<br />
              <span className="text-[#059669]">NETWORK</span>
            </h1>
            <p className="text-sm sm:text-base text-[#525f56] font-sans max-w-xl">
              Monitored industrial campuses, data hubs, and manufacturing plants with real-time submeter ingestion and peak demand control.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-mono font-bold tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ENROLL NEW FACILITY</span>
            </button>
          </div>
        </div>

        {/* Fleet Horizontal Telemetry Strip */}
        <div className="mt-6 border border-[#dcdcd2] bg-[#f5f5ee] divide-y md:divide-y-0 md:divide-x divide-[#dcdcd2] grid grid-cols-2 md:grid-cols-4 font-mono">
          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">AGGREGATE DEMAND</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#101512] tabular-nums">
                {totalKw.toFixed(1)}
              </span>
              <span className="text-xs text-[#6f7e75]">kW</span>
            </div>
            <span className="text-[11px] text-[#059669] mt-1 block">5 Feeders active</span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">PORTFOLIO CEILING</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#525f56] tabular-nums">
                {totalCap}
              </span>
              <span className="text-xs text-[#6f7e75]">kW</span>
            </div>
            <span className="text-[11px] text-[#6f7e75] mt-1 block">
              {((totalKw / totalCap) * 100).toFixed(1)}% fleet capacity
            </span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">ROOFTOP SOLAR PV</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#059669] tabular-nums">
                {totalSolar}
              </span>
              <span className="text-xs text-[#6f7e75]">kWp</span>
            </div>
            <span className="text-[11px] text-[#059669] mt-1 block">34.2% clean mix</span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">ACTIVE ANOMALIES</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 tabular-nums">
                01
              </span>
              <span className="text-xs text-rose-600 font-bold">OVERLOAD</span>
            </div>
            <span className="text-[11px] text-[#6f7e75] mt-1 block">Gurugram at 107% cap</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. GEOGRAPHIC CONTEXT // NATIONAL ENERGY DISPATCH MAP
          ======================================================== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#e2e2d8]">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.16em] uppercase text-[#6f7e75]">
            <Compass className="w-3.5 h-3.5 text-[#059669]" />
            <span>GEOGRAPHIC INTERCONNECT // NATIONAL GRID TOPOLOGY</span>
          </div>
          <span className="text-[11px] font-mono text-[#525f56]">
            Click node to isolate facility telemetry
          </span>
        </div>

        {/* Architectural Light Canvas Map */}
        <div className="bg-[#ffffff] border border-[#e2e4dc] p-6 lg:p-8 text-[#101512] shadow-xs relative overflow-hidden font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2e4dc]">
            <div>
              <span className="text-[10px] text-[#64748b] uppercase tracking-widest block font-bold">
                GRID INTERCONNECT SCHEMATIC · 5 HUBS
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#101512] tracking-wide mt-0.5">
                INTER-CAMPUS POWER TRANSMISSION &amp; SOLAR HARVESTING
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-[#059669] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#059669] signal-pulse" />
                <span>GRID SYNCHRONIZED</span>
              </span>
              <span className="text-[#64748b]">50.02 Hz NOMINAL</span>
            </div>
          </div>

          <div className="relative w-full h-[280px] sm:h-[340px] my-4">
            <svg viewBox="0 0 600 380" className="w-full h-full select-none">
              {/* Subtle geographic grid lines */}
              <defs>
                <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="600" height="380" fill="url(#mapGrid)" />

              {/* Inter-facility transmission trunk lines */}
              {/* Gurugram to Pune */}
              <line x1="260" y1="110" x2="210" y2="240" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
              {/* Pune to Hyderabad */}
              <line x1="210" y1="240" x2="280" y2="250" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
              {/* Hyderabad to Bangalore */}
              <line x1="280" y1="250" x2="270" y2="310" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
              {/* Bangalore to Chennai */}
              <line x1="270" y1="310" x2="310" y2="320" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* Live Flow Pulses along lines */}
              <line
                x1="260"
                y1="110"
                x2="210"
                y2="240"
                stroke="#059669"
                strokeWidth="1.5"
                strokeDasharray="8 16"
                className="animate-flow-dash"
              />
              <line
                x1="280"
                y1="250"
                x2="270"
                y2="310"
                stroke="#059669"
                strokeWidth="1.5"
                strokeDasharray="8 16"
                className="animate-flow-dash"
              />

              {/* Facility Nodes */}
              {facilities.map((fac) => {
                const node = geoNodes[fac.id];
                if (!node) return null;
                const isSelected = activeGeoNode === fac.id;
                const isOverload = fac.status === 'Critical';
                const isWarning = fac.status === 'High Usage';
                const dotColor = isOverload ? '#e11d48' : isWarning ? '#d97706' : '#059669';

                return (
                  <g
                    key={fac.id}
                    onClick={() => {
                      setActiveGeoNode(isSelected ? null : fac.id);
                      onSelectFacilityDetail(fac.id);
                    }}
                    className="cursor-pointer group"
                  >
                    {/* Ring highlight on active */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? 18 : 12}
                      fill={isSelected ? '#f0fdf4' : '#ffffff'}
                      stroke={dotColor}
                      strokeWidth={isSelected ? '2' : '1'}
                      strokeOpacity={isSelected ? 0.9 : 0.4}
                      className={isOverload ? 'signal-pulse' : ''}
                    />

                    {/* Center node */}
                    <circle cx={node.x} cy={node.y} r="5" fill={dotColor} />

                    {/* Text Label */}
                    <text
                      x={node.x + 14}
                      y={node.y - 4}
                      fill="#101512"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="var(--font-mono)"
                    >
                      {node.code} · {fac.name.split(' ')[0]}
                    </text>
                    <text
                      x={node.x + 14}
                      y={node.y + 10}
                      fill="#64748b"
                      fontSize="10"
                      fontFamily="var(--font-mono)"
                    >
                      {fac.currentConsumptionKw.toFixed(1)} kW · {fac.solarCapacityKwp} kWp PV
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="pt-3 border-t border-[#e2e4dc] flex flex-wrap items-center justify-between text-xs text-[#525f56]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#059669]" />
                <span>Normal Operation</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Elevated Demand (&gt;80%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600 signal-pulse" />
                <span>Contract Overload (&gt;100%)</span>
              </span>
            </div>
            <div>
              <span>Synchronous Area: National Southern-Northern Transmission Corridors</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. CONTROLS: SEARCH & STATUS FILTER
          ======================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e2e2d8]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#6f7e75]">
              FILTER HUBS:
            </span>
            <div className="flex items-center gap-1 bg-[#ebebe2] p-0.5 font-mono text-xs border border-[#d6d6cb]">
              {(['All', 'Normal', 'High Usage', 'Critical'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 cursor-pointer transition-colors ${
                    statusFilter === st
                      ? 'bg-[#101512] text-[#fbfbfa] font-bold'
                      : 'text-[#525f56] hover:text-[#101512]'
                  }`}
                >
                  {st.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full max-w-xs font-mono text-xs">
            <Search className="w-3.5 h-3.5 text-[#6f7e75] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search site, city, code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#fbfbfa] border border-[#dcdcd2] pl-8 pr-3 py-1.5 text-[#101512] placeholder:text-[#8e9e94] focus:outline-hidden focus:border-[#059669]"
            />
          </div>
        </div>

        {/* ========================================================
            4. THE FACILITY COMMAND BOARD (Strict Human-Designed Alignment)
            ======================================================== */}
        <div className="border border-[#e2e2d8] divide-y divide-[#e2e2d8] bg-[#fbfbfa]">
          {filteredFacilities.map((fac, idx) => {
            const usagePercent = Math.round((fac.currentConsumptionKw / fac.peakThresholdKw) * 100);
            const isOverload = usagePercent > 100;
            const isWarning = usagePercent > 80 && !isOverload;

            return (
              <div
                key={fac.id}
                onClick={() => onSelectFacilityDetail(fac.id)}
                className="p-5 sm:p-6 hover:bg-[#f5f5ee] transition-all cursor-pointer group font-mono"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left: Index + Physical Location Identity */}
                  <div className="flex items-start gap-4 min-w-[320px]">
                    <span className="text-2xl font-extrabold text-[#8e9e94] group-hover:text-[#059669] transition-colors tabular-nums">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-[#101512] font-sans group-hover:text-[#059669] transition-colors">
                          {fac.name}
                        </h3>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#6f7e75] bg-[#ebebe2] px-1.5 py-0.2">
                          {fac.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#6f7e75] mt-1">
                        <MapPin className="w-3 h-3 text-[#8e9e94]" />
                        <span>{fac.location}</span>
                        <span>·</span>
                        <span className="text-[#8e9e94]">{fac.floorAreaSqFt.toLocaleString()} sq ft</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Large Telemetry Instrumentation Data */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8 flex-1">
                    <div>
                      <span className="text-[10px] text-[#6f7e75] uppercase block">LIVE DEMAND</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className={`text-2xl font-extrabold tabular-nums ${isOverload ? 'text-rose-600' : 'text-[#101512]'}`}>
                          {fac.currentConsumptionKw.toFixed(1)}
                        </span>
                        <span className="text-xs text-[#6f7e75]">kW</span>
                      </div>
                      <span className="text-[11px] text-[#6f7e75]">Instant draw</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#6f7e75] uppercase block">CONTRACT LIMIT</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-2xl font-extrabold text-[#525f56] tabular-nums">
                          {fac.peakThresholdKw}
                        </span>
                        <span className="text-xs text-[#6f7e75]">kW</span>
                      </div>
                      <span className="text-[11px] text-[#6f7e75]">Sanctioned cap</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#6f7e75] uppercase block">ROOFTOP SOLAR</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-2xl font-extrabold text-[#059669] tabular-nums">
                          {fac.solarCapacityKwp}
                        </span>
                        <span className="text-xs text-[#6f7e75]">kWp</span>
                      </div>
                      <span className="text-[11px] text-[#059669] font-medium">{fac.renewableSharePercent}% clean mix</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#6f7e75] uppercase block">ESTIMATED BILL</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-2xl font-extrabold text-[#101512] tabular-nums">
                          ₹{(fac.estimatedCostInr / 1000).toFixed(0)}k
                        </span>
                      </div>
                      <span className="text-[11px] text-[#059669]">-₹{(fac.monthlySavingsInr / 1000).toFixed(0)}k saved</span>
                    </div>
                  </div>

                  {/* Right: Load Progress + State Indicator + Enter Button */}
                  <div className="flex items-center gap-6 lg:min-w-[280px]">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[#6f7e75]">Utilization</span>
                        <span
                          className={`font-bold tabular-nums ${
                            isOverload ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-[#059669]'
                          }`}
                        >
                          {usagePercent}%
                        </span>
                      </div>
                      <div className="w-full bg-[#e2e2d8] h-1.5 overflow-hidden">
                        <div
                          className={`h-full ${
                            isOverload ? 'bg-rose-600' : isWarning ? 'bg-amber-600' : 'bg-[#059669]'
                          }`}
                          style={{ width: `${Math.min(usagePercent, 100)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-[#8e9e94] mt-1">
                        {fac.peakThresholdKw - fac.currentConsumptionKw > 0
                          ? `${(fac.peakThresholdKw - fac.currentConsumptionKw).toFixed(0)} kW headroom`
                          : `+${(fac.currentConsumptionKw - fac.peakThresholdKw).toFixed(0)} kW OVERLOAD`}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1.5">
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
                      </div>

                      <div className="p-2 bg-[#101512] group-hover:bg-[#059669] text-[#fbfbfa] transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Add Facility Modal */}
      <AddFacilityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddFacility={onAddFacility}
      />
    </div>
  );
};
