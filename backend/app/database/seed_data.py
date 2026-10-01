"""
Seed Spatial & Cadastral Dataset for Lucknow Urban Demonstration Zone (Gomti Nagar, Zone 5)
Contains:
- 12 Cadastral Parcels with exact boundary polygons and local UTM coordinates
- 8 Multi-Storey Buildings (including Flagship BLD-0007: 14 storeys, 2 basements, 56 units)
- 16 Floor levels for BLD-0007 (B2, B1, G, F1..F14) and floors for all other buildings
- 120+ 3D Volumetric Property Units with [xmin, xmax, ymin, ymax, zmin, zmax, elevation_min, elevation_max]
- 8 Underground Utility Assets (Water Pipeline UTL-023, Electrical, Sewer, Telecom, Metro, Utility Tunnel)
- Topology Validation Test Suite & Conflict Cases (VAL-00231)
"""

from typing import Dict, Any, List

PARCELS_DATA: List[Dict[str, Any]] = [
    {
        "id": "PAR-0102",
        "code": "P-0102",
        "state": "Uttar Pradesh",
        "district": "Lucknow",
        "urban_zone": "Gomti Nagar, Zone 5",
        "area_sqm": 2450.0,
        "area_sqft": 26371.6,
        "far_allowed": 3.5,
        "far_utilized": 3.12,
        "zoning": "Commercial / High-Density Mixed Use",
        "survey_number": "LKO/GN5/102/2024",
        "crs": "EPSG:4326",
        "boundary_coordinates": [
            [80.99215, 26.85320],
            [80.99285, 26.85320],
            [80.99285, 26.85260],
            [80.99215, 26.85260],
            [80.99215, 26.85320]
        ],
        "boundary_utm": [
            [10.0, 10.0],
            [60.0, 10.0],
            [60.0, 60.0],
            [10.0, 60.0],
            [10.0, 10.0]
        ],
        "buildings_count": 1,
        "validation_status": "VALIDATED",
        "created_at": "2026-01-15T09:30:00Z",
        "updated_at": "2026-09-28T14:20:00Z"
    },
    {
        "id": "PAR-0103",
        "code": "P-0103",
        "state": "Uttar Pradesh",
        "district": "Lucknow",
        "urban_zone": "Gomti Nagar, Zone 5",
        "area_sqm": 1820.0,
        "area_sqft": 19590.3,
        "far_allowed": 3.0,
        "far_utilized": 2.85,
        "zoning": "Commercial Tech Park",
        "survey_number": "LKO/GN5/103/2024",
        "crs": "EPSG:4326",
        "boundary_coordinates": [
            [80.99310, 26.85320],
            [80.99370, 26.85320],
            [80.99370, 26.85260],
            [80.99310, 26.85260],
            [80.99310, 26.85320]
        ],
        "boundary_utm": [
            [75.0, 10.0],
            [120.0, 10.0],
            [120.0, 60.0],
            [75.0, 60.0],
            [75.0, 10.0]
        ],
        "buildings_count": 1,
        "validation_status": "VALIDATED",
        "created_at": "2026-01-16T10:00:00Z",
        "updated_at": "2026-09-25T11:15:00Z"
    },
    {
        "id": "PAR-0104",
        "code": "P-0104",
        "state": "Uttar Pradesh",
        "district": "Lucknow",
        "urban_zone": "Gomti Nagar, Zone 5",
        "area_sqm": 3100.0,
        "area_sqft": 33368.1,
        "far_allowed": 3.5,
        "far_utilized": 3.40,
        "zoning": "Multi-Storey Residential Complex",
        "survey_number": "LKO/GN5/104/2024",
        "crs": "EPSG:4326",
        "boundary_coordinates": [
            [80.99215, 26.85235],
            [80.99285, 26.85235],
            [80.99285, 26.85160],
            [80.99215, 26.85160],
            [80.99215, 26.85235]
        ],
        "boundary_utm": [
            [10.0, 75.0],
            [60.0, 75.0],
            [60.0, 130.0],
            [10.0, 130.0],
            [10.0, 75.0]
        ],
        "buildings_count": 2,
        "validation_status": "VALIDATED",
        "created_at": "2026-01-18T14:30:00Z",
        "updated_at": "2026-09-20T16:40:00Z"
    },
    {
        "id": "PAR-0105",
        "code": "P-0105",
        "state": "Uttar Pradesh",
        "district": "Lucknow",
        "urban_zone": "Gomti Nagar, Zone 5",
        "area_sqm": 2200.0,
        "area_sqft": 23680.6,
        "far_allowed": 2.5,
        "far_utilized": 2.10,
        "zoning": "Institutional / Civic Complex",
        "survey_number": "LKO/GN5/105/2024",
        "crs": "EPSG:4326",
        "boundary_coordinates": [
            [80.99310, 26.85235],
            [80.99375, 26.85235],
            [80.99375, 26.85160],
            [80.99310, 26.85160],
            [80.99310, 26.85235]
        ],
        "boundary_utm": [
            [75.0, 75.0],
            [125.0, 75.0],
            [125.0, 130.0],
            [75.0, 130.0],
            [75.0, 75.0]
        ],
        "buildings_count": 1,
        "validation_status": "VALIDATED",
        "created_at": "2026-01-20T08:45:00Z",
        "updated_at": "2026-09-18T12:10:00Z"
    },
    {
        "id": "PAR-0106",
        "code": "P-0106",
        "state": "Uttar Pradesh",
        "district": "Lucknow",
        "urban_zone": "Gomti Nagar, Zone 5",
        "area_sqm": 1650.0,
        "area_sqft": 17760.5,
        "far_allowed": 2.5,
        "far_utilized": 2.35,
        "zoning": "Commercial Retail Hub",
        "survey_number": "LKO/GN5/106/2024",
        "crs": "EPSG:4326",
        "boundary_coordinates": [
            [80.99400, 26.85320],
            [80.99460, 26.85320],
            [80.99460, 26.85260],
            [80.99400, 26.85260],
            [80.99400, 26.85320]
        ],
        "boundary_utm": [
            [140.0, 10.0],
            [185.0, 10.0],
            [185.0, 60.0],
            [140.0, 60.0],
            [140.0, 10.0]
        ],
        "buildings_count": 1,
        "validation_status": "VALIDATED",
        "created_at": "2026-01-25T15:20:00Z",
        "updated_at": "2026-09-22T09:15:00Z"
    },
    {
        "id": "PAR-0107",
        "code": "P-0107",
        "state": "Uttar Pradesh",
        "district": "Lucknow",
        "urban_zone": "Gomti Nagar, Zone 5",
        "area_sqm": 1950.0,
        "area_sqft": 20989.6,
        "far_allowed": 3.0,
        "far_utilized": 2.90,
        "zoning": "Mixed-Use Tower",
        "survey_number": "LKO/GN5/107/2024",
        "crs": "EPSG:4326",
        "boundary_coordinates": [
            [80.99400, 26.85235],
            [80.99460, 26.85235],
            [80.99460, 26.85160],
            [80.99400, 26.85160],
            [80.99400, 26.85235]
        ],
        "boundary_utm": [
            [140.0, 75.0],
            [185.0, 75.0],
            [185.0, 130.0],
            [140.0, 130.0],
            [140.0, 75.0]
        ],
        "buildings_count": 1,
        "validation_status": "VALIDATED",
        "created_at": "2026-02-01T10:10:00Z",
        "updated_at": "2026-09-26T17:30:00Z"
    },
    {
        "id": "PAR-0108",
        "code": "P-0108",
        "state": "Uttar Pradesh",
        "district": "Lucknow",
        "urban_zone": "Gomti Nagar, Zone 5",
        "area_sqm": 2800.0,
        "area_sqft": 30138.9,
        "far_allowed": 3.2,
        "far_utilized": 2.80,
        "zoning": "Healthcare / Diagnostic Centre",
        "survey_number": "LKO/GN5/108/2024",
        "crs": "EPSG:4326",
        "boundary_coordinates": [
            [80.99215, 26.85135],
            [80.99285, 26.85135],
            [80.99285, 26.85055],
            [80.99215, 26.85055],
            [80.99215, 26.85135]
        ],
        "boundary_utm": [
            [10.0, 145.0],
            [60.0, 145.0],
            [60.0, 200.0],
            [10.0, 200.0],
            [10.0, 145.0]
        ],
        "buildings_count": 1,
        "validation_status": "VALIDATED",
        "created_at": "2026-02-05T12:00:00Z",
        "updated_at": "2026-09-24T14:10:00Z"
    },
    {
        "id": "PAR-0109",
        "code": "P-0109",
        "state": "Uttar Pradesh",
        "district": "Lucknow",
        "urban_zone": "Gomti Nagar, Zone 5",
        "area_sqm": 2100.0,
        "area_sqft": 22604.2,
        "far_allowed": 3.0,
        "far_utilized": 2.75,
        "zoning": "Corporate Regional Headquarters",
        "survey_number": "LKO/GN5/109/2024",
        "crs": "EPSG:4326",
        "boundary_coordinates": [
            [80.99310, 26.85135],
            [80.99375, 26.85135],
            [80.99375, 26.85055],
            [80.99310, 26.85055],
            [80.99310, 26.85135]
        ],
        "boundary_utm": [
            [75.0, 145.0],
            [125.0, 145.0],
            [125.0, 200.0],
            [75.0, 200.0],
            [75.0, 145.0]
        ],
        "buildings_count": 1,
        "validation_status": "VALIDATED",
        "created_at": "2026-02-12T09:40:00Z",
        "updated_at": "2026-09-19T11:00:00Z"
    },
    {
        "id": "PAR-0110",
        "code": "P-0110",
        "state": "Uttar Pradesh",
        "district": "Lucknow",
        "urban_zone": "Gomti Nagar, Zone 5",
        "area_sqm": 3500.0,
        "area_sqft": 37673.7,
        "far_allowed": 1.5,
        "far_utilized": 0.40,
        "zoning": "Public Transit & Subsurface Utility Hub",
        "survey_number": "LKO/GN5/110/2024",
        "crs": "EPSG:4326",
        "boundary_coordinates": [
            [80.99400, 26.85135],
            [80.99480, 26.85135],
            [80.99480, 26.85055],
            [80.99400, 26.85055],
            [80.99400, 26.85135]
        ],
        "boundary_utm": [
            [140.0, 145.0],
            [195.0, 145.0],
            [195.0, 200.0],
            [140.0, 200.0],
            [140.0, 145.0]
        ],
        "buildings_count": 0,
        "validation_status": "VALIDATED",
        "created_at": "2026-02-18T16:00:00Z",
        "updated_at": "2026-09-27T10:30:00Z"
    }
]

