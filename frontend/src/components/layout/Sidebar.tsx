import React from 'react';
import {
  LayoutDashboard,
  Box,
  MapPin,
  Building,
  Layers,
  ArrowDown,
  UploadCloud,
  FileCheck2,
  ShieldAlert,
  QrCode,
  Search,
  FileText,
  Cpu,
  Server,
  Sparkles,
  Database
} from 'lucide-react';

import { NavView } from '../../types/cadastre';

export type { NavView };

interface SidebarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  unresolvedConflictsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  unresolvedConflictsCount = 1
}) => {
  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard' as NavView, label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'CADASTRAL',
      items: [
        { id: '3d-cadastre' as NavView, label: '3D Cadastre Viewer', icon: Box },
        { id: 'parcels' as NavView, label: 'Cadastral Parcels', icon: MapPin },
        { id: 'buildings' as NavView, label: '3D Buildings', icon: Building },
        { id: 'units' as NavView, label: 'Vertical Units', icon: Layers },
        { id: 'underground' as NavView, label: 'Underground Assets', icon: ArrowDown }
      ]
    },
    {
      title: 'DATA & PROCESSING',
      items: [
        { id: 'data-import' as NavView, label: 'Data Ingestion', icon: UploadCloud },
        { id: 'ai-extraction' as NavView, label: 'AI Extraction & Slices', icon: Cpu }
      ]
    },
    {
      title: 'VALIDATION',
      items: [
        { id: 'validation' as NavView, label: 'Topology Validation', icon: FileCheck2 },
        {
          id: 'conflict-review' as NavView,
          label: 'Conflict Review',
          icon: ShieldAlert,
          badge: unresolvedConflictsCount > 0 ? unresolvedConflictsCount : undefined
        }
      ]
    },
    {
      title: 'IDENTIFICATION',
      items: [
        { id: 'ulpin-generator' as NavView, label: '3D ULPIN Generator', icon: QrCode },
        { id: 'ulpin-search' as NavView, label: 'ULPIN Registry Search', icon: Search },
        { id: 'property-record' as NavView, label: 'Digital Property Record', icon: FileText }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'system' as NavView, label: 'System & Traceability', icon: Server }
      ]
    }
  ];

  return (
    <aside className="w-60 bg-[#0d1f38] text-slate-300 border-r border-slate-700/60 flex flex-col justify-between select-none text-xs flex-shrink-0">
      <div className="py-3 px-2 space-y-4 overflow-y-auto">
        {navSections.map(section => (
          <div key={section.title} className="space-y-1">
            <div className="px-2.5 text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-sans">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-colors text-left font-medium ${
                      isActive
                        ? 'bg-blue-800 text-white font-semibold shadow-xs'
                        : 'text-slate-300 hover:bg-[#172a45] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Zonal Context Footer */}
      <div className="p-3 bg-[#081426] border-t border-slate-800/80 text-[11px] text-slate-400">
        <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
          ACTIVE JURISDICTION
        </div>
        <div className="font-medium text-slate-200 mt-0.5">Lucknow Urban Zone 5</div>
        <div className="text-[10px] text-slate-400 font-mono">Gomti Nagar Pilot Cadastre</div>
      </div>
    </aside>
  );
};
