import React, { useState } from 'react';
import { Tractor, Plus, Calendar, Layers, Leaf, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function CropTracker({ crops, onAddCrop }) {
  const [newCrop, setNewCrop] = useState({
    crop_name: '',
    sowing_date: '',
    field_size_acres: '',
    fertilizers_used: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCrop(newCrop);
    setNewCrop({
      crop_name: '',
      sowing_date: '',
      field_size_acres: '',
      fertilizers_used: ''
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Crop Entry Form Card */}
      <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-700">
            <Tractor className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">New Crop Entry</h3>
            <p className="text-slate-500 text-xs">Log field details for your ledger</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Crop Name</label>
            <input
              type="text"
              placeholder="e.g. Wheat, Paddy, Mustard"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition-all"
              value={newCrop.crop_name}
              onChange={(e) => setNewCrop({ ...newCrop, crop_name: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Sowing Date</label>
            <input
              type="date"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition-all"
              value={newCrop.sowing_date}
              onChange={(e) => setNewCrop({ ...newCrop, sowing_date: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Field Size (Acres)</label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 2.5"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition-all"
              value={newCrop.field_size_acres}
              onChange={(e) => setNewCrop({ ...newCrop, field_size_acres: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Fertilizers & Soil Inputs</label>
            <input
              type="text"
              placeholder="e.g. Urea, DAP, Potash"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition-all"
              value={newCrop.fertilizers_used}
              onChange={(e) => setNewCrop({ ...newCrop, fertilizers_used: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Save Record
          </button>
        </form>
      </div>

      {/* Active Crop Cards Feed */}
      <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Active Crop Records</h3>
            <p className="text-slate-500 text-xs">Real-time status of your registered plots</p>
          </div>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
            {crops.length} {crops.length === 1 ? 'Plot' : 'Plots'} Total
          </span>
        </div>

        {crops.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
            <Leaf className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium text-sm">No crops logged yet</p>
            <p className="text-slate-400 text-xs mt-1">Use the entry form on the left to start tracking your harvest.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crops.map((crop) => (
              <div
                key={crop.id}
                className="group relative bg-slate-50/80 border border-slate-200/80 hover:border-emerald-300 rounded-2xl p-4 transition-all hover:shadow-md hover:bg-white"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">
                      {crop.crop_name}
                    </h4>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full mt-1">
                      <CheckCircle2 className="w-3 h-3" /> Active Growing
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200/60 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="w-3.5 h-3.5" /> Sown Date:
                    </span>
                    <strong className="text-slate-800">{crop.sowing_date ? crop.sowing_date.split('T')[0] : 'N/A'}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Layers className="w-3.5 h-3.5" /> Area:
                    </span>
                    <strong className="text-slate-800">{crop.field_size_acres || '--'} Acres</strong>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-500">Fertilizer Inputs:</span>
                    <span className="truncate max-w-[140px] text-slate-800 font-medium">
                      {crop.fertilizers_used || 'Standard Soil'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}