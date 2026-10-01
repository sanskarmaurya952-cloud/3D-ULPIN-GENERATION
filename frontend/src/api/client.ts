import {
  Parcel,
  Building,
  Floor,
  PropertyUnit,
  UtilityAsset,
  ValidationIssue,
  TopologyValidationResult,
  DigitalPropertyRecord,
  SearchResult
} from '../types/cadastre';
import {
  MOCK_PARCELS,
  MOCK_BUILDINGS,
  MOCK_UTILITIES,
  MOCK_VALIDATION_ISSUES,
  getMockFloorsForBuilding,
  getMockUnitsForFloor
} from '../data/mockSpatialDataset';

const API_BASE = '/api';

export const cadastreApi = {
  // Parcels
  async getParcels(): Promise<Parcel[]> {
    try {
      const res = await fetch(`${API_BASE}/parcels`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return MOCK_PARCELS;
  },

  async getParcel(id: string): Promise<Parcel> {
    try {
      const res = await fetch(`${API_BASE}/parcels/${id}`);
      if (res.ok) return await res.json();
    } catch (_) {}
    const p = MOCK_PARCELS.find(x => x.id === id || x.code === id);
    if (!p) throw new Error(`Parcel ${id} not found`);
    return p;
  },

  // Buildings
  async getBuildings(): Promise<Building[]> {
    try {
      const res = await fetch(`${API_BASE}/buildings`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return MOCK_BUILDINGS;
  },

  async getBuilding(id: string): Promise<Building> {
    try {
      const res = await fetch(`${API_BASE}/buildings/${id}`);
      if (res.ok) return await res.json();
    } catch (_) {}
    const b = MOCK_BUILDINGS.find(x => x.id === id);
    if (!b) throw new Error(`Building ${id} not found`);
    return b;
  },

  async getFloors(buildingId: string): Promise<Floor[]> {
    try {
      const res = await fetch(`${API_BASE}/buildings/${buildingId}/floors`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return getMockFloorsForBuilding(buildingId);
  },

  async getUnits(floorId: string): Promise<PropertyUnit[]> {
    try {
      const res = await fetch(`${API_BASE}/floors/${floorId}/units`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return getMockUnitsForFloor(floorId);
  },

  async getUnit(unitId: string): Promise<PropertyUnit> {
    try {
      const res = await fetch(`${API_BASE}/units/${unitId}`);
      if (res.ok) return await res.json();
    } catch (_) {}
    // Fallback search
    const allFloors = getMockFloorsForBuilding('BLD-0007');
    for (const f of allFloors) {
      const units = getMockUnitsForFloor(f.id);
      const u = units.find(x => x.id === unitId || x.unit_number === unitId || unitId.includes(x.unit_number));
      if (u) return u;
    }
    const defaultUnits = getMockUnitsForFloor('BLD0007-F08');
    return defaultUnits[2]; // F08-U03
  },

  // Utilities
  async getUtilities(): Promise<UtilityAsset[]> {
    try {
      const res = await fetch(`${API_BASE}/utilities`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return MOCK_UTILITIES;
  },

  // ULPIN
  async generateUlpin(params: {
    parcel_id: string;
    building_id: string;
    floor_id: string;
    unit_id: string;
  }) {
    try {
      const res = await fetch(`${API_BASE}/ulpin/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    
    // Fallback generator
    const pClean = params.parcel_id.replace('PAR-', '').replace('P-', '');
    const bClean = params.building_id.replace('BLD-', 'B');
    const fParts = params.floor_id.split('-');
    const fCode = fParts[1] || 'F08';
    const uCode = params.unit_id.includes('U03') ? 'U03' : 'U01';
    const ulpin = `IN-LKO-GN5-${pClean}-${bClean}-${fCode}-${uCode}`;
    return {
      ulpin,
      spatial_signature: '7A9C2F',
      parcel_id: params.parcel_id,
      parcel_code: `P-${pClean}`,
      building_id: params.building_id,
      building_name: 'Shikhar Heights & Commercial Plaza',
      floor_id: params.floor_id,
      floor_number: 8,
      floor_label: 'Floor 08',
      unit_id: params.unit_id,
      unit_number: 'U-03',
      vertical_range: '124.20m – 127.20m',
      elevation_min: 124.20,
      elevation_max: 127.20,
      area_sqft: 1240.0,
      carpet_area_sqft: 1080.0,
      spatial_status: 'VALIDATED',
      qr_code_data: ulpin,
      generated_at: new Date().toISOString(),
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
      disclaimer: 'PROTOTYPE 3D ULPIN (Proposed 3D Cadastre Framework - Demonstration Dataset)'
    };
  },

  // Validation
  async runValidation(): Promise<TopologyValidationResult> {
    try {
      const res = await fetch(`${API_BASE}/validation/run`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (_) {}
    return {
      checks_performed: 18,
      passed_count: 15,
      warnings_count: 2,
      conflicts_count: 1,
      timestamp: new Date().toISOString(),
      issues: MOCK_VALIDATION_ISSUES,
      cadastral_zone: 'Lucknow Urban Demonstration Zone (Gomti Nagar, Zone 5)'
    };
  },

  async getValidationIssues(): Promise<ValidationIssue[]> {
    try {
      const res = await fetch(`${API_BASE}/validation/issues`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return MOCK_VALIDATION_ISSUES;
  },

  async submitOfficerDecision(issueId: string, decision: 'APPROVED' | 'MODIFIED' | 'REJECTED', officerName: string, comments: string) {
    try {
      const res = await fetch(`${API_BASE}/validation/${issueId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, officer_name: officerName, comments }),
      });
      if (res.ok) return await res.json();
    } catch (_) {}

    const issue = MOCK_VALIDATION_ISSUES.find(i => i.id === issueId);
    if (issue) {
      issue.status = decision === 'APPROVED' ? 'APPROVED_WITH_VARIANCE' : decision === 'MODIFIED' ? 'MODIFIED' : 'REJECTED';
      issue.officer_decision = {
        decision,
        officer_name: officerName,
        timestamp: new Date().toISOString(),
        comments
      };
    }
    return { message: 'Decision registered', issue };
  },

  // Property Record
  async getPropertyRecord(ulpin: string): Promise<DigitalPropertyRecord> {
    try {
      const res = await fetch(`${API_BASE}/records/property/${ulpin}`);
      if (res.ok) return await res.json();
    } catch (_) {}

    return {
      record_id: `DPR-${ulpin.replace(/[^a-zA-Z0-9]/g, '')}`,
      ulpin: ulpin || 'IN-LKO-GN5-102-B07-F08-U03',
      record_title: 'THREE-DIMENSIONAL DIGITAL PROPERTY RECORD (3D-DPR)',
      framework: 'Proposed 3D Cadastre Identification Framework',
      jurisdiction: {
        country: 'India',
        state: 'Uttar Pradesh',
        district: 'Lucknow',
        tehsil: 'Lucknow Sadar',
        urban_zone: 'Gomti Nagar, Zone 5',
        ward_number: 'Ward 42 (Vibhuti Khand)',
        authority: 'Lucknow Development Authority & Directorate of Land Records'
      },
      spatial_definition: {
        parcel_id: 'PAR-0102',
        parcel_survey_no: 'LKO/GN5/102/2024',
        parcel_area_sqm: 2450.0,
        crs: 'EPSG:4326 (WGS 84) / Local Metric Heights',
        building_id: 'BLD-0007',
        building_name: 'Shikhar Heights & Commercial Plaza',
        building_structure: 'RCC Framed Multi-Storey Commercial/Residential',
        total_floors: 14,
        floor_level: 'Floor 08',
        floor_number: 8,
        unit_number: 'U-03',
        unit_type: '3 BHK Residential Apartment',
        carpet_area_sqft: 1080.0,
        built_up_area_sqft: 1240.0,
        volumetric_bounding_box: {
          xmin: 18.0,
          xmax: 35.0,
          ymin: 35.0,
          ymax: 52.0,
          zmin: 24.20,
          zmax: 27.20,
          elevation_min: 124.20,
          elevation_max: 127.20
        },
        vertical_extent: {
          elevation_datum: 'Mean Sea Level (MSL)',
          z_min_msl: 124.20,
          z_max_msl: 127.20,
          vertical_clearance_m: 3.00
        }
      },
      subsurface_and_air_rights: {
        air_rights_envelope_status: 'COMPLIANT (Beneath Airport Obstacle Limitation Surface)',
        subsurface_easements: 'Water Pipeline UTL-023 Utility Corridor Variance Recorded',
        parking_allocated: 'Basement-1 Bay P-14 (Subsurface Parcel IN-LKO-GN5-102-B07-B01-P14)'
      },
      validation_history: [
        {
          stage: '2D Parcel Boundary Verification',
          status: 'VALIDATED',
          timestamp: '2026-01-15T09:30:00Z',
          officer: 'Zonal Revenue Inspector'
        },
        {
          stage: '3D Building LiDAR & Footprint Extraction',
          status: 'VALIDATED',
          timestamp: '2026-02-10T11:00:00Z',
          officer: 'Urban GIS Photogrammetry Unit'
        },
        {
          stage: 'Vertical Volumetric Floor Partitioning',
          status: 'VALIDATED',
          timestamp: '2026-03-05T14:20:00Z',
          officer: 'Municipal Town Planning Directorate'
        },
        {
          stage: '3D Topology & Utility Conflict Audit',
          status: 'APPROVED_WITH_VARIANCE',
          timestamp: '2026-09-30T10:30:00Z',
          officer: 'Senior Cadastral Officer R. K. Sharma'
        }
      ],
      data_sources: [
        { layer: 'Cadastral Boundary', provenance: 'State Land Records GIS (Demonstration Dataset)', crs: 'EPSG:4326' },
        { layer: '3D Building Geometry', provenance: 'Synthetic LOD-2 Mesh from LiDAR DSM', crs: 'EPSG:4326' },
        { layer: 'Floor Unit Volumes', provenance: 'Sanctioned Architectural BIM/CAD Export', crs: 'Local Grid' },
        { layer: 'Subsurface Utilities', provenance: 'Municipal GPR & Utility Registry', crs: 'EPSG:4326' }
      ],
      ownership_status: 'Demonstration Record (Fictionalized Prototype Data)',
      qr_code_data: ulpin || 'IN-LKO-GN5-102-B07-F08-U03',
      issuing_date: '2026-09-30',
      disclaimer: 'PROTOTYPE 3D PROPERTY RECORD — For technical demonstration of 3D Cadastral & ULPIN mapping principles. Not a legal deed or official government certification.'
    };
  },

  // AI Pipeline Demo
  async runAiExtraction() {
    try {
      const res = await fetch(`${API_BASE}/ai/building-extraction`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (_) {}
    return {
      job_id: 'AI-EXT-2026-9042',
      input_file: 'lucknow_gomti_nagar_ortho_0.1m.tif',
      input_type: 'High-Resolution Drone Orthomosaic + LiDAR DSM',
      crs: 'EPSG:4326 (WGS 84)',
      status: 'COMPLETED',
      buildings_detected: 8,
      average_confidence: 94.2,
      steps: [
        { step_number: 1, step_name: 'Orthophoto Ingestion & Radiometric Normalization', status: 'COMPLETED', description: 'Bands R-G-B-NIR calibrated; shadow suppression and contrast enhancement applied.' },
        { step_number: 2, step_name: 'Deep Feature Segmentation (UNet-ConvNeXt)', status: 'COMPLETED', description: 'Building rooftop masks segmented with sub-pixel edge refinement.' },
        { step_number: 3, step_name: 'Cadastral Boundary Regularization', status: 'COMPLETED', description: 'Douglas-Peucker simplification with 90-degree corner snapping.' },
        { step_number: 4, step_name: 'DSM Height Estimation & nDSM Normalization', status: 'COMPLETED', description: 'Height extracted from Normalized Digital Surface Model.' },
        { step_number: 5, step_name: 'LOD-2 3D Geometry Extrusion & Alignment', status: 'COMPLETED', description: '3D polyhedral models generated and aligned to parcel boundaries.' }
      ]
    };
  },

  async runFloorSegmentation(buildingId: string = 'BLD-0007') {
    try {
      const res = await fetch(`${API_BASE}/ai/floor-segmentation?building_id=${buildingId}`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (_) {}
    return {
      building_id: buildingId,
      building_name: 'Shikhar Heights & Commercial Plaza',
      estimated_floors: 14,
      basement_levels: 2,
      mean_floor_height_m: 3.04,
      vertical_structure_status: 'VALIDATED'
    };
  },

  // Search
  async search(query: string): Promise<SearchResult[]> {
    try {
      const res = await fetch(`${API_BASE}/system/search?q=${encodeURIComponent(query)}`);
      if (res.ok) return await res.json();
    } catch (_) {}
    
    const q = query.toUpperCase();
    const results: SearchResult[] = [];
    if (q.includes('ULPIN') || q.includes('IN-') || q.includes('U03') || q.includes('F08')) {
      results.push({
        category: 'ULPIN',
        id: 'IN-LKO-GN5-102-B07-F08-U03',
        title: 'ULPIN: IN-LKO-GN5-102-B07-F08-U03',
        subtitle: 'Unit U-03 | Floor 08 (124.20m–127.20m) | BLD-0007',
        entity_type: 'unit',
        entity_id: 'F08-U03',
        building_id: 'BLD-0007',
        parcel_id: 'PAR-0102',
        floor_id: 'BLD0007-F08',
        coordinates: [26.5, 43.5, 25.7]
      });
    }
    if (q.includes('BLD') || q.includes('0007') || q.includes('SHIKHAR')) {
      results.push({
        category: 'BUILDING',
        id: 'BLD-0007',
        title: 'Building BLD-0007 — Shikhar Heights',
        subtitle: '14 Floors | 18,400 sq.ft | Parcel PAR-0102',
        entity_type: 'building',
        entity_id: 'BLD-0007',
        parcel_id: 'PAR-0102',
        coordinates: [35, 35, 21.3]
      });
    }
    if (q.includes('PAR') || q.includes('0102') || q.includes('P-0102') || q.includes('102')) {
      results.push({
        category: 'PARCEL',
        id: 'PAR-0102',
        title: 'Parcel P-0102 (PAR-0102)',
        subtitle: 'Commercial / Mixed Use | 2,450 sq.m | Survey LKO/GN5/102/2024',
        entity_type: 'parcel',
        entity_id: 'PAR-0102',
        coordinates: [35, 35, 0]
      });
    }
    if (q.includes('UTL') || q.includes('023') || q.includes('WATER') || q.includes('PIPE')) {
      results.push({
        category: 'UTILITY',
        id: 'UTL-023',
        title: 'Utility UTL-023 — Water Pipeline',
        subtitle: 'Depth: -8.4m | Ductile Iron | ACTIVE (Clash Warning)',
        entity_type: 'utility',
        entity_id: 'UTL-023',
        coordinates: [35, 32, -8.4]
      });
    }
    return results;
  }
};
