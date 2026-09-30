import React from 'react';
import {
  ArrowRight,
  Zap,
  SunMedium,
  Building2,
  TrendingDown,
  ShieldCheck,
  Activity,
  Layers,
  CheckCircle2,
  Cpu,
  BarChart3,
  Receipt,
  FileCheck2,
  Sparkles,
  Radio,
  ExternalLink,
  BatteryCharging,
  Gauge,
  MapPin,
} from 'lucide-react';
import { Logo } from '../common/Logo';

export const LandingPage = ({
  onNavigate,
  onSelectFacilityDetail,
  facilities,
}) => {
  return (
    <div className="w-full bg-[#f7f8fa] text-slate-800 font-sans selection:bg-emerald-700 selection:text-white">
      {/* ========================================================
          HERO SECTION
          ======================================================== */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-28 border-b border-slate-200/60 overflow-hidden hero-gradient">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] orb orb-green opacity-40" />
        <div className="absolute -bottom-32 -left-20 w-[400px] h-[400px] orb orb-teal opacity-25" />
        
        {/* Subtle geometric grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(16, 185, 129, 0.1) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Live Telemetry Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200/60 text-emerald-800 text-sm font-semibold mb-6 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 signal-pulse" />
              <span>Smart Energy Management Information System (EMIS)</span>
              <span className="text-emerald-300">·</span>
              <span className="text-emerald-600 font-normal">v2.4 Live Telemetry</span>
            </div>

            {/* Main Headline (48-64px desktop hierarchy) */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 tracking-tight leading-[1.08]">
              Intelligent energy management for modern <span className="text-gradient-green">sustainable enterprise.</span>
            </h1>

            {/* Description (18-20px hierarchy) */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-2xl">
              GreenGrid unifies real-time IoT power telemetry, rooftop solar arrays, and automated utility tariff optimization across multi-campus facilities—eliminating peak demand penalties and accelerating clean energy transition.
            </p>

            {/* Call to Actions (Standardized 15-16px buttons) */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="btn-primary group"
              >
                <span>Launch Live Platform</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onNavigate('facilities')}
                className="btn-secondary"
              >
                <Building2 className="w-4 h-4 text-green-700" />
                <span>Explore 5 Monitored Campuses</span>
              </button>

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
              >
                <span>How It Works</span>
                <span className="text-slate-400">↓</span>
              </a>
            </div>
          </div>

          {/* Environmental Hero Visual with Live Telemetry Overlay */}
          <div className="mt-12 lg:mt-16 relative rounded-2xl overflow-hidden border border-slate-200/60 bg-white" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)' }}>
            <div className="relative aspect-16/9 sm:aspect-21/9 max-h-[540px] w-full overflow-hidden bg-slate-100">
              <img
                src="/images/greengrid_hero_solar.jpg"
                alt="GreenGrid Monitored Sustainable Campus with Solar Photovoltaic Rooftop and Modern Architecture"
                className="w-full h-full object-cover object-center"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />

              {/* Floating Handcrafted Telemetry HUD Cards */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto max-w-xl">
                <div className="bg-white/90 backdrop-blur-xl rounded-xl p-4 sm:p-5 border border-white/40 text-slate-900" style={{ boxShadow: '0 12px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.5)' }}>
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-600 signal-pulse" />
                      <span className="text-sm font-bold uppercase tracking-wider text-slate-900">
                        Bangalore Tech Park Campus
                      </span>
                    </div>
                    <span className="text-xs font-mono font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      Active Telemetry Loop
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 sm:gap-6 text-sm">
                    <div>
                      <div className="text-slate-500 font-medium text-sm">Real-Time Draw</div>
                      <div className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">412.8 kW</div>
                    </div>
                    <div>
                      <div className="text-slate-500 font-medium text-sm">Solar Generation</div>
                      <div className="text-base sm:text-lg font-bold text-green-700 tabular-nums">148.0 kWp</div>
                    </div>
                    <div>
                      <div className="text-slate-500 font-medium text-sm">Renewable Share</div>
                      <div className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">35.8%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Jump Action Tag */}
              <div className="hidden sm:block absolute top-4 right-4">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-slate-900/80 hover:bg-slate-900 text-white text-sm font-medium backdrop-blur-xs transition-colors cursor-pointer"
                >
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Open Real-Time Console</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar Under Image */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100/80 bg-white border-t border-slate-100 p-4 sm:p-6 text-center sm:text-left">
              <div className="p-3 sm:px-6">
                <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">₹18.5L+</div>
                <div className="text-sm text-slate-500 mt-1 font-medium">Verified Monthly Savings</div>
              </div>
              <div className="p-3 sm:px-6">
                <div className="text-2xl sm:text-4xl font-extrabold text-emerald-600 tracking-tight">28.4%</div>
                <div className="text-sm text-slate-500 mt-1 font-medium">Avg. Peak Demand Reduction</div>
              </div>
              <div className="p-3 sm:px-6">
                <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">1,240 T</div>
                <div className="text-sm text-slate-500 mt-1 font-medium">Annual CO₂e Abated</div>
              </div>
              <div className="p-3 sm:px-6">
                <div className="text-2xl sm:text-4xl font-extrabold text-emerald-600 tracking-tight">99.8%</div>
                <div className="text-sm text-slate-500 mt-1 font-medium">Submeter Telemetry Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 1: INTRODUCTION / WHAT IS GREENGRID?
          ======================================================== */}
      <section id="about" className="py-16 sm:py-24 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Vision & Problem */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 text-sm font-bold text-green-700 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-green-600" />
                <span>What is GreenGrid</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Closing the gap between utility meters and <span className="text-gradient-green">building automation.</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                Most commercial facilities receive a monthly utility bill 30 days after peak power was drawn—far too late to prevent expensive Time-of-Day (TOD) penalties or correct un-tuned chiller loops.
              </p>
              <p className="text-base text-slate-600 leading-relaxed font-normal">
                GreenGrid acts as an intelligent operating layer over your existing electrical infrastructure. By streaming submeter readings every 15 minutes, predicting tariff spikes, and dispatching automated setpoint rules, facility teams maintain uninterrupted occupant comfort while systematically cutting operational expenditures.
              </p>

              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="btn-primary"
                >
                  <span>View Live Demonstration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Architectural Visual of Smart Commercial Infrastructure */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/60 bg-slate-50" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                <img
                  src="/images/greengrid_smart_hvac_building.jpg"
                  alt="Modern commercial enterprise campus equipped with rooftop smart chillers and solar arrays"
                  className="w-full h-auto object-cover"
                />
                <div className="p-4 sm:p-5 bg-white border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Commercial Chiller & Submeter Plant</h4>
                    <p className="text-sm text-slate-500 mt-0.5">Automated BACnet & Modbus loop telemetry</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    99.8% Uptime
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Functional Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            <div className="p-6 rounded-xl border border-slate-200/80 bg-white hover:border-emerald-300/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/80 border border-emerald-200/60 flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Sub-Second IoT Telemetry</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Ingests Modbus and BACnet telemetry across switchgear, HVAC chillers, transformers, and UPS feeds with zero sensor lock-in.
              </p>
              <div className="mt-4 text-sm font-semibold text-emerald-600">
                Active kW, kVA, PF & harmonics
              </div>
            </div>

            <div className="p-6 rounded-xl border border-slate-200/80 bg-white hover:border-emerald-300/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/80 border border-emerald-200/60 flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
                <TrendingDown className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Automated Peak Shaving</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Forecasts afternoon demand surges before they breach sanctioned contract caps, automatically triggering thermal pre-cooling and pump staging.
              </p>
              <div className="mt-4 text-sm font-semibold text-emerald-600">
                Prevents DISCOM demand penalties
              </div>
            </div>

            <div className="p-6 rounded-xl border border-slate-200/80 bg-white hover:border-emerald-300/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/80 border border-emerald-200/60 flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
                <SunMedium className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Solar & Microgrid Dispatch</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Tracks individual string inverter yields and optimizes self-consumption versus grid export to maximize net-metering tariff credits.
              </p>
              <div className="mt-4 text-sm font-semibold text-green-700">
                Real-time yield & PR ratio tracking
              </div>
            </div>

            <div className="p-6 rounded-xl border border-slate-200/80 bg-white hover:border-emerald-300/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/80 border border-emerald-200/60 flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Utility Bill Reconciliation</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Cross-checks monthly DISCOM statements line-by-line against measured interval units, catching tariff tier misclassifications and unbilled credits.
              </p>
              <div className="mt-4 text-sm font-semibold text-green-700">
                Audit-ready PDF statement verification
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 2: KEY PLATFORM CAPABILITIES
          ======================================================== */}
      <section id="features" className="py-16 sm:py-24 bg-[#f7f8fa] border-b border-slate-200/60 gradient-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-green-700 uppercase tracking-wider">
              <span>Platform Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              Engineered for facility managers and <span className="text-gradient-green">energy auditors.</span>
            </h2>
            <p className="text-base text-slate-600 mt-3 leading-relaxed">
              Every tool within GreenGrid was designed to provide actionable insight, from the central substation bus to individual secondary loop pumps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/80 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shadow-sm">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-mono text-slate-500">Live Console</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Real-Time Load & Demand Curves</h3>
                <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                  High-fidelity 24-hour load profiles contrasting actual demand against baseline predictions. Identify abnormal baseload draws during off-hours with instant anomaly detection.
                </p>
                <div className="mt-4 p-3.5 bg-slate-50 rounded-md border border-slate-100 text-sm text-slate-600 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Sanctioned Load Cap:</span>
                    <span className="font-bold text-slate-900">450.0 kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Margin:</span>
                    <span className="font-bold text-green-700">37.2 kW buffer</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('dashboard')}
                className="mt-6 flex items-center justify-between text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors pt-3 border-t border-slate-100 cursor-pointer"
              >
                <span>Explore Live Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/80 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shadow-sm">
                    <SunMedium className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-mono text-slate-500">Renewable OS</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Rooftop Solar Array Analytics</h3>
                <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                  Monitor 12 string inverters across your commercial rooftops. Spot dust accumulation, DC string voltage dips, and inverter clipping before they impact your monthly solar yield.
                </p>
                <div className="mt-4 p-3.5 bg-slate-50 rounded-md border border-slate-100 text-sm text-slate-600 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Daily Solar Yield:</span>
                    <span className="font-bold text-green-700">2,380 kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Performance Ratio (PR):</span>
                    <span className="font-bold text-slate-900">81.4% Optimal</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('renewable')}
                className="mt-6 flex items-center justify-between text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors pt-3 border-t border-slate-100 cursor-pointer"
              >
                <span>View Solar Telemetry</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/80 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shadow-sm">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-mono text-slate-500">Tariff Engine</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">DISCOM Bill Reconciliation</h3>
                <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                  Commercial electricity bills are fraught with calculation errors. GreenGrid automatically audits monthly statements against smart meter logs, itemizing peak surcharges and credits.
                </p>
                <div className="mt-4 p-3.5 bg-slate-50 rounded-md border border-slate-100 text-sm text-slate-600 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Current Invoice:</span>
                    <span className="font-bold text-slate-900">₹3,42,800</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Solar Credit Applied:</span>
                    <span className="font-bold text-green-700">-₹72,400</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('billing')}
                className="mt-6 flex items-center justify-between text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors pt-3 border-t border-slate-100 cursor-pointer"
              >
                <span>Review Invoices & Tariffs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Secondary feature row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex items-start gap-4 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/80 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">BACnet BMS Automation & Recommendations</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Instead of generic tips, GreenGrid delivers actionable dispatch rules. Pre-cool building thermal mass prior to 14:00 TOD peak tariff windows or adjust condenser water loops with one click.
                </p>
                <button
                  onClick={() => onNavigate('recommendations')}
                  className="mt-4 text-sm font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Recommendation Engine</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex items-start gap-4 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/80 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">Multi-Facility Portfolio Benchmarking</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Compare energy intensity (kWh/sq ft) across campuses in Bangalore, Pune, Gurugram, Hyderabad, and Chennai. Identify underperforming sites and standardize best operational practices.
                </p>
                <button
                  onClick={() => onNavigate('facilities')}
                  className="mt-4 text-sm font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Compare Enrolled Facilities</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 3: HOW GREENGRID WORKS & BESS STORAGE
          ======================================================== */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-green-700 uppercase tracking-wider">
              <span>Operational Pipeline</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              How GreenGrid coordinates your <span className="text-gradient-green">facility energy flow.</span>
            </h2>
            <p className="text-base text-slate-600 mt-3 leading-relaxed">
              From physical submeters to automated setpoint feedback loops, here is how intelligence flows through the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-6 hover:border-emerald-300/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                  01
                </span>
                <span className="text-xs uppercase font-bold text-slate-500">Edge Ingest</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Edge Gateway Ingestion</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Compact IoT edge bridges connect directly to electrical distribution boards, solar string combiners, and BACnet/IP building systems over secure Modbus protocols.
              </p>
              <div className="mt-4 text-sm text-emerald-600 font-semibold">
                ✓ 15-minute telemetry intervals
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-6 hover:border-green-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                  02
                </span>
                <span className="text-xs uppercase font-bold text-slate-500">Demand Modeling</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Tariff & Peak Forecasting</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Calculates ongoing baseline load models and cross-references regional utility Time-of-Day tariff schedules to detect spike risks hours in advance.
              </p>
              <div className="mt-4 text-sm text-emerald-600 font-semibold">
                ✓ Predicts afternoon peak surge
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-6 hover:border-green-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                  03
                </span>
                <span className="text-xs uppercase font-bold text-slate-500">BMS Dispatch</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Closed-Loop BMS Dispatch</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Broadcasts thermal setpoints to chillers, floats fan VFD frequencies, and switches capacitor banks automatically to maintain a 0.98 power factor.
              </p>
              <div className="mt-4 text-sm text-emerald-600 font-semibold">
                ✓ One-click or auto-execution
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-6 hover:border-green-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                  04
                </span>
                <span className="text-xs uppercase font-bold text-slate-500">Audit & ESG</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Reconcile & ESG Accounting</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Exports auditable utility statement reconciliations and verifiable Scope 2 carbon emission records compliant with ISO 50001 and ASHRAE guidelines.
              </p>
              <div className="mt-4 text-sm text-emerald-600 font-semibold">
                ✓ Audit-grade compliance logs
              </div>
            </div>
          </div>

          {/* Integrated BESS Battery Storage Showcase */}
          <div className="mt-12 rounded-2xl border border-slate-700/30 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-6 p-6 sm:p-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-950/80 border border-green-500/50 text-emerald-400 text-sm font-semibold">
                  <BatteryCharging className="w-4 h-4" />
                  <span>Microgrid & Battery Storage Integration</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold !text-white tracking-tight">
                  Seamless coordination with Utility BESS Battery Containers.
                </h3>
                <p className="text-slate-300 text-base leading-relaxed">
                  During solar peak mid-day windows, excess PV yield is intelligently routed to onsite battery storage systems, then discharged precisely during DISCOM peak tariff hours (18:00–22:00) to keep grid draw below contract penalty limits.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('renewable')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold text-sm transition-colors cursor-pointer"
                  >
                    <span>Inspect Renewable & BESS Telemetry</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="lg:col-span-6 h-full min-h-[300px] overflow-hidden">
                <img
                  src="/images/greengrid_bess_battery_storage.jpg"
                  alt="Utility scale BESS battery storage container integrated in commercial campus"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 4: ENVIRONMENTAL & ENERGY IMPACT
          ======================================================== */}
      <section id="impact" className="py-16 sm:py-24 bg-[#f7f8fa] border-b border-slate-200/60 gradient-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/60" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                <img
                  src="/images/greengrid_clean_grid_tech.jpg"
                  alt="Certified Energy Engineer Inspecting Commercial Solar Array and Telemetry Inverters"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-xs text-white p-4 rounded-lg text-sm">
                  <span className="font-semibold text-emerald-300">Sustainable Infrastructure Telemetry:</span>{' '}
                  <span className="text-slate-200">
                    Real-time field verification guarantees verified carbon offsets match actual generated kilowatt-hours.
                  </span>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 text-sm font-bold text-green-700 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-green-600" />
                <span>Environmental & Economic Impact</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Decarbonization that <span className="text-gradient-green">pays for itself</span> from month one.
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Sustainability goals often stall when ROI cannot be demonstrated to financial leadership. GreenGrid bridges the gap by linking carbon accounting directly with utility bill savings.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-base font-bold text-slate-900">Direct Avoidance of Fossil Peaker Plants:</strong>
                    <p className="text-sm text-slate-600 mt-1">
                      By shaving peak demand between 14:00 and 18:00, facilities reduce strain on carbon-intensive thermal peaking power stations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-base font-bold text-slate-900">Maximum Utilization of Onsite Solar PV:</strong>
                    <p className="text-sm text-slate-600 mt-1">
                      Coordinating battery storage and HVAC chilled water loops ensures 100% of generated solar energy is consumed within the campus rather than lost to grid curtailment.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-base font-bold text-slate-900">Verified Scope 2 ESG Compliance:</strong>
                    <p className="text-sm text-slate-600 mt-1">
                      Every kWh logged is cryptographically timestamped for compliance with corporate GHG protocol audits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 5: 5 MONITORED FACILITIES PORTFOLIO SHOWCASE
          ======================================================== */}
      <section id="portfolio" className="py-16 sm:py-24 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-bold text-green-700 uppercase tracking-wider mb-2">
                <Building2 className="w-4 h-4" />
                <span>Multi-Campus Network</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Live Enrolled Facilities
              </h2>
              <p className="text-base text-slate-600 mt-2 max-w-xl">
                Explore real-time telemetry, solar generation, and tariff performance across 5 active commercial campuses.
              </p>
            </div>
            <button
              onClick={() => onNavigate('facilities')}
              className="btn-secondary self-start md:self-auto"
            >
              <span>View All Campuses</span>
              <ArrowRight className="w-4 h-4 text-green-700" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.slice(0, 3).map((f) => (
              <div
                key={f.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:border-emerald-300/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}  
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded">
                      <MapPin className="w-3.5 h-3.5 text-green-700" />
                      <span>{f.location}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-green-600 signal-pulse" />
                      <span>Online</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1">{f.name}</h3>
                  <p className="text-sm text-slate-500 mb-4 font-mono">{f.floorAreaSqFt.toLocaleString()} sq ft · {f.type}</p>

                  <div className="grid grid-cols-2 gap-3 p-3.5 bg-white rounded-md border border-slate-200 text-sm mb-4">
                    <div>
                      <div className="text-slate-500 font-medium">Real-Time Draw</div>
                      <div className="text-base font-bold text-slate-900 tabular-nums">{f.currentConsumptionKw} kW</div>
                    </div>
                    <div>
                      <div className="text-slate-500 font-medium">Solar Array</div>
                      <div className="text-base font-bold text-green-700 tabular-nums">{f.solarCapacityKwp} kWp</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-sm text-slate-600 font-medium">
                    Peak Cap: <span className="font-bold text-slate-900">{f.peakThresholdKw} kW</span>
                  </span>
                  <button
                    onClick={() => {
                      if (onSelectFacilityDetail) {
                        onSelectFacilityDetail(f.id);
                      } else {
                        onNavigate('facility-detail');
                      }
                    }}
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Detail</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 6: FINAL CTA
          ======================================================== */}
      <section className="py-16 sm:py-24 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 30%, #047857 60%, #059669 100%)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-semibold text-emerald-200 backdrop-blur-xs">
            <Radio className="w-4 h-4 signal-pulse" />
            <span>Ready for Immediate Deployment</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Experience real-time facility energy intelligence today.
          </h2>

          <p className="text-base sm:text-lg text-green-100 max-w-2xl mx-auto font-normal leading-relaxed">
            Access the live console now to explore real-time telemetry curves, solar string diagnostics, and automated tariff recommendations across 5 operational campuses.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 font-bold text-base shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2 group"
            >
              <span>Launch Live System Console</span>
              <ArrowRight className="w-4 h-4 text-emerald-700 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              onClick={() => onNavigate('facilities')}
              className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-base transition-all cursor-pointer backdrop-blur-xs"
            >
              <span>View All 5 Enrolled Facilities</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 7: CLEAN FOOTER
          ======================================================== */}
      <footer className="bg-slate-900 text-slate-400 text-sm py-12 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            {/* Column 1: Brand */}
            <div className="md:col-span-1 space-y-3">
              <Logo variant="light" size="md" />
              <p className="text-slate-400 text-sm leading-relaxed mt-2">
                Enterprise Energy Management Information System (EMIS) for industrial facilities, corporate campuses, and smart microgrids.
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded">
                <span className="w-2 h-2 rounded-full bg-emerald-400 signal-pulse" />
                <span>All Telemetry Bridges Online</span>
              </div>
            </div>

            {/* Column 2: Platform Navigation */}
            <div>
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">
                Live Platform
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Enterprise Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('facilities')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Campus Facilities
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('analytics')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Energy Analytics & Load
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('billing')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    DISCOM Utility Billing
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('renewable')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Rooftop Solar & Microgrids
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Platform Capabilities */}
            <div>
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">
                Intelligence Tools
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => onNavigate('alerts')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Telemetry Anomaly Alerts
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('recommendations')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    BMS Automation Rules
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('settings')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Tariff & Threshold Settings
                  </button>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-white transition-colors">
                    Hardware Edge Architecture
                  </a>
                </li>
                <li>
                  <a href="#impact" className="hover:text-white transition-colors">
                    Environmental ESG Accounting
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Standards & Compliance */}
            <div>
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">
                Protocol & Standards
              </h4>
              <div className="space-y-2.5 text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>ASHRAE Standard 90.1 Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>ISO 50001 Energy Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>BACnet/IP & Modbus RTU Compatible</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>GHG Protocol Scope 2 Auditable</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-sm">
            <div>© {new Date().getFullYear()} GreenGrid EMIS. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <span>Security Policy</span>
              <span>·</span>
              <span>Telemetry SLA (99.8%)</span>
              <span>·</span>
              <span>DISCOM Grid Interconnect</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
