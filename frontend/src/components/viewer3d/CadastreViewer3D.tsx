import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Parcel,
  Building,
  Floor,
  PropertyUnit,
  UtilityAsset,
  LayerVisibilityState
} from '../../types/cadastre';
import { getMockFloorsForBuilding, getMockUnitsForFloor } from '../../data/mockSpatialDataset';

interface CadastreViewer3DProps {
  parcels: Parcel[];
  buildings: Building[];
  utilities: UtilityAsset[];
  layerState: LayerVisibilityState;
  onSelectEntity: (type: 'parcel' | 'building' | 'floor' | 'unit' | 'utility' | null, id: string | null) => void;
  onHoverCoordinates?: (coords: { x: number; y: number; z: number; lat: number; lon: number; elevation: number }) => void;
}

export const CadastreViewer3D: React.FC<CadastreViewer3DProps> = ({
  parcels,
  buildings,
  utilities,
  layerState,
  onSelectEntity,
  onHoverCoordinates
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Object group references
  const parcelsGroupRef = useRef<THREE.Group>(new THREE.Group());
  const buildingsGroupRef = useRef<THREE.Group>(new THREE.Group());
  const floorsGroupRef = useRef<THREE.Group>(new THREE.Group());
  const unitsGroupRef = useRef<THREE.Group>(new THREE.Group());
  const utilitiesGroupRef = useRef<THREE.Group>(new THREE.Group());
  const undergroundGroupRef = useRef<THREE.Group>(new THREE.Group());
  const groundMeshRef = useRef<THREE.Mesh | null>(null);
  const conflictMarkersGroupRef = useRef<THREE.Group>(new THREE.Group());
  const measurementGroupRef = useRef<THREE.Group>(new THREE.Group());

  // Interactive raycaster
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const interactiveMeshesRef = useRef<{ mesh: THREE.Object3D; type: string; id: string }[]>([]);

  // Measurement state
  const [measurePoints, setMeasurePoints] = useState<THREE.Vector3[]>([]);
  const [measureDistance, setMeasureDistance] = useState<number | null>(null);

  // Initialize Scene & Renderer
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f5f9); // Institutional neutral light grey
    sceneRef.current = scene;

    // Camera (Default Perspective)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 2000);
    camera.position.set(130, 160, 240);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.localClippingEnabled = true;
    rendererRef.current = renderer;

    containerRef.current.replaceChildren(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 + 0.15; // Allow slight underground view angle
    controls.target.set(100, 10, 100);
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(150, 250, 180);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 600;
    const d = 160;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x94a3b8, 0.4);
    fillLight.position.set(-150, 100, -150);
    scene.add(fillLight);

    // Ground Plane
    const groundGeo = new THREE.PlaneGeometry(600, 600, 32, 32);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.85,
      metalness: 0.1,
      transparent: true,
      opacity: 0.95
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.receiveShadow = true;
    ground.position.set(100, 0, 100);
    scene.add(ground);
    groundMeshRef.current = ground;

    // Ground Grid
    const grid = new THREE.GridHelper(500, 50, 0x94a3b8, 0xcbd5e1);
    grid.position.set(100, 0.05, 100);
    scene.add(grid);

    // Road Corridors Simulation
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
    // Main Avenue
    const road1 = new THREE.Mesh(new THREE.PlaneGeometry(12, 350).rotateX(-Math.PI/2), roadMat);
    road1.position.set(67.5, 0.1, 105);
    road1.receiveShadow = true;
    scene.add(road1);
    // Cross Street
    const road2 = new THREE.Mesh(new THREE.PlaneGeometry(350, 12).rotateX(-Math.PI/2), roadMat);
    road2.position.set(105, 0.1, 67.5);
    road2.receiveShadow = true;
    scene.add(road2);
    const road3 = new THREE.Mesh(new THREE.PlaneGeometry(350, 12).rotateX(-Math.PI/2), roadMat);
    road3.position.set(105, 0.1, 137.5);
    road3.receiveShadow = true;
    scene.add(road3);

    // Add Groups
    scene.add(parcelsGroupRef.current);
    scene.add(buildingsGroupRef.current);
    scene.add(floorsGroupRef.current);
    scene.add(unitsGroupRef.current);
    scene.add(undergroundGroupRef.current);
    scene.add(utilitiesGroupRef.current);
    scene.add(conflictMarkersGroupRef.current);
    scene.add(measurementGroupRef.current);

    // Animation loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      controls.update();

      // Pulsing conflict markers
      if (conflictMarkersGroupRef.current.children.length > 0) {
        const time = Date.now() * 0.004;
        conflictMarkersGroupRef.current.children.forEach(child => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
            child.material.opacity = 0.4 + Math.sin(time) * 0.35;
          }
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize listener
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      if (cameraRef.current instanceof THREE.PerspectiveCamera) {
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
      }
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
    };
  }, []);

  // Update Basemap & View Mode
  useEffect(() => {
    if (!sceneRef.current || !groundMeshRef.current || !cameraRef.current || !rendererRef.current || !containerRef.current) return;

    // Basemap coloring
    const gMat = groundMeshRef.current.material as THREE.MeshStandardMaterial;
    if (layerState.basemap === 'satellite') {
      gMat.color.setHex(0x1e293b);
      sceneRef.current.background = new THREE.Color(0x0f172a);
    } else if (layerState.basemap === 'dark') {
      gMat.color.setHex(0x0f172a);
      sceneRef.current.background = new THREE.Color(0x020617);
    } else if (layerState.basemap === 'topo') {
      gMat.color.setHex(0xdcfce7);
      sceneRef.current.background = new THREE.Color(0xf0fdf4);
    } else {
      // Vector Cadastre default
      gMat.color.setHex(0xe2e8f0);
      sceneRef.current.background = new THREE.Color(0xf1f5f9);
    }

    // Ground Opacity based on Underground Depth Cutoff
    if (layerState.undergroundDepthCutoff < 0) {
      gMat.opacity = Math.max(0.15, 0.95 - Math.abs(layerState.undergroundDepthCutoff) * 0.04);
      gMat.transparent = true;
    } else {
      gMat.opacity = 0.95;
    }

    // 2D vs 3D Camera Mode
    if (layerState.viewMode === '2D') {
      if (controlsRef.current) {
        controlsRef.current.maxPolarAngle = 0.001; // Lock to top-down 2D
        controlsRef.current.target.set(100, 0, 100);
        cameraRef.current.position.set(100, 300, 100);
      }
    } else {
      if (controlsRef.current) {
        controlsRef.current.maxPolarAngle = Math.PI / 2 + 0.15;
      }
    }
  }, [layerState.basemap, layerState.viewMode, layerState.undergroundDepthCutoff]);

  // Re-build 3D Cadastral Entities
  useEffect(() => {
    if (!sceneRef.current) return;

    interactiveMeshesRef.current = [];

    // 1. Clear Groups
    while (parcelsGroupRef.current.children.length > 0) parcelsGroupRef.current.remove(parcelsGroupRef.current.children[0]);
    while (buildingsGroupRef.current.children.length > 0) buildingsGroupRef.current.remove(buildingsGroupRef.current.children[0]);
    while (floorsGroupRef.current.children.length > 0) floorsGroupRef.current.remove(floorsGroupRef.current.children[0]);
    while (unitsGroupRef.current.children.length > 0) unitsGroupRef.current.remove(unitsGroupRef.current.children[0]);
    while (utilitiesGroupRef.current.children.length > 0) utilitiesGroupRef.current.remove(utilitiesGroupRef.current.children[0]);
    while (conflictMarkersGroupRef.current.children.length > 0) conflictMarkersGroupRef.current.remove(conflictMarkersGroupRef.current.children[0]);

    // Visibility toggles
    parcelsGroupRef.current.visible = layerState.parcels;
    buildingsGroupRef.current.visible = layerState.buildings;
    floorsGroupRef.current.visible = layerState.floors;
    unitsGroupRef.current.visible = layerState.propertyUnits;
    utilitiesGroupRef.current.visible = layerState.undergroundUtilities;

    // 2. Render Parcels
    parcels.forEach(parcel => {
      const pts = parcel.boundary_utm;
      const shape = new THREE.Shape();
      shape.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) {
        shape.lineTo(pts[i][0], pts[i][1]);
      }
      shape.closePath();

      const geom = new THREE.ShapeGeometry(shape);
      geom.rotateX(Math.PI / 2);

      const isSelected = layerState.selectedParcelId === parcel.id || (layerState.selectedBuildingId === 'BLD-0007' && parcel.id === 'PAR-0102');
      const pMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0x0284c7 : 0xcbd5e1,
        transparent: true,
        opacity: isSelected ? 0.45 : 0.25,
        roughness: 0.9,
        side: THREE.DoubleSide
      });
      const pMesh = new THREE.Mesh(geom, pMat);
      pMesh.position.y = 0.12;
      parcelsGroupRef.current.add(pMesh);

      // Boundary Line
      const lineGeom = new THREE.BufferGeometry().setFromPoints(pts.map(p => new THREE.Vector3(p[0], 0.2, p[1])));
      const lineMat = new THREE.LineBasicMaterial({
        color: isSelected ? 0x0284c7 : 0x475569,
        linewidth: isSelected ? 3 : 1
      });
      const line = new THREE.LineLoop(lineGeom, lineMat);
      parcelsGroupRef.current.add(line);

      interactiveMeshesRef.current.push({ mesh: pMesh, type: 'parcel', id: parcel.id });
    });

    // 3. Render Buildings
    buildings.forEach(bld => {
      const isSelected = layerState.selectedBuildingId === bld.id;
      const isDimmed = layerState.isolationMode && layerState.selectedBuildingId && !isSelected;

      const fp = bld.footprint_coordinates;
      const width = Math.abs(fp[1][0] - fp[0][0]);
      const depth = Math.abs(fp[2][1] - fp[1][1]);
      const height = bld.height_m;
      const centerX = bld.center_coords[0];
      const centerZ = bld.center_coords[1];

      // Building Basements (Subsurface levels)
      for (let b = 1; b <= bld.basement_levels; b++) {
        const bHeight = 3.2;
        const bGeo = new THREE.BoxGeometry(width + 2, bHeight, depth + 2);
        const bMat = new THREE.MeshStandardMaterial({
          color: 0x334155,
          transparent: true,
          opacity: isDimmed ? 0.08 : 0.85,
          roughness: 0.7
        });
        const bMesh = new THREE.Mesh(bGeo, bMat);
        bMesh.position.set(centerX, -b * bHeight + bHeight / 2, centerZ);
        buildingsGroupRef.current.add(bMesh);

        // Subsurface wireframe
        const bEdges = new THREE.LineSegments(
          new THREE.EdgesGeometry(bGeo),
          new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: isDimmed ? 0.1 : 0.5 })
        );
        bEdges.position.copy(bMesh.position);
        buildingsGroupRef.current.add(bEdges);
      }

      // Above-ground Building Structure
      if (layerState.floors && (isSelected || !layerState.isolationMode)) {
        // Render Floor by Floor
        const floors = getMockFloorsForBuilding(bld.id).filter(f => f.floor_number >= 0);
        const fHeight = height / bld.total_floors;

        floors.forEach(fl => {
          const isFloorSelected = isSelected && layerState.selectedFloorNumber === fl.floor_number;
          const isFloorActive = isSelected && (layerState.selectedFloorNumber === null || layerState.selectedFloorNumber === fl.floor_number);

          const flGeo = new THREE.BoxGeometry(width, fHeight * 0.92, depth);
          const flMat = new THREE.MeshStandardMaterial({
            color: isFloorSelected ? 0x0284c7 : isSelected ? 0x475569 : 0x64748b,
            transparent: true,
            opacity: isDimmed ? 0.1 : isFloorSelected ? 0.85 : isFloorActive ? 0.75 : 0.35,
            roughness: 0.5,
            metalness: 0.2
          });
          const flMesh = new THREE.Mesh(flGeo, flMat);
          const yPos = fl.floor_number * fHeight - fHeight / 2 + (isFloorSelected && layerState.isolationMode ? 2.5 : 0);
          flMesh.position.set(centerX, yPos, centerZ);
          flMesh.castShadow = !isDimmed;
          flMesh.receiveShadow = true;
          floorsGroupRef.current.add(flMesh);

          // Floor slab edges
          const fEdges = new THREE.LineSegments(
            new THREE.EdgesGeometry(flGeo),
            new THREE.LineBasicMaterial({
              color: isFloorSelected ? 0x38bdf8 : 0xcbd5e1,
              transparent: true,
              opacity: isDimmed ? 0.08 : 0.6
            })
          );
          fEdges.position.copy(flMesh.position);
          floorsGroupRef.current.add(fEdges);

          interactiveMeshesRef.current.push({ mesh: flMesh, type: 'floor', id: fl.id });

          // If this floor is selected, render 3D Unit Volumes!
          if (isFloorSelected || (isSelected && layerState.selectedFloorNumber === fl.floor_number)) {
            const units = getMockUnitsForFloor(fl.id);
            units.forEach(u => {
              const bb = u.bounding_box;
              const uWidth = Math.abs(bb.xmax - bb.xmin);
              const uDepth = Math.abs(bb.ymax - bb.ymin);
              const uHeight = Math.abs(bb.zmax - bb.zmin);
              const uCenterX = (bb.xmin + bb.xmax) / 2;
              const uCenterZ = (bb.ymin + bb.ymax) / 2;
              const uCenterY = yPos;

              const isUnitSelected = layerState.selectedUnitId === u.id || (u.unit_number === 'U-03' && layerState.selectedUnitId?.includes('U03'));

              const uGeo = new THREE.BoxGeometry(uWidth * 0.92, uHeight * 0.9, uDepth * 0.92);
              const uMat = new THREE.MeshStandardMaterial({
                color: isUnitSelected ? 0x0284c7 : 0x0369a1,
                transparent: true,
                opacity: isUnitSelected ? 0.75 : 0.3,
                roughness: 0.3,
                metalness: 0.1
              });
              const uMesh = new THREE.Mesh(uGeo, uMat);
              uMesh.position.set(uCenterX, uCenterY, uCenterZ);
              unitsGroupRef.current.add(uMesh);

              // Unit glowing wireframe bounding box
              const uEdges = new THREE.LineSegments(
                new THREE.EdgesGeometry(uGeo),
                new THREE.LineBasicMaterial({
                  color: isUnitSelected ? 0x38bdf8 : 0x7dd3fc,
                  linewidth: isUnitSelected ? 2 : 1
                })
              );
              uEdges.position.copy(uMesh.position);
              unitsGroupRef.current.add(uEdges);

              interactiveMeshesRef.current.push({ mesh: uMesh, type: 'unit', id: u.id });
            });
          }
        });
      } else {
        // Solid Extruded Building Mesh
        const bGeo = new THREE.BoxGeometry(width, height, depth);
        const bMat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0x1e3a8a : 0x475569,
          transparent: true,
          opacity: isDimmed ? 0.12 : 0.85,
          roughness: 0.6,
          metalness: 0.2
        });
        const bMesh = new THREE.Mesh(bGeo, bMat);
        bMesh.position.set(centerX, height / 2, centerZ);
        bMesh.castShadow = !isDimmed;
        bMesh.receiveShadow = true;
        buildingsGroupRef.current.add(bMesh);

        const bEdges = new THREE.LineSegments(
          new THREE.EdgesGeometry(bGeo),
          new THREE.LineBasicMaterial({ color: isSelected ? 0x38bdf8 : 0x94a3b8, transparent: true, opacity: isDimmed ? 0.1 : 0.8 })
        );
        bEdges.position.copy(bMesh.position);
        buildingsGroupRef.current.add(bEdges);

        interactiveMeshesRef.current.push({ mesh: bMesh, type: 'building', id: bld.id });
      }
    });

    // 4. Render Underground Utilities
    utilities.forEach(util => {
      // Filter by Depth Cutoff Slider
      if (util.depth_m < layerState.undergroundDepthCutoff) return;

      const pts = util.coordinates_3d.map(c => new THREE.Vector3(c[0], c[2], c[1]));
      const curve = new THREE.CatmullRomCurve3(pts);
      const isClashing = util.spatial_conflict === 'POTENTIAL_CLASH_DETECTED';
      const isSelected = layerState.selectedUtilityId === util.id;

      let radius = (util.diameter_mm || 500) / 1000 / 2;
      if (radius < 0.4) radius = 0.4; // visual clarity

      const tubeGeo = new THREE.TubeGeometry(curve, 32, radius, 12, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: isClashing ? 0xdc2626 : isSelected ? 0x38bdf8 : util.type.includes('Water') ? 0x0284c7 : util.type.includes('Electric') ? 0xd97706 : util.type.includes('Sewer') ? 0x059669 : 0x64748b,
        roughness: 0.4,
        metalness: 0.6,
        emissive: isClashing ? 0x7f1d1d : 0x000000,
        emissiveIntensity: isClashing ? 0.6 : 0.0
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      utilitiesGroupRef.current.add(tubeMesh);

      // Utility Inspection Node Markers
      pts.forEach(p => {
        const nodeGeo = new THREE.SphereGeometry(radius * 1.6, 12, 12);
        const nodeMat = new THREE.MeshStandardMaterial({
          color: isClashing ? 0xdc2626 : 0x0284c7,
          roughness: 0.3
        });
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.copy(p);
        utilitiesGroupRef.current.add(node);
      });

      interactiveMeshesRef.current.push({ mesh: tubeMesh, type: 'utility', id: util.id });
    });

    // 5. Render Conflict Visualization Marker (VAL-00231)
    if (layerState.highlightConflict) {
      // Conflict intersection box between BLD-0007 Basement-2 and UTL-023
      const cBoxGeo = new THREE.BoxGeometry(38, 4, 38);
      const cBoxMat = new THREE.MeshBasicMaterial({
        color: 0xdc2626,
        transparent: true,
        opacity: 0.5,
        wireframe: true
      });
      const cBoxMesh = new THREE.Mesh(cBoxGeo, cBoxMat);
      cBoxMesh.position.set(35, -8.2, 35);
      conflictMarkersGroupRef.current.add(cBoxMesh);

      const markerGeo = new THREE.SphereGeometry(3.5, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.7
      });
      const markerMesh = new THREE.Mesh(markerGeo, markerMat);
      markerMesh.position.set(35, -8.2, 32);
      conflictMarkersGroupRef.current.add(markerMesh);
    }
  }, [parcels, buildings, utilities, layerState]);

  // Handle Raycasting & Selection on Click
  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || !cameraRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, cameraRef.current);
    const meshes = interactiveMeshesRef.current.map(item => item.mesh);
    const intersects = raycaster.current.intersectObjects(meshes, true);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const match = interactiveMeshesRef.current.find(item => item.mesh === hit.object || item.mesh.children.includes(hit.object));
      if (match) {
        if (match.type === 'unit') {
          onSelectEntity('unit', match.id);
        } else if (match.type === 'floor') {
          onSelectEntity('floor', match.id);
        } else if (match.type === 'building') {
          onSelectEntity('building', match.id);
        } else if (match.type === 'parcel') {
          onSelectEntity('parcel', match.id);
        } else if (match.type === 'utility') {
          onSelectEntity('utility', match.id);
        }
        return;
      }
    }
  }, [onSelectEntity]);

  // Track cursor coordinates for HUD
  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || !cameraRef.current || !onHoverCoordinates) return;

    const rect = containerRef.current.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, cameraRef.current);
    if (groundMeshRef.current) {
      const groundHits = raycaster.current.intersectObject(groundMeshRef.current);
      if (groundHits.length > 0) {
        const pt = groundHits[0].point;
        // Transform local metric UTM to simulated lat/lon around Gomti Nagar
        const lon = 80.99215 + (pt.x / 100) * 0.0015;
        const lat = 26.85320 - (pt.z / 100) * 0.0015;
        const elevation = 100.0 + pt.y;
        onHoverCoordinates({
          x: Math.round(pt.x * 10) / 10,
          y: Math.round(pt.z * 10) / 10,
          z: Math.round(pt.y * 10) / 10,
          lat: Number(lat.toFixed(6)),
          lon: Number(lon.toFixed(6)),
          elevation: Number(elevation.toFixed(2))
        });
      }
    }
  }, [onHoverCoordinates]);

  // Camera Animation to Target
  useEffect(() => {
    if (!controlsRef.current || !cameraRef.current) return;

    if (layerState.selectedBuildingId === 'BLD-0007') {
      // Focus on Flagship BLD-0007
      const bld = buildings.find(b => b.id === 'BLD-0007');
      if (bld) {
        controlsRef.current.target.set(bld.center_coords[0], layerState.selectedFloorNumber ? layerState.selectedFloorNumber * 3.0 : 22, bld.center_coords[1]);
        if (layerState.isolationMode) {
          cameraRef.current.position.set(bld.center_coords[0] + 45, 35, bld.center_coords[1] + 55);
        }
      }
    } else if (layerState.selectedParcelId) {
      const p = parcels.find(x => x.id === layerState.selectedParcelId);
      if (p) {
        controlsRef.current.target.set(p.boundary_utm[0][0] + 25, 0, p.boundary_utm[0][1] + 25);
      }
    }
  }, [layerState.selectedBuildingId, layerState.selectedFloorNumber, layerState.selectedParcelId, layerState.isolationMode, buildings, parcels]);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      className="w-full h-full relative cursor-crosshair select-none bg-slate-900"
    />
  );
};