BUILDINGS_DATA: List[Dict[str, Any]] = [
    {
        "id": "BLD-0007",
        "name": "Shikhar Heights & Commercial Plaza",
        "parcel_id": "PAR-0102",
        "total_floors": 14,
        "basement_levels": 2,
        "height_m": 42.6,
        "built_up_area_sqft": 18400.0,
        "total_units": 56,
        "footprint_coordinates": [
            [18.0, 18.0],
            [52.0, 18.0],
            [52.0, 52.0],
            [18.0, 52.0],
            [18.0, 18.0]
        ],
        "center_coords": [35.0, 35.0],
        "base_elevation_m": 100.0,
        "roof_elevation_m": 142.6,
        "structure_type": "RCC Framed Multi-Storey Commercial/Residential",
        "dsm_height_source": "Synthetic High-Density LiDAR/DSM",
        "cadastral_status": "VALIDATED",
        "created_at": "2026-02-10T11:00:00Z"
    },
    {
        "id": "BLD-0008",
        "name": "CyberTech Innovation Center",
        "parcel_id": "PAR-0103",
        "total_floors": 8,
        "basement_levels": 1,
        "height_m": 27.2,
        "built_up_area_sqft": 12800.0,
        "total_units": 24,
        "footprint_coordinates": [
            [82.0, 18.0],
            [112.0, 18.0],
            [112.0, 48.0],
            [82.0, 48.0],
            [82.0, 18.0]
        ],
        "center_coords": [97.0, 33.0],
        "base_elevation_m": 100.0,
        "roof_elevation_m": 127.2,
        "structure_type": "Commercial Steel-Frame IT Complex",
        "dsm_height_source": "Synthetic High-Density LiDAR/DSM",
        "cadastral_status": "VALIDATED",
        "created_at": "2026-02-12T13:30:00Z"
    },
    {
        "id": "BLD-0009",
        "name": "Gomti Palms Tower A",
        "parcel_id": "PAR-0104",
        "total_floors": 12,
        "basement_levels": 2,
        "height_m": 37.8,
        "built_up_area_sqft": 15600.0,
        "total_units": 48,
        "footprint_coordinates": [
            [18.0, 82.0],
            [38.0, 82.0],
            [38.0, 120.0],
            [18.0, 120.0],
            [18.0, 82.0]
        ],
        "center_coords": [28.0, 101.0],
        "base_elevation_m": 100.0,
        "roof_elevation_m": 137.8,
        "structure_type": "Residential High-Rise Tower",
        "dsm_height_source": "Synthetic High-Density LiDAR/DSM",
        "cadastral_status": "VALIDATED",
        "created_at": "2026-02-15T09:15:00Z"
    },
    {
        "id": "BLD-0010",
        "name": "Gomti Palms Tower B",
        "parcel_id": "PAR-0104",
        "total_floors": 10,
        "basement_levels": 2,
        "height_m": 31.5,
        "built_up_area_sqft": 13200.0,
        "total_units": 40,
        "footprint_coordinates": [
            [42.0, 82.0],
            [54.0, 82.0],
            [54.0, 120.0],
            [42.0, 120.0],
            [42.0, 82.0]
        ],
        "center_coords": [48.0, 101.0],
        "base_elevation_m": 100.0,
        "roof_elevation_m": 131.5,
        "structure_type": "Residential High-Rise Tower",
        "dsm_height_source": "Synthetic High-Density LiDAR/DSM",
        "cadastral_status": "VALIDATED",
        "created_at": "2026-02-15T09:30:00Z"
    },
    {
        "id": "BLD-0011",
        "name": "Zonal Administrative Annex",
        "parcel_id": "PAR-0105",
        "total_floors": 5,
        "basement_levels": 1,
        "height_m": 18.5,
        "built_up_area_sqft": 9200.0,
        "total_units": 15,
        "footprint_coordinates": [
            [84.0, 84.0],
            [116.0, 84.0],
            [116.0, 118.0],
            [84.0, 118.0],
            [84.0, 84.0]
        ],
        "center_coords": [100.0, 101.0],
        "base_elevation_m": 100.0,
        "roof_elevation_m": 118.5,
        "structure_type": "Civic Institutional Building",
        "dsm_height_source": "Synthetic High-Density LiDAR/DSM",
        "cadastral_status": "VALIDATED",
        "created_at": "2026-02-20T14:00:00Z"
    },
    {
        "id": "BLD-0012",
        "name": "Apex Commercial Arcade",
        "parcel_id": "PAR-0106",
        "total_floors": 6,
        "basement_levels": 1,
        "height_m": 21.0,
        "built_up_area_sqft": 8400.0,
        "total_units": 18,
        "footprint_coordinates": [
            [148.0, 18.0],
            [176.0, 18.0],
            [176.0, 50.0],
            [148.0, 50.0],
            [148.0, 18.0]
        ],
        "center_coords": [162.0, 34.0],
        "base_elevation_m": 100.0,
        "roof_elevation_m": 121.0,
        "structure_type": "Commercial Retail Mall",
        "dsm_height_source": "Synthetic High-Density LiDAR/DSM",
        "cadastral_status": "VALIDATED",
        "created_at": "2026-02-22T10:45:00Z"
    },
    {
        "id": "BLD-0013",
        "name": "Pratap Mixed Sovereign Tower",
        "parcel_id": "PAR-0107",
        "total_floors": 11,
        "basement_levels": 2,
        "height_m": 35.2,
        "built_up_area_sqft": 14500.0,
        "total_units": 44,
        "footprint_coordinates": [
            [148.0, 82.0],
            [178.0, 82.0],
            [178.0, 122.0],
            [148.0, 122.0],
            [148.0, 82.0]
        ],
        "center_coords": [163.0, 102.0],
        "base_elevation_m": 100.0,
        "roof_elevation_m": 135.2,
        "structure_type": "Mixed Commercial & Residential Tower",
        "dsm_height_source": "Synthetic High-Density LiDAR/DSM",
        "cadastral_status": "VALIDATED",
        "created_at": "2026-02-25T11:20:00Z"
    },
    {
        "id": "BLD-0014",
        "name": "Medanta Life Health Pavilion",
        "parcel_id": "PAR-0108",
        "total_floors": 7,
        "basement_levels": 1,
        "height_m": 24.5,
        "built_up_area_sqft": 11200.0,
        "total_units": 21,
        "footprint_coordinates": [
            [18.0, 152.0],
            [52.0, 152.0],
            [52.0, 190.0],
            [18.0, 190.0],
            [18.0, 152.0]
        ],
        "center_coords": [35.0, 171.0],
        "base_elevation_m": 100.0,
        "roof_elevation_m": 124.5,
        "structure_type": "Specialized Medical Healthcare Facility",
        "dsm_height_source": "Synthetic High-Density LiDAR/DSM",
        "cadastral_status": "VALIDATED",
        "created_at": "2026-03-01T15:00:00Z"
    }
]

