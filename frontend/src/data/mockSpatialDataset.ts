import { Parcel, Building, Floor, PropertyUnit, UtilityAsset, ValidationIssue } from '../types/cadastre';

export const MOCK_PARCELS: Parcel[] = [
  {
    id: 'PAR-0102',
    code: 'P-0102',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    urban_zone: 'Gomti Nagar, Zone 5',
    area_sqm: 2450.0,
    area_sqft: 26371.6,
    far_allowed: 3.5,
    far_utilized: 3.12,
    zoning: 'Commercial / High-Density Mixed Use',
    survey_number: 'LKO/GN5/102/2024',
    crs: 'EPSG:4326',
    boundary_coordinates: [
      [80.99215, 26.85320],
      [80.99285, 26.85320],
      [80.99285, 26.85260],
      [80.99215, 26.85260],
      [80.99215, 26.85320]
    ],
    boundary_utm: [
      [10.0, 10.0],
      [60.0, 10.0],
      [60.0, 60.0],
      [10.0, 60.0],
      [10.0, 10.0]
    ],
    buildings_count: 1,
    validation_status: 'VALIDATED',
    created_at: '2026-01-15T09:30:00Z',
    updated_at: '2026-09-28T14:20:00Z'
  },
  {
    id: 'PAR-0103',
    code: 'P-0103',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    urban_zone: 'Gomti Nagar, Zone 5',
    area_sqm: 1820.0,
    area_sqft: 19590.3,
    far_allowed: 3.0,
    far_utilized: 2.85,
    zoning: 'Commercial Tech Park',
    survey_number: 'LKO/GN5/103/2024',
    crs: 'EPSG:4326',
    boundary_coordinates: [
      [80.99310, 26.85320],
      [80.99370, 26.85320],
      [80.99370, 26.85260],
      [80.99310, 26.85260],
      [80.99310, 26.85320]
    ],
    boundary_utm: [
      [75.0, 10.0],
      [120.0, 10.0],
      [120.0, 60.0],
      [75.0, 60.0],
      [75.0, 10.0]
    ],
    buildings_count: 1,
    validation_status: 'VALIDATED',
    created_at: '2026-01-16T10:00:00Z',
    updated_at: '2026-09-25T11:15:00Z'
  },
  {
    id: 'PAR-0104',
    code: 'P-0104',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    urban_zone: 'Gomti Nagar, Zone 5',
    area_sqm: 3100.0,
    area_sqft: 33368.1,
    far_allowed: 3.5,
    far_utilized: 3.40,
    zoning: 'Multi-Storey Residential Complex',
    survey_number: 'LKO/GN5/104/2024',
    crs: 'EPSG:4326',
    boundary_coordinates: [
      [80.99215, 26.85235],
      [80.99285, 26.85235],
      [80.99285, 26.85160],
      [80.99215, 26.85160],
      [80.99215, 26.85235]
    ],
    boundary_utm: [
      [10.0, 75.0],
      [60.0, 75.0],
      [60.0, 130.0],
      [10.0, 130.0],
      [10.0, 75.0]
    ],
    buildings_count: 2,
    validation_status: 'VALIDATED',
    created_at: '2026-01-18T14:30:00Z',
    updated_at: '2026-09-20T16:40:00Z'
  },
  {
    id: 'PAR-0105',
    code: 'P-0105',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    urban_zone: 'Gomti Nagar, Zone 5',
    area_sqm: 2200.0,
    area_sqft: 23680.6,
    far_allowed: 2.5,
    far_utilized: 2.10,
    zoning: 'Institutional / Civic Complex',
    survey_number: 'LKO/GN5/105/2024',
    crs: 'EPSG:4326',
    boundary_coordinates: [
      [80.99310, 26.85235],
      [80.99375, 26.85235],
      [80.99375, 26.85160],
      [80.99310, 26.85160],
      [80.99310, 26.85235]
    ],
    boundary_utm: [
      [75.0, 75.0],
      [125.0, 75.0],
      [125.0, 130.0],
      [75.0, 130.0],
      [75.0, 75.0]
    ],
    buildings_count: 1,
    validation_status: 'VALIDATED',
    created_at: '2026-01-20T08:45:00Z',
    updated_at: '2026-09-18T12:10:00Z'
  },
  {
    id: 'PAR-0106',
    code: 'P-0106',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    urban_zone: 'Gomti Nagar, Zone 5',
    area_sqm: 1650.0,
    area_sqft: 17760.5,
    far_allowed: 2.5,
    far_utilized: 2.35,
    zoning: 'Commercial Retail Hub',
    survey_number: 'LKO/GN5/106/2024',
    crs: 'EPSG:4326',
    boundary_coordinates: [
      [80.99400, 26.85320],
      [80.99460, 26.85320],
      [80.99460, 26.85260],
      [80.99400, 26.85260],
      [80.99400, 26.85320]
    ],
    boundary_utm: [
      [140.0, 10.0],
      [185.0, 10.0],
      [185.0, 60.0],
      [140.0, 60.0],
      [140.0, 10.0]
    ],
    buildings_count: 1,
    validation_status: 'VALIDATED',
    created_at: '2026-01-25T15:20:00Z',
    updated_at: '2026-09-22T09:15:00Z'
  },
  {
    id: 'PAR-0107',
    code: 'P-0107',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    urban_zone: 'Gomti Nagar, Zone 5',
    area_sqm: 1950.0,
    area_sqft: 20989.6,
    far_allowed: 3.0,
    far_utilized: 2.90,
    zoning: 'Mixed-Use Tower',
    survey_number: 'LKO/GN5/107/2024',
    crs: 'EPSG:4326',
    boundary_coordinates: [
      [80.99400, 26.85235],
      [80.99460, 26.85235],
      [80.99460, 26.85160],
      [80.99400, 26.85160],
      [80.99400, 26.85235]
    ],
    boundary_utm: [
      [140.0, 75.0],
      [185.0, 75.0],
      [185.0, 130.0],
      [140.0, 130.0],
      [140.0, 75.0]
    ],
    buildings_count: 1,
    validation_status: 'VALIDATED',
    created_at: '2026-02-01T10:10:00Z',
    updated_at: '2026-09-26T17:30:00Z'
  },
  {
    id: 'PAR-0108',
    code: 'P-0108',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    urban_zone: 'Gomti Nagar, Zone 5',
    area_sqm: 2800.0,
    area_sqft: 30138.9,
    far_allowed: 3.2,
    far_utilized: 2.80,
    zoning: 'Healthcare / Diagnostic Centre',
    survey_number: 'LKO/GN5/108/2024',
    crs: 'EPSG:4326',
    boundary_coordinates: [
      [80.99215, 26.85135],
      [80.99285, 26.85135],
      [80.99285, 26.85055],
      [80.99215, 26.85055],
      [80.99215, 26.85135]
    ],
    boundary_utm: [
      [10.0, 145.0],
      [60.0, 145.0],
      [60.0, 200.0],
      [10.0, 200.0],
      [10.0, 145.0]
    ],
    buildings_count: 1,
    validation_status: 'VALIDATED',
    created_at: '2026-02-05T12:00:00Z',
    updated_at: '2026-09-24T14:10:00Z'
  },
  {
    id: 'PAR-0109',
    code: 'P-0109',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    urban_zone: 'Gomti Nagar, Zone 5',
    area_sqm: 2100.0,
    area_sqft: 22604.2,
    far_allowed: 3.0,
    far_utilized: 2.75,
    zoning: 'Corporate Regional Headquarters',
    survey_number: 'LKO/GN5/109/2024',
    crs: 'EPSG:4326',
    boundary_coordinates: [
      [80.99310, 26.85135],
      [80.99375, 26.85135],
      [80.99375, 26.85055],
      [80.99310, 26.85055],
      [80.99310, 26.85135]
    ],
    boundary_utm: [
      [75.0, 145.0],
      [125.0, 145.0],
      [125.0, 200.0],
      [75.0, 200.0],
      [75.0, 145.0]
    ],
    buildings_count: 1,
    validation_status: 'VALIDATED',
    created_at: '2026-02-12T09:40:00Z',
    updated_at: '2026-09-19T11:00:00Z'
  }
];

