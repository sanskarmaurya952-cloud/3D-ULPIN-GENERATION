# 3D ULPIN — Intelligent 3D Urban Land & Property Identification System
### *Three-Dimensional Cadastral Mapping & Vertical Property Intelligence*

> **Disclaimer**: This platform is a **Prototype / Technical Demonstration System** developed to demonstrate the architectural principles of 3D Cadastre, vertical property stratification, and subsurface infrastructure conflict detection for the **Lucknow Urban Demonstration Zone (Gomti Nagar, Zone 5)**.

---

## 1. Project Overview & Problem Definition

Traditional 2D cadastral systems represent real estate exclusively as surface polygons on a 2D plane. In modern urban environments, cities are multi-tiered:
- Multi-storey residential & commercial buildings
- Stratified vertical property ownership (apartments, penthouses, commercial floor plates)
- Underground parking facilities and sub-basement infrastructure
- Subsurface utility corridors (water pipelines, high-voltage electrical conduits, trunk sewers, telecom fiber networks, and metro transit corridors)
- Air-rights envelopes and height limitations

**3D ULPIN** solves this spatial challenge by extending India's Unique Land Parcel Identification Number (ULPIN) framework into true 3D spatial volumes:

$$\text{2D Parcel} \longrightarrow \text{3D Building Footprint} \longrightarrow \text{Vertical Floor Volumes} \longrightarrow \text{3D Property Unit} \longrightarrow \text{Subsurface Infrastructure Validation} \longrightarrow \text{3D ULPIN}$$

---

## 2. Technical Architecture

The platform is engineered as an institutional, government-grade geospatial system:

```
peaceful-planck/
├── backend/                         # FastAPI Geospatial Microservice
│   ├── app/
│   │   ├── api/                     # REST API Endpoints
│   │   │   ├── parcels.py           # Surface Cadastral Parcels
│   │   │   ├── buildings.py         # LOD-2 3D Multi-Storey Buildings
│   │   │   ├── floors.py            # Vertical Floor Slices
│   │   │   ├── units.py             # 3D Volumetric Property Units
│   │   │   ├── utilities.py         # Subsurface Infrastructure Assets
│   │   │   ├── ulpin.py             # 3D ULPIN Assignment Engine
│   │   │   ├── validation.py        # 3D Spatial Topology Engine
│   │   │   ├── ai_extraction.py     # AI Building & Slicing Pipeline
│   │   │   ├── data_import.py       # Multi-Format GIS Ingest (GeoJSON, SHP, DSM)
│   │   │   ├── records.py           # 3D Digital Property Records (3D-DPR)
│   │   │   └── system.py            # Telemetry, Provenance & Global Search
│   │   ├── database/
│   │   │   ├── seed_data.py         # Lucknow Zone 5 Synthetic Cadastre
│   │   │   └── storage.py           # Indexed Spatial Store with Audit Trail
│   │   ├── models/
│   │   │   └── schemas.py           # Pydantic Volumetric & Spatial Schemas
│   │   └── services/
│   │       ├── gis_service.py       # Metric & CRS Coordinates Engine
│   │       ├── ulpin_generator.py   # Hierarchical 3D ULPIN + Checksum
│   │       ├── topology_engine.py   # 7-Rule 3D Validation Engine
│   │       └── ai_pipeline.py       # Photogrammetry & Slicing Simulation
│   ├── requirements.txt
│   └── run.py
│
├── frontend/                        # React 18 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/              # Institutional Header, Sidebar, Breadcrumb
│   │   │   ├── viewer3d/            # Three.js 3D WebGL Cadastral Canvas
│   │   │   │   ├── CadastreViewer3D.tsx    # Raycasting, Shaders & 3D Volumes
│   │   │   │   ├── ViewerControls.tsx       # 2D/3D, Basemap & Isolation Tools
│   │   │   │   ├── LayerControlPanel.tsx    # Multi-Layer Checklist
│   │   │   │   ├── SubsurfaceDepthSlider.tsx# Z-Depth Sliders (0 to -25m)
│   │   │   │   ├── CoordinateHUD.tsx        # Live EPSG:4326 & MSL Altitude HUD
│   │   │   │   └── VerticalFloorStepper.tsx # Floor Level Selector (B2..F14)
│   │   │   ├── inspector/           # Technical Cadastral Inspector Panels
│   │   │   └── validation/          # Topology Audit & Conflict Review Modals
│   │   ├── views/                   # 11 Dedicated Institutional Views
│   │   ├── api/                     # Type-Safe API Client with Offline Resilience
│   │   ├── data/                    # Local Spatial Data & LOD-2 Geometries
│   │   └── types/                   # Cadastral & Volumetric TypeScript Definitions
└── README.md
```

