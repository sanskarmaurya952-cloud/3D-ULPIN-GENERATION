import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Box,
  MapPin,
  Building,
  Layers,
  ArrowDown,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Play,
  QrCode,
  FileCheck2,
  FileText,
  Cpu,
  Globe,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Server,
  Lock,
  Layers as LayersIcon,
  Compass,
  Radio,
  FileSpreadsheet,
  Workflow,
  Eye,
  Check,
  Zap
} from 'lucide-react';
import { NavView } from '../types/cadastre';

interface LandingPageViewProps {
  onEnterPortal: (targetView?: NavView) => void;
  onLaunchDemoWorkflow: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onEnterPortal,
  onLaunchDemoWorkflow
}) => {
  // Hero 3D Viewer Canvas Ref
  const heroCanvasRef = useRef<HTMLDivElement>(null);
  const [heroUnitSelected, setHeroUnitSelected] = useState(false);

  // Interactive Layer Preview State in Section 12
  const [previewLayers, setPreviewLayers] = useState({
    parcels: true,
    buildings: true,
    floors: true,
    propertyUnits: true,
    undergroundUtilities: true
  });

  // Initialize Hero Three.js Viewport
  useEffect(() => {
    if (!heroCanvasRef.current) return;

    const container = heroCanvasRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 340;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1120); // Dark institutional navy

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(55, 45, 65);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.target.set(0, 10, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.enableZoom = false; // Prevent wheel zoom from intercepting page vertical scroll

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight.position.set(40, 80, 50);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0x1e3a8a, 0.8);
    backLight.position.set(-40, 30, -40);
    scene.add(backLight);

    // Ground & Elevation Grid
    const grid = new THREE.GridHelper(90, 18, 0x1e3a8a, 0x172554);
    grid.position.y = 0;
    scene.add(grid);

    // Parcel Boundary (P-0102)
    const parcelShape = new THREE.Shape();
    parcelShape.moveTo(-18, -18);
    parcelShape.lineTo(18, -18);
    parcelShape.lineTo(18, 18);
    parcelShape.lineTo(-18, 18);
    parcelShape.closePath();

    const parcelGeo = new THREE.ShapeGeometry(parcelShape);
    parcelGeo.rotateX(Math.PI / 2);
    const parcelMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });
    const parcelMesh = new THREE.Mesh(parcelGeo, parcelMat);
    parcelMesh.position.y = 0.05;
    scene.add(parcelMesh);

    // Parcel Outline Line
    const pts = [
      new THREE.Vector3(-18, 0.1, -18),
      new THREE.Vector3(18, 0.1, -18),
      new THREE.Vector3(18, 0.1, 18),
      new THREE.Vector3(-18, 0.1, 18),
      new THREE.Vector3(-18, 0.1, -18),
    ];
    const parcelLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 })
    );
    scene.add(parcelLine);

    // 3D Building (BLD-0007 / Shikhar Heights Model)
    const buildingGroup = new THREE.Group();
    const totalFloors = 12;
    const floorHeight = 2.2;
    const bldWidth = 14;
    const bldDepth = 14;

    // Basements (-2 Levels)
    for (let b = 1; b <= 2; b++) {
      const bGeo = new THREE.BoxGeometry(bldWidth + 2, floorHeight, bldDepth + 2);
      const bMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        transparent: true,
        opacity: 0.75,
        roughness: 0.6
      });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set(0, -b * floorHeight + floorHeight / 2, 0);
      buildingGroup.add(bMesh);

      const bEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(bGeo),
        new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.6 })
      );
      bEdges.position.copy(bMesh.position);
      buildingGroup.add(bEdges);
    }

    // Above-ground Floors
    for (let f = 1; f <= totalFloors; f++) {
      const isTargetFloor = f === 8;
      const flGeo = new THREE.BoxGeometry(bldWidth, floorHeight * 0.92, bldDepth);
      const flMat = new THREE.MeshStandardMaterial({
        color: isTargetFloor ? 0x0369a1 : 0x0f172a,
        transparent: true,
        opacity: isTargetFloor ? 0.9 : 0.65,
        roughness: 0.3,
        metalness: 0.2
      });
      const flMesh = new THREE.Mesh(flGeo, flMat);
      flMesh.position.set(0, (f - 1) * floorHeight + floorHeight / 2, 0);
      buildingGroup.add(flMesh);

      // Floor Edge Slabs
      const flEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(flGeo),
        new THREE.LineBasicMaterial({
          color: isTargetFloor ? 0x38bdf8 : 0x334155,
          transparent: true,
          opacity: isTargetFloor ? 0.9 : 0.5
        })
      );
      flEdges.position.copy(flMesh.position);
      buildingGroup.add(flEdges);

      // Highlighted Property Unit (F08-U03) on Floor 8
      if (isTargetFloor) {
        const uGeo = new THREE.BoxGeometry(bldWidth * 0.48, floorHeight * 0.88, bldDepth * 0.48);
        const uMat = new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          emissive: 0x0284c7,
          emissiveIntensity: 0.45,
          transparent: true,
          opacity: 0.95,
          roughness: 0.2
        });
        const uMesh = new THREE.Mesh(uGeo, uMat);
        uMesh.position.set(bldWidth * 0.24, (f - 1) * floorHeight + floorHeight / 2, bldDepth * 0.24);
        buildingGroup.add(uMesh);

        // Glowing Wireframe Box for Unit
        const uEdges = new THREE.LineSegments(
          new THREE.EdgesGeometry(uGeo),
          new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 })
        );
        uEdges.position.copy(uMesh.position);
        buildingGroup.add(uEdges);
      }
    }

    scene.add(buildingGroup);

    // Underground Utility Lines (UTL-023 Water Pipeline)
    const utilCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-28, -5.5, -6),
      new THREE.Vector3(-10, -5.5, -4),
      new THREE.Vector3(8, -5.5, 4),
      new THREE.Vector3(28, -5.5, 8)
    ]);
    const utilTubeGeo = new THREE.TubeGeometry(utilCurve, 24, 0.7, 8, false);
    const utilMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0x991b1b,
      emissiveIntensity: 0.6,
      roughness: 0.3
    });
    const utilTube = new THREE.Mesh(utilTubeGeo, utilMat);
    scene.add(utilTube);

    // Adjacent Context Building (B-08)
    const adjGeo = new THREE.BoxGeometry(10, 14, 10);
    const adjMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, transparent: true, opacity: 0.4, roughness: 0.5 });
    const adjMesh = new THREE.Mesh(adjGeo, adjMat);
    adjMesh.position.set(-22, 7, 10);
    scene.add(adjMesh);
    const adjEdges = new THREE.LineSegments(new THREE.EdgesGeometry(adjGeo), new THREE.LineBasicMaterial({ color: 0x1e293b }));
    adjEdges.position.copy(adjMesh.position);
    scene.add(adjEdges);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col selection:bg-blue-100 selection:text-blue-900 bg-topo-pattern font-sans antialiased overflow-x-hidden">

      {/* 1. TOP GOVERNMENT-STYLE INFORMATION BAR */}
      <div className="bg-[#061224] text-slate-300 text-[11px] py-1.5 px-6 border-b border-slate-800 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200 tracking-wider">
            3D CADASTRAL DEMONSTRATION PLATFORM
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">
            Pilot Zone: Lucknow (Zone 5) • Directorate of Land Records & Urban Planning
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-semibold">System Status ● Operational</span>
          </div>
        </div>
      </div>

      {/* 2. INSTITUTIONAL HEADER */}
      <header className="bg-cadastre-dark text-white border-b border-slate-700/80 px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-blue-900 border border-blue-500/60 text-white font-mono font-extrabold text-xs shadow-inner">
            3D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight font-sans text-slate-100">
                3D ULPIN
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950 border border-blue-700/50 text-blue-300 font-semibold">
                CADASTRAL PORTAL
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wide">
              Urban Land & Property Identification
            </div>
          </div>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs text-slate-300 font-medium">
          <button onClick={() => scrollToSection('overview')} className="hover:text-white transition-colors">
            Overview
          </button>
          <button onClick={() => onEnterPortal('3d-cadastre')} className="hover:text-white transition-colors">
            3D Cadastre
          </button>
          <button onClick={() => scrollToSection('framework')} className="hover:text-white transition-colors">
            Framework
          </button>
          <button onClick={() => scrollToSection('datasources')} className="hover:text-white transition-colors">
            Data Sources
          </button>
          <button onClick={() => scrollToSection('validation')} className="hover:text-white transition-colors">
            Validation
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => scrollToSection('architecture')}
            className="hidden sm:inline-block text-xs text-slate-300 hover:text-white transition-colors font-medium"
          >
            Documentation
          </button>
          <button
            onClick={() => onEnterPortal('dashboard')}
            className="bg-blue-800 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Launch Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 3. HERO SECTION (Split Layout) */}
      <section id="overview" className="py-10 lg:py-14 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Left Column */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-950 px-2.5 py-1 rounded text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-700" />
              <span className="tracking-wider uppercase font-mono text-[10px]">3D URBAN CADASTRE</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 font-medium text-[11px]">Pilot Demonstration</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight font-sans">
              Three-Dimensional Urban Cadastre
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              A spatial framework for uniquely identifying, visualizing and validating property entities across the surface, vertical and subsurface dimensions of modern cities.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onEnterPortal('3d-cadastre')}
                className="bg-blue-900 hover:bg-blue-950 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded flex items-center gap-2 transition-colors shadow-sm"
              >
                <Box className="w-4 h-4" />
                <span>Explore 3D Cadastre</span>
              </button>

              <button
                onClick={() => scrollToSection('framework')}
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-xs sm:text-sm px-5 py-3 rounded flex items-center gap-2 transition-colors shadow-xs"
              >
                <Workflow className="w-4 h-4 text-slate-600" />
                <span>View Framework</span>
              </button>
            </div>

            {/* Status Label */}
            <div className="pt-2 text-xs font-mono text-slate-700 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>Prototype • Demonstration Dataset • GIS Enabled</span>
            </div>
          </div>

          {/* Hero Right Column: Live 3D Cadastral Visualization Viewport */}
          <div className="lg:col-span-6 bg-slate-950 border border-slate-700 rounded shadow-xl overflow-hidden flex flex-col">
            {/* Viewport Toolbar */}
            <div className="px-3.5 py-2 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Box className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-semibold text-slate-200">3D Cadastre Interactive Viewport</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800 text-sky-300">
                  LOD-2 ACTIVE
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400">EPSG:4326</span>
              </div>
            </div>

            {/* WebGL Canvas Container */}
            <div className="relative h-80 sm:h-96 w-full cursor-grab active:cursor-grabbing bg-slate-950">
              <div ref={heroCanvasRef} className="w-full h-full" />

              {/* Spatial HUD Overlay Labels */}
              <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700/80 rounded p-2 text-[11px] font-mono text-slate-300 shadow backdrop-blur-xs space-y-1 pointer-events-none">
                <div className="flex items-center gap-2 text-sky-300 font-semibold">
                  <MapPin className="w-3 h-3 text-sky-400" />
                  <span>PARCEL P-0102</span>
                </div>
                <div className="text-[10px] text-slate-400">BLDG B-0007 (14 Storeys)</div>
                <div className="text-[10px] text-amber-300 font-bold">TARGET UNIT: F08-U03</div>
              </div>

              {/* Subsurface Clash Indicator Tag */}
              <div className="absolute bottom-3 left-3 bg-red-950/90 border border-red-500/80 rounded px-2.5 py-1 text-[10px] font-mono text-red-200 shadow backdrop-blur-xs flex items-center gap-1.5 pointer-events-none">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span>UTL-023 (-8.4m Utility Corridor)</span>
              </div>

              {/* Interactivity Hint / Quick Launch */}
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => onEnterPortal('3d-cadastre')}
                  className="bg-blue-900/90 hover:bg-blue-800 text-white border border-blue-500/50 text-[11px] px-2.5 py-1 rounded font-medium shadow flex items-center gap-1 transition-colors"
                >
                  <span>Full Screen GIS</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Click to inspect modal simulation */}
              <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-700 rounded p-2 text-[10px] font-mono text-slate-300 backdrop-blur-xs">
                <span className="text-slate-400">Drag to rotate • Scroll to zoom</span>
              </div>
            </div>

            {/* Viewport Footer Bar */}
            <div className="px-3 py-2 bg-slate-900/90 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-300 font-mono">
              <div>
                <span className="text-[9px] text-slate-500 block uppercase">Zone</span>
                <span className="font-semibold text-slate-200">Gomti Nagar 5</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block uppercase">Elevation Datum</span>
                <span className="font-semibold text-slate-200">124.20m MSL</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block uppercase">3D Entities</span>
                <span className="font-semibold text-emerald-400">32 Units Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROBLEM SECTION: Why Conventional 2D Cadastre Is No Longer Enough */}
      <section className="py-12 px-6 bg-white border-y border-slate-300">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
              THE STRUCTURAL CHALLENGE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
              Why Conventional 2D Cadastre Is No Longer Enough
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Traditional municipal cadastral records compress complex urban geometry into flat 2D surface polygons, creating legal ambiguity in high-density vertical cities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Traditional 2D Representation */}
            <div className="bg-slate-50 border border-slate-300 rounded p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-400" />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">Traditional 2D Representation</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                  SURFACE ONLY
                </span>
              </div>

              {/* Diagram Graphic 2D */}
              <div className="h-44 bg-white border border-dashed border-slate-300 rounded flex items-center justify-center relative p-4">
                <div className="w-48 h-28 border-2 border-slate-400 bg-slate-100 rounded flex flex-col items-center justify-center text-center p-2">
                  <span className="font-mono font-bold text-xs text-slate-700">PARCEL P-0102</span>
                  <span className="text-[10px] text-slate-500 mt-1">(X, Y Surface Polygon)</span>
                  <span className="text-[9px] text-red-600 font-medium mt-1">Height & Depth = 0</span>
                </div>
                <div className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-400">
                  Flat 2D Projection
                </div>
              </div>

              {/* Limitations List */}
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 font-bold">•</span>
                  <span><strong>Surface boundary only:</strong> No capability to record strata titles or vertical levels.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 font-bold">•</span>
                  <span><strong>Limited vertical representation:</strong> Multi-floor apartments share the same parcel code.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 font-bold">•</span>
                  <span><strong>Difficult to model subsurface relationships:</strong> Basements, metro lines, and utilities invisible.</span>
                </li>
              </ul>
            </div>

            {/* Right: 3D Cadastral Representation */}
            <div className="bg-blue-50/40 border border-blue-300 rounded p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-blue-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">3D Cadastral Representation</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900 text-white font-semibold">
                  X • Y • Z VOLUMETRIC
                </span>
              </div>

              {/* Diagram Graphic 3D */}
              <div className="h-44 bg-slate-900 border border-slate-700 rounded flex flex-col justify-center items-center relative p-3 text-[10px] font-mono text-slate-300">
                <div className="w-56 space-y-1">
                  <div className="bg-blue-950 border border-blue-600 py-1 px-2 rounded flex justify-between">
                    <span>Floor 08</span>
                    <span className="text-amber-300 font-bold">Unit F08-U03 (124–127m)</span>
                  </div>
                  <div className="bg-slate-800 border border-slate-600 py-1 px-2 rounded flex justify-between">
                    <span>Floor 01–07</span>
                    <span className="text-slate-400">Vertical Units</span>
                  </div>
                  <div className="border-t-2 border-dashed border-sky-400 pt-0.5 text-sky-300 text-center font-bold">
                    ────── Ground Surface (Parcel P-0102) ──────
                  </div>
                  <div className="bg-slate-800 border border-slate-600 py-1 px-2 rounded flex justify-between">
                    <span>Basement 1 & 2</span>
                    <span className="text-slate-400">Parking (-6.4m)</span>
                  </div>
                  <div className="bg-red-950 border border-red-600 py-1 px-2 rounded flex justify-between text-red-300">
                    <span>Subsurface Utility</span>
                    <span>UTL-023 (-8.4m)</span>
                  </div>
                </div>
              </div>

              {/* Benefits List */}
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 font-bold">•</span>
                  <span><strong>Spatial identity across X, Y and Z:</strong> Every volume has explicit 3D bounding coordinates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 font-bold">•</span>
                  <span><strong>Vertical property delineation:</strong> Unique ULPIN assigned to individual apartment volumes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 font-bold">•</span>
                  <span><strong>Subsurface infrastructure mapping:</strong> Underground pipelines and easements spatially integrated.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CORE CONCEPT SECTION: From Land Parcel to Spatial Property Identity */}
      <section id="framework" className="py-12 px-6 max-w-7xl mx-auto w-full space-y-8">
        <div className="max-w-3xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
            METHODOLOGY
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            From Land Parcel to Spatial Property Identity
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            The multi-stage hierarchical spatial pipeline converting traditional 2D land titles into verifiable 3D property entities.
          </p>
        </div>

        {/* 6-Step Horizontal Pipeline */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Step 1: Parcel */}
          <div className="bg-white border border-slate-300 rounded p-4 flex flex-col justify-between space-y-3 shadow-xs">
            <div>
              <div className="w-8 h-8 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-bold mb-2">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-900 block uppercase">STAGE 01</span>
              <h3 className="font-bold text-slate-900 text-sm">LAND PARCEL</h3>
              <p className="text-slate-600 text-[11px] mt-1">Defined surface boundary from cadastral survey.</p>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 text-center font-medium">
              PAR-0102
            </span>
          </div>

          {/* Step 2: Building */}
          <div className="bg-white border border-slate-300 rounded p-4 flex flex-col justify-between space-y-3 shadow-xs">
            <div>
              <div className="w-8 h-8 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-bold mb-2">
                <Building className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-900 block uppercase">STAGE 02</span>
              <h3 className="font-bold text-slate-900 text-sm">BUILDING</h3>
              <p className="text-slate-600 text-[11px] mt-1">3D structure extruded to LiDAR height envelope.</p>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 text-center font-medium">
              BLD-0007
            </span>
          </div>

          {/* Step 3: Floor */}
          <div className="bg-white border border-slate-300 rounded p-4 flex flex-col justify-between space-y-3 shadow-xs">
            <div>
              <div className="w-8 h-8 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-bold mb-2">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-900 block uppercase">STAGE 03</span>
              <h3 className="font-bold text-slate-900 text-sm">FLOOR</h3>
              <p className="text-slate-600 text-[11px] mt-1">Vertical structural partition and slab elevation.</p>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 text-center font-medium">
              Floor 08 (F08)
            </span>
          </div>

          {/* Step 4: Unit */}
          <div className="bg-white border border-slate-300 rounded p-4 flex flex-col justify-between space-y-3 shadow-xs">
            <div>
              <div className="w-8 h-8 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-bold mb-2">
                <Box className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-900 block uppercase">STAGE 04</span>
              <h3 className="font-bold text-slate-900 text-sm">PROPERTY UNIT</h3>
              <p className="text-slate-600 text-[11px] mt-1">Individual private domain and ownership volume.</p>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 text-center font-medium">
              Unit U-03
            </span>
          </div>

          {/* Step 5: 3D Volume */}
          <div className="bg-white border border-slate-300 rounded p-4 flex flex-col justify-between space-y-3 shadow-xs">
            <div>
              <div className="w-8 h-8 rounded bg-blue-50 border border-blue-300 flex items-center justify-center text-blue-900 font-bold mb-2">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-900 block uppercase">STAGE 05</span>
              <h3 className="font-bold text-slate-900 text-sm">3D VOLUME</h3>
              <p className="text-slate-600 text-[11px] mt-1">Volumetric spatial bounding box [X, Y, Z].</p>
            </div>
            <span className="text-[10px] font-mono bg-blue-50 text-blue-900 px-2 py-0.5 rounded text-center font-medium">
              124.2–127.2m MSL
            </span>
          </div>

          {/* Step 6: ULPIN */}
          <div className="bg-blue-950 text-white border border-blue-800 rounded p-4 flex flex-col justify-between space-y-3 shadow-sm">
            <div>
              <div className="w-8 h-8 rounded bg-blue-900 border border-blue-600 flex items-center justify-center text-sky-300 font-bold mb-2">
                <QrCode className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold text-sky-400 block uppercase">STAGE 06</span>
              <h3 className="font-bold text-white text-sm">3D ULPIN</h3>
              <p className="text-slate-300 text-[11px] mt-1">Unique immutable spatial cadastral identifier.</p>
            </div>
            <span className="text-[9px] font-mono bg-blue-900 text-sky-200 px-1.5 py-0.5 rounded text-center font-semibold truncate">
              IN-LKO-GN5-...
            </span>
          </div>
        </div>
      </section>

      {/* 6. DATA FOUNDATION SECTION: Built on Multiple Geospatial Data Sources */}
      <section id="datasources" className="py-12 px-6 bg-white border-y border-slate-300">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
                DATA INTEGRATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
                Built on Multiple Geospatial Data Sources
              </h2>
            </div>
            <span className="text-[11px] font-mono px-3 py-1 bg-slate-100 border border-slate-300 rounded text-slate-700 font-semibold self-start sm:self-auto">
              Representative / Demonstration Data
            </span>
          </div>

          {/* 6 Data Sources Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Radio className="w-4 h-4 text-blue-900" />
                <span>Drone Imagery</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                High-resolution orthomosaics (0.1m GSD) for precise roof boundary mapping and structure regularization.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Cpu className="w-4 h-4 text-blue-900" />
                <span>LiDAR / Point Cloud</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Aerial point clouds providing dense 3D elevation measurements for LOD-2 geometric reconstruction.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <MapPin className="w-4 h-4 text-blue-900" />
                <span>GIS Parcel Layers</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                State cadastral revenue maps providing base 2D parcel polygons, survey numbers, and zoning rules.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <FileSpreadsheet className="w-4 h-4 text-blue-900" />
                <span>Building Floor Plans</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Sanctioned architectural BIM/CAD drawings for internal unit partitioning and carpet area extraction.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Globe className="w-4 h-4 text-blue-900" />
                <span>GNSS / CORS</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Continuously Operating Reference Station network providing sub-centimeter geodetic ground control.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <LayersIcon className="w-4 h-4 text-blue-900" />
                <span>DEM / DSM</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Digital Surface Models and Digital Elevation Models referenced to standard Mean Sea Level (MSL) datum.
              </p>
            </div>
          </div>

          {/* Underneath Pipeline Flow */}
          <div className="bg-slate-900 text-white rounded p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-sky-400 font-bold">
              <Workflow className="w-4 h-4" />
              <span>DATA HARMONIZATION PIPELINE:</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-slate-300">
              <span className="bg-slate-800 px-2.5 py-1 rounded border border-slate-700">Data Ingestion</span>
              <span className="text-slate-500">→</span>
              <span className="bg-slate-800 px-2.5 py-1 rounded border border-slate-700">Coordinate Harmonization (EPSG:4326)</span>
              <span className="text-slate-500">→</span>
              <span className="bg-blue-900 text-sky-200 px-2.5 py-1 rounded border border-blue-700 font-semibold">
                3D Spatial Reconstruction
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INTELLIGENT PROCESSING: AI-Assisted Spatial Intelligence */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full space-y-8">
        <div className="max-w-3xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
            AUTOMATION & PRECISION
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            AI-Assisted Spatial Intelligence
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Automated deep-learning and geometric reasoning modules designed to accelerate 3D cadastral ingestion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-300 p-5 rounded space-y-3 shadow-xs">
            <div className="w-8 h-8 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900 font-bold">
              <Building className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Building Extraction</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Automatically identify building footprints and structures from high-resolution orthophotography with sub-pixel edge alignment.
            </p>
            <span className="text-[10px] font-mono text-blue-900 font-semibold block pt-1">
              Precision: 94.2% (UNet-ConvNeXt)
            </span>
          </div>

          <div className="bg-white border border-slate-300 p-5 rounded space-y-3 shadow-xs">
            <div className="w-8 h-8 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900 font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Floor Segmentation</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Estimate and organize vertical building levels using normalized DSM height frequencies and architectural floor templates.
            </p>
            <span className="text-[10px] font-mono text-blue-900 font-semibold block pt-1">
              Storey Accuracy: 98.1%
            </span>
          </div>

          <div className="bg-white border border-slate-300 p-5 rounded space-y-3 shadow-xs">
            <div className="w-8 h-8 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900 font-bold">
              <Box className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Vertical Parcel Delineation</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Convert property boundaries into 3D spatial volumes with calibrated internal partitions, carpet areas, and air boundaries.
            </p>
            <span className="text-[10px] font-mono text-blue-900 font-semibold block pt-1">
              Volumetric 3D Bounding Boxes
            </span>
          </div>

          <div className="bg-white border border-slate-300 p-5 rounded space-y-3 shadow-xs">
            <div className="w-8 h-8 rounded bg-red-50 border border-red-200 flex items-center justify-center text-red-800 font-bold">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Topology Validation</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Identify overlaps, gaps, illegal cantilever encroachments, and underground utility collisions before legal record creation.
            </p>
            <span className="text-[10px] font-mono text-red-800 font-semibold block pt-1">
              7 Active 3D Geometric Rules
            </span>
          </div>
        </div>
      </section>

      {/* 8. 3D CADASTRAL VIEW SECTION: A Single Spatial View of the Urban Property Stack */}
      <section className="py-12 px-6 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider font-mono">
              UNIFIED GIS VIEWPORT
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              A Single Spatial View of the Urban Property Stack
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Inspect surface parcels, multi-storey building extrusions, vertical apartment volumes, and subterranean utility infrastructure within an integrated, coordinate-aware environment.
            </p>
          </div>

          {/* Interactive GIS Preview Component */}
          <div className="bg-slate-950 border border-slate-800 rounded shadow-2xl p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Layers Control List */}
            <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded p-4 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">
                  GIS CADASTRAL LAYERS
                </h3>
              </div>

              <div className="space-y-2.5 text-xs font-mono text-slate-300">
                <label className="flex items-center gap-2.5 cursor-pointer hover:text-white">
                  <input
                    type="checkbox"
                    checked={previewLayers.parcels}
                    onChange={e => setPreviewLayers(prev => ({ ...prev, parcels: e.target.checked }))}
                    className="rounded border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span>☑ Parcels (2D Polygons)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer hover:text-white">
                  <input
                    type="checkbox"
                    checked={previewLayers.buildings}
                    onChange={e => setPreviewLayers(prev => ({ ...prev, buildings: e.target.checked }))}
                    className="rounded border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span>☑ Buildings (LOD-2 Meshes)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer hover:text-white">
                  <input
                    type="checkbox"
                    checked={previewLayers.floors}
                    onChange={e => setPreviewLayers(prev => ({ ...prev, floors: e.target.checked }))}
                    className="rounded border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span>☑ Floors (Storey Slabs)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer hover:text-white">
                  <input
                    type="checkbox"
                    checked={previewLayers.propertyUnits}
                    onChange={e => setPreviewLayers(prev => ({ ...prev, propertyUnits: e.target.checked }))}
                    className="rounded border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span>☑ Property Units (3D Volumes)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer hover:text-white">
                  <input
                    type="checkbox"
                    checked={previewLayers.undergroundUtilities}
                    onChange={e => setPreviewLayers(prev => ({ ...prev, undergroundUtilities: e.target.checked }))}
                    className="rounded border-slate-700 text-red-500 focus:ring-0"
                  />
                  <span className="text-red-300">☑ Underground Utilities</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                <div>CRS: EPSG:4326 / WGS84</div>
                <div>Datum: Mean Sea Level</div>
                <div>Z-Range: -25m to +45m</div>
              </div>
            </div>

            {/* Center: Live 3D Schematic Simulation */}
            <div className="lg:col-span-5 bg-[#06101e] border border-slate-800 rounded p-4 flex flex-col justify-between relative overflow-hidden min-h-[280px]">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-2">
                <span>Viewport: BLD-0007 (Shikhar Heights)</span>
                <span className="text-emerald-400">● Interactive LOD-2</span>
              </div>

              {/* Graphical representation of the stack */}
              <div className="my-auto space-y-1.5 py-4 font-mono text-[11px]">
                {previewLayers.buildings && (
                  <div className="bg-slate-800/80 border border-slate-700 p-1.5 rounded text-center text-slate-300">
                    Storeys 09–14 (Residential Penthouse Stack)
                  </div>
                )}

                {previewLayers.floors && (
                  <div className="bg-blue-900 border-2 border-sky-400 p-2 rounded shadow text-center text-white font-bold animate-pulse">
                    ★ FLOOR 08 — Selected Active Level (124.20m MSL)
                  </div>
                )}

                {previewLayers.propertyUnits && (
                  <div className="grid grid-cols-3 gap-1 text-[10px] text-center">
                    <div className="bg-blue-950 border border-blue-800 p-1 rounded text-slate-400">Unit U-01</div>
                    <div className="bg-blue-950 border border-blue-800 p-1 rounded text-slate-400">Unit U-02</div>
                    <div className="bg-sky-500 text-slate-950 font-bold p-1 rounded">Unit U-03 (Active)</div>
                  </div>
                )}

                {previewLayers.parcels && (
                  <div className="border-t-2 border-sky-400 pt-1 text-center text-sky-300 font-bold text-[10px]">
                    ──────────────── Parcel P-0102 Surface Datum (0.00m) ────────────────
                  </div>
                )}

                {previewLayers.undergroundUtilities && (
                  <div className="bg-red-950/90 border border-red-600 p-1.5 rounded text-center text-red-300 text-[10px]">
                    ⚠ Subsurface Clash: UTL-023 (-8.4m Water Pipeline)
                  </div>
                )}
              </div>

              <div className="text-[10px] font-mono text-slate-500 flex justify-between">
                <span>Model: LOD-2 BIM-Assisted</span>
                <span>Coordinates: 26.8532° N, 80.9921° E</span>
              </div>
            </div>

            {/* Right Column: Selected Property Details Card */}
            <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded p-4 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">
                    SELECTED PROPERTY
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-400 font-bold">
                    VALIDATED
                  </span>
                </div>

                <div className="mt-3 space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">3D ULPIN Identifier</span>
                    <span className="font-mono font-bold text-sky-300 text-xs sm:text-sm">
                      IN-LKO-GN5-102-B07-F08-U03
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Floor Level</span>
                      <span className="font-semibold text-slate-200">Floor 08</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Elevation Bounds</span>
                      <span className="font-semibold text-slate-200">124.20–127.20m</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Carpet Area</span>
                      <span className="font-semibold text-slate-200">1,080 sq.ft</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Structure</span>
                      <span className="font-semibold text-slate-200">RCC Multi-Storey</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Action */}
              <button
                onClick={() => onEnterPortal('3d-cadastre')}
                className="w-full bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs py-2.5 rounded flex items-center justify-center gap-1.5 transition-colors shadow-xs font-sans"
              >
                <span>Open 3D Cadastral Portal →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. UNDERGROUND / VERTICAL SECTION: Beyond the Surface */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full space-y-8">
        <div className="max-w-3xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
            FULL VERTICAL STRATA
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            Beyond the Surface
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            The framework models spatial entities above, on and below the surface within a unified coordinate-aware environment.
          </p>
        </div>

        {/* Vertical Cross-Section Diagram */}
        <div className="bg-white border border-slate-300 rounded p-6 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-2 font-mono text-xs">
            {/* +40m */}
            <div className="flex items-center gap-4 bg-sky-50 border border-sky-200 p-2.5 rounded">
              <span className="font-bold text-sky-900 w-12 text-right">+40m</span>
              <div className="h-4 w-1 bg-sky-500 rounded" />
              <span className="font-semibold text-slate-900">Building Upper Storeys & Air-Rights Envelope</span>
              <span className="text-[10px] text-slate-500 ml-auto hidden sm:inline">Airport OLS Compliant</span>
            </div>

            {/* +20m */}
            <div className="flex items-center gap-4 bg-blue-50 border border-blue-200 p-2.5 rounded">
              <span className="font-bold text-blue-900 w-12 text-right">+20m</span>
              <div className="h-4 w-1 bg-blue-600 rounded" />
              <span className="font-semibold text-slate-900">Mid-Rise Commercial & Residential Floor Plates</span>
              <span className="text-[10px] text-slate-500 ml-auto hidden sm:inline">Storeys 04–08</span>
            </div>

            {/* 0m Surface */}
            <div className="flex items-center gap-4 bg-slate-800 text-white p-3 rounded font-bold">
              <span className="w-12 text-right text-sky-400">0m</span>
              <div className="h-5 w-1.5 bg-emerald-400 rounded" />
              <span>──────── Surface Land Parcel (Cadastral Boundary) ────────</span>
              <span className="text-[10px] text-emerald-300 ml-auto hidden sm:inline">Survey Datum</span>
            </div>

            {/* -5m */}
            <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 p-2.5 rounded">
              <span className="font-bold text-amber-900 w-12 text-right">-5m</span>
              <div className="h-4 w-1 bg-amber-600 rounded" />
              <span className="font-semibold text-slate-900">Subterranean Parking (Basement Levels 1 & 2)</span>
              <span className="text-[10px] text-slate-500 ml-auto hidden sm:inline">Allocated Bay P-14</span>
            </div>

            {/* -10m */}
            <div className="flex items-center gap-4 bg-red-50 border border-red-200 p-2.5 rounded">
              <span className="font-bold text-red-900 w-12 text-right">-10m</span>
              <div className="h-4 w-1 bg-red-600 rounded" />
              <span className="font-semibold text-slate-900">Water / Sewer Municipal Trunk Pipelines</span>
              <span className="text-[10px] text-red-700 font-bold ml-auto hidden sm:inline">UTL-023 Conflict Zone</span>
            </div>

            {/* -15m */}
            <div className="flex items-center gap-4 bg-slate-100 border border-slate-300 p-2.5 rounded">
              <span className="font-bold text-slate-700 w-12 text-right">-15m</span>
              <div className="h-4 w-1 bg-slate-500 rounded" />
              <span className="font-semibold text-slate-900">Deep Utility Corridor & Metro Transit Tunnel</span>
              <span className="text-[10px] text-slate-500 ml-auto hidden sm:inline">Protected Easement</span>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded p-5 space-y-3 text-xs">
            <h3 className="font-bold text-sm text-slate-900">Volumetric Cadastral Strata</h3>
            <p className="text-slate-600 leading-relaxed">
              Unlike 2D deeds that confer ambiguous rights from the center of the earth to the sky, 3D Cadastre provides explicit upper and lower bounding planes for every title.
            </p>
            <div className="pt-2 border-t border-slate-200 space-y-1.5 font-mono text-[11px] text-slate-700">
              <div className="flex justify-between">
                <span>Air Rights:</span>
                <span className="font-bold text-emerald-700">Verified</span>
              </div>
              <div className="flex justify-between">
                <span>Subsurface Depth:</span>
                <span className="font-bold text-slate-900">-25.00m</span>
              </div>
              <div className="flex justify-between">
                <span>Utility Buffering:</span>
                <span className="font-bold text-blue-900">3.0m Enforced</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. VALIDATION SECTION: Spatial Validation Before Record Creation */}
      <section id="validation" className="py-12 px-6 bg-white border-y border-slate-300">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
              STATUTORY INTEGRITY
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
              Spatial Validation Before Record Creation
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Automated 3D topology auditing verifies boundary containment, vertical continuity, and subterranean safety prior to ULPIN generation.
            </p>
          </div>

          {/* Validation Workflow Pipeline */}
          <div className="bg-slate-50 border border-slate-300 rounded p-4 overflow-x-auto font-mono text-xs text-slate-800 shadow-xs flex items-center justify-between gap-2 min-w-[700px]">
            <span className="font-bold bg-white border border-slate-300 px-2.5 py-1.5 rounded">3D Geometry</span>
            <span className="text-slate-400">→</span>
            <span className="font-bold bg-white border border-slate-300 px-2.5 py-1.5 rounded">Boundary Check</span>
            <span className="text-slate-400">→</span>
            <span className="font-bold bg-white border border-slate-300 px-2.5 py-1.5 rounded">Containment Check</span>
            <span className="text-slate-400">→</span>
            <span className="font-bold bg-white border border-slate-300 px-2.5 py-1.5 rounded">Overlap Detection</span>
            <span className="text-slate-400">→</span>
            <span className="font-bold bg-white border border-slate-300 px-2.5 py-1.5 rounded">Vertical Continuity</span>
            <span className="text-slate-400">→</span>
            <span className="font-bold bg-amber-100 border border-amber-300 text-amber-900 px-2.5 py-1.5 rounded">Officer Review</span>
            <span className="text-slate-400">→</span>
            <span className="font-bold bg-emerald-100 border border-emerald-300 text-emerald-900 px-2.5 py-1.5 rounded">Validated Record</span>
          </div>

          {/* Live Validation Result Panel + Human in the loop note */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Panel */}
            <div className="bg-white border border-slate-300 rounded p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900 text-sm font-mono">PILOT VALIDATION AUDIT RESULTS</span>
                <span className="text-[10px] font-mono text-slate-500">18 Checks Performed</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded">
                  <span>✓ Parcel boundary containment</span>
                  <span className="font-bold">PASSED</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded">
                  <span>✓ Building footprint containment</span>
                  <span className="font-bold">PASSED</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded">
                  <span>✓ Floor slab vertical continuity</span>
                  <span className="font-bold">PASSED</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-amber-50 text-amber-900 border border-amber-200 rounded">
                  <span>⚠ Subsurface utility overlap (VAL-00231)</span>
                  <span className="font-bold">VARIANCE REQUIRED</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded">
                  <span>✓ 3D spatial identity uniqueness</span>
                  <span className="font-bold">PASSED</span>
                </div>
              </div>
            </div>

            {/* Human in the loop */}
            <div className="bg-slate-50 border border-slate-300 rounded p-5 flex flex-col justify-between space-y-4 shadow-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-900" />
                  <h3 className="font-bold text-slate-900 text-sm">Human-in-the-Loop Validation</h3>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Automated systems identify spatial inconsistencies; authorized Survey Officers remain responsible for adjudicating geometric variances and granting final statutory approval.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onEnterPortal('validation')}
                  className="bg-blue-900 hover:bg-blue-950 text-white font-semibold text-xs px-4 py-2 rounded flex items-center gap-1.5 transition-colors"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Open Validation Engine</span>
                </button>
                <button
                  onClick={() => onEnterPortal('conflict-review')}
                  className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-xs px-4 py-2 rounded flex items-center gap-1.5 transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Review Conflict VAL-00231</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. ULPIN SECTION: A Unique Spatial Identity for Every Property Volume */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full space-y-8">
        <div className="max-w-3xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
            STANDARD IDENTIFIER
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            A Unique Spatial Identity for Every Property Volume
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Proposed hierarchical 3D ULPIN standard integrating administrative jurisdiction, parcel survey code, structure identifier, floor level, and individual unit volume.
          </p>
        </div>

        {/* Large ULPIN Card */}
        <div className="bg-white border-2 border-slate-300 rounded p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                PROPOSED 3D ULPIN IDENTIFIER SCHEMA
              </span>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono text-blue-900 mt-1 tracking-wider">
                IN-LKO-GN5-102-B07-F08-U03
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-900 rounded font-bold">
                Prototype ULPIN
              </span>
            </div>
          </div>

          {/* Breakdown Pipeline */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs font-mono">
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded text-center">
              <span className="text-[9px] text-slate-400 block">COUNTRY</span>
              <span className="font-bold text-slate-900 text-sm">IN</span>
              <span className="text-[9px] text-slate-500 block">India</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded text-center">
              <span className="text-[9px] text-slate-400 block">DISTRICT</span>
              <span className="font-bold text-slate-900 text-sm">LKO</span>
              <span className="text-[9px] text-slate-500 block">Lucknow</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded text-center">
              <span className="text-[9px] text-slate-400 block">ZONE</span>
              <span className="font-bold text-slate-900 text-sm">GN5</span>
              <span className="text-[9px] text-slate-500 block">Gomti Nagar 5</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded text-center">
              <span className="text-[9px] text-slate-400 block">PARCEL</span>
              <span className="font-bold text-slate-900 text-sm">102</span>
              <span className="text-[9px] text-slate-500 block">PAR-0102</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded text-center">
              <span className="text-[9px] text-slate-400 block">BUILDING</span>
              <span className="font-bold text-slate-900 text-sm">B07</span>
              <span className="text-[9px] text-slate-500 block">BLD-0007</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded text-center">
              <span className="text-[9px] text-slate-400 block">FLOOR</span>
              <span className="font-bold text-slate-900 text-sm">F08</span>
              <span className="text-[9px] text-slate-500 block">Floor 08</span>
            </div>
            <div className="bg-blue-900 text-white border border-blue-800 p-2.5 rounded text-center">
              <span className="text-[9px] text-sky-300 block">UNIT</span>
              <span className="font-bold text-white text-sm">U03</span>
              <span className="text-[9px] text-sky-200 block">Unit 3</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-900 text-white rounded p-1 flex items-center justify-center font-mono text-[10px]">
                <QrCode className="w-9 h-9 text-sky-300" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Digital Verification Hash</span>
                <span className="font-mono text-slate-500 text-[11px]">SHA-256: 7A9C2F8D40E1B5...</span>
              </div>
            </div>

            <button
              onClick={() => onEnterPortal('property-record')}
              className="bg-blue-900 hover:bg-blue-950 text-white font-semibold text-xs px-4 py-2.5 rounded flex items-center gap-2 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Sample Digital Property Record</span>
            </button>
          </div>

          {/* Mandatory Prototype Disclaimer */}
          <div className="text-[11px] text-slate-500 font-sans border-t border-slate-200 pt-3 italic">
            Identifier shown for prototype demonstration. Production deployment would follow the applicable authoritative ULPIN specification.
          </div>
        </div>
      </section>

      {/* 12. USE CASES */}
      <section className="py-12 px-6 bg-white border-y border-slate-300">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
              APPLICATIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
              Strategic Use Cases for 3D Cadastre
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-50 border border-slate-200 p-5 rounded space-y-2">
              <h3 className="font-bold text-slate-900 text-sm uppercase font-mono">
                URBAN LAND ADMINISTRATION
              </h3>
              <p className="text-slate-600 leading-relaxed">
                3D representation of complex property relationships, eliminating multi-floor ownership ambiguity in high-density developments.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 rounded space-y-2">
              <h3 className="font-bold text-slate-900 text-sm uppercase font-mono">
                INFRASTRUCTURE PLANNING
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Coordinate utilities, water mains, and underground transport assets to prevent accidental excavation strikes during construction.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 rounded space-y-2">
              <h3 className="font-bold text-slate-900 text-sm uppercase font-mono">
                PROPERTY GOVERNANCE
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Reduce legal disputes in vertical property transactions through immutable 3D bounding coordinates and cryptographic validation signatures.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 rounded space-y-2">
              <h3 className="font-bold text-slate-900 text-sm uppercase font-mono">
                URBAN DEVELOPMENT
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Support municipal master planning across surface and subsurface space with synchronized zoning envelopes and volumetric building caps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 13. FINAL CTA SECTION: Explore the 3D Cadastral Model */}
      <section id="architecture" className="py-14 px-6 max-w-7xl mx-auto w-full text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] uppercase font-bold text-blue-900 tracking-wider font-mono bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            PROTOTYPE DEMONSTRATION PLATFORM
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            Explore the 3D Cadastral Model
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Inspect parcels, vertical property units, underground assets and spatial validation through the demonstration portal.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onEnterPortal('3d-cadastre')}
            className="bg-blue-900 hover:bg-blue-950 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded flex items-center gap-2 transition-colors shadow-sm"
          >
            <span>Launch 3D Cadastral Portal →</span>
          </button>

          <button
            onClick={() => onEnterPortal('system')}
            className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-xs sm:text-sm px-6 py-3 rounded flex items-center gap-2 transition-colors shadow-xs"
          >
            <Server className="w-4 h-4 text-slate-600" />
            <span>View System Architecture</span>
          </button>

          <button
            onClick={onLaunchDemoWorkflow}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-semibold text-xs sm:text-sm px-6 py-3 rounded flex items-center gap-2 transition-colors"
          >
            <Play className="w-4 h-4 text-blue-900 fill-current" />
            <span>Execute End-to-End Workflow</span>
          </button>
        </div>
      </section>

      {/* 14. INSTITUTIONAL FOOTER */}
      <footer className="mt-auto bg-[#061224] text-slate-400 text-xs py-10 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-slate-100 font-sans">3D ULPIN</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300 font-semibold">
                DEMONSTRATION PLATFORM
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Urban Land & Property Identification
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm pt-1">
              Three-Dimensional Cadastral Mapping & Vertical Property Intelligence System.
            </p>
          </div>

          {/* Middle: Platform Links */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-300 block">
              PLATFORM WORKSPACES
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              <button onClick={() => onEnterPortal('3d-cadastre')} className="text-left hover:text-white transition-colors">
                3D Cadastre
              </button>
              <button onClick={() => onEnterPortal('parcels')} className="text-left hover:text-white transition-colors">
                Parcels
              </button>
              <button onClick={() => onEnterPortal('buildings')} className="text-left hover:text-white transition-colors">
                Buildings
              </button>
              <button onClick={() => onEnterPortal('underground')} className="text-left hover:text-white transition-colors">
                Subsurface Matrix
              </button>
              <button onClick={() => onEnterPortal('validation')} className="text-left hover:text-white transition-colors">
                Topology Validation
              </button>
              <button onClick={() => onEnterPortal('ulpin-generator')} className="text-left hover:text-white transition-colors">
                ULPIN Generator
              </button>
            </div>
          </div>

          {/* Right: Status & Telemetry */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-300 block">
              PROTOTYPE STATUS
            </span>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div>Demonstration Platform (Lucknow Zone 5)</div>
              <div className="flex items-center gap-1.5">
                <span>System Status:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Operational
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono pt-1">
                Aligned to OGC 3D Cadastre Specifications
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="max-w-7xl mx-auto pt-6 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500 font-mono">
          <span>Prototype / Demonstration Platform © 2026 3D ULPIN</span>
          <span>Lucknow Urban Pilot Demonstration Zone (Gomti Nagar, Zone 5)</span>
        </div>
      </footer>
    </div>
  );
};