export const MOCK_BUILDINGS: Building[] = [
  {
    id: 'BLD-0007',
    name: 'Shikhar Heights & Commercial Plaza',
    parcel_id: 'PAR-0102',
    total_floors: 14,
    basement_levels: 2,
    height_m: 42.6,
    built_up_area_sqft: 18400.0,
    total_units: 56,
    footprint_coordinates: [
      [18.0, 18.0],
      [52.0, 18.0],
      [52.0, 52.0],
      [18.0, 52.0],
      [18.0, 18.0]
    ],
    center_coords: [35.0, 35.0],
    base_elevation_m: 100.0,
    roof_elevation_m: 142.6,
    structure_type: 'RCC Framed Multi-Storey Commercial/Residential',
    dsm_height_source: 'Synthetic High-Density LiDAR/DSM',
    cadastral_status: 'VALIDATED',
    created_at: '2026-02-10T11:00:00Z'
  },
  {
    id: 'BLD-0008',
    name: 'CyberTech Innovation Center',
    parcel_id: 'PAR-0103',
    total_floors: 8,
    basement_levels: 1,
    height_m: 27.2,
    built_up_area_sqft: 12800.0,
    total_units: 24,
    footprint_coordinates: [
      [82.0, 18.0],
      [112.0, 18.0],
      [112.0, 48.0],
      [82.0, 48.0],
      [82.0, 18.0]
    ],
    center_coords: [97.0, 33.0],
    base_elevation_m: 100.0,
    roof_elevation_m: 127.2,
    structure_type: 'Commercial Steel-Frame IT Complex',
    dsm_height_source: 'Synthetic High-Density LiDAR/DSM',
    cadastral_status: 'VALIDATED',
    created_at: '2026-02-12T13:30:00Z'
  },
  {
    id: 'BLD-0009',
    name: 'Gomti Palms Tower A',
    parcel_id: 'PAR-0104',
    total_floors: 12,
    basement_levels: 2,
    height_m: 37.8,
    built_up_area_sqft: 15600.0,
    total_units: 48,
    footprint_coordinates: [
      [18.0, 82.0],
      [38.0, 82.0],
      [38.0, 120.0],
      [18.0, 120.0],
      [18.0, 82.0]
    ],
    center_coords: [28.0, 101.0],
    base_elevation_m: 100.0,
    roof_elevation_m: 137.8,
    structure_type: 'Residential High-Rise Tower',
    dsm_height_source: 'Synthetic High-Density LiDAR/DSM',
    cadastral_status: 'VALIDATED',
    created_at: '2026-02-15T09:15:00Z'
  },
  {
    id: 'BLD-0010',
    name: 'Gomti Palms Tower B',
    parcel_id: 'PAR-0104',
    total_floors: 10,
    basement_levels: 2,
    height_m: 31.5,
    built_up_area_sqft: 13200.0,
    total_units: 40,
    footprint_coordinates: [
      [42.0, 82.0],
      [54.0, 82.0],
      [54.0, 120.0],
      [42.0, 120.0],
      [42.0, 82.0]
    ],
    center_coords: [48.0, 101.0],
    base_elevation_m: 100.0,
    roof_elevation_m: 131.5,
    structure_type: 'Residential High-Rise Tower',
    dsm_height_source: 'Synthetic High-Density LiDAR/DSM',
    cadastral_status: 'VALIDATED',
    created_at: '2026-02-15T09:30:00Z'
  },
  {
    id: 'BLD-0011',
    name: 'Zonal Administrative Annex',
    parcel_id: 'PAR-0105',
    total_floors: 5,
    basement_levels: 1,
    height_m: 18.5,
    built_up_area_sqft: 9200.0,
    total_units: 15,
    footprint_coordinates: [
      [84.0, 84.0],
      [116.0, 84.0],
      [116.0, 118.0],
      [84.0, 118.0],
      [84.0, 84.0]
    ],
    center_coords: [100.0, 101.0],
    base_elevation_m: 100.0,
    roof_elevation_m: 118.5,
    structure_type: 'Civic Institutional Building',
    dsm_height_source: 'Synthetic High-Density LiDAR/DSM',
    cadastral_status: 'VALIDATED',
    created_at: '2026-02-20T14:00:00Z'
  },
  {
    id: 'BLD-0012',
    name: 'Apex Commercial Arcade',
    parcel_id: 'PAR-0106',
    total_floors: 6,
    basement_levels: 1,
    height_m: 21.0,
    built_up_area_sqft: 8400.0,
    total_units: 18,
    footprint_coordinates: [
      [148.0, 18.0],
      [176.0, 18.0],
      [176.0, 50.0],
      [148.0, 50.0],
      [148.0, 18.0]
    ],
    center_coords: [162.0, 34.0],
    base_elevation_m: 100.0,
    roof_elevation_m: 121.0,
    structure_type: 'Commercial Retail Mall',
    dsm_height_source: 'Synthetic High-Density LiDAR/DSM',
    cadastral_status: 'VALIDATED',
    created_at: '2026-02-22T10:45:00Z'
  },
  {
    id: 'BLD-0013',
    name: 'Pratap Mixed Sovereign Tower',
    parcel_id: 'PAR-0107',
    total_floors: 11,
    basement_levels: 2,
    height_m: 35.2,
    built_up_area_sqft: 14500.0,
    total_units: 44,
    footprint_coordinates: [
      [148.0, 82.0],
      [178.0, 82.0],
      [178.0, 122.0],
      [148.0, 122.0],
      [148.0, 82.0]
    ],
    center_coords: [163.0, 102.0],
    base_elevation_m: 100.0,
    roof_elevation_m: 135.2,
    structure_type: 'Mixed Commercial & Residential Tower',
    dsm_height_source: 'Synthetic High-Density LiDAR/DSM',
    cadastral_status: 'VALIDATED',
    created_at: '2026-02-25T11:20:00Z'
  },
  {
    id: 'BLD-0014',
    name: 'Medanta Life Health Pavilion',
    parcel_id: 'PAR-0108',
    total_floors: 7,
    basement_levels: 1,
    height_m: 24.5,
    built_up_area_sqft: 11200.0,
    total_units: 21,
    footprint_coordinates: [
      [18.0, 152.0],
      [52.0, 152.0],
      [52.0, 190.0],
      [18.0, 190.0],
      [18.0, 152.0]
    ],
    center_coords: [35.0, 171.0],
    base_elevation_m: 100.0,
    roof_elevation_m: 124.5,
    structure_type: 'Specialized Medical Healthcare Facility',
    dsm_height_source: 'Synthetic High-Density LiDAR/DSM',
    cadastral_status: 'VALIDATED',
    created_at: '2026-03-01T15:00:00Z'
  }
];

