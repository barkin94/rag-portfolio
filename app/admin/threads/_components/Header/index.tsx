'use client';

import React, { useState } from 'react';
import HeaderContainer from '@/common/components/HeaderContainer';
import { LeftArrowIcon } from '@/common/components/Icons';
import Link from 'next/link';
import AdminSideBar from '../SideBar';

interface AdminHeaderProps {
  maintenance: boolean;
}

export default function AdminHeader({ maintenance: initialMaintenance }: AdminHeaderProps) {
  const [maintenance, setMaintenance] = useState(initialMaintenance);

  const toggleMaintenance = async () => {
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
  };

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

        {/* Maintenance toggle */}
        <button
          onClick={toggleMaintenance}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            maintenance
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          } hover:opacity-80`}
          aria-label={maintenance ? 'Disable maintenance mode' : 'Enable maintenance mode'}
        >
          <span className="w-5 h-5 flex items-center justify-center">
            <svg
              className={maintenance ? 'w-5 h-5' : 'w-4 h-4'}
              fill={maintenance ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </span>
          <span>{maintenance ? 'Maintenance ON' : 'Maintenance OFF'}</span>
        </button>

        <AdminSideBar />
      </div>
    </HeaderContainer>
  );
}
