import React, { useState } from 'react';
import { Search, QrCode, FileText, Eye, ShieldCheck, Box, MapPin, Building } from 'lucide-react';
import { NavView } from '../types/cadastre';
import { cadastreApi } from '../api/client';

interface UlpinSearchViewProps {
  onNavigate: (view: NavView) => void;
  onViewDigitalRecord: (ulpin: string) => void;
  onSelectEntity: (type: 'parcel' | 'building' | 'floor' | 'unit' | 'utility', id: string) => void;
}

export const UlpinSearchView: React.FC<UlpinSearchViewProps> = ({
  onNavigate,
  onViewDigitalRecord,
  onSelectEntity
}) => {
  const [query, setQuery] = useState('IN-LKO-GN5-102-B07-F08-U03');
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (searchStr?: string) => {
    const q = searchStr || query;
    if (!q.trim()) return;
    const res = await cadastreApi.search(q);
    setResults(res);
    setSearched(true);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto overflow-y-auto h-full text-slate-800">
      {/* Header */}
      <div className="bg-white border border-slate-300 rounded p-4 shadow-sm">
        <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-900" />
          <span>3D ULPIN & Spatial Registry Lookup</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Query by Prototype 3D ULPIN, Parcel Survey Code, Multi-Storey Building ID, or Subsurface Utility Asset
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white border border-slate-300 rounded p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Enter ULPIN (e.g. IN-LKO-GN5-102-B07-F08-U03), Parcel (P-0102), Building (BLD-0007)..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-800 font-mono text-slate-900"
          />
        </div>
        <button
          onClick={() => handleSearch()}
          className="bg-blue-900 hover:bg-blue-950 text-white font-semibold text-xs px-6 py-2 rounded transition-colors shadow-xs"
        >
          Search Registry
        </button>
      </div>

      {/* Quick Example Queries */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 text-[11px] font-medium">Quick Examples:</span>
        <button
          onClick={() => { setQuery('IN-LKO-GN5-102-B07-F08-U03'); handleSearch('IN-LKO-GN5-102-B07-F08-U03'); }}
          className="bg-slate-100 hover:bg-slate-200 text-blue-900 font-mono text-[11px] px-2 py-0.5 rounded border border-slate-300"
        >
          IN-LKO-GN5-102-B07-F08-U03
        </button>
        <button
          onClick={() => { setQuery('BLD-0007'); handleSearch('BLD-0007'); }}
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-[11px] px-2 py-0.5 rounded border border-slate-300"
        >
          BLD-0007
        </button>
        <button
          onClick={() => { setQuery('P-0102'); handleSearch('P-0102'); }}
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-[11px] px-2 py-0.5 rounded border border-slate-300"
        >
          P-0102
        </button>
        <button
          onClick={() => { setQuery('UTL-023'); handleSearch('UTL-023'); }}
          className="bg-slate-100 hover:bg-slate-200 text-orange-900 font-mono text-[11px] px-2 py-0.5 rounded border border-slate-300"
        >
          UTL-023
        </button>
      </div>

      {/* Search Results */}
      {searched && (
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-700">
            Matching Cadastral Records ({results.length})
          </div>

          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map((r, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-300 rounded p-4 shadow-xs hover:border-blue-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                        {r.category}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm">{r.title}</h3>
                    </div>
                    <p className="text-slate-600 font-mono text-xs">{r.subtitle}</p>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Spatial Anchor: [{r.coordinates.join(', ')}]
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => onSelectEntity(r.entity_type, r.entity_id)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-3 py-1.5 rounded flex items-center gap-1 font-medium transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Locate in 3D Map</span>
                    </button>

                    {r.category === 'ULPIN' && (
                      <button
                        onClick={() => onViewDigitalRecord(r.id)}
                        className="bg-blue-900 hover:bg-blue-950 text-white px-3 py-1.5 rounded flex items-center gap-1 font-medium transition-colors shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Property Record</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-white border border-slate-300 rounded text-center text-xs text-slate-500">
              No matching cadastral entity found for "{query}".
            </div>
          )}
        </div>
      )}
    </div>
  );
};
