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
  Printer,
  Sparkles,
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
import { Bill, PageId } from '../../types';
import { ViewBillModal } from '../modals/ViewBillModal';
import { MONTHLY_COST_DATA, HOURLY_CONSUMPTION_DATA } from '../../data/mockData';
import { PlatformShell } from '../common/PlatformShell';

interface BillingPageProps {
  bills: Bill[];
  onDownloadBill: (invoiceNo: string) => void;
  onPayBill: (billId: string) => void;
  onNavigate?: (page: PageId) => void;
}

export const BillingPage: React.FC<BillingPageProps> = ({
  bills,
  onDownloadBill,
  onPayBill,
  onNavigate = () => {},
}) => {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentBill = bills[0];

  const handleOpenBill = (bill: Bill) => {
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
          <button
            onClick={() => handleOpenBill(currentBill)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-green-700 hover:bg-green-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>View Latest Statement</span>
          </button>
        </div>
      }
    >
      {/* 1. Overview Financial Impact KPIs */}
      <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
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
            <div className="mt-1 text-[11px] text-green-700 font-semibold">
              ✓ Direct deduction from DISCOM dues
            </div>
          </div>

          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Peak Penalties Avoided</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">₹2.18L</span>
            </div>
            <div className="mt-1 text-[11px] text-green-700 font-semibold">
              Via thermal mass pre-cooling
            </div>
          </div>

          <div className="pt-2 md:pt-0 md:px-3">
            <div className="text-xs text-slate-500 font-medium">Audit Reconciliation</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-green-700">100%</span>
            </div>
            <div className="mt-1 text-[11px] text-green-700 font-semibold">
              Zero billing discrepancy found
            </div>
          </div>
        </div>
      </section>

      {/* 2. Current Month Invoice Reconciliation Card */}
      <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Payment Due · 15 Oct 2026
              </span>
              <span className="text-xs text-slate-400 font-mono">Invoice #{currentBill.invoiceNo}</span>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
              ₹{currentBill.totalAmountInr.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-500">
                for {currentBill.netBilledUnitsKwh.toLocaleString()} billed kWh
              </span>
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Facility: <strong className="text-slate-800">{currentBill.facilityName}</strong> · HT-2a Commercial Industrial Tariff Tier
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleOpenBill(currentBill)}
              className="px-4 py-2 rounded-md bg-green-700 hover:bg-green-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Inspect Line-Item Breakdown
            </button>
            <button
              onClick={() => onDownloadBill(currentBill.invoiceNo)}
              className="px-3.5 py-2 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Breakdown Items */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-xs">
          <div className="p-3 bg-[#fbfbfa] rounded-md border border-slate-100">
            <span className="text-[11px] text-slate-500">Base Energy Cost</span>
            <div className="font-bold text-slate-900 mt-0.5">
              ₹{currentBill.baseEnergyChargesInr.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">@ ₹{currentBill.baseRatePerKwh}/kWh</span>
          </div>

          <div className="p-3 bg-[#fbfbfa] rounded-md border border-slate-100">
            <span className="text-[11px] text-slate-500">Peak Hour Surcharges</span>
            <div className="font-bold text-amber-800 mt-0.5">
              +₹{currentBill.peakHourSurchargesInr.toLocaleString()}
            </div>
            <span className="text-[10px] text-amber-700">TOD Tariff window</span>
          </div>

          <div className="p-3 bg-green-50/50 rounded-md border border-green-200">
            <span className="text-[11px] text-green-700 font-medium">Solar Net-Metering Credit</span>
            <div className="font-bold text-green-800 mt-0.5">
              -₹{currentBill.solarCreditInr.toLocaleString()}
            </div>
            <span className="text-[10px] text-green-700">Direct PV offset</span>
          </div>

          <div className="p-3 bg-[#fbfbfa] rounded-md border border-slate-100">
            <span className="text-[11px] text-slate-500">Demand Charges &amp; Tax</span>
            <div className="font-bold text-slate-900 mt-0.5">
              ₹{(currentBill.fixedDemandChargesInr + currentBill.taxesAndDutiesInr).toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">Fixed reservation &amp; cess</span>
          </div>
        </div>
      </section>

      {/* 3. Spend vs Budget Trajectory Chart */}
      <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
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
              <Tooltip formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, '']} />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 11, paddingBottom: 8 }} />
              <Bar dataKey="gridCost" name="Grid Invoiced Cost (₹)" fill="#0284c7" radius={[3, 3, 0, 0]} />
              <Bar dataKey="solarSavings" name="Solar Offset Credit (₹)" fill="#16a34a" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 4. Verified Historical Invoices Table */}
      <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 pb-3 mb-4 border-b border-slate-100">
          Reconciled DISCOM Statement History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="pb-2.5 font-bold uppercase text-[10px]">Invoice #</th>
                <th className="pb-2.5 font-bold uppercase text-[10px]">Period</th>
                <th className="pb-2.5 font-bold uppercase text-[10px]">Facility</th>
                <th className="pb-2.5 font-bold uppercase text-[10px]">Net Billed kWh</th>
                <th className="pb-2.5 font-bold uppercase text-[10px]">Amount</th>
                <th className="pb-2.5 font-bold uppercase text-[10px]">Audit Status</th>
                <th className="pb-2.5 font-bold uppercase text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {bills.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 font-bold text-slate-900 font-mono">{bill.invoiceNo}</td>
                  <td className="py-3 text-slate-600">{bill.billingPeriod}</td>
                  <td className="py-3 font-medium">{bill.facilityName}</td>
                  <td className="py-3 tabular-nums">{bill.netBilledUnitsKwh.toLocaleString()}</td>
                  <td className="py-3 font-bold text-slate-900 tabular-nums">
                    ₹{bill.totalAmountInr.toLocaleString()}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        bill.status === 'Paid'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {bill.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleOpenBill(bill)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-green-50 text-slate-700 hover:text-green-800 font-semibold text-[11px] transition-colors cursor-pointer"
                      >
                        Inspect →
                      </button>
                      <button
                        onClick={() => onDownloadBill(bill.invoiceNo)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
