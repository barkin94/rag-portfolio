'use client'

import { ReactNode } from 'react';

import { CancelIcon, HamburgerIcon } from '../Icons';

interface SideBarProps {
  isOpen: boolean;
  onHamburgerClick: () => void;
  onCloseClick: () => void;
  children: ReactNode;
}

export default function SideBar({ children, isOpen, onHamburgerClick, onCloseClick }: SideBarProps) {
  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={onHamburgerClick}
        className="p-2 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
       <HamburgerIcon className="w-6 h-6" />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 h-screen bg-black/50 z-40"
          onClick={onCloseClick}
        />
      )}

      {/* Mobile Sidebar Menu */}
      <div
        className={`
          absolute top-0 right-0 w-64 h-screen bg-background border-l border-slate-200 dark:border-slate-700/50
          z-50 transition-transform duration-300 ease-in-out px-4 shadow-blue-700/30
          ${isOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Menu</h3>
            <button
              onClick={onCloseClick}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close menu"
            >
              <CancelIcon />
            </button>
          </div>

          {/* Sidebar Content - Children */}
          <div className="overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

