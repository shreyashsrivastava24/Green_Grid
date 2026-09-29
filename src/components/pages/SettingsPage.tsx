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
import { UserProfile } from '../../types';

interface SettingsPageProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onSaveNotification: () => void;
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
    <div className="space-y-10 pb-16 font-mono">
      {/* ========================================================
          1. EDITORIAL HEADER
          ======================================================== */}
      <section className="pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e2e2d8]">
          <div className="space-y-2">
            <div className="text-[11px] font-mono tracking-[0.22em] text-[#059669] uppercase font-semibold">
              SYSTEM CONFIGURATION // ROOT-ADMIN
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#101512] tracking-tight leading-[1.08] font-editorial">
              SYSTEM SETTINGS &amp;<br />
              <span className="text-[#059669]">TELEMETRY POLICIES</span>
            </h1>
            <p className="text-sm sm:text-base text-[#525f56] font-sans max-w-xl">
              Operator authentication, peak demand threshold triggers, notification routing, and BACnet/IP building hardware connectors.
            </p>
          </div>

          <div className="text-xs text-[#6f7e75]">
            SESSION: ROOT-ADMIN · DISCOM HT-2a
          </div>
        </div>
      </section>

      {/* ========================================================
          2. ASYMMETRIC SETTINGS VIEWPORT (4 cols nav + 8 cols content)
          ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Rail (4 cols) */}
        <div className="lg:col-span-4 border border-[#e2e2d8] divide-y divide-[#e2e2d8] bg-[#fbfbfa] self-start">
          <div className="p-3 bg-[#f5f5ee] text-[10px] text-[#6f7e75] font-bold uppercase tracking-wider">
            CONFIGURATION CONSOLE
          </div>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between p-3.5 text-xs text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#101512] text-[#fbfbfa] font-bold'
                    : 'text-[#525f56] hover:bg-[#f5f5ee] hover:text-[#101512]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#059669]' : 'text-[#8e9e94]'}`} />
                  <span>{tab.label}</span>
                </div>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />}
              </button>
            );
          })}
        </div>

        {/* Content Viewport (8 cols) */}
        <div className="lg:col-span-8 border border-[#e2e2d8] bg-[#fbfbfa] p-6 lg:p-8">
          {/* TAB 1: ACCOUNT PROFILE */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-[#e2e2d8]">
                <h3 className="text-lg font-bold text-[#101512] font-editorial uppercase">
                  OPERATOR CREDENTIALS &amp; PROFILE
                </h3>
                <p className="text-xs text-[#525f56] font-sans mt-0.5">
                  Personal operator information, dispatch phone number, and access credentials.
                </p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#6f7e75] mb-1.5 uppercase font-bold text-[10px]">
                      OPERATOR FULL NAME
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full bg-[#fbfbfa] border border-[#dcdcd2] px-3 py-2 text-[#101512] focus:border-[#059669] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[#6f7e75] mb-1.5 uppercase font-bold text-[10px]">
                      ENTERPRISE EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full bg-[#fbfbfa] border border-[#dcdcd2] px-3 py-2 text-[#101512] focus:border-[#059669] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[#6f7e75] mb-1.5 uppercase font-bold text-[10px]">
                      JOB ROLE &amp; DESIGNATION
                    </label>
                    <input
                      type="text"
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      className="w-full bg-[#fbfbfa] border border-[#dcdcd2] px-3 py-2 text-[#101512] focus:border-[#059669] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[#6f7e75] mb-1.5 uppercase font-bold text-[10px]">
                      EMERGENCY SMS DISPATCH NUMBER
                    </label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full bg-[#fbfbfa] border border-[#dcdcd2] px-3 py-2 text-[#101512] focus:border-[#059669] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#e2e2d8] flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>SAVE PROFILE CREDENTIALS</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: ORGANIZATION */}
          {activeTab === 'organization' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-[#e2e2d8]">
                <h3 className="text-lg font-bold text-[#101512] font-editorial uppercase">
                  ENTERPRISE GROUP &amp; DISCOM ACCOUNT
                </h3>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#6f7e75] mb-1 uppercase font-bold text-[10px]">PARENT GROUP</label>
                  <input
                    type="text"
                    defaultValue={profile.organization}
                    className="w-full bg-[#fbfbfa] border border-[#dcdcd2] px-3 py-2 text-[#101512]"
                  />
                </div>
                <div>
                  <label className="block text-[#6f7e75] mb-1 uppercase font-bold text-[10px]">DIVISION / BUSINESS UNIT</label>
                  <input
                    type="text"
                    defaultValue={profile.department}
                    className="w-full bg-[#fbfbfa] border border-[#dcdcd2] px-3 py-2 text-[#101512]"
                  />
                </div>
                <div>
                  <label className="block text-[#6f7e75] mb-1 uppercase font-bold text-[10px]">DISCOM CONSUMER ID (HT-2a)</label>
                  <input
                    type="text"
                    defaultValue="BESCOM-HT2A-9948210384"
                    className="w-full bg-[#fbfbfa] border border-[#dcdcd2] px-3 py-2 text-[#101512]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#e2e2d8] flex justify-end">
                <button
                  onClick={onSaveNotification}
                  className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  SAVE ORGANIZATION
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: HARDWARE GATEWAYS */}
          {activeTab === 'facilities' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-[#e2e2d8]">
                <h3 className="text-lg font-bold text-[#101512] font-editorial uppercase">
                  SUBMETER GATEWAYS &amp; SENSORS
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { name: 'Gateway GW-BLR-01', ip: '10.24.10.15', proto: 'Modbus RTU RS-485', status: 'Online' },
                  { name: 'Gateway GW-PNE-02', ip: '10.24.20.12', proto: 'BACnet/IP Ethernet', status: 'Online' },
                  { name: 'Gateway GW-GGN-03', ip: '10.24.30.08', proto: 'LoRaWAN Private Gateway', status: 'Online' },
                  { name: 'Gateway GW-CHN-04', ip: '10.24.40.22', proto: 'MQTT Broker IoT', status: 'Online' },
                  { name: 'Gateway GW-HYD-05', ip: '10.24.50.19', proto: 'Modbus TCP', status: 'Online' },
                ].map((gw, idx) => (
                  <div key={idx} className="p-4 bg-[#f5f5ee] border border-[#dcdcd2] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#101512]">{gw.name}</span>
                      <span className="text-[10px] text-[#6f7e75] block">{gw.ip} · {gw.proto}</span>
                    </div>
                    <span className="text-[10px] text-[#059669] font-bold bg-[#f0fdf4] border border-[#86efac] px-2 py-0.5">
                      {gw.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ENERGY PREFERENCES */}
          {activeTab === 'energy' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-[#e2e2d8]">
                <h3 className="text-lg font-bold text-[#101512] font-editorial uppercase">
                  TARIFF &amp; DEMAND THRESHOLDS
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div>
                  <label className="block text-[#6f7e75] mb-1 uppercase font-bold text-[10px]">
                    PEAK WARNING THRESHOLD (%)
                  </label>
                  <input
                    type="number"
                    value={peakThresholdPercent}
                    onChange={(e) => setPeakThresholdPercent(Number(e.target.value))}
                    className="w-full bg-[#fbfbfa] border border-[#dcdcd2] px-3 py-2 text-[#101512]"
                  />
                  <span className="text-[10px] text-[#6f7e75] mt-1 block">Warning at {peakThresholdPercent}% of sanctioned contract cap</span>
                </div>

                <div>
                  <label className="block text-[#6f7e75] mb-1 uppercase font-bold text-[10px]">
                    MONTHLY ELECTRICITY BUDGET (INR)
                  </label>
                  <input
                    type="number"
                    value={monthlyBudgetInr}
                    onChange={(e) => setMonthlyBudgetInr(Number(e.target.value))}
                    className="w-full bg-[#fbfbfa] border border-[#dcdcd2] px-3 py-2 text-[#101512]"
                  />
                </div>

                <div>
                  <label className="block text-[#6f7e75] mb-1 uppercase font-bold text-[10px]">
                    ANNUAL RENEWABLE TARGET (%)
                  </label>
                  <input
                    type="number"
                    value={renewableTargetPercent}
                    onChange={(e) => setRenewableTargetPercent(Number(e.target.value))}
                    className="w-full bg-[#fbfbfa] border border-[#dcdcd2] px-3 py-2 text-[#101512]"
                  />
                </div>

                <div>
                  <label className="block text-[#6f7e75] mb-1 uppercase font-bold text-[10px]">
                    BASE COMMERCIAL TARIFF (₹/kWh)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={baseTariffRate}
                    onChange={(e) => setBaseTariffRate(Number(e.target.value))}
                    className="w-full bg-[#fbfbfa] border border-[#dcdcd2] px-3 py-2 text-[#101512]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#e2e2d8] flex justify-end">
                <button
                  onClick={onSaveNotification}
                  className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  SAVE THRESHOLDS
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-[#e2e2d8]">
                <h3 className="text-lg font-bold text-[#101512] font-editorial uppercase">
                  INCIDENT NOTIFICATION POLICIES
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-4 bg-[#f5f5ee] border border-[#dcdcd2] cursor-pointer">
                  <div>
                    <span className="font-bold text-[#101512] block">Critical Overload Push Alerts</span>
                    <span className="text-[10px] text-[#6f7e75]">Immediate push when facility crosses 90% demand cap</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={criticalPush}
                    onChange={(e) => setCriticalPush(e.target.checked)}
                    className="w-4 h-4 accent-[#059669]"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-[#f5f5ee] border border-[#dcdcd2] cursor-pointer">
                  <div>
                    <span className="font-bold text-[#101512] block">Emergency SMS Dispatch</span>
                    <span className="text-[10px] text-[#6f7e75]">Send SMS to {profile.phone} for Critical events</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="w-4 h-4 accent-[#059669]"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-[#f5f5ee] border border-[#dcdcd2] cursor-pointer">
                  <div>
                    <span className="font-bold text-[#101512] block">Daily Morning Digest</span>
                    <span className="text-[10px] text-[#6f7e75]">Executive email summary of solar generation and costs</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={dailyDigest}
                    onChange={(e) => setDailyDigest(e.target.checked)}
                    className="w-4 h-4 accent-[#059669]"
                  />
                </label>

                <div>
                  <label className="block text-[#6f7e75] mb-1 uppercase font-bold text-[10px]">
                    INCIDENT WEBHOOK (SLACK / TEAMS)
                  </label>
                  <input
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full bg-[#fbfbfa] border border-[#dcdcd2] px-3 py-2 text-[#101512]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#e2e2d8] flex justify-end">
                <button
                  onClick={onSaveNotification}
                  className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  SAVE POLICIES
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: AI PREFERENCES */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-[#e2e2d8]">
                <h3 className="text-lg font-bold text-[#101512] font-editorial uppercase">
                  AI OPTIMIZATION POLICIES
                </h3>
              </div>

              <div className="space-y-4 text-xs">
                <label className="flex items-center justify-between p-4 bg-[#f5f5ee] border border-[#dcdcd2] cursor-pointer">
                  <div>
                    <span className="font-bold text-[#101512] block">Autonomous BMS Setpoint Float</span>
                    <span className="text-[10px] text-[#6f7e75]">Allow AI to adjust chiller setpoint without manual approval</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoApplyBms}
                    onChange={(e) => setAutoApplyBms(e.target.checked)}
                    className="w-4 h-4 accent-[#059669]"
                  />
                </label>

                <div>
                  <label className="block text-[#6f7e75] mb-1 uppercase font-bold text-[10px]">
                    MINIMUM MODEL CONFIDENCE CUTOFF (%)
                  </label>
                  <input
                    type="number"
                    value={confidenceCutoff}
                    onChange={(e) => setConfidenceCutoff(Number(e.target.value))}
                    className="w-full bg-[#fbfbfa] border border-[#dcdcd2] px-3 py-2 text-[#101512]"
                  />
                  <span className="text-[10px] text-[#6f7e75] mt-1 block">Only display recommendations with &gt;= {confidenceCutoff}% confidence</span>
                </div>

                <div>
                  <label className="block text-[#6f7e75] mb-1 uppercase font-bold text-[10px]">
                    PRE-COOLING LEAD TIME (MINUTES PRIOR TO TOD PEAK)
                  </label>
                  <input
                    type="number"
                    value={preCoolingLeadTime}
                    onChange={(e) => setPreCoolingLeadTime(Number(e.target.value))}
                    className="w-full bg-[#fbfbfa] border border-[#dcdcd2] px-3 py-2 text-[#101512]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#e2e2d8] flex justify-end">
                <button
                  onClick={onSaveNotification}
                  className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  SAVE AI SETTINGS
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-[#e2e2d8]">
                <h3 className="text-lg font-bold text-[#101512] font-editorial uppercase">
                  SECURITY &amp; ACCESS TOKENS
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 bg-[#f5f5ee] border border-[#dcdcd2] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#101512] block">Two-Factor Authentication (TOTP)</span>
                    <span className="text-[10px] text-[#059669]">Enforced for Root Administrator</span>
                  </div>
                  <span className="text-[10px] text-[#059669] font-bold bg-[#f0fdf4] border border-[#86efac] px-2 py-0.5">
                    ENFORCED
                  </span>
                </div>

                <div className="p-4 bg-[#f5f5ee] border border-[#dcdcd2] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#101512] block">SCADA Telemetry API Token</span>
                    <span className="text-[10px] text-[#6f7e75]">gg_live_tok_99182348••••••••</span>
                  </div>
                  <button
                    onClick={onSaveNotification}
                    className="px-2.5 py-1 text-xs font-bold text-[#101512] border border-[#dcdcd2] hover:border-[#101512] transition-colors cursor-pointer"
                  >
                    ROTATE KEY
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: INTEGRATIONS */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-[#e2e2d8]">
                <h3 className="text-lg font-bold text-[#101512] font-editorial uppercase">
                  SCADA &amp; BUILDING PROTOCOLS
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { name: 'Modbus TCP / RTU Gateway', status: 'Connected', ping: '12ms', desc: 'Active RS-485 Submeters polling at 1-sec intervals' },
                  { name: 'BACnet/IP BMS Controller', status: 'Connected', ping: '18ms', desc: 'Honeywell / Johnson Controls Chiller loops' },
                  { name: 'OpenADR 2.0b Demand Response', status: 'Active', ping: '35ms', desc: 'Discom Automated Peak Shaving dispatch listener' },
                  { name: 'MQTT Enterprise Broker', status: 'Connected', ping: '8ms', desc: 'Rooftop Inverter string telemetry ingest' },
                ].map((proto, idx) => (
                  <div key={idx} className="p-4 bg-[#f5f5ee] border border-[#dcdcd2] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#101512]">{proto.name}</span>
                      <span className="text-[10px] text-[#6f7e75] block">{proto.desc}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#059669] font-bold bg-[#f0fdf4] border border-[#86efac] px-2 py-0.5">
                        {proto.status}
                      </span>
                      <span className="text-[10px] text-[#6f7e75] block mt-0.5">{proto.ping}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
