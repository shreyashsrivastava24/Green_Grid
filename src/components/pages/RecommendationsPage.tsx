import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  IndianRupee,
  Clock,
  ArrowRight,
  TrendingDown,
  Info,
  Check,
  Search,
  Activity,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Recommendation, RecommendationPriority } from '../../types';
import { RecommendationDetailModal } from '../modals/RecommendationDetailModal';

interface RecommendationsPageProps {
  recommendations: Recommendation[];
  onApplyRecommendation: (id: string) => void;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({
  recommendations,
  onApplyRecommendation,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | RecommendationPriority>('All');
  const [search, setSearch] = useState('');
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);
  const [expandedWhyId, setExpandedWhyId] = useState<string | null>(null);

  // Computations
  const totalCostSavings = recommendations.reduce((sum, r) => sum + r.estimatedCostSavingInr, 0);
  const totalKwhSavings = recommendations.reduce((sum, r) => sum + r.estimatedEnergySavingKwh, 0);
  const appliedCount = recommendations.filter((r) => r.isApplied).length;

  const categories = ['All', 'HVAC Optimization', 'Peak Shaving', 'Lighting', 'Solar & Battery'];

  const filtered = recommendations.filter((rec) => {
    const matchesCat = categoryFilter === 'All' || rec.category === categoryFilter;
    const matchesPri = priorityFilter === 'All' || rec.priority === priorityFilter;
    const matchesSearch =
      rec.title.toLowerCase().includes(search.toLowerCase()) ||
      rec.facilityName.toLowerCase().includes(search.toLowerCase()) ||
      rec.reason.toLowerCase().includes(search.toLowerCase()) ||
      rec.category.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesPri && matchesSearch;
  });

  return (
    <div className="space-y-10 pb-16">
      {/* ========================================================
          1. EDITORIAL HEADER & SAVINGS ESTIMATES
          ======================================================== */}
      <section className="pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e2e2d8]">
          <div className="space-y-2">
            <div className="text-[11px] font-mono tracking-[0.22em] text-[#059669] uppercase font-semibold">
              ENERGY INTELLIGENCE ANALYST // SETPOINT DISPATCH
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#101512] tracking-tight leading-[1.08] font-editorial">
              ENERGY OPPORTUNITIES &amp;<br />
              <span className="text-[#059669]">OPTIMIZATION DISPATCHES</span>
            </h1>
            <p className="text-sm sm:text-base text-[#525f56] font-sans max-w-xl">
              Thermodynamic building models identifying load-shifting opportunities, chiller staging efficiencies, and tariff surcharge avoidance.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f5f5ee] border border-[#dcdcd2] text-[#059669] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#059669] signal-pulse" />
              <span>{appliedCount} / {recommendations.length} SETPOINTS ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Savings Telemetry Rail */}
        <div className="mt-6 border border-[#dcdcd2] bg-[#f5f5ee] divide-y md:divide-y-0 md:divide-x divide-[#dcdcd2] grid grid-cols-2 md:grid-cols-4 font-mono">
          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">MONTHLY SAVINGS RUN-RATE</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#059669] tabular-nums">
                ₹{(totalCostSavings / 100000).toFixed(2)}
              </span>
              <span className="text-xs text-[#059669]">Lakh</span>
            </div>
            <span className="text-[11px] text-[#6f7e75] mt-1 block">~₹17.4L Annualized</span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">ENERGY REDUCTION TARGET</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#101512] tabular-nums">
                {(totalKwhSavings / 1000).toFixed(1)}
              </span>
              <span className="text-xs text-[#6f7e75]">MWh</span>
            </div>
            <span className="text-[11px] text-[#6f7e75] mt-1 block">11.2% Average load reduction</span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">SETPOINT AUTOMATION</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#101512] tabular-nums">
                {appliedCount} of {recommendations.length}
              </span>
            </div>
            <span className="text-[11px] text-[#059669] mt-1 block">Direct BACnet/IP setpoint</span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">PAYBACK HORIZON</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#059669] tabular-nums">
                Immediate
              </span>
            </div>
            <span className="text-[11px] text-[#6f7e75] mt-1 block">Zero CapEx Required</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. FILTER & SEARCH CONTROL CONSOLE
          ======================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#e2e2d8]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-[#ebebe2] p-0.5 border border-[#d6d6cb] font-mono text-xs overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 cursor-pointer transition-colors whitespace-nowrap ${
                    categoryFilter === cat
                      ? 'bg-[#101512] text-[#fbfbfa] font-bold'
                      : 'text-[#525f56] hover:text-[#101512]'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-[#ebebe2] p-0.5 border border-[#d6d6cb] font-mono text-xs">
              {(['All', 'High', 'Medium', 'Low'] as const).map((pri) => (
                <button
                  key={pri}
                  onClick={() => setPriorityFilter(pri)}
                  className={`px-2.5 py-1 cursor-pointer transition-colors ${
                    priorityFilter === pri
                      ? 'bg-[#101512] text-[#fbfbfa] font-bold'
                      : 'text-[#525f56] hover:text-[#101512]'
                  }`}
                >
                  {pri.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full max-w-xs font-mono text-xs">
            <Search className="w-3.5 h-3.5 text-[#6f7e75] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search opportunity or site..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#fbfbfa] border border-[#dcdcd2] pl-8 pr-3 py-1.5 text-[#101512] placeholder:text-[#8e9e94] focus:outline-hidden focus:border-[#059669]"
            />
          </div>
        </div>

        {/* ========================================================
            3. EDITORIAL OPPORTUNITY DISPATCHES (Real Energy Analyst Tone)
            ======================================================== */}
        <div className="border border-[#e2e2d8] divide-y divide-[#e2e2d8] bg-[#fbfbfa]">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-[#6f7e75]">
              No optimization dispatches matching current criteria.
            </div>
          ) : (
            filtered.map((rec) => {
              const isWhyOpen = expandedWhyId === rec.id;

              return (
                <div
                  key={rec.id}
                  className="p-6 hover:bg-[#f5f5ee] transition-all font-mono"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    {/* Left: Location & Title */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[10px] text-[#059669] font-bold uppercase tracking-widest bg-[#f0fdf4] border border-[#86efac] px-2 py-0.5">
                          ENERGY OPPORTUNITY // {rec.category.toUpperCase()}
                        </span>
                        <span className="text-xs text-[#8e9e94]">·</span>
                        <span className="text-xs font-bold text-[#101512] uppercase tracking-wider">
                          {rec.facilityName}
                        </span>
                      </div>

                      <h3 className="mt-2 text-base sm:text-lg font-bold text-[#101512] font-sans tracking-tight">
                        {rec.title}
                      </h3>

                      <p className="mt-2 text-xs sm:text-sm text-[#525f56] font-sans leading-relaxed">
                        {rec.reason}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-[#6f7e75]">
                        <span className="text-[#059669] font-bold">
                          ↓ {rec.estimatedSavingPercent}% Peak Demand Reduction
                        </span>
                        <span>·</span>
                        <span>{rec.estimatedEnergySavingKwh.toLocaleString()} kWh Saved / Mo</span>
                        <span>·</span>
                        <span>92% Confidence Score</span>
                        <span>·</span>
                        <span>Effort: {rec.implementationEffort}</span>
                      </div>
                    </div>

                    {/* Middle: Huge Numbers */}
                    <div className="lg:text-right shrink-0">
                      <span className="text-[10px] text-[#6f7e75] uppercase block font-bold">
                        ESTIMATED MONTHLY SAVING
                      </span>
                      <div className="text-2xl sm:text-3xl font-extrabold text-[#059669] tabular-nums mt-0.5">
                        ₹{rec.estimatedCostSavingInr.toLocaleString()}
                      </div>
                      <span className="text-xs text-[#8e9e94] block mt-0.5">Direct bill deduction</span>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2 shrink-0">
                      <button
                        onClick={() => setExpandedWhyId(isWhyOpen ? null : rec.id)}
                        className="px-3.5 py-1.5 border border-[#dcdcd2] hover:border-[#101512] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{isWhyOpen ? 'HIDE ANALYSIS' : 'EXPLORE WHY'}</span>
                        {isWhyOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => onApplyRecommendation(rec.id)}
                        disabled={rec.isApplied}
                        className={`px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                          rec.isApplied
                            ? 'bg-[#dcdcd2] text-[#6f7e75] cursor-not-allowed'
                            : 'bg-[#059669] hover:bg-[#047857] text-white shadow-sm'
                        }`}
                      >
                        {rec.isApplied ? 'SETPOINT ACTIVE' : 'EXECUTE LOAD SHIFT'}
                      </button>
                    </div>
                  </div>

                  {/* Expandable "EXPLORE WHY" Editorial Drawer */}
                  {isWhyOpen && (
                    <div className="mt-4 pt-4 border-t border-[#e2e2d8] bg-[#f5f5ee] p-5 text-xs font-sans space-y-3">
                      <div className="font-mono text-[11px] font-bold text-[#059669] uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-[#059669]" />
                        <span>TELEMETRIC REASONING &amp; DISPATCH SEQUENCE:</span>
                      </div>
                      <p className="text-[#525f56] leading-relaxed">
                        Data from submeter logs indicates that peak electric demand consistently rises between 14:00 and 16:30 IST, coinciding with the highest commercial time-of-day tariff tier (₹11.20/kWh). By pre-cooling critical floors between 11:30 and 13:30 when solar generation is at maximum yield, chiller load can be throttled by 15% during peak surcharge hours without compromising indoor ambient comfort standards.
                      </p>
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 font-mono text-[10px] text-[#6f7e75] border-t border-[#dcdcd2]">
                        <span>Control Protocol: BACnet/IP automated setpoint float</span>
                        <button
                          onClick={() => setSelectedRec(rec)}
                          className="font-bold text-[#059669] hover:underline cursor-pointer"
                        >
                          OPEN DETAILED SYSTEM SPECIFICATION →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {selectedRec && (
        <RecommendationDetailModal
          isOpen={!!selectedRec}
          onClose={() => setSelectedRec(null)}
          recommendation={selectedRec}
          onApply={() => {
            onApplyRecommendation(selectedRec.id);
            setSelectedRec({ ...selectedRec, isApplied: true });
          }}
        />
      )}
    </div>
  );
};
