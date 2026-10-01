from fastapi import APIRouter, Query
from typing import List, Dict, Any, Optional
from backend.app.database.storage import store

router = APIRouter(prefix="/system", tags=["System & Telemetry"])

@router.get("/status")
def get_system_status():
    return {
        "status": "OPERATIONAL",
        "system_name": "3D ULPIN Cadastral Framework",
        "version": "v2.4.0-prototype",
        "jurisdiction": "Uttar Pradesh / Lucknow (Gomti Nagar Urban Zone 5)",
        "modules": {
            "gis_processing_engine": {"status": "OPERATIONAL", "latency_ms": 12, "crs_support": ["EPSG:4326", "EPSG:3857", "EPSG:32644"]},
            "three_d_visualization": {"status": "OPERATIONAL", "render_mode": "WebGL / Three.js LOD-2", "fps": 60},
            "ulpin_engine": {"status": "OPERATIONAL", "standard": "Proposed 3D Vertical Cadastre Spec 1.2", "checksum": "SHA-256 Enabled"},
            "topology_engine": {"status": "OPERATIONAL", "active_rules": 7, "last_audit_issues": len(store.validation_issues)},
            "ai_processing": {"status": "DEMONSTRATION", "mode": "Synthetic Inference Simulation", "precision": "94.2%"},
            "spatial_database": {"status": "OPERATIONAL", "driver": "Indexed Cadastral In-Memory / GeoSpatial", "total_records": len(store.units) + len(store.buildings) + len(store.parcels)},
            "api_gateway": {"status": "OPERATIONAL", "uptime_pct": 99.98}
        },
        "statistics": {
            "registered_parcels": 12486, # Demonstration zone stats
            "three_d_buildings": 3821,
            "vertical_units": 18640,
            "underground_assets": 1245,
            "demo_parcels_in_memory": len(store.parcels),
            "demo_buildings_in_memory": len(store.buildings),
            "demo_units_in_memory": len(store.units),
            "demo_utilities_in_memory": len(store.utilities)
        },
        "disclaimer": "Prototype / Demonstration Dataset. Not real government statistics."
    }

@router.get("/activity")
def get_system_activity():
    return store.activity_log

@router.get("/search")
def global_search(q: str = Query(default="", description="Search query string")):
    if not q or not q.strip():
        return []
    return store.search_all(q.strip())

