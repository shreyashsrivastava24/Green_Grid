import React, { useState } from 'react';
import { Zap } from 'lucide-react';

interface EnergyFlowDiagramProps {
  totalDemandKw?: number;
  gridDrawKw?: number;
  solarGenKw?: number;
  sanctionedLimitKw?: number;
  renewablePercent?: number;
  onSelectNode?: (nodeKey: string) => void;
}

export const EnergyFlowDiagram: React.FC<EnergyFlowDiagramProps> = ({
  totalDemandKw = 1866.0,
  gridDrawKw = 1385.0,
  solarGenKw = 481.0,
  sanctionedLimitKw = 2100.0,
  renewablePercent = 34.2,
  onSelectNode,
}) => {
  const [activeBranch, setActiveBranch] = useState<string>('all');

  const branches: Record<string, { label: string; desc: string; metrics: { k: string; v: string }[] }> = {
    all: {
      label: 'ENTIRE NETWORK CONVERGENCE',
      desc: 'Real-time power balancing between 11kV commercial grid incomer, 450 kWp rooftop solar array, and battery buffer',
      metrics: [
        { k: 'NET DEMAND', v: `${totalDemandKw.toFixed(1)} kW` },
        { k: 'RENEWABLE RATIO', v: `${renewablePercent}% Clean Offset` },
        { k: 'GRID DRAW', v: `${gridDrawKw.toFixed(1)} kW` },
        { k: 'SANCTIONED CAP', v: `${sanctionedLimitKw} kW` },
      ],
    },
    grid: {
      label: '11kV COMMERCIAL UTILITY INCOMER',
      desc: 'High tension feeder lines #01 and #02 from state electricity distribution grid',
      metrics: [
        { k: 'CURRENT DRAW', v: `${gridDrawKw.toFixed(1)} kW` },
        { k: 'POWER FACTOR', v: '0.94 Lagging' },
        { k: 'FREQUENCY', v: '50.02 Hz · NOMINAL' },
        { k: 'TOD TARIFF RATE', v: '₹11.20 / kWh (Peak)' },
      ],
    },
    solar: {
      label: '450 kWp DISTRIBUTED ROOFTOP SOLAR PV',
      desc: '12 inverter strings feeding directly into localized 415V secondary switchgear bus',
      metrics: [
        { k: 'INSTANT PV YIELD', v: `${solarGenKw.toFixed(1)} kW` },
        { k: 'IRRADIANCE', v: '890 W/m² (Peak)' },
        { k: 'TODAY HARVEST', v: '1,840 kWh' },
        { k: 'MPPT EFFICIENCY', v: '94.2% Fleet Avg' },
      ],
    },
    battery: {
      label: 'BESS UTILITY BATTERY STORAGE BUFFER',
      desc: 'Lithium iron phosphate (LFP) 500 kWh storage bank for peak shaving and solar buffering',
      metrics: [
        { k: 'BUFFER DRAW', v: '120.0 kW Discharge' },
        { k: 'STATE OF CHARGE', v: '92% Remaining' },
        { k: 'HEALTH CYCLE', v: '99.4% SOH' },
        { k: 'PEAK BACKUP', v: '4.2 Hours Autonomy' },
      ],
    },
    facilities: {
      label: '5 INDUSTRIAL & COMMERCIAL CAMPUSES',
      desc: 'Connected facilities: Bangalore, Pune, Gurugram, Chennai, and Hyderabad hubs',
      metrics: [
        { k: 'TOTAL DRAW', v: `${totalDemandKw.toFixed(1)} kW` },
        { k: 'LARGEST LOAD', v: 'Pune Plant (685.2 kW)' },
        { k: 'ACTIVE OVERLOAD', v: 'Gurugram Tower (+7.2%)' },
        { k: 'MONITORED METERS', v: '42 Submeters Active' },
      ],
    },
  };

  const current = branches[activeBranch] || branches.all;

  return (
    <div className="bg-[#ffffff] text-[#101512] rounded-xs border border-[#e2e4dc] p-5 lg:p-7 shadow-xs relative overflow-hidden font-mono">
      {/* Background technical watermark */}
      <div className="absolute top-3 right-4 text-[10px] text-[#94a3b8]/60 tracking-[0.2em] uppercase select-none pointer-events-none">
        FIG 01.1 // LIVE TRANSMISSION CIRCUIT
      </div>

      {/* Header bar of the network canvas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#e2e4dc] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#059669] signal-pulse" />
          <div>
            <h3 className="text-xs sm:text-sm font-bold tracking-[0.16em] uppercase text-[#101512]">
              LIVE ENERGY DISTRIBUTION NETWORK
            </h3>
            <p className="text-[11px] text-[#525f56] font-sans">
              Dynamic particle flow visualizing physical electricity routing across grid, solar, storage, and loads
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-[10px]">
          <button
            onClick={() => setActiveBranch('all')}
            className={`px-3 py-1 rounded-xs cursor-pointer transition-colors ${
              activeBranch === 'all'
                ? 'bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0] font-bold'
                : 'text-[#64748b] hover:text-[#101512] hover:bg-[#f1f5f9]'
            }`}
          >
            ENTIRE GRID
          </button>
          <button
            onClick={() => setActiveBranch('grid')}
            className={`px-3 py-1 rounded-xs cursor-pointer transition-colors ${
              activeBranch === 'grid'
                ? 'bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd] font-bold'
                : 'text-[#64748b] hover:text-[#101512] hover:bg-[#f1f5f9]'
            }`}
          >
            GRID INCOMER
          </button>
          <button
            onClick={() => setActiveBranch('solar')}
            className={`px-3 py-1 rounded-xs cursor-pointer transition-colors ${
              activeBranch === 'solar'
                ? 'bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0] font-bold'
                : 'text-[#64748b] hover:text-[#101512] hover:bg-[#f1f5f9]'
            }`}
          >
            SOLAR PV
          </button>
        </div>
      </div>

      {/* SVG Living Energy Flow Canvas */}
      <div className="w-full overflow-x-auto py-4">
        <div className="min-w-[760px] lg:min-w-0">
          <svg viewBox="0 0 940 330" className="w-full h-auto select-none" style={{ maxHeight: '350px' }}>
            <defs>
              <linearGradient id="solarFlowGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="gridFlowGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
            </defs>

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
            {/* Particle on Grid Path */}
            <circle r="3.5" fill="#0284c7">
              <animateMotion dur="2.2s" repeatCount="indefinite">
                <mpath href="#gridPath" />
              </animateMotion>
            </circle>

            {/* Path 2: SOLAR PV -> BUS */}
            <path
              id="solarPath"
              d="M 180 165 L 420 165"
              fill="none"
              stroke="#059669"
              strokeWidth="3"
              className="animate-flow-dash-slow"
            />
            {/* Particle on Solar Path */}
            <circle r="4" fill="#10b981">
              <animateMotion dur="1.8s" repeatCount="indefinite">
                <mpath href="#solarPath" />
              </animateMotion>
            </circle>

            {/* Path 3: BATTERY STORAGE -> BUS */}
            <path
              id="batteryPath"
              d="M 180 260 L 340 260 L 420 165"
              fill="none"
              stroke="#059669"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <circle r="3" fill="#059669">
              <animateMotion dur="2.8s" repeatCount="indefinite">
                <mpath href="#batteryPath" />
              </animateMotion>
            </circle>

            {/* Path 4: BUS -> FACILITIES CONVERGENCE */}
            <path
              id="busToFacilities1"
              d="M 520 165 L 600 165 L 660 60 L 740 60"
              fill="none"
              stroke="#059669"
              strokeWidth="2"
              className="animate-flow-dash"
            />
            <circle r="3" fill="#10b981">
              <animateMotion dur="2s" repeatCount="indefinite">
                <mpath href="#busToFacilities1" />
              </animateMotion>
            </circle>

            <path
              id="busToFacilities2"
              d="M 520 165 L 740 165"
              fill="none"
              stroke="#d97706"
              strokeWidth="2.5"
              className="animate-flow-dash"
            />
            <circle r="3.5" fill="#f59e0b">
              <animateMotion dur="1.4s" repeatCount="indefinite">
                <mpath href="#busToFacilities2" />
              </animateMotion>
            </circle>

            <path
              id="busToFacilities3"
              d="M 520 165 L 600 165 L 660 270 L 740 270"
              fill="none"
              stroke="#059669"
              strokeWidth="2"
              className="animate-flow-dash"
            />
            <circle r="3" fill="#10b981">
              <animateMotion dur="2.4s" repeatCount="indefinite">
                <mpath href="#busToFacilities3" />
              </animateMotion>
            </circle>

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
                rx="2"
                fill="#ffffff"
                stroke={activeBranch === 'grid' ? '#0284c7' : '#cbd5e1'}
                strokeWidth={activeBranch === 'grid' ? '2' : '1'}
              />
              <text x="35" y="55" fill="#64748b" fontSize="9.5" letterSpacing="1.2">
                UTILITY GRID INCOMER
              </text>
              <text x="35" y="78" fill="#101512" fontSize="17" fontWeight="bold">
                {gridDrawKw.toFixed(0)} <tspan fontSize="11" fill="#64748b">kW</tspan>
              </text>
              <text x="35" y="96" fill="#0284c7" fontSize="9" fontWeight="bold">
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
                rx="2"
                fill="#ffffff"
                stroke={activeBranch === 'solar' ? '#059669' : '#cbd5e1'}
                strokeWidth={activeBranch === 'solar' ? '2' : '1'}
              />
              <text x="35" y="150" fill="#64748b" fontSize="9.5" letterSpacing="1.2">
                ROOFTOP SOLAR PV
              </text>
              <text x="35" y="173" fill="#059669" fontSize="17" fontWeight="bold">
                {solarGenKw.toFixed(0)} <tspan fontSize="11" fill="#64748b">kW</tspan>
              </text>
              <text x="35" y="191" fill="#059669" fontSize="9" fontWeight="bold">
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
                rx="2"
                fill="#ffffff"
                stroke={activeBranch === 'battery' ? '#059669' : '#cbd5e1'}
                strokeWidth={activeBranch === 'battery' ? '2' : '1'}
              />
              <text x="35" y="245" fill="#64748b" fontSize="9.5" letterSpacing="1.2">
                BESS BATTERY STORAGE
              </text>
              <text x="35" y="268" fill="#101512" fontSize="17" fontWeight="bold">
                120 <tspan fontSize="11" fill="#64748b">kW</tspan>
              </text>
              <text x="35" y="286" fill="#059669" fontSize="9" fontWeight="bold">
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
                rx="2"
                fill="#f8fafc"
                stroke={activeBranch === 'all' ? '#059669' : '#94a3b8'}
                strokeWidth="2"
              />
              <circle cx="465" cy="142" r="14" fill="#ecfdf5" stroke="#059669" strokeWidth="1.5" />
              <Zap x="458" y="135" width="14" height="14" color="#059669" />
              <text x="465" y="176" textAnchor="middle" fill="#64748b" fontSize="8.5" letterSpacing="1" fontWeight="bold">
                MAIN BUS
              </text>
              <text x="465" y="196" textAnchor="middle" fill="#101512" fontSize="15" fontWeight="bold">
                {totalDemandKw.toFixed(0)} <tspan fontSize="9" fill="#64748b">kW</tspan>
              </text>
              <text x="465" y="210" textAnchor="middle" fill="#059669" fontSize="8.5" fontWeight="bold">
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
                rx="2"
                fill="#ffffff"
                stroke="#cbd5e1"
                strokeWidth="1"
              />
              <text x="755" y="45" fill="#64748b" fontSize="9" letterSpacing="1">
                01 COMMERCIAL CAMPUSES
              </text>
              <text x="755" y="68" fill="#101512" fontSize="16" fontWeight="bold">
                674.6 <tspan fontSize="11" fill="#64748b">kW</tspan>
              </text>
              <text x="755" y="86" fill="#059669" fontSize="9" fontWeight="bold">
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
                rx="2"
                fill="#ffffff"
                stroke="#d97706"
                strokeWidth="1.5"
              />
              <text x="755" y="150" fill="#64748b" fontSize="9" letterSpacing="1">
                02 HEAVY MANUFACTURING
              </text>
              <text x="755" y="173" fill="#d97706" fontSize="16" fontWeight="bold">
                685.2 <tspan fontSize="11" fill="#64748b">kW</tspan>
              </text>
              <text x="755" y="191" fill="#d97706" fontSize="9" fontWeight="bold">
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
                rx="2"
                fill="#ffffff"
                stroke="#e11d48"
                strokeWidth="1.5"
              />
              <text x="755" y="255" fill="#64748b" fontSize="9" letterSpacing="1">
                03 GURUGRAM + CHENNAI
              </text>
              <text x="755" y="278" fill="#e11d48" fontSize="16" fontWeight="bold">
                506.2 <tspan fontSize="11" fill="#64748b">kW</tspan>
              </text>
              <text x="755" y="296" fill="#e11d48" fontSize="9" fontWeight="bold">
                GURUGRAM BREACH (+7.2%)
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Selected Branch Inspection Telemetry Ribbon */}
      <div className="mt-2 pt-3 border-t border-[#e2e4dc] bg-[#f8fafc] p-3 rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-[#059669] font-bold text-[11px] uppercase tracking-wider">
            {current.label}
          </span>
          <span className="text-[#cbd5e1] hidden sm:inline">|</span>
          <span className="text-[11px] text-[#525f56] font-sans truncate">
            {current.desc}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#101512] shrink-0">
          {current.metrics.map((m, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="text-[#64748b]">{m.k}:</span>
              <span className="text-[#101512] font-bold">{m.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
