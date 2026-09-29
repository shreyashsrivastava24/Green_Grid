import React, { useState } from 'react';
import {
  Receipt,
  Download,
  IndianRupee,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';
import { Bill } from '../../types';
import { ViewBillModal } from '../modals/ViewBillModal';
import { MONTHLY_COST_DATA, HOURLY_CONSUMPTION_DATA } from '../../data/mockData';

interface BillingPageProps {
  bills: Bill[];
  onDownloadBill: (invoiceNo: string) => void;
  onPayBill: (billId: string) => void;
}

export const BillingPage: React.FC<BillingPageProps> = ({
  bills,
  onDownloadBill,
  onPayBill,
}) => {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentBill = bills[0];

  const handleOpenBill = (bill: Bill) => {
    setSelectedBill(bill);
    setIsModalOpen(true);
  };

  // Hourly tariff cost simulation data
  const tariffHourlyData = HOURLY_CONSUMPTION_DATA.map((h) => {
    const isPeak = h.time === '14:00' || h.time === '16:00';
    const isOffPeak =
      h.time === '00:00' || h.time === '02:00' || h.time === '04:00' || h.time === '22:00';
    const rate = isPeak ? 9.6 : isOffPeak ? 6.3 : 7.5;
    return {
      ...h,
      rate,
      costEstimate: Math.round(h.grid * rate),
      solarSavingsEstimate: Math.round(h.solar * rate),
      rateType: isPeak ? 'TOD Peak Surcharge' : isOffPeak ? 'Off-Peak Incentive' : 'Normal Rate',
    };
  });

  return (
    <div className="space-y-10 pb-16">
      {/* ========================================================
          1. EDITORIAL HEADER & FINANCE STRIP
          ======================================================== */}
      <section className="pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e2e2d8]">
          <div className="space-y-2">
            <div className="text-[11px] font-mono tracking-[0.22em] text-[#059669] uppercase font-semibold">
              ENERGY FINANCE TERMINAL // DISCOM HT-2a
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#101512] tracking-tight leading-[1.08] font-editorial">
              TARIFF RECONCILIATION<br />
              <span className="text-[#059669]">&amp; COST TERMINAL</span>
            </h1>
            <p className="text-sm sm:text-base text-[#525f56] font-sans max-w-xl">
              Utility statement audit, time-of-day surcharge tracking, net-metering solar export credits, and demand charge shaving.
            </p>
          </div>

          <button
            onClick={() => onDownloadBill(currentBill.invoiceNo)}
            className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-mono font-bold tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT STATEMENT ({currentBill.invoiceNo.slice(-7)})</span>
          </button>
        </div>

        {/* Financial Horizontal Telemetry Rail */}
        <div className="mt-6 border border-[#dcdcd2] bg-[#f5f5ee] divide-y md:divide-y-0 md:divide-x divide-[#dcdcd2] grid grid-cols-2 md:grid-cols-4 font-mono">
          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">NET BILLED MTD</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#101512] tabular-nums">
                ₹{(currentBill.totalAmountInr / 100000).toFixed(2)}
              </span>
              <span className="text-xs text-[#6f7e75]">Lakh</span>
            </div>
            <span className="text-[11px] text-[#6f7e75] mt-1 block">Due: {currentBill.dueDate}</span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">SOLAR REBATE CREDIT</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#059669] tabular-nums">
                -₹{(currentBill.solarCreditInr / 1000).toFixed(0)}
              </span>
              <span className="text-xs text-[#059669]">k</span>
            </div>
            <span className="text-[11px] text-[#059669] mt-1 block">{currentBill.solarGeneratedKwh.toLocaleString()} kWh exported</span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">TOD PEAK SURCHARGE</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#9a3412] tabular-nums">
                ₹{(currentBill.peakHourSurchargesInr / 1000).toFixed(1)}
              </span>
              <span className="text-xs text-[#9a3412]">k</span>
            </div>
            <span className="text-[11px] text-[#9a3412] mt-1 block">14:00–17:30 window</span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e75] block">AI SHAVING RECOVERY</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#059669] tabular-nums">
                ₹1.12
              </span>
              <span className="text-xs text-[#059669]">Lakh</span>
            </div>
            <span className="text-[11px] text-[#059669] mt-1 block">Pre-cooling &amp; pump dispatch</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. THE 24-HOUR COST JOURNEY: WHEN DID WE SPEND MONEY?
          ======================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 border-b border-[#e2e2d8] gap-3">
          <div>
            <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#6f7e75]">
              DIURNAL EXPENDITURE OVERLAY // WHEN DID WE SPEND MONEY?
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101512] tracking-tight font-editorial mt-0.5">
              THE 24-HOUR COST JOURNEY
            </h2>
            <p className="text-xs text-[#525f56] font-sans">
              Visualizing how grid draw correlates with Time-of-Day utility rates, proving exactly which daytime hours drive your electric bill.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-[#6f7e75]">
            <span className="text-amber-700 font-bold">14:00–16:00 accounts for 32% of daily cost</span>
          </div>
        </div>

        {/* Phase Horizon Rail: OFF-PEAK -> NORMAL -> PEAK -> NORMAL -> OFF-PEAK */}
        <div className="border border-[#dcdcd2] bg-[#f5f5ee] divide-y sm:divide-y-0 sm:divide-x divide-[#dcdcd2] grid grid-cols-2 sm:grid-cols-5 text-xs font-mono">
          <div className="p-3 bg-[#ebebe2]">
            <span className="text-[10px] text-[#059669] font-bold uppercase block">00:00 – 06:00</span>
            <span className="font-bold text-[#101512]">OFF-PEAK</span>
            <div className="text-[11px] text-[#059669] mt-0.5 font-bold">₹6.30 / kWh</div>
          </div>
          <div className="p-3">
            <span className="text-[10px] text-[#525f56] font-bold uppercase block">06:00 – 14:00</span>
            <span className="font-bold text-[#101512]">NORMAL TARIFF</span>
            <div className="text-[11px] text-[#525f56] mt-0.5 font-bold">₹7.50 / kWh</div>
          </div>
          <div className="p-3 bg-[#fef7ee] border-b-2 sm:border-b-0 sm:border-t-2 border-amber-600">
            <span className="text-[10px] text-[#9a3412] font-bold uppercase block">14:00 – 18:00</span>
            <span className="font-bold text-[#9a3412]">TOD PEAK SURCHARGE</span>
            <div className="text-[11px] text-[#9a3412] mt-0.5 font-bold">₹9.60 / kWh (+28%)</div>
          </div>
          <div className="p-3">
            <span className="text-[10px] text-[#525f56] font-bold uppercase block">18:00 – 22:00</span>
            <span className="font-bold text-[#101512]">NORMAL TARIFF</span>
            <div className="text-[11px] text-[#525f56] mt-0.5 font-bold">₹7.50 / kWh</div>
          </div>
          <div className="p-3 bg-[#ebebe2] col-span-2 sm:col-span-1">
            <span className="text-[10px] text-[#059669] font-bold uppercase block">22:00 – 24:00</span>
            <span className="font-bold text-[#101512]">OFF-PEAK NIGHT</span>
            <div className="text-[11px] text-[#059669] mt-0.5 font-bold">₹6.30 / kWh</div>
          </div>
        </div>

        {/* Hourly Cost & Demand Area Chart Canvas */}
        <div className="bg-[#fbfbfa] border border-[#e2e2d8] p-5 sm:p-7 relative overflow-hidden">
          <div className="w-full h-[320px] sm:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tariffHourlyData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke="#e8e8df" vertical={false} />
                <XAxis dataKey="time" stroke="#8e9e94" fontSize={11} tickLine={false} fontFamily="var(--font-mono)" />
                <YAxis stroke="#8e9e94" fontSize={11} tickLine={false} fontFamily="var(--font-mono)" />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#101512] text-[#fbfbfa] p-3 rounded-xs border border-[#2a3830] shadow-xl text-xs font-mono">
                          <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-white/10">
                            <span>HOUR // {label}</span>
                            <span className="text-[9px] text-amber-400 font-bold">{data.rateType}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between gap-4">
                              <span className="text-[#8e9e94]">Grid Draw:</span>
                              <span className="font-bold text-white">{data.grid} kW</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-[#8e9e94]">Tariff Rate:</span>
                              <span className="font-bold text-amber-400">₹{data.rate.toFixed(2)}/kWh</span>
                            </div>
                            <div className="flex justify-between gap-4 pt-1 border-t border-white/10">
                              <span className="text-[#8e9e94]">Hourly Expense:</span>
                              <span className="font-bold text-[#059669]">₹{data.costEstimate.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="plainline"
                  wrapperStyle={{ fontSize: '11px', paddingBottom: '12px', fontFamily: 'var(--font-mono)' }}
                />

                {/* Peak Window Highlight */}
                <ReferenceArea
                  x1="14:00"
                  x2="16:00"
                  fill="#d97706"
                  fillOpacity={0.08}
                />

                <Area
                  type="monotone"
                  dataKey="costEstimate"
                  name="Hourly Spend Rupee Impact (₹)"
                  stroke="#d97706"
                  strokeWidth={2.5}
                  fill="url(#costGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="grid"
                  name="Grid Power Draw (kW)"
                  stroke="#0284c7"
                  strokeWidth={1.8}
                  strokeDasharray="4 4"
                  fill="url(#loadGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-[#ebebe2] flex flex-wrap items-center justify-between text-xs font-mono text-[#6f7e75] gap-2">
            <span>Peak TOD Surcharge Zone: 14:00 – 18:00 IST</span>
            <span className="text-[#059669] font-bold">Shifting 45 kW saves ₹42,000 monthly</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. DISCOM TARIFF TIERS & 6-MONTH SPEND WATERFALL
          ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left (5 cols): Commercial HT-2a Tariff Structure */}
        <div className="lg:col-span-5 space-y-4">
          <div className="pb-3 border-b border-[#e2e2d8]">
            <h3 className="text-xl font-bold text-[#101512] font-editorial uppercase tracking-tight">
              COMMERCIAL HT-2a TARIFF
            </h3>
            <span className="text-xs font-mono text-[#6f7e75]">STATE DISCOM CONTRACT TIER</span>
          </div>

          <div className="border border-[#e2e2d8] divide-y divide-[#e2e2d8] bg-[#fbfbfa] font-mono text-xs">
            <div className="p-3.5 flex items-center justify-between">
              <span className="text-[#525f56]">Base Energy Charge (Normal)</span>
              <span className="font-bold text-[#101512]">₹7.50 / kWh</span>
            </div>
            <div className="p-3.5 flex items-center justify-between bg-[#fef7ee]">
              <span className="text-amber-800 font-bold">TOD Peak Surcharge (14:00–18:00)</span>
              <span className="font-bold text-amber-800">+₹2.10 / kWh</span>
            </div>
            <div className="p-3.5 flex items-center justify-between bg-[#f0fdf4]">
              <span className="text-[#059669] font-bold">Off-Peak Incentive (22:00–06:00)</span>
              <span className="font-bold text-[#059669]">-₹1.20 / kWh</span>
            </div>
            <div className="p-3.5 flex items-center justify-between">
              <span className="text-[#525f56]">Fixed Demand Charge</span>
              <span className="font-bold text-[#101512]">₹280 / kVA / mo</span>
            </div>
            <div className="p-3.5 flex items-center justify-between">
              <span className="text-[#525f56]">Solar Feed-In Export Credit</span>
              <span className="font-bold text-[#059669]">-₹4.00 / kWh</span>
            </div>
            <div className="p-3.5 flex items-center justify-between">
              <span className="text-[#525f56]">State Electricity Duty &amp; Cess</span>
              <span className="font-bold text-[#101512]">6.0% ad valorem</span>
            </div>
          </div>
        </div>

        {/* Right (7 cols): 6-Month Expenditure Waterfall */}
        <div className="lg:col-span-7 space-y-4">
          <div className="pb-3 border-b border-[#e2e2d8]">
            <h3 className="text-xl font-bold text-[#101512] font-editorial uppercase tracking-tight">
              6-MONTH UTILITY EXPENDITURE &amp; SOLAR SAVINGS
            </h3>
            <span className="text-xs font-mono text-[#6f7e75]">INVOICE RECONCILIATION</span>
          </div>

          <div className="bg-[#fbfbfa] border border-[#e2e2d8] p-5">
            <div className="w-full h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_COST_DATA} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#e8e8df" vertical={false} />
                  <XAxis dataKey="month" stroke="#8e9e94" fontSize={10} tickLine={false} fontFamily="var(--font-mono)" />
                  <YAxis
                    stroke="#8e9e94"
                    fontSize={10}
                    tickLine={false}
                    fontFamily="var(--font-mono)"
                    tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#101512',
                      borderColor: '#2a3830',
                      color: '#fbfbfa',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="rect"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '10px', fontFamily: 'var(--font-mono)' }}
                  />
                  <Bar dataKey="netCost" name="Net Paid Bill" fill="#101512" />
                  <Bar dataKey="solarSavings" name="Solar Rebate Savings" fill="#059669" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 pt-2 border-t border-[#ebebe2] flex items-center justify-between text-xs font-mono text-[#6f7e75]">
              <span>Cumulative Solar Savings: ₹19.18 Lakhs</span>
              <span className="text-[#059669] font-bold">23.4% Average Reduction</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. INVOICE ARCHIVE & UTILITY LEDGER
          ======================================================== */}
      <section className="space-y-4">
        <div className="pb-2 border-b border-[#e2e2d8]">
          <h3 className="text-xl font-bold text-[#101512] font-editorial uppercase tracking-tight">
            DISCOM INVOICE ARCHIVE
          </h3>
        </div>

        <div className="border border-[#e2e2d8] divide-y divide-[#e2e2d8] bg-[#fbfbfa] font-mono text-xs">
          <div className="p-4 bg-[#f5f5ee] font-bold text-[#6f7e75] uppercase text-[10px] grid grid-cols-2 sm:grid-cols-6 gap-4">
            <div>INVOICE NO</div>
            <div>PERIOD</div>
            <div className="text-right">UNITS CONSUMED</div>
            <div className="text-right">SOLAR CREDIT</div>
            <div className="text-right">TOTAL BILLED</div>
            <div className="text-right">ACTION</div>
          </div>

          {bills.map((bill) => (
            <div
              key={bill.id}
              onClick={() => handleOpenBill(bill)}
              className="p-4 hover:bg-[#f5f5ee] transition-colors grid grid-cols-2 sm:grid-cols-6 gap-4 items-center cursor-pointer"
            >
              <div className="font-bold text-[#101512]">{bill.invoiceNo}</div>
              <div className="text-[#525f56]">{bill.billingPeriod}</div>
              <div className="text-right tabular-nums text-[#101512]">{bill.unitsConsumedKwh.toLocaleString()} kWh</div>
              <div className="text-right text-[#059669] font-bold tabular-nums">-₹{(bill.solarCreditInr / 1000).toFixed(0)}k</div>
              <div className="text-right font-extrabold text-[#101512] tabular-nums text-sm">₹{bill.totalAmountInr.toLocaleString()}</div>
              <div className="text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenBill(bill);
                  }}
                  className="px-2.5 py-1 bg-[#101512] hover:bg-[#059669] text-[#fbfbfa] text-[10px] font-bold transition-colors cursor-pointer"
                >
                  AUDIT
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* View Bill Modal */}
      {selectedBill && (
        <ViewBillModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          bill={selectedBill}
          onDownload={() => onDownloadBill(selectedBill.invoiceNo)}
          onPay={() => {
            onPayBill(selectedBill.id);
            setSelectedBill({ ...selectedBill, status: 'Paid' });
          }}
        />
      )}
    </div>
  );
};
