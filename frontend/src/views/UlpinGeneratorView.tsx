import React, { useState } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  CheckCircle2,
  ShieldCheck,
  FileText,
  ArrowRight,
  Sparkles,
  Box,
  MapPin,
  Building as BuildingIcon,
  Layers,
  RotateCcw
} from 'lucide-react';
import { Parcel, Building, Floor, PropertyUnit, NavView } from '../types/cadastre';
import { cadastreApi } from '../api/client';
import { getMockFloorsForBuilding, getMockUnitsForFloor } from '../data/mockSpatialDataset';

interface UlpinGeneratorViewProps {
  parcels: Parcel[];
  buildings: Building[];
  onNavigate: (view: NavView) => void;
  onViewDigitalRecord: (ulpin: string) => void;
}

export const UlpinGeneratorView: React.FC<UlpinGeneratorViewProps> = ({
  parcels,
  buildings,
  onNavigate,
  onViewDigitalRecord
}) => {
  // Wizard State
  const [selectedParcelId, setSelectedParcelId] = useState<string>('PAR-0102');
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('BLD-0007');
  const [selectedFloorId, setSelectedFloorId] = useState<string>('BLD0007-F08');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('F08-U03');
  
  // Generation & Result State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Available options derived from selections
  const availableBuildings = buildings.filter(b => b.parcel_id === selectedParcelId);
  const availableFloors = getMockFloorsForBuilding(selectedBuildingId || 'BLD-0007');
  const availableUnits = getMockUnitsForFloor(selectedFloorId || 'BLD0007-F08');

  const handleGenerate = async () => {
    setIsGenerating(true);
    const result = await cadastreApi.generateUlpin({
      parcel_id: selectedParcelId,
      building_id: selectedBuildingId,
      floor_id: selectedFloorId,
      unit_id: selectedUnitId
    });

    setGeneratedResult(result);
    try {
      const qr = await QRCode.toDataURL(result.ulpin, {
        width: 160,
        margin: 1,
        color: { dark: '#0a192f', light: '#ffffff' }
      });
      setQrDataUrl(qr);
    } catch (_) {}
    setIsGenerating(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto overflow-y-auto h-full text-slate-800">
      {/* Header */}
      <div className="bg-white border border-slate-300 rounded p-4 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-900" />
            <span>Generate 3D ULPIN — Volumetric Cadastral Identifier</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Hierarchical Spatial Assignment Engine: 2D Parcel → 3D Building → Floor Slice → Volumetric Property Unit
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 font-semibold uppercase">
          Prototype Specification
        </span>
      </div>

      {/* Main Grid: Wizard Form & Result Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: 5-Step Generator Wizard */}
        <div className="bg-white border border-slate-300 rounded p-5 shadow-sm space-y-4 text-xs">
          <div className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
            <span>Spatial Entity Hierarchy</span>
            <span className="text-[10px] text-slate-400 font-normal">Standard 3D ULPIN Flow</span>
          </div>

          {/* Step 1: Parcel */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-900" />
              <span>1. Select Cadastral Parcel</span>
            </label>
            <select
              value={selectedParcelId}
              onChange={e => {
                setSelectedParcelId(e.target.value);
                const blds = buildings.filter(b => b.parcel_id === e.target.value);
                if (blds.length > 0) setSelectedBuildingId(blds[0].id);
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-blue-800"
            >
              {parcels.map(p => (
                <option key={p.id} value={p.id}>
                  {p.code} ({p.id}) — {p.zoning} [{p.area_sqm} m²]
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Building */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <BuildingIcon className="w-3.5 h-3.5 text-blue-900" />
              <span>2. Select 3D Building</span>
            </label>
            <select
              value={selectedBuildingId}
              onChange={e => {
                setSelectedBuildingId(e.target.value);
                const fls = getMockFloorsForBuilding(e.target.value);
                if (fls.length > 0) setSelectedFloorId(fls[0].id);
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-blue-800"
            >
              {availableBuildings.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.id}) — {b.total_floors} Storeys [{b.height_m}m]
                </option>
              ))}
            </select>
          </div>

          {/* Step 3: Floor */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-900" />
              <span>3. Select Vertical Floor Level</span>
            </label>
            <select
              value={selectedFloorId}
              onChange={e => setSelectedFloorId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-blue-800"
            >
              {availableFloors.map(f => (
                <option key={f.id} value={f.id}>
                  {f.floor_label} (Elevation: {f.elevation_min_m}m – {f.elevation_max_m}m)
                </option>
              ))}
            </select>
          </div>

          {/* Step 4: Unit */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-blue-900" />
              <span>4. Select Property Unit Volume</span>
            </label>
            <select
              value={selectedUnitId}
              onChange={e => setSelectedUnitId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-blue-800"
            >
              {availableUnits.map(u => (
                <option key={u.id} value={u.id}>
                  Unit {u.unit_number} ({u.id}) — {u.unit_type} [{u.area_sqft} sq.ft]
                </option>
              ))}
            </select>
          </div>

          {/* Step 5: Action Button */}
          <div className="pt-3">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-blue-900 hover:bg-blue-950 text-white font-semibold py-2.5 px-4 rounded flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Validating Spatial Geometry...</span>
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4" />
                  <span>Validate Geometry & Generate Prototype ULPIN</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: ULPIN Result & Property Record Action */}
        <div className="bg-white border border-slate-300 rounded p-5 shadow-sm flex flex-col justify-between text-xs">
          {generatedResult ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    3D PROPERTY IDENTIFICATION RESULT
                  </span>
                  <div className="font-mono text-sm font-bold text-blue-900 mt-1 select-all break-all">
                    {generatedResult.ulpin}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 text-[10px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {generatedResult.spatial_status}
                </span>
              </div>

              {/* QR Code & Spatial Details */}
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded p-3">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="ULPIN QR Code" className="w-24 h-24 rounded border border-slate-300 shadow-xs flex-shrink-0" />
                ) : (
                  <div className="w-24 h-24 bg-slate-200 rounded flex items-center justify-center text-slate-400">QR</div>
                )}
                <div className="space-y-1 text-[11px] text-slate-700">
                  <div>
                    <span className="text-slate-500">Parcel:</span> <strong className="font-mono">{generatedResult.parcel_code}</strong> ({generatedResult.parcel_id})
                  </div>
                  <div>
                    <span className="text-slate-500">Building:</span> <strong className="font-mono">{generatedResult.building_id}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Floor Level:</span> <strong className="font-mono">{generatedResult.floor_label}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Unit:</span> <strong className="font-mono">{generatedResult.unit_number}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Vertical Range:</span> <strong className="font-mono text-blue-900">{generatedResult.vertical_range}</strong>
                  </div>
                </div>
              </div>

              {/* 3D Volumetric Extent Coordinates */}
              <div className="border border-slate-200 rounded p-2.5 bg-white space-y-1">
                <span className="font-semibold text-slate-800 text-[11px] block">
                  3D Volumetric Bounding Box (Envelope)
                </span>
                <div className="grid grid-cols-2 gap-1 font-mono text-[10px] text-slate-600 bg-slate-50 p-2 rounded">
                  <div>X: [{generatedResult.bounding_box.xmin}, {generatedResult.bounding_box.xmax}]</div>
                  <div>Y: [{generatedResult.bounding_box.ymin}, {generatedResult.bounding_box.ymax}]</div>
                  <div>Elevation: [{generatedResult.elevation_min}, {generatedResult.elevation_max}]m</div>
                  <div>Gross Area: {generatedResult.area_sqft} sq.ft</div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono italic">
                {generatedResult.disclaimer}
              </div>

              {/* Action Button */}
              <button
                onClick={() => onViewDigitalRecord(generatedResult.ulpin)}
                className="w-full bg-blue-900 hover:bg-blue-950 text-white font-semibold py-2 px-3 rounded flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <FileText className="w-4 h-4" />
                <span>View Digital Property Record</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-full p-6 text-slate-400 space-y-2">
              <QrCode className="w-12 h-12 text-slate-300" />
              <p className="font-medium text-slate-600">No ULPIN Generated Yet</p>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Select the hierarchical cadastral entities on the left and click "Validate Geometry & Generate Prototype ULPIN".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
