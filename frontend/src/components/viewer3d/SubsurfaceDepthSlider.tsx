import React from 'react';
import { ArrowDown, Layers, ShieldAlert } from 'lucide-react';

interface SubsurfaceDepthSliderProps {
  depth: number;
  onChangeDepth: (depth: number) => void;
}

export const SubsurfaceDepthSlider: React.FC<SubsurfaceDepthSliderProps> = ({
  depth,
  onChangeDepth
}) => {
  const depthPresets = [
    { label: 'Surface (0m)', val: 0 },
    { label: '-2.2m (Telecom)', val: -2.2 },
    { label: '-4.5m (Electrical)', val: -4.5 },
    { label: '-8.4m (Water / Conflict)', val: -8.4 },
    { label: '-12.0m (Sewer)', val: -12.0 },
    { label: '-15.5m (Tunnel)', val: -15.5 },
    { label: '-21.0m (Metro)', val: -21.0 }
  ];

  return (
    <div className="absolute bottom-12 left-3 w-64 bg-white/95 backdrop-blur-sm border border-slate-300 rounded shadow-sm p-3 text-xs z-10 text-slate-800">
      <div className="flex items-center justify-between font-semibold pb-1.5 border-b border-slate-200">
        <div className="flex items-center gap-1.5 text-slate-900">
          <ArrowDown className="w-3.5 h-3.5 text-orange-600" />
          <span>SUBSURFACE DEPTH</span>
        </div>
        <span className="font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-300 text-[11px] font-bold">
          {depth.toFixed(1)} m
        </span>
      </div>

      <div className="pt-2 pb-1">
        <input
          type="range"
          min="-25"
          max="0"
          step="0.5"
          value={depth}
          onChange={e => onChangeDepth(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
        />
      </div>

      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
        <span>-25m Deep</span>
        <span>-12.5m</span>
        <span>0m Surface</span>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-200 space-y-1">
        <div className="text-[10px] text-slate-500 font-medium">QUICK STRATUM JUMP:</div>
        <div className="grid grid-cols-2 gap-1">
          {depthPresets.slice(0, 4).map(p => (
            <button
              key={p.label}
              onClick={() => onChangeDepth(p.val)}
              className={`text-[10px] py-1 px-1.5 rounded border text-left truncate transition-colors ${
                Math.abs(depth - p.val) < 0.5
                  ? 'bg-orange-50 border-orange-400 text-orange-900 font-medium'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
