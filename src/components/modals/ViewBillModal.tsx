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
      title={`UTILITY INVOICE STATEMENT // ${bill.invoiceNo}`}
      subtitle={`Billing Interval: ${bill.billingPeriod} · HT-2a Commercial Tariff Tier`}
      maxWidth="2xl"
      footer={
        <>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-bold text-[#525f56] hover:text-[#101512] border border-[#dcdcd2] hover:bg-[#f5f5ee] transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT STATEMENT</span>
          </button>
          <button
            onClick={onDownload}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold text-white bg-[#059669] hover:bg-[#047857] transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>DOWNLOAD OFFICIAL PDF</span>
          </button>
        </>
      }
    >
      <div className="space-y-5 text-xs font-mono text-[#101512]">
        {/* Invoice Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#e2e2d8]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-[#101512] font-editorial tracking-tight">
                GREENGRID ENERGY INTELLIGENCE
              </span>
            </div>
            <p className="text-[11px] text-[#525f56] mt-1 font-sans">
              Commercial Utility Reconciliation &amp; Tariff Audit Division
            </p>
            <p className="text-[10px] text-[#8e9e94] mt-0.5">DISCOM Account: KA-BESCOM-HT2A-994102</p>
          </div>

          <div className="text-right">
            <span
              className={`inline-block font-bold px-2 py-0.5 text-[10px] uppercase tracking-wider border ${
                bill.status === 'Paid'
                  ? 'bg-[#f0fdf4] text-[#059669] border-[#86efac]'
                  : 'bg-[#fef7ee] text-amber-700 border-amber-500'
              }`}
            >
              STATUS: {bill.status}
            </span>
            <p className="text-xs font-bold text-[#101512] mt-1.5">Invoice: {bill.invoiceNo}</p>
            <p className="text-[10px] text-[#6f7e75]">Due Date: {bill.dueDate}</p>
          </div>
        </div>

        {/* Units Breakdown */}
        <div className="grid grid-cols-3 gap-3 bg-[#f5f5ee] p-4 border border-[#dcdcd2]">
          <div>
            <span className="text-[9px] text-[#6f7e75] block uppercase font-bold">Gross Consumed</span>
            <span className="text-base font-extrabold text-[#101512] tabular-nums mt-0.5 block">
              {bill.unitsConsumedKwh.toLocaleString()} kWh
            </span>
          </div>
          <div>
            <span className="text-[9px] text-[#6f7e75] block uppercase font-bold">Solar Credit</span>
            <span className="text-base font-extrabold text-[#059669] tabular-nums mt-0.5 block">
              -{bill.solarGeneratedKwh.toLocaleString()} kWh
            </span>
          </div>
          <div>
            <span className="text-[9px] text-[#6f7e75] block uppercase font-bold">Net Billed</span>
            <span className="text-base font-extrabold text-[#0284c7] tabular-nums mt-0.5 block">
              {bill.netBilledUnitsKwh.toLocaleString()} kWh
            </span>
          </div>
        </div>

        {/* Financial Line Item Breakdown */}
        <div className="border border-[#e2e2d8] divide-y divide-[#e2e2d8]">
          <div className="p-3 bg-[#f5f5ee] flex justify-between font-bold text-[10px] uppercase text-[#6f7e75]">
            <span>LINE ITEM DESCRIPTION</span>
            <span>AMOUNT (INR)</span>
          </div>
          <div className="p-3 flex justify-between">
            <div>
              <span className="font-bold text-[#101512] block">Base Energy Charges (Net Draw)</span>
              <span className="text-[10px] text-[#6f7e75]">
                {bill.netBilledUnitsKwh.toLocaleString()} kWh @ ₹7.50/kWh base tariff
              </span>
            </div>
            <span className="font-bold tabular-nums text-[#101512]">
              ₹{(bill.netBilledUnitsKwh * 7.5).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="p-3 flex justify-between bg-[#fef7ee]">
            <div>
              <span className="font-bold text-amber-900 block">TOD Peak Surcharge (14:00 – 17:30 IST)</span>
              <span className="text-[10px] text-amber-700">Contract surcharge for afternoon grid peak</span>
            </div>
            <span className="font-bold tabular-nums text-amber-900">
              +₹{bill.peakHourSurchargesInr.toLocaleString()}
            </span>
          </div>
          <div className="p-3 flex justify-between bg-[#f0fdf4]">
            <div>
              <span className="font-bold text-[#059669] block">Rooftop Solar Net-Metering Credit</span>
              <span className="text-[10px] text-[#059669]">Self-generated solar offset from 450 kWp PV array</span>
            </div>
            <span className="font-bold tabular-nums text-[#059669]">
              -₹{bill.solarCreditInr.toLocaleString()}
            </span>
          </div>
          <div className="p-3 flex justify-between">
            <div>
              <span className="font-bold text-[#101512] block">Contract Demand Fixed Charge &amp; Taxes</span>
              <span className="text-[10px] text-[#6f7e75]">2,100 kVA capacity reservation + 6% state cess</span>
            </div>
            <span className="font-bold tabular-nums text-[#101512]">
              ₹{((bill.netBilledUnitsKwh * 7.5 + bill.peakHourSurchargesInr - bill.solarCreditInr) * 0.12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="p-4 bg-[#f5f5ee] flex justify-between items-center text-sm font-bold">
            <span className="text-[#101512]">TOTAL AMOUNT PAYABLE</span>
            <span className="text-xl font-extrabold text-[#101512] tabular-nums">
              ₹{bill.totalAmountInr.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
