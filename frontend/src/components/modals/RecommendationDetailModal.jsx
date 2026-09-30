import React from 'react';
import { Modal } from '../common/Modal';
import { Check, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const RecommendationDetailModal = ({
  recommendation,
  isOpen,
  onClose,
  onApply,
}) => {
  if (!recommendation) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={recommendation.title}
      subtitle={`AI Model Insight · Category: ${recommendation.category}`}
      maxWidth="lg"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Dismiss
          </button>
          <button
            onClick={() => {
              onApply(recommendation.id);
              onClose();
            }}
            disabled={recommendation.isApplied}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm ${
              recommendation.isApplied
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white hover:shadow'
            }`}
          >
            {recommendation.isApplied ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Setpoint Active</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Deploy BMS Automation Rule</span>
              </>
            )}
          </button>
        </>
      }
    >
      <div className="space-y-4 text-xs text-slate-700">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-100">
          <StatusBadge status={recommendation.priority} size="sm" />
          <span className="text-slate-300">·</span>
          <span className="text-slate-500">Target Campus:</span>
          <span className="font-bold text-slate-900">{recommendation.facilityName}</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-500">Implementation:</span>
          <span className="font-semibold text-emerald-700">{recommendation.implementationEffort}</span>
        </div>

        {/* Financial & Energy Impact Grid */}
        <div className="grid grid-cols-2 gap-4 bg-gradient-to-br from-emerald-50/40 to-slate-50 border border-emerald-100/80 rounded-2xl p-4">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
              Monthly Cost Saving
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-extrabold text-emerald-700 tracking-tight">
                ₹{recommendation.estimatedCostSavingInr.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ mo</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              ~₹{((recommendation.estimatedCostSavingInr * 12) / 100000).toFixed(2)}L Annualized
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
              Peak Energy Reduction
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-extrabold text-sky-700 tracking-tight">
                -{recommendation.estimatedSavingPercent}%
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              ~{recommendation.estimatedEnergySavingKwh.toLocaleString()} kWh Saved Units
            </span>
          </div>
        </div>

        {/* Telemetry Evidence Section */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
            Telemetric Reasoning &amp; Root Cause
          </span>
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
            {recommendation.reason}
          </p>
        </div>

        {/* Implementation Steps */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
            Dispatch Sequence (Automated BACnet / MODBUS Protocol)
          </span>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
              <span>Broadcast setpoint float message over building BACnet/IP network</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
              <span>Verify motor current feedback from secondary loop variable frequency drive (VFD)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
              <span>Auto-revert setpoints if zone temperature rises &gt;1.5°C above setpoint</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