def generate_floors_for_building(bld: Dict[str, Any]) -> List[Dict[str, Any]]:
    floors = []
    bld_id = bld["id"]
    base_elev = bld["base_elevation_m"]
    floor_h = bld["height_m"] / bld["total_floors"]
    
    # Basements
    for b in range(bld["basement_levels"], 0, -1):
        b_num = -b
        b_elev_max = base_elev - (b - 1) * 3.2
        b_elev_min = base_elev - b * 3.2
        floors.append({
            "id": f"{bld_id.replace('-', '')}-B{b}",
            "building_id": bld_id,
            "floor_number": b_num,
            "floor_label": f"Basement {b}",
            "elevation_min_m": round(b_elev_min, 2),
            "elevation_max_m": round(b_elev_max, 2),
            "height_m": 3.20,
            "area_sqft": round(bld["built_up_area_sqft"] / bld["total_floors"] * 1.1, 1),
            "units_count": 2 if b == 1 else 0, # parking/storage
            "occupancy_type": "Subsurface Parking & Mechanical Services",
            "validation_status": "VALIDATED"
        })
        
    # Ground Floor
    floors.append({
        "id": f"{bld_id.replace('-', '')}-G00",
        "building_id": bld_id,
        "floor_number": 0,
        "floor_label": "Ground Floor",
        "elevation_min_m": round(base_elev, 2),
        "elevation_max_m": round(base_elev + floor_h, 2),
        "height_m": round(floor_h, 2),
        "area_sqft": round(bld["built_up_area_sqft"] / bld["total_floors"], 1),
        "units_count": 4,
        "occupancy_type": "Commercial Lobby & Retail Frontage",
        "validation_status": "VALIDATED"
    })
    
    # Upper Floors
    for f in range(1, bld["total_floors"] + 1):
        f_min = base_elev + (f - 1) * floor_h
        f_max = base_elev + f * floor_h
        floors.append({
            "id": f"{bld_id.replace('-', '')}-F{f:02d}",
            "building_id": bld_id,
            "floor_number": f,
            "floor_label": f"Floor {f:02d}",
            "elevation_min_m": round(f_min, 2),
            "elevation_max_m": round(f_max, 2),
            "height_m": round(floor_h, 2),
            "area_sqft": round(bld["built_up_area_sqft"] / bld["total_floors"], 1),
            "units_count": 4,
            "occupancy_type": "Residential High-Rise" if f > 3 else "Commercial Office Suite",
            "validation_status": "VALIDATED"
        })
    return floors

