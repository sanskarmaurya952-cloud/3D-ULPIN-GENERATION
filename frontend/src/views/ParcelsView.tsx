import React, { useState } from 'react';
import { MapPin, Search, ExternalLink, ShieldCheck, Eye, Layers } from 'lucide-react';
import { Parcel, NavView } from '../types/cadastre';

interface ParcelsViewProps {
  parcels: Parcel[];
  onSelectParcel: (parcelId: string) => void;
  onNavigate: (view: NavView) => void;
}

export const ParcelsView: React.FC<ParcelsViewProps> = ({
  parcels,
  onSelectParcel,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = parcels.filter(p =>
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.survey_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.zoning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto h-full text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-300 rounded p-4 shadow-sm">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-900" />
            <span>Surface Cadastral Parcels Registry</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Demonstration Cadastre for Zone 5 (Gomti Nagar, Lucknow) — EPSG:4326
          </p>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Parcel Code, Survey No, Zoning..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-800"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-semibold text-slate-700">
                <th className="py-2.5 px-4">PARCEL CODE</th>
                <th className="py-2.5 px-4">SURVEY NUMBER</th>
                <th className="py-2.5 px-4">AREA (SQ.M / SQ.FT)</th>
                <th className="py-2.5 px-4">FAR (ALLOWED / UTILIZED)</th>
                <th className="py-2.5 px-4">ZONING CLASSIFICATION</th>
                <th className="py-2.5 px-4">3D STRUCTURES</th>
                <th className="py-2.5 px-4">STATUS</th>
                <th className="py-2.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-900">
                    {p.code} <span className="text-[10px] text-slate-400 font-normal">({p.id})</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">
                    {p.survey_number}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900">{p.area_sqm.toLocaleString()} m²</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{p.area_sqft.toLocaleString()} sq.ft</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{p.far_utilized} / {p.far_allowed}</span>
                      <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-800 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, (p.far_utilized / p.far_allowed) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {p.zoning}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800">{p.buildings_count} Building{p.buildings_count !== 1 ? 's' : ''}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 text-[10px]">
                      <ShieldCheck className="w-3 h-3" />
                      {p.validation_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectParcel(p.id)}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-blue-900 hover:text-white text-slate-800 px-2.5 py-1 rounded border border-slate-300 font-medium transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect 3D</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
