import { ReactNode } from 'react';

interface StatusPillProps {
  status: string;
  children?: ReactNode;
}

export default function StatusPill({ status, children }: StatusPillProps) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'idea':
        return 'status-idea';
      case 'drafted':
        return 'status-drafted';
      case 'scheduled':
        return 'status-scheduled';
      case 'published':
        return 'status-published';
      case 'archived':
        return 'status-archived';
      default:
        return 'status-default';
    }
  };

  return (
    <span className={`status-pill ${getStatusClass(status)}`}>
      {children || status}
    </span>
  );
}