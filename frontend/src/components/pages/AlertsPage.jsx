import React, { useState } from 'react';
import {
  CheckCircle2,
  Search,
  BellRing,
} from 'lucide-react';
import { PlatformShell } from '../common/PlatformShell';

export const AlertsPage = ({
  alerts,
  onResolveAlert,
  onAcknowledgeAlert,
  onTriggerTestAlert,
  onNavigate = () => {},
}) => {
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Summary counts
  const totalActive = alerts.filter((a) => a.status === 'Active').length;
  const criticalCount = alerts.filter(
    (a) => a.severity === 'Critical' && a.status !== 'Resolved'
  ).length;
  const warningCount = alerts.filter(
    (a) => a.severity === 'Warning' && a.status !== 'Resolved'
  ).length;
  const resolvedCount = alerts.filter((a) => a.status === 'Resolved').length;

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity = severityFilter === 'All' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || alert.status === statusFilter;
    const titleStr = (alert.title || '').toLowerCase();
    const facilityStr = (alert.facilityName || alert.facility_name || '').toLowerCase();
    const descStr = (alert.description || alert.message || '').toLowerCase();
    const metricStr = (alert.metric || alert.alert_type || '').toLowerCase();
    const query = search.toLowerCase();

    const matchesSearch =
      titleStr.includes(query) ||
      facilityStr.includes(query) ||
      descStr.includes(query) ||
      metricStr.includes(query);
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  return (
    <PlatformShell
      pageTitle="Telemetry Alerts & Incident Dispatch"
      pageCategory="Operational Incidents"
      pageDescription="Continuous algorithmic surveillance monitoring inrush current spikes, power factor degradation, and contract demand threshold breaches."
      onNavigate={onNavigate}
      actions={
        <button
          onClick={onTriggerTestAlert}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 font-semibold text-xs transition-all hover:shadow-xs cursor-pointer"
        >
          <BellRing className="w-3.5 h-3.5 text-amber-600" />
          <span>Simulate Telemetry Spike</span>
        </button>
      }
    >
      {/* 1. Overview Incident Summary Control Bar */}
      <section
        className="bg-white border border-slate-200/80 rounded-2xl p-5"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Pending Unresolved</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {totalActive}
              </span>
              <span className="text-xs font-bold text-slate-400">Active</span>
            </div>
            <span className="text-[11px] text-amber-700 font-medium block mt-1">
              Requires engineer verification
            </span>
          </div>

          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Critical Breaches</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 tracking-tight">
                {criticalCount}
              </span>
            </div>
            <span className="text-[11px] text-rose-600 font-medium block mt-1">
              Immediate trip hazard
            </span>
          </div>

          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Elevated Warnings</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-tight">
                {warningCount}
              </span>
            </div>
            <span className="text-[11px] text-amber-700 font-medium block mt-1">
              Monitored parameter drift
            </span>
          </div>

          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Resolved This Cycle</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
                {resolvedCount}
              </span>
              <span className="text-xs font-bold text-slate-400">Closed</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
              ✓ Normal baseline restored
            </span>
          </div>
        </div>
      </section>

      {/* 2. Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search alerts by incident title, campus, or metric..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200/80 rounded-xl focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
          />
        </div>

        {/* Severity Pills */}
        <div className="inline-flex rounded-xl border border-slate-200/80 p-1 bg-slate-100/70 shadow-xs">
          {['All', 'Critical', 'Warning', 'Info'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                severityFilter === sev
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Incidents Feed */}
      <div className="space-y-3.5">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">No Incidents Matching Filters</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              All monitored telemetric parameters are currently nominal for the selected criteria.
            </p>
            <button
              onClick={() => {
                setSeverityFilter('All');
                setStatusFilter('All');
                setSearch('');
              }}
              className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'Critical';
            const isWarning = alert.severity === 'Warning';
            const isResolved = alert.status === 'Resolved';

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl border transition-all duration-200 bg-white hover:shadow-md hover:-translate-y-0.5 ${
                  isResolved
                    ? 'border-slate-200/80 opacity-75'
                    : isCritical
                    ? 'border-rose-300 ring-1 ring-rose-100/80 shadow-rose-50/50 shadow-sm'
                    : 'border-amber-300 shadow-amber-50/50 shadow-sm'
                }`}
                style={{ boxShadow: isResolved ? '0 1px 3px rgba(0,0,0,0.03)' : undefined }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isCritical
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : isWarning
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-sky-50 text-sky-700 border border-sky-200'
                        }`}
                      >
                        {alert.severity}
                      </span>

                      <span className="text-xs font-bold text-slate-900">{alert.facilityName || alert.facility_name || 'Enterprise Campus'}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-400 font-mono">{alert.timestamp || 'Recent'}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1 tracking-tight">
                      {alert.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                      {alert.description || alert.message || 'No additional diagnostic details provided.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                    {!isResolved && (
                      <>
                        {alert.status !== 'Acknowledged' && (
                          <button
                            onClick={() => onAcknowledgeAlert(alert.id)}
                            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                          >
                            Acknowledge
                          </button>
                        )}
                        <button
                          onClick={() => onResolveAlert(alert.id)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs shadow-sm hover:shadow transition-all cursor-pointer"
                        >
                          Mark Resolved
                        </button>
                      </>
                    )}
                    {isResolved && (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified Resolved</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Value vs Threshold Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-3.5 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-2.5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block tracking-wider">
                      Observed Reading
                    </span>
                    <span className="font-bold text-slate-900 font-mono text-sm mt-0.5 block">{alert.currentValue || alert.current_value || '—'}</span>
                  </div>
                  <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-2.5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block tracking-wider">
                      Threshold Limit
                    </span>
                    <span className="font-mono text-slate-600 text-sm mt-0.5 block">{alert.thresholdValue || alert.threshold_value || '—'}</span>
                  </div>
                  <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-2.5 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block tracking-wider">
                      Monitored Metric
                    </span>
                    <span className="font-semibold text-slate-800 text-sm mt-0.5 block truncate">{alert.metric}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </PlatformShell>
  );
};
