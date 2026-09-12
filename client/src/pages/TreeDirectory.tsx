import React, { useState } from 'react';
import {
  Search,
  Filter,
  Camera,
  Eye,
  QrCode,
  Sprout,
  CheckCircle,
  AlertTriangle,
  Clock,
  Layers,
} from 'lucide-react';
import { Tree, Project } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { EvidenceBadge } from '../components/common/EvidenceBadge';

interface TreeDirectoryProps {
  trees: Tree[];
  projects: Project[];
  onSelectTree: (tree: Tree) => void;
  onVerifyTree: (tree: Tree) => void;
  onPlantTreeClick: () => void;
}

export const TreeDirectory: React.FC<TreeDirectoryProps> = ({
  trees,
  projects,
  onSelectTree,
  onVerifyTree,
  onPlantTreeClick,
}) => {
  const [search, setSearch] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedHealth, setSelectedHealth] = useState('');

  const filtered = trees.filter((tree) => {
    if (selectedProjectId && tree.projectId !== selectedProjectId) return false;
    if (selectedStatus && tree.status !== selectedStatus) return false;
    if (selectedHealth && tree.currentHealth !== selectedHealth) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        tree.treeCode.toLowerCase().includes(q) ||
        tree.species.toLowerCase().includes(q) ||
        tree.commonName.toLowerCase().includes(q) ||
        tree.planterName.toLowerCase().includes(q) ||
        tree.projectName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-stone-200 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>Digital Tree Registry</span>
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Geotagged Tree Directory
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Every planted tree receives a unique ID, precise GPS geofence, and photographic timeline
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {trees.length > 0 && (
            <button
              onClick={() => onVerifyTree(filtered[0] || trees[0])}
              className="px-3.5 py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300/80 text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              title="Photograph and verify tree health"
            >
              <Camera className="w-4 h-4 text-emerald-700" />
              <span>Camera Verify</span>
            </button>
          )}
          <button
            onClick={onPlantTreeClick}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Sprout className="w-4 h-4" />
            <span>+ Plant / Register Tree</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-stone-200 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by Tree ID, species, planter, or project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="text-xs p-2 border border-stone-300 rounded-xl bg-white"
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs p-2 border border-stone-300 rounded-xl bg-white"
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

            <select
              value={selectedHealth}
              onChange={(e) => setSelectedHealth(e.target.value)}
              className="text-xs p-2 border border-stone-300 rounded-xl bg-white"
            >
              <option value="">All Health</option>
              <option value="Healthy">Healthy</option>
              <option value="Moderate Stress">Moderate Stress</option>
              <option value="Poor Health">Poor Health</option>
              <option value="Dead / Missing">Dead / Missing</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-semibold text-stone-500 flex justify-between items-center pt-1 border-t border-stone-100">
          <span>Found {filtered.length} matching trees</span>
          {(search || selectedProjectId || selectedStatus || selectedHealth) && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedProjectId('');
                setSelectedStatus('');
                setSelectedHealth('');
              }}
              className="text-emerald-700 hover:underline text-[11px]"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Trees Directory List / Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((tree) => (
          <div
            key={tree.id}
            className="bg-white rounded-3xl p-4 border border-stone-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 border border-stone-100 mb-3">
                <img
                  src={tree.latestPhotoUrl || tree.baselinePhotoUrl}
                  alt={tree.treeCode}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  <EvidenceBadge quality={tree.evidenceQuality} showIcon={false} />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                  Age: {tree.ageMonths} mos
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-xs font-bold text-emerald-800 tracking-tight">
                    {tree.treeCode}
                  </span>
                  <StatusBadge status={tree.status} size="sm" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 leading-tight">
                  {tree.species}{' '}
                  <span className="text-[11px] font-normal text-stone-500">
                    ({tree.commonName})
                  </span>
                </h3>
                <p className="text-[11px] text-stone-500 truncate">{tree.projectName}</p>
                <p className="text-[10.5px] text-stone-400 font-mono">
                  📍 {tree.latitude.toFixed(4)}°, {tree.longitude.toFixed(4)}° (±{tree.gpsAccuracyMeters}m)
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-3 mt-3 border-t border-stone-100">
              <button
                onClick={() => onSelectTree(tree)}
                className="flex-1 py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-all"
              >
                Profile & QR
              </button>
              <button
                onClick={() => onVerifyTree(tree)}
                className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 shadow-2xs transition-all"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Verify</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
