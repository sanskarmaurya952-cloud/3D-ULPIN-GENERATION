from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from backend.app.models.schemas import UlpinGenerateRequest, UlpinGenerateResponse
from backend.app.services.ulpin_generator import UlpinGeneratorService
from backend.app.database.storage import store

router = APIRouter(prefix="/ulpin", tags=["ULPIN"])

@router.post("/generate", response_model=Dict[str, Any])
def generate_ulpin(req: UlpinGenerateRequest):
    try:
        result = UlpinGeneratorService.generate_3d_ulpin(
            parcel_id=req.parcel_id,
            building_id=req.building_id,
            floor_id=req.floor_id,
            unit_id=req.unit_id,
            district_code=req.district_code,
            zone_code=req.zone_code
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{ulpin}")
def get_ulpin_record(ulpin: str):
    unit = store.get_unit_by_ulpin(ulpin)
    if not unit:
        raise HTTPException(status_code=404, detail=f"No spatial record found for ULPIN '{ulpin}'.")
    
    building = store.get_building_by_id(unit["building_id"])
    parcel = store.get_parcel_by_id(unit["parcel_id"])
    floor = store.get_floor_by_id(unit["floor_id"])

    return {
        "ulpin": unit["ulpin"],
        "unit": unit,
        "floor": floor,
        "building": building,
        "parcel": parcel,
        "spatial_status": unit["spatial_status"],
        "ownership_status": unit["ownership_status"],
        "elevation_profile": {
            "min_elevation_m": unit["bounding_box"]["elevation_min"],
            "max_elevation_m": unit["bounding_box"]["elevation_max"],
            "height_clearance_m": round(unit["bounding_box"]["elevation_max"] - unit["bounding_box"]["elevation_min"], 2)
        },
        "disclaimer": "PROTOTYPE 3D ULPIN (Proposed 3D Cadastre Framework - Demonstration Dataset)"
    }
