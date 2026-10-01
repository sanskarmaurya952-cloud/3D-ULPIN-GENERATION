import React from 'react';
import {
  Layers,
  Box,
  Compass,
  RotateCcw,
  Ruler,
  Maximize2,
  Split,
  Eye,
  Sliders
} from 'lucide-react';
import { LayerVisibilityState } from '../../types/cadastre';

interface ViewerControlsProps {
  layerState: LayerVisibilityState;
  setLayerState: React.Dispatch<React.SetStateAction<LayerVisibilityState>>;
  onResetCamera: () => void;
}

export const ViewerControls: React.FC<ViewerControlsProps> = ({
  layerState,
  setLayerState,
  onResetCamera
}) => {
  return (
    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
      {/* Top Left: 2D/3D Mode & Basemap Selector */}
      <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm border border-slate-300 rounded shadow-sm p-1 pointer-events-auto text-xs text-slate-800">
        <button
          onClick={() => setLayerState(prev => ({ ...prev, viewMode: '3D' }))}
          className={`px-2.5 py-1 rounded font-medium transition-colors ${
            layerState.viewMode === '3D'
              ? 'bg-gov-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          3D Cadastre
        </button>
        <button
          onClick={() => setLayerState(prev => ({ ...prev, viewMode: '2D' }))}
          className={`px-2.5 py-1 rounded font-medium transition-colors ${
            layerState.viewMode === '2D'
              ? 'bg-gov-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          2D Ortho
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* Basemap Select */}
        <div className="flex items-center gap-1 pl-1">
          <span className="text-[11px] text-slate-500 font-medium">Basemap:</span>
          <select
            value={layerState.basemap}
            onChange={e => setLayerState(prev => ({ ...prev, basemap: e.target.value as any }))}
            className="bg-slate-50 border border-slate-300 rounded px-1.5 py-0.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-800 cursor-pointer"
          >
            <option value="vector">Vector Cadastre</option>
            <option value="satellite">Satellite Orthomosaic</option>
            <option value="dark">Dark Engineering</option>
            <option value="topo">Topographic Elevation</option>
          </select>
        </div>
      </div>

      {/* Top Right: GIS View Actions */}
      <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm border border-slate-300 rounded shadow-sm p-1 pointer-events-auto text-xs text-slate-700">
        <button
          onClick={() => setLayerState(prev => ({ ...prev, isolationMode: !prev.isolationMode }))}
          title="Toggle Building Structure Isolation"
          className={`flex items-center gap-1 px-2 py-1 rounded font-medium transition-colors ${
            layerState.isolationMode
              ? 'bg-blue-800 text-white'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Split className="w-3.5 h-3.5" />
          <span>Isolate</span>
        </button>

        <button
          onClick={() => setLayerState(prev => ({ ...prev, highlightConflict: !prev.highlightConflict }))}
          title="Highlight Subterranean Spatial Conflict"
          className={`flex items-center gap-1 px-2 py-1 rounded font-medium transition-colors ${
            layerState.highlightConflict
              ? 'bg-red-700 text-white'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
          <span>Clash Layer</span>
        </button>

        <div className="h-4 w-px bg-slate-300 mx-0.5" />

        <button
          onClick={onResetCamera}
          title="Reset Camera View to Gomti Nagar Center"
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100 text-slate-700 font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset View</span>
        </button>
      </div>
    </div>
  );
};
