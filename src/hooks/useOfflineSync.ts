'use client';

import { useState, useCallback, useEffect } from 'react';

interface OfflineQueueItem {
  id: string;
  action: string;
  data: unknown;
  timestamp: string;
}

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [queueLength, setQueueLength] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const queue = getQueue();
    setQueueLength(queue.length);
  }, []);

  const getQueue = useCallback((): OfflineQueueItem[] => {
    try {
      const data = localStorage.getItem('fifs_offline_queue');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }, []);

  const addToQueue = useCallback((action: string, data: unknown) => {
    const queue = getQueue();
    queue.push({
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      action,
      data,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('fifs_offline_queue', JSON.stringify(queue));
    setQueueLength(queue.length);
  }, [getQueue]);

  const syncQueue = useCallback(async () => {
    if (!isOnline || isSyncing) return;
    setIsSyncing(true);
    const queue = getQueue();
    try {
      for (const item of queue) {
        await processQueueItem(item);
      }
      localStorage.removeItem('fifs_offline_queue');
      setQueueLength(0);
    } catch {
      // Keep items in queue for next sync attempt
    }
    setIsSyncing(false);
  }, [isOnline, isSyncing, getQueue]);

  return { isOnline, queueLength, isSyncing, addToQueue, syncQueue };
}

async function processQueueItem(item: OfflineQueueItem): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
}
