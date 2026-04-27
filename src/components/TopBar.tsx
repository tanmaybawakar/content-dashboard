'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSidebar } from '../hooks/useSidebar';

export default function TopBar() {
  const { isCollapsed, toggleCollapse } = useSidebar();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className={`top-bar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="top-bar-content">
        <div className="breadcrumb">
          <Link href="/">Dashboard</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="text-secondary">Home</span>
        </div>

        <div className="flex-1">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input w-full max-w-md"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="notification-bell">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15 17h5l-1.405-1.405A6.97 6.97 0 0018 11c0-3.866-3.134-7-7-7s-7 3.134-7 7c0 3.866 3.134 7 7 7zm0 2a7.968 7.968 0 005.656-2.344L20 16h-4v2z" />
            </svg>
          </button>

          <div className="live-indicator"></div>
        </div>
      </div>
    </header>
  );
}