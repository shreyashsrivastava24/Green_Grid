import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { RecommendationDetailModal } from '../modals/RecommendationDetailModal';
import { PlatformShell } from '../common/PlatformShell';

export const RecommendationsPage = ({
  recommendations,
  onApplyRecommendation,
  onNavigate = () => {},
}) => {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedRec, setSelectedRec] = useState(null);
  const [expandedWhyId, setExpandedWhyId] = useState(null);

  // Computations
  const totalCostSavings = recommendations.reduce((sum, r) => sum + (r.estimatedCostSavingInr ?? r.estimated_cost_saving ?? 0), 0);
  const totalKwhSavings = recommendations.reduce((sum, r) => sum + (r.estimatedEnergySavingKwh ?? r.estimated_energy_saving ?? 0), 0);
  const appliedCount = recommendations.filter((r) => r.isApplied || r.is_applied).length;

  const categories = ['All', 'HVAC Optimization', 'Peak Shaving', 'Lighting', 'Solar & Battery'];

  const filtered = recommendations.filter((rec) => {
    const matchesCat = categoryFilter === 'All' || rec.category === categoryFilter;
    const matchesPri = priorityFilter === 'All' || rec.priority === priorityFilter;
    const titleStr = (rec.title || '').toLowerCase();
    const facStr = (rec.facilityName || rec.facility_name || '').toLowerCase();
    const reasonStr = (rec.reason || '').toLowerCase();
    const catStr = (rec.category || '').toLowerCase();
    const query = search.toLowerCase();

    const matchesSearch =
      titleStr.includes(query) ||
      facStr.includes(query) ||
      reasonStr.includes(query) ||
      catStr.includes(query);
    return matchesCat && matchesPri && matchesSearch;
  });

  return (
    <PlatformShell
      pageTitle="Energy Optimization & BMS Automation Rules"
      pageCategory="AI Optimization"
      pageDescription="Pre-programmed thermodynamic setpoint modifications and pump staging rules calibrated to eliminate peak tariff surcharges."
      onNavigate={onNavigate}
      actions={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-md text-xs font-semibold text-emerald-700">
            <Sparkles className="w-3.5 h-3.5 text-green-700" />
            <span>{appliedCount} of {recommendations.length} Rules Active</span>
          </div>
        </div>
      }
    >
      {/* 1. Overview Savings Potential Control Bar */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Monthly Cost Savings Run-Rate</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-green-700">
                ₹{totalCostSavings.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-500">/ mo</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
              Direct billing expenditure reduction
            </span>
          </div>

          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Monthly Conserved Units</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                {totalKwhSavings.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-500">kWh</span>
            </div>
            <span className="text-[11px] text-slate-600 block mt-1">
              Reduced peak thermal stress
            </span>
          </div>

          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Active Setpoint Rules</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-green-700">
                {appliedCount}
              </span>
              <span className="text-xs font-bold text-slate-500">/ {recommendations.length}</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
              Dispatched over BACnet/IP
            </span>
          </div>

          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Average Peak Shave</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">-12.5%</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
              During 14:00 - 18:00 window
            </span>
          </div>
        </div>
      </section>

      {/* 2. Filter & Category Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search recommendations by title, facility, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200/80 rounded-xl focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/70 rounded-xl border border-slate-200/60 shadow-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                categoryFilter === cat
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Recommendation Rule Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">No Recommendations Match Filters</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Try adjusting your category selection or clear your search query to see other optimization opportunities.
            </p>
            <button
              onClick={() => {
                setCategoryFilter('All');
                setPriorityFilter('All');
                setSearch('');
              }}
              className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filtered.map((rec) => {
            const isExpanded = expandedWhyId === rec.id;

            return (
              <div
                key={rec.id}
                className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 bg-white hover:shadow-md hover:-translate-y-0.5 ${
                  rec.isApplied
                    ? 'border-emerald-300 ring-1 ring-emerald-100/80 shadow-emerald-50/50 shadow-sm'
                    : 'border-slate-200/80'
                }`}
                style={{ boxShadow: !rec.isApplied ? '0 1px 3px rgba(0,0,0,0.04)' : undefined }}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {rec.category}
                      </span>
                      <span className="text-xs text-slate-400">Target:</span>
                      <span className="text-xs font-bold text-slate-900">{rec.facilityName}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500 font-medium">
                        Effort: <span className="text-slate-700 font-semibold">{rec.implementationEffort}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 tracking-tight">{rec.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                      {rec.description}
                    </p>

                    {/* Why This Matters Toggle */}
                    {rec.reason && (
                      <div className="mt-2.5">
                        <button
                          onClick={() => setExpandedWhyId(isExpanded ? null : rec.id)}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>Implementation Technical Basis</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600 space-y-1 leading-relaxed animate-in fade-in duration-150">
                            <p>
                              <strong className="text-slate-900">Technical Basis: </strong>
                              {rec.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Savings & Action CTA */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right">
                      <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 tracking-tight font-mono">
                        ₹{(rec.estimatedCostSavingInr ?? rec.estimated_cost_saving ?? 0).toLocaleString()}<span className="text-xs text-slate-400 font-sans font-medium">/mo</span>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        -{(rec.estimatedEnergySavingKwh ?? rec.estimated_energy_saving ?? 0).toLocaleString()} kWh conserved
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedRec(rec)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => onApplyRecommendation(rec.id)}
                        disabled={rec.isApplied}
                        className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm hover:shadow ${
                          rec.isApplied
                            ? 'bg-slate-200 text-slate-500 cursor-not-allowed shadow-none'
                            : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white'
                        }`}
                      >
                        {rec.isApplied ? '✓ Setpoint Active' : 'Deploy Rule'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      <RecommendationDetailModal
        recommendation={selectedRec}
        isOpen={Boolean(selectedRec)}
        onClose={() => setSelectedRec(null)}
        onApply={(id) => onApplyRecommendation(id)}
      />
    </PlatformShell>
  );
};
