import React, { createContext, useContext, useEffect, useState } from 'react';
import { registerTree, submitVerification } from '../api';

interface QueuedItem {
  id: string;
  type: 'registration' | 'verification';
  payload: any;
  queuedAt: string;
}

interface OfflineContextType {
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  pendingQueue: QueuedItem[];
  queueRegistration: (payload: any) => void;
  queueVerification: (payload: any) => void;
  syncPendingItems: () => Promise<void>;
  isSyncing: boolean;
  lastSyncMessage: string | null;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false);
  const [pendingQueue, setPendingQueue] = useState<QueuedItem[]>(() => {
    try {
      const saved = localStorage.getItem('treesurvive_offline_queue');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncMessage, setLastSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('treewatch_offline_queue', JSON.stringify(pendingQueue));
  }, [pendingQueue]);

  // When returning online, trigger automatic background sync
  useEffect(() => {
    if (!isOffline && pendingQueue.length > 0 && !isSyncing) {
      syncPendingItems();
    }
  }, [isOffline]);

  const queueRegistration = (payload: any) => {
    const item: QueuedItem = {
      id: `QUE-${Date.now()}`,
      type: 'registration',
      payload,
      queuedAt: new Date().toISOString(),
    };
    setPendingQueue((prev) => [...prev, item]);
    setLastSyncMessage(`Tree registration saved locally (Offline mode). Will sync automatically.`);
  };

  const queueVerification = (payload: any) => {
    const item: QueuedItem = {
      id: `QUE-${Date.now()}`,
      type: 'verification',
      payload,
      queuedAt: new Date().toISOString(),
    };
    setPendingQueue((prev) => [...prev, item]);
    setLastSyncMessage(`Verification record saved locally (Offline mode). Will sync automatically.`);
  };

  const syncPendingItems = async () => {
    if (pendingQueue.length === 0) return;
    setIsSyncing(true);
    setLastSyncMessage('Synchronizing offline tree records with server...');

    try {
      for (const item of pendingQueue) {
        if (item.type === 'registration') {
          await registerTree(item.payload);
        } else if (item.type === 'verification') {
          await submitVerification(item.payload);
        }
      }
      setLastSyncMessage(`Successfully synced ${pendingQueue.length} records to the central audit registry.`);
      setPendingQueue([]);
    } catch (err) {
      setLastSyncMessage('Sync encountered an error. Will retry when connection stabilizes.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <OfflineContext.Provider
      value={{
        isOffline,
        setIsOffline,
        pendingQueue,
        queueRegistration,
        queueVerification,
        syncPendingItems,
        isSyncing,
        lastSyncMessage,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) throw new Error('useOffline must be used within an OfflineProvider');
  return context;
};
