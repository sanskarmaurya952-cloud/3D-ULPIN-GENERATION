import React, { useState } from 'react';
import {
  Cpu,
  Play,
  CheckCircle2,
  Sparkles,
  Layers,
  Building,
  ArrowRight,
  Activity,
  FileCheck2,
  Maximize2
} from 'lucide-react';
import { cadastreApi } from '../api/client';
import { NavView } from '../types/cadastre';

interface AiExtractionViewProps {
  onNavigate: (view: NavView) => void;
}

export const AiExtractionView: React.FC<AiExtractionViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'footprint' | 'floors'>('footprint');
  const [isRunning, setIsRunning] = useState(false);
  const [extractionResult, setExtractionResult] = useState<any | null>(null);
  const [segmentationResult, setSegmentationResult] = useState<any | null>(null);

  const handleRunFootprint = async () => {
    setIsRunning(true);
    const res = await cadastreApi.runAiExtraction();
    setExtractionResult(res);
    setIsRunning(false);
  };

  const handleRunFloors = async () => {
    setIsRunning(true);
    const res = await cadastreApi.runFloorSegmentation('BLD-0007');
    setSegmentationResult(res);
    setIsRunning(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto overflow-y-auto h-full text-slate-800">
      {/* Header */}
      <div className="bg-white border border-slate-300 rounded p-4 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-900" />
            <span>AI-Assisted 3D Cadastral Reconstruction Engine</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Photogrammetry & LiDAR Feature Ingestion: Orthomosaic Masking → Height Estimation → Vertical Floor Slicing
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 font-semibold uppercase">
          AI Demonstration Pipeline
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-300 gap-2 text-xs font-medium select-none">
        <button
          onClick={() => setActiveTab('footprint')}
          className={`pb-2 px-3 flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === 'footprint'
              ? 'border-blue-900 text-blue-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>1. Drone Footprint & Height Extraction</span>
        </button>
        <button
          onClick={() => setActiveTab('floors')}
          className={`pb-2 px-3 flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === 'floors'
              ? 'border-blue-900 text-blue-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2. Vertical Floor Stack Segmentation</span>
        </button>
      </div>

      {/* TAB 1: Footprint & Height Extraction */}
      {activeTab === 'footprint' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-300 rounded p-5 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Drone Orthophoto / DSM Feature Pipeline</h3>
                <p className="text-slate-500 text-[11px] mt-0.5">Input: 0.1m Ground Resolution Aerial Orthomosaic (Gomti Nagar Zone 5)</p>
              </div>
              <button
                onClick={handleRunFootprint}
                disabled={isRunning}
                className="bg-blue-900 hover:bg-blue-950 text-white font-semibold py-2 px-4 rounded flex items-center gap-2 transition-colors shadow-xs"
              >
                {isRunning ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Ingestion Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Execute AI Extraction Pipeline</span>
                  </>
                )}
              </button>
            </div>

            {/* Pipeline Step Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded space-y-1">
                <span className="text-[10px] font-mono text-slate-400 font-bold">STAGE 01</span>
                <div className="font-bold text-slate-800">Drone Orthomosaic</div>
                <p className="text-[11px] text-slate-500">Bands: R-G-B-NIR (0.05m GSD)</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded space-y-1">
                <span className="text-[10px] font-mono text-slate-400 font-bold">STAGE 02</span>
                <div className="font-bold text-slate-800">Footprint Extraction</div>
                <p className="text-[11px] text-slate-500">UNet-ConvNeXt Rooftop Masking</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded space-y-1">
                <span className="text-[10px] font-mono text-slate-400 font-bold">STAGE 03</span>
                <div className="font-bold text-slate-800">Height Estimation</div>
                <p className="text-[11px] text-slate-500">LiDAR nDSM (DSM minus DTM)</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded space-y-1">
                <span className="text-[10px] font-mono text-slate-400 font-bold">STAGE 04</span>
                <div className="font-bold text-slate-800">3D Reconstruction</div>
                <p className="text-[11px] text-slate-500">LOD-2 Polyhedral Extrusion</p>
              </div>
            </div>

            {extractionResult && (
              <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-emerald-800 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Pipeline Execution Completed Successfully</span>
                  </div>
                  <div className="flex gap-4 font-mono text-xs">
                    <span>Buildings Detected: <strong className="text-slate-900">{extractionResult.buildings_detected}</strong></span>
                    <span>Average Confidence: <strong className="text-emerald-700">{extractionResult.average_confidence}%</strong></span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded divide-y divide-slate-200">
                  {extractionResult.steps.map((s: any) => (
                    <div key={s.step_number} className="p-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-900 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                          {s.step_number}
                        </span>
                        <span className="font-semibold text-slate-800">{s.step_name}</span>
                        <span className="text-slate-500 text-[11px]">— {s.description}</span>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300">
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Vertical Floor Stack Segmentation */}
      {activeTab === 'floors' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-300 rounded p-5 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Vertical Structure & Floor Slicing Engine</h3>
                <p className="text-slate-500 text-[11px] mt-0.5">Input: Building BLD-0007 Footprint, LiDAR DSM Profile, Municipal Sanction Drawings</p>
              </div>
              <button
                onClick={handleRunFloors}
                disabled={isRunning}
                className="bg-blue-900 hover:bg-blue-950 text-white font-semibold py-2 px-4 rounded flex items-center gap-2 transition-colors shadow-xs"
              >
                {isRunning ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Floor Heights...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Segment Vertical Floor Volumes</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded">
                <span className="text-[10px] text-slate-400 block uppercase">Estimated Floors</span>
                <span className="font-bold text-base text-slate-900">14 Storeys</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded">
                <span className="text-[10px] text-slate-400 block uppercase">Average Floor Height</span>
                <span className="font-bold text-base text-slate-900">3.04 m</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded">
                <span className="text-[10px] text-slate-400 block uppercase">Basements Detected</span>
                <span className="font-bold text-base text-slate-900">2 Levels</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded">
                <span className="text-[10px] text-slate-400 block uppercase">Vertical Structure</span>
                <span className="font-bold text-base text-emerald-700">Validated</span>
              </div>
            </div>

            <div className="mt-2">
              <button
                onClick={() => onNavigate('3d-cadastre')}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-medium py-2 rounded flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Segmented Slices in 3D Cadastre Viewer →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