export const MOCK_UTILITIES: UtilityAsset[] = [
  {
    id: 'UTL-023',
    type: 'Water Pipeline',
    depth_m: -8.4,
    length_m: 482.0,
    diameter_mm: 600,
    material: 'Ductile Iron Class K9',
    status: 'ACTIVE',
    spatial_conflict: 'POTENTIAL_CLASH_DETECTED',
    conflict_details: 'Spatial intersection with Building BLD-0007 Subsurface Foundation & Basement -2 perimeter corridor',
    coordinates_3d: [
      [0.0, 32.0, -8.4],
      [35.0, 32.0, -8.4],
      [70.0, 32.0, -8.4],
      [130.0, 32.0, -8.4],
      [200.0, 32.0, -8.4]
    ]
  },
  {
    id: 'UTL-014',
    type: 'Electrical Conduit',
    depth_m: -4.5,
    length_m: 620.0,
    diameter_mm: 350,
    material: 'Reinforced HDPE Conduit (33kV Triple Circuit)',
    status: 'ACTIVE',
    spatial_conflict: 'NONE',
    conflict_details: null,
    coordinates_3d: [
      [68.0, 0.0, -4.5],
      [68.0, 70.0, -4.5],
      [68.0, 140.0, -4.5],
      [68.0, 210.0, -4.5]
    ]
  },
  {
    id: 'UTL-008',
    type: 'Sewer Network',
    depth_m: -12.0,
    length_m: 850.0,
    diameter_mm: 1200,
    material: 'Reinforced Concrete Pipe (Trunk Gravity Sewer)',
    status: 'ACTIVE',
    spatial_conflict: 'NONE',
    conflict_details: null,
    coordinates_3d: [
      [0.0, 68.0, -12.0],
      [65.0, 68.0, -12.0],
      [135.0, 68.0, -12.0],
      [200.0, 68.0, -12.0]
    ]
  },
  {
    id: 'UTL-031',
    type: 'Telecom Spine',
    depth_m: -2.2,
    length_m: 1100.0,
    diameter_mm: 180,
    material: 'Multi-Duct Fiber Optic Core (BharatNet Urban Spine)',
    status: 'ACTIVE',
    spatial_conflict: 'NONE',
    conflict_details: null,
    coordinates_3d: [
      [132.0, 0.0, -2.2],
      [132.0, 65.0, -2.2],
      [132.0, 140.0, -2.2],
      [132.0, 210.0, -2.2]
    ]
  },
  {
    id: 'UTL-045',
    type: 'Utility Tunnel',
    depth_m: -15.5,
    length_m: 340.0,
    diameter_mm: 2400,
    material: 'Precast Concrete Segmental Tunnel (Multi-Utility Corridor)',
    status: 'ACTIVE',
    spatial_conflict: 'NONE',
    conflict_details: null,
    coordinates_3d: [
      [10.0, 138.0, -15.5],
      [70.0, 138.0, -15.5],
      [130.0, 138.0, -15.5],
      [190.0, 138.0, -15.5]
    ]
  },
  {
    id: 'UTL-052',
    type: 'Underground Parking',
    depth_m: -6.5,
    length_m: 180.0,
    diameter_mm: 5000,
    material: 'Underground Inter-Complex Vehicular Tunnel',
    status: 'ACTIVE',
    spatial_conflict: 'NONE',
    conflict_details: null,
    coordinates_3d: [
      [35.0, 52.0, -6.5],
      [35.0, 82.0, -6.5]
    ]
  },
  {
    id: 'UTL-067',
    type: 'Transit Corridor',
    depth_m: -21.0,
    length_m: 1400.0,
    diameter_mm: 6200,
    material: 'Lucknow Metro East-West Subterranean Transit Box',
    status: 'ACTIVE',
    spatial_conflict: 'NONE',
    conflict_details: null,
    coordinates_3d: [
      [0.0, 172.0, -21.0],
      [65.0, 172.0, -21.0],
      [135.0, 172.0, -21.0],
      [200.0, 172.0, -21.0]
    ]
  },
  {
    id: 'UTL-079',
    type: 'Natural Gas Main',
    depth_m: -3.8,
    length_m: 510.0,
    diameter_mm: 250,
    material: 'High-Pressure Carbon Steel Gas Pipeline',
    status: 'ACTIVE',
    spatial_conflict: 'NONE',
    conflict_details: null,
    coordinates_3d: [
      [0.0, 105.0, -3.8],
      [70.0, 105.0, -3.8],
      [140.0, 105.0, -3.8],
      [200.0, 105.0, -3.8]
    ]
  }
];

