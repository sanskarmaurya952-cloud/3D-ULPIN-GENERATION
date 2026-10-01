import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { TopologyValidationResult, ValidationIssue, NavView } from '../types/cadastre';
import { cadastreApi } from '../api/client';

interface TopologyValidationViewProps {
  onOpenConflictReview: (issueId: string) => void;
  onNavigate: (view: NavView) => void;
}

export const TopologyValidationView: React.FC<TopologyValidationViewProps> = ({
  onOpenConflictReview,
  onNavigate
}) => {
  const [result, setResult] = useState<TopologyValidationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    loadValidation();
  }, []);

  const loadValidation = async () => {
    setIsRunning(true);
    const data = await cadastreApi.runValidation();
    setResult(data);
    setIsRunning(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto h-full text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-300 rounded p-4 shadow-sm">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-blue-900" />
            <span>3D Cadastral Topology Validation Engine</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated Multi-Tier Spatial Integrity Matrix (2D Boundary, 3D Envelope, Floor Stack, Subterranean Clash)
          </p>
        </div>

        <button
          onClick={loadValidation}
          disabled={isRunning}
          className="bg-blue-900 hover:bg-blue-950 text-white font-medium text-xs px-3.5 py-2 rounded flex items-center gap-2 transition-colors shadow-xs"
        >
          {isRunning ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Executing Spatial Matrix...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Re-Run Full 3D Validation</span>
            </>
          )}
        </button>
      </div>

      {/* Summary Scorecards */}
      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-300 rounded p-3.5 shadow-xs">
            <span className="text-[11px] font-medium text-slate-500">Checks Performed</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{result.checks_performed}</div>
            <span className="text-[10px] text-slate-400">7 Core Spatial Rules</span>
          </div>

          <div className="bg-white border border-slate-300 rounded p-3.5 shadow-xs">
            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Passed Checks
            </span>
            <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">{result.passed_count}</div>
            <span className="text-[10px] text-emerald-600">Spatial Topology Verified</span>
          </div>

          <div className="bg-white border border-slate-300 rounded p-3.5 shadow-xs">
            <span className="text-[11px] font-medium text-amber-600 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Warnings
            </span>
            <div className="text-2xl font-bold font-mono text-amber-700 mt-1">{result.warnings_count}</div>
            <span className="text-[10px] text-amber-600">Minor Tolerances / Cantilevers</span>
          </div>

          <div className="bg-white border border-slate-300 rounded p-3.5 shadow-xs">
            <span className="text-[11px] font-medium text-red-600 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Active Conflicts
            </span>
            <div className="text-2xl font-bold font-mono text-red-700 mt-1">{result.conflicts_count}</div>
            <span className="text-[10px] text-red-600">Officer Decision Required</span>
          </div>
        </div>
      )}

      {/* Rules Breakdown */}
      {result?.rules_summary && (
        <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden text-xs">
          <div className="p-3 bg-slate-100 border-b border-slate-200 font-semibold text-slate-800">
            3D Spatial Rules Execution Summary
          </div>
          <div className="divide-y divide-slate-200">
            {result.rules_summary.map(r => (
              <div key={r.rule_id} className="p-3.5 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {r.rule_id}
                    </span>
                    <h3 className="font-bold text-slate-900">{r.name}</h3>
                  </div>
                  <p className="text-slate-600 text-xs">{r.description}</p>
                  <span className="text-[10px] text-slate-400 font-mono block">Target: {r.target}</span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {r.status === 'PASSED' && (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-300 text-[10px]">
                      <CheckCircle2 className="w-3 h-3" />
                      PASSED
                    </span>
                  )}
                  {r.status === 'WARNING' && (
                    <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-300 text-[10px]">
                      <AlertTriangle className="w-3 h-3" />
                      WARNING
                    </span>
                  )}
                  {r.status === 'CONFLICT' && (
                    <button
                      onClick={() => onOpenConflictReview(r.linked_issue || 'VAL-00231')}
                      className="inline-flex items-center gap-1 font-bold text-red-700 bg-red-100 hover:bg-red-200 px-2.5 py-1 rounded border border-red-300 text-[10px] transition-colors"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>REVIEW CLASH</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issues Queue */}
      {result?.issues && (
        <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden text-xs">
          <div className="p-3 bg-slate-100 border-b border-slate-200 font-semibold text-slate-800">
            Detected Spatial Issues & Audit Queue
          </div>
          <div className="divide-y divide-slate-200">
            {result.issues.map(iss => (
              <div key={iss.id} className="p-3.5 flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-900">{iss.id}</span>
                    <span className="font-semibold text-slate-800">{iss.title}</span>
                  </div>
                  <p className="text-slate-600">{iss.description}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono pt-1">
                    <span>Affected: {iss.affected_entities.join(', ')}</span>
                    {iss.depth_m !== null && <span>Depth: {iss.depth_m}m</span>}
                    <span>Detected: {iss.detected_by}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                      iss.status === 'REVIEW_REQUIRED'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : iss.status === 'APPROVED_WITH_VARIANCE'
                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {iss.status}
                  </span>
                  <button
                    onClick={() => onOpenConflictReview(iss.id)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1 rounded border border-slate-300 font-medium"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
