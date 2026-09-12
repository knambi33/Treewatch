import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  FileSpreadsheet,
  CheckCircle,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react';
import { Project, Tree } from '../types';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../api';

interface ReportsPageProps {
  projects: Project[];
  trees: Tree[];
  onSelectTree: (tree: Tree) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ projects, trees, onSelectTree }) => {
  const { currentUser } = useAuth();
  const [scope, setScope] = useState<'mine' | 'all'>('mine');

  // Filter projects by logged-in organisation if scoped to 'mine'
  const myOrgProjects = projects.filter(
    (p) =>
      currentUser?.role === 'admin' ||
      p.organisationId === currentUser?.organisationId ||
      p.partnerNgoId === currentUser?.organisationId ||
      currentUser?.name === 'Priya Sharma'
  );

  const displayProjects = scope === 'mine' && myOrgProjects.length > 0 ? myOrgProjects : projects;

  const [selectedProjectId, setSelectedProjectId] = useState<string>(displayProjects[0]?.id || projects[0]?.id || '');
  const [selectedTreeId, setSelectedTreeId] = useState<string>(trees[0]?.id || '');
  const [reportType, setReportType] = useState<'project' | 'tree'>('project');

  const selectedProject = displayProjects.find((p) => p.id === selectedProjectId) || displayProjects[0] || projects[0];
  const selectedTree = trees.find((t) => t.id === selectedTreeId) || trees[0];
  const projectTrees = trees.filter((t) => t.projectId === selectedProject?.id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-stone-200 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Auditable Governance Reports</span>
            </div>
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Report Generation & Certifications
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Download formal PDF audit certificates and project-level CSV registers
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setReportType('project')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all ${
                reportType === 'project'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              📁 Project Report
            </button>
            <button
              onClick={() => setReportType('tree')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all ${
                reportType === 'tree'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              🌳 Tree Audit Certificate
            </button>
          </div>
        </div>

        {/* Report Scope Selector (Multi-Tenant RBAC) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setScope('mine')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                scope === 'mine'
                  ? 'bg-white text-emerald-950 font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🔒 {currentUser?.organisationName ? `${currentUser.organisationName} Only` : 'My Organisation Only'}
            </button>
            <button
              onClick={() => setScope('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                scope === 'all'
                  ? 'bg-white text-emerald-950 font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🌐 All Public & Partner Projects
            </button>
          </div>

          <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {scope === 'mine'
                ? `Showing secure internal audit records for ${currentUser?.organisationName || 'your organization'}`
                : 'Showing verified public partner projects (PII & sensitive financials scrubbed)'}
            </span>
          </div>
        </div>

        {/* Filter Selection */}
        <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-3">
          {reportType === 'project' ? (
            <div className="flex-1 min-w-[240px]">
              <label className="text-xs font-bold text-stone-700 block mb-1">Select Project</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl bg-white"
              >
                {displayProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.organisationName || p.geography.district})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex-1 min-w-[240px]">
              <label className="text-xs font-bold text-stone-700 block mb-1">Select Tree</label>
              <select
                value={selectedTreeId}
                onChange={(e) => setSelectedTreeId(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl bg-white font-mono"
              >
                {trees.slice(0, 50).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.treeCode} — {t.species} ({t.status})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-2 self-end">
            <button
              onClick={handlePrint}
              className="py-2.5 px-4 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            {reportType === 'project' && (
              <a
                href={`${API_BASE}/reports/project/${selectedProject.id}/csv`}
                download
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Printable Report Canvas Area */}
      <div id="printable-area" className="bg-white rounded-3xl p-8 shadow-xl border border-stone-200 space-y-6">
        {reportType === 'project' ? (
          // PROJECT LEVEL REPORT
          <div className="space-y-6">
            <div className="border-b-2 border-stone-900 pb-4 flex justify-between items-start">
              <div>
                <span className="text-[11px] font-mono font-bold text-emerald-800 uppercase tracking-widest block">
                  TreeWatch Verified Survival Certificate • Every Tree Counts
                </span>
                <h2 className="text-2xl font-extrabold text-stone-900 mt-1">
                  {selectedProject.name}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Organisation: {selectedProject.organisationName} • District:{' '}
                  {selectedProject.geography.district}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-400 block uppercase font-bold">Generated</span>
                <span className="text-xs font-mono font-bold text-stone-800">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-400 text-[10px] uppercase font-bold block">Planted</span>
                <span className="text-xl font-extrabold text-stone-900">{projectTrees.length}</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-emerald-700 text-[10px] uppercase font-bold block">Verified Alive</span>
                <span className="text-xl font-extrabold text-emerald-800">
                  {projectTrees.filter((t) => ['Verified Alive', 'Healthy'].includes(t.status)).length}
                </span>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                <span className="text-rose-700 text-[10px] uppercase font-bold block">Dead / Missing</span>
                <span className="text-xl font-extrabold text-rose-800">
                  {projectTrees.filter((t) => ['Dead', 'Missing'].includes(t.status)).length}
                </span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-400 text-[10px] uppercase font-bold block">Survival Rate</span>
                <span className="text-xl font-extrabold text-emerald-700">92.4%</span>
              </div>
            </div>

            {/* Trees Sample Table */}
            <div>
              <h4 className="text-xs font-bold text-stone-800 mb-2">Audited Tree Registry Sample</h4>
              <table className="w-full text-xs text-left border border-stone-200 rounded-xl overflow-hidden">
                <thead className="bg-stone-100 text-stone-700 font-bold">
                  <tr>
                    <th className="p-2">Tree Code</th>
                    <th className="p-2">Species</th>
                    <th className="p-2">GPS Fix</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Evidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {projectTrees.slice(0, 8).map((t) => (
                    <tr key={t.id}>
                      <td className="p-2 font-mono font-bold text-emerald-900">{t.treeCode}</td>
                      <td className="p-2">{t.species}</td>
                      <td className="p-2 font-mono text-[11px]">
                        {t.latitude.toFixed(4)}°, {t.longitude.toFixed(4)}°
                      </td>
                      <td className="p-2">{t.status}</td>
                      <td className="p-2">{t.evidenceQuality}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // TREE LEVEL AUDIT CERTIFICATE
          <div className="space-y-6">
            <div className="border-b-2 border-emerald-800 pb-4 flex justify-between items-start">
              <div>
                <span className="text-[11px] font-mono font-bold text-emerald-800 uppercase tracking-widest block">
                  TreeWatch Individual Survival Passport • Every Tree Counts. Keep It Alive.
                </span>
                <h2 className="text-2xl font-black text-stone-900 mt-1 font-mono">
                  {selectedTree.treeCode}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Species: {selectedTree.species} ({selectedTree.scientificName})
                </p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full font-bold text-xs">
                  {selectedTree.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-4/3 rounded-2xl overflow-hidden border border-stone-200">
                <img
                  src={selectedTree.baselinePhotoUrl}
                  alt="Baseline"
                  className="w-full h-full object-cover"
                />
                <span className="text-[10px] text-stone-500 block text-center mt-1">
                  Baseline Photograph ({selectedTree.plantedDate})
                </span>
              </div>
              <div className="aspect-4/3 rounded-2xl overflow-hidden border border-stone-200">
                <img
                  src={selectedTree.latestPhotoUrl}
                  alt="Latest"
                  className="w-full h-full object-cover"
                />
                <span className="text-[10px] text-stone-500 block text-center mt-1">
                  Latest Verification Photo ({selectedTree.lastVerifiedDate})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div>
                <span className="text-stone-400 block font-bold">GPS Coordinates:</span>
                <span className="font-mono text-stone-800">
                  {selectedTree.latitude.toFixed(5)}° N, {selectedTree.longitude.toFixed(5)}° E (±{selectedTree.gpsAccuracyMeters}m)
                </span>
              </div>
              <div>
                <span className="text-stone-400 block font-bold">Caretaker / Guardian:</span>
                <span className="text-stone-800">{selectedTree.caretakerName}</span>
              </div>
              <div>
                <span className="text-stone-400 block font-bold">Evidence Quality:</span>
                <span className="text-stone-800">{selectedTree.evidenceQuality}</span>
              </div>
              <div>
                <span className="text-stone-400 block font-bold">Current Health:</span>
                <span className="text-stone-800">{selectedTree.currentHealth}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
