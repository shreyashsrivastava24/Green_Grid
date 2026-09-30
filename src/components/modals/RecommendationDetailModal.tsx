import React from 'react';
import { Modal } from '../common/Modal';
import { Recommendation } from '../../types';
import { Check, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface RecommendationDetailModalProps {
  recommendation: Recommendation | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (id: string) => void;
}

export const RecommendationDetailModal: React.FC<RecommendationDetailModalProps> = ({
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
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Dismiss
          </button>
          <button
            onClick={() => {
              onApply(recommendation.id);
              onClose();
            }}
            disabled={recommendation.isApplied}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer shadow-xs ${
              recommendation.isApplied
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
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
          <span className="text-slate-400">·</span>
          <span className="text-slate-500">Target Campus:</span>
          <span className="font-bold text-slate-900">{recommendation.facilityName}</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-500">Implementation:</span>
          <span className="font-semibold text-green-700">{recommendation.implementationEffort}</span>
        </div>

        {/* Financial & Energy Impact Grid */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block uppercase">
              Monthly Cost Saving
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-green-700">
                ₹{recommendation.estimatedCostSavingInr.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500">/ mo</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              ~₹{((recommendation.estimatedCostSavingInr * 12) / 100000).toFixed(2)}L Annualized
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 font-semibold block uppercase">
              Peak Energy Reduction
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-sky-700">
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
          <p className="text-xs text-slate-600 leading-relaxed bg-white p-3.5 rounded-lg border border-slate-200">
            {recommendation.reason}
          </p>
        </div>

        {/* Implementation Steps */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
            Dispatch Sequence (Automated BACnet / MODBUS Protocol)
          </span>
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
              <span>Broadcast setpoint float message over building BACnet/IP network</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
              <span>Verify motor current feedback from secondary loop variable frequency drive (VFD)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
              <span>Auto-revert setpoints if zone temperature rises &gt;1.5°C above setpoint</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
