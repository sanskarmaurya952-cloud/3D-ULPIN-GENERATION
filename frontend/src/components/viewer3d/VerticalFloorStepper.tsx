import React from 'react';
import { Building as BuildingIcon, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { Floor } from '../../types/cadastre';

interface VerticalFloorStepperProps {
  floors: Floor[];
  selectedFloorNumber: number | null;
  onSelectFloor: (floorNumber: number) => void;
  onClearFloor: () => void;
}

export const VerticalFloorStepper: React.FC<VerticalFloorStepperProps> = ({
  floors,
  selectedFloorNumber,
  onSelectFloor,
  onClearFloor
}) => {
  // Sort floors top-to-bottom (Floor 14 down to Basement 2)
  const sortedFloors = [...floors].sort((a, b) => b.floor_number - a.floor_number);

  return (
    <div className="absolute top-14 right-80 w-36 bg-white/95 backdrop-blur-sm border border-slate-300 rounded shadow-sm overflow-hidden z-10 text-xs">
      <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-100 border-b border-slate-200">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-[11px]">
          <BuildingIcon className="w-3 h-3 text-blue-900" />
          <span>VERTICAL STACK</span>
        </div>
        {selectedFloorNumber !== null && (
          <button
            onClick={onClearFloor}
            className="text-[10px] text-blue-700 hover:underline font-medium"
          >
            All
          </button>
        )}
      </div>

      <div className="max-h-72 overflow-y-auto p-1 space-y-0.5 scrollbar-thin">
        {sortedFloors.map(fl => {
          const isSelected = selectedFloorNumber === fl.floor_number;
          const isBasement = fl.floor_number < 0;
          const isGround = fl.floor_number === 0;

          return (
            <button
              key={fl.id}
              onClick={() => onSelectFloor(fl.floor_number)}
              className={`w-full text-left px-2 py-1 rounded flex items-center justify-between transition-colors ${
                isSelected
                  ? 'bg-blue-900 text-white font-semibold'
                  : isBasement
                  ? 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  : isGround
                  ? 'bg-slate-100 text-slate-800 hover:bg-slate-200 font-medium'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-mono text-[10px]">{fl.floor_label}</span>
              </div>
              <span className={`text-[9px] font-mono ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                {fl.elevation_min_m.toFixed(1)}m
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