# Generate Floors
ALL_FLOORS: List[Dict[str, Any]] = []
for bld in BUILDINGS_DATA:
    ALL_FLOORS.extend(generate_floors_for_building(bld))

def generate_units_for_all() -> List[Dict[str, Any]]:
    units = []
    # Generate 4 units per floor for each building
    for bld in BUILDINGS_DATA:
        bld_id = bld["id"]
        bld_short = f"B{int(bld_id.replace('BLD-', '')):02d}"
        parcel_short = f"{int(bld['parcel_id'].replace('PAR-', ''))}"
        
        bld_floors = [fl for fl in ALL_FLOORS if fl["building_id"] == bld_id and fl["floor_number"] >= 0]
        fp = bld["footprint_coordinates"]
        min_x = min(p[0] for p in fp)
        max_x = max(p[0] for p in fp)
        min_y = min(p[1] for p in fp)
        max_y = max(p[1] for p in fp)
        mid_x = (min_x + max_x) / 2
        mid_y = (min_y + max_y) / 2
        
        for fl in bld_floors:
            f_num = fl["floor_number"]
            f_label = f"F{f_num:02d}" if f_num > 0 else "G00"
            f_min_z = fl["elevation_min_m"]
            f_max_z = fl["elevation_max_m"]
            
            # 4 quadrants for units U01, U02, U03, U04
            quadrants = [
                ("U-01", "U01", min_x, mid_x, min_y, mid_y, "2 BHK Commercial / Residence", 1120.0, 980.0),
                ("U-02", "U02", mid_x, max_x, min_y, mid_y, "3 BHK Executive Suite", 1380.0, 1220.0),
                ("U-03", "U03", min_x, mid_x, mid_y, max_y, "3 BHK Residential Apartment", 1240.0, 1080.0),
                ("U-04", "U04", mid_x, max_x, mid_y, max_y, "2 BHK Standard Unit", 1090.0, 950.0),
            ]
            
            for u_num, u_code, x1, x2, y1, y2, u_type, a_gross, a_carpet in quadrants:
                unit_id = f"{f_label}-{u_code}"
                # Prototype ULPIN schema: IN-LKO-GN5-<Parcel>-<Building>-<Floor>-<Unit>
                ulpin = f"IN-LKO-GN5-{parcel_short}-{bld_short}-{f_label}-{u_code}"
                
                units.append({
                    "id": unit_id if bld_id == "BLD-0007" else f"{bld_id}-{unit_id}",
                    "unit_number": u_num,
                    "floor_id": fl["id"],
                    "building_id": bld_id,
                    "parcel_id": bld["parcel_id"],
                    "floor_number": f_num,
                    "ulpin": ulpin,
                    "area_sqft": a_gross,
                    "carpet_area_sqft": a_carpet,
                    "bounding_box": {
                        "xmin": round(x1, 2),
                        "xmax": round(x2, 2),
                        "ymin": round(y1, 2),
                        "ymax": round(y2, 2),
                        "zmin": round(f_min_z - 100.0, 2), # local height
                        "zmax": round(f_max_z - 100.0, 2),
                        "elevation_min": round(f_min_z, 2),
                        "elevation_max": round(f_max_z, 2)
                    },
                    "unit_type": u_type,
                    "ownership_status": "Demonstration Record",
                    "spatial_status": "VALIDATED",
                    "qr_data": ulpin
                })
    return units

