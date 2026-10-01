from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.app.database.storage import store

router = APIRouter(prefix="/floors", tags=["Floors"])

@router.get("/{floor_id}")
def get_floor(floor_id: str):
    fl = store.get_floor_by_id(floor_id)
    if not fl:
        raise HTTPException(status_code=404, detail=f"Floor with ID '{floor_id}' not found.")
    return fl

@router.get("/{floor_id}/units")
def get_floor_units(floor_id: str):
    return store.get_units_by_floor(floor_id)
