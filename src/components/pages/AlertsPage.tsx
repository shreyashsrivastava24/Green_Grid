import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Search,
  Check,
  Building2,
  Zap,
  ArrowRight,
  BellRing,
} from 'lucide-react';
import { Alert, AlertSeverity, AlertStatus, PageId } from '../../types';
import { PlatformShell } from '../common/PlatformShell';

interface AlertsPageProps {
  alerts: Alert[];
  onResolveAlert: (id: string) => void;
  onAcknowledgeAlert: (id: string) => void;
  onTriggerTestAlert: () => void;
  onNavigate?: (page: PageId) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts,
  onResolveAlert,
  onAcknowledgeAlert,
  onTriggerTestAlert,
  onNavigate = () => {},
}) => {
  const [severityFilter, setSeverityFilter] = useState<'All' | AlertSeverity>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | AlertStatus>('All');
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
    const matchesSearch =
      alert.title.toLowerCase().includes(search.toLowerCase()) ||
      alert.facilityName.toLowerCase().includes(search.toLowerCase()) ||
      alert.description.toLowerCase().includes(search.toLowerCase()) ||
      alert.metric.toLowerCase().includes(search.toLowerCase());
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
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs shadow-xs transition-colors cursor-pointer"
        >
          <BellRing className="w-3.5 h-3.5 text-amber-600" />
          <span>Simulate Telemetry Spike</span>
        </button>
      }
    >
      {/* 1. Overview Incident Summary Control Bar */}
      <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Pending Unresolved</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                {totalActive}
              </span>
              <span className="text-xs font-bold text-slate-500">Active</span>
            </div>
            <span className="text-[11px] text-amber-700 font-medium block mt-1">
              Requires engineer verification
            </span>
          </div>

          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Critical Breaches</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-rose-600">
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
              <span className="text-2xl sm:text-3xl font-bold text-amber-600">
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
              <span className="text-2xl sm:text-3xl font-bold text-green-700">
                {resolvedCount}
              </span>
              <span className="text-xs font-bold text-slate-500">Closed</span>
            </div>
            <span className="text-[11px] text-green-700 font-semibold block mt-1">
              ✓ Normal baseline restored
            </span>
          </div>
        </div>
      </section>

      {/* 2. Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search alerts by incident title, campus, or metric..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200 rounded-md focus:border-green-600 focus:outline-hidden transition-colors"
          />
        </div>

        {/* Severity Pills */}
        <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-white shadow-xs">
          {(['All', 'Critical', 'Warning', 'Info'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer transition-colors ${
                severityFilter === sev
                  ? 'bg-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Incidents Feed */}
      <div className="space-y-3.5">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === 'Critical';
          const isWarning = alert.severity === 'Warning';
          const isResolved = alert.status === 'Resolved';

          return (
            <div
              key={alert.id}
              className={`p-4 sm:p-5 rounded-lg border transition-all bg-white shadow-xs ${
                isResolved
                  ? 'border-slate-200 opacity-75'
                  : isCritical
                  ? 'border-rose-300 ring-1 ring-rose-100'
                  : 'border-amber-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCritical
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : isWarning
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-sky-50 text-sky-700 border border-sky-200'
                      }`}
                    >
                      {alert.severity}
                    </span>

                    <span className="text-xs font-bold text-slate-900">{alert.facilityName}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-400 font-mono">{alert.timestamp}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    {alert.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                  {!isResolved && (
                    <>
                      {alert.status !== 'Acknowledged' && (
                        <button
                          onClick={() => onAcknowledgeAlert(alert.id)}
                          className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Acknowledge
                        </button>
                      )}
                      <button
                        onClick={() => onResolveAlert(alert.id)}
                        className="px-3.5 py-1.5 rounded-md bg-green-700 hover:bg-green-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        Mark Resolved
                      </button>
                    </>
                  )}
                  {isResolved && (
                    <span className="text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded border border-green-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Resolved</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Value vs Threshold Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Observed Reading
                  </span>
                  <span className="font-bold text-slate-900 font-mono">{alert.currentValue}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Threshold Limit
                  </span>
                  <span className="font-mono text-slate-600">{alert.thresholdValue}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Monitored Metric
                  </span>
                  <span>{alert.metric}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PlatformShell>
  );
};
