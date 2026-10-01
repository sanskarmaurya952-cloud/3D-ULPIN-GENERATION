import React, { useState, useEffect } from 'react';
import { CadastreViewer3D } from '../components/viewer3d/CadastreViewer3D';
import { ViewerControls } from '../components/viewer3d/ViewerControls';
import { LayerControlPanel } from '../components/viewer3d/LayerControlPanel';
import { SubsurfaceDepthSlider } from '../components/viewer3d/SubsurfaceDepthSlider';
import { CoordinateHUD } from '../components/viewer3d/CoordinateHUD';
import { VerticalFloorStepper } from '../components/viewer3d/VerticalFloorStepper';
import { PropertyInspector } from '../components/inspector/PropertyInspector';
import {
  Parcel,
  Building,
  Floor,
  PropertyUnit,
  UtilityAsset,
  LayerVisibilityState,
  NavView
} from '../types/cadastre';
import { getMockFloorsForBuilding, getMockUnitsForFloor } from '../data/mockSpatialDataset';

interface Cadastre3DViewProps {
  parcels: Parcel[];
  buildings: Building[];
  utilities: UtilityAsset[];
  selectedParcelId: string | null;
  selectedBuildingId: string | null;
  selectedFloorNumber: number | null;
  selectedUnitId: string | null;
  selectedUtilityId: string | null;
  layerState: LayerVisibilityState;
  setLayerState: React.Dispatch<React.SetStateAction<LayerVisibilityState>>;
  onSelectEntity: (type: 'parcel' | 'building' | 'floor' | 'unit' | 'utility' | null, id: string | null) => void;
  onNavigate: (view: NavView) => void;
  onOpenConflictReview: (issueId: string) => void;
  onViewDigitalRecord: (ulpin: string) => void;
}

