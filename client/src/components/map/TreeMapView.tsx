import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Tree, Project, Organisation } from '../../types';
import { Filter, MapPin, Eye, Camera, CheckCircle, AlertTriangle, ShieldCheck, X } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { EvidenceBadge } from '../common/EvidenceBadge';

interface TreeMapViewProps {
  trees: Tree[];
  projects: Project[];
  organisations: Organisation[];
  onSelectTree: (tree: Tree) => void;
  onVerifyTree?: (tree: Tree) => void;
  selectedTreeId?: string;
}

export const TreeMapView: React.FC<TreeMapViewProps> = ({
  trees,
  projects,
  organisations,
  onSelectTree,
  onVerifyTree,
  selectedTreeId,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const circleRef = useRef<L.Circle | null>(null);

  // Filters state
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedSpecies, setSelectedSpecies] = useState<string>('');
  const [selectedHealth, setSelectedHealth] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Selected tree drawer modal
  const [activeTree, setActiveTree] = useState<Tree | null>(null);

  // Filter trees
  const filteredTrees = trees.filter((tree) => {
    if (selectedOrgId && tree.organisationId !== selectedOrgId) return false;
    if (selectedProjectId && tree.projectId !== selectedProjectId) return false;
    if (selectedSpecies && tree.species.toLowerCase() !== selectedSpecies.toLowerCase()) return false;
    if (selectedHealth && tree.currentHealth !== selectedHealth) return false;
    if (selectedStatus && tree.status !== selectedStatus) return false;
    return true;
  });

  // Unique species list for filter dropdown
  const uniqueSpecies = Array.from(new Set(trees.map((t) => t.species))).sort();

  // Helper to get marker color
  const getMarkerColor = (tree: Tree): string => {
    switch (tree.status) {
      case 'Verified Alive':
      case 'Healthy':
        return '#16a34a'; // Emerald green
      case 'Needs Attention':
      case 'Stressed':
        return '#eab308'; // Amber yellow
      case 'Poor Health':
        return '#ea580c'; // Orange
      case 'Dead':
      case 'Missing':
        return '#e11d48'; // Rose red
      case 'Verification Pending':
        return '#3b82f6'; // Blue
      case 'Verification Exception':
        return '#9333ea'; // Purple
      default:
        return '#15803d';
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center around Tamil Nadu / South India by default
      const defaultCenter: [number, number] = [12.5, 78.8];
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 7,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | TreeWatch Geotag Registry',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Keep map alive during tab transitions
    };
  }, []);

  // Update Markers when filteredTrees change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (circleRef.current) {
      circleRef.current.remove();
      circleRef.current = null;
    }

    const bounds = L.latLngBounds([]);

    filteredTrees.forEach((tree) => {
      if (!tree.latitude || !tree.longitude) return;

      const color = getMarkerColor(tree);
      const isSelected = tree.id === selectedTreeId || tree.id === activeTree?.id;

      // Custom SVG div icon
      const customIcon = L.divIcon({
        className: 'custom-tree-pin',
        html: `
          <div style="
            width: ${isSelected ? '32px' : '24px'};
            height: ${isSelected ? '32px' : '24px'};
            background-color: ${color};
            border: 2px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: ${isSelected ? '14px' : '10px'};
            transition: all 0.2s ease;
          ">
            🌱
          </div>
        `,
        iconSize: [isSelected ? 32 : 24, isSelected ? 32 : 24],
        iconAnchor: [isSelected ? 16 : 12, isSelected ? 16 : 12],
      });

      const marker = L.marker([tree.latitude, tree.longitude], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setActiveTree(tree);
        // Draw GPS tolerance circle (e.g. 25m)
        if (circleRef.current) circleRef.current.remove();
        circleRef.current = L.circle([tree.latitude, tree.longitude], {
          radius: 25, // 25 meters tolerance zone
          color: '#16a34a',
          fillColor: '#86efac',
          fillOpacity: 0.3,
          weight: 1.5,
          dashArray: '4, 4',
        }).addTo(map);

        map.setView([tree.latitude, tree.longitude], Math.max(map.getZoom(), 16), { animate: true });
      });

      markersRef.current.push(marker);
      bounds.extend([tree.latitude, tree.longitude]);
    });

    if (filteredTrees.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [filteredTrees, selectedTreeId]);

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[550px] rounded-3xl overflow-hidden shadow-md border border-stone-200">
      {/* Top Filter Bar Over Map */}
      <div className="absolute top-3 inset-x-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-3.5 py-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-md border border-stone-200 text-xs font-bold text-stone-800 flex items-center gap-1.5 hover:bg-white transition-all"
          >
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>Map Filters ({filteredTrees.length} trees)</span>
          </button>

          {/* Quick Legend Indicators */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-2xl shadow-md border border-stone-200 text-[11px] font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Healthy
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Needs Attention
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" /> Dead / Missing
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Verification Due
            </span>
          </div>
        </div>

        {/* Reset Filter Button */}
        {(selectedOrgId || selectedProjectId || selectedSpecies || selectedHealth || selectedStatus) && (
          <button
            onClick={() => {
              setSelectedOrgId('');
              setSelectedProjectId('');
              setSelectedSpecies('');
              setSelectedHealth('');
              setSelectedStatus('');
            }}
            className="pointer-events-auto px-3 py-1.5 bg-stone-900 text-white rounded-xl text-xs font-semibold shadow-md hover:bg-black transition-all flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Expanded Filters Drawer */}
      {showFilters && (
        <div className="absolute top-14 left-3 z-[1000] bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-stone-200 w-80 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <span className="text-xs font-bold text-stone-900">Geospatial Filters</span>
            <button onClick={() => setShowFilters(false)} className="text-stone-400 hover:text-stone-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-stone-600 block mb-1">Project</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full text-xs p-2 border border-stone-200 rounded-xl bg-white"
            >
              <option value="">All Projects ({projects.length})</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.geography.district})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-stone-600 block mb-1">Species</label>
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="w-full text-xs p-2 border border-stone-200 rounded-xl bg-white"
            >
              <option value="">All Species ({uniqueSpecies.length})</option>
              {uniqueSpecies.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-stone-600 block mb-1">Tree Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs p-2 border border-stone-200 rounded-xl bg-white"
            >
              <option value="">All Statuses</option>
              <option value="Verified Alive">Verified Alive</option>
              <option value="Needs Attention">Needs Attention</option>
              <option value="Poor Health">Poor Health</option>
              <option value="Dead">Dead</option>
              <option value="Missing">Missing</option>
              <option value="Verification Pending">Verification Pending</option>
              <option value="Verification Exception">Verification Exception</option>
            </select>
          </div>
        </div>
      )}

      {/* Leaflet Map DOM Node */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Selected Tree Details Drawer / Card */}
      {activeTree && (
        <div className="absolute bottom-4 inset-x-4 sm:left-auto sm:right-4 sm:w-96 z-[1000] bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-stone-200 animate-fadeIn">
          <div className="flex items-start justify-between gap-2 pb-2">
            <div>
              <div className="font-mono text-xs font-bold text-emerald-800 tracking-wide">
                {activeTree.treeCode}
              </div>
              <h4 className="text-base font-bold text-stone-900 leading-tight mt-0.5">
                {activeTree.species} <span className="text-xs font-normal text-stone-500">({activeTree.commonName})</span>
              </h4>
            </div>
            <button
              onClick={() => {
                setActiveTree(null);
                if (circleRef.current) circleRef.current.remove();
              }}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Photo & Health Overview */}
          <div className="flex gap-3 my-3">
            <img
              src={activeTree.latestPhotoUrl || activeTree.baselinePhotoUrl}
              alt={activeTree.treeCode}
              className="w-24 h-24 object-cover rounded-2xl border border-stone-200 shrink-0"
            />
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex flex-wrap gap-1">
                <StatusBadge status={activeTree.status} size="sm" />
                <EvidenceBadge quality={activeTree.evidenceQuality} showIcon={false} />
              </div>
              <p className="text-[11px]">
                <strong className="text-stone-800">Planted:</strong> {activeTree.plantedDate} (Age: {activeTree.ageMonths} mos)
              </p>
              <p className="text-[11px]">
                <strong className="text-stone-800">GPS Coords:</strong> {activeTree.latitude.toFixed(4)}°, {activeTree.longitude.toFixed(4)}° (±{activeTree.gpsAccuracyMeters}m)
              </p>
              <p className="text-[11px] text-emerald-700 font-medium">
                🎯 25m verification tolerance radius shown
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1 border-t border-stone-100">
            <button
              onClick={() => onSelectTree(activeTree)}
              className="flex-1 py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Full Profile</span>
            </button>

            {onVerifyTree && (
              <button
                onClick={() => onVerifyTree(activeTree)}
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Verify Tree</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