ALL_UNITS: List[Dict[str, Any]] = generate_units_for_all()

UTILITIES_DATA: List[Dict[str, Any]] = [
    {
        "id": "UTL-023",
        "type": "Water Pipeline",
        "depth_m": -8.4,
        "length_m": 482.0,
        "diameter_mm": 600,
        "material": "Ductile Iron Class K9",
        "status": "ACTIVE",
        "spatial_conflict": "POTENTIAL_CLASH_DETECTED",
        "conflict_details": "Spatial intersection with Building BLD-0007 Subsurface Foundation & Basement -2 perimeter corridor",
        "coordinates_3d": [
            [0.0, 32.0, -8.4],
            [35.0, 32.0, -8.4],
            [70.0, 32.0, -8.4],
            [130.0, 32.0, -8.4],
            [200.0, 32.0, -8.4]
        ]
    },
    {
        "id": "UTL-014",
        "type": "Electrical Conduit",
        "depth_m": -4.5,
        "length_m": 620.0,
        "diameter_mm": 350,
        "material": "Reinforced HDPE Conduit (33kV Triple Circuit)",
        "status": "ACTIVE",
        "spatial_conflict": "NONE",
        "conflict_details": None,
        "coordinates_3d": [
            [68.0, 0.0, -4.5],
            [68.0, 70.0, -4.5],
            [68.0, 140.0, -4.5],
            [68.0, 210.0, -4.5]
        ]
    },
    {
        "id": "UTL-008",
        "type": "Sewer Network",
        "depth_m": -12.0,
        "length_m": 850.0,
        "diameter_mm": 1200,
        "material": "Reinforced Concrete Pipe (Trunk Gravity Sewer)",
        "status": "ACTIVE",
        "spatial_conflict": "NONE",
        "conflict_details": None,
        "coordinates_3d": [
            [0.0, 68.0, -12.0],
            [65.0, 68.0, -12.0],
            [135.0, 68.0, -12.0],
            [200.0, 68.0, -12.0]
        ]
    },
    {
        "id": "UTL-031",
        "type": "Telecom Spine",
        "depth_m": -2.2,
        "length_m": 1100.0,
        "diameter_mm": 180,
        "material": "Multi-Duct Fiber Optic Core (BharatNet Urban Spine)",
        "status": "ACTIVE",
        "spatial_conflict": "NONE",
        "conflict_details": None,
        "coordinates_3d": [
            [132.0, 0.0, -2.2],
            [132.0, 65.0, -2.2],
            [132.0, 140.0, -2.2],
            [132.0, 210.0, -2.2]
        ]
    },
    {
        "id": "UTL-045",
        "type": "Utility Tunnel",
        "depth_m": -15.5,
        "length_m": 340.0,
        "diameter_mm": 2400,
        "material": "Precast Concrete Segmental Tunnel (Multi-Utility Corridor)",
        "status": "ACTIVE",
        "spatial_conflict": "NONE",
        "conflict_details": None,
        "coordinates_3d": [
            [10.0, 138.0, -15.5],
            [70.0, 138.0, -15.5],
            [130.0, 138.0, -15.5],
            [190.0, 138.0, -15.5]
        ]
    },
    {
        "id": "UTL-052",
        "type": "Underground Parking",
        "depth_m": -6.5,
        "length_m": 180.0,
        "diameter_mm": 5000,
        "material": "Underground Inter-Complex Vehicular Tunnel",
        "status": "ACTIVE",
        "spatial_conflict": "NONE",
        "conflict_details": None,
        "coordinates_3d": [
            [35.0, 52.0, -6.5],
            [35.0, 82.0, -6.5]
        ]
    },
    {
        "id": "UTL-067",
        "type": "Transit Corridor",
        "depth_m": -21.0,
        "length_m": 1400.0,
        "diameter_mm": 6200,
        "material": "Lucknow Metro East-West Subterranean Transit Box",
        "status": "ACTIVE",
        "spatial_conflict": "NONE",
        "conflict_details": None,
        "coordinates_3d": [
            [0.0, 172.0, -21.0],
            [65.0, 172.0, -21.0],
            [135.0, 172.0, -21.0],
            [200.0, 172.0, -21.0]
        ]
    },
    {
        "id": "UTL-079",
        "type": "Natural Gas Main",
        "depth_m": -3.8,
        "length_m": 510.0,
        "diameter_mm": 250,
        "material": "High-Pressure Carbon Steel Gas Pipeline",
        "status": "ACTIVE",
        "spatial_conflict": "NONE",
        "conflict_details": None,
        "coordinates_3d": [
            [0.0, 105.0, -3.8],
            [70.0, 105.0, -3.8],
            [140.0, 105.0, -3.8],
            [200.0, 105.0, -3.8]
        ]
    }
]

