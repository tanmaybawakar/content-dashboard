'use client';

import { useState, useEffect } from 'react';

export default function TypingIndicator() {
  const [dots, setDots] = useState(['●', '○', '○']);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => [
        prev[2],
        prev[0],
        prev[1]
      ]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="typing-indicator">
      {dots.map((dot, index) => (
        <span key={index} className={`typing-dot ${dot === '●' ? 'bg-text-secondary' : 'bg-text-dim'}`}>
          {dot}
        </span>
      ))}
    </div>
  );
}