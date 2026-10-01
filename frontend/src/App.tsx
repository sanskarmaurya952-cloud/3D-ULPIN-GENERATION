import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar, NavView } from './components/layout/Sidebar';
import { Breadcrumb } from './components/layout/Breadcrumb';
import { DisclaimerBanner } from './components/layout/DisclaimerBanner';

// Views
import { LandingPageView } from './views/LandingPageView';
import { DashboardView } from './views/DashboardView';
import { Cadastre3DView } from './views/Cadastre3DView';
import { ParcelsView } from './views/ParcelsView';
import { BuildingsView } from './views/BuildingsView';
import { UndergroundView } from './views/UndergroundView';
import { UlpinGeneratorView } from './views/UlpinGeneratorView';
import { UlpinSearchView } from './views/UlpinSearchView';
import { TopologyValidationView } from './views/TopologyValidationView';
import { ConflictReviewView } from './views/ConflictReviewView';
import { AiExtractionView } from './views/AiExtractionView';
import { DataImportView } from './views/DataImportView';
import { DigitalPropertyRecordView } from './views/DigitalPropertyRecordView';
import { SystemStatusView } from './views/SystemStatusView';

import {
  Parcel,
  Building,
  UtilityAsset,
  LayerVisibilityState,
  UserRole,
  SearchResult
} from './types/cadastre';
import { cadastreApi } from './api/client';
import {
  MOCK_PARCELS,
  MOCK_BUILDINGS,
  MOCK_UTILITIES
} from './data/mockSpatialDataset';

