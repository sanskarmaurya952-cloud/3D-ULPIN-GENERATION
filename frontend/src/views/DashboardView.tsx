import React from 'react';
import {
  MapPin,
  Building,
  Layers,
  ArrowDown,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Activity,
  FileCheck2,
  FileText,
  Play,
  Cpu,
  CheckCircle2
} from 'lucide-react';
import { Parcel, Building as BuildingType, NavView } from '../types/cadastre';

interface DashboardViewProps {
  parcels: Parcel[];
  buildings: BuildingType[];
  onNavigate: (view: NavView) => void;
  onLaunchDemoWorkflow: () => void;
  onSelectEntity: (type: 'parcel' | 'building' | 'floor' | 'unit' | 'utility', id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  parcels,
  buildings,
  onNavigate,
  onLaunchDemoWorkflow,
  onSelectEntity
}) => {
  const activities = [
    { id: '1', text: 'Parcel P-0102 spatial topology validated', time: '10 mins ago', type: 'VALIDATION' },
    { id: '2', text: 'Building BLD-0007 processed (14 storeys, 2 basements)', time: '25 mins ago', type: 'BUILDING' },
    { id: '3', text: 'Prototype ULPIN issued for Unit F08-U03', time: '40 mins ago', type: 'ULPIN' },
    { id: '4', text: 'Subsurface clash flagged: UTL-023 vs BLD-0007 (VAL-00231)', time: '1 hour ago', type: 'CONFLICT' },
    { id: '5', text: 'LiDAR DSM 0.1m elevation model synchronized', time: '2 hours ago', type: 'DATA' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto h-full text-slate-800">
      {/* Top Banner: Urban Cadastral Overview & Location Selector */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        {/* Subtle decorative background watermark */}
        <div className="absolute right-0 top-0 bottom-0 w-72 bg-gradient-to-l from-blue-50/70 to-transparent pointer-events-none opacity-60" />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight font-sans">
              Three-Dimensional Urban Cadastre
            </h1>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200 font-semibold">
              Prototype / Demonstration Dataset
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            A spatial framework for identifying, visualizing, and validating surface parcels, vertical building volumes, and subsurface infrastructure entities.
          </p>
        </div>

        {/* Location Selector */}
        <div className="bg-slate-50 border border-slate-200 rounded p-2.5 text-xs space-y-1 min-w-[260px]">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            CADASTRAL JURISDICTION
          </div>
          <div className="grid grid-cols-2 gap-x-2 text-slate-700 font-medium">
            <span className="text-slate-500">State:</span>
            <span className="text-slate-900 font-semibold">Uttar Pradesh</span>
            <span className="text-slate-500">District:</span>
            <span className="text-slate-900 font-semibold">Lucknow</span>
            <span className="text-slate-500">Urban Zone:</span>
            <span className="text-slate-900 font-semibold">Gomti Nagar (Zone 5)</span>
          </div>
        </div>
      </div>

      {/* Guided Walkthrough Callout */}
      <div className="bg-blue-950 text-white rounded border border-blue-900 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase">
              Official Demo Workflow
            </span>
            <h2 className="font-semibold text-sm text-slate-100">
              Parcel P-0102 → BLD-0007 → Floor 8 → Unit F08-U03 → Topology Review
            </h2>
          </div>
          <p className="text-xs text-blue-200/90 leading-relaxed">
            Execute the complete end-to-end multi-tier pipeline: 2D parcel verification, 14-storey vertical slicing, volumetric ULPIN generation, and subsurface utility clash adjudication.
          </p>
        </div>
        <button
          onClick={onLaunchDemoWorkflow}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2.5 rounded flex items-center gap-2 transition-colors flex-shrink-0 shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Full Walkthrough</span>
        </button>
      </div>

      {/* Compact Institutional Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('parcels')}
          className="bg-white border border-slate-300 rounded p-3.5 shadow-xs hover:border-blue-700 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">Registered Parcels</span>
            <MapPin className="w-4 h-4 text-blue-800" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">12,486</div>
          <div className="text-[10px] text-slate-400 mt-1">Zone 5 Cadastral Grid</div>
        </div>

        <div
          onClick={() => onNavigate('buildings')}
          className="bg-white border border-slate-300 rounded p-3.5 shadow-xs hover:border-blue-700 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">3D Buildings</span>
            <Building className="w-4 h-4 text-blue-800" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">3,821</div>
          <div className="text-[10px] text-slate-400 mt-1">LOD-2 Polyhedral Meshes</div>
        </div>

        <div
          onClick={() => onNavigate('units')}
          className="bg-white border border-slate-300 rounded p-3.5 shadow-xs hover:border-blue-700 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">Vertical Units</span>
            <Layers className="w-4 h-4 text-blue-800" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">18,640</div>
          <div className="text-[10px] text-slate-400 mt-1">Volumetric Property Extents</div>
        </div>

        <div
          onClick={() => onNavigate('underground')}
          className="bg-white border border-slate-300 rounded p-3.5 shadow-xs hover:border-blue-700 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">Underground Assets</span>
            <ArrowDown className="w-4 h-4 text-orange-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">1,245</div>
          <div className="text-[10px] text-slate-400 mt-1">Subsurface Utility Networks</div>
        </div>
      </div>

      {/* Main Grid: 3D Map Preview & System Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 3D Cadastre Interactive Card */}
        <div className="lg:col-span-2 bg-white border border-slate-300 rounded shadow-sm overflow-hidden flex flex-col">
          <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="font-semibold text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-900" />
              <span>Gomti Nagar Pilot Cadastre Preview</span>
            </div>
            <button
              onClick={() => onNavigate('3d-cadastre')}
              className="text-blue-800 hover:text-blue-950 font-medium flex items-center gap-1"
            >
              <span>Open Full 3D GIS Viewer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            onClick={() => onNavigate('3d-cadastre')}
            className="h-80 bg-slate-900 relative cursor-pointer group flex items-center justify-center overflow-hidden"
          >
            {/* Synthetic 3D Isometric Preview Canvas Simulation */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-[#10243e] opacity-95" />

            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* Buildings mock visual */}
            <div className="relative z-10 flex items-end gap-3 scale-90 md:scale-100">
              <div className="w-16 h-28 bg-blue-950/80 border-2 border-blue-400 rounded-t shadow-lg flex flex-col justify-around p-1 text-[8px] font-mono text-blue-300">
                <span className="text-center">B-07</span>
                <div className="h-px bg-blue-500/40" />
                <div className="h-px bg-blue-500/40" />
                <span className="text-[7px] text-center text-blue-200">14 FL</span>
              </div>
              <div className="w-20 h-44 bg-blue-900/90 border-2 border-sky-400 rounded-t shadow-2xl flex flex-col justify-around p-1 text-[8px] font-mono text-sky-200 animate-pulse">
                <span className="text-center font-bold">BLD-0007</span>
                <div className="h-px bg-sky-400/50" />
                <div className="h-px bg-sky-400/50" />
                <div className="h-px bg-sky-400/50" />
                <span className="text-[7px] text-center text-amber-300">F08-U03</span>
              </div>
              <div className="w-14 h-24 bg-slate-800/80 border-2 border-slate-500 rounded-t shadow flex flex-col justify-around p-1 text-[8px] font-mono text-slate-300">
                <span className="text-center">B-08</span>
                <div className="h-px bg-slate-600" />
                <span className="text-[7px] text-center">8 FL</span>
              </div>
            </div>

            {/* Overlay Banner */}
            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700 p-2.5 rounded flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>3D Spatial Layers Ready (Parcels, Volumes, Subsurface)</span>
              </div>
              <span className="text-blue-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Enter Viewer →
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">CRS</span>
              <span className="font-mono font-semibold text-slate-800">EPSG:4326</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Height Model</span>
              <span className="font-semibold text-slate-800">LiDAR nDSM (MSL)</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Subsurface</span>
              <span className="font-semibold text-slate-800">Z-Depth to -25.0m</span>
            </div>
          </div>
        </div>

        {/* Right Col: System Activity Feed */}
        <div className="bg-white border border-slate-300 rounded shadow-sm flex flex-col">
          <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-900" />
              <span>System Activity Log</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Live Telemetry</span>
          </div>

          <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[380px]">
            {activities.map(act => (
              <div key={act.id} className="flex gap-2.5 items-start text-xs pb-2.5 border-b border-slate-100 last:border-0 last:pb-0">
                <span className="w-2 h-2 rounded-full bg-blue-800 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-slate-800 font-medium leading-tight">{act.text}</p>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{act.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
            <button
              onClick={() => onNavigate('validation')}
              className="text-xs text-blue-800 hover:text-blue-950 font-medium"
            >
              View Full Topology Audit Report →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
