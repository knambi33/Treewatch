import React, { useState, useEffect } from 'react';
import {
  Sprout,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Camera,
  QrCode,
  Search,
  ArrowRight,
  TrendingUp,
  MapPin,
  Trophy,
  Award,
} from 'lucide-react';
import { Tree, GuardianScore } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { EvidenceBadge } from '../components/common/EvidenceBadge';
import { useAuth } from '../context/AuthContext';
import { fetchGuardianScore } from '../api';

interface PlanterHomeProps {
  trees: Tree[];
  onSelectTree: (tree: Tree) => void;
  onVerifyTree: (tree: Tree) => void;
  onPlantTreeClick: () => void;
  onScanQRClick: () => void;
  onOpenLeaderboard?: () => void;
}

export const PlanterHome: React.FC<PlanterHomeProps> = ({
  trees,
  onSelectTree,
  onVerifyTree,
  onPlantTreeClick,
  onScanQRClick,
  onOpenLeaderboard,
}) => {
  const { currentUser } = useAuth();
  const [filterType, setFilterType] = useState<'all' | 'due' | 'attention'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [guardianScore, setGuardianScore] = useState<GuardianScore | null>(null);

  useEffect(() => {
    if (currentUser?.id) {
      fetchGuardianScore(currentUser.id)
        .then((res) => {
          if (res.success) setGuardianScore(res.guardianScore);
        })
        .catch(() => {});
    }
  }, [currentUser]);

  // Planter's assigned trees or all trees in view
  const myTrees = trees.filter(
    (t) =>
      currentUser?.role === 'admin' ||
      currentUser?.role === 'csr_manager' ||
      t.caretakerId === currentUser?.id ||
      t.planterId === currentUser?.id ||
      currentUser?.name === 'Ravi Kumar'
  );

  const dueTrees = myTrees.filter((t) => t.status === 'Verification Pending' || t.status === 'Planted');
  const attentionTrees = myTrees.filter((t) => ['Needs Attention', 'Stressed', 'Poor Health'].includes(t.status));
  const aliveTrees = myTrees.filter((t) => ['Verified Alive', 'Healthy'].includes(t.status));

  let displayedTrees = myTrees;
  if (filterType === 'due') displayedTrees = dueTrees;
  if (filterType === 'attention') displayedTrees = attentionTrees;

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayedTrees = displayedTrees.filter(
      (t) =>
        t.treeCode.toLowerCase().includes(q) ||
        t.species.toLowerCase().includes(q) ||
        t.projectName.toLowerCase().includes(q)
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Hero Welcome Card */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-800 text-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-emerald-900/15 relative overflow-hidden">
        {/* Subtle decorative leaf pattern in background */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
              <Sprout className="w-4 h-4 text-emerald-300" />
              <span>Good morning, {currentUser?.name || 'Tree Planter'}!</span>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-200 border border-amber-300/30 rounded-md text-[10px] font-bold">
                DEMO BENCHMARK DATA
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
              Every tree counts, Verified Live
            </h1>
            <p className="text-xs text-emerald-100/90 mt-1 max-w-lg leading-relaxed">
              <strong>Planting is Day One. Survival is the Impact.</strong> Powered by <strong>TreeView Index™</strong> GPS & photographic audit.
            </p>

            {/* Visual Lifecycle Journey: PLANT -> IDENTIFY -> VERIFY -> CARE -> SURVIVE -> ESTABLISH */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3 text-[10px] font-black uppercase tracking-wider text-emerald-200/90">
              <span className="px-1.5 py-0.5 bg-emerald-900/40 rounded border border-emerald-400/20">Plant</span>
              <span>&rarr;</span>
              <span className="px-1.5 py-0.5 bg-emerald-900/40 rounded border border-emerald-400/20">Identify</span>
              <span>&rarr;</span>
              <span className="px-1.5 py-0.5 bg-emerald-900/40 rounded border border-emerald-400/20">Verify</span>
              <span>&rarr;</span>
              <span className="px-1.5 py-0.5 bg-emerald-900/40 rounded border border-emerald-400/20">Care</span>
              <span>&rarr;</span>
              <span className="px-1.5 py-0.5 bg-emerald-900/40 rounded border border-emerald-400/20">Survive</span>
              <span>&rarr;</span>
              <span className="px-1.5 py-0.5 bg-emerald-900/40 rounded border border-emerald-400/20 text-emerald-300 font-extrabold">Establish</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {guardianScore && (
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/20 text-center min-w-[140px]">
                <span className="text-[10px] uppercase font-bold text-emerald-200 block">TreeView Guardian Score</span>
                <span className="text-2xl font-black text-white">{guardianScore.totalGuardianScore.toFixed(1)}</span>
                <span className="text-[10px] text-emerald-300 block font-bold mt-0.5">{guardianScore.badge}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={onScanQRClick}
                className="px-3.5 py-2.5 bg-emerald-500/90 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-2xl shadow-md hover:scale-102 transition-all flex items-center gap-1.5 border border-emerald-300/30"
                title="Open camera to photograph and verify trees in TreeView"
              >
                <Camera className="w-4 h-4" />
                <span>TreeView Verify</span>
              </button>
              <button
                onClick={onPlantTreeClick}
                className="px-4 py-2.5 bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-extrabold rounded-2xl shadow-md hover:scale-102 transition-all flex items-center gap-1.5"
              >
                <span>+ Plant Tree</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Summary Cards + Leaderboard Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
            <span className="text-emerald-200 text-[11px] font-semibold block">Your Trees</span>
            <span className="text-2xl font-extrabold text-white">{myTrees.length}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
            <span className="text-emerald-200 text-[11px] font-semibold block">Verified Alive</span>
            <span className="text-2xl font-extrabold text-emerald-300">{aliveTrees.length}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
            <span className="text-emerald-200 text-[11px] font-semibold block">Need Attention</span>
            <span className="text-2xl font-extrabold text-amber-300">
              {attentionTrees.length}
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
            <span className="text-emerald-200 text-[11px] font-semibold block">
              Verification Due
            </span>
            <span className="text-2xl font-extrabold text-white">{dueTrees.length}</span>
          </div>
        </div>

        {/* Green Leadership Callout Bar */}
        {onOpenLeaderboard && (
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-200">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Individuals are the prime drivers! Compete on the Green Leadership Leaderboard.</span>
            </div>
            <button
              onClick={onOpenLeaderboard}
              className="text-white font-extrabold hover:text-emerald-200 underline flex items-center gap-1"
            >
              <span>View Leaderboard &rarr;</span>
            </button>
          </div>
        )}
      </div>

      {/* Action Prompt Cards (Section 36) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setFilterType('due')}
          className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
            filterType === 'due'
              ? 'bg-blue-50 border-blue-300 shadow-xs'
              : 'bg-white border-stone-200 hover:border-blue-300'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900">
              🌱 Trees Due for Verification ({dueTrees.length})
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Take monthly photographs to verify survival
            </p>
          </div>
        </button>

        <button
          onClick={() => setFilterType('attention')}
          className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
            filterType === 'attention'
              ? 'bg-amber-50 border-amber-300 shadow-xs'
              : 'bg-white border-stone-200 hover:border-amber-300'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900">
              ⚠️ Trees Needing Attention ({attentionTrees.length})
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Foliage stress or watering needed
            </p>
          </div>
        </button>

        <button
          onClick={() => setFilterType('all')}
          className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
            filterType === 'all'
              ? 'bg-emerald-50 border-emerald-300 shadow-xs'
              : 'bg-white border-stone-200 hover:border-emerald-300'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900">
              🌳 All Assigned Trees ({myTrees.length})
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              View full geotagged tree directory
            </p>
          </div>
        </button>
      </div>

      {/* Trees Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by Tree ID, species, or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>
        <span className="text-xs font-semibold text-stone-500 self-center">
          Showing {displayedTrees.length} trees
        </span>
      </div>

      {/* Trees Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayedTrees.slice(0, 16).map((tree) => (
          <div
            key={tree.id}
            className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-2xs hover:shadow-md transition-all flex gap-3 group"
          >
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-100">
              <img
                src={tree.latestPhotoUrl || tree.baselinePhotoUrl}
                alt={tree.treeCode}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute top-1 left-1">
                <EvidenceBadge quality={tree.evidenceQuality} showIcon={false} />
              </div>
            </div>

            <div className="min-w-0 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-xs font-bold text-emerald-800 tracking-tight truncate">
                    {tree.treeCode}
                  </span>
                  <StatusBadge status={tree.status} size="sm" />
                </div>
                <h4 className="text-sm font-bold text-stone-900 truncate mt-0.5">
                  {tree.species}
                </h4>
                <p className="text-[11px] text-stone-500 truncate">{tree.projectName}</p>
                <div className="flex items-center gap-2 text-[10.5px] text-stone-400 mt-1">
                  <span>Age: {tree.ageMonths}m</span>
                  <span>•</span>
                  <span>Last: {tree.lastVerifiedDate || 'Pending'}</span>
                </div>
              </div>

              {/* Card Action Buttons */}
              <div className="flex gap-2 pt-2 mt-1 border-t border-stone-100">
                <button
                  onClick={() => onSelectTree(tree)}
                  className="flex-1 py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-bold rounded-lg transition-all"
                >
                  Profile
                </button>
                <button
                  onClick={() => onVerifyTree(tree)}
                  className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 shadow-2xs transition-all"
                >
                  <Camera className="w-3 h-3" />
                  <span>Verify</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State when no trees assigned or matching filter */}
      {displayedTrees.length === 0 && (
        <div className="bg-white rounded-3xl p-8 text-center border border-stone-200/80 shadow-2xs space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <Camera className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-stone-900">No Trees Recorded Yet</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
            Ready to log your first tree? Geotag your location, photograph your sapling with the camera, and start its digital survival audit trail.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={onPlantTreeClick}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5"
            >
              <Sprout className="w-4 h-4" />
              <span>+ Plant & Geotag First Tree</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
