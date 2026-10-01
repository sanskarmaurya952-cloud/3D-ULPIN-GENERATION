from fastapi import APIRouter, Query
from typing import Dict, Any, Optional
from backend.app.services.ai_pipeline import AiPipelineService

router = APIRouter(prefix="/ai", tags=["AI Processing Pipeline"])

@router.post("/building-extraction")
def run_building_extraction(dataset_name: Optional[str] = Query("lucknow_gomti_nagar_ortho_0.1m.tif")):
    return AiPipelineService.run_building_extraction_demo(dataset_name)

@router.post("/floor-segmentation")
def run_floor_segmentation(building_id: Optional[str] = Query("BLD-0007")):
    return AiPipelineService.run_floor_segmentation_analysis(building_id)
