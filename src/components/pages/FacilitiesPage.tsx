import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  ChevronRight,
  SunMedium,
  Zap,
  Activity,
  Compass,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Facility, FacilityStatus, PageId } from '../../types';
import { AddFacilityModal } from '../modals/AddFacilityModal';
import { PlatformShell } from '../common/PlatformShell';

interface FacilitiesPageProps {
  facilities: Facility[];
  onSelectFacilityDetail: (facilityId: string) => void;
  onAddFacility: (facility: Facility) => void;
  onNavigate?: (page: PageId) => void;
}

export const FacilitiesPage: React.FC<FacilitiesPageProps> = ({
  facilities,
  onSelectFacilityDetail,
  onAddFacility,
  onNavigate = () => {},
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | FacilityStatus>('All');
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
  const totalArea = facilities.reduce((sum, f) => sum + f.floorAreaSqFt, 0);

  return (
    <PlatformShell
      pageTitle="Enrolled Campuses & Facility Telemetry"
      pageCategory="Portfolio Fleet"
      pageDescription="Continuous supervisory metering across corporate campuses, manufacturing plants, and R&D tech hubs."
      onNavigate={onNavigate}
      actions={
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-green-700 hover:bg-green-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll New Facility</span>
        </button>
      }
    >
      {/* ========================================================
          1. OVERVIEW: PORTFOLIO FLEET SUMMARY STRIP
          ======================================================== */}
      <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Enrolled Floor Area</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {(totalArea / 1000).toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-500">k sq ft</span>
            </div>
            <div className="mt-1 text-[11px] text-green-700 font-semibold">
              5 Major Enterprise Sites
            </div>
          </div>

          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Instant Fleet Demand</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {totalKw.toFixed(1)}
              </span>
              <span className="text-xs font-bold text-slate-500">kW</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-600 font-medium">
              Of {totalCap} kW aggregate limit
            </div>
          </div>

          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Rooftop Solar Installed</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-green-700 tracking-tight">
                {totalSolar}
              </span>
              <span className="text-xs font-bold text-slate-500">kWp</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-600 font-medium">
              34.2% clean generation offset
            </div>
          </div>

          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Energy Intensity</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                0.99
              </span>
              <span className="text-xs font-bold text-slate-500">kWh/sq ft</span>
            </div>
            <div className="mt-1 text-[11px] text-green-700 font-semibold">
              ✓ Complies with BEE 5-star baseline
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. FILTER & SEARCH TOOLBAR
          ======================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by campus name, location, or facility ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200 rounded-md focus:border-green-600 focus:outline-hidden transition-colors"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-white shadow-xs">
          {(['All', 'Normal', 'High Usage', 'Critical'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition-colors ${
                statusFilter === status
                  ? 'bg-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
          3. CAMPUS FLEET CARDS GRID
          ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFacilities.map((fac) => {
          const percentOfCap = Math.round((fac.currentConsumptionKw / fac.peakThresholdKw) * 100);
          const isWarning = percentOfCap >= 90;

          return (
            <div
              key={fac.id}
              className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs hover:border-green-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Badges & ID */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-600 signal-pulse" />
                    <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase">
                      {fac.id}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      fac.status === 'Normal'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {fac.status}
                  </span>
                </div>

                {/* Campus Header */}
                <div className="mt-3">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {fac.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{fac.location}</span>
                    <span className="text-slate-300">·</span>
                    <span>{fac.type}</span>
                  </div>
                </div>

                {/* Telemetry Numbers */}
                <div className="grid grid-cols-2 gap-3 mt-4 p-3 bg-[#fbfbfa] rounded-md border border-slate-100 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium">Real-Time Draw</span>
                    <div className="text-base font-bold text-slate-900 mt-0.5 tabular-nums">
                      {fac.currentConsumptionKw} kW
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium">Solar Array</span>
                    <div className="text-base font-bold text-green-700 mt-0.5 tabular-nums">
                      {fac.solarCapacityKwp} kWp
                    </div>
                  </div>
                </div>

                {/* Sanctioned Demand Cap Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Demand vs. Cap ({fac.peakThresholdKw} kW)</span>
                    <span
                      className={`font-bold tabular-nums ${
                        isWarning ? 'text-amber-700' : 'text-slate-800'
                      }`}
                    >
                      {percentOfCap}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isWarning ? 'bg-amber-500' : 'bg-green-600'
                      }`}
                      style={{ width: `${Math.min(100, percentOfCap)}%` }}
                    />
                  </div>
                </div>

                {/* Floor Area & Monthly Savings */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{(fac.floorAreaSqFt / 1000).toLocaleString()}k sq ft</span>
                  <span className="font-semibold text-green-700">
                    Save ₹{fac.monthlySavingsInr.toLocaleString()}/mo
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectFacilityDetail(fac.id)}
                className="mt-5 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-md bg-slate-50 hover:bg-green-50 text-slate-800 hover:text-green-800 font-semibold text-xs border border-slate-200 hover:border-green-300 transition-colors cursor-pointer"
              >
                <span>Inspect Submeter Loops &amp; Load</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Facility Modal */}
      <AddFacilityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddFacility={onAddFacility}
      />
    </PlatformShell>
  );
};
