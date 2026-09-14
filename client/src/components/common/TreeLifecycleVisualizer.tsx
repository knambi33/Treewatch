import React from 'react';
import { TreeScoreCategory } from '../../types';
import { Check, Award } from 'lucide-react';

interface TreeLifecycleVisualizerProps {
  score: number;
  category: TreeScoreCategory;
  isEstablished?: boolean;
  ageMonths?: number;
  validChecksCount?: number;
}

export const TreeLifecycleVisualizer: React.FC<TreeLifecycleVisualizerProps> = ({
  score,
  category,
  isEstablished = false,
  ageMonths,
  validChecksCount,
}) => {
  const stages = [
    { id: 'planted', label: '🌱 Planted', minScore: 0 },
    { id: 'establishing', label: '🌿 Establishing', minScore: 20 },
    { id: 'surviving', label: '🌳 Surviving', minScore: 40 },
    { id: 'thriving', label: '🌳 Thriving', minScore: 60 },
    { id: 'established', label: '🌳 Established', minScore: 80 },
    { id: 'champion', label: '🏆 TreeView Established™', isMilestone: true },
  ];

  const getStageStatus = (stage: typeof stages[0]) => {
    if (stage.isMilestone) {
      return isEstablished ? 'completed' : 'locked';
    }
    if (score >= (stage.minScore ?? 0)) {
      // If it's the highest stage reached
      const nextStage = stages.find((s) => !s.isMilestone && (s.minScore ?? 0) > (stage.minScore ?? 0));
      if (!nextStage || score < (nextStage.minScore ?? 0)) {
        return 'current';
      }
      return 'completed';
    }
    return 'upcoming';
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-md border border-stone-200/80 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
            <span>TreeView Life — Lifecycle Progression</span>
          </h4>
          <p className="text-xs text-stone-500">
            Progressive establishment from initial seedling planting to multi-year maturity
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Current: {category}
        </span>
      </div>

      {/* Stepper Grid / Horizontal Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2">
        {stages.map((st, idx) => {
          const status = getStageStatus(st);

          let boxClasses = 'bg-stone-50 border-stone-200 text-stone-400';
          let indicatorClasses = 'bg-stone-200 text-stone-500';

          if (status === 'completed') {
            boxClasses = 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-bold';
            indicatorClasses = 'bg-emerald-600 text-white';
          } else if (status === 'current') {
            boxClasses = 'bg-emerald-600 text-white font-extrabold shadow-sm ring-2 ring-emerald-500/30';
            indicatorClasses = 'bg-white text-emerald-700 font-black';
          } else if (st.isMilestone && isEstablished) {
            boxClasses = 'bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold shadow-sm';
            indicatorClasses = 'bg-white text-amber-700 font-black';
          }

          return (
            <div
              key={st.id}
              className={`p-3 rounded-2xl border transition-all flex flex-col items-center text-center justify-between min-h-[92px] ${boxClasses}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 mb-1.5 ${indicatorClasses}`}>
                {status === 'completed' ? (
                  <Check className="w-3.5 h-3.5" />
                ) : st.isMilestone ? (
                  <Award className="w-3.5 h-3.5" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              <div className="text-[11px] leading-tight">
                <span className="block">{st.label}</span>
                {!st.isMilestone && (
                  <span className={`text-[10px] block mt-0.5 opacity-70`}>
                    {st.minScore}+ pts
                  </span>
                )}
                {st.isMilestone && (
                  <span className={`text-[9px] block mt-0.5 font-bold uppercase ${isEstablished ? 'text-amber-100' : 'text-stone-400'}`}>
                    {isEstablished ? 'Verified ✓' : '36m • 24 Checks'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
