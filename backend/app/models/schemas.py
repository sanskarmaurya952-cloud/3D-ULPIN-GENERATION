from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field
from datetime import datetime

class Coordinate3D(BaseModel):
    x: float
    y: float
    z: float

class BoundingBox3D(BaseModel):
    xmin: float
    xmax: float
    ymin: float
    ymax: float
    zmin: float
    zmax: float
    elevation_min: float
    elevation_max: float

class Polygon2D(BaseModel):
    coordinates: List[List[float]]  # list of [x, y] or [lon, lat]

class Parcel(BaseModel):
    id: str
    code: str
    state: str = "Uttar Pradesh"
    district: str = "Lucknow"
    urban_zone: str = "Gomti Nagar, Zone 5"
    area_sqm: float
    area_sqft: float
    far_allowed: float = 3.5
    far_utilized: float = 3.12
    zoning: str = "Mixed Commercial / High-Density Residential"
    survey_number: str
    crs: str = "EPSG:4326"
    boundary_coordinates: List[List[float]] # [lon, lat]
    boundary_utm: List[List[float]] # local metric [x, y]
    buildings_count: int = 1
    validation_status: str = "VALIDATED"
    created_at: str = "2026-01-15T09:30:00Z"
    updated_at: str = "2026-09-28T14:20:00Z"

class Building(BaseModel):
    id: str
    name: str
    parcel_id: str
    total_floors: int
    basement_levels: int
    height_m: float
    built_up_area_sqft: float
    total_units: int
    footprint_coordinates: List[List[float]] # [x, y]
    center_coords: List[float] # [x, y]
    base_elevation_m: float = 100.0
    roof_elevation_m: float = 142.6
    structure_type: str = "RCC Framed Multi-Storey Commercial/Residential"
    dsm_height_source: str = "Synthetic High-Density LiDAR/DSM"
    cadastral_status: str = "VALIDATED"
    created_at: str = "2026-02-10T11:00:00Z"

class Floor(BaseModel):
    id: str
    building_id: str
    floor_number: int  # -2, -1, 0, 1, 2, ..., 14
    floor_label: str   # "Basement 2", "Basement 1", "Ground Floor", "Floor 08"
    elevation_min_m: float
    elevation_max_m: float
    height_m: float
    area_sqft: float
    units_count: int
    occupancy_type: str
    validation_status: str = "VALIDATED"

class PropertyUnit(BaseModel):
    id: str
    unit_number: str
    floor_id: str
    building_id: str
    parcel_id: str
    floor_number: int
    ulpin: str
    area_sqft: float
    carpet_area_sqft: float
    bounding_box: BoundingBox3D
    unit_type: str
    ownership_status: str = "Demonstration Record"
    spatial_status: str = "VALIDATED"
    qr_data: str

class UtilityAsset(BaseModel):
    id: str
    type: str # "Water Pipeline", "Electrical Conduit", "Sewer Network", "Telecom Spine", "Utility Tunnel", "Underground Parking"
    depth_m: float
    length_m: float
    diameter_mm: Optional[int] = None
    material: str
    status: str = "ACTIVE"
    spatial_conflict: str = "NONE" # "NONE" | "POTENTIAL_CLASH_DETECTED"
    conflict_details: Optional[str] = None
    coordinates_3d: List[List[float]] # [[x, y, z], ...]

class ValidationIssue(BaseModel):
    id: str
    rule_type: str # "SPATIAL_OVERLAP", "FOOTPRINT_CONTAINMENT", "VERTICAL_GAP", "FLOOR_CONTINUITY", "SUBTERRANEAN_CLASH", "PARCEL_BOUNDARY"
    severity: str # "PASSED", "WARNING", "CONFLICT"
    title: str
    description: str
    affected_entities: List[str]
    depth_m: Optional[float] = None
    detected_by: str = "3D Topology Engine v2.4"
    timestamp: str
    status: str = "REVIEW_REQUIRED" # "REVIEW_REQUIRED", "APPROVED_WITH_VARIANCE", "MODIFIED", "REJECTED"
    officer_decision: Optional[Dict[str, Any]] = None

class TopologyValidationResult(BaseModel):
    checks_performed: int = 18
    passed_count: int = 15
    warnings_count: int = 2
    conflicts_count: int = 1
    timestamp: str
    issues: List[ValidationIssue]

class OfficerDecisionRequest(BaseModel):
    decision: str # "APPROVED", "MODIFIED", "REJECTED"
    officer_name: str
    comments: str
    variance_approved: bool = False

class UlpinGenerateRequest(BaseModel):
    parcel_id: str
    building_id: str
    floor_id: str
    unit_id: str
    state_code: str = "IN-UP"
    district_code: str = "LKO"
    zone_code: str = "GN5"

class UlpinGenerateResponse(BaseModel):
    ulpin: str
    parcel_id: str
    building_id: str
    floor_id: str
    floor_number: int
    unit_id: str
    vertical_range: str
    elevation_min: float
    elevation_max: float
    area_sqft: float
    spatial_status: str
    qr_code_data: str
    generated_at: str
    bounding_box: BoundingBox3D
    disclaimer: str = "PROTOTYPE 3D ULPIN (Proposed 3D Cadastre Framework - Demonstration Dataset)"

class AiExtractionStep(BaseModel):
    step_number: int
    step_name: str
    status: str # "COMPLETED", "PROCESSING", "PENDING"
    description: str
    metrics: Dict[str, Any]

class AiExtractionResult(BaseModel):
    job_id: str
    input_type: str
    buildings_detected: int
    avg_confidence: float
    steps: List[AiExtractionStep]
    segmented_floors_preview: Dict[str, Any]
