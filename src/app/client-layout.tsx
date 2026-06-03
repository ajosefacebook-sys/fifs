'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { AlertPopup } from '@/components/shared/AlertPopup';
import { useAlerts } from '@/hooks/useAlerts';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { useAlertStore } from '@/store/useAlertStore';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/flows': 'Flows',
  '/people': 'People',
  '/projects': 'Projects',
  '/analytics': 'Analytics',
};

export function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { activeAlert, isOpen, markDone, snooze, escalate, dismissAlert } = useAlerts();
  const { isOnline, queueLength } = useOfflineSync();
  const { loadAlerts } = useAlertStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadAlerts();
  }, [loadAlerts]);

  const showNav = mounted && ['/dashboard', '/flows', '/people', '/projects', '/analytics'].includes(pathname);

  return (
    <>
      <div className="flex">
        {showNav && <Sidebar isOnline={isOnline} queueLength={queueLength} />}
        <main className={`flex-1 ${showNav ? 'pb-20 md:pb-0' : ''}`}>
          {showNav && (
            <header className="sticky top-0 z-30 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[rgba(212,168,67,0.1)] px-4 md:px-6 py-3">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-bold text-lg">{pageTitles[pathname] || 'FIFS'}</h2>
                {queueLength > 0 && (
                  <span className="text-[#EAB308] text-xs bg-[rgba(234,179,8,0.15)] px-2 py-1 rounded-lg">
                    {queueLength} actions pending sync
                  </span>
                )}
              </div>
            </header>
          )}
          <div className="p-4 md:p-6 max-w-7xl mx-auto">{mounted ? children : null}</div>
        </main>
      </div>
      {showNav && <BottomNav />}
      {isOpen && activeAlert && (
        <AlertPopup
          alert={activeAlert}
          onMarkDone={markDone}
          onSnooze={(id) => snooze(id)}
          onEscalate={escalate}
          onDismiss={dismissAlert}
        />
      )}
    </>
  );
}
