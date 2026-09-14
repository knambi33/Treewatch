import React from 'react';
import { TreeScoreCategory } from '../../types';
import { Award, ShieldCheck, Sparkles } from 'lucide-react';

interface TreeScoreBadgeProps {
  score: number;
  category?: TreeScoreCategory;
  isEstablished?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showCategoryLabel?: boolean;
}

export const TreeScoreBadge: React.FC<TreeScoreBadgeProps> = ({
  score,
  category = '🌱 Newly Planted',
  isEstablished = false,
  size = 'md',
  showCategoryLabel = true,
}) => {
  // Determine color theme based on score
  let strokeColor = '#10b981'; // emerald
  let bgColor = 'bg-emerald-50';
  let textColor = 'text-emerald-800';
  let borderColor = 'border-emerald-200';

  if (score >= 95) {
    strokeColor = '#eab308'; // gold
    bgColor = 'bg-amber-50';
    textColor = 'text-amber-800';
    borderColor = 'border-amber-300';
  } else if (score >= 80) {
    strokeColor = '#059669'; // deep emerald
    bgColor = 'bg-emerald-50';
    textColor = 'text-emerald-900';
    borderColor = 'border-emerald-300';
  } else if (score >= 60) {
    strokeColor = '#10b981'; // emerald
    bgColor = 'bg-emerald-50';
    textColor = 'text-emerald-800';
    borderColor = 'border-emerald-200';
  } else if (score >= 40) {
    strokeColor = '#0284c7'; // sky/blue
    bgColor = 'bg-sky-50';
    textColor = 'text-sky-800';
    borderColor = 'border-sky-200';
  } else if (score >= 20) {
    strokeColor = '#84cc16'; // lime
    bgColor = 'bg-lime-50';
    textColor = 'text-lime-800';
    borderColor = 'border-lime-200';
  } else {
    strokeColor = '#78716c'; // stone
    bgColor = 'bg-stone-100';
    textColor = 'text-stone-700';
    borderColor = 'border-stone-200';
  }

  // Dimension settings
  const dimensions = {
    sm: { circle: 54, radius: 22, stroke: 4, text: 'text-sm font-black', sub: 'text-[9px]' },
    md: { circle: 84, radius: 36, stroke: 6, text: 'text-2xl font-black', sub: 'text-[10px]' },
    lg: { circle: 120, radius: 52, stroke: 8, text: 'text-4xl font-black', sub: 'text-xs' },
  }[size];

  const circumference = 2 * Math.PI * dimensions.radius;
  const progress = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="inline-flex flex-col items-center select-none">
      <div className="relative flex items-center justify-center">
        <svg
          width={dimensions.circle}
          height={dimensions.circle}
          className="transform -rotate-90 drop-shadow-xs"
        >
          {/* Background Track */}
          <circle
            cx={dimensions.circle / 2}
            cy={dimensions.circle / 2}
            r={dimensions.radius}
            stroke="#e7e5e4"
            strokeWidth={dimensions.stroke}
            fill="transparent"
          />
          {/* Progress Indicator */}
          <circle
            cx={dimensions.circle / 2}
            cy={dimensions.circle / 2}
            r={dimensions.radius}
            stroke={strokeColor}
            strokeWidth={dimensions.stroke}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Score Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`${dimensions.text} tracking-tight ${textColor} leading-none`}>
            {score.toFixed(1)}
          </span>
          <span className={`${dimensions.sub} font-bold text-stone-400 uppercase tracking-widest mt-0.5`}>
            / 100
          </span>
        </div>
      </div>

      {showCategoryLabel && (
        <div className="mt-2 flex flex-col items-center gap-1">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border shadow-2xs ${bgColor} ${textColor} ${borderColor}`}
          >
            {category}
          </span>

          {isEstablished && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md text-[10px] font-black uppercase tracking-wider shadow-xs animate-pulse">
              <Award className="w-3 h-3" />
              <span>TreeView Established™</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
