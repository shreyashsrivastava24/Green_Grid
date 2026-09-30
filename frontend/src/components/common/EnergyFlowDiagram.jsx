import React, { useState } from 'react';
import { Zap } from 'lucide-react';

export const EnergyFlowDiagram = ({
  totalDemandKw = 1866.0,
  gridDrawKw = 1385.0,
  solarGenKw = 481.0,
  sanctionedLimitKw = 2100.0,
  renewablePercent = 34.2,
  onSelectNode,
}) => {
  const [activeBranch, setActiveBranch] = useState('all');

  const branches = {
    all: {
      label: 'CONSOLIDATED ENERGY NETWORK',
      desc: 'Real-time power balancing between 11kV commercial utility grid, 450 kWp rooftop solar, and on-site BESS buffer.',
      metrics: [
        { k: 'Net Demand', v: `${totalDemandKw.toFixed(1)} kW` },
        { k: 'Renewable Share', v: `${renewablePercent}% Clean Offset` },
        { k: 'Grid Draw', v: `${gridDrawKw.toFixed(1)} kW` },
        { k: 'Sanctioned Limit', v: `${sanctionedLimitKw} kW` },
      ],
    },
    grid: {
      label: '11kV COMMERCIAL UTILITY INCOMER',
      desc: 'High tension feeder lines #01 and #02 from state electricity distribution grid.',
      metrics: [
        { k: 'Current Draw', v: `${gridDrawKw.toFixed(1)} kW` },
        { k: 'Power Factor', v: '0.94 Lagging' },
        { k: 'Grid Frequency', v: '50.02 Hz · NOMINAL' },
        { k: 'TOD Tariff Rate', v: '₹11.20 / kWh (Peak)' },
      ],
    },
    solar: {
      label: '450 kWp DISTRIBUTED ROOFTOP SOLAR PV',
      desc: '12 inverter strings feeding directly into localized 415V secondary switchgear bus.',
      metrics: [
        { k: 'Instant PV Yield', v: `${solarGenKw.toFixed(1)} kW` },
        { k: 'Solar Irradiance', v: '890 W/m²' },
        { k: 'Today Generated', v: '1,840 kWh' },
        { k: 'Inverter Efficiency', v: '95.4% Fleet Avg' },
      ],
    },
    battery: {
      label: 'BESS UTILITY BATTERY STORAGE BUFFER',
      desc: 'Lithium iron phosphate (LFP) 500 kWh storage bank for peak shaving and solar buffering.',
      metrics: [
        { k: 'Buffer Output', v: '120.0 kW Discharge' },
        { k: 'State of Charge', v: '92% Remaining' },
        { k: 'Health Cycle', v: '99.4% SOH' },
        { k: 'Peak Autonomy', v: '4.2 Hours' },
      ],
    },
    facilities: {
      label: '5 INDUSTRIAL & COMMERCIAL CAMPUSES',
      desc: 'Monitored sites: Bangalore, Pune, Gurugram, Chennai, and Hyderabad hubs.',
      metrics: [
        { k: 'Total Demand', v: `${totalDemandKw.toFixed(1)} kW` },
        { k: 'Largest Load', v: 'Pune Plant (685.2 kW)' },
        { k: 'Active Overload', v: 'Gurugram Tower (+7.2%)' },
        { k: 'Submeters', v: '42 Monitored' },
      ],
    },
  };

  const current = branches[activeBranch] || branches.all;

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200/80 p-5 lg:p-6 transition-all"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
    >
      {/* Header bar of the network canvas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 signal-pulse" />
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Live Energy Distribution Network
            </h3>
            <p className="text-xs text-slate-500">
              Real-time power routing across grid, rooftop solar, and on-site storage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-medium p-1 bg-slate-100/80 rounded-xl">
          <button
            onClick={() => setActiveBranch('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
              activeBranch === 'all'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Entire Grid
          </button>
          <button
            onClick={() => setActiveBranch('grid')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
              activeBranch === 'grid'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Utility Grid
          </button>
          <button
            onClick={() => setActiveBranch('solar')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
              activeBranch === 'solar'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Solar PV
          </button>
        </div>
      </div>

      {/* SVG Living Energy Flow Canvas */}
      <div className="w-full min-w-0 max-w-full overflow-x-auto py-3">
        <div className="min-w-[760px] lg:min-w-0">
          <svg viewBox="0 0 940 330" className="w-full h-auto select-none" style={{ maxHeight: '350px' }}>
            {/* Architectural Grid Underlay */}
            <g stroke="#f1f5f9" strokeWidth="1">
              <line x1="0" y1="70" x2="940" y2="70" />
              <line x1="0" y1="165" x2="940" y2="165" />
              <line x1="0" y1="260" x2="940" y2="260" />
              <line x1="200" y1="0" x2="200" y2="330" />
              <line x1="470" y1="0" x2="470" y2="330" />
              <line x1="720" y1="0" x2="720" y2="330" />
            </g>

            {/* FLOW PATHS & CONDUCTOR LINES */}

            {/* Path 1: GRID INCOMER -> BUS */}
            <path
              id="gridPath"
              d="M 180 70 L 340 70 L 420 165"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2.5"
              className="animate-flow-dash"
            />

            {/* Path 2: SOLAR PV -> BUS */}
            <path
              id="solarPath"
              d="M 180 165 L 420 165"
              fill="none"
              stroke="#16a34a"
              strokeWidth="3"
              className="animate-flow-dash-slow"
            />

            {/* Path 3: BATTERY STORAGE -> BUS */}
            <path
              id="batteryPath"
              d="M 180 260 L 340 260 L 420 165"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Path 4: BUS -> FACILITIES CONVERGENCE */}
            <path
              id="busToFacilities1"
              d="M 520 165 L 600 165 L 660 60 L 740 60"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2"
              className="animate-flow-dash"
            />

            <path
              id="busToFacilities2"
              d="M 520 165 L 740 165"
              fill="none"
              stroke="#d97706"
              strokeWidth="2.5"
              className="animate-flow-dash"
            />

            <path
              id="busToFacilities3"
              d="M 520 165 L 600 165 L 660 270 L 740 270"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2"
              className="animate-flow-dash"
            />

            {/* NODES */}

            {/* NODE A: UTILITY GRID */}
            <g
              className="cursor-pointer"
              onClick={() => {
                setActiveBranch('grid');
                onSelectNode?.('grid');
              }}
            >
              <rect
                x="20"
                y="30"
                width="160"
                height="80"
                rx="6"
                fill="#ffffff"
                stroke={activeBranch === 'grid' ? '#0284c7' : '#e2e8f0'}
                strokeWidth={activeBranch === 'grid' ? '2' : '1'}
              />
              <text x="35" y="55" fill="#64748b" fontSize="10" fontWeight="600" fontFamily="Arial, sans-serif">
                UTILITY GRID INCOMER
              </text>
              <text x="35" y="78" fill="#0f172a" fontSize="18" fontWeight="bold" fontFamily="Arial, sans-serif">
                {gridDrawKw.toFixed(0)} <tspan fontSize="12" fill="#64748b" fontWeight="normal">kW</tspan>
              </text>
              <text x="35" y="96" fill="#0284c7" fontSize="10" fontWeight="600" fontFamily="Arial, sans-serif">
                11kV FEEDER · 73.7% LOAD
              </text>
            </g>

            {/* NODE B: ROOFTOP SOLAR PV */}
            <g
              className="cursor-pointer"
              onClick={() => {
                setActiveBranch('solar');
                onSelectNode?.('solar');
              }}
            >
              <rect
                x="20"
                y="125"
                width="160"
                height="80"
                rx="6"
                fill="#ffffff"
                stroke={activeBranch === 'solar' ? '#16a34a' : '#e2e8f0'}
                strokeWidth={activeBranch === 'solar' ? '2' : '1'}
              />
              <text x="35" y="150" fill="#64748b" fontSize="10" fontWeight="600" fontFamily="Arial, sans-serif">
                ROOFTOP SOLAR PV
              </text>
              <text x="35" y="173" fill="#16a34a" fontSize="18" fontWeight="bold" fontFamily="Arial, sans-serif">
                {solarGenKw.toFixed(0)} <tspan fontSize="12" fill="#64748b" fontWeight="normal">kW</tspan>
              </text>
              <text x="35" y="191" fill="#16a34a" fontSize="10" fontWeight="600" fontFamily="Arial, sans-serif">
                450 kWp PERC · 34.2% SHARE
              </text>
            </g>

            {/* NODE C: BATTERY STORAGE */}
            <g
              className="cursor-pointer"
              onClick={() => {
                setActiveBranch('battery');
                onSelectNode?.('battery');
              }}
            >
              <rect
                x="20"
                y="220"
                width="160"
                height="80"
                rx="6"
                fill="#ffffff"
                stroke={activeBranch === 'battery' ? '#16a34a' : '#e2e8f0'}
                strokeWidth={activeBranch === 'battery' ? '2' : '1'}
              />
              <text x="35" y="245" fill="#64748b" fontSize="10" fontWeight="600" fontFamily="Arial, sans-serif">
                BESS BATTERY STORAGE
              </text>
              <text x="35" y="268" fill="#0f172a" fontSize="18" fontWeight="bold" fontFamily="Arial, sans-serif">
                120 <tspan fontSize="12" fill="#64748b" fontWeight="normal">kW</tspan>
              </text>
              <text x="35" y="286" fill="#16a34a" fontSize="10" fontWeight="600" fontFamily="Arial, sans-serif">
                500 kWh LFP · 92% SOC
              </text>
            </g>

            {/* CENTRAL BUS: INTELLIGENT DISPATCH HUB */}
            <g
              className="cursor-pointer"
              onClick={() => {
                setActiveBranch('all');
                onSelectNode?.('bus');
              }}
            >
              <rect
                x="410"
                y="110"
                width="110"
                height="110"
                rx="8"
                fill="#f8fafc"
                stroke={activeBranch === 'all' ? '#16a34a' : '#cbd5e1'}
                strokeWidth="2"
              />
              <circle cx="465" cy="142" r="14" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
              <Zap x="458" y="135" width="14" height="14" color="#16a34a" />
              <text x="465" y="176" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="bold" fontFamily="Arial, sans-serif">
                MAIN BUS
              </text>
              <text x="465" y="196" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="bold" fontFamily="Arial, sans-serif">
                {totalDemandKw.toFixed(0)} <tspan fontSize="10" fill="#64748b" fontWeight="normal">kW</tspan>
              </text>
              <text x="465" y="210" textAnchor="middle" fill="#16a34a" fontSize="9" fontWeight="bold" fontFamily="Arial, sans-serif">
                BALANCED
              </text>
            </g>

            {/* LOAD NODES (RIGHT SIDE) */}

            {/* LOAD 1: COMMERCIAL TECH CAMPUSES */}
            <g
              className="cursor-pointer"
              onClick={() => {
                setActiveBranch('facilities');
                onSelectNode?.('facilities');
              }}
            >
              <rect
                x="740"
                y="20"
                width="180"
                height="80"
                rx="6"
                fill="#ffffff"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text x="755" y="45" fill="#64748b" fontSize="10" fontWeight="600" fontFamily="Arial, sans-serif">
                COMMERCIAL CAMPUSES
              </text>
              <text x="755" y="68" fill="#0f172a" fontSize="17" fontWeight="bold" fontFamily="Arial, sans-serif">
                674.6 <tspan fontSize="11" fill="#64748b" fontWeight="normal">kW</tspan>
              </text>
              <text x="755" y="86" fill="#16a34a" fontSize="10" fontWeight="600" fontFamily="Arial, sans-serif">
                BANGALORE + HYDERABAD
              </text>
            </g>

            {/* LOAD 2: HEAVY INDUSTRIAL PLANT */}
            <g
              className="cursor-pointer"
              onClick={() => {
                setActiveBranch('facilities');
                onSelectNode?.('facilities');
              }}
            >
              <rect
                x="740"
                y="125"
                width="180"
                height="80"
                rx="6"
                fill="#ffffff"
                stroke="#d97706"
                strokeWidth="1.5"
              />
              <text x="755" y="150" fill="#64748b" fontSize="10" fontWeight="600" fontFamily="Arial, sans-serif">
                HEAVY MANUFACTURING
              </text>
              <text x="755" y="173" fill="#d97706" fontSize="17" fontWeight="bold" fontFamily="Arial, sans-serif">
                685.2 <tspan fontSize="11" fill="#64748b" fontWeight="normal">kW</tspan>
              </text>
              <text x="755" y="191" fill="#d97706" fontSize="10" fontWeight="600" fontFamily="Arial, sans-serif">
                PUNE PLANT · 105% CAP WARNING
              </text>
            </g>

            {/* LOAD 3: HIGH-RISE TOWER & COLD CHAIN */}
            <g
              className="cursor-pointer"
              onClick={() => {
                setActiveBranch('facilities');
                onSelectNode?.('facilities');
              }}
            >
              <rect
                x="740"
                y="230"
                width="180"
                height="80"
                rx="6"
                fill="#ffffff"
                stroke="#e11d48"
                strokeWidth="1.5"
              />
              <text x="755" y="255" fill="#64748b" fontSize="10" fontWeight="600" fontFamily="Arial, sans-serif">
                GURUGRAM + CHENNAI
              </text>
              <text x="755" y="278" fill="#e11d48" fontSize="17" fontWeight="bold" fontFamily="Arial, sans-serif">
                506.2 <tspan fontSize="11" fill="#64748b" fontWeight="normal">kW</tspan>
              </text>
              <text x="755" y="296" fill="#e11d48" fontSize="10" fontWeight="600" fontFamily="Arial, sans-serif">
                GURUGRAM BREACH (+7.2%)
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Selected Branch Inspection Telemetry Ribbon */}
      <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50/80 border border-slate-200/60 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-emerald-700 font-bold text-xs uppercase tracking-wide">
            {current.label}
          </span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="text-xs text-slate-600 truncate">
            {current.desc}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-800 shrink-0">
          {current.metrics.map((m, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="text-slate-500">{m.k}:</span>
              <span className="font-semibold text-slate-900">{m.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
