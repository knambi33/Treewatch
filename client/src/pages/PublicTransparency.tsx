import React, { useState, useEffect } from 'react';
import {
  Globe,
  ShieldCheck,
  MapPin,
  Trees,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Camera,
} from 'lucide-react';
import { fetchPublicTransparency } from '../api';
import { TreeMapView } from '../components/map/TreeMapView';

export const PublicTransparency: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicTransparency('green-earth-csr')
      .then((res) => {
        if (res.success) setData(res.transparencyData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const metrics = data?.metrics;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Public Trust Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Globe className="w-4 h-4" />
              <span>Public Transparency Registry • Zero-Fraud Afforestation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {data?.organisationName || 'Green Earth CSR Foundation'}
            </h1>
            <p className="text-xs text-stone-300 mt-1 max-w-xl leading-relaxed">
              {data?.description}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-emerald-200">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Audited Live: {new Date(data?.auditedAt || Date.now()).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-white/10 rounded-full border border-white/20 text-emerald-300">
                <Camera className="w-3 h-3" />
                <span>Camera Geotagged Ground Truth</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/15 text-center min-w-[150px]">
            <span className="text-[10px] uppercase font-bold text-emerald-300 block">🌳 TREES ALIVE TODAY</span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-400">
              {metrics?.verifiedAlive || 91}
            </span>
            <span className="text-[10.5px] text-stone-300 block mt-0.5">
              of {metrics?.totalPlanted || 105} Planted
            </span>
          </div>
        </div>

        {/* Public Survival & TreeScore Metrics Grid (Section 51) */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 mt-6 pt-5 border-t border-white/10 text-xs text-center">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-stone-400 font-bold text-[10px] uppercase block">Survival Rate</span>
            <span className="text-lg font-extrabold text-emerald-300">
              {metrics?.survivalRateMethodA_Percent || 91.0}%
            </span>
            <span className="text-[9px] text-stone-400 block">Verified / Due</span>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-stone-400 font-bold text-[10px] uppercase block">Established</span>
            <span className="text-lg font-extrabold text-amber-300">
              24 🌳
            </span>
            <span className="text-[9px] text-stone-400 block">36m+ Verified</span>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-stone-400 font-bold text-[10px] uppercase block">TreeYears™</span>
            <span className="text-lg font-extrabold text-teal-300">
              184.2
            </span>
            <span className="text-[9px] text-stone-400 block">Verified Years</span>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-stone-400 font-bold text-[10px] uppercase block">Tree-Days™</span>
            <span className="text-lg font-extrabold text-white font-mono">
              67,280
            </span>
            <span className="text-[9px] text-stone-400 block">Living Tree-Days</span>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-stone-400 font-bold text-[10px] uppercase block">Avg TreeScore™</span>
            <span className="text-lg font-extrabold text-emerald-400">
              81.4
            </span>
            <span className="text-[9px] text-stone-400 block">Out of 100</span>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-stone-400 font-bold text-[10px] uppercase block">Benchmark</span>
            <span className="text-xs font-black text-amber-300 uppercase block mt-1">
              DEMO DATA
            </span>
            <span className="text-[9px] text-stone-400 block">Option A Badge</span>
          </div>
        </div>
      </div>

      {/* Public Trust Statement */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-3xl text-xs text-emerald-950 space-y-1">
        <h4 className="font-extrabold flex items-center gap-1.5 text-emerald-900">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>TreeWatch Transparency Guarantee • Every Tree Counts</span>
        </h4>
        <p className="leading-relaxed">
          {data?.governanceStatement ||
            'All survival statistics are derived from cryptographic GPS geotagging, computer-vision same-tree analysis, and certified arborist audit trails. Trees awaiting monthly check-ins are recorded explicitly as Pending and are not counted as alive.'}
        </p>
      </div>

      {/* Public Map View (PII Stripped) */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-stone-200 shadow-md space-y-3">
        <div>
          <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>Public Interactive Plantation Map</span>
          </h3>
          <p className="text-xs text-stone-500">
            Click any marker to inspect certified survival evidence without exposing individual planter personal information.
          </p>
        </div>

        {data?.trees && (
          <div className="h-[450px]">
            <TreeMapView
              trees={data.trees}
              projects={data.projects || []}
              organisations={[]}
              onSelectTree={() => {}}
            />
          </div>
        )}
      </div>

      {/* Audited Photograph Samples */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-stone-200 shadow-md space-y-3">
        <h3 className="text-base font-extrabold text-stone-900">
          Recent Photographic Verifications
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(data?.trees || []).slice(0, 8).map((tree: any) => (
            <div
              key={tree.id}
              className="bg-stone-50 rounded-2xl overflow-hidden border border-stone-200 text-xs flex flex-col"
            >
              <img
                src={tree.latestPhotoUrl || tree.baselinePhotoUrl}
                alt={tree.treeCode}
                className="w-full h-28 object-cover"
              />
              <div className="p-2.5 space-y-0.5">
                <span className="font-mono text-[10px] font-bold text-stone-800 block truncate">
                  {tree.treeCode}
                </span>
                <span className="font-semibold text-emerald-800 block truncate">{tree.species}</span>
                <span className="text-[10px] text-stone-400 block">{tree.projectName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