export const MOCK_VALIDATION_ISSUES: ValidationIssue[] = [
  {
    id: 'VAL-00231',
    rule_type: 'SUBTERRANEAN_CLASH',
    severity: 'CONFLICT',
    title: 'PROPERTY VOLUME OVERLAP & UTILITY CORRIDOR CLASH',
    description: 'Building BLD-0007 Subsurface footprint intersects Underground Water Pipeline UTL-023 at depth -8.20m. Review required by Survey Officer.',
    affected_entities: ['BLD-0007', 'F08-U03', 'UTL-023'],
    depth_m: -8.20,
    detected_by: '3D Topology Engine v2.4',
    timestamp: '2026-09-30T10:14:00Z',
    status: 'REVIEW_REQUIRED',
    officer_decision: null
  },
  {
    id: 'VAL-00232',
    rule_type: 'VERTICAL_GAP',
    severity: 'WARNING',
    title: 'VERTICAL SLAB TRANSITION TOLERANCE',
    description: 'Minor 0.04m clearance variance detected between Floor 03 and Floor 04 mechanical plenum in BLD-0008.',
    affected_entities: ['BLD-0008', 'BLD0008-F03', 'BLD0008-F04'],
    depth_m: 10.88,
    detected_by: '3D Topology Engine v2.4',
    timestamp: '2026-09-30T09:45:00Z',
    status: 'REVIEW_REQUIRED',
    officer_decision: null
  },
  {
    id: 'VAL-00233',
    rule_type: 'FOOTPRINT_CONTAINMENT',
    severity: 'WARNING',
    title: 'EAVES CANTILEVER AIR-RIGHT PROJECTION',
    description: 'Building BLD-0012 architectural sunshade projects 0.6m into parcel setback zone at elevation 112.5m.',
    affected_entities: ['BLD-0012', 'PAR-0106'],
    depth_m: 12.50,
    detected_by: '3D Topology Engine v2.4',
    timestamp: '2026-09-30T08:20:00Z',
    status: 'APPROVED_WITH_VARIANCE',
    officer_decision: {
      decision: 'APPROVED',
      officer_name: 'Senior Cadastral Officer R. K. Sharma',
      timestamp: '2026-09-30T08:35:00Z',
      comments: 'Permissible architectural feature under Lucknow Building Bye-Laws 2024 Section 4.2.3.'
    }
  }
];

