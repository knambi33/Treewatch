import React, { useState, useEffect } from 'react';
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
  Droplets,
  Plus,
  HelpCircle,
} from 'lucide-react';
import { Tree, TimelineEvent, Verification, TreePhoto, TreeScoreData, CareActivity } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { EvidenceBadge } from '../components/common/EvidenceBadge';
import { QRViewerModal } from '../components/common/QRViewerModal';
import { TreeScoreBadge } from '../components/common/TreeScoreBadge';
import { TreeScoreBreakdownCard } from '../components/common/TreeScoreBreakdownCard';
import { TreeLifecycleVisualizer } from '../components/common/TreeLifecycleVisualizer';
import { fetchTreeScore, recordCareActivity } from '../api';

interface TreeDetailProps {
  tree: Tree;
  timeline: TimelineEvent[];
  verifications: Verification[];
  photos: TreePhoto[];
  onBack: () => void;
  onVerifyClick: () => void;
  onOpenMethodology?: () => void;
}

export const TreeDetail: React.FC<TreeDetailProps> = ({
  tree,
  timeline,
  verifications,
  photos,
  onBack,
  onVerifyClick,
  onOpenMethodology,
}) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [treeScore, setTreeScore] = useState<TreeScoreData | null>(null);
  const [loadingScore, setLoadingScore] = useState(true);

  // Care Log modal state
  const [showCareModal, setShowCareModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string>('Watering');
  const [careNotes, setCareNotes] = useState<string>('');
  const [savingCare, setSavingCare] = useState(false);

  // Load TreeScore
  const loadScore = () => {
    setLoadingScore(true);
    fetchTreeScore(tree.id)
      .then((data) => {
        if (data && data.score !== undefined) {
          setTreeScore(data);
        }
      })
      .catch((err) => console.error('Failed to load tree score:', err))
      .finally(() => setLoadingScore(false));
  };

  useEffect(() => {
    loadScore();
  }, [tree.id]);

  const handleRecordCare = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCare(true);
    try {
      await recordCareActivity(tree.id, {
        activityType: selectedActivity,
        recordedByUserId: tree.caretakerId || 'USR-PLANTER-01',
        recordedByUserName: tree.caretakerName || 'Guardian',
        notes: careNotes,
      });
      setShowCareModal(false);
      setCareNotes('');
      loadScore();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingCare(false);
    }
  };

  // Option A badge: Demo Benchmark vs Live Verified
  const isDemoTree = tree.id.includes('DEMO') || (tree.notes && tree.notes.includes('DEMO'));

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
            onClick={() => setShowCareModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100 shadow-2xs transition-all"
          >
            <Droplets className="w-4 h-4 text-amber-600" />
            <span>+ Log Care Event</span>
          </button>

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

      {/* Main Profile Header Card with TreeWatch Score™ */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-md border border-stone-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-extrabold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-lg">
                {tree.treeCode}
              </span>
              <StatusBadge status={tree.status} size="sm" />
              <EvidenceBadge quality={tree.evidenceQuality} />

              {/* Option A Badge */}
              {isDemoTree ? (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300/80 rounded-md text-[10px] font-extrabold tracking-wide">
                  DEMO BENCHMARK DATA
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300/80 rounded-md text-[10px] font-extrabold tracking-wide">
                  LIVE VERIFIED AUDIT
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {tree.species}{' '}
              <span className="text-base font-normal text-stone-500">
                ({tree.commonName})
              </span>
            </h1>
            <p className="text-xs text-stone-500 italic">
              Scientific Name: {tree.scientificName}
            </p>

            <div className="pt-1 text-xs text-stone-600">
              <span className="font-bold text-stone-800">Project:</span> {tree.projectName} &bull;{' '}
              <span className="text-stone-500">{tree.organisationName}</span>
            </div>
          </div>

          {/* Prominent TreeWatch Score Circular Gauge */}
          {treeScore && (
            <div className="shrink-0 bg-stone-50/80 p-4 rounded-3xl border border-stone-200/80 flex flex-col items-center">
              <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1.5">
                TREEWATCH SCORE™
              </span>
              <TreeScoreBadge
                score={treeScore.score}
                category={treeScore.category}
                isEstablished={treeScore.established}
                size="md"
              />
            </div>
          )}
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

      {/* 6-Component Breakdown Card */}
      {treeScore && (
        <TreeScoreBreakdownCard
          components={treeScore.components}
          totalScore={treeScore.score}
          verifiedSurvivalDays={treeScore.verifiedSurvivalDays}
          treeYears={treeScore.treeYears}
          improvementTip={treeScore.improvementTip}
          isDead={treeScore.isDead}
          onOpenMethodology={onOpenMethodology}
        />
      )}

      {/* Visual Lifecycle Stepper (Section 17) */}
      {treeScore && (
        <TreeLifecycleVisualizer
          score={treeScore.score}
          category={treeScore.category}
          isEstablished={treeScore.established}
        />
      )}

      {/* Score History Progression ("Why did my TreeScore change?" - Section 19) */}
      {treeScore?.history && treeScore.history.length > 0 && (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-md border border-stone-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-600" />
                <span>TreeScore™ Historical Progression</span>
              </h3>
              <p className="text-xs text-stone-500">
                Auditable timeline explaining why your score changed across verification milestones
              </p>
            </div>
            <span className="text-xs text-stone-400 font-mono">
              {treeScore.history.length} audit records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-500 font-bold uppercase text-[10px] tracking-wider border-b border-stone-200">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-center">Score</th>
                  <th className="py-2.5 px-3 text-center">Change</th>
                  <th className="py-2.5 px-3">Audit Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {treeScore.history.map((hist, idx) => (
                  <tr key={hist.id || idx} className="hover:bg-stone-50/80">
                    <td className="py-3 px-3 font-mono text-stone-600">{hist.date}</td>
                    <td className="py-3 px-3 text-center font-extrabold text-stone-900">
                      {hist.score.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {hist.change > 0 ? (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                          +{hist.change.toFixed(1)}
                        </span>
                      ) : hist.change < 0 ? (
                        <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded">
                          {hist.change.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-stone-400">&mdash;</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-stone-700">{hist.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Growth Journey & Visual Photographic Audit */}
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

      {/* Auditable Verification Timeline */}
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

      {/* Log Care Event Modal */}
      {showCareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleRecordCare}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-extrabold text-stone-900">Log Care & Maintenance</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCareModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Activity Type</label>
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                >
                  <option value="Watering">💧 Deep Root Watering</option>
                  <option value="Mulching">🍂 Organic Mulch Ring</option>
                  <option value="Protection">🛡️ Protective Tree Guard / Staking</option>
                  <option value="Weeding">🌿 Weeding & Soil Aeration</option>
                  <option value="Soil Improvement">🌱 Compost / Organic Nutrient Amendment</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Observations / Notes</label>
                <textarea
                  rows={3}
                  value={careNotes}
                  onChange={(e) => setCareNotes(e.target.value)}
                  placeholder="e.g. Added 10L water and compost ring around drip line."
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCareModal(false)}
                className="px-4 py-2 font-bold text-stone-600 hover:bg-stone-100 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingCare}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-xs disabled:opacity-50"
              >
                {savingCare ? 'Saving...' : 'Save & Recalculate Score'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* QR Viewer Modal */}
      {showQRModal && <QRViewerModal tree={tree} onClose={() => setShowQRModal(false)} />}
    </div>
  );
};
