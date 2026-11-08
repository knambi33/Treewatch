import React, { useState, useEffect } from 'react';
import { Sparkles, X, Sprout, Heart, Flame } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface DeepavaliBannerProps {
  onPlantTreeClick?: () => void;
}

export const DeepavaliBanner: React.FC<DeepavaliBannerProps> = ({ onPlantTreeClick }) => {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('treeview_deepavali_banner_dismissed') !== 'true';
    } catch {
      return true;
    }
  });

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem('treeview_deepavali_banner_dismissed', 'true');
    } catch {
      // Ignore
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <aside
      aria-label="Happy Deepavali Festive Greeting"
      className="relative overflow-hidden bg-gradient-to-r from-amber-950 via-orange-950 to-emerald-950 text-amber-50 border-b border-amber-500/40 shadow-md animate-fadeIn transition-all"
    >
      {/* Decorative Golden Ambient Glows */}
      <div
        aria-hidden="true"
        className="absolute -top-12 -left-12 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-20 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 sm:px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        {/* Left Diya & Greeting Content */}
        <div className="flex items-center gap-3.5 max-w-4xl">
          {/* Animated Traditional Diya Lamp */}
          <div className="relative shrink-0 flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/30 via-orange-600/30 to-amber-700/30 border border-amber-400/40 shadow-inner">
            <span className="text-2xl filter drop-shadow-[0_2px_8px_rgba(251,191,36,0.6)] animate-pulse">
              🪔
            </span>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-xs">
                <Flame className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                <span>{t('deepavaliBadge')}</span>
              </span>
              <span className="text-[11px] font-semibold text-emerald-300/90 hidden sm:inline-flex items-center gap-1">
                <span>•</span>
                <span>{t('deepavaliEcoTip')}</span>
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-extrabold text-amber-100 tracking-tight flex items-center justify-center md:justify-start gap-1.5 flex-wrap">
              <span>{t('deepavaliHeadline')}</span>
            </h3>

            <p className="text-xs text-amber-200/90 leading-relaxed font-normal">
              {t('deepavaliGreeting')}
            </p>
          </div>
        </div>

        {/* Right Action & Dismiss Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-center md:self-auto">
          {onPlantTreeClick && (
            <button
              onClick={onPlantTreeClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-stone-950 font-bold text-xs rounded-xl shadow-md shadow-amber-900/30 hover:scale-105 transition-all"
            >
              <Sprout className="w-3.5 h-3.5 text-stone-950" />
              <span>{t('deepavaliPlantWish')}</span>
            </button>
          )}

          <button
            onClick={handleDismiss}
            aria-label="Close festive greeting banner"
            className="p-1.5 rounded-lg text-amber-300/70 hover:text-amber-100 hover:bg-white/10 transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
