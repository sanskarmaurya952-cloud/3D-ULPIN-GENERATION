from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional
from backend.app.database.storage import store

router = APIRouter(prefix="/units", tags=["Units"])

@router.get("", response_model=List[Dict[str, Any]])
def get_all_units(
    building_id: Optional[str] = Query(None),
    floor_id: Optional[str] = Query(None)
):
    if floor_id:
        return store.get_units_by_floor(floor_id)
    if building_id:
        return store.get_units_by_building(building_id)
    return list(store.units.values())

@router.get("/{unit_id}")
def get_unit(unit_id: str):
    unit = store.get_unit_by_id(unit_id)
    if not unit:
        raise HTTPException(status_code=404, detail=f"Unit with ID '{unit_id}' not found.")
    return unit
