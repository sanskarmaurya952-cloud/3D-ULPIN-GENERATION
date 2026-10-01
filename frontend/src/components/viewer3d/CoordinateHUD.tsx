import React from 'react';
import { Compass, Globe, MapPin } from 'lucide-react';

interface CoordinateHUDProps {
  coords: {
    x: number;
    y: number;
    z: number;
    lat: number;
    lon: number;
    elevation: number;
  };
}

export const CoordinateHUD: React.FC<CoordinateHUDProps> = ({ coords }) => {
  return (
    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm border border-slate-300 rounded shadow-sm px-3 py-1.5 flex items-center gap-4 text-[11px] font-mono text-slate-700 select-none z-10">
      <div className="flex items-center gap-1.5 font-sans font-medium text-slate-900">
        <MapPin className="w-3 h-3 text-blue-900" />
        <span>EPSG:4326</span>
      </div>

      <div className="h-3 w-px bg-slate-300" />

      <div>
        <span className="text-slate-400 font-sans text-[10px] mr-1">LAT:</span>
        <span className="font-semibold text-slate-900">{coords.lat.toFixed(6)}° N</span>
      </div>

      <div>
        <span className="text-slate-400 font-sans text-[10px] mr-1">LON:</span>
        <span className="font-semibold text-slate-900">{coords.lon.toFixed(6)}° E</span>
      </div>

      <div className="h-3 w-px bg-slate-300" />

      <div>
        <span className="text-slate-400 font-sans text-[10px] mr-1">ELEV (MSL):</span>
        <span className="font-semibold text-slate-900">{coords.elevation.toFixed(2)} m</span>
      </div>

      <div className="h-3 w-px bg-slate-300" />

      <div className="text-slate-500 font-sans text-[10px]">
        Zone: <span className="text-slate-800 font-medium">Gomti Nagar, Zone 5</span>
      </div>
    </div>
  );
};
