import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  Award,
  Calendar,
  Camera,
  Heart,
  Sparkles,
  TreePine,
  CheckCircle2,
  Users,
  Eye,
} from 'lucide-react';
import { Tree } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { EvidenceBadge } from '../components/common/EvidenceBadge';
import { useAuth } from '../context/AuthContext';

interface SchoolDashboardProps {
  trees: Tree[];
  onSelectTree: (tree: Tree) => void;
  onVerifyTree: (tree: Tree) => void;
}

export const SchoolDashboard: React.FC<SchoolDashboardProps> = ({
  trees,
  onSelectTree,
  onVerifyTree,
}) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'myTree' | 'classRoster' | 'badges'>('myTree');

  // School trees (St. Xavier's)
  const schoolTrees = trees.filter(
    (t) => t.projectId === 'PRJ-SXG-04' || t.organisationId === 'ORG-SCH-03' || t.landCategory === 'School'
  );

  // Student Arun's tree
  const studentTree =
    schoolTrees.find((t) => t.treeCode === 'SCH-00125' || t.studentName === 'Arun') ||
    schoolTrees[0];

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#16a34a', '#86efac', '#fde047'],
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* School Header Banner */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-green-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4 text-emerald-300" />
              <span>St. Xavier's Model Matriculation School</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Green Campus Bio-Stewardship
            </h1>
            <p className="text-xs text-emerald-100/80 mt-1 max-w-md">
              Every class adopts, names, and photographs native saplings. Developing multi-year ecological empathy.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15 text-center">
            <span className="text-[10.5px] uppercase font-bold text-emerald-200 block">Campus Trees</span>
            <span className="text-2xl font-extrabold text-white">{schoolTrees.length}</span>
            <span className="text-[10px] text-emerald-200 block">100% Student Adopted</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mt-6 pt-4 border-t border-white/15 text-xs font-bold">
          <button
            onClick={() => setActiveTab('myTree')}
            className={`py-2 px-3.5 rounded-xl transition-all ${
              activeTab === 'myTree'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-emerald-100 hover:bg-white/10'
            }`}
          >
            🌱 "My Tree" Feature
          </button>
          <button
            onClick={() => setActiveTab('classRoster')}
            className={`py-2 px-3.5 rounded-xl transition-all ${
              activeTab === 'classRoster'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-emerald-100 hover:bg-white/10'
            }`}
          >
            🏫 Class VIII-A Roster
          </button>
          <button
            onClick={() => {
              setActiveTab('badges');
              triggerConfetti();
            }}
            className={`py-2 px-3.5 rounded-xl transition-all ${
              activeTab === 'badges'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-emerald-100 hover:bg-white/10'
            }`}
          >
            🏆 Guardian Badges
          </button>
        </div>
      </div>

      {/* TAB 1: "My Tree" Visual Feature (Section 21) */}
      {activeTab === 'myTree' && studentTree && (
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-md border border-stone-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  {studentTree.treeCode}
                </span>
                <h3 className="text-xl font-extrabold text-stone-900 mt-1">
                  Arun's Neem Sapling
                </h3>
                <p className="text-xs text-stone-500">
                  Adopted by Student Arun, Class VIII-A • Biology Quadrangle
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onSelectTree(studentTree)}
                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-all"
                >
                  View Profile
                </button>
                <button
                  onClick={() => onVerifyTree(studentTree)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>Take Monthly Photo</span>
                </button>
              </div>
            </div>

            {/* Tree Age & Health Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-100 text-xs">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-stone-400 font-bold text-[10.5px] uppercase block">Tree Age</span>
                <span className="text-sm font-extrabold text-stone-900">{studentTree.ageMonths} Months</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-stone-400 font-bold text-[10.5px] uppercase block">Monthly Check-Ins</span>
                <span className="text-sm font-extrabold text-emerald-700">3 Completed</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-stone-400 font-bold text-[10.5px] uppercase block">Health State</span>
                <StatusBadge status={studentTree.status} size="sm" />
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-stone-400 font-bold text-[10.5px] uppercase block">Active Badge</span>
                <span className="text-xs font-bold text-amber-700">📷 3-Month Guardian</span>
              </div>
            </div>

            {/* Growth Journey Comparison Photos */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-stone-700 mb-3">
                Growth Progression Photographs
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden">
                  <img
                    src={studentTree.baselinePhotoUrl}
                    alt="Baseline"
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2 text-center text-xs">
                    <span className="font-bold text-stone-800 block">Baseline Seedling</span>
                    <span className="text-[10px] text-stone-500">June 2026</span>
                  </div>
                </div>

                <div className="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80"
                    alt="Month 1"
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2 text-center text-xs">
                    <span className="font-bold text-stone-800 block">Month 1 Growth</span>
                    <span className="text-[10px] text-stone-500">July 2026</span>
                  </div>
                </div>

                <div className="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden">
                  <img
                    src={studentTree.latestPhotoUrl}
                    alt="Month 2"
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2 text-center text-xs">
                    <span className="font-bold text-emerald-800 block">Month 2 Vigorous Canopy</span>
                    <span className="text-[10px] text-stone-500">August 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Class VIII-A Tree Assignments */}
      {activeTab === 'classRoster' && (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-md border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-stone-900">
                Class VIII-A Student Guardians
              </h3>
              <p className="text-xs text-stone-500">
                Assigned native trees on St. Xavier's quadrangle
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
              100% On-Time Check-Ins
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {schoolTrees.map((tree, idx) => (
              <div
                key={tree.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-stone-50/80 px-2 rounded-xl transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={tree.latestPhotoUrl || tree.baselinePhotoUrl}
                    alt={tree.treeCode}
                    className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-900">
                        {tree.treeCode}
                      </span>
                      <StatusBadge status={tree.status} size="sm" />
                    </div>
                    <p className="text-xs font-bold text-emerald-900">{tree.species}</p>
                    <span className="text-[10.5px] text-stone-500">
                      Guardian: {tree.studentName || 'Student ' + (idx + 1)} (Class VIII-A)
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectTree(tree)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onVerifyTree(tree)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Check-in</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Guardian Achievement Badges (Section 21) */}
      {activeTab === 'badges' && (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-md border border-stone-200 space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Tree Guardian Achievement Badges</span>
            </h3>
            <p className="text-xs text-stone-500">
              Rigorous milestones rewarded strictly for verified multi-month survival
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-emerald-50/60 border-2 border-emerald-300 rounded-2xl flex items-start gap-3 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl shadow-sm">
                🌱
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded">
                  Unlocked ✓
                </span>
                <h4 className="text-sm font-bold text-stone-900 mt-1">Tree Planter</h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Successfully planted native sapling and recorded initial GPS baseline.
                </p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/60 border-2 border-emerald-300 rounded-2xl flex items-start gap-3 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-sm">
                📷
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded">
                  Unlocked ✓
                </span>
                <h4 className="text-sm font-bold text-stone-900 mt-1">3-Month Guardian</h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Completed 3 consecutive monthly photographic check-ins with verified tree survival.
                </p>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex items-start gap-3 opacity-80">
              <div className="w-12 h-12 rounded-2xl bg-stone-200 text-stone-500 flex items-center justify-center text-xl">
                🌿
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500 bg-stone-200 px-2 py-0.5 rounded">
                  In Progress (3/6 Months)
                </span>
                <h4 className="text-sm font-bold text-stone-900 mt-1">6-Month Guardian</h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Nurture seedling through summer and seasonal transition.
                </p>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex items-start gap-3 opacity-60">
              <div className="w-12 h-12 rounded-2xl bg-stone-200 text-stone-500 flex items-center justify-center text-xl">
                🌳
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500 bg-stone-200 px-2 py-0.5 rounded">
                  Locked
                </span>
                <h4 className="text-sm font-bold text-stone-900 mt-1">One-Year Tree Guardian</h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Full 12-month survival accountability certification.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
