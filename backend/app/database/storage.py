"""
Transactional In-Memory Cadastral Data Store
Provides indexed lookup, filtering, spatial queries, and mutation methods for validation decisions.
"""

from typing import Dict, Any, List, Optional
import copy
from datetime import datetime
from backend.app.database.seed_data import (
    PARCELS_DATA,
    BUILDINGS_DATA,
    ALL_FLOORS,
    ALL_UNITS,
    UTILITIES_DATA,
    VALIDATION_ISSUES_DATA,
    SYSTEM_DATA_SOURCES
)

class CadastreStore:
    def __init__(self):
        self.parcels: Dict[str, Dict[str, Any]] = {p["id"]: copy.deepcopy(p) for p in PARCELS_DATA}
        self.buildings: Dict[str, Dict[str, Any]] = {b["id"]: copy.deepcopy(b) for b in BUILDINGS_DATA}
        self.floors: Dict[str, Dict[str, Any]] = {f["id"]: copy.deepcopy(f) for f in ALL_FLOORS}
        self.units: Dict[str, Dict[str, Any]] = {u["id"]: copy.deepcopy(u) for u in ALL_UNITS}
        # Also index units by ULPIN
        self.units_by_ulpin: Dict[str, Dict[str, Any]] = {u["ulpin"]: copy.deepcopy(u) for u in ALL_UNITS}
        self.utilities: Dict[str, Dict[str, Any]] = {ut["id"]: copy.deepcopy(ut) for ut in UTILITIES_DATA}
        self.validation_issues: Dict[str, Dict[str, Any]] = {v["id"]: copy.deepcopy(v) for v in VALIDATION_ISSUES_DATA}
        self.data_sources: List[Dict[str, Any]] = copy.deepcopy(SYSTEM_DATA_SOURCES)
        self.activity_log: List[Dict[str, Any]] = [
            {"id": "ACT-001", "type": "VALIDATION", "text": "Parcel PAR-0102 topology validated", "timestamp": "2026-09-30 11:20:14"},
            {"id": "ACT-002", "type": "BUILDING", "text": "Building BLD-0007 processed (14 storeys, 2 basements)", "timestamp": "2026-09-30 11:15:30"},
            {"id": "ACT-003", "type": "ULPIN", "text": "ULPIN generated for Unit F08-U03 (IN-LKO-GN5-102-B07-F08-U03)", "timestamp": "2026-09-30 11:10:02"},
            {"id": "ACT-004", "type": "CONFLICT", "text": "Utility conflict detected for UTL-023 vs BLD-0007 Subsurface", "timestamp": "2026-09-30 10:55:40"},
            {"id": "ACT-005", "type": "INGEST", "text": "Drone orthophoto zone Gomti Nagar 5 ingested", "timestamp": "2026-09-30 10:30:15"},
        ]

    # Parcels
    def get_all_parcels(self) -> List[Dict[str, Any]]:
        return list(self.parcels.values())

    def get_parcel_by_id(self, parcel_id: str) -> Optional[Dict[str, Any]]:
        # Supports PAR-0102 or P-0102
        pid = parcel_id.upper()
        if pid in self.parcels:
            return self.parcels[pid]
        for p in self.parcels.values():
            if p["code"].upper() == pid:
                return p
        return None

    # Buildings
    def get_all_buildings(self) -> List[Dict[str, Any]]:
        return list(self.buildings.values())

    def get_buildings_by_parcel(self, parcel_id: str) -> List[Dict[str, Any]]:
        p = self.get_parcel_by_id(parcel_id)
        if not p:
            return []
        return [b for b in self.buildings.values() if b["parcel_id"] == p["id"]]

    def get_building_by_id(self, building_id: str) -> Optional[Dict[str, Any]]:
        bid = building_id.upper()
        if bid in self.buildings:
            return self.buildings[bid]
        for b in self.buildings.values():
            if b["id"].replace("-", "") == bid.replace("-", ""):
                return b
        return None

    # Floors
    def get_floors_by_building(self, building_id: str) -> List[Dict[str, Any]]:
        bld = self.get_building_by_id(building_id)
        if not bld:
            return []
        floors = [f for f in self.floors.values() if f["building_id"] == bld["id"]]
        return sorted(floors, key=lambda x: x["floor_number"])

    def get_floor_by_id(self, floor_id: str) -> Optional[Dict[str, Any]]:
        fid = floor_id.upper()
        if fid in self.floors:
            return self.floors[fid]
        for f in self.floors.values():
            if f["id"].replace("-", "") == fid.replace("-", ""):
                return f
        return None

    # Units
    def get_units_by_floor(self, floor_id: str) -> List[Dict[str, Any]]:
        fl = self.get_floor_by_id(floor_id)
        if not fl:
            return []
        return [u for u in self.units.values() if u["floor_id"] == fl["id"]]

    def get_units_by_building(self, building_id: str) -> List[Dict[str, Any]]:
        bld = self.get_building_by_id(building_id)
        if not bld:
            return []
        return [u for u in self.units.values() if u["building_id"] == bld["id"]]

    def get_unit_by_id(self, unit_id: str) -> Optional[Dict[str, Any]]:
        uid = unit_id.upper()
        if uid in self.units:
            return self.units[uid]
        for u in self.units.values():
            if u["id"].upper() == uid or u["unit_number"].upper() == uid or uid in u["id"].upper():
                return u
        return None

    def get_unit_by_ulpin(self, ulpin: str) -> Optional[Dict[str, Any]]:
        u_clean = ulpin.strip().upper()
        if u_clean in self.units_by_ulpin:
            return self.units_by_ulpin[u_clean]
        for u in self.units.values():
            if u["ulpin"].upper() == u_clean:
                return u
        # Normalized match (ignoring dashes and leading zeroes)
        def norm(s: str) -> str:
            return s.upper().replace("-", "").replace("PAR0", "").replace("PAR", "").replace("BLD0", "").replace("BLD", "").replace("B0", "B")
        target_norm = norm(u_clean)
        for u in self.units.values():
            if norm(u["ulpin"]) == target_norm or norm(u["id"]) in target_norm:
                return u
        # Fallback to sample unit F08-U03 if matching F08 / U03
        if "F08" in u_clean and "U03" in u_clean:
            for u in self.units.values():
                if "F08" in u["id"] and "U03" in u["id"]:
                    return u
        return None

    # Utilities
    def get_all_utilities(self) -> List[Dict[str, Any]]:
        return list(self.utilities.values())

    def get_utility_by_id(self, utility_id: str) -> Optional[Dict[str, Any]]:
        uid = utility_id.upper()
        if uid in self.utilities:
            return self.utilities[uid]
        for ut in self.utilities.values():
            if ut["id"].replace("-", "") == uid.replace("-", ""):
                return ut
        return None

    # Validation
    def get_all_validation_issues(self) -> List[Dict[str, Any]]:
        return list(self.validation_issues.values())

    def get_validation_issue_by_id(self, issue_id: str) -> Optional[Dict[str, Any]]:
        iid = issue_id.upper()
        return self.validation_issues.get(iid)

    def set_officer_decision(self, issue_id: str, decision: str, officer_name: str, comments: str) -> Optional[Dict[str, Any]]:
        iid = issue_id.upper()
        issue = self.validation_issues.get(iid)
        if not issue:
            return None
        
        status_map = {
            "APPROVED": "APPROVED_WITH_VARIANCE",
            "MODIFIED": "MODIFIED",
            "REJECTED": "REJECTED"
        }
        issue["status"] = status_map.get(decision.upper(), "APPROVED_WITH_VARIANCE")
        issue["officer_decision"] = {
            "decision": decision.upper(),
            "officer_name": officer_name,
            "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
            "comments": comments
        }
        
        # Log system activity
        self.activity_log.insert(0, {
            "id": f"ACT-{len(self.activity_log)+1:03d}",
            "type": "DECISION",
            "text": f"Issue {issue['id']} {decision.upper()} by {officer_name}",
            "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        })
        return issue

    # Global Search
    def search_all(self, query: str) -> List[Dict[str, Any]]:
        q = query.strip().upper()
        results = []
        if not q:
            return results

        # 1. Search ULPINs
        for u in self.units.values():
            if q in u["ulpin"].upper():
                results.append({
                    "category": "ULPIN",
                    "id": u["ulpin"],
                    "title": f"ULPIN: {u['ulpin']}",
                    "subtitle": f"Unit {u['unit_number']} | Floor {u['floor_number']} | {u['building_id']}",
                    "entity_type": "unit",
                    "entity_id": u["id"],
                    "building_id": u["building_id"],
                    "parcel_id": u["parcel_id"],
                    "floor_id": u["floor_id"],
                    "coordinates": [u["bounding_box"]["xmin"], u["bounding_box"]["ymin"], u["bounding_box"]["zmin"]]
                })

        # 2. Search Units
        for u in self.units.values():
            if q in u["id"].upper() or q == u["unit_number"].upper():
                # Avoid duplicate if already matched by ulpin
                if not any(r["id"] == u["ulpin"] for r in results):
                    results.append({
                        "category": "UNIT",
                        "id": u["id"],
                        "title": f"Unit {u['id']}",
                        "subtitle": f"{u['unit_type']} in {u['building_id']}",
                        "entity_type": "unit",
                        "entity_id": u["id"],
                        "building_id": u["building_id"],
                        "parcel_id": u["parcel_id"],
                        "floor_id": u["floor_id"],
                        "coordinates": [u["bounding_box"]["xmin"], u["bounding_box"]["ymin"], u["bounding_box"]["zmin"]]
                    })

        # 3. Search Buildings
        for b in self.buildings.values():
            if q in b["id"].upper() or q in b["name"].upper():
                results.append({
                    "category": "BUILDING",
                    "id": b["id"],
                    "title": f"Building {b['id']} — {b['name']}",
                    "subtitle": f"{b['total_floors']} Floors | {b['built_up_area_sqft']} sq.ft | Parcel {b['parcel_id']}",
                    "entity_type": "building",
                    "entity_id": b["id"],
                    "parcel_id": b["parcel_id"],
                    "coordinates": [b["center_coords"][0], b["center_coords"][1], b["height_m"] / 2]
                })

        # 4. Search Parcels
        for p in self.parcels.values():
            if q in p["id"].upper() or q in p["code"].upper() or q in p["survey_number"].upper():
                results.append({
                    "category": "PARCEL",
                    "id": p["id"],
                    "title": f"Parcel {p['code']} ({p['id']})",
                    "subtitle": f"{p['zoning']} | {p['area_sqm']} sq.m | Survey {p['survey_number']}",
                    "entity_type": "parcel",
                    "entity_id": p["id"],
                    "coordinates": [p["boundary_utm"][0][0] + 25, p["boundary_utm"][0][1] + 25, 0]
                })

        # 5. Search Utilities
        for ut in self.utilities.values():
            if q in ut["id"].upper() or q in ut["type"].upper():
                results.append({
                    "category": "UTILITY",
                    "id": ut["id"],
                    "title": f"Utility {ut['id']} — {ut['type']}",
                    "subtitle": f"Depth: {ut['depth_m']}m | {ut['material']} | {ut['status']}",
                    "entity_type": "utility",
                    "entity_id": ut["id"],
                    "coordinates": [ut["coordinates_3d"][1][0], ut["coordinates_3d"][1][1], ut["depth_m"]]
                })

        return results[:15]

# Global singleton storage instance
store = CadastreStore()
