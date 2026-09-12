import React from 'react';
import { TreeStatus, HealthCondition } from '../../types';

interface StatusBadgeProps {
  status: TreeStatus | HealthCondition;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  let bg = 'bg-stone-100 text-stone-700 border-stone-200';
  let dot = 'bg-stone-400';

  switch (status) {
    case 'Verified Alive':
    case 'Healthy':
      bg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      dot = 'bg-emerald-500';
      break;
    case 'Planted':
      bg = 'bg-teal-50 text-teal-800 border-teal-200';
      dot = 'bg-teal-500';
      break;
    case 'Needs Attention':
    case 'Stressed':
    case 'Moderate Stress':
      bg = 'bg-amber-50 text-amber-800 border-amber-200';
      dot = 'bg-amber-500';
      break;
    case 'Poor Health':
      bg = 'bg-orange-50 text-orange-800 border-orange-200';
      dot = 'bg-orange-500';
      break;
    case 'Dead':
    case 'Missing':
    case 'Dead / Missing':
      bg = 'bg-rose-50 text-rose-800 border-rose-200';
      dot = 'bg-rose-500';
      break;
    case 'Verification Pending':
      bg = 'bg-blue-50 text-blue-800 border-blue-200';
      dot = 'bg-blue-400 animate-pulse';
      break;
    case 'Verification Exception':
      bg = 'bg-purple-50 text-purple-800 border-purple-200';
      dot = 'bg-purple-500 animate-ping';
      break;
    case 'Unable to Assess':
      bg = 'bg-gray-50 text-gray-700 border-gray-200';
      dot = 'bg-gray-400';
      break;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-2xs transition-all ${bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span>{status}</span>
    </span>
  );
};
