from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.app.database.storage import store

router = APIRouter(prefix="/buildings", tags=["Buildings"])

@router.get("", response_model=List[Dict[str, Any]])
def get_all_buildings():
    return store.get_all_buildings()

@router.get("/{building_id}")
def get_building(building_id: str):
    bld = store.get_building_by_id(building_id)
    if not bld:
        raise HTTPException(status_code=404, detail=f"Building with ID '{building_id}' not found.")
    return bld

@router.get("/{building_id}/floors")
def get_building_floors(building_id: str):
    return store.get_floors_by_building(building_id)

@router.get("/{building_id}/units")
def get_building_units(building_id: str):
    return store.get_units_by_building(building_id)
