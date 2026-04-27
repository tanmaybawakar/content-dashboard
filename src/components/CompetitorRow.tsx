'use client';

import { useState } from 'react';
import PlatformBadge from './PlatformBadge';
import StatusPill from './StatusPill';

interface CompetitorRowProps {
  competitor: {
    id: string | number;
    handle: string;
    platforms: string[];
    lastScrapedAt?: string;
    status: string;
    // adding optional name just in case
    name?: string;
  };
  onClick?: () => void;
  isSelected?: boolean;
}

export default function CompetitorRow({ competitor, onClick, isSelected }: CompetitorRowProps) {
  const [isHovered, setIsHovered] = useState(false);
  const displayName = competitor.name || competitor.handle;

  return (
    <div
      className={`p-3 rounded-md cursor-pointer transition-all duration-300 ${
        isSelected ? 'bg-bg-elevated border-l-3 border-accent-primary' : isHovered ? 'bg-bg-elevated' : 'bg-bg-surface'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-bg-border rounded-full flex items-center justify-center">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium">{displayName}</div>
            <div className="text-xs text-text-secondary">{competitor.handle}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {competitor.platforms.map(platform => (
              <PlatformBadge key={platform} platform={platform} />
            ))}
          </div>
          <StatusPill status={competitor.status} />
          <div className="text-xs text-text-secondary">
            {competitor.lastScrapedAt ? new Date(competitor.lastScrapedAt).toLocaleDateString() : 'Never'}
          </div>
        </div>
      </div>
    </div>
  );
}