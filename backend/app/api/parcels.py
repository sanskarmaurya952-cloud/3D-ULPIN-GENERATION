from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.app.database.storage import store

router = APIRouter(prefix="/parcels", tags=["Parcels"])

@router.get("", response_model=List[Dict[str, Any]])
def get_all_parcels():
    return store.get_all_parcels()

@router.get("/{parcel_id}")
def get_parcel(parcel_id: str):
    parcel = store.get_parcel_by_id(parcel_id)
    if not parcel:
        raise HTTPException(status_code=404, detail=f"Parcel with ID '{parcel_id}' not found.")
    return parcel

@router.get("/{parcel_id}/buildings")
def get_parcel_buildings(parcel_id: str):
    return store.get_buildings_by_parcel(parcel_id)
