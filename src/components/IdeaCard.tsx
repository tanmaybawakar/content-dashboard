'use client';

import { useState } from 'react';
import PlatformBadge from './PlatformBadge';
import StatusPill from './StatusPill';
import AiScoreRing from './AiScoreRing';

interface IdeaCardProps {
  idea: {
    id: string | number;
    title: string;
    platform: string;
    caption?: string;
    hook?: string;
    aiScore?: number;
    status: string;
    tags: string[];
  };
  onClick?: () => void;
}

export default function IdeaCard({ idea, onClick }: IdeaCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getScoreColor = (score: number) => {
    if (score < 40) return 'low';
    if (score < 70) return 'medium';
    return 'high';
  };

  return (
    <div
      className="card cursor-pointer transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg">{idea.title}</h3>
        <PlatformBadge platform={idea.platform} />
      </div>

      <p className="text-text-secondary text-sm italic mb-3 line-clamp-2">{idea.caption || idea.hook}</p>

      <div className="flex items-center gap-3 mb-3">
        <AiScoreRing score={idea.aiScore || 85} />
        <StatusPill status={idea.status} />
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {idea.tags.map(tag => (
          <span key={tag} className="text-xs bg-bg-border px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between">
        <button className="text-text-secondary hover:text-white text-sm">Edit</button>
        <button className="text-text-secondary hover:text-white text-sm">Schedule</button>
        <button className="text-text-secondary hover:text-white text-sm">Archive</button>
      </div>
    </div>
  );
}