---

## 3. 3D ULPIN Specification (Proposed Standard)

The prototype assigns unique volumetric identifiers according to the hierarchical spatial schema:

$$\mathbf{IN}\text{-}\mathbf{\{DISTRICT\}}\text{-}\mathbf{\{ZONE\}}\text{-}\mathbf{\{PARCEL\}}\text{-}\mathbf{\{BUILDING\}}\text{-}\mathbf{\{FLOOR\}}\text{-}\mathbf{\{UNIT\}}$$

### Example Breakdown:
| Segment | Value | Description |
|---|---|---|
| **Country** | `IN` | Republic of India |
| **District** | `LKO` | Lucknow District |
| **Urban Zone** | `GN5` | Gomti Nagar (Zone 5) |
| **Parcel** | `102` | Cadastral Parcel `PAR-0102` |
| **Building** | `B07` | Shikhar Heights (`BLD-0007`) |
| **Floor** | `F08` | 8th Floor Slab (124.20m – 127.20m MSL) |
| **Unit** | `U03` | Volumetric Property Unit `U-03` |

**Full 3D ULPIN:** `IN-LKO-GN5-102-B07-F08-U03`

Each unit volume is represented by an explicit 3D bounding envelope:
```json
{
  "xmin": 18.00,
  "xmax": 35.00,
  "ymin": 35.00,
  "ymax": 52.00,
  "zmin": 24.20,
  "zmax": 27.20,
  "elevation_min": 124.20,
  "elevation_max": 127.20,
  "area_sqft": 1240.0
}
```

---

## 4. 3D Topology Validation Engine (7 Rules)

The system executes 18 automated spatial integrity checks across 7 core rules:
1. **Parcel Boundary Ring Validity**: Closed polygon, positive orientation, non-self-intersection.
2. **Building Footprint Containment**: Validates that LOD-2 building footprint falls strictly within the registered 2D parcel boundary polygon.
3. **Vertical Stack Continuity**: Verifies uniform inter-floor clearances without unregistered vertical voids.
4. **Volumetric Unit Disjointness**: Ensures property unit volumes have mutually disjoint interiors.
5. **Subsurface Infrastructure Clash Matrix**: Performs 3D spatial intersection queries between building basement foundations and subsurface utility pipelines (flags clash `VAL-00231` with water pipeline `UTL-023` at depth -8.20m).
6. **ULPIN Registry Uniqueness**: Cryptographic collision and duplicate identity detection.
7. **Air-Rights & Maximum Permissible Height**: Confirms compliance with municipal zonal altitude envelopes and airport obstacle limitation surfaces.

---

## 5. Official Walkthrough Demo Scenario

The application implements the complete official demonstration workflow:
1. Open **Dashboard** → Inspect Gomti Nagar demonstration statistics and live preview.
2. Open **3D Cadastre Viewer** → View parcels, buildings, and ground grid.
3. Select **Parcel P-0102** → Inspect boundary coordinates and FAR metrics.
4. Open **Building BLD-0007** (*Shikhar Heights & Commercial Plaza*).
5. Click **View Vertical Structure** → Building isolates in 3D; exterior surrounding buildings dim.
6. Use **Vertical Floor Stepper** to navigate from Basement 2 up to Floor 14.
7. Select **Floor 08** → Floor slice highlights and displays interior property unit volumes.
8. Select **Unit F08-U03** → View 3D volumetric bounding box `[xmin, xmax, ymin, ymax, zmin, zmax]` and altitude `124.20m – 127.20m MSL`.
9. Move **Subsurface Depth Slider** to `-10.0m` → Ground becomes transparent, exposing underground utility pipelines.
10. Navigate to **3D ULPIN Generator** → Complete 5-step hierarchy and generate `IN-LKO-GN5-102-B07-F08-U03` with QR code.
11. Navigate to **Topology Validation** → Run audit matrix; detect clash `VAL-00231`.
12. Open **Conflict Review (VAL-00231)** → Review spatial clash schematic between `BLD-0007` Basement-2 and Water Pipeline `UTL-023` at `-8.20m`.
13. Submit **Officer Decision** (*Approve Variance with statutory easement remarks*).
14. Open **Digital Property Record (3D-DPR)** → Inspect formal certificate with QR code, spatial extent coordinates, validation audit trail, and print/PDF export.