export const Cadastre3DView: React.FC<Cadastre3DViewProps> = ({
  parcels,
  buildings,
  utilities,
  selectedParcelId,
  selectedBuildingId,
  selectedFloorNumber,
  selectedUnitId,
  selectedUtilityId,
  layerState,
  setLayerState,
  onSelectEntity,
  onNavigate,
  onOpenConflictReview,
  onViewDigitalRecord
}) => {
  // Cursor Coordinates for HUD
  const [hudCoords, setHudCoords] = useState({
    x: 35.0,
    y: 35.0,
    z: 0.0,
    lat: 26.852950,
    lon: 80.992680,
    elevation: 100.0
  });

  // Active Building Floors
  const activeBuilding = buildings.find(b => b.id === (selectedBuildingId || 'BLD-0007'));
  const activeFloors = activeBuilding ? getMockFloorsForBuilding(activeBuilding.id) : [];

  // Active selected entity objects for inspector
  const activeParcel = parcels.find(p => p.id === selectedParcelId || p.code === selectedParcelId);
  const activeUnit = selectedUnitId
    ? getMockUnitsForFloor(selectedFloorNumber !== null ? `${(selectedBuildingId || 'BLD-0007').replace('-', '')}-F${selectedFloorNumber < 10 && selectedFloorNumber >= 0 ? '0' + selectedFloorNumber : selectedFloorNumber}` : 'BLD0007-F08').find(u => u.id === selectedUnitId || u.unit_number === selectedUnitId || selectedUnitId.includes(u.unit_number))
    : null;
  const activeUtility = utilities.find(u => u.id === selectedUtilityId);

  const selectedType = selectedUnitId
    ? 'unit'
    : selectedFloorNumber !== null
    ? 'floor'
    : selectedBuildingId
    ? 'building'
    : selectedParcelId
    ? 'parcel'
    : selectedUtilityId
    ? 'utility'
    : null;

  return (
    <div className="relative w-full h-full flex overflow-hidden bg-slate-950">
      {/* Main 3D Canvas Area */}
      <div className="flex-1 relative h-full">
        {/* Top Controls Toolbar */}
        <ViewerControls
          layerState={layerState}
          setLayerState={setLayerState}
          onResetCamera={() => {
            onSelectEntity(null, null);
            setLayerState(prev => ({
              ...prev,
              isolationMode: false,
              selectedBuildingId: null,
              selectedFloorNumber: null,
              selectedUnitId: null,
              selectedParcelId: null,
              selectedUtilityId: null,
              highlightConflict: false,
              undergroundDepthCutoff: 0
            }));
          }}
        />

        {/* Left Layer Control Panel */}
        <LayerControlPanel
          layerState={layerState}
          setLayerState={setLayerState}
        />

        {/* Left Subsurface Depth Slider */}
        <SubsurfaceDepthSlider
          depth={layerState.undergroundDepthCutoff}
          onChangeDepth={d => setLayerState(prev => ({ ...prev, undergroundDepthCutoff: d }))}
        />

        {/* Bottom Coordinate HUD */}
        <CoordinateHUD coords={hudCoords} />

        {/* Vertical Floor Stack Stepper (when building is selected or isolated) */}
        {(selectedBuildingId || layerState.isolationMode) && activeFloors.length > 0 && (
          <VerticalFloorStepper
            floors={activeFloors}
            selectedFloorNumber={selectedFloorNumber}
            onSelectFloor={fNum => {
              onSelectEntity('floor', `${(selectedBuildingId || 'BLD-0007').replace('-', '')}-F${fNum < 10 && fNum >= 0 ? '0' + fNum : fNum}`);
              setLayerState(prev => ({ ...prev, selectedFloorNumber: fNum, floors: true }));
            }}
            onClearFloor={() => {
              setLayerState(prev => ({ ...prev, selectedFloorNumber: null }));
            }}
          />
        )}

        {/* 3D WebGL Canvas */}
        <CadastreViewer3D
          parcels={parcels}
          buildings={buildings}
          utilities={utilities}
          layerState={layerState}
          onSelectEntity={(type, id) => {
            if (type && id) {
              onSelectEntity(type, id);
            } else {
              onSelectEntity(null, null);
            }
          }}
          onHoverCoordinates={setHudCoords}
        />
      </div>

      {/* Right Side Cadastral Inspector Panel */}
      <PropertyInspector
        selectedType={selectedType}
        selectedParcel={activeParcel}
        selectedBuilding={activeBuilding}
        selectedFloor={activeFloors.find(f => f.floor_number === selectedFloorNumber)}
        selectedUnit={activeUnit || (selectedUnitId ? {
          id: 'F08-U03',
          unit_number: 'U-03',
          floor_id: 'BLD0007-F08',
          building_id: 'BLD-0007',
          parcel_id: 'PAR-0102',
          floor_number: 8,
          ulpin: 'IN-LKO-GN5-102-B07-F08-U03',
          area_sqft: 1240.0,
          carpet_area_sqft: 1080.0,
          bounding_box: {
            xmin: 18.0,
            xmax: 35.0,
            ymin: 35.0,
            ymax: 52.0,
            zmin: 24.20,
            zmax: 27.20,
            elevation_min: 124.20,
            elevation_max: 127.20
          },
          unit_type: '3 BHK Residential Apartment',
          ownership_status: 'Demonstration Record',
          spatial_status: 'VALIDATED',
          qr_data: 'IN-LKO-GN5-102-B07-F08-U03'
        } : null)}
        selectedUtility={activeUtility}
        onViewVerticalStructure={() => {
          setLayerState(prev => ({
            ...prev,
            isolationMode: true,
            selectedBuildingId: selectedBuildingId || 'BLD-0007',
            floors: true,
            propertyUnits: true
          }));
        }}
        onSelectFloorNumber={fNum => {
          setLayerState(prev => ({
            ...prev,
            selectedBuildingId: selectedBuildingId || 'BLD-0007',
            selectedFloorNumber: fNum,
            isolationMode: true,
            floors: true
          }));
          onSelectEntity('floor', `BLD0007-F${fNum < 10 && fNum >= 0 ? '0' + fNum : fNum}`);
        }}
        onGenerateUlpin={() => onNavigate('ulpin-generator')}
        onOpenConflictReview={onOpenConflictReview}
        onViewDigitalRecord={onViewDigitalRecord}
        onClose={() => onSelectEntity(null, null)}
      />
    </div>
  );
};
