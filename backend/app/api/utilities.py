from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.app.database.storage import store

router = APIRouter(prefix="/utilities", tags=["Utilities"])

@router.get("", response_model=List[Dict[str, Any]])
def get_all_utilities():
    return store.get_all_utilities()

@router.get("/{utility_id}")
def get_utility(utility_id: str):
    util = store.get_utility_by_id(utility_id)
    if not util:
        raise HTTPException(status_code=404, detail=f"Utility asset with ID '{utility_id}' not found.")
    return util
