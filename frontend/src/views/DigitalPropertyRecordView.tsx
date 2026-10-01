import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
  MapPin,
  Building,
  Layers,
  CheckCircle2,
  ExternalLink,
  QrCode,
  ArrowLeft
} from 'lucide-react';
import { DigitalPropertyRecord, NavView } from '../types/cadastre';
import { cadastreApi } from '../api/client';

interface DigitalPropertyRecordViewProps {
  ulpin?: string;
  onNavigate: (view: NavView) => void;
}

export const DigitalPropertyRecordView: React.FC<DigitalPropertyRecordViewProps> = ({
  ulpin = 'IN-LKO-GN5-102-B07-F08-U03',
  onNavigate
}) => {
  const [record, setRecord] = useState<DigitalPropertyRecord | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    loadRecord();
  }, [ulpin]);

  const loadRecord = async () => {
    const data = await cadastreApi.getPropertyRecord(ulpin);
    setRecord(data);
    try {
      const qr = await QRCode.toDataURL(data.ulpin, {
        width: 140,
        margin: 1,
        color: { dark: '#0a192f', light: '#ffffff' }
      });
      setQrCodeUrl(qr);
    } catch (_) {}
  };

  const handlePrint = () => {
    window.print();
  };

  if (!record) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        Loading Digital Property Record...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto overflow-y-auto h-full text-slate-800 space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between print:hidden">
        <button
          onClick={() => onNavigate('3d-cadastre')}
          className="text-xs text-slate-600 hover:text-blue-900 flex items-center gap-1.5 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to 3D Cadastre</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="bg-blue-900 hover:bg-blue-950 text-white font-medium text-xs py-1.5 px-3 rounded flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Record / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Paper Container with Security Guilloche Watermark */}
      <div className="bg-white bg-certificate-seal border border-slate-300 rounded-sm shadow-sm p-8 space-y-6 text-xs font-sans print:border-none print:shadow-none print:p-0 relative">
        {/* Certificate Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
          <div>
            <div className="text-[10px] tracking-widest uppercase font-bold text-slate-500 font-mono">
              DIRECTORATE OF LAND RECORDS & GEOSPATIAL CADASTRE
            </div>
            <h1 className="text-xl font-extrabold text-slate-950 tracking-tight mt-1 font-sans">
              3D DIGITAL PROPERTY RECORD (3D-DPR)
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Three-Dimensional Volumetric Cadastral Title & Subsurface Relationship Certificate
            </p>
          </div>

          <div className="text-right">
            <span className="font-mono text-[10px] bg-slate-100 px-2 py-1 rounded border border-slate-300 font-semibold block text-slate-800">
              RECORD ID: {record.record_id}
            </span>
            <span className="text-[10px] text-slate-400 font-mono block mt-1">
              Issued: {record.issuing_date}
            </span>
          </div>
        </div>

        {/* Primary Identifier Box */}
        <div className="bg-slate-50 border border-slate-300 p-4 rounded-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              PROTOTYPE 3D ULPIN
            </div>
            <div className="font-mono text-base font-extrabold text-blue-950 mt-0.5 select-all">
              {record.ulpin}
            </div>
            <div className="text-[11px] text-slate-600 mt-1">
              {record.spatial_definition.building_name} — {record.spatial_definition.floor_level}, Unit {record.spatial_definition.unit_number}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {qrCodeUrl && (
              <img src={qrCodeUrl} alt="Record QR Code" className="w-20 h-20 rounded border border-slate-300 bg-white p-1" />
            )}
            <div className="text-right">
              <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px] border border-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                VALIDATED
              </span>
              <span className="text-[9px] text-slate-400 font-mono block mt-1">EPSG:4326 Datum</span>
            </div>
          </div>
        </div>

        {/* Spatial Definition Grid */}
        <div className="space-y-3">
          <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            1. Spatial Definition & Cadastral Hierarchy
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-3 rounded-sm border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Parcel Code</span>
              <span className="font-mono font-bold text-slate-900">{record.spatial_definition.parcel_id}</span>
              <span className="text-[10px] text-slate-400 block font-mono">{record.spatial_definition.parcel_survey_no}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Building ID</span>
              <span className="font-mono font-bold text-slate-900">{record.spatial_definition.building_id}</span>
              <span className="text-[10px] text-slate-500 block">{record.spatial_definition.total_floors} Storeys</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Vertical Level</span>
              <span className="font-bold text-slate-900">{record.spatial_definition.floor_level}</span>
              <span className="text-[10px] text-slate-500 block">Unit {record.spatial_definition.unit_number}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Volumetric Area</span>
              <span className="font-bold text-slate-900">{record.spatial_definition.built_up_area_sqft} sq.ft</span>
              <span className="text-[10px] text-slate-500 block">Carpet: {record.spatial_definition.carpet_area_sqft} sq.ft</span>
            </div>
          </div>
        </div>

        {/* Vertical Extent & Elevation Profile */}
        <div className="space-y-3">
          <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            2. Vertical Extent & Volumetric Bounds
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border border-slate-200 p-3 rounded-sm text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Elevation Datum</span>
              <span className="font-semibold text-slate-900">{record.spatial_definition.vertical_extent.elevation_datum}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Vertical Band (MSL)</span>
              <span className="font-mono font-bold text-blue-900">
                {record.spatial_definition.vertical_extent.z_min_msl.toFixed(2)}m – {record.spatial_definition.vertical_extent.z_max_msl.toFixed(2)}m
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Vertical Clearance</span>
              <span className="font-semibold text-slate-900">{record.spatial_definition.vertical_extent.vertical_clearance_m.toFixed(2)} m</span>
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-200 font-mono text-[10px] text-slate-600 grid grid-cols-2 gap-2">
            <div>3D Bounding Box X: [{record.spatial_definition.volumetric_bounding_box.xmin}, {record.spatial_definition.volumetric_bounding_box.xmax}]</div>
            <div>3D Bounding Box Y: [{record.spatial_definition.volumetric_bounding_box.ymin}, {record.spatial_definition.volumetric_bounding_box.ymax}]</div>
          </div>
        </div>

        {/* Subsurface & Air-Rights Relationships */}
        <div className="space-y-3">
          <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            3. Subsurface Infrastructure & Air-Rights Relationships
          </h2>
          <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-sm border border-slate-200">
            <div>
              <span className="font-semibold text-slate-900">Air-Rights Envelope:</span> {record.subsurface_and_air_rights.air_rights_envelope_status}
            </div>
            <div>
              <span className="font-semibold text-slate-900">Subsurface Easements:</span> {record.subsurface_and_air_rights.subsurface_easements}
            </div>
            <div>
              <span className="font-semibold text-slate-900">Subterranean Parking:</span> {record.subsurface_and_air_rights.parking_allocated}
            </div>
          </div>
        </div>

        {/* Validation Audit History */}
        <div className="space-y-3">
          <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            4. Cadastral Validation & Adjudication Trail
          </h2>
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-sm">
            {record.validation_history.map((vh, i) => (
              <div key={i} className="p-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="font-medium text-slate-900">{vh.stage}</span>
                  <span className="text-slate-400 font-mono text-[10px]">({vh.timestamp.split('T')[0]})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-600">{vh.officer}</span>
                  <span className="font-bold text-emerald-800 text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {vh.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Source Traceability */}
        <div className="space-y-3">
          <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            5. GIS Data Source Traceability
          </h2>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
            {record.data_sources.map((ds, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 p-2 rounded-sm">
                <strong className="text-slate-900 block">{ds.layer}</strong>
                <span>{ds.provenance} [{ds.crs}]</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="pt-4 border-t-2 border-slate-900 text-center text-[10px] text-slate-500 font-mono space-y-1">
          <p className="font-semibold text-slate-700">{record.disclaimer}</p>
          <p>Lucknow Urban Pilot Demonstration Zone (Gomti Nagar, Zone 5) — Spatial Cadastre Engine v2.4</p>
        </div>
      </div>
    </div>
  );
};