export function getMockFloorsForBuilding(buildingId: string): Floor[] {
  const bld = MOCK_BUILDINGS.find(b => b.id === buildingId) || MOCK_BUILDINGS[0];
  const floors: Floor[] = [];
  const baseElev = bld.base_elevation_m;
  const floorH = bld.height_m / bld.total_floors;

  // Basements
  for (let b = bld.basement_levels; b > 0; b--) {
    const bElevMax = baseElev - (b - 1) * 3.2;
    const bElevMin = baseElev - b * 3.2;
    floors.push({
      id: `${bld.id.replace('-', '')}-B${b}`,
      building_id: bld.id,
      floor_number: -b,
      floor_label: `Basement ${b}`,
      elevation_min_m: Number(bElevMin.toFixed(2)),
      elevation_max_m: Number(bElevMax.toFixed(2)),
      height_m: 3.20,
      area_sqft: Number((bld.built_up_area_sqft / bld.total_floors * 1.1).toFixed(1)),
      units_count: b === 1 ? 2 : 0,
      occupancy_type: 'Subsurface Parking & Mechanical Services',
      validation_status: 'VALIDATED'
    });
  }

  // Ground Floor
  floors.push({
    id: `${bld.id.replace('-', '')}-G00`,
    building_id: bld.id,
    floor_number: 0,
    floor_label: 'Ground Floor',
    elevation_min_m: Number(baseElev.toFixed(2)),
    elevation_max_m: Number((baseElev + floorH).toFixed(2)),
    height_m: Number(floorH.toFixed(2)),
    area_sqft: Number((bld.built_up_area_sqft / bld.total_floors).toFixed(1)),
    units_count: 4,
    occupancy_type: 'Commercial Lobby & Retail Frontage',
    validation_status: 'VALIDATED'
  });

  // Upper Floors
  for (let f = 1; f <= bld.total_floors; f++) {
    const fMin = baseElev + (f - 1) * floorH;
    const fMax = baseElev + f * floorH;
    floors.push({
      id: `${bld.id.replace('-', '')}-F${f < 10 ? '0' + f : f}`,
      building_id: bld.id,
      floor_number: f,
      floor_label: `Floor ${f < 10 ? '0' + f : f}`,
      elevation_min_m: Number(fMin.toFixed(2)),
      elevation_max_m: Number(fMax.toFixed(2)),
      height_m: Number(floorH.toFixed(2)),
      area_sqft: Number((bld.built_up_area_sqft / bld.total_floors).toFixed(1)),
      units_count: 4,
      occupancy_type: f > 3 ? 'Residential High-Rise' : 'Commercial Office Suite',
      validation_status: 'VALIDATED'
    });
  }

  return floors.sort((a, b) => a.floor_number - b.floor_number);
}

