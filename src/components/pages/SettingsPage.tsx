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
import { UserProfile, PageId } from '../../types';
import { PlatformShell } from '../common/PlatformShell';

interface SettingsPageProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onSaveNotification: () => void;
  onNavigate?: (page: PageId) => void;
}

type SettingsTab =
  | 'account'
  | 'organization'
  | 'facilities'
  | 'energy'
  | 'notifications'
  | 'ai'
  | 'security'
  | 'integrations';

export const SettingsPage: React.FC<SettingsPageProps> = ({
  user,
  onUpdateUser,
  onSaveNotification,
  onNavigate = () => {},
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [profile, setProfile] = useState<UserProfile>(user);

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

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(profile);
    onSaveNotification();
  };

  const tabs: { id: SettingsTab; label: string; icon: React.FC<any> }[] = [
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
      {/* 2. Settings Layout with Left Tabs & Right Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Navigation Tabs (3 cols) */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-200 rounded-lg p-2 shadow-xs space-y-0.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-green-50 text-green-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-green-600' : 'text-slate-400'}`} />
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
            <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Operator Profile</h3>
                <p className="text-xs text-slate-500 mt-0.5">Personal credentials and contact email for energy telemetry notices.</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-slate-900 focus:outline-hidden focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-slate-900 focus:outline-hidden focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Role Title</label>
                    <input
                      type="text"
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-slate-900 focus:outline-hidden focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">System Scope</label>
                    <input
                      type="text"
                      disabled
                      value="Consolidated 5 Campuses (Superadmin)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
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
            <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Organization &amp; Utility Provider</h3>
                <p className="text-xs text-slate-500 mt-0.5">Commercial DISCOM contracts and high-tension tariff agreements.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-medium">Enterprise Entity</span>
                  <p className="text-sm font-bold text-slate-900">GreenGrid Renewable Systems Ltd.</p>
                  <p className="text-slate-500">Corporate PAN: AACCG1284K</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-medium">Primary DISCOM</span>
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
            <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Hardware Ingestion Gateways</h3>
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
                  <div key={idx} className="p-3.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{gtw.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200">
                          {gtw.status}
                        </span>
                      </div>
                      <p className="text-slate-500 mt-0.5">{gtw.location} · IP: {gtw.ip}</p>
                    </div>
                    <span className="text-xs font-semibold text-green-700">MODBUS-RTU OK</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ENERGY THRESHOLDS */}
          {activeTab === 'energy' && (
            <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Tariff Rates &amp; Demand Thresholds</h3>
                <p className="text-xs text-slate-500 mt-0.5">Parameters triggering automatic alarms and peak load-shedding alerts.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Peak Demand Warning Threshold ({peakThresholdPercent}% of Sanctioned Contract)
                  </label>
                  <input
                    type="range"
                    min="70"
                    max="100"
                    value={peakThresholdPercent}
                    onChange={(e) => setPeakThresholdPercent(Number(e.target.value))}
                    className="w-full accent-green-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-slate-400 mt-1 text-[11px]">
                    <span>70% Conservative</span>
                    <span className="font-bold text-green-700">{peakThresholdPercent}% Active</span>
                    <span>100% Strict Limit</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly Power Budget Target (₹)</label>
                  <input
                    type="number"
                    value={monthlyBudgetInr}
                    onChange={(e) => setMonthlyBudgetInr(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-slate-900 focus:outline-hidden focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Baseline Tariff (₹ / kWh)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={baseTariffRate}
                    onChange={(e) => setBaseTariffRate(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-slate-900 focus:outline-hidden focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={onSaveNotification}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
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
            <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Notification Policies</h3>
                <p className="text-xs text-slate-500 mt-0.5">Control how incident alerts and daily summaries are dispatched.</p>
              </div>

              <div className="space-y-3.5 text-xs">
                <label className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                  <div>
                    <span className="font-bold text-slate-900 block">Email Incident Alerts</span>
                    <span className="text-slate-500">Send instant email notifications when contract cap is breached.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 accent-green-600 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                  <div>
                    <span className="font-bold text-slate-900 block">Critical Push Warnings</span>
                    <span className="text-slate-500">Immediate browser notifications for critical equipment trips.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={criticalPush}
                    onChange={(e) => setCriticalPush(e.target.checked)}
                    className="w-4 h-4 accent-green-600 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                  <div>
                    <span className="font-bold text-slate-900 block">Daily Energy Digest</span>
                    <span className="text-slate-500">Consolidated morning summary at 08:00 IST with yesterday's totals.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={dailyDigest}
                    onChange={(e) => setDailyDigest(e.target.checked)}
                    className="w-4 h-4 accent-green-600 cursor-pointer"
                  />
                </label>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Slack / Teams Webhook Ingestion</label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-slate-900 focus:outline-hidden focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={onSaveNotification}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
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
            <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">AI Optimization Engine</h3>
                <p className="text-xs text-slate-500 mt-0.5">Autonomous setpoint controls and thermal pre-cooling modeling parameters.</p>
              </div>

              <div className="space-y-4 text-xs">
                <label className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                  <div>
                    <span className="font-bold text-slate-900 block">Automated BMS Closed-Loop Execution</span>
                    <span className="text-slate-500">Allow AI to directly dispatch chiller setpoints without manual confirmation.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoApplyBms}
                    onChange={(e) => setAutoApplyBms(e.target.checked)}
                    className="w-4 h-4 accent-green-600 cursor-pointer"
                  />
                </label>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    AI Confidence Threshold: {confidenceCutoff}%
                  </label>
                  <input
                    type="range"
                    min="75"
                    max="99"
                    value={confidenceCutoff}
                    onChange={(e) => setConfidenceCutoff(Number(e.target.value))}
                    className="w-full accent-green-600 cursor-pointer"
                  />
                  <span className="text-slate-400 text-[11px]">Only propose actions with model confidence exceeding {confidenceCutoff}%.</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Thermal Pre-Cooling Lead Time (Minutes)</label>
                  <input
                    type="number"
                    value={preCoolingLeadTime}
                    onChange={(e) => setPreCoolingLeadTime(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-slate-900 focus:outline-hidden focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={onSaveNotification}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
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
            <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Security &amp; Terminal Encryption</h3>
                <p className="text-xs text-slate-500 mt-0.5">MFA enforcement and cryptographic hardware certificates.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Two-Factor Authentication (2FA)</span>
                    <span className="text-slate-500">Hardware token or authenticator app for operator sign-in.</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-green-50 text-green-700 border border-green-200">
                    Enforced
                  </span>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">TLS / TLS 1.3 Telemetry Tunnel</span>
                    <span className="text-slate-500">mTLS authenticated telemetry from IoT gateway edge nodes.</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-green-50 text-green-700 border border-green-200">
                    Active
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: INTEGRATIONS */}
          {activeTab === 'integrations' && (
            <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">BMS &amp; Industrial Protocol Bus</h3>
                <p className="text-xs text-slate-500 mt-0.5">Supported field protocols for telemetry acquisition and actuation.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-lg border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block">BACnet / IP</span>
                  <p className="text-slate-500">Port 47808 · Chiller &amp; VAV control</p>
                  <span className="text-green-700 font-semibold text-[11px]">Connected · 18 Devices</span>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block">MODBUS-TCP</span>
                  <p className="text-slate-500">Port 502 · Digital power meters</p>
                  <span className="text-green-700 font-semibold text-[11px]">Connected · 42 Meters</span>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block">OPC UA Server</span>
                  <p className="text-slate-500">Industrial SCADA bridging</p>
                  <span className="text-slate-500 font-semibold text-[11px]">Available</span>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block">MQTT Broker</span>
                  <p className="text-slate-500">Rooftop solar telemetry ingestion</p>
                  <span className="text-green-700 font-semibold text-[11px]">Connected · 12 Strings</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PlatformShell>
  );
};
