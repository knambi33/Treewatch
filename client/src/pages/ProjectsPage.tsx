import React, { useState } from 'react';
import {
  FolderKanban,
  Target,
  Trees,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  MapPin,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Project, Tree } from '../types';

interface ProjectsPageProps {
  projects: Project[];
  trees: Tree[];
  onSelectProject: (projectId: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  trees,
  onSelectProject,
}) => {
  const [selectedProj, setSelectedProj] = useState<Project>(projects[0] || null);

  const pTrees = trees.filter((t) => t.projectId === selectedProj?.id);
  const alive = pTrees.filter((t) => ['Verified Alive', 'Healthy'].includes(t.status)).length;
  const dead = pTrees.filter((t) => t.status === 'Dead').length;
  const missing = pTrees.filter((t) => t.status === 'Missing').length;
  const stressed = pTrees.filter((t) => ['Needs Attention', 'Stressed', 'Poor Health'].includes(t.status)).length;
  const pending = pTrees.filter((t) => t.status === 'Verification Pending' || t.status === 'Planted').length;
  const survivalRate = pTrees.length > 0 ? Math.round((alive / pTrees.length) * 1000) / 10 : 0;
  const compliance = pTrees.length > 0 ? Math.round(((pTrees.length - pending) / pTrees.length) * 1000) / 10 : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-stone-200 shadow-md">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
          <FolderKanban className="w-4 h-4 text-emerald-600" />
          <span>Section 18 • Project Dashboard</span>
        </div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
          Plantation Projects & Concessions
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Audited metrics, targets, species diversity, and geographic boundaries per project
        </p>
      </div>

      {/* Project Selector Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedProj(p)}
            className={`py-2 px-4 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedProj?.id === p.id
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Selected Project Full Dashboard (Section 18) */}
      {selectedProj && (
        <div className="space-y-6">
          {/* Main Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-stone-200 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  {selectedProj.id}
                </span>
                <h2 className="text-xl font-extrabold text-stone-900 mt-1">
                  {selectedProj.name}
                </h2>
                <p className="text-xs text-stone-500">
                  {selectedProj.geography.district}, {selectedProj.geography.state} • Organisation: {selectedProj.organisationName}
                </p>
              </div>

              <button
                onClick={() => onSelectProject(selectedProj.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
              >
                <span>View {pTrees.length} Trees in Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-2xl border border-stone-100">
              {selectedProj.description}
            </p>

            {/* Comprehensive 10 Metrics as per Section 18 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-stone-400 font-bold text-[10px] uppercase block">Target Trees</span>
                <span className="text-lg font-extrabold text-stone-900">
                  {selectedProj.targetTrees.toLocaleString()}
                </span>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-stone-400 font-bold text-[10px] uppercase block">Planted</span>
                <span className="text-lg font-extrabold text-stone-900">{pTrees.length}</span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-emerald-700 font-bold text-[10px] uppercase block">Verified Alive</span>
                <span className="text-lg font-extrabold text-emerald-800">{alive}</span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-emerald-700 font-bold text-[10px] uppercase block">Survival %</span>
                <span className="text-lg font-extrabold text-emerald-800">{survivalRate}%</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-stone-400 font-bold text-[10px] uppercase block">Stressed Trees</span>
                <span className="text-lg font-extrabold text-amber-700">{stressed}</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-stone-400 font-bold text-[10px] uppercase block">Dead Trees</span>
                <span className="text-lg font-extrabold text-rose-700">{dead}</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-stone-400 font-bold text-[10px] uppercase block">Missing Trees</span>
                <span className="text-lg font-extrabold text-rose-700">{missing}</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-stone-400 font-bold text-[10px] uppercase block">Verification Compliance</span>
                <span className="text-lg font-extrabold text-blue-700">{compliance}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
