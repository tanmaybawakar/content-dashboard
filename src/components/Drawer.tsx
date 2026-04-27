import React from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export default function Drawer({
  isOpen,
  onClose,
  children,
  title,
  className = '',
}: DrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className={`drawer-content ${className}`} onClick={e => e.stopPropagation()}>
        {title && (
          <div className="drawer-header">
            <h2>{title}</h2>
            <button onClick={onClose} className="drawer-close">
              ×
            </button>
          </div>
        )}
        <div className="drawer-body">
          {children}
        </div>
      </div>
    </div>
  );
}