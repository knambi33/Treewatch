import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Scale,
  Award,
  ArrowRight,
  TrendingUp,
  Heart,
  Droplets,
  Camera,
  MapPin,
  Sprout,
  Activity,
  Cpu,
} from 'lucide-react';

interface MethodologyPageProps {
  onBackToHome?: () => void;
  onExploreLeaderboard?: () => void;
}

export const MethodologyPage: React.FC<MethodologyPageProps> = ({
  onBackToHome,
  onExploreLeaderboard,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-fadeIn text-stone-800">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-stone-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Scientific Governance & Audit Standards • Version 1.0</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          How TreeView Index™ Works
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 max-w-2xl leading-relaxed">
          Every tree counts, Verified Live. The proprietary 0–100 verification standard measuring the journey of every tree from seedling
          to multi-year established canopy.
        </p>

        <div className="mt-6 p-4 rounded-2xl bg-white/10 border border-white/15 text-xs text-stone-200">
          <strong className="text-emerald-300 font-extrabold block text-sm">
            Core Philosophy:
          </strong>
          <span className="italic mt-0.5 block leading-relaxed text-stone-200">
            “Don't count only trees planted. Count trees that survive, remain healthy, and are cared for.”
          </span>
        </div>
      </div>

      {/* 1. Why TreeScore Exists */}
      <section className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200/80 space-y-3">
        <h2 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
            1
          </span>
          <span>Why TreeView Index™ Exists</span>
        </h2>
        <p className="text-xs leading-relaxed text-stone-600">
          Traditional afforestation programs focus almost entirely on the initial planting event. Millions of
          seedlings are announced on paper, yet over 70% perish within the first year due to lack of aftercare,
          water scarcity, or false reporting. TreeView Index™ changes the incentives by treating planting as
          only the first step (10 points). True leadership is earned through verified survival, health, and
          multi-year stewardship.
        </p>
      </section>

      {/* 2. Six Scoring Components */}
      <section className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200/80 space-y-4">
        <h2 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
            2
          </span>
          <span>The Six Independent Scoring Components</span>
        </h2>
        <p className="text-xs text-stone-600">
          Every registered tree receives a dynamic score from 0 to 100 calculated from six auditable pillars:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
            <div className="flex items-center justify-between font-extrabold text-stone-900">
              <span className="flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>A. Verified Planting</span>
              </span>
              <span className="text-emerald-700">10 pts max</span>
            </div>
            <p className="text-stone-500 text-[11.5px] leading-relaxed">
              Tree registration (2), botanical species identification (1), planting timestamp (1), baseline
              photograph (2), GPS coordinate capture (2), and complete planter/land classification metadata (2).
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
            <div className="flex items-center justify-between font-extrabold text-stone-900">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>B. Location & Identity</span>
              </span>
              <span className="text-blue-700">10 pts max</span>
            </div>
            <p className="text-stone-500 text-[11.5px] leading-relaxed">
              Confidence in physical traceability: GPS accuracy curve (&le;10m: 8 pts, 10-20m: 7 pts, 20-50m: 4
              pts) + physical Tree ID / QR tag association (2 pts).
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
            <div className="flex items-center justify-between font-extrabold text-stone-900">
              <span className="flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-purple-600" />
                <span>C. Monitoring Compliance</span>
              </span>
              <span className="text-purple-700">15 pts max</span>
            </div>
            <p className="text-stone-500 text-[11.5px] leading-relaxed">
              Ratio of valid monthly checks completed versus due dates: (Valid Checks / Checks Due) &times; 15 pts.
              Includes an administrator-configurable 7-day grace period.
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
            <div className="flex items-center justify-between font-extrabold text-stone-900">
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-600" />
                <span>D. Verified Survival</span>
              </span>
              <span className="text-rose-700">35 pts max</span>
            </div>
            <p className="text-stone-500 text-[11.5px] leading-relaxed">
              The core pillar. Awarded along a progressive survival curve based on verified living days,
              interpolating smoothly between 1, 3, 6, 12, 18, 24, and 36-month survival thresholds.
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
            <div className="flex items-center justify-between font-extrabold text-stone-900">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>E. Health & Growth</span>
              </span>
              <span className="text-teal-700">20 pts max</span>
            </div>
            <p className="text-stone-500 text-[11.5px] leading-relaxed">
              AI-assisted indicative foliage and canopy analysis: Healthy (20), Moderate Stress (14), Poor Health
              (8), Severe Stress (4). Consecutive healthy audits build multi-month confidence.
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
            <div className="flex items-center justify-between font-extrabold text-stone-900">
              <span className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-amber-600" />
                <span>F. Care & Maintenance</span>
              </span>
              <span className="text-amber-700">10 pts max</span>
            </div>
            <p className="text-stone-500 text-[11.5px] leading-relaxed">
              Watering records (2), tree guard protection (2), organic mulch rings (2), soil amendment logs (2),
              care plan assignment (1), and caretaker continuity (1).
            </p>
          </div>
        </div>
      </section>

      {/* 3. Progressive Survival Milestones */}
      <section className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200/80 space-y-3">
        <h2 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
            3
          </span>
          <span>Progressive Survival Curve (Max 35 pts)</span>
        </h2>
        <p className="text-xs text-stone-600">
          Survival points are never granted upfront. Points accumulate as the tree demonstrates sustained life
          with linear interpolation between milestones:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
          <div className="p-2.5 bg-stone-50 rounded-xl border text-center">
            <span className="text-stone-400 font-bold block text-[10px]">Planting</span>
            <strong className="text-stone-800 font-extrabold text-sm">0 pts</strong>
          </div>
          <div className="p-2.5 bg-stone-50 rounded-xl border text-center">
            <span className="text-stone-400 font-bold block text-[10px]">1 Month</span>
            <strong className="text-stone-800 font-extrabold text-sm">3 pts</strong>
          </div>
          <div className="p-2.5 bg-stone-50 rounded-xl border text-center">
            <span className="text-stone-400 font-bold block text-[10px]">3 Months</span>
            <strong className="text-stone-800 font-extrabold text-sm">7 pts</strong>
          </div>
          <div className="p-2.5 bg-stone-50 rounded-xl border text-center">
            <span className="text-stone-400 font-bold block text-[10px]">6 Months</span>
            <strong className="text-stone-800 font-extrabold text-sm">12 pts</strong>
          </div>
          <div className="p-2.5 bg-stone-50 rounded-xl border text-center">
            <span className="text-stone-400 font-bold block text-[10px]">12 Months</span>
            <strong className="text-stone-800 font-extrabold text-sm">20 pts</strong>
          </div>
          <div className="p-2.5 bg-stone-50 rounded-xl border text-center">
            <span className="text-stone-400 font-bold block text-[10px]">18 Months</span>
            <strong className="text-stone-800 font-extrabold text-sm">25 pts</strong>
          </div>
          <div className="p-2.5 bg-stone-50 rounded-xl border text-center">
            <span className="text-stone-400 font-bold block text-[10px]">24 Months</span>
            <strong className="text-stone-800 font-extrabold text-sm">29 pts</strong>
          </div>
          <div className="p-2.5 bg-emerald-50 border-emerald-300 rounded-xl border text-center">
            <span className="text-emerald-700 font-bold block text-[10px]">36+ Months</span>
            <strong className="text-emerald-900 font-black text-sm">35 pts</strong>
          </div>
        </div>
      </section>

      {/* 4. TreeView Established Milestone */}
      <section className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200/80 space-y-3">
        <h2 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
            4
          </span>
          <span>TreeView Established™ Milestone Criteria</span>
        </h2>
        <p className="text-xs text-stone-600 leading-relaxed">
          A tree is officially designated as <strong>TreeView Established™</strong> only when all seven criteria
          are simultaneously fulfilled:
        </p>

        <ul className="text-xs space-y-1.5 text-stone-700 list-disc list-inside bg-stone-50 p-4 rounded-2xl border border-stone-200">
          <li><strong>Age:</strong> Minimum 36 months since verified planting date.</li>
          <li><strong>Survival:</strong> Actively verified alive with no dead or missing declaration.</li>
          <li><strong>Audit Volume:</strong> Minimum of 24 valid photographic check-in audits recorded.</li>
          <li><strong>Geofence Integrity:</strong> No unresolved major GPS distance exceptions (&gt;25m tolerance).</li>
          <li><strong>Health Vigor:</strong> Canopy condition not classified as dead or severe stress.</li>
          <li><strong>Botanical Identification:</strong> Native species verified with high arborist confidence.</li>
          <li><strong>Monitoring Compliance:</strong> Minimum 65%+ audit completion compliance achieved.</li>
        </ul>
      </section>

      {/* 5. Honest Reporting & Mortality Rules */}
      <section className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200/80 space-y-3">
        <h2 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
            5
          </span>
          <span>Honest Reporting Principle & Lifetime Score Preservation</span>
        </h2>
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-2 leading-relaxed">
          <p className="font-extrabold">
            Critical Rule: Overdue Check-in &ne; Dead. No Photo &ne; Dead.
          </p>
          <p>
            If a check-in is overdue, the tree enters <strong>Verification Pending</strong>. TreeView never
            automatically marks a tree dead simply because an audit is delayed.
          </p>
          <p>
            When a tree genuinely perishes, caretakers are actively rewarded for transparency with{' '}
            <strong>+2 Honest Reporting Integrity Points</strong> on their GuardianScore. The tree's historical
            lifetime score and survival days are permanently locked and displayed (e.g.{' '}
            <em>"Lifetime TreeView Index: 47 — Verified alive for 14 months"</em>). TreeView never erases historical
            records or penalizes caretakers for honest mortality reporting.
          </p>
        </div>
      </section>

      {/* 6. Geographic Leaderboard & Bayesian Shrinkage */}
      <section className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200/80 space-y-3">
        <h2 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
            6
          </span>
          <span>Bayesian Shrinkage & Leaderboard Integrity</span>
        </h2>
        <p className="text-xs text-stone-600 leading-relaxed">
          To prevent statistical distortion (e.g. a town with only 10 trees scoring 95% outranking an entire
          metropolis with 50,000 verified trees), rankings are calculated using a conservative Bayesian
          confidence formula:
        </p>

        <div className="p-3 bg-stone-900 text-emerald-300 font-mono text-xs rounded-xl text-center">
          AdjustedScore = (n / (n + 1000)) &times; LocalScore + (1000 / (n + 1000)) &times; NationalAverage
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          Minimum sample thresholds apply before an entity enters major leaderboards (Cities: 100 trees,
          Districts: 500 trees, States: 5,000 trees, National: 25,000 trees). If an area has not yet met the
          threshold, its data remains completely transparent and displays{' '}
          <em>"Needs X more eligible trees"</em>.
        </p>
      </section>

      {/* 7. Anti-Gaming Architecture */}
      <section className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200/80 space-y-3">
        <h2 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
            7
          </span>
          <span>Anti-Gaming Fraud Protection</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-stone-50 rounded-2xl border space-y-1">
            <strong className="text-stone-900 block font-bold">1. Geofence Boundary Check</strong>
            <p className="text-stone-500 text-[11px]">
              If current coordinates drift beyond the registered radius (default 25m), points are withheld and
              the audit is flagged as a Verification Exception.
            </p>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-2xl border space-y-1">
            <strong className="text-stone-900 block font-bold">2. Image Reuse Detection</strong>
            <p className="text-stone-500 text-[11px]">
              Cryptographic perceptual hashing detects duplicate or reused photographs across different trees or
              months and automatically sends them to the review queue.
            </p>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-2xl border space-y-1">
            <strong className="text-stone-900 block font-bold">3. Same-Tree AI Similarity</strong>
            <p className="text-stone-500 text-[11px]">
              Trunk bifurcation, bark texture, and background landmarks are analyzed. Audits below 70% confidence
              are routed for human arborist verification.
            </p>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-2xl border space-y-1">
            <strong className="text-stone-900 block font-bold">4. Immutable Audit Trail</strong>
            <p className="text-stone-500 text-[11px]">
              No historical verification or score is ever deleted. Any review adjustment is logged with arborist
              name, timestamp, and audit rationale.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200">
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="px-4 py-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all"
          >
            &larr; Back to Home Dashboard
          </button>
        )}
        {onExploreLeaderboard && (
          <button
            onClick={onExploreLeaderboard}
            className="px-5 py-2.5 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>Explore TreeView Green Leaders</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
