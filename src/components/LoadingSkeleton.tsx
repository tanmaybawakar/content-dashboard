import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  count?: number;
}

export default function LoadingSkeleton({
  className = '',
  width = '100%',
  height = '20px',
  count = 1,
}: LoadingSkeletonProps) {
  return (
    <div className={`loading-skeleton ${className}`} style={{ width, height }}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="loading-skeleton"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '4px',
          }}
        />
      ))}
    </div>
  );
}