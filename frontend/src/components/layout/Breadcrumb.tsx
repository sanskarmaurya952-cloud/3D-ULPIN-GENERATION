import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { NavView } from './Sidebar';

interface BreadcrumbProps {
  currentView: NavView;
  selectedParcelId?: string | null;
  selectedBuildingId?: string | null;
  selectedFloorNumber?: number | null;
  selectedUnitId?: string | null;
  onNavigate: (view: NavView) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  currentView,
  selectedParcelId,
  selectedBuildingId,
  selectedFloorNumber,
  selectedUnitId,
  onNavigate
}) => {
  const getViewTitle = (view: NavView) => {
    switch (view) {
      case 'dashboard': return 'Dashboard';
      case '3d-cadastre': return '3D Cadastre';
      case 'parcels': return 'Parcels Registry';
      case 'buildings': return '3D Buildings';
      case 'units': return 'Vertical Property Units';
      case 'underground': return 'Underground Assets';
      case 'data-import': return 'Data Ingestion';
      case 'ai-extraction': return 'AI Extraction & Segmentation';
      case 'validation': return 'Topology Validation';
      case 'conflict-review': return 'Conflict Review (VAL-00231)';
      case 'ulpin-generator': return '3D ULPIN Generator';
      case 'ulpin-search': return 'ULPIN Search Registry';
      case 'property-record': return 'Digital Property Record';
      case 'system': return 'System Status';
      default: return 'Cadastre';
    }
  };

  return (
    <nav className="h-8 bg-slate-100 border-b border-slate-200 px-4 flex items-center gap-1.5 text-xs text-slate-600 select-none">
      <button
        onClick={() => onNavigate('dashboard')}
        className="hover:text-blue-900 flex items-center gap-1 transition-colors font-medium"
      >
        <Home className="w-3.5 h-3.5 text-slate-500" />
        <span>Dashboard</span>
      </button>

      {currentView !== 'dashboard' && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <button
            onClick={() => onNavigate(currentView)}
            className={`transition-colors font-medium ${
              !selectedParcelId && !selectedBuildingId ? 'text-slate-900 font-semibold' : 'hover:text-blue-900'
            }`}
          >
            {getViewTitle(currentView)}
          </button>
        </>
      )}

      {selectedParcelId && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="font-mono text-slate-700">Parcel {selectedParcelId.replace('PAR-', 'P-')}</span>
        </>
      )}

      {selectedBuildingId && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="font-mono text-slate-700">Building {selectedBuildingId}</span>
        </>
      )}

      {selectedFloorNumber !== null && selectedFloorNumber !== undefined && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="font-mono text-slate-700">
            {selectedFloorNumber < 0
              ? `Basement ${Math.abs(selectedFloorNumber)}`
              : selectedFloorNumber === 0
              ? 'Ground'
              : `Floor ${selectedFloorNumber < 10 ? '0' + selectedFloorNumber : selectedFloorNumber}`}
          </span>
        </>
      )}

      {selectedUnitId && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="font-mono font-bold text-blue-900">Unit {selectedUnitId}</span>
        </>
      )}
    </nav>
  );
};
