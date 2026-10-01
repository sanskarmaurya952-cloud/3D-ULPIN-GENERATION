from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Dict, Any, Optional
from backend.app.services.gis_service import GisService
from backend.app.database.storage import store

router = APIRouter(prefix="/data", tags=["Data Import & Layers"])

@router.post("/import")
async def import_gis_dataset(
    file: UploadFile = File(...),
    layer_name: Optional[str] = Form(None),
    crs: Optional[str] = Form("EPSG:4326")
):
    try:
        content = await file.read()
        res = GisService.parse_uploaded_file(file.filename, content, file.content_type or "")
        if layer_name:
            res["layer_name"] = layer_name
        
        # Log to activity
        store.activity_log.insert(0, {
            "id": f"ACT-{len(store.activity_log)+1:03d}",
            "type": "INGEST",
            "text": f"GIS Dataset '{file.filename}' imported ({res['detected_format']})",
            "timestamp": "Just now"
        })
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Unable to process geometry file: {str(e)}")

@router.get("/sources", response_model=List[Dict[str, Any]])
def get_data_sources():
    return store.data_sources

@router.get("/geojson")
def get_geojson():
    return GisService.get_geojson_feature_collection()
