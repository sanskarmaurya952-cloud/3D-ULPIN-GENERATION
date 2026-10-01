import React from 'react';
import {
  Building as BuildingIcon,
  Layers,
  MapPin,
  Maximize2,
  FileText,
  ShieldCheck,
  ShieldAlert,
  QrCode,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Box,
  Split,
  Eye
} from 'lucide-react';
import {
  Parcel,
  Building,
  Floor,
  PropertyUnit,
  UtilityAsset
} from '../../types/cadastre';

interface PropertyInspectorProps {
  selectedType: 'parcel' | 'building' | 'floor' | 'unit' | 'utility' | null;
  selectedParcel?: Parcel | null;
  selectedBuilding?: Building | null;
  selectedFloor?: Floor | null;
  selectedUnit?: PropertyUnit | null;
  selectedUtility?: UtilityAsset | null;
  onViewVerticalStructure: () => void;
  onSelectFloorNumber: (fNum: number) => void;
  onGenerateUlpin: () => void;
  onOpenConflictReview: (issueId: string) => void;
  onViewDigitalRecord: (ulpin: string) => void;
  onClose: () => void;
}

export const PropertyInspector: React.FC<PropertyInspectorProps> = ({
  selectedType,
  selectedParcel,
  selectedBuilding,
  selectedFloor,
  selectedUnit,
  selectedUtility,
  onViewVerticalStructure,
  onSelectFloorNumber,
  onGenerateUlpin,
  onOpenConflictReview,
  onViewDigitalRecord,
  onClose
}) => {
  if (!selectedType) {
    return (
      <div className="w-76 bg-white border-l border-slate-300 p-4 text-xs text-slate-500 flex flex-col items-center justify-center text-center h-full select-none">
        <Box className="w-8 h-8 text-slate-300 mb-2" />
        <p className="font-medium text-slate-700">No Cadastral Entity Selected</p>
        <p className="text-[11px] text-slate-400 mt-1">
          Click on any parcel, building, floor slice, unit volume, or subsurface utility in the 3D map.
        </p>
      </div>
    );
  }

  return (
    <div className="w-76 bg-white border-l border-slate-300 flex flex-col h-full overflow-y-auto text-xs text-slate-800 shadow-sm">
      {/* Header */}
      <div className="px-3.5 py-2.5 bg-slate-900 text-white flex items-center justify-between">
        <div className="font-semibold tracking-wider text-[11px] flex items-center gap-1.5 uppercase">
          {selectedType === 'unit' && <Box className="w-3.5 h-3.5 text-blue-400" />}
          {selectedType === 'building' && <BuildingIcon className="w-3.5 h-3.5 text-blue-400" />}
          {selectedType === 'parcel' && <MapPin className="w-3.5 h-3.5 text-blue-400" />}
          {selectedType === 'utility' && <Layers className="w-3.5 h-3.5 text-orange-400" />}
          <span>{selectedType} Information</span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-xs px-1 font-mono"
        >
          ✕
        </button>
      </div>

      <div className="p-3.5 space-y-4">
        {/* UNIT VIEW */}
        {selectedType === 'unit' && selectedUnit && (
          <>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                PROTOTYPE 3D ULPIN
              </div>
              <div className="font-mono text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 p-2 rounded break-all select-all">
                {selectedUnit.ulpin}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded p-2.5 space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 font-medium">Parcel ID</span>
                <span className="font-mono font-bold text-slate-900">{selectedUnit.parcel_id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 font-medium">Building ID</span>
                <span className="font-mono font-bold text-slate-900">{selectedUnit.building_id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 font-medium">Floor Level</span>
                <span className="font-mono font-bold text-slate-900">
                  {selectedUnit.floor_number < 10 && selectedUnit.floor_number >= 0 ? `0${selectedUnit.floor_number}` : selectedUnit.floor_number}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 font-medium">Unit Number</span>
                <span className="font-mono font-bold text-slate-900">{selectedUnit.unit_number}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 font-medium">Elevation (MSL)</span>
                <span className="font-mono text-slate-800">
                  {selectedUnit.bounding_box.elevation_min.toFixed(2)} – {selectedUnit.bounding_box.elevation_max.toFixed(2)} m
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 font-medium">Built-up Area</span>
                <span className="font-semibold text-slate-800">{selectedUnit.area_sqft.toLocaleString()} sq.ft</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 font-medium">Carpet Area</span>
                <span className="text-slate-800">{selectedUnit.carpet_area_sqft.toLocaleString()} sq.ft</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-slate-500 font-medium">Status</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300 text-[10px]">
                  <ShieldCheck className="w-3 h-3" />
                  VALIDATED
                </span>
              </div>
            </div>

            {/* 3D Volumetric Extent Details */}
            <div className="border border-slate-200 rounded p-2 text-[11px] bg-white">
              <div className="font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>3D VOLUMETRIC EXTENT</span>
                <span className="text-[10px] text-slate-400 font-mono">EPSG:4326/Metric</span>
              </div>
              <div className="grid grid-cols-2 gap-1 font-mono text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded">
                <div>X: [{selectedUnit.bounding_box.xmin}, {selectedUnit.bounding_box.xmax}]</div>
                <div>Y: [{selectedUnit.bounding_box.ymin}, {selectedUnit.bounding_box.ymax}]</div>
                <div>Z (rel): [{selectedUnit.bounding_box.zmin}, {selectedUnit.bounding_box.zmax}]m</div>
                <div>H-Clearance: 3.00m</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => onViewDigitalRecord(selectedUnit.ulpin)}
                className="w-full bg-blue-900 hover:bg-blue-950 text-white font-medium py-2 px-3 rounded flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Digital Property Record</span>
              </button>

              <button
                onClick={onGenerateUlpin}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-medium py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors"
              >
                <QrCode className="w-3.5 h-3.5 text-blue-900" />
                <span>Re-verify 3D ULPIN</span>
              </button>
            </div>
          </>
        )}

        {/* BUILDING VIEW */}
        {selectedType === 'building' && selectedBuilding && (
          <>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
                BUILDING PROFILE
              </div>
              <div className="font-bold text-sm text-slate-900">{selectedBuilding.name}</div>
              <div className="font-mono text-xs text-blue-900 font-semibold mt-0.5">{selectedBuilding.id}</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded p-2.5 space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 font-medium">Parcel</span>
                <span className="font-mono font-bold text-slate-900">{selectedBuilding.parcel_id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 font-medium">Total Floors</span>
                <span className="font-bold text-slate-900">{selectedBuilding.total_floors} Storeys</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 font-medium">Height</span>
                <span className="font-semibold text-slate-900">{selectedBuilding.height_m.toFixed(1)} m</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 font-medium">Built-up Area</span>
                <span className="font-semibold text-slate-900">{selectedBuilding.built_up_area_sqft.toLocaleString()} sq.ft</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 font-medium">Property Units</span>
                <span className="font-semibold text-slate-900">{selectedBuilding.total_units} Units</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 font-medium">Basement Levels</span>
                <span className="font-semibold text-slate-900">{selectedBuilding.basement_levels} Subsurface</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-slate-500 font-medium">Cadastral Status</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300 text-[10px]">
                  <ShieldCheck className="w-3 h-3" />
                  Validated
                </span>
              </div>
            </div>

            <button
              onClick={onViewVerticalStructure}
              className="w-full bg-blue-900 hover:bg-blue-950 text-white font-medium py-2 px-3 rounded flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Split className="w-3.5 h-3.5" />
              <span>View Vertical Structure</span>
            </button>

            {/* Quick floor selector list for this building */}
            <div className="border border-slate-200 rounded p-2 bg-white">
              <div className="font-semibold text-slate-700 mb-1 text-[11px]">
                KEY VERTICAL SLICES
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => onSelectFloorNumber(8)}
                  className="w-full text-left px-2 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded flex items-center justify-between text-blue-900"
                >
                  <span className="font-medium">Floor 08 (Sample F08-U03)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onSelectFloorNumber(14)}
                  className="w-full text-left px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded flex items-center justify-between text-slate-800"
                >
                  <span>Floor 14 (Penthouse Terrace)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => onSelectFloorNumber(-2)}
                  className="w-full text-left px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded flex items-center justify-between text-slate-800"
                >
                  <span>Basement 2 (Foundation / Utility)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* PARCEL VIEW */}
        {selectedType === 'parcel' && selectedParcel && (
          <>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
                PARCEL ATTRIBUTES
              </div>
              <div className="font-bold text-sm text-slate-900">Parcel {selectedParcel.code}</div>
              <div className="font-mono text-xs text-blue-900 font-semibold mt-0.5">{selectedParcel.id}</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded p-2.5 space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 font-medium">Survey Number</span>
                <span className="font-mono font-bold text-slate-900">{selectedParcel.survey_number}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 font-medium">Zone</span>
                <span className="font-medium text-slate-800">{selectedParcel.urban_zone}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 font-medium">Surface Area</span>
                <span className="font-semibold text-slate-900">{selectedParcel.area_sqm.toLocaleString()} sq.m</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 font-medium">FAR Allowed / Utilized</span>
                <span className="font-semibold text-slate-900">{selectedParcel.far_allowed} / {selectedParcel.far_utilized}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 font-medium">Zoning</span>
                <span className="text-slate-800">{selectedParcel.zoning}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 font-medium">CRS</span>
                <span className="font-mono text-slate-700">{selectedParcel.crs}</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-slate-500 font-medium">Cadastral Status</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300 text-[10px]">
                  <ShieldCheck className="w-3 h-3" />
                  VALIDATED
                </span>
              </div>
            </div>
          </>
        )}

        {/* UTILITY VIEW */}
        {selectedType === 'utility' && selectedUtility && (
          <>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
                SUBSURFACE UTILITY ASSET
              </div>
              <div className="font-bold text-sm text-slate-900">{selectedUtility.type}</div>
              <div className="font-mono text-xs text-orange-900 font-semibold mt-0.5">{selectedUtility.id}</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded p-2.5 space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 font-medium">Depth</span>
                <span className="font-mono font-bold text-orange-950">{selectedUtility.depth_m.toFixed(1)} m</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 font-medium">Length</span>
                <span className="font-semibold text-slate-900">{selectedUtility.length_m} m</span>
              </div>
              {selectedUtility.diameter_mm && (
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500 font-medium">Diameter</span>
                  <span className="font-mono text-slate-800">{selectedUtility.diameter_mm} mm</span>
                </div>
              )}
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 font-medium">Material</span>
                <span className="text-slate-800">{selectedUtility.material}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 font-medium">Operational Status</span>
                <span className="font-semibold text-emerald-700">{selectedUtility.status}</span>
              </div>
              <div className="flex justify-between pt-0.5 items-center">
                <span className="text-slate-500 font-medium">Spatial Conflict</span>
                {selectedUtility.spatial_conflict === 'POTENTIAL_CLASH_DETECTED' ? (
                  <span className="inline-flex items-center gap-1 font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-300 text-[10px]">
                    <ShieldAlert className="w-3 h-3" />
                    CLASH DETECTED
                  </span>
                ) : (
                  <span className="font-semibold text-emerald-700">NONE</span>
                )}
              </div>
            </div>

            {selectedUtility.spatial_conflict === 'POTENTIAL_CLASH_DETECTED' && (
              <div className="bg-red-50 border border-red-200 rounded p-2 text-red-900 space-y-1.5">
                <div className="font-semibold flex items-center gap-1 text-[11px]">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-700" />
                  <span>Subterranean Topology Conflict</span>
                </div>
                <p className="text-[10px] text-red-800 leading-relaxed">
                  {selectedUtility.conflict_details || 'Spatial intersection with Building BLD-0007 Subsurface Foundation at -8.20m.'}
                </p>
                <button
                  onClick={() => onOpenConflictReview('VAL-00231')}
                  className="w-full mt-1 bg-red-700 hover:bg-red-800 text-white font-medium py-1.5 px-2 rounded text-[11px] transition-colors"
                >
                  Open Conflict Review (VAL-00231)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
