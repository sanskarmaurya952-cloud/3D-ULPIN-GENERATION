export interface BoundingBox3D {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
  zmin: number;
  zmax: number;
  elevation_min: number;
  elevation_max: number;
}

export type NavView =
  | 'landing'
  | 'dashboard'
  | '3d-cadastre'
  | 'parcels'
  | 'buildings'
  | 'units'
  | 'underground'
  | 'data-import'
  | 'ai-extraction'
  | 'validation'
  | 'conflict-review'
  | 'ulpin-generator'
  | 'ulpin-search'
  | 'property-record'
  | 'system';

export interface Parcel {
  id: string;
  code: string;
  state: string;
  district: string;
  urban_zone: string;
  area_sqm: number;
  area_sqft: number;
  far_allowed: number;
  far_utilized: number;
  zoning: string;
  survey_number: string;
  crs: string;
  boundary_coordinates: number[][]; // [lon, lat]
  boundary_utm: number[][]; // [x, y]
  buildings_count: number;
  validation_status: 'VALIDATED' | 'REVIEW_REQUIRED';
  created_at: string;
  updated_at: string;
}

export interface Building {
  id: string;
  name: string;
  parcel_id: string;
  total_floors: number;
  basement_levels: number;
  height_m: number;
  built_up_area_sqft: number;
  total_units: number;
  footprint_coordinates: number[][]; // local [x, y]
  center_coords: number[]; // [x, y]
  base_elevation_m: number;
  roof_elevation_m: number;
  structure_type: string;
  dsm_height_source: string;
  cadastral_status: 'VALIDATED' | 'REVIEW_REQUIRED';
  created_at: string;
}

export interface Floor {
  id: string;
  building_id: string;
  floor_number: number; // -2, -1, 0, 1..14
  floor_label: string;
  elevation_min_m: number;
  elevation_max_m: number;
  height_m: number;
  area_sqft: number;
  units_count: number;
  occupancy_type: string;
  validation_status: 'VALIDATED' | 'REVIEW_REQUIRED';
}

export interface PropertyUnit {
  id: string;
  unit_number: string;
  floor_id: string;
  building_id: string;
  parcel_id: string;
  floor_number: number;
  ulpin: string;
  area_sqft: number;
  carpet_area_sqft: number;
  bounding_box: BoundingBox3D;
  unit_type: string;
  ownership_status: string;
  spatial_status: 'VALIDATED' | 'REVIEW_REQUIRED';
  qr_data: string;
}

export interface UtilityAsset {
  id: string;
  type: string;
  depth_m: number;
  length_m: number;
  diameter_mm?: number;
  material: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  spatial_conflict: 'NONE' | 'POTENTIAL_CLASH_DETECTED';
  conflict_details?: string | null;
  coordinates_3d: number[][]; // [x, y, z]
}

export interface OfficerDecision {
  decision: 'APPROVED' | 'MODIFIED' | 'REJECTED';
  officer_name: string;
  timestamp: string;
  comments: string;
}

export interface ValidationIssue {
  id: string;
  rule_type: 'SPATIAL_OVERLAP' | 'FOOTPRINT_CONTAINMENT' | 'VERTICAL_GAP' | 'FLOOR_CONTINUITY' | 'SUBTERRANEAN_CLASH' | 'PARCEL_BOUNDARY';
  severity: 'PASSED' | 'WARNING' | 'CONFLICT';
  title: string;
  description: string;
  affected_entities: string[];
  depth_m?: number | null;
  detected_by: string;
  timestamp: string;
  status: 'REVIEW_REQUIRED' | 'APPROVED_WITH_VARIANCE' | 'MODIFIED' | 'REJECTED';
  officer_decision?: OfficerDecision | null;
}

export interface TopologyValidationResult {
  checks_performed: number;
  passed_count: number;
  warnings_count: number;
  conflicts_count: number;
  timestamp: string;
  issues: ValidationIssue[];
  rules_summary?: Array<{
    rule_id: string;
    name: string;
    target: string;
    status: string;
    description: string;
    linked_issue?: string;
  }>;
  cadastral_zone?: string;
}

export interface DigitalPropertyRecord {
  record_id: string;
  ulpin: string;
  record_title: string;
  framework: string;
  jurisdiction: {
    country: string;
    state: string;
    district: string;
    tehsil: string;
    urban_zone: string;
    ward_number: string;
    authority: string;
  };
  spatial_definition: {
    parcel_id: string;
    parcel_survey_no: string;
    parcel_area_sqm: number;
    crs: string;
    building_id: string;
    building_name: string;
    building_structure: string;
    total_floors: number;
    floor_level: string;
    floor_number: number;
    unit_number: string;
    unit_type: string;
    carpet_area_sqft: number;
    built_up_area_sqft: number;
    volumetric_bounding_box: BoundingBox3D;
    vertical_extent: {
      elevation_datum: string;
      z_min_msl: number;
      z_max_msl: number;
      vertical_clearance_m: number;
    };
  };
  subsurface_and_air_rights: {
    air_rights_envelope_status: string;
    subsurface_easements: string;
    parking_allocated: string;
  };
  validation_history: Array<{
    stage: string;
    status: string;
    timestamp: string;
    officer: string;
  }>;
  data_sources: Array<{
    layer: string;
    provenance: string;
    crs: string;
  }>;
  ownership_status: string;
  qr_code_data: string;
  issuing_date: string;
  disclaimer: string;
}

export interface LayerVisibilityState {
  parcels: boolean;
  buildings: boolean;
  floors: boolean;
  propertyUnits: boolean;
  roads: boolean;
  undergroundUtilities: boolean;
  depthGrid: boolean;
  airRights: boolean;
  measurements: boolean;
  basemap: 'vector' | 'satellite' | 'dark' | 'topo';
  viewMode: '3D' | '2D';
  undergroundDepthCutoff: number; // 0 to -25m
  selectedBuildingId: string | null;
  selectedFloorNumber: number | null;
  selectedUnitId: string | null;
  selectedParcelId: string | null;
  selectedUtilityId: string | null;
  isolationMode: boolean;
  highlightConflict: boolean;
  sectionSliceY: number | null;
}

export interface SearchResult {
  category: 'ULPIN' | 'UNIT' | 'BUILDING' | 'PARCEL' | 'UTILITY';
  id: string;
  title: string;
  subtitle: string;
  entity_type: 'unit' | 'building' | 'parcel' | 'utility';
  entity_id: string;
  building_id?: string;
  parcel_id?: string;
  floor_id?: string;
  coordinates: number[];
}

export type UserRole = 'SURVEY_OFFICER' | 'ADMINISTRATOR' | 'VIEWER';
