import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Camera,
  QrCode,
  FileDown,
  ShieldCheck,
  Clock,
  User,
  Sprout,
  Activity,
  CheckCircle,
  AlertTriangle,
  History,
  TrendingUp,
} from 'lucide-react';
import { Tree, TimelineEvent, Verification, TreePhoto } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { EvidenceBadge } from '../components/common/EvidenceBadge';
import { QRViewerModal } from '../components/common/QRViewerModal';

interface TreeDetailProps {
  tree: Tree;
  timeline: TimelineEvent[];
  verifications: Verification[];
  photos: TreePhoto[];
  onBack: () => void;
  onVerifyClick: () => void;
}

export const TreeDetail: React.FC<TreeDetailProps> = ({
  tree,
  timeline,
  verifications,
  photos,
  onBack,
  onVerifyClick,
}) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // All photos for growth journey
  const photoHistory: Array<{
    label: string;
    url: string;
    date: string;
    sameTree?: string;
    health?: any;
  }> = [
    { label: 'Baseline', url: tree.baselinePhotoUrl, date: tree.plantedDate },
    ...verifications.map((v) => ({
      label: `Month Check (${v.verificationMonth})`,
      url: v.photoUrl,
      date: v.submittedAt.split('T')[0],
      sameTree: `${v.sameTreeConfidenceScore}%`,
      health: v.healthAssessment,
    })),
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100 shadow-2xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Trees</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQRModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100 shadow-2xs transition-all"
          >
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>Show QR Tag</span>
          </button>

          <button
            onClick={onVerifyClick}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>📷 Verify Tree</span>
          </button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-md border border-stone-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-sm font-extrabold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-lg">
                {tree.treeCode}
              </span>
              <StatusBadge status={tree.status} size="sm" />
              <EvidenceBadge quality={tree.evidenceQuality} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {tree.species}{' '}
              <span className="text-base font-normal text-stone-500">
                ({tree.commonName})
              </span>
            </h1>
            <p className="text-xs text-stone-500 italic mt-0.5">
              Scientific Name: {tree.scientificName}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-stone-400 block font-bold uppercase tracking-wider">
              Project
            </span>
            <span className="text-xs font-bold text-emerald-900 block">{tree.projectName}</span>
            <span className="text-[11px] text-stone-500">{tree.organisationName}</span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-100 text-xs">
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
            <span className="text-stone-400 font-bold text-[10.5px] uppercase block">
              Tree Age
            </span>
            <strong className="text-stone-900 text-sm font-extrabold">
              {tree.ageMonths} months
            </strong>
            <span className="text-[10px] text-stone-500 block">Planted {tree.plantedDate}</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
            <span className="text-stone-400 font-bold text-[10.5px] uppercase block">
              Last Verified
            </span>
            <strong className="text-emerald-800 text-sm font-extrabold">
              {tree.lastVerifiedDate || 'Pending'}
            </strong>
            <span className="text-[10px] text-stone-500 block">
              {tree.checkInCount} check-ins recorded
            </span>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
            <span className="text-stone-400 font-bold text-[10.5px] uppercase block">
              GPS Geofence
            </span>
            <strong className="text-stone-900 text-sm font-extrabold">Verified ✓</strong>
            <span className="text-[10px] text-stone-500 block">Accuracy: ±{tree.gpsAccuracyMeters}m</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
            <span className="text-stone-400 font-bold text-[10.5px] uppercase block">
              Assigned Guardian
            </span>
            <strong className="text-stone-900 text-sm font-extrabold truncate block">
              {tree.caretakerName}
            </strong>
            <span className="text-[10px] text-stone-500 block">Category: {tree.landCategory}</span>
          </div>
        </div>
      </div>

      {/* Growth Journey & Visual Timeline (Section 41) */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-md border border-stone-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Growth Journey & Visual Photographic Audit</span>
            </h3>
            <p className="text-xs text-stone-500">
              Photographic progression from baseline seedling to current canopy development
            </p>
          </div>
          <span className="text-xs text-stone-400 font-mono font-medium">
            {photoHistory.length} checkpoints
          </span>
        </div>

        {/* Gallery Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {photoHistory.map((item, idx) => (
            <div
              key={idx}
              className="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden shadow-2xs group flex flex-col"
            >
              <div className="aspect-4/3 relative overflow-hidden bg-stone-100">
                <img
                  src={item.url}
                  alt={item.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {item.label}
                </div>
              </div>
              <div className="p-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 text-[11px] font-semibold">{item.date}</span>
                  {item.sameTree && (
                    <span className="text-emerald-700 font-bold text-[10px]">
                      Same tree: {item.sameTree}
                    </span>
                  )}
                </div>
                {item.health && <StatusBadge status={item.health} size="sm" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complete Historical Audit Timeline (Section 14) */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-md border border-stone-200/80 space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            <span>Auditable Verification Timeline</span>
          </h3>
          <p className="text-xs text-stone-500">
            Immutable log of every event, photograph, GPS check, AI score, and arborist action
          </p>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:left-2 before:w-0.5 before:bg-stone-200">
          {timeline.map((event) => (
            <div key={event.id} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center shadow-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              </div>

              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-stone-900">{event.title}</h4>
                  <span className="text-[10px] font-mono text-stone-400">
                    {new Date(event.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{event.description}</p>
                {event.actorName && (
                  <span className="text-[10px] text-stone-500 block font-medium">
                    Verified by: {event.actorName}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Viewer Modal */}
      {showQRModal && <QRViewerModal tree={tree} onClose={() => setShowQRModal(false)} />}
    </div>
  );
};
