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
      subtitle={`AI MODEL INSIGHT · PROTOCOL: ${recommendation.category.toUpperCase()}`}
      maxWidth="lg"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-mono font-bold text-[#6f7e75] hover:text-[#101512] transition-colors cursor-pointer"
          >
            DISMISS
          </button>
          <button
            onClick={() => {
              onApply(recommendation.id);
              onClose();
            }}
            disabled={recommendation.isApplied}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
              recommendation.isApplied
                ? 'bg-[#dcdcd2] text-[#6f7e75] cursor-not-allowed'
                : 'bg-[#059669] hover:bg-[#047857] text-white shadow-sm'
            }`}
          >
            {recommendation.isApplied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>SETPOINT ALREADY ACTIVE</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>DEPLOY BMS AUTOMATION RULE</span>
              </>
            )}
          </button>
        </>
      }
    >
      <div className="space-y-4 text-xs font-mono">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-[#e2e2d8]">
          <StatusBadge status={recommendation.priority} size="sm" />
          <span className="text-[#6f7e75]">Target Campus:</span>
          <span className="font-bold text-[#101512]">{recommendation.facilityName}</span>
          <span className="text-[#8e9e94]">·</span>
          <span className="text-[#6f7e75]">Effort:</span>
          <span className="font-semibold text-[#059669]">{recommendation.implementationEffort}</span>
        </div>

        {/* Projected Financial & Energy Impact Grid */}
        <div className="grid grid-cols-2 gap-4 bg-[#f5f5ee] border border-[#dcdcd2] p-4">
          <div>
            <span className="text-[10px] text-[#6f7e75] uppercase tracking-wide block font-bold">
              Estimated Monthly Cost Saving
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-extrabold text-[#059669] tabular-nums">
                ₹{recommendation.estimatedCostSavingInr.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#6f7e75]">/ mo</span>
            </div>
            <span className="text-[10px] text-[#059669] block mt-0.5">
              ~₹{((recommendation.estimatedCostSavingInr * 12) / 100000).toFixed(2)} Lakhs Annual Run-Rate
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#6f7e75] uppercase tracking-wide block font-bold">
              Peak Energy Reduction
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-extrabold text-[#0284c7] tabular-nums">
                -{recommendation.estimatedSavingPercent}%
              </span>
            </div>
            <span className="text-[10px] text-[#6f7e75] block mt-0.5">
              ~{recommendation.estimatedEnergySavingKwh.toLocaleString()} kWh Conserved Units
            </span>
          </div>
        </div>

        {/* Telemetry Evidence Section */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-[#6f7e75] uppercase tracking-wider block">
            TELEMETRIC REASONING &amp; ROOT CAUSE
          </span>
          <p className="text-xs text-[#525f56] font-sans leading-relaxed bg-[#fbfbfa] p-3 border border-[#e2e2d8]">
            {recommendation.reason}
          </p>
        </div>

        {/* Implementation Steps */}
        <div className="space-y-2 pt-2 border-t border-[#e2e2d8]">
          <span className="text-[10px] font-bold text-[#6f7e75] uppercase tracking-wider block">
            DISPATCH SEQUENCE (AUTOMATED BACNET / MODBUS PROTOCOL)
          </span>
          <div className="space-y-1.5 text-[11px] text-[#525f56]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
              <span>Step 1: Broadcast setpoint float message over BACnet/IP network</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
              <span>Step 2: Monitor motor current feedback from secondary loop VFD</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
              <span>Step 3: Auto-revert setpoints if ambient room temperature rises &gt;1.5°C</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
