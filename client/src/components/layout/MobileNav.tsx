import React from 'react';
import { Home, Trees, PlusCircle, MapPin, Layers, Camera } from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onPlantTreeClick: () => void;
  onScanQRClick: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  setCurrentTab,
  onPlantTreeClick,
  onScanQRClick,
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-emerald-900/10 py-2 px-3 flex items-center justify-around shadow-lg">
      <button
        onClick={() => setCurrentTab('home')}
        className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-all ${
          currentTab === 'home' ? 'text-emerald-700' : 'text-stone-500 hover:text-stone-900'
        }`}
      >
        <Home className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5]' : ''}`} />
        <span>Home</span>
      </button>

      <button
        onClick={() => setCurrentTab('trees')}
        className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-all ${
          currentTab === 'trees' ? 'text-emerald-700' : 'text-stone-500 hover:text-stone-900'
        }`}
      >
        <Trees className={`w-5 h-5 ${currentTab === 'trees' ? 'stroke-[2.5]' : ''}`} />
        <span>Trees</span>
      </button>

      {/* Center Primary Action: Plant / Register Tree */}
      <button
        onClick={onPlantTreeClick}
        className="flex flex-col items-center -mt-5 group"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-all">
          <PlusCircle className="w-6 h-6 stroke-[2.5]" />
        </div>
        <span className="text-[10px] font-bold text-emerald-800 mt-0.5">+ Plant</span>
      </button>

      <button
        onClick={() => setCurrentTab('map')}
        className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-all ${
          currentTab === 'map' ? 'text-emerald-700' : 'text-stone-500 hover:text-stone-900'
        }`}
      >
        <MapPin className={`w-5 h-5 ${currentTab === 'map' ? 'stroke-[2.5]' : ''}`} />
        <span>Map</span>
      </button>

      <button
        onClick={onScanQRClick}
        className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-stone-500 hover:text-emerald-700 transition-all"
        title="Open Camera to photograph and verify trees"
      >
        <Camera className="w-5 h-5 text-emerald-700" />
        <span>Camera</span>
      </button>
    </div>
  );
};
