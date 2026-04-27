'use client';

import { cn } from "@/lib/utils";

interface TagCloudProps {
  children: React.ReactNode;
  className?: string;
}

export default function TagCloud({ children, className = '' }: TagCloudProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-2",
        className
      )}
    >
      {children}
    </div>
  );
}