import React from 'react';
import { AlertCircle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-slate-800 text-slate-300 text-[11px] py-1 px-4 border-b border-slate-700 flex items-center justify-between select-none">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
        <span>
          <strong className="text-white font-semibold">PROTOTYPE SYSTEM:</strong> Technical Demonstration Dataset for 3D Cadastral Mapping & Vertical Property Identification (Proposed Framework for Lucknow Pilot Zone).
        </span>
      </div>
      <div className="hidden md:flex items-center gap-2 font-mono text-[10px] text-slate-400">
        <span>CRS: EPSG:4326</span>
        <span>•</span>
        <span>LOD-2 3D GIS</span>
      </div>
    </div>
  );
};