VALIDATION_ISSUES_DATA: List[Dict[str, Any]] = [
    {
        "id": "VAL-00231",
        "rule_type": "SUBTERRANEAN_CLASH",
        "severity": "CONFLICT",
        "title": "PROPERTY VOLUME OVERLAP & UTILITY CORRIDOR CLASH",
        "description": "Building BLD-0007 Subsurface footprint intersects Underground Water Pipeline UTL-023 at depth -8.20m. Review required by Survey Officer.",
        "affected_entities": ["BLD-0007", "F08-U03", "UTL-023"],
        "depth_m": -8.20,
        "detected_by": "3D Topology Engine v2.4",
        "timestamp": "2026-09-30T10:14:00Z",
        "status": "REVIEW_REQUIRED",
        "officer_decision": None
    },
    {
        "id": "VAL-00232",
        "rule_type": "VERTICAL_GAP",
        "severity": "WARNING",
        "title": "VERTICAL SLAB TRANSITION TOLERANCE",
        "description": "Minor 0.04m clearance variance detected between Floor 03 and Floor 04 mechanical plenum in BLD-0008.",
        "affected_entities": ["BLD-0008", "BLD0008-F03", "BLD0008-F04"],
        "depth_m": 10.88,
        "detected_by": "3D Topology Engine v2.4",
        "timestamp": "2026-09-30T09:45:00Z",
        "status": "REVIEW_REQUIRED",
        "officer_decision": None
    },
    {
        "id": "VAL-00233",
        "rule_type": "FOOTPRINT_CONTAINMENT",
        "severity": "WARNING",
        "title": "EAVES CANTILEVER AIR-RIGHT PROJECTION",
        "description": "Building BLD-0012 architectural sunshade projects 0.6m into parcel setback zone at elevation 112.5m.",
        "affected_entities": ["BLD-0012", "PAR-0106"],
        "depth_m": 12.50,
        "detected_by": "3D Topology Engine v2.4",
        "timestamp": "2026-09-30T08:20:00Z",
        "status": "APPROVED_WITH_VARIANCE",
        "officer_decision": {
            "decision": "APPROVED",
            "officer_name": "Senior Cadastral Officer R. K. Sharma",
            "timestamp": "2026-09-30T08:35:00Z",
            "comments": "Permissible architectural feature under Lucknow Building Bye-Laws 2024 Section 4.2.3."
        }
    }
]

