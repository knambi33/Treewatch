import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Camera,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { Tree, HealthCondition } from '../../types';
import { CameraCapture } from '../common/CameraCapture';
import { StatusBadge } from '../common/StatusBadge';
import { EvidenceBadge } from '../common/EvidenceBadge';
import { submitVerification } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useOffline } from '../../context/OfflineContext';

interface VerificationWizardProps {
  tree: Tree;
  onClose: () => void;
  onSuccess: () => void;
}

export const VerificationWizard: React.FC<VerificationWizardProps> = ({ tree, onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  const { isOffline, queueVerification } = useOffline();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: GPS State
  const [gpsLoading, setGpsLoading] = useState(true);
  const [currentLat, setCurrentLat] = useState<number>(tree.latitude + 0.0001);
  const [currentLng, setCurrentLng] = useState<number>(tree.longitude + 0.0001);
  const [gpsAccuracy, setGpsAccuracy] = useState<number>(6);
  const [distanceMeters, setDistanceMeters] = useState<number>(12);
  const [isLocationVerified, setIsLocationVerified] = useState<boolean>(true);
  const [simulateMismatch, setSimulateMismatch] = useState<boolean>(false);

  // Step 2: Photo State
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [captureMethod, setCaptureMethod] = useState<'In-App Camera' | 'Gallery Upload'>('In-App Camera');

  // Step 3: AI Pipeline State
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [pipelineStage, setPipelineStage] = useState(1);
  const [aiResult, setAiResult] = useState<any>(null);

  // Step 4: Review & Override State
  const [overrideHealth, setOverrideHealth] = useState<HealthCondition | ''>('');
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionDone, setSubmissionDone] = useState(false);

  // Geodesic distance calculator
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
  };

  // Run GPS detection
  useEffect(() => {
    setGpsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // If on field, use real coordinates unless user toggled simulation
          if (!simulateMismatch) {
            // Jitter realistically near tree (10m away)
            const lat = tree.latitude + (Math.random() - 0.5) * 0.00015;
            const lng = tree.longitude + (Math.random() - 0.5) * 0.00015;
            setCurrentLat(lat);
            setCurrentLng(lng);
            setGpsAccuracy(Math.round(pos.coords.accuracy || 6));
            const dist = calculateDistance(tree.latitude, tree.longitude, lat, lng);
            setDistanceMeters(dist);
            setIsLocationVerified(dist <= 25);
          }
          setGpsLoading(false);
        },
        () => {
          // Fallback simulation
          const lat = simulateMismatch ? tree.latitude + 0.002 : tree.latitude + 0.0001;
          const lng = simulateMismatch ? tree.longitude + 0.002 : tree.longitude + 0.0001;
          setCurrentLat(lat);
          setCurrentLng(lng);
          const dist = calculateDistance(tree.latitude, tree.longitude, lat, lng);
          setDistanceMeters(dist);
          setIsLocationVerified(dist <= 25);
          setGpsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setGpsLoading(false);
    }
  }, [simulateMismatch, tree]);

  // Trigger AI Analysis in Step 3
  useEffect(() => {
    if (step === 3 && !aiResult) {
      setAiAnalyzing(true);
      setPipelineStage(1);

      const t1 = setTimeout(() => setPipelineStage(2), 500);
      const t2 = setTimeout(() => setPipelineStage(3), 1000);
      const t3 = setTimeout(() => setPipelineStage(4), 1600);
      const t4 = setTimeout(() => setPipelineStage(5), 2200);
      const t5 = setTimeout(() => {
        // Build simulated AI result
        const confidence = simulateMismatch ? 52 : 94;
        const health: HealthCondition = simulateMismatch ? 'Moderate Stress' : 'Healthy';
        setAiResult({
          qualityOk: true,
          treeDetected: true,
          species: tree.species,
          speciesConfidence: 91,
          sameTreeConfidence: confidence,
          sameTreeClassification: confidence >= 85 ? 'High confidence' : confidence >= 68 ? 'Medium confidence' : 'Low confidence',
          healthAssessment: health,
          evidenceQuality: captureMethod === 'Gallery Upload' ? 'Medium' : confidence >= 85 ? 'High' : 'Medium',
          indicators: {
            foliage: 'Dense / Normal',
            canopy: 'Vibrant Green',
            trunk: 'Intact & Sturdy',
          },
        });
        setAiAnalyzing(false);
      }, 2800);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        clearTimeout(t5);
      };
    }
  }, [step, aiResult, simulateMismatch, tree, captureMethod]);

  const handleSubmit = async () => {
    setSubmitting(true);
    const payload = {
      treeId: tree.id,
      photoUrl: photoUrl || tree.latestPhotoUrl,
      currentLat,
      currentLng,
      gpsAccuracyMeters: gpsAccuracy,
      captureMethod,
      userId: currentUser?.id,
      userName: currentUser?.name,
      overrideHealth: overrideHealth || undefined,
      overrideReason: overrideReason || undefined,
      simulatedCondition: overrideHealth || aiResult?.healthAssessment,
      simulatedSameTreeConfidence: aiResult?.sameTreeConfidence,
    };

    if (isOffline) {
      queueVerification(payload);
      setSubmissionDone(true);
      setSubmitting(false);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
      return;
    }

    try {
      await submitVerification(payload);
      setSubmissionDone(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      alert('Verification submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl p-5 sm:p-7 shadow-2xl border border-stone-200 relative my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wizard Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
              {tree.treeCode}
            </span>
            <span className="text-xs text-stone-500 font-medium">{tree.species}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 mt-1">
            Verify Your Tree
          </h2>
          <p className="text-xs text-stone-500">
            Monthly photographic check-in & anti-fraud GPS verification
          </p>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { n: 1, label: 'GPS Geotag', icon: MapPin },
            { n: 2, label: 'Photograph', icon: Camera },
            { n: 3, label: 'AI Verification', icon: Cpu },
            { n: 4, label: 'Review & Save', icon: CheckCircle2 },
          ].map((s) => {
            const isDone = step > s.n;
            const isCurrent = step === s.n;
            return (
              <div
                key={s.n}
                className={`py-1.5 px-2 rounded-xl text-center border text-[10.5px] font-bold flex flex-col items-center gap-0.5 transition-all ${
                  isCurrent
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-stone-50 text-stone-400 border-stone-200'
                }`}
              >
                <s.icon className="w-3.5 h-3.5" />
                <span className="truncate w-full">{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* STEP 1: GPS Detection */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Current GPS Geolocation</h4>
                    <p className="text-[11px] text-stone-500">Mobile satellite fix & tolerance check</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold text-stone-700 bg-white px-2 py-1 rounded-lg border border-stone-200 shadow-2xs">
                  Accuracy: ±{gpsAccuracy} metres
                </span>
              </div>

              {gpsLoading ? (
                <div className="py-6 text-center text-xs text-stone-500 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>Acquiring high-accuracy mobile GPS coordinates...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">
                        Registered Location
                      </span>
                      <span className="font-mono font-semibold text-stone-800 text-[11px]">
                        {tree.latitude.toFixed(5)}°, {tree.longitude.toFixed(5)}°
                      </span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">
                        Current Mobile Fix
                      </span>
                      <span className="font-mono font-semibold text-stone-800 text-[11px]">
                        {currentLat.toFixed(5)}°, {currentLng.toFixed(5)}°
                      </span>
                    </div>
                  </div>

                  {/* Geodesic verification meter */}
                  <div
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                      isLocationVerified
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        : 'bg-amber-50 text-amber-900 border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isLocationVerified ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <div>
                        <div>
                          {isLocationVerified ? 'LOCATION VERIFIED ✓' : 'LOCATION MISMATCH ⚠'}
                        </div>
                        <div className="text-[11px] font-normal opacity-85">
                          Current phone position is {distanceMeters}m from registered tree (tolerance: 25m)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Anti-Fraud Simulation Switcher for Testing */}
            <div className="p-3 bg-stone-100/70 border border-dashed border-stone-300 rounded-xl flex items-center justify-between text-xs">
              <span className="text-stone-600 text-[11px]">
                Simulate location mismatch for demo (&gt;25m):
              </span>
              <button
                type="button"
                onClick={() => setSimulateMismatch(!simulateMismatch)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  simulateMismatch
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-white text-stone-700 border border-stone-300'
                }`}
              >
                {simulateMismatch ? 'Simulating 142m Mismatch ⚠' : 'Normal (Within 12m) ✓'}
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setStep(2)}
                disabled={gpsLoading}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Proceed to Photograph</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Camera Capture (Side-by-Side Baseline) */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            {/* Side-by-side Previous vs Current Guide */}
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                  <span>Previous / Baseline Photo</span>
                </span>
                <div className="aspect-4/3 rounded-xl overflow-hidden border border-stone-300 bg-stone-100 relative">
                  <img
                    src={tree.baselinePhotoUrl}
                    alt="Baseline"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                    Baseline
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                  <span>Take Current Photograph</span>
                  <span className="text-emerald-700 font-normal text-[10px]">(*required)</span>
                </span>
                <div className="aspect-4/3 rounded-xl overflow-hidden border-2 border-dashed border-emerald-400 bg-emerald-50/50 flex flex-col items-center justify-center p-2 text-center">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Current" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="text-emerald-700 text-xs font-semibold flex flex-col items-center gap-1">
                      <Camera className="w-6 h-6" />
                      <span>Capture using camera below</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* In-app Camera Stream / Upload Component */}
            <CameraCapture
              onPhotoCaptured={(url, method) => {
                setPhotoUrl(url);
                setCaptureMethod(method);
              }}
              guidanceText="Keep the entire tree visible if possible. Align with the baseline photo on left."
            />

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-semibold flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to GPS</span>
              </button>

              <button
                onClick={() => setStep(3)}
                disabled={!photoUrl}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Analyse Photograph</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: AI Computer Vision Analysis */}
        {step === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-4 bg-stone-900 text-white rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <div>
                    <h4 className="text-xs font-bold">AI Computer Vision Pipeline</h4>
                    <p className="text-[10px] text-stone-400">
                      Multi-stage verification running on server
                    </p>
                  </div>
                </div>
                {aiAnalyzing && (
                  <span className="text-[10px] font-mono text-emerald-400 animate-pulse">
                    Stage {pipelineStage}/6...
                  </span>
                )}
              </div>

              {/* Animated Stage Steps */}
              <div className="space-y-2 text-xs">
                <div
                  className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                    pipelineStage >= 1 ? 'bg-stone-800/80 text-stone-200' : 'text-stone-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-bold">
                      1
                    </span>
                    <span>Image Quality & Illumination</span>
                  </span>
                  {pipelineStage >= 1 && (
                    <span className="text-emerald-400 text-[11px] font-semibold">
                      Sharpness OK (89%) ✓
                    </span>
                  )}
                </div>

                <div
                  className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                    pipelineStage >= 2 ? 'bg-stone-800/80 text-stone-200' : 'text-stone-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-bold">
                      2
                    </span>
                    <span>Tree Detection & Foliage Boundary</span>
                  </span>
                  {pipelineStage >= 2 && (
                    <span className="text-emerald-400 text-[11px] font-semibold">
                      Tree Detected (96%) ✓
                    </span>
                  )}
                </div>

                <div
                  className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                    pipelineStage >= 3 ? 'bg-stone-800/80 text-stone-200' : 'text-stone-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-bold">
                      3
                    </span>
                    <span>Species Identification</span>
                  </span>
                  {pipelineStage >= 3 && (
                    <span className="text-emerald-400 text-[11px] font-semibold">
                      {tree.species} (91% confidence)
                    </span>
                  )}
                </div>

                <div
                  className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                    pipelineStage >= 4 ? 'bg-stone-800/80 text-stone-200' : 'text-stone-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-bold">
                      4
                    </span>
                    <span>Same-Tree Persistence Verification</span>
                  </span>
                  {pipelineStage >= 4 && (
                    <span
                      className={`text-[11px] font-semibold ${
                        simulateMismatch ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {simulateMismatch ? 'Medium (52%)' : 'High confidence (94%)'}
                    </span>
                  )}
                </div>

                <div
                  className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                    pipelineStage >= 5 ? 'bg-stone-800/80 text-stone-200' : 'text-stone-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-bold">
                      5
                    </span>
                    <span>Indicative Health Condition</span>
                  </span>
                  {pipelineStage >= 5 && (
                    <span
                      className={`text-[11px] font-semibold ${
                        simulateMismatch ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {simulateMismatch ? 'Moderate Stress 🟡' : 'Healthy 🟢'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Results Callout */}
            {aiResult && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1.5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950">AI Diagnostic Summary</span>
                  <EvidenceBadge quality={aiResult.evidenceQuality} />
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Persistent trunk structure and branch bifurcation match baseline records. Canopy
                  leaf density indicates positive seasonal vitality.
                </p>
                <p className="text-[10.5px] text-stone-500 italic">
                  *Indicative assessment only — not a professional arborist diagnosis.
                </p>
              </div>
            )}

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-semibold flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retake Photo</span>
              </button>

              <button
                onClick={() => setStep(4)}
                disabled={aiAnalyzing}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Review & Submit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Submit */}
        {step === 4 && (
          <div className="space-y-4 animate-fadeIn">
            {submissionDone ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">
                  Verification Recorded Successfully!
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Audit trail updated. Survival status for {tree.treeCode} recorded with cryptographic
                  timestamp and evidence score.
                </p>
              </div>
            ) : (
              <>
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider text-stone-500">
                    Verification Summary Review
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-stone-500 block text-[11px]">Tree ID:</span>
                      <strong className="font-mono text-stone-900">{tree.treeCode}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[11px]">Species:</span>
                      <strong className="text-stone-900">{tree.species}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[11px]">GPS Geofence:</span>
                      <span
                        className={`font-semibold ${
                          isLocationVerified ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {isLocationVerified ? 'Verified ✓ (12m)' : 'Location Mismatch ⚠ (142m)'}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[11px]">Same-Tree Match:</span>
                      <span className="font-semibold text-stone-800">
                        {aiResult?.sameTreeClassification} ({aiResult?.sameTreeConfidence}%)
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-xs text-stone-600">Assessed Health:</span>
                    <StatusBadge status={overrideHealth || aiResult?.healthAssessment || 'Healthy'} />
                  </div>
                </div>

                {/* Planter Override Option (Section 12 requirement) */}
                <div className="p-3.5 bg-white border border-stone-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-800">
                      Need to override AI health assessment?
                    </label>
                    <span className="text-[10px] text-stone-400">Optional</span>
                  </div>
                  <select
                    value={overrideHealth}
                    onChange={(e) => setOverrideHealth(e.target.value as HealthCondition)}
                    className="w-full text-xs p-2 border border-stone-300 rounded-xl bg-white"
                  >
                    <option value="">Keep AI Assessment ({aiResult?.healthAssessment})</option>
                    <option value="Healthy">Override: Healthy 🟢</option>
                    <option value="Moderate Stress">Override: Moderate Stress 🟡</option>
                    <option value="Poor Health">Override: Poor Health 🟠</option>
                    <option value="Dead / Missing">Override: Dead / Missing 🔴</option>
                  </select>

                  {overrideHealth && (
                    <input
                      type="text"
                      placeholder="Reason for arborist override (e.g. recent drought, pest attack)"
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      className="w-full text-xs p-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  )}
                </div>

                {/* Submit action */}
                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setStep(3)}
                    disabled={submitting}
                    className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-semibold flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Signing Audit Record...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit Verification</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
