'use client';

import { useState, useEffect } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  trend?: 'up' | 'down';
  trendValue?: number;
  children?: React.ReactNode;
}

export default function StatCard({ title, value, trend, trendValue, children }: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`stat-card ${isVisible ? 'animate-count-up' : ''}`}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{title}</div>
      {trend && (
        <div className={`stat-trend ${trend}`}>
          {trend === 'up' ? '↑' : '↓'} {Math.abs(trendValue || 0)}%
        </div>
      )}
      {children}
    </div>
  );
}