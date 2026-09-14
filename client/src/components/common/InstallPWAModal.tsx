import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  X,
  CheckCircle2,
  Share,
  PlusSquare,
  Sparkles,
  WifiOff,
  Camera,
  ShieldCheck,
} from 'lucide-react';

interface InstallPWAModalProps {
  onClose: () => void;
  deferredPrompt: any;
  onInstallAccepted?: () => void;
}

export const InstallPWAModal: React.FC<InstallPWAModalProps> = ({
  onClose,
  deferredPrompt,
  onInstallAccepted,
}) => {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Detect if already installed / running in standalone display mode
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);

    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('[TreeWatch PWA] User accepted the install prompt');
        if (onInstallAccepted) onInstallAccepted();
        onClose();
      } else {
        console.log('[TreeWatch PWA] User dismissed the install prompt');
      }
    } catch (err) {
      console.error('[TreeWatch PWA] Install error:', err);
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-stone-200 relative my-6 text-stone-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Icon */}
        <div className="flex items-center gap-3.5 mb-5">
          <img
            src="/pwa-icon.svg"
            alt="TreeWatch App Icon"
            className="w-14 h-14 rounded-2xl shadow-md shadow-emerald-900/20 border border-emerald-500/30"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-emerald-950">TreeWatch</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-bold rounded-md">
                PWA Mobile
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Install directly to your phone's home screen
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="space-y-2.5 mb-6">
          <div className="flex items-start gap-3 p-2.5 bg-stone-50 rounded-2xl border border-stone-200/70 text-xs">
            <Camera className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-stone-900">Instant Camera Geotagging</p>
              <p className="text-[11px] text-stone-500">
                1-tap access to photograph, audit, and verify trees in the field.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 bg-stone-50 rounded-2xl border border-stone-200/70 text-xs">
            <WifiOff className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-stone-900">Rural Offline Mode</p>
              <p className="text-[11px] text-stone-500">
                Log trees in remote forests with zero signal; auto-syncs when back online.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 bg-stone-50 rounded-2xl border border-stone-200/70 text-xs">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-stone-900">Fast & Secure</p>
              <p className="text-[11px] text-stone-500">
                Uses less than 5 MB of phone storage. No app store download required.
              </p>
            </div>
          </div>
        </div>

        {/* Installation Instruction Section */}
        {isStandalone ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-sm font-bold text-emerald-950">App Already Installed!</p>
            <p className="text-xs text-emerald-800">
              You are running the full TreeWatch Progressive Web App on your device.
            </p>
          </div>
        ) : isIOS ? (
          /* iOS Step-by-Step Instructions */
          <div className="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>How to Install on iPhone / iPad:</span>
            </div>
            <ol className="space-y-2 text-xs text-stone-700">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  1
                </span>
                <span>
                  Tap the <strong className="text-stone-900">Share</strong> button{' '}
                  <Share className="w-3.5 h-3.5 inline text-blue-600" /> at the bottom of Safari.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  2
                </span>
                <span>
                  Scroll down and tap{' '}
                  <strong className="text-stone-900">"Add to Home Screen"</strong>{' '}
                  <PlusSquare className="w-3.5 h-3.5 inline text-stone-700" />.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  3
                </span>
                <span>
                  Tap <strong className="text-stone-900">"Add"</strong> in the top right corner.
                </span>
              </li>
            </ol>
          </div>
        ) : deferredPrompt ? (
          /* Android / Chrome Native Install Button */
          <button
            onClick={handleInstallClick}
            disabled={installing}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white text-sm font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25 transition-all"
          >
            <Download className={`w-4 h-4 ${installing ? 'animate-bounce' : ''}`} />
            <span>{installing ? 'Opening App Installer...' : 'Install TreeWatch App'}</span>
          </button>
        ) : (
          /* Fallback for Desktop or unsupported prompt */
          <div className="p-3 bg-stone-100 rounded-2xl text-center space-y-1.5 text-xs text-stone-600">
            <p className="font-semibold text-stone-800">
              Install via your browser's address bar icon:
            </p>
            <p className="text-[11px]">
              Look for the <strong>Install</strong> or <strong>[+]</strong> icon in your URL bar, or click your browser menu &rarr; <em>"Install TreeWatch"</em>.
            </p>
          </div>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-stone-500 hover:text-stone-800"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};
