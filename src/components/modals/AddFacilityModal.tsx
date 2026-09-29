import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Facility } from '../../types';

interface AddFacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFacility: (facility: Facility) => void;
}

export const AddFacilityModal: React.FC<AddFacilityModalProps> = ({
  isOpen,
  onClose,
  onAddFacility,
}) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Commercial Tech Campus');
  const [peakThresholdKw, setPeakThresholdKw] = useState(350);
  const [solarCapacityKwp, setSolarCapacityKwp] = useState(100);
  const [floorAreaSqFt, setFloorAreaSqFt] = useState(120000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) return;

    const newFacility: Facility = {
      id: `fac-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      location: location.trim(),
      type,
      currentConsumptionKw: Math.round(peakThresholdKw * 0.65 * 10) / 10,
      monthlyConsumptionKwh: Math.round(peakThresholdKw * 120),
      estimatedCostInr: Math.round(peakThresholdKw * 120 * 8),
      status: 'Normal',
      solarCapacityKwp: Number(solarCapacityKwp),
      peakThresholdKw: Number(peakThresholdKw),
      peakUsageWindow: '13:00 – 17:00',
      gridSharePercent: 70,
      renewableSharePercent: 30,
      floorAreaSqFt: Number(floorAreaSqFt),
      monthlySavingsInr: Math.round(Number(solarCapacityKwp) * 110 * 8),
    };

    onAddFacility(newFacility);
    onClose();
    setName('');
    setLocation('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ENROLL NEW FACILITY NODE"
      subtitle="Connect IoT telemetry submeters, rooftop solar arrays, and peak demand limiters"
      maxWidth="lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono font-bold text-[#6f7e75] hover:text-[#101512] transition-colors cursor-pointer"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-mono font-bold text-white bg-[#059669] hover:bg-[#047857] transition-colors cursor-pointer shadow-sm"
          >
            PROVISION FACILITY
          </button>
        </>
      }
    >
      <form className="space-y-4 font-mono text-xs" onSubmit={handleSubmit}>
        <div>
          <label className="block text-[#6f7e75] mb-1 font-bold uppercase text-[10px]">
            FACILITY CAMPUS NAME
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Mumbai Financial Center Tower C"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#fbfbfa] border border-[#dcdcd2] px-3 py-2 text-[#101512] placeholder-[#8e9e94] focus:border-[#059669] focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[#6f7e75] mb-1 font-bold uppercase text-[10px]">
              GEOGRAPHIC LOCATION
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bandra Kurla Complex, Mumbai"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#fbfbfa] border border-[#dcdcd2] px-3 py-2 text-[#101512] placeholder-[#8e9e94] focus:border-[#059669] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[#6f7e75] mb-1 font-bold uppercase text-[10px]">
              FACILITY TYPOLOGY
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-[#fbfbfa] border border-[#dcdcd2] px-3 py-2 text-[#101512] focus:border-[#059669] focus:outline-hidden cursor-pointer"
            >
              <option value="Commercial Tech Campus">Commercial Tech Campus</option>
              <option value="Heavy Manufacturing Plant">Heavy Manufacturing Plant</option>
              <option value="High-Density Cold Storage">High-Density Cold Storage</option>
              <option value="Corporate Headquarters">Corporate Headquarters</option>
              <option value="R&D Data Center Lab">R&amp;D Data Center Lab</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[#6f7e75] mb-1 font-bold uppercase text-[10px]">
              SANCTIONED PEAK (kW)
            </label>
            <input
              type="number"
              required
              min="50"
              max="2000"
              value={peakThresholdKw}
              onChange={(e) => setPeakThresholdKw(Number(e.target.value))}
              className="w-full bg-[#fbfbfa] border border-[#dcdcd2] px-3 py-2 text-[#101512] focus:border-[#059669] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[#6f7e75] mb-1 font-bold uppercase text-[10px]">
              SOLAR ARRAY (kWp)
            </label>
            <input
              type="number"
              min="0"
              max="500"
              value={solarCapacityKwp}
              onChange={(e) => setSolarCapacityKwp(Number(e.target.value))}
              className="w-full bg-[#fbfbfa] border border-[#dcdcd2] px-3 py-2 text-[#101512] focus:border-[#059669] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[#6f7e75] mb-1 font-bold uppercase text-[10px]">
              FLOOR AREA (SQ FT)
            </label>
            <input
              type="number"
              min="5000"
              value={floorAreaSqFt}
              onChange={(e) => setFloorAreaSqFt(Number(e.target.value))}
              className="w-full bg-[#fbfbfa] border border-[#dcdcd2] px-3 py-2 text-[#101512] focus:border-[#059669] focus:outline-hidden"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
