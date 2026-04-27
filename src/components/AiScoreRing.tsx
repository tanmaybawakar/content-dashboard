'use client';

import { useState, useEffect } from 'react';

interface AiScoreRingProps {
  score: number;
}

export default function AiScoreRing({ score }: AiScoreRingProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getScoreColor = (score: number) => {
    if (score < 40) return 'low';
    if (score < 70) return 'medium';
    return 'high';
  };

  return (
    <div className={`ai-score-ring ${getScoreColor(score)} ${isVisible ? 'animate-count-up' : ''}`}>
      {score}%
    </div>
  );
}