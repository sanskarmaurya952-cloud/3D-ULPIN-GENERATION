import React, { useState } from 'react';
import { ArrowDown, Search, ShieldAlert, ShieldCheck, Eye, Layers } from 'lucide-react';
import { UtilityAsset, NavView } from '../types/cadastre';

interface UndergroundViewProps {
  utilities: UtilityAsset[];
  onSelectUtility: (utilityId: string) => void;
  onOpenConflictReview: (issueId: string) => void;
  onNavigate: (view: NavView) => void;
}

export const UndergroundView: React.FC<UndergroundViewProps> = ({
  utilities,
  onSelectUtility,
  onOpenConflictReview,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = utilities.filter(u =>
    u.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.material.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto h-full text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-300 rounded p-4 shadow-sm">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ArrowDown className="w-5 h-5 text-orange-600" />
            <span>Subsurface Utility & Underground Infrastructure Registry</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Volumetric 3D Utility Networks, Depth Strata & Subterranean Foundation Clash Matrix
          </p>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Asset ID, Type, Material..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-800"
          />
        </div>
      </div>

      {/* Critical Clash Alert Banner */}
      <div className="bg-red-50 border border-red-300 rounded p-3.5 flex items-center justify-between text-xs text-red-950">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-full">
            <ShieldAlert className="w-5 h-5 text-red-700" />
          </div>
          <div>
            <span className="font-bold text-red-900 uppercase tracking-wide text-[11px] block">
              Subterranean Topology Conflict Detected (VAL-00231)
            </span>
            <span className="text-red-800 text-[11px]">
              Water Pipeline <strong className="font-mono">UTL-023</strong> (depth -8.4m) intersects Building <strong className="font-mono">BLD-0007</strong> Basement-2 foundation perimeter.
            </span>
          </div>
        </div>
        <button
          onClick={() => onOpenConflictReview('VAL-00231')}
          className="bg-red-700 hover:bg-red-800 text-white font-medium py-1.5 px-3 rounded text-xs transition-colors flex-shrink-0 shadow-xs"
        >
          Review Officer Decision
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-semibold text-slate-700">
                <th className="py-2.5 px-4">ASSET ID</th>
                <th className="py-2.5 px-4">UTILITY TYPE</th>
                <th className="py-2.5 px-4">DEPTH STRATUM</th>
                <th className="py-2.5 px-4">LENGTH (M)</th>
                <th className="py-2.5 px-4">DIAMETER</th>
                <th className="py-2.5 px-4">MATERIAL SPECIFICATION</th>
                <th className="py-2.5 px-4">OPERATIONAL STATUS</th>
                <th className="py-2.5 px-4">SPATIAL CONFLICT</th>
                <th className="py-2.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-orange-950">
                    {u.id}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {u.type}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                    {u.depth_m.toFixed(1)} m
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">
                    {u.length_m} m
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">
                    {u.diameter_mm ? `${u.diameter_mm} mm` : '—'}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {u.material}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 text-[10px]">
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {u.spatial_conflict === 'POTENTIAL_CLASH_DETECTED' ? (
                      <span className="inline-flex items-center gap-1 font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-300 text-[10px]">
                        <ShieldAlert className="w-3 h-3" />
                        CLASH (VAL-00231)
                      </span>
                    ) : (
                      <span className="font-semibold text-emerald-700 text-[11px]">
                        NONE
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectUtility(u.id)}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-orange-700 hover:text-white text-slate-800 px-2.5 py-1 rounded border border-slate-300 font-medium transition-colors"
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