export function getMockUnitsForFloor(floorId: string): PropertyUnit[] {
  const parts = floorId.split('-');
  const bldId = MOCK_BUILDINGS.find(b => b.id.replace('-', '') === parts[0])?.id || 'BLD-0007';
  const bld = MOCK_BUILDINGS.find(b => b.id === bldId) || MOCK_BUILDINGS[0];
  const allFloors = getMockFloorsForBuilding(bld.id);
  const floor = allFloors.find(f => f.id === floorId) || allFloors.find(f => f.floor_number === 8) || allFloors[0];

  const fNum = floor.floor_number;
  const fLabel = fNum < 0 ? `B0${Math.abs(fNum)}` : fNum === 0 ? 'G00' : `F${fNum < 10 ? '0' + fNum : fNum}`;
  const parcelShort = bld.parcel_id.replace('PAR-', '').replace('PAR0', '');
  const bldShort = bld.id.replace('BLD-', 'B');

  const fp = bld.footprint_coordinates;
  const minX = Math.min(...fp.map(p => p[0]));
  const maxX = Math.max(...fp.map(p => p[0]));
  const minY = Math.min(...fp.map(p => p[1]));
  const maxY = Math.max(...fp.map(p => p[1]));
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;

  const quads = [
    { num: 'U-01', code: 'U01', x1: minX, x2: midX, y1: minY, y2: midY, type: '2 BHK Commercial / Residence', a1: 1120.0, a2: 980.0 },
    { num: 'U-02', code: 'U02', x1: midX, x2: maxX, y1: minY, y2: midY, type: '3 BHK Executive Suite', a1: 1380.0, a2: 1220.0 },
    { num: 'U-03', code: 'U03', x1: minX, x2: midX, y1: midY, y2: maxY, type: '3 BHK Residential Apartment', a1: 1240.0, a2: 1080.0 },
    { num: 'U-04', code: 'U04', x1: midX, x2: maxX, y1: midY, y2: maxY, type: '2 BHK Standard Unit', a1: 1090.0, a2: 950.0 },
  ];

  return quads.map(q => {
    const unitId = `${fLabel}-${q.code}`;
    const ulpin = `IN-LKO-GN5-${parcelShort}-${bldShort}-${fLabel}-${q.code}`;
    return {
      id: bld.id === 'BLD-0007' ? unitId : `${bld.id}-${unitId}`,
      unit_number: q.num,
      floor_id: floor.id,
      building_id: bld.id,
      parcel_id: bld.parcel_id,
      floor_number: fNum,
      ulpin: ulpin,
      area_sqft: q.a1,
      carpet_area_sqft: q.a2,
      bounding_box: {
        xmin: Number(q.x1.toFixed(2)),
        xmax: Number(q.x2.toFixed(2)),
        ymin: Number(q.y1.toFixed(2)),
        ymax: Number(q.y2.toFixed(2)),
        zmin: Number((floor.elevation_min_m - 100.0).toFixed(2)),
        zmax: Number((floor.elevation_max_m - 100.0).toFixed(2)),
        elevation_min: floor.elevation_min_m,
        elevation_max: floor.elevation_max_m
      },
      unit_type: q.type,
      ownership_status: 'Demonstration Record',
      spatial_status: 'VALIDATED',
      qr_data: ulpin
    };
  });
}
