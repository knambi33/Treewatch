import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Camera,
  MapPin,
  Clock,
  AlertTriangle,
  FileText,
  UserCheck,
  RefreshCw,
} from 'lucide-react';
import { ReviewQueueItem, TreeStatus, HealthCondition } from '../types';
import { fetchReviewQueue, actionReviewQueueItem } from '../api';
import { StatusBadge } from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';

export const AdminReviewQueue: React.FC = () => {
  const { currentUser } = useAuth();
  const [queue, setQueue] = useState<ReviewQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ReviewQueueItem | null>(null);

  // Action form state
  const [actionRemarks, setActionRemarks] = useState('');
  const [overrideStatus, setOverrideStatus] = useState<TreeStatus | ''>('');
  const [overrideHealth, setOverrideHealth] = useState<HealthCondition | ''>('');
  const [actionInProgress, setActionInProgress] = useState(false);

  const loadQueue = async () => {
    setLoading(true);
    try {
      const items = await fetchReviewQueue();
      setQueue(items);
      if (items.length > 0 && !selectedItem) {
        setSelectedItem(items[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleAction = async (action: 'Approved' | 'Rejected' | 'Photo-Requested') => {
    if (!selectedItem) return;
    setActionInProgress(true);

    try {
      await actionReviewQueueItem(selectedItem.id, {
        action,
        correctedStatus: overrideStatus || undefined,
        correctedHealth: overrideHealth || undefined,
        reviewerRemarks: actionRemarks || `Verification ${action} by certified audit arborist.`,
        reviewerId: currentUser?.id || 'USR-ADMIN-07',
        reviewerName: currentUser?.name || 'Dr. K. Ramanathan',
      });

      alert(`Tree ${selectedItem.treeCode} marked as ${action}. Audit trail updated.`);
      setActionRemarks('');
      setOverrideStatus('');
      setOverrideHealth('');
      await loadQueue();
    } catch (err: any) {
      alert('Review action failed: ' + err.message);
    } finally {
      setActionInProgress(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>Arborist Audit & Verification Exception Queue</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Human Review & Fraud Prevention Desk
            </h1>
            <p className="text-xs text-stone-300 mt-1 max-w-xl">
              AI is not the final authority. Flagged cases (GPS mismatch, low same-tree confidence, suspected death, duplicate photos) require human arborist sign-off.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-2 bg-amber-500/20 border border-amber-400/30 rounded-2xl text-amber-300 text-xs font-extrabold">
              {queue.filter((q) => q.status === 'Pending').length} Pending Review
            </span>
          </div>
        </div>
      </div>

      {/* Main Review Workplace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Flagged Items List */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 border border-stone-200 shadow-md space-y-2 h-[650px] flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <span className="text-xs font-bold text-stone-900">Flagged Submissions</span>
            <button
              onClick={loadQueue}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {queue.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-12">
                No pending flagged submissions. All verifications clear.
              </p>
            ) : (
              queue.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all ${
                    selectedItem?.id === item.id
                      ? 'bg-emerald-50 border-emerald-400 shadow-xs'
                      : 'bg-stone-50 border-stone-200/80 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-xs font-bold text-stone-900">
                      {item.treeCode}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        item.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-emerald-900 mt-0.5">{item.species}</p>
                  <div className="space-y-0.5 mt-1.5">
                    {item.flags.map((flag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-rose-50 text-rose-800 border border-rose-200 px-1.5 py-0.5 rounded block truncate font-medium"
                      >
                        ⚠️ {flag}
                      </span>
                    ))}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right 2 Cols: Side-by-Side Photo & Arborist Action Console */}
        <div className="lg:col-span-2 space-y-4">
          {selectedItem ? (
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-stone-200 shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                    {selectedItem.treeCode}
                  </span>
                  <h3 className="text-lg font-extrabold text-stone-900 mt-0.5">
                    Inspection: {selectedItem.species} ({selectedItem.projectName})
                  </h3>
                  <span className="text-xs text-stone-500">
                    Planter: {selectedItem.submittedByName} • Submitted {selectedItem.submittedAt}
                  </span>
                </div>
              </div>

              {/* Side-by-Side Photographic Audit (Section 11 & 27) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Baseline Photo */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800">1. Baseline Photograph</span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      {selectedItem.registeredCoords.lat.toFixed(4)}°,{' '}
                      {selectedItem.registeredCoords.lng.toFixed(4)}°
                    </span>
                  </div>
                  <div className="aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 relative">
                    <img
                      src={selectedItem.baselinePhotoUrl}
                      alt="Baseline"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Month 0 Reference
                    </span>
                  </div>
                </div>

                {/* Current Monthly Photo */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800">2. Current Monthly Photo</span>
                    <span className="text-[10px] text-rose-600 font-mono font-bold">
                      {selectedItem.distanceMeters}m away (limit: {selectedItem.gpsToleranceMeters}m)
                    </span>
                  </div>
                  <div className="aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 border-2 border-dashed border-amber-400 relative">
                    <img
                      src={selectedItem.currentPhotoUrl}
                      alt="Current"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Current Submission
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Discrepancy Diagnostics */}
              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2 text-xs">
                <span className="font-bold text-amber-950 block">Audit Flags Detected</span>
                <div className="grid grid-cols-2 gap-2 text-stone-700">
                  <div>
                    <span className="text-stone-500 text-[11px] block">Same-Tree Confidence:</span>
                    <strong className="text-stone-900">{selectedItem.aiSameTreeConfidence}%</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 text-[11px] block">AI Health Estimate:</span>
                    <strong className="text-stone-900">{selectedItem.aiHealthAssessment}</strong>
                  </div>
                </div>
                <div className="space-y-1 pt-1">
                  {selectedItem.flags.map((flag, idx) => (
                    <div key={idx} className="text-xs text-amber-900 flex items-center gap-1.5 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arborist Decision Controls */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <h4 className="text-xs font-bold text-stone-900">Arborist Decision & Overrides</h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Correct Status (Optional)
                    </label>
                    <select
                      value={overrideStatus}
                      onChange={(e) => setOverrideStatus(e.target.value as TreeStatus)}
                      className="w-full text-xs p-2 border border-stone-300 rounded-xl bg-white"
                    >
                      <option value="">Default (Based on Decision)</option>
                      <option value="Verified Alive">Verified Alive</option>
                      <option value="Needs Attention">Needs Attention</option>
                      <option value="Poor Health">Poor Health</option>
                      <option value="Dead">Mark Dead</option>
                      <option value="Missing">Mark Missing</option>
                      <option value="Verification Exception">Verification Exception</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Correct Health (Optional)
                    </label>
                    <select
                      value={overrideHealth}
                      onChange={(e) => setOverrideHealth(e.target.value as HealthCondition)}
                      className="w-full text-xs p-2 border border-stone-300 rounded-xl bg-white"
                    >
                      <option value="">Default AI ({selectedItem.aiHealthAssessment})</option>
                      <option value="Healthy">Healthy 🟢</option>
                      <option value="Moderate Stress">Moderate Stress 🟡</option>
                      <option value="Poor Health">Poor Health 🟠</option>
                      <option value="Dead / Missing">Dead / Missing 🔴</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    Arborist Audit Remarks *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter audit notes (e.g. GPS shift confirmed due to canopy shadow; visual branching matches)"
                    value={actionRemarks}
                    onChange={(e) => setActionRemarks(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* 3 Reviewer Actions (Section 27) */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => handleAction('Approved')}
                    disabled={actionInProgress}
                    className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve as Alive</span>
                  </button>

                  <button
                    onClick={() => handleAction('Photo-Requested')}
                    disabled={actionInProgress}
                    className="flex-1 py-2.5 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Request New Photo</span>
                  </button>

                  <button
                    onClick={() => handleAction('Rejected')}
                    disabled={actionInProgress}
                    className="flex-1 py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Verification</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-stone-400 border border-stone-200">
              Select a flagged tree submission on the left to inspect side-by-side photos.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
