import React from 'react';
import { EvidenceQuality } from '../../types';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

interface EvidenceBadgeProps {
  quality: EvidenceQuality;
  showIcon?: boolean;
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({ quality, showIcon = true }) => {
  let color = 'bg-blue-50 text-blue-800 border-blue-200';
  let Icon = ShieldCheck;
  let label = 'Evidence Quality: High';

  if (quality === 'High') {
    color = 'bg-indigo-50 text-indigo-900 border-indigo-200';
    Icon = ShieldCheck;
    label = 'Evidence Quality: High (GPS + In-App Camera)';
  } else if (quality === 'Medium') {
    color = 'bg-amber-50 text-amber-900 border-amber-200';
    Icon = Shield;
    label = 'Evidence Quality: Medium';
  } else {
    color = 'bg-rose-50 text-rose-900 border-rose-200';
    Icon = ShieldAlert;
    label = 'Evidence Quality: Low (Uncertain / Gallery)';
  }

  return (
    <span
      title={label}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-2xs ${color}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      <span>{quality} Evidence</span>
    </span>
  );
};
