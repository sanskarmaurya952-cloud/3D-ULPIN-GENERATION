import React, { useState } from 'react';
import {
  UploadCloud,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Layers,
  Database,
  ArrowRight
} from 'lucide-react';
import { NavView } from '../types/cadastre';

interface DataImportViewProps {
  onNavigate: (view: NavView) => void;
}

export const DataImportView: React.FC<DataImportViewProps> = ({ onNavigate }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([
    {
      filename: 'lucknow_zone5_cadastral_parcels.geojson',
      type: 'GeoJSON',
      features: 12,
      crs: 'EPSG:4326 (WGS 84)',
      status: 'Validated',
      size: '142 KB',
      date: '2026-09-30 08:00'
    },
    {
      filename: 'shikhar_heights_bim_lod2.shp',
      type: 'ESRI Shapefile',
      features: 56,
      crs: 'EPSG:32644 (UTM 44N)',
      status: 'Validated',
      size: '1.2 MB',
      date: '2026-09-30 08:30'
    },
    {
      filename: 'gomti_nagar_lidar_dsm_0.1m.tif',
      type: 'GeoTIFF / DSM',
      features: 1,
      crs: 'EPSG:4326',
      status: 'Validated',
      size: '48.5 MB',
      date: '2026-09-30 08:45'
    }
  ]);

  const handleSimulatedUpload = (format: string) => {
    const newEntry = {
      filename: `imported_${format.toLowerCase()}_layer_${Date.now().toString().slice(-4)}.${format.toLowerCase()}`,
      type: format,
      features: 84,
      crs: 'EPSG:4326 (WGS 84)',
      status: 'Validated',
      size: '3.4 MB',
      date: 'Just now'
    };
    setUploadedFiles(prev => [newEntry, ...prev]);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto overflow-y-auto h-full text-slate-800">
      {/* Header */}
      <div className="bg-white border border-slate-300 rounded p-4 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-blue-900" />
            <span>GIS & Cadastral Data Ingestion Portal</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Spatial Data Ingestion: Automated CRS Validation, Topology Conformance & Multi-Layer Integration
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 font-semibold uppercase">
          CRS: EPSG:4326 Supported
        </span>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={e => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={e => { e.preventDefault(); setDragActive(false); handleSimulatedUpload('GeoJSON'); }}
        className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors bg-white ${
          dragActive ? 'border-blue-700 bg-blue-50/50' : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
        <h3 className="font-bold text-sm text-slate-800">Drag and Drop Cadastral GIS Files</h3>
        <p className="text-xs text-slate-500 max-w-md mt-1">
          Supported Formats: GeoJSON (.geojson, .json), Shapefile (.shp / .zip), GeoTIFF / DEM (.tif), Point Cloud (.las, .laz), CAD Floor Plans (.dxf, .dwg), GNSS Survey (.csv)
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <button
            onClick={() => handleSimulatedUpload('GeoJSON')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-3 py-1.5 rounded text-xs font-medium"
          >
            + Ingest Sample GeoJSON
          </button>
          <button
            onClick={() => handleSimulatedUpload('Shapefile')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-3 py-1.5 rounded text-xs font-medium"
          >
            + Ingest Shapefile (.zip)
          </button>
          <button
            onClick={() => handleSimulatedUpload('GeoTIFF')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-3 py-1.5 rounded text-xs font-medium"
          >
            + Ingest LiDAR GeoTIFF
          </button>
        </div>
      </div>

      {/* Ingested Layers Table */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden text-xs">
        <div className="p-3 bg-slate-100 border-b border-slate-200 font-semibold text-slate-800 flex items-center justify-between">
          <span>Ingested Spatial Datasets & Conformance Registry</span>
          <span className="text-[10px] text-slate-500 font-normal">Auto-Transformed to WGS 84</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                <th className="py-2.5 px-4">DATASET FILENAME</th>
                <th className="py-2.5 px-4">FORMAT</th>
                <th className="py-2.5 px-4">FEATURE COUNT</th>
                <th className="py-2.5 px-4">INPUT CRS</th>
                <th className="py-2.5 px-4">SIZE</th>
                <th className="py-2.5 px-4">CONFORMANCE STATUS</th>
                <th className="py-2.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {uploadedFiles.map((f, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                    {f.filename}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">{f.type}</td>
                  <td className="py-3 px-4 font-mono text-slate-800">{f.features} features</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{f.crs}</td>
                  <td className="py-3 px-4 text-slate-500">{f.size}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 text-[10px]">
                      <CheckCircle2 className="w-3 h-3" />
                      {f.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onNavigate('3d-cadastre')}
                      className="text-blue-800 hover:text-blue-950 font-medium inline-flex items-center gap-1"
                    >
                      <span>View in 3D</span>
                      <ArrowRight className="w-3 h-3" />
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
