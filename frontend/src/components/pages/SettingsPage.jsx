import React, { useState } from 'react';
import {
  User,
  Building,
  Radio,
  Sliders,
  Bell,
  Cpu,
  Shield,
  Cable,
  Save,
  CheckCircle2,
  Lock,
  Key,
  Database,
  Zap,
  Globe,
} from 'lucide-react';
import { PlatformShell } from '../common/PlatformShell';

export const SettingsPage = ({
  user,
  onUpdateUser,
  onSaveNotification,
  onNavigate = () => {},
}) => {
  const [activeTab, setActiveTab] = useState('account');
  const [profile, setProfile] = useState(user);

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(true);
  const [criticalPush, setCriticalPush] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.slack.com/services/T00/B00/greengrid-alerts');

  // Energy thresholds
  const [peakThresholdPercent, setPeakThresholdPercent] = useState(90);
  const [monthlyBudgetInr, setMonthlyBudgetInr] = useState(1500000);
  const [renewableTargetPercent, setRenewableTargetPercent] = useState(40);
  const [baseTariffRate, setBaseTariffRate] = useState(7.5);

  // AI automation preferences
  const [autoApplyBms, setAutoApplyBms] = useState(false);
  const [confidenceCutoff, setConfidenceCutoff] = useState(90);
  const [preCoolingLeadTime, setPreCoolingLeadTime] = useState(120);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    onUpdateUser(profile);
    onSaveNotification();
  };

  const tabs = [
    { id: 'account', label: 'Account Profile', icon: User },
    { id: 'organization', label: 'Organization & DISCOM', icon: Building },
    { id: 'facilities', label: 'Hardware Gateways', icon: Radio },
    { id: 'energy', label: 'Tariff & Peak Thresholds', icon: Sliders },
    { id: 'notifications', label: 'Notification Policies', icon: Bell },
    { id: 'ai', label: 'AI Optimization Preferences', icon: Cpu },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'integrations', label: 'BMS & Protocol Bus', icon: Cable },
  ];

  return (
    <PlatformShell
      pageTitle="Settings & Configuration Policies"
      pageCategory="Administration"
      pageDescription="Configure operator credentials, peak demand trigger policies, notification routing, and building hardware connectors."
      onNavigate={onNavigate}
    >
      {/* Settings Layout with Left Tabs & Right Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Navigation Tabs (3 cols) */}
        <div className="lg:col-span-3">
          <div
            className="bg-white border border-slate-200/80 rounded-2xl p-2.5 shadow-xs space-y-1"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Panel (9 cols) */}
        <div className="lg:col-span-9">
          {/* TAB 1: ACCOUNT PROFILE */}
          {activeTab === 'account' && (
            <div
              className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
            >
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Operator Profile</h3>
                <p className="text-xs text-slate-500 mt-0.5">Personal credentials and contact email for energy telemetry notices.</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Role Title</label>
                    <input
                      type="text"
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      className="w-full bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">System Scope</label>
                    <input
                      type="text"
                      disabled
                      value="Consolidated 5 Campuses (Superadmin)"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: ORGANIZATION */}
          {activeTab === 'organization' && (
            <div
              className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
            >
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Organization &amp; Utility Provider</h3>
                <p className="text-xs text-slate-500 mt-0.5">Commercial DISCOM contracts and high-tension tariff agreements.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Enterprise Entity</span>
                  <p className="text-sm font-bold text-slate-900">GreenGrid Renewable Systems Ltd.</p>
                  <p className="text-slate-500">Corporate PAN: AACCG1284K</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Primary DISCOM</span>
                  <p className="text-sm font-bold text-slate-900">BESCOM / MSEDCL / DHBVN</p>
                  <p className="text-slate-500">HT Category 2a (Commercial &amp; Industrial)</p>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-500">
                Connected Meter IDs: <strong className="text-slate-800">42 smart submeters authenticated via MODBUS-TCP</strong>.
              </div>
            </div>
          )}

          {/* TAB 3: HARDWARE GATEWAYS */}
          {activeTab === 'facilities' && (
            <div
              className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
            >
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Hardware Ingestion Gateways</h3>
                <p className="text-xs text-slate-500 mt-0.5">Physical telemetry aggregators polling digital energy meters at 10-second intervals.</p>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { name: 'BLR-EDGE-GTW-01', location: 'Bangalore Campus Electrical Room A', status: 'Online', ip: '10.24.10.15' },
                  { name: 'PNE-EDGE-GTW-02', location: 'Pune Plant Substation 11kV', status: 'Online', ip: '10.24.20.18' },
                  { name: 'GGN-EDGE-GTW-03', location: 'Gurugram High-Rise Basement Meter Room', status: 'Online', ip: '10.24.30.22' },
                  { name: 'CHN-EDGE-GTW-04', location: 'Chennai Logistics Substation', status: 'Online', ip: '10.24.40.10' },
                  { name: 'HYD-EDGE-GTW-05', location: 'Hyderabad R&D Hub Utility Block', status: 'Online', ip: '10.24.50.12' },
                ].map((gtw, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-emerald-300 transition-all flex items-center justify-between shadow-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 font-mono">{gtw.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {gtw.status}
                        </span>
                      </div>
                      <p className="text-slate-500 mt-1">{gtw.location} · IP: <span className="font-mono text-slate-700">{gtw.ip}</span></p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                      MODBUS-RTU OK
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ENERGY THRESHOLDS */}
          {activeTab === 'energy' && (
            <div
              className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
            >
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Tariff Rates &amp; Demand Thresholds</h3>
                <p className="text-xs text-slate-500 mt-0.5">Parameters triggering automatic alarms and peak load-shedding alerts.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Peak Demand Warning Threshold ({peakThresholdPercent}% of Sanctioned Contract)
                  </label>
                  <input
                    type="range"
                    min="70"
                    max="100"
                    value={peakThresholdPercent}
                    onChange={(e) => setPeakThresholdPercent(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-slate-400 mt-1 text-[11px]">
                    <span>70% Conservative</span>
                    <span className="font-bold text-emerald-700">{peakThresholdPercent}% Active</span>
                    <span>100% Strict Limit</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Monthly Power Budget Target (₹)</label>
                  <input
                    type="number"
                    value={monthlyBudgetInr}
                    onChange={(e) => setMonthlyBudgetInr(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Baseline Tariff (₹ / kWh)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={baseTariffRate}
                    onChange={(e) => setBaseTariffRate(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={onSaveNotification}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Update Policies</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div
              className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
            >
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Notification Policies</h3>
                <p className="text-xs text-slate-500 mt-0.5">Control how incident alerts and daily summaries are dispatched.</p>
              </div>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200/80 hover:bg-slate-50/80 cursor-pointer transition-all">
                  <div>
                    <span className="font-bold text-slate-900 block">Email Incident Alerts</span>
                    <span className="text-slate-500">Send instant email notifications when contract cap is breached.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200/80 hover:bg-slate-50/80 cursor-pointer transition-all">
                  <div>
                    <span className="font-bold text-slate-900 block">Critical Push Warnings</span>
                    <span className="text-slate-500">Immediate browser notifications for critical equipment trips.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={criticalPush}
                    onChange={(e) => setCriticalPush(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200/80 hover:bg-slate-50/80 cursor-pointer transition-all">
                  <div>
                    <span className="font-bold text-slate-900 block">Daily Energy Digest</span>
                    <span className="text-slate-500">Consolidated morning summary at 08:00 IST with yesterday's totals.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={dailyDigest}
                    onChange={(e) => setDailyDigest(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                </label>

                <div className="pt-2">
                  <label className="block font-semibold text-slate-700 mb-1.5">Slack / Teams Webhook Ingestion</label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={onSaveNotification}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Preferences</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: AI OPTIMIZATION */}
          {activeTab === 'ai' && (
            <div
              className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
            >
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">AI Optimization Engine</h3>
                <p className="text-xs text-slate-500 mt-0.5">Autonomous setpoint controls and thermal pre-cooling modeling parameters.</p>
              </div>

              <div className="space-y-4 text-xs">
                <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200/80 hover:bg-slate-50/80 cursor-pointer transition-all">
                  <div>
                    <span className="font-bold text-slate-900 block">Automated BMS Closed-Loop Execution</span>
                    <span className="text-slate-500">Allow AI to directly dispatch chiller setpoints without manual confirmation.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoApplyBms}
                    onChange={(e) => setAutoApplyBms(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                </label>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    AI Confidence Threshold: <span className="text-emerald-700 font-bold">{confidenceCutoff}%</span>
                  </label>
                  <input
                    type="range"
                    min="75"
                    max="99"
                    value={confidenceCutoff}
                    onChange={(e) => setConfidenceCutoff(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <span className="text-slate-400 text-[11px]">Only propose actions with model confidence exceeding {confidenceCutoff}%.</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Thermal Pre-Cooling Lead Time (Minutes)</label>
                  <input
                    type="number"
                    value={preCoolingLeadTime}
                    onChange={(e) => setPreCoolingLeadTime(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={onSaveNotification}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Engine Preferences</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SECURITY */}
          {activeTab === 'security' && (
            <div
              className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
            >
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Security &amp; Terminal Encryption</h3>
                <p className="text-xs text-slate-500 mt-0.5">MFA enforcement and cryptographic hardware certificates.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl border border-slate-200/80 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">Two-Factor Authentication (2FA)</span>
                    <span className="text-slate-500">Hardware token or authenticator app for operator sign-in.</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Enforced
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200/80 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">TLS / TLS 1.3 Telemetry Tunnel</span>
                    <span className="text-slate-500">mTLS authenticated telemetry from IoT gateway edge nodes.</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: INTEGRATIONS */}
          {activeTab === 'integrations' && (
            <div
              className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
            >
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">BMS &amp; Industrial Protocol Bus</h3>
                <p className="text-xs text-slate-500 mt-0.5">Supported field protocols for telemetry acquisition and actuation.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-4 rounded-xl border border-slate-200/80 space-y-1.5 shadow-xs hover:border-emerald-300 transition-colors">
                  <span className="font-bold text-slate-900 block font-mono">BACnet / IP</span>
                  <p className="text-slate-500">Port 47808 · Chiller &amp; VAV control</p>
                  <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md inline-block">Connected · 18 Devices</span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200/80 space-y-1.5 shadow-xs hover:border-emerald-300 transition-colors">
                  <span className="font-bold text-slate-900 block font-mono">MODBUS-TCP</span>
                  <p className="text-slate-500">Port 502 · Digital power meters</p>
                  <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md inline-block">Connected · 42 Meters</span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200/80 space-y-1.5 shadow-xs hover:border-slate-300 transition-colors">
                  <span className="font-bold text-slate-900 block font-mono">OPC UA Server</span>
                  <p className="text-slate-500">Industrial SCADA bridging</p>
                  <span className="text-slate-500 font-semibold text-[11px] bg-slate-100 px-2 py-0.5 rounded-md inline-block">Available</span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200/80 space-y-1.5 shadow-xs hover:border-emerald-300 transition-colors">
                  <span className="font-bold text-slate-900 block font-mono">MQTT Broker</span>
                  <p className="text-slate-500">Rooftop solar telemetry ingestion</p>
                  <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md inline-block">Connected · 12 Strings</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PlatformShell>
  );
};
