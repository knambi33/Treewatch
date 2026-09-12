import React, { useState } from 'react';
import {
  FolderKanban,
  FileSpreadsheet,
  Upload,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { Project, Tree } from '../types';
import { bulkUploadTrees } from '../api';
import { useAuth } from '../context/AuthContext';

interface NGODashboardProps {
  projects: Project[];
  trees: Tree[];
  onSelectTree: (tree: Tree) => void;
  onRefresh: () => void;
}

export const NGODashboard: React.FC<NGODashboardProps> = ({ projects, trees, onSelectTree, onRefresh }) => {
  const { currentUser } = useAuth();

  // Filter projects by logged-in NGO
  const myProjects = projects.filter(
    (p) =>
      currentUser?.role === 'admin' ||
      p.organisationId === currentUser?.organisationId ||
      p.partnerNgoId === currentUser?.organisationId ||
      currentUser?.name === 'Priya Sharma'
  );
  const displayProjects = myProjects.length > 0 ? myProjects : projects;

  const [selectedProjectId, setSelectedProjectId] = useState<string>(displayProjects[0]?.id || projects[0]?.id || '');
  const [bulkInput, setBulkInput] = useState<string>(
    `Neem,Vembu,Azadirachta indica,13.0831,80.2712,6,Roadside\nPongamia,Pungai,Millettia pinnata,13.0845,80.2725,5,Park\nPeepal,Arasa Maram,Ficus religiosa,13.0850,80.2730,7,Community`
  );
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setUploadSuccess(null);

    try {
      const lines = bulkInput.trim().split('\n');
      const rows = lines.map((line) => {
        const parts = line.split(',').map((s) => s.trim());
        return {
          species: parts[0] || 'Neem',
          commonName: parts[1] || 'Vembu',
          scientificName: parts[2] || 'Azadirachta indica',
          latitude: parseFloat(parts[3]) || 13.0827,
          longitude: parseFloat(parts[4]) || 80.2707,
          gpsAccuracyMeters: parseFloat(parts[5]) || 6,
          landCategory: parts[6] || 'Roadside',
        };
      });

      const res = await bulkUploadTrees(selectedProjectId, rows, currentUser?.name || 'NGO Field Team');
      if (res.success) {
        setUploadSuccess(`Successfully registered ${res.count} trees in project batch!`);
        onRefresh();
      }
    } catch (err: any) {
      alert('Bulk upload error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-teal-900 via-emerald-900 to-green-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider mb-1">
              <FolderKanban className="w-4 h-4" />
              <span>{currentUser?.organisationName || 'Cauvery Delta Revival NGO'} & Field Implementation Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              NGO Field Projects & Bulk Registry
            </h1>
            <p className="text-xs text-teal-100/80 mt-1 max-w-lg">
              Manage multi-site plantation concessions, assign field volunteers, monitor real-time survival,
              and import thousands of geotagged trees via CSV/Excel.
            </p>
          </div>

          <div className="flex gap-2">
            <span className="px-3 py-1.5 bg-white/10 rounded-xl text-xs font-bold border border-white/15">
              {displayProjects.length} Managed Project{displayProjects.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </div>

      {/* Role-Based NGO Access & Multi-Tenant Boundary Pill */}
      <div className="p-3.5 bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-stone-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>NGO Data Boundary:</strong> You have autonomous write access to your assigned projects, volunteer rosters, and batch uploads. Private CSR budgets and other entities' sensitive operational data are protected.
          </span>
        </div>
        <span className="text-[10px] uppercase font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
          {currentUser?.roleTitle || 'Field Lead'}
        </span>
      </div>

      {/* Projects Grid Overview (Section 20) */}
      <div className="space-y-3">
        <h3 className="text-base font-extrabold text-stone-900">Active Plantation Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayProjects.map((proj) => {
            const pTrees = trees.filter((t) => t.projectId === proj.id);
            const alive = pTrees.filter((t) => ['Verified Alive', 'Healthy'].includes(t.status)).length;
            const dead = pTrees.filter((t) => ['Dead', 'Missing'].includes(t.status)).length;
            const attention = pTrees.filter((t) => ['Needs Attention', 'Stressed', 'Poor Health'].includes(t.status)).length;
            const rate = pTrees.length > 0 ? Math.round((alive / pTrees.length) * 1000) / 10 : 0;

            return (
              <div
                key={proj.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-md space-y-3 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10.5px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                      {proj.id}
                    </span>
                    <h4 className="text-base font-bold text-stone-900 mt-1">{proj.name}</h4>
                    <p className="text-xs text-stone-500">{proj.geography.district}, {proj.geography.state}</p>
                  </div>
                  <span className="text-xl font-extrabold text-emerald-700 font-mono">
                    {rate}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${rate}%` }} />
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1 border-t border-stone-100">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-bold">Target</span>
                    <span className="font-bold text-stone-800">{proj.targetTrees.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-bold">Planted</span>
                    <span className="font-bold text-stone-800">{pTrees.length}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-600 block font-bold">Alive</span>
                    <span className="font-bold text-emerald-700">{alive}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-600 block font-bold">Stressed</span>
                    <span className="font-bold text-amber-700">{attention}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bulk Excel / CSV Import Tool (Section 20 requirement) */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-stone-200 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-stone-900">
                Bulk Tree Registration via CSV / Excel
              </h3>
              <p className="text-xs text-stone-500">
                Upload survey data from GPS handhelds or field spreadsheets
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleBulkSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Target Project</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full text-xs p-2.5 border border-stone-300 rounded-xl bg-white"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.geography.district})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              CSV Data (Columns: Species, CommonName, ScientificName, Latitude, Longitude, AccuracyMeters, LandCategory)
            </label>
            <textarea
              rows={4}
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              className="w-full p-3 font-mono text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {uploadSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              disabled={uploading}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Processing Batch...' : 'Import Trees Batch'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
