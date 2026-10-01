import React, { useState } from 'react';
import { Building as BuildingIcon, Search, Eye, Split, ShieldCheck, Layers } from 'lucide-react';
import { Building, NavView } from '../types/cadastre';

interface BuildingsViewProps {
  buildings: Building[];
  onSelectBuilding: (buildingId: string) => void;
  onNavigate: (view: NavView) => void;
}

export const BuildingsView: React.FC<BuildingsViewProps> = ({
  buildings,
  onSelectBuilding,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = buildings.filter(b =>
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.parcel_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.structure_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto h-full text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-300 rounded p-4 shadow-sm">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BuildingIcon className="w-5 h-5 text-blue-900" />
            <span>3D Buildings & Vertical Structures Registry</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            LOD-2 Polyhedral Geometry, Vertical Slices & Subsurface Foundations — Lucknow Gomti Nagar Pilot Zone
          </p>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Building ID, Name, Parcel..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-800"
          />
        </div>
      </div>

      {/* Buildings Cards / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(b => (
          <div
            key={b.id}
            className="bg-white border border-slate-300 rounded shadow-xs p-4 hover:border-blue-700 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    {b.id}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-1.5">{b.name}</h3>
                  <span className="text-[11px] text-slate-500 font-mono">Parent Parcel: {b.parcel_id}</span>
                </div>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 text-[10px]">
                  <ShieldCheck className="w-3 h-3" />
                  {b.cadastral_status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200 text-xs text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Total Floors</span>
                  <span className="font-bold text-slate-900">{b.total_floors} Storeys</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Height (LOD-2)</span>
                  <span className="font-bold text-slate-900">{b.height_m.toFixed(1)} m</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Units Count</span>
                  <span className="font-bold text-slate-900">{b.total_units} Units</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Built-up Area</span>
                  <span className="font-semibold text-slate-800">{b.built_up_area_sqft.toLocaleString()} sq.ft</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Basements</span>
                  <span className="font-semibold text-slate-800">{b.basement_levels} Subsurface</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Elevation (MSL)</span>
                  <span className="font-semibold text-slate-800">{b.base_elevation_m} – {b.roof_elevation_m}m</span>
                </div>
              </div>

              <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
                <span className="font-medium text-slate-700">Structure:</span> {b.structure_type}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => onSelectBuilding(b.id)}
                className="bg-blue-900 hover:bg-blue-950 text-white font-medium py-1.5 px-3 rounded flex items-center gap-1.5 text-xs transition-colors shadow-xs"
              >
                <Split className="w-3.5 h-3.5" />
                <span>View Vertical Structure</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
