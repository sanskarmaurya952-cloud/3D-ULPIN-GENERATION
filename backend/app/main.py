from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

from backend.app.api.parcels import router as parcels_router
from backend.app.api.buildings import router as buildings_router
from backend.app.api.floors import router as floors_router
from backend.app.api.units import router as units_router
from backend.app.api.utilities import router as utilities_router
from backend.app.api.ulpin import router as ulpin_router
from backend.app.api.validation import router as validation_router
from backend.app.api.ai_extraction import router as ai_router
from backend.app.api.data_import import router as data_router
from backend.app.api.records import router as records_router
from backend.app.api.system import router as system_router

app = FastAPI(
    title="3D ULPIN Cadastral Engine API",
    description="Intelligent 3D Urban Land & Property Identification System Backend",
    version="2.4.0",
)

# CORS middleware for local development & cross-origin frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API routers under /api
app.include_router(parcels_router, prefix="/api")
app.include_router(buildings_router, prefix="/api")
app.include_router(floors_router, prefix="/api")
app.include_router(units_router, prefix="/api")
app.include_router(utilities_router, prefix="/api")
app.include_router(ulpin_router, prefix="/api")
app.include_router(validation_router, prefix="/api")
app.include_router(ai_router, prefix="/api")
app.include_router(data_router, prefix="/api")
app.include_router(records_router, prefix="/api")
app.include_router(system_router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "3D ULPIN Cadastral Backend",
        "timestamp": time.time(),
        "mode": "PROTOTYPE_DEMONSTRATION"
    }

@app.get("/")
def root():
    return {
        "message": "3D ULPIN — Intelligent 3D Urban Land & Property Identification System API",
        "docs_url": "/docs",
        "health": "/api/health"
    }
