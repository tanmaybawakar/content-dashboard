'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSidebar } from '../hooks/useSidebar';

export default function Sidebar() {
  const { isCollapsed, toggleCollapse } = useSidebar();

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">C</div>
        {!isCollapsed && <span className="text-primary">ContentoX</span>}
      </div>

      <nav className="sidebar-nav">
        <Link href="/" className="sidebar-item">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7m-2 0l-2-2m0 0l-2 2m2-2v2m-2 0h2m2 0h2" />
          </svg>
          {!isCollapsed && <span>Dashboard</span>}
        </Link>

        <Link href="/ideas" className="sidebar-item">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2v4a2 2 0 002 2h6a2 2 0 002-2v-4h2a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002-2h2a2 2 0 002 2m-3 7h3m-3 4h3m-6-4h6m-6-4h6" />
          </svg>
          {!isCollapsed && <span>Ideas Lab</span>}
        </Link>

        <Link href="/competitors" className="sidebar-item">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 20h-3v-8h3v8zm-6 0h-3v-8h3v8zm-6 0h-3v-8h3v8zm12-12h-3v-8h3v8zm-6 0h-3v-8h3v8zm-6 0h-3v-8h3v8z" />
          </svg>
          {!isCollapsed && <span>Competitor Intel</span>}
        </Link>

        <Link href="/calendar" className="sidebar-item">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 7V3m8 4V3m6 6h-2m-6 6h-2m-6 6h-2" />
          </svg>
          {!isCollapsed && <span>Content Calendar</span>}
        </Link>

        <Link href="/trends" className="sidebar-item">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 7h8v6h-8V7z" />
            <path d="M13 15h8v6h-8v-6z" />
            <path d="M5 7h8v6H5V7z" />
            <path d="M5 15h8v6H5v-6z" />
          </svg>
          {!isCollapsed && <span>Trend Intelligence</span>}
        </Link>

        <Link href="/discuss" className="sidebar-item">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 10h8v6h-8v-6z" />
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c1.5 0 2.87.52 3.98 1.32L12 10 8.02 5.32C9.13 4.52 10.5 4 12 4zm0 16c-1.5 0-2.87-.52-3.98-1.32L12 14l3.98 4.68C14.87 19.48 13.5 20 12 20z" />
          </svg>
          {!isCollapsed && <span>AI Discussion</span>}
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <div className="live-indicator"></div>
          <span>Live</span>
        </div>
      </div>
    </aside>
  );
}