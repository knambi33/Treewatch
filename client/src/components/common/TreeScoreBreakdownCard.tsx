import React, { useState } from 'react';
import { TreeScoreComponents } from '../../types';
import {
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Clock,
  Heart,
  Activity,
  MapPin,
  Camera,
  Droplets,
  Sprout,
  CheckCircle2,
  X,
} from 'lucide-react';

interface TreeScoreBreakdownCardProps {
  components: TreeScoreComponents;
  totalScore: number;
  verifiedSurvivalDays: number;
  treeYears: number;
  improvementTip?: string;
  isDead?: boolean;
  onOpenMethodology?: () => void;
}

export const TreeScoreBreakdownCard: React.FC<TreeScoreBreakdownCardProps> = ({
  components,
  totalScore,
  verifiedSurvivalDays,
  treeYears,
  improvementTip,
  isDead = false,
  onOpenMethodology,
}) => {
  const [showExplainer, setShowExplainer] = useState(false);

  const items = [
    {
      id: 'planting',
      label: 'Verified Planting',
      score: components.planting,
      max: 10,
      icon: Sprout,
      color: 'bg-emerald-500',
      trackColor: 'bg-emerald-100',
      description: 'Baseline photograph, geotagged coordinates, species, and complete planter metadata.',
    },
    {
      id: 'location',
      label: 'Location & Identity',
      score: components.location,
      max: 10,
      icon: MapPin,
      color: 'bg-blue-500',
      trackColor: 'bg-blue-100',
      description: 'Physical traceability with <10m GPS confidence and QR code / tree tag physical linkage.',
    },
    {
      id: 'monitoring',
      label: 'Monitoring Compliance',
      score: components.monitoring,
      max: 15,
      icon: Camera,
      color: 'bg-purple-500',
      trackColor: 'bg-purple-100',
      description: 'Proportion of scheduled monthly photographic check-ins completed on time within grace period.',
    },
    {
      id: 'survival',
      label: 'Verified Survival',
      score: components.survival,
      max: 35,
      icon: Heart,
      color: 'bg-rose-500',
      trackColor: 'bg-rose-100',
      description: 'Proven multi-year survival curve verified through photographic ground-truth audit trails.',
    },
    {
      id: 'health',
      label: 'Health & Growth',
      score: components.health,
      max: 20,
      icon: Activity,
      color: 'bg-teal-500',
      trackColor: 'bg-teal-100',
      description: 'Canopy density, foliage vigor, bark condition, and AI-assisted health continuity assessment.',
    },
    {
      id: 'maintenance',
      label: 'Care & Maintenance',
      score: components.maintenance,
      max: 10,
      icon: Droplets,
      color: 'bg-amber-500',
      trackColor: 'bg-amber-100',
      description: 'Mulch rings, deep watering, tree guard protection, weeding, and sustained caretaker stewardship.',
    },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-md border border-stone-200/80 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>TreeView Index™ Breakdown</span>
          </h3>
          <p className="text-xs text-stone-500">
            Transparent, auditable 6-component scoring model (TreeView Index v1.0)
          </p>
        </div>

        <button
          onClick={() => setShowExplainer(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all"
        >
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <span>How it works</span>
        </button>
      </div>

      {/* 6 Component Progress Bars */}
      <div className="space-y-3.5">
        {items.map((item) => {
          const Icon = item.icon;
          const percentage = Math.min(100, Math.round((item.score / item.max) * 100));

          return (
            <div key={item.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2 text-stone-800">
                  <Icon className="w-4 h-4 text-stone-500" />
                  <span>{item.label}</span>
                </div>
                <div className="font-mono">
                  <span className="text-stone-900">{item.score.toFixed(1)}</span>
                  <span className="text-stone-400 font-normal"> / {item.max} pts</span>
                </div>
              </div>

              {/* Progress track */}
              <div className={`h-2.5 w-full rounded-full ${item.trackColor} overflow-hidden`}>
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-700 ease-out`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Impact Indicators */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-100">
        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs">
          <span className="text-[10.5px] font-bold text-stone-400 uppercase tracking-wider block">
            Verified Survival Duration
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <strong className="text-stone-900 text-base font-extrabold">{verifiedSurvivalDays}</strong>
            <span className="text-xs text-stone-500 font-medium">Tree-Days</span>
          </div>
        </div>

        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs">
          <span className="text-[10.5px] font-bold text-stone-400 uppercase tracking-wider block">
            Verified TreeYears™
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <strong className="text-emerald-800 text-base font-extrabold">{treeYears}</strong>
            <span className="text-xs text-stone-500 font-medium">TreeYears</span>
          </div>
        </div>
      </div>

      {/* Actionable Improvement Suggestion (Section 20) */}
      {improvementTip && (
        <div
          className={`p-3.5 rounded-2xl border text-xs flex items-start gap-3 ${
            isDead
              ? 'bg-stone-100 border-stone-300 text-stone-700'
              : 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
              isDead ? 'bg-stone-300 text-stone-800' : 'bg-emerald-600 text-white'
            }`}
          >
            💡
          </div>
          <div className="min-w-0 flex-1">
            <strong className="font-extrabold block text-stone-900">
              {isDead ? 'Preserved Survival Record' : 'Stewardship Recommendation:'}
            </strong>
            <p className="mt-0.5 text-stone-600 leading-relaxed">{improvementTip}</p>
          </div>
        </div>
      )}

      {/* How It Works Explainer Modal */}
      {showExplainer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-stone-900">
                  How TreeView Index™ Works
                </h3>
                <p className="text-xs text-stone-500">Methodology Version: TreeView Index v1.0</p>
              </div>
              <button
                onClick={() => setShowExplainer(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-stone-700 space-y-3 leading-relaxed">
              <p className="font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                “Don't count only trees planted. Count trees that survive, remain healthy, and are cared for.”
              </p>

              <p>
                Every tree begins with points for verified planting and accurate GPS geotagging. A newly
                planted sapling cannot immediately receive 100 points. Points are unlocked progressively
                as the tree survives, stays healthy, and receives monthly photographic check-ins.
              </p>

              <div className="space-y-2 pt-1">
                {items.map((i) => (
                  <div key={i.id} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/70">
                    <div className="font-bold text-stone-900 flex justify-between">
                      <span>{i.label}</span>
                      <span className="text-emerald-700">{i.max} pts max</span>
                    </div>
                    <p className="text-stone-500 text-[11px] mt-0.5">{i.description}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 space-y-1">
                <p>
                  <strong>Honest Reporting Guarantee:</strong> Overdue check-ins are marked <em>Verification Pending</em>,
                  never assumed dead. If a tree dies, future survival points stop accruing, but its verified lifetime
                  TreeView Index and photo history are permanently preserved.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              {onOpenMethodology && (
                <button
                  onClick={() => {
                    setShowExplainer(false);
                    onOpenMethodology();
                  }}
                  className="text-xs text-emerald-700 font-bold hover:underline"
                >
                  View Complete Public Methodology &rarr;
                </button>
              )}
              <button
                onClick={() => setShowExplainer(false)}
                className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 ml-auto shadow-xs"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