---

## 6. Installation & Execution Guide

### Prerequisites
- **Node.js**: v18+ (Tested on v24.13)
- **Python**: 3.10+ (Tested on 3.14)

### Backend Setup
```bash
cd backend
python -m venv .venv

# On Windows PowerShell:
.\.venv\Scripts\pip install -r requirements.txt
.\.venv\Scripts\python run.py

# On Linux/macOS:
source .venv/bin/activate
pip install -r requirements.txt
python run.py
```
Backend API will be live at: `http://127.0.0.1:8000` (Interactive API Docs: `http://127.0.0.1:8000/docs`).

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend Web Portal will be live at: `http://localhost:5173`.

---

## 7. Working REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health and uptime |
| `GET` | `/api/parcels` | List all 2D cadastral parcels |
| `GET` | `/api/parcels/{id}` | Get parcel attributes & boundary coordinates |
| `GET` | `/api/buildings` | List all 3D buildings |
| `GET` | `/api/buildings/{id}` | Get building metadata & height |
| `GET` | `/api/buildings/{id}/floors` | List vertical floor slices |
| `GET` | `/api/units/{id}` | Get 3D property unit volumetric coordinates |
| `GET` | `/api/utilities` | List subsurface utility networks |
| `POST` | `/api/ulpin/generate` | Generate verified 3D ULPIN with QR code data |
| `GET` | `/api/ulpin/{ulpin}` | Resolve ULPIN to full spatial hierarchy |
| `POST` | `/api/validation/run` | Execute 7-rule 3D spatial topology engine |
| `GET` | `/api/validation/issues` | Retrieve active conflict queue |
| `POST` | `/api/validation/{id}/decision` | Record Survey Officer decision (Approve/Modify/Reject) |
| `POST` | `/api/data/import` | Ingest and validate GIS files (GeoJSON, SHP, DSM) |
| `GET` | `/api/records/property/{ulpin}` | Generate complete 3D Digital Property Record |
| `GET` | `/api/system/status` | Real-time component telemetry & data provenance |
| `GET` | `/api/system/search?q={query}` | Global search across ULPINs, parcels, buildings, units |

---

## 8. Prototype Limitations vs. Production Integration

| Capability | Prototype Demonstration | Production Implementation |
|---|---|---|
| **Spatial Database** | Indexed In-Memory Spatial Store with GeoJSON | PostgreSQL 16 + PostGIS with `SFCGAL` 3D extension |
| **3D Rendering** | WebGL / Three.js LOD-2 with custom shaders | CesiumJS / 3D Tiles 1.1 + OGC API 3D Geovolumes |
| **Photogrammetry / AI** | Synthetic Photogrammetric Ingestion Pipeline | PyTorch / GDAL / PDAL pipeline on Cloud GPU Cluster |
| **Authentication** | Institutional Role Model (Officer, Admin, Viewer) | Aadhaar / SSO Govt e-Pramaan Auth with Digital Signatures |
| **Certificates** | High-fidelity Digital Certificate with QR Code | Tamper-proof Verifiable Credentials + State Blockchain Anchor |

---

## 9. License & Institutional Context

Developed as a proposed technical prototype for **3D Cadastral Mapping & Vertical Property Identification**. All data for Gomti Nagar Zone 5 is synthetic demonstration data.
