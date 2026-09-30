import React, { useState } from 'react';
import { Modal } from '../common/Modal';

export const AddFacilityModal = ({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) return;

    const newFacility = {
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
      title="Enroll New Facility"
      subtitle="Connect IoT telemetry submeters, rooftop solar arrays, and peak demand limiters."
      maxWidth="lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
          >
            Provision Facility
          </button>
        </>
      }
    >
      <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">
            Facility Campus Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Mumbai Financial Center Tower C"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Geographic Location
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bandra Kurla Complex, Mumbai"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Facility Typology
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs cursor-pointer"
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
            <label className="block text-slate-700 font-semibold mb-1.5">
              Sanctioned Peak (kW)
            </label>
            <input
              type="number"
              required
              min="50"
              max="2000"
              value={peakThresholdKw}
              onChange={(e) => setPeakThresholdKw(Number(e.target.value))}
              className="w-full bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Solar Array (kWp)
            </label>
            <input
              type="number"
              min="0"
              max="500"
              value={solarCapacityKwp}
              onChange={(e) => setSolarCapacityKwp(Number(e.target.value))}
              className="w-full bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Floor Area (sq ft)
            </label>
            <input
              type="number"
              min="5000"
              value={floorAreaSqFt}
              onChange={(e) => setFloorAreaSqFt(Number(e.target.value))}
              className="w-full bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