export default function App() {
  // Navigation: Default to official Landing Page
  const [currentView, setCurrentView] = useState<NavView>('landing');

  // User Authority Role
  const [currentRole, setCurrentRole] = useState<UserRole>('SURVEY_OFFICER');

  // Datasets
  const [parcels, setParcels] = useState<Parcel[]>(MOCK_PARCELS);
  const [buildings, setBuildings] = useState<Building[]>(MOCK_BUILDINGS);
  const [utilities, setUtilities] = useState<UtilityAsset[]>(MOCK_UTILITIES);

  // Selected Entities
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [selectedFloorNumber, setSelectedFloorNumber] = useState<number | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedUtilityId, setSelectedUtilityId] = useState<string | null>(null);

  // Target IDs for detail views
  const [activeUlpinForRecord, setActiveUlpinForRecord] = useState<string>('IN-LKO-GN5-102-B07-F08-U03');
  const [activeIssueForReview, setActiveIssueForReview] = useState<string>('VAL-00231');

  // 3D GIS Layer Controls State
  const [layerState, setLayerState] = useState<LayerVisibilityState>({
    parcels: true,
    buildings: true,
    floors: true,
    propertyUnits: true,
    roads: true,
    undergroundUtilities: true,
    depthGrid: false,
    airRights: false,
    measurements: false,
    basemap: 'vector',
    viewMode: '3D',
    undergroundDepthCutoff: 0,
    selectedBuildingId: null,
    selectedFloorNumber: null,
    selectedUnitId: null,
    selectedParcelId: null,
    selectedUtilityId: null,
    isolationMode: false,
    highlightConflict: false,
    sectionSliceY: null
  });

  // Sync layer state with selected entity variables
  useEffect(() => {
    setLayerState(prev => ({
      ...prev,
      selectedParcelId,
      selectedBuildingId,
      selectedFloorNumber,
      selectedUnitId,
      selectedUtilityId
    }));
  }, [selectedParcelId, selectedBuildingId, selectedFloorNumber, selectedUnitId, selectedUtilityId]);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      const p = await cadastreApi.getParcels();
      const b = await cadastreApi.getBuildings();
      const u = await cadastreApi.getUtilities();
      setParcels(p);
      setBuildings(b);
      setUtilities(u);
    };
    fetchData();
  }, []);

  // Entity Selection Handler
  const handleSelectEntity = (
    type: 'parcel' | 'building' | 'floor' | 'unit' | 'utility' | null,
    id: string | null
  ) => {
    if (!type || !id) {
      setSelectedParcelId(null);
      setSelectedBuildingId(null);
      setSelectedFloorNumber(null);
      setSelectedUnitId(null);
      setSelectedUtilityId(null);
      return;
    }

    if (type === 'parcel') {
      setSelectedParcelId(id);
      setSelectedBuildingId(null);
      setSelectedFloorNumber(null);
      setSelectedUnitId(null);
      setSelectedUtilityId(null);
    } else if (type === 'building') {
      setSelectedBuildingId(id);
      const bld = buildings.find(b => b.id === id);
      if (bld) setSelectedParcelId(bld.parcel_id);
      setSelectedFloorNumber(null);
      setSelectedUnitId(null);
      setSelectedUtilityId(null);
    } else if (type === 'floor') {
      setSelectedBuildingId('BLD-0007');
      setSelectedParcelId('PAR-0102');
      const fNumMatch = id.match(/F(\d+)|B(\d+)|G00/);
      if (fNumMatch) {
        if (id.includes('B')) {
          setSelectedFloorNumber(-parseInt(fNumMatch[2] || '1', 10));
        } else if (id.includes('G')) {
          setSelectedFloorNumber(0);
        } else {
          setSelectedFloorNumber(parseInt(fNumMatch[1] || '8', 10));
        }
      }
      setSelectedUnitId(null);
      setSelectedUtilityId(null);
    } else if (type === 'unit') {
      setSelectedBuildingId('BLD-0007');
      setSelectedParcelId('PAR-0102');
      setSelectedFloorNumber(8);
      setSelectedUnitId(id);
      setSelectedUtilityId(null);
    } else if (type === 'utility') {
      setSelectedUtilityId(id);
    }
  };

  // Global Search Result Handler
  const handleSelectSearchResult = (res: SearchResult) => {
    if (res.category === 'ULPIN') {
      setActiveUlpinForRecord(res.id);
      handleSelectEntity('unit', res.entity_id);
      setCurrentView('3d-cadastre');
    } else if (res.category === 'UNIT') {
      handleSelectEntity('unit', res.entity_id);
      setCurrentView('3d-cadastre');
    } else if (res.category === 'BUILDING') {
      handleSelectEntity('building', res.entity_id);
      setCurrentView('3d-cadastre');
    } else if (res.category === 'PARCEL') {
      handleSelectEntity('parcel', res.entity_id);
      setCurrentView('3d-cadastre');
    } else if (res.category === 'UTILITY') {
      handleSelectEntity('utility', res.entity_id);
      setCurrentView('3d-cadastre');
    }
  };

  // Launch the Complete Polished Demo Scenario
  const handleLaunchDemoWorkflow = () => {
    // 1. Set entities to Parcel P-0102 -> BLD-0007 -> Floor 8 -> Unit F08-U03
    setSelectedParcelId('PAR-0102');
    setSelectedBuildingId('BLD-0007');
    setSelectedFloorNumber(8);
    setSelectedUnitId('F08-U03');
    setSelectedUtilityId('UTL-023');

    // 2. Configure 3D Viewer into Isolation & Clash Mode
    setLayerState(prev => ({
      ...prev,
      isolationMode: true,
      selectedBuildingId: 'BLD-0007',
      selectedFloorNumber: 8,
      selectedUnitId: 'F08-U03',
      selectedParcelId: 'PAR-0102',
      selectedUtilityId: 'UTL-023',
      highlightConflict: true,
      floors: true,
      propertyUnits: true,
      undergroundUtilities: true,
      undergroundDepthCutoff: -10
    }));

    // 3. Switch to 3D Cadastre View
    setCurrentView('3d-cadastre');
  };

  if (currentView === 'landing') {
    return (
      <LandingPageView
        onEnterPortal={targetView => setCurrentView(targetView || 'dashboard')}
        onLaunchDemoWorkflow={handleLaunchDemoWorkflow}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f8fafc]">
      {/* Top Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Main Institutional Header */}
      <Header
        currentRole={currentRole}
        onChangeRole={setCurrentRole}
        onSelectSearchResult={handleSelectSearchResult}
        onNavigateToLanding={() => setCurrentView('landing')}
      />

      {/* Breadcrumb Navigation Trail */}
      <Breadcrumb
        currentView={currentView}
        selectedParcelId={selectedParcelId}
        selectedBuildingId={selectedBuildingId}
        selectedFloorNumber={selectedFloorNumber}
        selectedUnitId={selectedUnitId}
        onNavigate={setCurrentView}
      />

      {/* Workspace Area: Sidebar + Active View */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={view => {
            setCurrentView(view);
          }}
          unresolvedConflictsCount={1}
        />

        {/* View Content Area with Subtle GIS Topographic Pattern */}
        <main className="flex-1 h-full overflow-hidden bg-topo-pattern relative">
          {currentView === 'dashboard' && (
            <DashboardView
              parcels={parcels}
              buildings={buildings}
              onNavigate={setCurrentView}
              onLaunchDemoWorkflow={handleLaunchDemoWorkflow}
              onSelectEntity={(type, id) => {
                handleSelectEntity(type, id);
                setCurrentView('3d-cadastre');
              }}
            />
          )}

          {currentView === '3d-cadastre' && (
            <Cadastre3DView
              parcels={parcels}
              buildings={buildings}
              utilities={utilities}
              selectedParcelId={selectedParcelId}
              selectedBuildingId={selectedBuildingId}
              selectedFloorNumber={selectedFloorNumber}
              selectedUnitId={selectedUnitId}
              selectedUtilityId={selectedUtilityId}
              layerState={layerState}
              setLayerState={setLayerState}
              onSelectEntity={handleSelectEntity}
              onNavigate={setCurrentView}
              onOpenConflictReview={issueId => {
                setActiveIssueForReview(issueId);
                setCurrentView('conflict-review');
              }}
              onViewDigitalRecord={ulpin => {
                setActiveUlpinForRecord(ulpin);
                setCurrentView('property-record');
              }}
            />
          )}

          {currentView === 'parcels' && (
            <ParcelsView
              parcels={parcels}
              onSelectParcel={id => {
                handleSelectEntity('parcel', id);
                setCurrentView('3d-cadastre');
              }}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'buildings' && (
            <BuildingsView
              buildings={buildings}
              onSelectBuilding={id => {
                handleSelectEntity('building', id);
                setLayerState(prev => ({
                  ...prev,
                  isolationMode: true,
                  selectedBuildingId: id,
                  floors: true,
                  propertyUnits: true
                }));
                setCurrentView('3d-cadastre');
              }}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'units' && (
            <UlpinSearchView
              onNavigate={setCurrentView}
              onViewDigitalRecord={ulpin => {
                setActiveUlpinForRecord(ulpin);
                setCurrentView('property-record');
              }}
              onSelectEntity={(type, id) => {
                handleSelectEntity(type, id);
                setCurrentView('3d-cadastre');
              }}
            />
          )}

          {currentView === 'underground' && (
            <UndergroundView
              utilities={utilities}
              onSelectUtility={id => {
                handleSelectEntity('utility', id);
                setLayerState(prev => ({
                  ...prev,
                  undergroundUtilities: true,
                  undergroundDepthCutoff: -15,
                  selectedUtilityId: id
                }));
                setCurrentView('3d-cadastre');
              }}
              onOpenConflictReview={issueId => {
                setActiveIssueForReview(issueId);
                setCurrentView('conflict-review');
              }}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'data-import' && (
            <DataImportView onNavigate={setCurrentView} />
          )}

          {currentView === 'ai-extraction' && (
            <AiExtractionView onNavigate={setCurrentView} />
          )}

          {currentView === 'validation' && (
            <TopologyValidationView
              onOpenConflictReview={issueId => {
                setActiveIssueForReview(issueId);
                setCurrentView('conflict-review');
              }}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'conflict-review' && (
            <ConflictReviewView
              issueId={activeIssueForReview}
              currentRole={currentRole}
              onNavigate={setCurrentView}
              onViewDigitalRecord={ulpin => {
                setActiveUlpinForRecord(ulpin);
                setCurrentView('property-record');
              }}
            />
          )}

          {currentView === 'ulpin-generator' && (
            <UlpinGeneratorView
              parcels={parcels}
              buildings={buildings}
              onNavigate={setCurrentView}
              onViewDigitalRecord={ulpin => {
                setActiveUlpinForRecord(ulpin);
                setCurrentView('property-record');
              }}
            />
          )}

          {currentView === 'ulpin-search' && (
            <UlpinSearchView
              onNavigate={setCurrentView}
              onViewDigitalRecord={ulpin => {
                setActiveUlpinForRecord(ulpin);
                setCurrentView('property-record');
              }}
              onSelectEntity={(type, id) => {
                handleSelectEntity(type, id);
                setCurrentView('3d-cadastre');
              }}
            />
          )}

          {currentView === 'property-record' && (
            <DigitalPropertyRecordView
              ulpin={activeUlpinForRecord}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'system' && (
            <SystemStatusView
              currentRole={currentRole}
              onChangeRole={setCurrentRole}
            />
          )}
        </main>
      </div>
    </div>
  );
}
