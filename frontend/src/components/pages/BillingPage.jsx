import React, { useState } from 'react';
import {
  Receipt,
  Download,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ViewBillModal } from '../modals/ViewBillModal';
import { MONTHLY_COST_DATA } from '../../data/mockData';
import { PlatformShell } from '../common/PlatformShell';

export const BillingPage = ({
  bills,
  onDownloadBill,
  onPayBill,
  onNavigate = () => {},
}) => {
  const [selectedBill, setSelectedBill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentBill = bills && bills.length > 0 ? bills[0] : null;

  const handleOpenBill = (bill) => {
    if (!bill) return;
    setSelectedBill(bill);
    setIsModalOpen(true);
  };

  return (
    <PlatformShell
      pageTitle="Utility Billing Reconciliation & Tariff Audit"
      pageCategory="Commercial Tariffs"
      pageDescription="Line-by-line DISCOM electricity bill audit, Time-of-Day peak penalty tracking, and rooftop solar net-metering credits."
      onNavigate={onNavigate}
      actions={
        <div className="flex items-center gap-2">
          {currentBill && (
            <button
              onClick={() => handleOpenBill(currentBill)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Receipt className="w-4 h-4" />
              <span>View Latest Statement</span>
            </button>
          )}
        </div>
      }
    >
      {/* 1. Overview Financial Impact KPIs */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Billed Utility Spend (YTD)</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">₹42.7L</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-600 font-medium">
              Across 5 enterprise campuses
            </div>
          </div>

          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Solar Net-Metering Credits</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-green-700">₹5.42L</span>
            </div>
            <div className="mt-1 text-[11px] text-emerald-600 font-semibold">
              ✓ Direct deduction from DISCOM dues
            </div>
          </div>

          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Peak Penalties Avoided</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">₹2.18L</span>
            </div>
            <div className="mt-1 text-[11px] text-emerald-600 font-semibold">
              Via thermal mass pre-cooling
            </div>
          </div>

          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Audit Reconciliation</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-green-700">100%</span>
            </div>
            <div className="mt-1 text-[11px] text-emerald-600 font-semibold">
              Zero billing discrepancy found
            </div>
          </div>
        </div>
      </section>

      {/* 2. Current Month Invoice Reconciliation Card */}
      {currentBill && (
        <section
          className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
                  Payment {currentBill.status || 'Due'} · {currentBill.dueDate || currentBill.due_date || '15 Oct 2026'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Invoice #{currentBill.invoiceNo || currentBill.invoice_no || currentBill.id}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                ₹{(currentBill.totalAmountInr ?? currentBill.total_amount ?? 0).toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-500">
                  for {(currentBill.netBilledUnitsKwh ?? currentBill.net_billed_units_kwh ?? 0).toLocaleString()} billed kWh
                </span>
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Facility: <strong className="text-slate-800">{currentBill.facilityName || currentBill.facility_name || 'Apex Consolidated Facilities'}</strong> · HT-2a Commercial Industrial Tariff Tier
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => handleOpenBill(currentBill)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs shadow-sm hover:shadow transition-all cursor-pointer"
              >
                Inspect Line-Item Breakdown
              </button>
              <button
                onClick={() => onDownloadBill(currentBill.invoiceNo || currentBill.invoice_no || currentBill.id)}
                className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 font-semibold text-xs transition-all hover:shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Breakdown Items */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-xs">
            <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium">Base Energy Cost</span>
              <div className="font-bold text-slate-900 mt-1 text-sm font-mono">
                ₹{(currentBill.baseEnergyChargesInr ?? currentBill.base_energy_charges ?? 0).toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400 font-medium">@ ₹{currentBill.baseRatePerKwh ?? currentBill.tariff ?? 7.5}/kWh</span>
            </div>

            <div className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-100">
              <span className="text-[11px] text-amber-800 font-medium">Peak Hour Surcharges</span>
              <div className="font-bold text-amber-900 mt-1 text-sm font-mono">
                +₹{(currentBill.peakHourSurchargesInr ?? currentBill.peak_hour_surcharges ?? 0).toLocaleString()}
              </div>
              <span className="text-[10px] text-amber-700 font-medium">TOD Tariff window</span>
            </div>

            <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <span className="text-[11px] text-emerald-700 font-medium">Solar Net-Metering Credit</span>
              <div className="font-bold text-emerald-800 mt-1 text-sm font-mono">
                -₹{(currentBill.solarCreditInr ?? currentBill.solar_credit ?? 0).toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">Direct PV offset</span>
            </div>

            <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium">Demand Charges &amp; Tax</span>
              <div className="font-bold text-slate-900 mt-1 text-sm font-mono">
                ₹{((currentBill.fixedDemandChargesInr ?? currentBill.fixed_demand_charges ?? 0) + (currentBill.taxesAndDutiesInr ?? currentBill.taxes_and_duties ?? 0)).toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Fixed reservation &amp; cess</span>
            </div>
          </div>
        </section>
      )}

      {/* 3. Spend vs Budget Trajectory Chart */}
      <section
        className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Monthly Utility Spend vs. Sanctioned Budget Trajectory
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Consolidated 6-month financial trajectory comparing grid expenditure against solar offsets.
            </p>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MONTHLY_COST_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₹${v / 1000}k`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-xl text-xs space-y-1.5 min-w-[160px]">
                        <div className="font-semibold text-slate-500 pb-1 border-b border-slate-100">
                          Month: {label}
                        </div>
                        {payload.map((item, i) => (
                          <div key={i} className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-slate-600">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                              {item.name}
                            </span>
                            <span className="font-bold text-slate-900 font-mono">₹{Number(item.value).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 11, paddingBottom: 8 }} />
              <Bar dataKey="gridCost" name="Grid Invoiced Cost (₹)" fill="#0284c7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="solarSavings" name="Solar Offset Credit (₹)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 4. Verified Historical Invoices Table */}
      <section
        className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}
      >
        <h3 className="text-base font-bold text-slate-900 pb-3 mb-4 border-b border-slate-100 tracking-tight">
          Reconciled DISCOM Statement History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400">
                <th className="pb-3 font-bold uppercase text-[10px] tracking-wider">Invoice #</th>
                <th className="pb-3 font-bold uppercase text-[10px] tracking-wider">Period</th>
                <th className="pb-3 font-bold uppercase text-[10px] tracking-wider">Facility</th>
                <th className="pb-3 font-bold uppercase text-[10px] tracking-wider">Net Billed kWh</th>
                <th className="pb-3 font-bold uppercase text-[10px] tracking-wider">Amount</th>
                <th className="pb-3 font-bold uppercase text-[10px] tracking-wider">Audit Status</th>
                <th className="pb-3 font-bold uppercase text-[10px] tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {bills.map((bill) => {
                const invNo = bill.invoiceNo || bill.invoice_no || bill.id;
                const period = bill.billingPeriod || bill.billing_period || '—';
                const facName = bill.facilityName || bill.facility_name || 'Consolidated Facilities';
                const netKwh = bill.netBilledUnitsKwh ?? bill.net_billed_units_kwh ?? 0;
                const totalAmt = bill.totalAmountInr ?? bill.total_amount ?? 0;
                return (
                  <tr key={bill.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 font-bold text-slate-900 font-mono">{invNo}</td>
                    <td className="py-3.5 text-slate-600">{period}</td>
                    <td className="py-3.5 font-semibold text-slate-800">{facName}</td>
                    <td className="py-3.5 font-mono text-slate-700">{netKwh.toLocaleString()}</td>
                    <td className="py-3.5 font-bold text-slate-900 font-mono">
                      ₹{totalAmt.toLocaleString()}
                    </td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        bill.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {bill.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleOpenBill(bill)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold text-[11px] transition-colors cursor-pointer"
                      >
                        Inspect →
                      </button>
                      <button
                        onClick={() => onDownloadBill(bill.invoiceNo)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      </section>

      {/* View Bill Modal */}
      <ViewBillModal
        bill={selectedBill}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDownload={() => selectedBill && onDownloadBill(selectedBill.invoiceNo)}
        onPay={() => {
          if (selectedBill) {
            onPayBill(selectedBill.id);
            setIsModalOpen(false);
          }
        }}
      />
    </PlatformShell>
  );
};
