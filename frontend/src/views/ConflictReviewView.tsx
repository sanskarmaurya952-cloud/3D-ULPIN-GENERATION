import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileEdit,
  ArrowRight,
  Layers,
  MapPin,
  Building,
  Box,
  FileText
} from 'lucide-react';
import { ValidationIssue, NavView, UserRole } from '../types/cadastre';
import { cadastreApi } from '../api/client';

interface ConflictReviewViewProps {
  issueId?: string;
  currentRole: UserRole;
  onNavigate: (view: NavView) => void;
  onViewDigitalRecord: (ulpin: string) => void;
}

export const ConflictReviewView: React.FC<ConflictReviewViewProps> = ({
  issueId = 'VAL-00231',
  currentRole,
  onNavigate,
  onViewDigitalRecord
}) => {
  const [issue, setIssue] = useState<ValidationIssue | null>(null);
  const [officerName, setOfficerName] = useState('Senior Cadastral Officer R. K. Sharma');
  const [comments, setComments] = useState(
    'Permissible utility easement corridor registered under Lucknow Municipal Subsurface Utility Regulation 2024 Section 12(b). Foundation sleeve clearance verified.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadIssue();
  }, [issueId]);

  const loadIssue = async () => {
    const issues = await cadastreApi.getValidationIssues();
    const found = issues.find(i => i.id === issueId) || issues[0];
    setIssue(found);
  };

  const handleDecision = async (decision: 'APPROVED' | 'MODIFIED' | 'REJECTED') => {
    setIsSubmitting(true);
    await cadastreApi.submitOfficerDecision(
      issue?.id || 'VAL-00231',
      decision,
      officerName,
      comments
    );
    setSuccessMessage(`Officer Decision '${decision}' recorded in cadastral audit log.`);
    setIsSubmitting(false);
    loadIssue();
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto overflow-y-auto h-full text-slate-800">
      {/* Header */}
      <div className="bg-white border border-slate-300 rounded p-4 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-700" />
            <span>Subterranean Topology Conflict Review — Issue {issue?.id || 'VAL-00231'}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Spatial Adjudication Workflow: Automated AI/GIS engine flags clash → Human Cadastral Officer validates.
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-red-900 border border-red-300 font-bold uppercase">
          Review Required
        </span>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-300 rounded p-3 text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => onViewDigitalRecord('IN-LKO-GN5-102-B07-F08-U03')}
            className="font-semibold text-emerald-800 underline hover:text-emerald-950"
          >
            Open Digital Property Record →
          </button>
        </div>
      )}

      {/* Main Grid: 3D Conflict Geometry Representation & Officer Decision Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Spatial Clash Anatomy */}
        <div className="bg-white border border-slate-300 rounded p-5 shadow-sm space-y-4 text-xs">
          <div className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
            <span>Spatial Clash Geometry Profile</span>
            <span className="text-[10px] font-mono text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded font-bold">
              CLASH AT -8.20m
            </span>
          </div>

          <div className="bg-slate-900 rounded p-4 text-white relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
            {/* Visual Clash Schematic */}
            <div className="relative z-10 w-full max-w-xs flex flex-col items-center gap-2">
              <div className="w-full bg-blue-900/60 border border-blue-400 p-2 rounded text-center">
                <span className="text-[10px] text-blue-200 block font-mono">Building BLD-0007 (Parcel P-0102)</span>
                <span className="font-bold text-xs">Basement-2 Subsurface Slab (-6.4m to -9.6m)</span>
              </div>

              <div className="w-full py-1 flex items-center justify-center">
                <div className="bg-red-600 text-white font-bold text-[10px] px-3 py-1 rounded-full animate-pulse border border-red-400 flex items-center gap-1 shadow-lg">
                  <ShieldAlert className="w-3 h-3" />
                  <span>3D Volumetric Intersection Detected (Depth: -8.20m)</span>
                </div>
              </div>

              <div className="w-full bg-orange-900/60 border border-orange-400 p-2 rounded text-center">
                <span className="text-[10px] text-orange-200 block font-mono">Underground Utility Network</span>
                <span className="font-bold text-xs">Water Pipeline UTL-023 (600mm Ductile Iron)</span>
              </div>
            </div>
          </div>

          {/* Conflict Parameters */}
          <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-2">
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500 font-medium">Issue ID</span>
              <span className="font-mono font-bold text-slate-900">{issue?.id || 'VAL-00231'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500 font-medium">Rule Type</span>
              <span className="font-mono text-slate-800">{issue?.rule_type || 'SUBTERRANEAN_CLASH'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500 font-medium">Affected Assets</span>
              <span className="font-mono text-slate-900">BLD-0007, F08-U03, UTL-023</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500 font-medium">Interference Depth</span>
              <span className="font-mono font-bold text-red-700">-8.20 m</span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span className="text-slate-500 font-medium">Detected By</span>
              <span className="text-slate-700 font-mono">3D Topology Engine v2.4</span>
            </div>
          </div>
        </div>

        {/* Right Column: Officer Adjudication Decision */}
        <div className="bg-white border border-slate-300 rounded p-5 shadow-sm space-y-4 text-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
              <span>Cadastral Officer Decision</span>
              <span className="text-[10px] text-slate-500">Statutory Land Authority</span>
            </div>

            {/* Officer Name */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Reviewing Officer</label>
              <input
                type="text"
                value={officerName}
                onChange={e => setOfficerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-blue-800 font-medium"
              />
            </div>

            {/* Findings / Comments */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Audit Justification & Statutory Remarks</label>
              <textarea
                rows={4}
                value={comments}
                onChange={e => setComments(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-blue-800"
                placeholder="Enter variance reason, easement reference, or boundary modification..."
              />
            </div>

            {issue?.officer_decision && (
              <div className="bg-blue-50 border border-blue-200 rounded p-2.5 text-blue-950 text-[11px] space-y-1">
                <span className="font-bold block">Current Decision on Record:</span>
                <div>Decision: <strong className="font-mono">{issue.officer_decision.decision}</strong></div>
                <div>Officer: {issue.officer_decision.officer_name}</div>
                <div>Recorded: {issue.officer_decision.timestamp}</div>
              </div>
            )}
          </div>

          {/* Action Decision Buttons */}
          <div className="space-y-2 pt-4 border-t border-slate-200">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Execute Institutional Adjudication:
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleDecision('APPROVED')}
                disabled={isSubmitting}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-medium py-2 px-2 rounded flex items-center justify-center gap-1 transition-colors text-xs shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve Variance</span>
              </button>

              <button
                onClick={() => handleDecision('MODIFIED')}
                disabled={isSubmitting}
                className="bg-blue-800 hover:bg-blue-900 text-white font-medium py-2 px-2 rounded flex items-center justify-center gap-1 transition-colors text-xs shadow-xs"
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Modify Bounds</span>
              </button>

              <button
                onClick={() => handleDecision('REJECTED')}
                disabled={isSubmitting}
                className="bg-red-800 hover:bg-red-900 text-white font-medium py-2 px-2 rounded flex items-center justify-center gap-1 transition-colors text-xs shadow-xs"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject Record</span>
              </button>
            </div>

            <button
              onClick={() => onNavigate('3d-cadastre')}
              className="w-full mt-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 rounded border border-slate-300 font-medium text-xs transition-colors"
            >
              Return to 3D Cadastre View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
