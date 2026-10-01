from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from backend.app.database.storage import store

router = APIRouter(prefix="/records", tags=["Property Records"])

@router.get("/property/{ulpin}")
def get_digital_property_record(ulpin: str):
    unit = store.get_unit_by_ulpin(ulpin)
    if not unit:
        # Fallback to search unit by ID
        unit = store.get_unit_by_id(ulpin)
        if not unit:
            raise HTTPException(status_code=404, detail=f"No digital property record found for identifier '{ulpin}'.")

    bld = store.get_building_by_id(unit["building_id"])
    parcel = store.get_parcel_by_id(unit["parcel_id"])
    floor = store.get_floor_by_id(unit["floor_id"])
    
    # Associated utilities within spatial proximity
    nearby_utils = store.get_all_utilities()[:3]

    return {
        "record_id": f"DPR-{unit['ulpin'].replace('-', '')}",
        "ulpin": unit["ulpin"],
        "record_title": "THREE-DIMENSIONAL DIGITAL PROPERTY RECORD (3D-DPR)",
        "framework": "Proposed 3D Cadastre Identification Framework",
        "jurisdiction": {
            "country": "India",
            "state": "Uttar Pradesh",
            "district": "Lucknow",
            "tehsil": "Lucknow Sadar",
            "urban_zone": "Gomti Nagar, Zone 5",
            "ward_number": "Ward 42 (Vibhuti Khand)",
            "authority": "Lucknow Development Authority & Directorate of Land Records"
        },
        "spatial_definition": {
            "parcel_id": parcel["id"] if parcel else "PAR-0102",
            "parcel_survey_no": parcel["survey_number"] if parcel else "LKO/GN5/102/2024",
            "parcel_area_sqm": parcel["area_sqm"] if parcel else 2450.0,
            "crs": "EPSG:4326 (WGS 84) / Local Metric Heights",
            "building_id": bld["id"] if bld else "BLD-0007",
            "building_name": bld["name"] if bld else "Shikhar Heights & Commercial Plaza",
            "building_structure": bld["structure_type"] if bld else "RCC Framed",
            "total_floors": bld["total_floors"] if bld else 14,
            "floor_level": floor["floor_label"] if floor else "Floor 08",
            "floor_number": unit["floor_number"],
            "unit_number": unit["unit_number"],
            "unit_type": unit["unit_type"],
            "carpet_area_sqft": unit["carpet_area_sqft"],
            "built_up_area_sqft": unit["area_sqft"],
            "volumetric_bounding_box": unit["bounding_box"],
            "vertical_extent": {
                "elevation_datum": "Mean Sea Level (MSL)",
                "z_min_msl": unit["bounding_box"]["elevation_min"],
                "z_max_msl": unit["bounding_box"]["elevation_max"],
                "vertical_clearance_m": round(unit["bounding_box"]["elevation_max"] - unit["bounding_box"]["elevation_min"], 2)
            }
        },
        "subsurface_and_air_rights": {
            "air_rights_envelope_status": "COMPLIANT (Beneath Airport Obstacle Limitation Surface)",
            "subsurface_easements": "Water Pipeline UTL-023 Utility Corridor Variance Recorded",
            "parking_allocated": "Basement-1 Bay P-14 (Subsurface Parcel IN-LKO-GN5-102-B07-B01-P14)"
        },
        "validation_history": [
            {
                "stage": "2D Parcel Boundary Verification",
                "status": "VALIDATED",
                "timestamp": "2026-01-15T09:30:00Z",
                "officer": "Zonal Revenue Inspector"
            },
            {
                "stage": "3D Building LiDAR & Footprint Extraction",
                "status": "VALIDATED",
                "timestamp": "2026-02-10T11:00:00Z",
                "officer": "Urban GIS Photogrammetry Unit"
            },
            {
                "stage": "Vertical Volumetric Floor Partitioning",
                "status": "VALIDATED",
                "timestamp": "2026-03-05T14:20:00Z",
                "officer": "Municipal Town Planning Directorate"
            },
            {
                "stage": "3D Topology & Utility Conflict Audit",
                "status": "APPROVED_WITH_VARIANCE",
                "timestamp": "2026-09-30T10:30:00Z",
                "officer": "Senior Cadastral Officer R. K. Sharma"
            }
        ],
        "data_sources": [
            {"layer": "Cadastral Boundary", "provenance": "State Land Records GIS (Demonstration Dataset)", "crs": "EPSG:4326"},
            {"layer": "3D Building Geometry", "provenance": "Synthetic LOD-2 Mesh from LiDAR DSM", "crs": "EPSG:4326"},
            {"layer": "Floor Unit Volumes", "provenance": "Sanctioned Architectural BIM/CAD Export", "crs": "Local Grid"},
            {"layer": "Subsurface Utilities", "provenance": "Municipal GPR & Utility Registry", "crs": "EPSG:4326"}
        ],
        "ownership_status": "Demonstration Record (Fictionalized Prototype Data)",
        "qr_code_data": unit["ulpin"],
        "issuing_date": "2026-09-30",
        "disclaimer": "PROTOTYPE 3D PROPERTY RECORD — For technical demonstration of 3D Cadastral & ULPIN mapping principles. Not a legal deed or official government certification."
    }
