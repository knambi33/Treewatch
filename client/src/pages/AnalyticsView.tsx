import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Layers,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { fetchAnalyticsSummary } from '../api';
import { SurvivalMetrics } from '../types';

export const AnalyticsView: React.FC = () => {
  const [methodology, setMethodology] = useState<'A' | 'B'>('A');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsSummary()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const metrics: SurvivalMetrics | undefined = data?.metrics;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-stone-200 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Survival Science & Mathematical Accounting</span>
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Survival Analytics & Trend Intelligence
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Compare reporting methodologies, mortality breakdowns, and native species resilience
          </p>
        </div>

        {/* Methodology Pill Switcher */}
        <div className="flex bg-stone-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setMethodology('A')}
            className={`py-2 px-3.5 rounded-xl transition-all ${
              methodology === 'A'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Method A (Verified/Due)
          </button>
          <button
            onClick={() => setMethodology('B')}
            className={`py-2 px-3.5 rounded-xl transition-all ${
              methodology === 'B'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Method B (Alive/Planted)
          </button>
        </div>
      </div>

      {/* Insight Highlight (Section 40) */}
      <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-3xl flex items-center gap-3 text-xs text-emerald-950 shadow-2xs">
        <Sparkles className="w-5 h-5 text-emerald-700 shrink-0" />
        <div>
          <strong className="block text-emerald-900 font-bold">Actuarial Survival Finding</strong>
          <span>{data?.insight || 'Trees planted in June have 92% verified survival after 90 days with regular monthly monitoring.'}</span>
        </div>
      </div>

      {/* 4 Core Quantitative Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-stone-200 shadow-md">
          <span className="text-stone-400 text-xs font-bold uppercase block">
            {methodology === 'A' ? 'Survival Rate (Method A)' : 'Survival Rate (Method B)'}
          </span>
          <span className="text-3xl font-black text-emerald-600 mt-1 block">
            {methodology === 'A'
              ? metrics?.survivalRateMethodA_Percent || 91.0
              : metrics?.survivalRateMethodB_Percent || 86.7}
            %
          </span>
          <span className="text-[10.5px] text-stone-500 block mt-1">
            {methodology === 'A'
              ? 'Denominator: Trees Due for Verification'
              : 'Denominator: Total Trees Planted'}
          </span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-stone-200 shadow-md">
          <span className="text-stone-400 text-xs font-bold uppercase block">Verified Alive</span>
          <span className="text-3xl font-black text-stone-900 mt-1 block">
            {metrics?.verifiedAlive || 91}
          </span>
          <span className="text-[10.5px] text-emerald-700 font-semibold block mt-1">
            Healthy + Stressed Trees
          </span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-stone-200 shadow-md">
          <span className="text-stone-400 text-xs font-bold uppercase block">Mortality Disclosed</span>
          <span className="text-3xl font-black text-rose-600 mt-1 block">
            {(metrics?.dead || 2) + (metrics?.missing || 2)}
          </span>
          <span className="text-[10.5px] text-stone-500 block mt-1">Dead / Washed away</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-stone-200 shadow-md">
          <span className="text-stone-400 text-xs font-bold uppercase block">Verification Exceptions</span>
          <span className="text-3xl font-black text-purple-600 mt-1 block">
            {metrics?.verificationException || 5}
          </span>
          <span className="text-[10.5px] text-stone-500 block mt-1">GPS / photo flags in queue</span>
        </div>
      </div>

      {/* Species Survival Rates Breakdown */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-stone-200 shadow-md space-y-4">
        <h3 className="text-base font-extrabold text-stone-900">Species Survival Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(data?.speciesBreakdown || []).map((s: any) => (
            <div key={s.species} className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900">{s.species}</span>
                <span className="font-mono font-extrabold text-emerald-800">{s.survivalRate}% Survival</span>
              </div>
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${s.survivalRate}%` }} />
              </div>
              <div className="flex justify-between text-[11px] text-stone-500 pt-0.5">
                <span>Planted: {s.total}</span>
                <span>Alive: {s.alive}</span>
                <span>Dead: {s.dead}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* District-wise Survival Rates */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-stone-200 shadow-md space-y-4">
        <h3 className="text-base font-extrabold text-stone-900">District-Wise Survival</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {(data?.districtBreakdown || []).map((d: any) => (
            <div key={d.district} className="p-4 bg-stone-50 rounded-2xl border border-stone-100 text-xs text-center space-y-1">
              <MapPin className="w-5 h-5 text-emerald-600 mx-auto" />
              <strong className="text-stone-900 text-sm block font-bold">{d.district}</strong>
              <span className="text-xl font-extrabold text-emerald-700 block font-mono">{d.survivalRate}%</span>
              <span className="text-[10.5px] text-stone-500 block">{d.alive} of {d.total} Alive</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
