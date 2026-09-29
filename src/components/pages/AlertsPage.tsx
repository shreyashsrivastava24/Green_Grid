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
  Eye,
  Radio,
  Sliders,
  Filter,
  RefreshCw,
  BellRing,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Alert, AlertSeverity, AlertStatus } from '../../types';

interface AlertsPageProps {
  alerts: Alert[];
  onResolveAlert: (id: string) => void;
  onAcknowledgeAlert: (id: string) => void;
  onTriggerTestAlert: () => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts,
  onResolveAlert,
  onAcknowledgeAlert,
  onTriggerTestAlert,
}) => {
  const [severityFilter, setSeverityFilter] = useState<'All' | AlertSeverity>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | AlertStatus>('All');
  const [search, setSearch] = useState('');
  const [investigatingAlertId, setInvestigatingAlertId] = useState<string | null>(null);

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
    <div className="space-y-10 pb-16">
      {/* ========================================================
          1. EDITORIAL HEADER & INCIDENT METRICS
          ======================================================== */}
      <section className="pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e2e2d8]">
          <div className="space-y-2">
            <div className="text-[11px] font-mono tracking-[0.22em] text-[#059669] uppercase font-semibold">
              OPERATIONAL LOG // INCIDENT DISPATCH
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#101512] tracking-tight leading-[1.08] font-editorial">
              GRID INCIDENTS &amp;<br />
              <span className="text-[#059669]">OPERATIONS LOG</span>
            </h1>
            <p className="text-sm sm:text-base text-[#525f56] font-sans max-w-xl">
              Chronological audit log of contract demand ceiling breaches, solar inverter anomalies, and automated setpoint interventions.
            </p>
          </div>

          <button
            onClick={onTriggerTestAlert}
            className="px-4 py-2 bg-[#101512] hover:bg-[#059669] text-[#fbfbfa] text-xs font-mono font-bold tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto"
          >
            <BellRing className="w-3.5 h-3.5 text-amber-400" />
            <span>SIMULATE TELEMETRY EVENT</span>
          </button>
        </div>

        {/* Operational Incident Strip */}
        <div className="mt-6 border border-[#dcdcd2] bg-[#f5f5ee] divide-y md:divide-y-0 md:divide-x divide-[#dcdcd2] grid grid-cols-2 md:grid-cols-4 font-mono">
          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">ACTIVE INCIDENTS</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#101512] tabular-nums">
                {totalActive}
              </span>
              <span className="text-xs text-[#6f7e75]">EVENTS</span>
            </div>
            <span className="text-[11px] text-[#059669] mt-1 block">Live submeter watchdog</span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">CRITICAL OVERLOADS</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 tabular-nums">
                {criticalCount}
              </span>
              <span className="text-xs text-rose-600 font-bold">BREACH</span>
            </div>
            <span className="text-[11px] text-rose-600 mt-1 block">Sanctioned cap exceeded</span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">HIGH USAGE WARNINGS</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 tabular-nums">
                {warningCount}
              </span>
              <span className="text-xs text-amber-600 font-bold">WARN</span>
            </div>
            <span className="text-[11px] text-[#6f7e75] mt-1 block">Approaching peak threshold</span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">RESOLVED THIS MONTH</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#059669] tabular-nums">
                {resolvedCount}
              </span>
              <span className="text-xs text-[#059669]">RESOLVED</span>
            </div>
            <span className="text-[11px] text-[#059669] mt-1 block">Mean time to resolve: 24m</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. FILTER & SEARCH CONTROL CONSOLE
          ======================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#e2e2d8]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-[#ebebe2] p-0.5 border border-[#d6d6cb] font-mono text-xs">
              {(['All', 'Critical', 'Warning', 'Info'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-3 py-1 cursor-pointer transition-colors ${
                    severityFilter === sev
                      ? 'bg-[#101512] text-[#fbfbfa] font-bold'
                      : 'text-[#525f56] hover:text-[#101512]'
                  }`}
                >
                  {sev.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-[#ebebe2] p-0.5 border border-[#d6d6cb] font-mono text-xs">
              {(['All', 'Active', 'Acknowledged', 'Resolved'] as const).map((st) => (
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
              placeholder="Search event, campus, metric..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#fbfbfa] border border-[#dcdcd2] pl-8 pr-3 py-1.5 text-[#101512] placeholder:text-[#8e9e94] focus:outline-hidden focus:border-[#059669]"
            />
          </div>
        </div>

        {/* ========================================================
            3. THE OPERATIONAL TIMELINE (Clean Editorial Operations Log)
            ======================================================== */}
        <div className="border border-[#e2e2d8] divide-y divide-[#e2e2d8] bg-[#fbfbfa] font-mono">
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6f7e75]">
              No incident entries matching current filters.
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isResolved = alert.status === 'Resolved';
              const isCritical = alert.severity === 'Critical';
              const isWarning = alert.severity === 'Warning';
              const isInvestigating = investigatingAlertId === alert.id;

              return (
                <div
                  key={alert.id}
                  className="p-5 sm:p-6 hover:bg-[#f5f5ee] transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Time Stamp & Severity Dot */}
                    <div className="flex items-center gap-3 min-w-[200px] shrink-0">
                      <span className="text-base font-bold text-[#101512] tabular-nums">
                        {alert.timestamp.split(' ')[1] || alert.timestamp}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isResolved
                            ? 'bg-[#8e9e94]'
                            : isCritical
                            ? 'bg-rose-600 signal-pulse'
                            : 'bg-amber-500'
                        }`}
                      />
                      <span
                        className={`text-xs font-extrabold uppercase tracking-wider ${
                          isResolved
                            ? 'text-[#8e9e94]'
                            : isCritical
                            ? 'text-rose-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {isResolved ? 'RESOLVED' : alert.severity.toUpperCase()}
                      </span>
                    </div>

                    {/* Facility & Incident Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-bold text-[#101512] font-sans">
                          {alert.facilityName}
                        </span>
                        <span className="text-xs text-[#6f7e75]">·</span>
                        <span className="text-xs text-[#525f56] font-sans font-semibold">
                          {alert.title}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-[#525f56] font-sans leading-relaxed">
                        {alert.description}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-6 text-xs text-[#6f7e75]">
                        <div>
                          <span className="text-[10px] uppercase block">RECORDED TELEMETRY</span>
                          <span className={`font-bold tabular-nums ${isCritical && !isResolved ? 'text-rose-600' : 'text-[#101512]'}`}>
                            {alert.currentValue}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase block">CONTRACT THRESHOLD</span>
                          <span className="tabular-nums font-semibold text-[#101512]">{alert.thresholdValue}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase block">METRIC DOMAIN</span>
                          <span className="font-semibold text-[#101512]">{alert.metric}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-3 shrink-0 self-end lg:self-start">
                      <button
                        onClick={() =>
                          setInvestigatingAlertId(isInvestigating ? null : alert.id)
                        }
                        className="px-3 py-1.5 border border-[#dcdcd2] hover:border-[#101512] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>{isInvestigating ? 'CLOSE' : 'INVESTIGATE'}</span>
                        {isInvestigating ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {!isResolved && (
                        <button
                          onClick={() => onResolveAlert(alert.id)}
                          className="px-3.5 py-1.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                        >
                          RESOLVE INCIDENT
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Investigation Briefing Drawer */}
                  {isInvestigating && (
                    <div className="mt-4 pt-4 border-t border-[#e2e2d8] bg-[#f5f5ee] p-4 text-xs font-sans space-y-2">
                      <div className="font-mono text-[11px] font-bold text-[#059669] uppercase tracking-wider">
                        ROOT-CAUSE ANALYSIS // RECOMMENDED ACTION:
                      </div>
                      <p className="text-[#525f56] leading-relaxed">
                        {isCritical
                          ? 'Simultaneous startup of secondary chiller banks coincided with regional state grid peak-pricing window. To mitigate DISCOM low power factor penalties and peak demand surcharges, throttle VFD setpoint by 15% or enable chiller soft-staging sequence.'
                          : 'Telemetry readings deviate by 28% from 30-day baseline for ambient temperature. Recommended action: schedule technician inspection or activate automated BMS demand limiter.'}
                      </p>
                      <div className="font-mono text-[10px] text-[#6f7e75] pt-1">
                        Dispatch Protocol: BACnet/IP automated setpoint floating ready
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
