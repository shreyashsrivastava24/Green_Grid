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
  CheckCircle2,
} from 'lucide-react';
import { Recommendation, RecommendationPriority, PageId } from '../../types';
import { RecommendationDetailModal } from '../modals/RecommendationDetailModal';
import { PlatformShell } from '../common/PlatformShell';

interface RecommendationsPageProps {
  recommendations: Recommendation[];
  onApplyRecommendation: (id: string) => void;
  onNavigate?: (page: PageId) => void;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({
  recommendations,
  onApplyRecommendation,
  onNavigate = () => {},
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
    <PlatformShell
      pageTitle="Energy Optimization & BMS Automation Rules"
      pageCategory="AI Optimization"
      pageDescription="Pre-programmed thermodynamic setpoint modifications and pump staging rules calibrated to eliminate peak tariff surcharges."
      onNavigate={onNavigate}
      actions={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-md text-xs font-semibold text-green-800">
            <Sparkles className="w-3.5 h-3.5 text-green-700" />
            <span>{appliedCount} of {recommendations.length} Rules Active</span>
          </div>
        </div>
      }
    >
      {/* 1. Overview Savings Potential Control Bar */}
      <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Monthly Cost Savings Run-Rate</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-green-700">
                ₹{totalCostSavings.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-500">/ mo</span>
            </div>
            <span className="text-[11px] text-green-700 font-semibold block mt-1">
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
            <span className="text-[11px] text-green-700 font-semibold block mt-1">
              Dispatched over BACnet/IP
            </span>
          </div>

          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Average Peak Shave</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">-12.5%</span>
            </div>
            <span className="text-[11px] text-green-700 font-semibold block mt-1">
              During 14:00 - 18:00 window
            </span>
          </div>
        </div>
      </section>

      {/* 2. Filter & Category Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search recommendations by title, facility, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200 rounded-md focus:border-green-600 focus:outline-hidden transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-md cursor-pointer transition-colors ${
                categoryFilter === cat
                  ? 'bg-green-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Recommendation Rule Cards */}
      <div className="space-y-4">
        {filtered.map((rec) => {
          const isExpanded = expandedWhyId === rec.id;

          return (
            <div
              key={rec.id}
              className={`p-5 rounded-lg border transition-all bg-white shadow-xs ${
                rec.isApplied ? 'border-green-300 ring-1 ring-green-100' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                      {rec.category}
                    </span>
                    <span className="text-xs text-slate-500">Target:</span>
                    <span className="text-xs font-bold text-slate-900">{rec.facilityName}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500 font-medium">
                      Effort: {rec.implementationEffort}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-1">{rec.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    {rec.description}
                  </p>

                  {/* Why This Matters Toggle */}
                  {rec.reason && (
                    <div className="mt-2.5">
                      <button
                        onClick={() => setExpandedWhyId(isExpanded ? null : rec.id)}
                        className="text-xs font-semibold text-green-700 hover:text-green-800 inline-flex items-center gap-1 cursor-pointer transition-colors"
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
                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="text-left lg:text-right">
                    <div className="text-lg sm:text-xl font-bold text-green-700">
                      ₹{rec.estimatedCostSavingInr.toLocaleString()}/mo
                    </div>
                    <span className="text-xs text-slate-500">
                      -{rec.estimatedEnergySavingKwh.toLocaleString()} kWh conserved
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedRec(rec)}
                      className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Details
                    </button>

                    <button
                      onClick={() => onApplyRecommendation(rec.id)}
                      disabled={rec.isApplied}
                      className={`px-4 py-1.5 rounded-md font-bold text-xs transition-all cursor-pointer shadow-xs ${
                        rec.isApplied
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : 'bg-green-700 hover:bg-green-800 text-white'
                      }`}
                    >
                      {rec.isApplied ? '✓ Setpoint Active' : 'Deploy Rule'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
