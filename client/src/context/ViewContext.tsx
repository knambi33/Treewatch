import React, { createContext, useContext, useState } from 'react';

export type DeviceMode = 'desktop' | 'mobile';

interface ViewContextType {
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  toggleDeviceMode: () => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');

  const toggleDeviceMode = () => {
    setDeviceMode((prev) => (prev === 'desktop' ? 'mobile' : 'desktop'));
  };

  return (
    <ViewContext.Provider value={{ deviceMode, setDeviceMode, toggleDeviceMode }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useView = () => {
  const context = useContext(ViewContext);
  if (!context) throw new Error('useView must be used within a ViewProvider');
  return context;
};
