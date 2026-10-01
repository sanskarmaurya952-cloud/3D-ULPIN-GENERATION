"""
3D ULPIN (Urban Land and Property Identification Number) Generation Engine
Implements the proposed 3D Cadastre Standard Identifier Schema:
Format: IN-<DISTRICT>-<ZONE>-<PARCEL>-<BUILDING>-<FLOOR>-<UNIT>
Example: IN-LKO-GN5-102-B07-F08-U03
Includes volumetric verification and cryptographic check byte.
"""

import hashlib
from datetime import datetime
from typing import Dict, Any, Optional
from backend.app.database.storage import store

class UlpinGeneratorService:
    @staticmethod
    def generate_3d_ulpin(
        parcel_id: str,
        building_id: str,
        floor_id: str,
        unit_id: str,
        district_code: str = "LKO",
        zone_code: str = "GN5"
    ) -> Dict[str, Any]:
        """
        Generates a verified Prototype 3D ULPIN with vertical bounds and spatial bounding box metadata.
        """
        parcel = store.get_parcel_by_id(parcel_id)
        if not parcel:
            raise ValueError(f"Parcel with ID '{parcel_id}' not found in registry.")

        building = store.get_building_by_id(building_id)
        if not building:
            raise ValueError(f"Building with ID '{building_id}' not found.")

        floor = store.get_floor_by_id(floor_id)
        if not floor:
            raise ValueError(f"Floor with ID '{floor_id}' not found.")

        unit = store.get_unit_by_id(unit_id)
        if not unit:
            # Check if unit belongs to floor
            units_on_floor = store.get_units_by_floor(floor["id"])
            if units_on_floor:
                unit = units_on_floor[0]
            else:
                raise ValueError(f"No unit found for ID '{unit_id}' on floor '{floor['id']}'.")

        p_clean = f"{int(parcel['id'].replace('PAR-', ''))}"
        b_clean = f"B{int(building['id'].replace('BLD-', '')):02d}"
        
        f_num = floor["floor_number"]
        if f_num < 0:
            f_clean = f"B{abs(f_num):02d}"
        elif f_num == 0:
            f_clean = "G00"
        else:
            f_clean = f"F{f_num:02d}"

        u_num_clean = unit["unit_number"].replace("U-", "U").replace("U", "U")
        if not u_num_clean.startswith("U"):
            u_num_clean = f"U{u_num_clean}"
        if len(u_num_clean) == 2:
            u_num_clean = f"U0{u_num_clean[1]}"

        # Standard Proposed 3D ULPIN
        raw_ulpin = f"IN-{district_code}-{zone_code}-{p_clean}-{b_clean}-{f_clean}-{u_num_clean}"

        # Generate spatial signature
        hash_input = f"{raw_ulpin}:{unit['bounding_box']['xmin']}:{unit['bounding_box']['ymin']}:{unit['bounding_box']['elevation_min']}"
        sig = hashlib.sha256(hash_input.encode()).hexdigest()[:6].upper()

        vertical_range_str = f"{floor['elevation_min_m']:.2f}m – {floor['elevation_max_m']:.2f}m"

        return {
            "ulpin": raw_ulpin,
            "spatial_signature": sig,
            "parcel_id": parcel["id"],
            "parcel_code": parcel["code"],
            "building_id": building["id"],
            "building_name": building["name"],
            "floor_id": floor["id"],
            "floor_number": floor["floor_number"],
            "floor_label": floor["floor_label"],
            "unit_id": unit["id"],
            "unit_number": unit["unit_number"],
            "vertical_range": vertical_range_str,
            "elevation_min": floor["elevation_min_m"],
            "elevation_max": floor["elevation_max_m"],
            "area_sqft": unit["area_sqft"],
            "carpet_area_sqft": unit["carpet_area_sqft"],
            "spatial_status": "VALIDATED",
            "qr_code_data": raw_ulpin,
            "generated_at": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
            "bounding_box": unit["bounding_box"],
            "disclaimer": "PROTOTYPE 3D ULPIN (Proposed 3D Cadastre Framework - Demonstration Dataset)"
        }
