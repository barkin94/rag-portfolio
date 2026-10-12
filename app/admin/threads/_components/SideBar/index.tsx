'use client';

import React, { useState } from "react";

import ToggleableSideBar from "@/common/components/SideBar";
import Link from "next/link";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    href: "/admin/chunks",
    label: "Chunks",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
  },
  {
    href: "/admin/threads",
    label: "Threads",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

interface AdminSideBarProps {
  currentPage?: string;
}

const AdminSideBar: React.FC<AdminSideBarProps> = ({ currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onHamburgerClick = () => {
    setIsOpen(true);
  };

  const closeSideBar = () => setIsOpen(false);

  const getActiveHref = () => {
    const path = currentPage || '';
    if (path.startsWith('/admin/chunks')) return '/admin/chunks';
    if (path.startsWith('/admin/threads')) return '/admin/threads';
    return '/admin/chunks';
  };

  const activeHref = getActiveHref();

  return (
    <ToggleableSideBar
      isOpen={isOpen}
      onHamburgerClick={onHamburgerClick}
      onCloseClick={closeSideBar}
    >
      <nav className="py-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeHref === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-foreground/10 text-foreground"
                      : "text-foreground/80 hover:bg-foreground/5"
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </ToggleableSideBar>
  );
};

export default AdminSideBar;