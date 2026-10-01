import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  Shield,
  Layers,
  MapPin,
  Building,
  Box,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { cadastreApi } from '../../api/client';
import { SearchResult, UserRole } from '../../types/cadastre';

interface HeaderProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onSelectSearchResult: (result: SearchResult) => void;
  onNavigateToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onChangeRole,
  onSelectSearchResult,
  onNavigateToLanding
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await cadastreApi.search(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
      setShowDropdown(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener for search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: SearchResult) => {
    onSelectSearchResult(item);
    setShowDropdown(false);
    setSearchQuery('');
  };

  return (
    <header className="h-14 bg-cadastre-dark text-white border-b border-slate-700/60 px-4 flex items-center justify-between z-30 select-none shadow-sm">
      {/* Left: Branding & Subtitle */}
      <div
        onClick={onNavigateToLanding}
        className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
        title="Return to National Portal Landing Page"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded bg-blue-900 border border-blue-600/50 text-white font-mono font-bold text-sm shadow-inner">
          3D
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight font-sans text-slate-100">
              3D ULPIN
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-700/40 text-blue-300">
              DEMO V2.4
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium tracking-wide">
            Urban Land & Property Identification System
          </div>
        </div>
      </div>

      {/* Center: Global Search (ULPIN / Parcel / Building / Unit) */}
      <div ref={searchContainerRef} className="relative w-96 max-w-md hidden md:block">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) setShowDropdown(true);
            }}
            placeholder="Search ULPIN / Parcel / Building / Unit..."
            className="w-full bg-[#172a45] border border-slate-700 focus:border-blue-500 rounded py-1.5 pl-9 pr-4 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none transition-colors"
          />
          {isSearching && (
            <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin absolute right-3" />
          )}
        </div>

        {/* Search Results Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0f2238] border border-slate-700 rounded shadow-lg overflow-hidden z-50 text-xs">
            <div className="px-3 py-1.5 bg-[#0a192f] border-b border-slate-700/80 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Cadastral Matching Records
            </div>
            <div className="max-h-72 overflow-y-auto">
              {searchResults.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  onClick={() => handleSelect(item)}
                  className="px-3 py-2 border-b border-slate-800/60 hover:bg-blue-900/30 cursor-pointer flex items-center justify-between text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {item.category === 'ULPIN' && <Box className="w-3.5 h-3.5 text-blue-400" />}
                    {item.category === 'BUILDING' && <Building className="w-3.5 h-3.5 text-sky-400" />}
                    {item.category === 'PARCEL' && <MapPin className="w-3.5 h-3.5 text-emerald-400" />}
                    {item.category === 'UTILITY' && <Layers className="w-3.5 h-3.5 text-orange-400" />}
                    <div>
                      <div className="font-semibold text-slate-100">{item.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{item.subtitle}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: Notifications & Role Switcher */}
      <div className="flex items-center gap-3">
        {/* System Health Pulse */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-300 font-mono bg-[#172a45] px-2 py-1 rounded border border-slate-700/60">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>GIS CORE: OK</span>
        </div>

        {/* Notifications */}
        <button
          title="System Cadastral Notifications"
          className="relative p-1.5 rounded hover:bg-[#172a45] text-slate-300 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-orange-500 absolute top-1 right-1" />
        </button>

        {/* Role Selector */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 bg-[#172a45] hover:bg-[#1f385c] border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 font-medium transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>
              {currentRole === 'SURVEY_OFFICER' && 'Survey Officer'}
              {currentRole === 'ADMINISTRATOR' && 'Administrator'}
              {currentRole === 'VIEWER' && 'Cadastral Viewer'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-[#0f2238] border border-slate-700 rounded shadow-lg py-1 z-50 text-xs">
              <div className="px-3 py-1 text-[10px] text-slate-400 uppercase font-semibold">
                Select Active Role
              </div>
              <button
                onClick={() => {
                  onChangeRole('SURVEY_OFFICER');
                  setShowRoleMenu(false);
                }}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-blue-900/40 text-slate-200 ${
                  currentRole === 'SURVEY_OFFICER' ? 'bg-blue-900/60 font-semibold text-white' : ''
                }`}
              >
                <span>Survey Officer</span>
                {currentRole === 'SURVEY_OFFICER' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
              </button>
              <button
                onClick={() => {
                  onChangeRole('ADMINISTRATOR');
                  setShowRoleMenu(false);
                }}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-blue-900/40 text-slate-200 ${
                  currentRole === 'ADMINISTRATOR' ? 'bg-blue-900/60 font-semibold text-white' : ''
                }`}
              >
                <span>Administrator</span>
                {currentRole === 'ADMINISTRATOR' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
              </button>
              <button
                onClick={() => {
                  onChangeRole('VIEWER');
                  setShowRoleMenu(false);
                }}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-blue-900/40 text-slate-200 ${
                  currentRole === 'VIEWER' ? 'bg-blue-900/60 font-semibold text-white' : ''
                }`}
              >
                <span>Cadastral Viewer</span>
                {currentRole === 'VIEWER' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
