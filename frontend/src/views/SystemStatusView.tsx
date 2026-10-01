import React from 'react';
import {
  Server,
  CheckCircle2,
  Cpu,
  Database,
  Layers,
  Shield,
  Activity,
  Globe,
  Code
} from 'lucide-react';
import { UserRole } from '../types/cadastre';

interface SystemStatusViewProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
}

export const SystemStatusView: React.FC<SystemStatusViewProps> = ({
  currentRole,
  onChangeRole
}) => {
  const modules = [
    { name: 'GIS Processing Engine', status: 'Operational', type: 'Core Geospatial', latency: '12ms', crs: 'EPSG:4326 / EPSG:3857' },
    { name: '3D Visualization Engine', status: 'Operational', type: 'WebGL / Three.js LOD-2', latency: '60 FPS', crs: 'Local Metric Heights' },
    { name: '3D ULPIN Assignment Engine', status: 'Operational', type: 'Volumetric Identifier v1.2', latency: '5ms', crs: 'Hierarchical 3D Standard' },
    { name: 'Spatial Topology Engine', status: 'Operational', type: '7-Rule Subsurface & 3D Audit', latency: '18ms', crs: 'Multi-Tier Validation' },
    { name: 'AI Photogrammetry Pipeline', status: 'Demonstration', type: 'Synthetic Ingestion Model', latency: '3.4s', crs: 'Orthophoto / DSM' },
    { name: 'Cadastral Spatial Database', status: 'Operational', type: 'In-Memory Indexed Store', latency: '2ms', crs: '120+ Volumetric Records' },
    { name: 'REST API Gateway', status: 'Operational', type: 'FastAPI Backend', latency: '99.98% Uptime', crs: 'JSON OpenAPI 3.0' }
  ];

  const dataSources = [
    { layer: 'Cadastral Parcels Layer', source: 'State Land Records GIS Directorate (Demonstration Dataset)', crs: 'EPSG:4326', features: '12 Parcels', sync: '2026-09-30 08:00' },
    { layer: '3D Building Footprints & LOD-2', source: 'Urban Development Authority Drone Survey (Synthetic 3D Mesh)', crs: 'EPSG:4326', features: '8 Structures', sync: '2026-09-30 08:30' },
    { layer: 'LiDAR Digital Surface Model (DSM)', source: 'Synthetic Airborne LiDAR (Demonstration DSM)', crs: 'WGS 84 / MSL', features: '1 Grid Raster', sync: '2026-09-30 08:15' },
    { layer: 'Architectural Vertical BIM Slices', source: 'Approved Municipal Sanction Plans (Synthetic BIM)', crs: 'Local Building Grid', features: '120 Units', sync: '2026-09-30 09:00' },
    { layer: 'Subsurface Utility Asset Registry', source: 'Municipal Utility GIS & Ground Penetrating Radar (GPR)', crs: 'EPSG:4326 / Depths', features: '8 Assets', sync: '2026-09-30 09:10' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto overflow-y-auto h-full text-slate-800">
      {/* Header */}
      <div className="bg-white border border-slate-300 rounded p-4 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-900" />
            <span>System Operational Telemetry & Provenance</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Technical Architecture Telemetry, GIS Processing Status & Cadastral Data Source Traceability
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>ALL GIS CORES OPERATIONAL</span>
        </div>
      </div>

      {/* Engine Status Grid */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden text-xs">
        <div className="p-3 bg-slate-100 border-b border-slate-200 font-semibold text-slate-800 flex items-center justify-between">
          <span>Core System Component Telemetry</span>
          <span className="text-[10px] text-slate-500 font-normal">v2.4.0-prototype</span>
        </div>
        <div className="divide-y divide-slate-200">
          {modules.map((m, i) => (
            <div key={i} className="p-3 flex items-center justify-between hover:bg-slate-50">
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-900">{m.name}</span>
                <span className="text-[11px] text-slate-500 block">{m.type} • {m.crs}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-slate-400">{m.latency}</span>
                <span
                  className={`font-semibold text-[10px] px-2 py-0.5 rounded border ${
                    m.status === 'Operational'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-blue-50 text-blue-700 border-blue-300'
                  }`}
                >
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Source Provenance Matrix */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden text-xs">
        <div className="p-3 bg-slate-100 border-b border-slate-200 font-semibold text-slate-800">
          GIS Data Source Traceability & Provenance
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                <th className="py-2 px-4">LAYER NAME</th>
                <th className="py-2 px-4">DATA SOURCE / PROVENANCE</th>
                <th className="py-2 px-4">CRS</th>
                <th className="py-2 px-4">FEATURES</th>
                <th className="py-2 px-4 text-right">LAST SYNC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {dataSources.map((ds, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-semibold text-slate-900">{ds.layer}</td>
                  <td className="py-2.5 px-4 text-slate-700">{ds.source}</td>
                  <td className="py-2.5 px-4 font-mono text-slate-600">{ds.crs}</td>
                  <td className="py-2.5 px-4 font-mono text-slate-800">{ds.features}</td>
                  <td className="py-2.5 px-4 text-slate-400 text-right font-mono text-[10px]">{ds.sync}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Authority / Role Model Panel */}
      <div className="bg-white border border-slate-300 rounded p-4 shadow-sm space-y-3 text-xs">
        <div className="font-semibold text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
          <span>Security & Authority Role Model</span>
          <span className="text-[10px] text-slate-500 font-mono">Active: {currentRole}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div
            onClick={() => onChangeRole('VIEWER')}
            className={`p-3 rounded border cursor-pointer transition-colors ${
              currentRole === 'VIEWER' ? 'bg-blue-50 border-blue-600 text-blue-950 font-medium' : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <strong className="block text-slate-900">Cadastral Viewer</strong>
            <p className="text-[11px] text-slate-500 mt-1">Read-only permissions: View 3D cadastre maps, search ULPIN registry, inspect property records.</p>
          </div>

          <div
            onClick={() => onChangeRole('SURVEY_OFFICER')}
            className={`p-3 rounded border cursor-pointer transition-colors ${
              currentRole === 'SURVEY_OFFICER' ? 'bg-blue-50 border-blue-600 text-blue-950 font-medium' : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <strong className="block text-slate-900">Survey Officer (Active)</strong>
            <p className="text-[11px] text-slate-500 mt-1">Operational permissions: Run 3D topology checks, review subterranean utility conflicts, approve variances, issue ULPINs.</p>
          </div>

          <div
            onClick={() => onChangeRole('ADMINISTRATOR')}
            className={`p-3 rounded border cursor-pointer transition-colors ${
              currentRole === 'ADMINISTRATOR' ? 'bg-blue-50 border-blue-600 text-blue-950 font-medium' : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <strong className="block text-slate-900">Administrator</strong>
            <p className="text-[11px] text-slate-500 mt-1">Full permissions: Ingest GIS layers, configure coordinate systems, manage spatial rules, manage datasets.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
