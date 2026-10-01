import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { LayerVisibilityState } from '../../types/cadastre';

interface LayerControlPanelProps {
  layerState: LayerVisibilityState;
  setLayerState: React.Dispatch<React.SetStateAction<LayerVisibilityState>>;
}

export const LayerControlPanel: React.FC<LayerControlPanelProps> = ({
  layerState,
  setLayerState
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleLayer = (key: keyof LayerVisibilityState) => {
    setLayerState(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="absolute top-14 left-3 w-60 bg-white/95 backdrop-blur-sm border border-slate-300 rounded shadow-sm z-10 text-xs overflow-hidden">
      {/* Panel Header */}
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center justify-between px-3 py-2 bg-slate-100 border-b border-slate-200 cursor-pointer hover:bg-slate-200/70 select-none"
      >
        <div className="flex items-center gap-2 font-semibold text-slate-800 tracking-wide">
          <Layers className="w-3.5 h-3.5 text-blue-900" />
          <span>GIS LAYERS</span>
        </div>
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
        )}
      </div>

      {!isCollapsed && (
        <div className="p-2.5 space-y-1.5 text-slate-700">
          <label className="flex items-center justify-between px-1.5 py-1 rounded hover:bg-slate-50 cursor-pointer">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />
              Cadastral Parcels
            </span>
            <input
              type="checkbox"
              checked={layerState.parcels}
              onChange={() => toggleLayer('parcels')}
              className="rounded border-slate-300 text-blue-900 focus:ring-blue-800 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between px-1.5 py-1 rounded hover:bg-slate-50 cursor-pointer">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-600 inline-block" />
              3D Buildings (LOD-2)
            </span>
            <input
              type="checkbox"
              checked={layerState.buildings}
              onChange={() => toggleLayer('buildings')}
              className="rounded border-slate-300 text-blue-900 focus:ring-blue-800 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between px-1.5 py-1 rounded hover:bg-slate-50 cursor-pointer">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-600 inline-block" />
              Vertical Floor Slices
            </span>
            <input
              type="checkbox"
              checked={layerState.floors}
              onChange={() => toggleLayer('floors')}
              className="rounded border-slate-300 text-blue-900 focus:ring-blue-800 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between px-1.5 py-1 rounded hover:bg-slate-50 cursor-pointer">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500 inline-block" />
              3D Property Units
            </span>
            <input
              type="checkbox"
              checked={layerState.propertyUnits}
              onChange={() => toggleLayer('propertyUnits')}
              className="rounded border-slate-300 text-blue-900 focus:ring-blue-800 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between px-1.5 py-1 rounded hover:bg-slate-50 cursor-pointer">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-400 inline-block" />
              Roads & Corridors
            </span>
            <input
              type="checkbox"
              checked={layerState.roads}
              onChange={() => toggleLayer('roads')}
              className="rounded border-slate-300 text-blue-900 focus:ring-blue-800 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between px-1.5 py-1 rounded hover:bg-slate-50 cursor-pointer">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-orange-600 inline-block" />
              Underground Utilities
            </span>
            <input
              type="checkbox"
              checked={layerState.undergroundUtilities}
              onChange={() => toggleLayer('undergroundUtilities')}
              className="rounded border-slate-300 text-blue-900 focus:ring-blue-800 cursor-pointer"
            />
          </label>

          <div className="h-px bg-slate-200 my-1.5" />

          <label className="flex items-center justify-between px-1.5 py-1 rounded hover:bg-slate-50 cursor-pointer text-slate-500">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm border border-slate-400 inline-block" />
              Transit Corridors
            </span>
            <input
              type="checkbox"
              checked={layerState.depthGrid}
              onChange={() => toggleLayer('depthGrid')}
              className="rounded border-slate-300 text-blue-900 focus:ring-blue-800 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between px-1.5 py-1 rounded hover:bg-slate-50 cursor-pointer text-slate-500">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm border border-slate-400 inline-block" />
              Air-Rights Envelope
            </span>
            <input
              type="checkbox"
              checked={layerState.airRights}
              onChange={() => toggleLayer('airRights')}
              className="rounded border-slate-300 text-blue-900 focus:ring-blue-800 cursor-pointer"
            />
          </label>
        </div>
      )}
    </div>
  );
};
