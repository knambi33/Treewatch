import React from 'react';
import { useView } from '../../context/ViewContext';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export const DeviceFrameToggle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { deviceMode } = useView();

  if (deviceMode === 'desktop') {
    return <div className="w-full min-h-[calc(100vh-64px)] pb-16 md:pb-0">{children}</div>;
  }

  return (
    <div className="py-6 px-2 flex justify-center items-start min-h-[calc(100vh-64px)] overflow-x-hidden">
      {/* Smartphone Outer Chassis */}
      <div className="w-full max-w-[420px] bg-stone-900 p-3 rounded-[3rem] shadow-2xl border-4 border-stone-800 relative ring-1 ring-white/10">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-5 inset-x-0 mx-auto w-28 h-4 bg-black rounded-full z-50 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-stone-900 border border-stone-800 ml-auto mr-2" />
        </div>

        {/* Smartphone Screen Viewport */}
        <div className="bg-stone-50 rounded-[2.3rem] overflow-hidden border border-stone-200 relative min-h-[740px] max-h-[840px] flex flex-col shadow-inner">
          {/* Mobile Status Bar */}
          <div className="bg-white/80 backdrop-blur-xs px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-bold text-stone-900 z-40 border-b border-stone-100">
            <span>09:41</span>
            <div className="flex items-center gap-1.5 text-stone-700">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <BatteryMedium className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Screen Scrollable Body */}
          <div className="flex-1 overflow-y-auto pb-20">{children}</div>
        </div>
      </div>
    </div>
  );
};
