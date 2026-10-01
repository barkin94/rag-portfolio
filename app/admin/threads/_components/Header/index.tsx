'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import HeaderContainer from '@/common/components/HeaderContainer';
import { LeftArrowIcon, RefreshIcon, WrenchIcon } from '@/common/components/Icons';
import Link from 'next/link';
import AdminSideBar from '../SideBar';

interface AdminHeaderProps {
  maintenance: boolean;
}

type SyncState = 'idle' | 'pending';

interface SyncStatusData {
  synced: boolean;
  status?: 'success' | 'failed' | 'pending';
  timestamp?: string;
  details?: string;
}

const POLLING_INTERVAL_MS = 10_000;

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function AdminHeader({ maintenance: initialMaintenance }: AdminHeaderProps) {
  const [maintenance, setMaintenance] = useState(initialMaintenance);
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<string | null>(null);
  const [syncDetails, setSyncDetails] = useState<string>('');

  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pollSyncStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/sync-status', { credentials: 'include' });
      if (res.ok) {
        const data: SyncStatusData = await res.json();
        if (data.synced && data.status) {
          if (data.status === 'success' || data.status === 'failed') {
            setSyncState('idle');
            setSyncDetails(data.details || '');
            setLastSyncTimestamp(data.timestamp || null);
          }
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  const clearPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    if (pollIntervalRef.current) return;
    pollIntervalRef.current = setInterval(() => {
      pollSyncStatus();
    }, POLLING_INTERVAL_MS);
  }, [pollSyncStatus]);

  const stopPolling = useCallback(() => {
    clearPolling();
  }, [clearPolling]);

  const fetchLastSyncInfo = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/sync-status', { credentials: 'include' });
      if (res.ok) {
        const data: SyncStatusData = await res.json();
        if (data.synced) {
          if (data.timestamp) {
            setLastSyncTimestamp(data.timestamp);
            setSyncDetails(data.details || '');
          }
          if (data.status === 'pending') {
            setSyncState('pending');
          }
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    setTimeout(fetchLastSyncInfo, 0);
  }, [fetchLastSyncInfo]);

  useEffect(() => {
    if (syncState === 'pending') {
      startPolling();
    } else {
      stopPolling();
    }
    return () => stopPolling();
  }, [syncState, startPolling, stopPolling]);

  const toggleMaintenance = useCallback(async () => {
    const newState = !maintenance;
    setMaintenance(newState);
    try {
      await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ enabled: newState }),
      });
    } catch {
      setMaintenance(maintenance);
    }
  }, [maintenance]);

  const handleSyncCv = useCallback(async () => {
    setSyncState('pending');
    setSyncDetails('Syncing...');
    try {
      const res = await fetch('/api/admin/sync-cv', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setSyncState('idle');
        setSyncDetails(data.error || 'Failed to start sync');
      }
    } catch (error) {
      setSyncState('idle');
      setSyncDetails(error instanceof Error ? error.message : 'Failed to start sync');
    }
  }, []);

  const syncButtonIcon = useMemo(() => (
    <RefreshIcon className={syncState === 'pending' ? 'animate-spin w-5 h-5' : 'w-5 h-5'} />
  ), [syncState]);

  return (
    <HeaderContainer>
      <div className="flex items-center p-4 w-full">
        <Link
          href="/"
          title="Go back"
          className="mr-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground rounded-full w-8 h-8 flex items-center justify-center shadow focus:outline-none cursor-pointer"
          aria-label="Go back"
        >
          <LeftArrowIcon className="w-4 h-4" />
        </Link>

        <div className="grow"></div>

        {/* Sync CV button */}
        <div className="relative group">
          <button
            onClick={handleSyncCv}
            disabled={syncState === 'pending'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              syncState === 'pending'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 cursor-wait'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            aria-label="Sync CV from Google Docs"
          >
            <span className="w-5 h-5 flex items-center justify-center">
              {syncButtonIcon}
            </span>
            <span>
              {syncState === 'pending' ? 'Syncing...' : 'Sync CV'}
            </span>
          </button>

          {/* Sync status tooltip on hover */}
          {lastSyncTimestamp && (
            <div className="absolute right-0 top-full mt-2 z-10 w-72 bg-slate-900 dark:bg-slate-700 text-slate-100 dark:text-slate-300 text-xs rounded-lg shadow-lg py-2 px-3 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 pointer-events-none">
              <div className="font-medium mb-1">Last sync</div>
              <div className="text-slate-400 dark:text-slate-500">{formatTimestamp(lastSyncTimestamp)}</div>
              {syncDetails && <div className="mt-1 text-slate-400 dark:text-slate-500">{syncDetails}</div>}
            </div>
          )}
        </div>

        {/* Maintenance toggle */}
        <button
          onClick={toggleMaintenance}
          className={`ml-3 flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            maintenance
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          } hover:opacity-80`}
          aria-label={maintenance ? 'Disable maintenance mode' : 'Enable maintenance mode'}
        >
          <span className="w-5 h-5 flex items-center justify-center">
            <WrenchIcon className={maintenance ? 'w-5 h-5' : 'w-4 h-4'} />
          </span>
          <span>{maintenance ? 'Maintenance ON' : 'Maintenance OFF'}</span>
        </button>

        <AdminSideBar />
      </div>
    </HeaderContainer>
  );
}