SYSTEM_DATA_SOURCES: List[Dict[str, Any]] = [
    {
        "name": "Parcel Cadastral Boundary Layer",
        "source": "State Land Records GIS Directorate (Demonstration Dataset)",
        "crs": "EPSG:4326 / UTM Zone 44N",
        "features_count": 12,
        "status": "Operational / Synchronized",
        "last_sync": "2026-09-30 08:00:00"
    },
    {
        "name": "Building 3D Footprint & LOD-2 Geometry",
        "source": "Urban Development Authority Drone Survey (Synthetic 3D Dataset)",
        "crs": "EPSG:4326 / Local Heights",
        "features_count": 8,
        "status": "Operational / Synchronized",
        "last_sync": "2026-09-30 08:30:00"
    },
    {
        "name": "Digital Surface Model (DSM / DTM)",
        "source": "Synthetic High-Density Airborne LiDAR (Demonstration DSM)",
        "crs": "WGS 84 / Orthometric Elevation",
        "features_count": 1,
        "status": "Operational / Synchronized",
        "last_sync": "2026-09-30 08:15:00"
    },
    {
        "name": "Architectural Vertical Floor Plans & Units",
        "source": "Approved Municipal Sanction Drawings (Synthetic Floor Plan)",
        "crs": "Local Building Grid",
        "features_count": 120,
        "status": "Operational / Synchronized",
        "last_sync": "2026-09-30 09:00:00"
    },
    {
        "name": "Subsurface Utility Asset Registry",
        "source": "Municipal Utility GIS & Ground Penetrating Radar (GPR)",
        "crs": "EPSG:4326 / Depth Below Surface",
        "features_count": 8,
        "status": "Operational / Synchronized",
        "last_sync": "2026-09-30 09:10:00"
    }
]
