import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Award,
  TrendingUp,
  MapPin,
  Heart,
  Activity,
  Camera,
  Trees,
  Sparkles,
  ShieldCheck,
  Search,
  Filter,
  Users,
  Building2,
  GraduationCap,
  Info,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { fetchLeaderboard } from '../api';
import { GeoScore } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LeaderboardPageProps {
  onSelectTree?: (treeId: string) => void;
  onOpenMethodology?: () => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  onOpenMethodology,
}) => {
  const { t } = useLanguage();
  const [currentLevel, setCurrentLevel] = useState<string>('individual'); // Individual as Prime Driver!
  const [currentCompetition, setCurrentCompetition] = useState<string>('overall');
  const [timeRange, setTimeRange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [leaderboard, setLeaderboard] = useState<GeoScore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showBayesianExplanation, setShowBayesianExplanation] = useState<boolean>(false);

  const loadLeaderboardData = async () => {
    setLoading(true);
    try {
      const res = await fetchLeaderboard({
        level: currentLevel,
        competition: currentCompetition,
        timeRange,
      });
      if (res.success) {
        setLeaderboard(res.leaderboard || []);
      }
    } catch (err) {
      console.error('Failed to load leaderboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboardData();
  }, [currentLevel, currentCompetition, timeRange]);

  const filteredList = leaderboard.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.geoName.toLowerCase().includes(q) ||
      (item.state && item.state.toLowerCase().includes(q))
    );
  });

  const levels = [
    { id: 'individual', label: t('levelIndividual'), subtitle: t('levelIndividualSub') },
    { id: 'school', label: t('levelSchool'), subtitle: t('levelSchoolSub') },
    { id: 'ngo', label: t('levelNGO'), subtitle: t('levelNGOSub') },
    { id: 'city', label: t('levelCity'), subtitle: t('levelCitySub') },
    { id: 'district', label: t('levelDistrict'), subtitle: t('levelDistrictSub') },
    { id: 'state', label: t('levelState'), subtitle: t('levelStateSub') },
    { id: 'national', label: t('levelNational'), subtitle: t('levelNationalSub') },
  ];

  const competitions = [
    { id: 'overall', label: '🏆 Overall Score', icon: Trophy },
    { id: 'survival', label: '❤️ Survival Champion', icon: Heart },
    { id: 'health', label: '🌿 Health Champion', icon: Activity },
    { id: 'verification', label: '📷 Verification Leader', icon: Camera },
    { id: 'established', label: '🌳 Established Trees', icon: Trees },
    { id: 'most_improved', label: '🌱 Rising Green Leader', icon: Flame },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fadeIn">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Trophy className="w-4 h-4" />
              <span>{t('leaderboardSubtitle')}</span>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-md text-[10px] font-bold">
                {t('benchmarkBadge')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {t('leaderboardTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
              <strong>{t('tagline')}.</strong> Rankings are based on verified survival, tree health, consistent monitoring and stewardship — not raw planting numbers alone. Individuals are the prime drivers of our living canopy.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
              <button
                onClick={() => setShowBayesianExplanation(!showBayesianExplanation)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-300 border border-white/15 transition-all"
              >
                <Info className="w-4 h-4" />
                <span>How rankings are fairly calculated (Bayesian Shrinkage)</span>
              </button>

              {onOpenMethodology && (
                <button
                  onClick={onOpenMethodology}
                  className="flex items-center gap-1 text-xs text-stone-400 hover:text-white underline transition-colors"
                >
                  <span>Read TreeView Index™ Methodology</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Stat Pill */}
          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/15 text-center min-w-[170px] shrink-0">
            <span className="text-[10px] uppercase font-bold text-stone-300 block">Current Leaderboard</span>
            <span className="text-xl font-extrabold text-emerald-400 block mt-1">
              {levels.find((l) => l.id === currentLevel)?.label.split(' ')[1] || 'Leadership'}
            </span>
            <span className="text-[11px] text-stone-300 block mt-0.5">
              {filteredList.length} Ranked Entities
            </span>
          </div>
        </div>

        {/* Bayesian Explanation Dropdown */}
        {showBayesianExplanation && (
          <div className="mt-5 p-4 rounded-2xl bg-white/10 border border-white/15 text-xs text-stone-200 space-y-2 leading-relaxed animate-fadeIn">
            <p className="font-bold text-emerald-300">
              Fair Ranking Methodology: No "10-Tree Towns" Winning Over Millions
            </p>
            <p>
              To ensure fairness, rankings use a Bayesian confidence shrinkage model:{' '}
              <code className="bg-black/40 px-2 py-0.5 rounded text-emerald-200 font-mono">
                AdjustedScore = (n / (n + 1000)) × LocalScore + (1000 / (n + 1000)) × NationalAverage
              </code>
              . A small location with 10 trees at 95% does not artificially defeat a metropolis with
              50,000 verified surviving trees. Both Raw and Adjusted scores are transparently displayed.
            </p>
          </div>
        )}
      </div>

      {/* Leadership Level Tabs (Individual is first and highlighted as Prime Driver) */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2 shadow-xs border border-stone-200/80">
        <div className="flex items-center gap-1 overflow-x-auto">
          {levels.map((lvl) => {
            const isSelected = currentLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => setCurrentLevel(lvl.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <span>{lvl.label}</span>
                {lvl.id === 'individual' && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                    isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    PRIME
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Competition Filters & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Competitions */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {competitions.map((comp) => {
            const Icon = comp.icon;
            const isSelected = currentCompetition === comp.id;
            return (
              <button
                key={comp.id}
                onClick={() => setCurrentCompetition(comp.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
                  isSelected
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-stone-500'}`} />
                <span>{comp.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search leaderboard..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-md border border-stone-200/80 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-2">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-stone-500">Computing live Bayesian leadership rankings...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-16 text-center text-xs text-stone-500">
            No entries found matching current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50/90 text-stone-500 font-extrabold uppercase text-[10px] tracking-wider border-b border-stone-200">
                  <th className="py-3 px-4 text-center w-16">Rank</th>
                  <th className="py-3 px-4">
                    {currentLevel === 'individual' ? 'Tree Guardian / Planter' : 'Geography'}
                  </th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4 text-center">Trees</th>
                  <th className="py-3 px-4 text-center">Survival %</th>
                  <th className="py-3 px-4 text-center">Compliance</th>
                  <th className="py-3 px-4 text-center">Established</th>
                  <th className="py-3 px-4 text-right">Status / Benchmark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredList.map((item, idx) => {
                  const isTop3 = item.rank <= 3;
                  const rankMedal =
                    item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-emerald-50/40 transition-colors ${
                        isTop3 ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-4 px-4 text-center font-black text-sm">
                        <span className={isTop3 ? 'text-base' : 'text-stone-400 font-mono font-bold'}>
                          {rankMedal}
                        </span>
                      </td>

                      {/* Name & Subtitle */}
                      <td className="py-4 px-4">
                        <div className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
                          <span>{item.geoName}</span>
                          {item.badge && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-bold">
                              {item.badge}
                            </span>
                          )}
                          {item.isRisingLeader && (
                            <span className="flex items-center gap-0.5 px-2 py-0.5 bg-rose-100 text-rose-700 rounded-md text-[10px] font-extrabold">
                              <Flame className="w-3 h-3 text-rose-600" />
                              <span>Rising Leader</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-2">
                          <span>{item.state}</span>
                          {item.integrityScore !== undefined && (
                            <span className="text-emerald-700 font-bold">
                              • {item.integrityScore} Honest Integrity Points
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Score: Adjusted & Raw */}
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="text-base font-black text-emerald-800">
                            {item.adjustedScore.toFixed(1)}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono font-medium">
                            Raw: {item.rawScore.toFixed(1)}
                          </span>
                        </div>
                      </td>

                      {/* Trees count */}
                      <td className="py-4 px-4 text-center font-mono font-bold text-stone-800">
                        {item.eligibleTreeCount.toLocaleString()}
                      </td>

                      {/* Verified Survival */}
                      <td className="py-4 px-4 text-center">
                        <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 text-xs">
                          {item.verifiedSurvivalRate.toFixed(1)}%
                        </span>
                      </td>

                      {/* Monitoring Compliance */}
                      <td className="py-4 px-4 text-center font-bold text-stone-700">
                        {item.monitoringCompliance.toFixed(1)}%
                      </td>

                      {/* Established Count */}
                      <td className="py-4 px-4 text-center">
                        <span className="font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 text-xs">
                          {item.establishedCount} 🌳
                        </span>
                      </td>

                      {/* Eligibility / Benchmark Status */}
                      <td className="py-4 px-4 text-right">
                        {item.isEligibleForRanking ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100/70 text-amber-900 border border-amber-200 rounded-lg text-[10px] font-bold">
                            <span>DEMO BENCHMARK DATA</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 text-stone-500 rounded-lg text-[10px] font-semibold">
                            <span>Needs {item.minEligibleRequired - item.eligibleTreeCount} more trees</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Banner */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong>TreeView Integrity Pledge:</strong> Rankings are calculated directly from verified
            photographs, timestamped audits, and geotags. Raw planting counts alone never determine leadership.
          </span>
        </div>
        <button
          onClick={loadLeaderboardData}
          className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-900 font-bold rounded-xl border border-emerald-300 shrink-0 text-xs shadow-2xs transition-all"
        >
          Refresh Live Rankings
        </button>
      </div>
    </div>
  );
};
