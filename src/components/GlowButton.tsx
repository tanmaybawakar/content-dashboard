'use client';

import { useState, useEffect } from 'react';

interface GlowButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function GlowButton({ children, className = '', onClick, disabled = false }: GlowButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      className={`btn btn-primary ${className} transition-all duration-300 ${
        disabled ? 'opacity-50 cursor-not-allowed' : isHovered ? 'scale-105' : ''
      } ${isPressed ? 'scale-95' : ''}`}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => !disabled && setIsHovered(false)}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => !disabled && setIsPressed(false)}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}