import React from 'react';
import { Modal } from '../common/Modal';
import { Bill } from '../../types';
import { Download, Printer, Zap } from 'lucide-react';

interface ViewBillModalProps {
  bill: Bill | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  onPay?: () => void;
}

export const ViewBillModal: React.FC<ViewBillModalProps> = ({
  bill,
  isOpen,
  onClose,
  onDownload,
  onPay,
}) => {
  if (!bill) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Utility Invoice Statement #${bill.invoiceNo}`}
      subtitle={`Billing Interval: ${bill.billingPeriod} · HT-2a Commercial Tariff Tier`}
      maxWidth="2xl"
      footer={
        <>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 bg-white hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Statement</span>
          </button>
          <button
            onClick={onDownload}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Official PDF</span>
          </button>
        </>
      }
    >
      <div className="space-y-4 text-xs text-slate-700">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 tracking-tight">
                GreenGrid Energy Management
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Commercial Utility Reconciliation &amp; Tariff Audit Division
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Account ID: KA-BESCOM-HT2A-994102</p>
          </div>

          <div className="sm:text-right">
            <span
              className={`inline-block font-semibold px-2.5 py-0.5 text-xs rounded-full border ${
                bill.status === 'Paid'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              Status: {bill.status}
            </span>
            <p className="text-xs font-bold text-slate-900 mt-1.5">Invoice: {bill.invoiceNo}</p>
            <p className="text-[11px] text-slate-500">Due Date: {bill.dueDate}</p>
          </div>
        </div>

        {/* Units Breakdown */}
        <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-center sm:text-left">
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Gross Consumed</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 block">
              {bill.unitsConsumedKwh.toLocaleString()} kWh
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Solar Net Credit</span>
            <span className="text-base sm:text-lg font-bold text-green-700 mt-0.5 block">
              -{bill.solarGeneratedKwh.toLocaleString()} kWh
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Net Billed Draw</span>
            <span className="text-base sm:text-lg font-bold text-sky-700 mt-0.5 block">
              {bill.netBilledUnitsKwh.toLocaleString()} kWh
            </span>
          </div>
        </div>

        {/* Line Item Breakdown */}
        <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
          <div className="p-3 bg-slate-50 flex justify-between font-semibold text-[11px] uppercase tracking-wide text-slate-500">
            <span>Line Item Description</span>
            <span>Amount (INR)</span>
          </div>
          <div className="p-3 flex justify-between">
            <div>
              <span className="font-semibold text-slate-900 block">Base Energy Charges (Net Draw)</span>
              <span className="text-[11px] text-slate-500">
                {bill.netBilledUnitsKwh.toLocaleString()} kWh @ ₹7.50/kWh base tariff
              </span>
            </div>
            <span className="font-bold text-slate-900">
              ₹{(bill.netBilledUnitsKwh * 7.5).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="p-3 flex justify-between bg-amber-50/50">
            <div>
              <span className="font-semibold text-amber-900 block">TOD Peak Surcharge (14:00 – 17:30 IST)</span>
              <span className="text-[11px] text-amber-700">Contract tariff surcharge for peak window</span>
            </div>
            <span className="font-bold text-amber-900">
              +₹{bill.peakHourSurchargesInr.toLocaleString()}
            </span>
          </div>
          <div className="p-3 flex justify-between bg-green-50/50">
            <div>
              <span className="font-semibold text-green-800 block">Rooftop Solar Net-Metering Credit</span>
              <span className="text-[11px] text-green-700">Self-generated solar offset from 450 kWp PV array</span>
            </div>
            <span className="font-bold text-green-700">
              -₹{bill.solarCreditInr.toLocaleString()}
            </span>
          </div>
          <div className="p-3 flex justify-between">
            <div>
              <span className="font-semibold text-slate-900 block">Contract Demand Fixed Charge &amp; Taxes</span>
              <span className="text-[11px] text-slate-500">2,100 kVA capacity reservation + 6% state cess</span>
            </div>
            <span className="font-bold text-slate-900">
              ₹{((bill.netBilledUnitsKwh * 7.5 + bill.peakHourSurchargesInr - bill.solarCreditInr) * 0.12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="p-4 bg-slate-50 flex justify-between items-center text-sm font-bold border-t border-slate-200">
            <span className="text-slate-900">Total Amount Payable</span>
            <span className="text-xl font-bold text-slate-900">
              ₹{bill.totalAmountInr.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
