import { ReactNode } from 'react';

interface PlatformBadgeProps {
  platform: string;
  children?: ReactNode;
}

export default function PlatformBadge({ platform, children }: PlatformBadgeProps) {
  const getPlatformClass = (platform: string) => {
    switch (platform) {
      case 'YouTube':
        return 'platform-youtube';
      case 'Instagram':
        return 'platform-instagram';
      case 'Twitter':
        return 'platform-twitter';
      case 'LinkedIn':
        return 'platform-linkedin';
      case 'TikTok':
        return 'platform-tiktok';
      case 'Newsletter':
        return 'platform-newsletter';
      default:
        return 'platform-default';
    }
  };

  return (
    <span className={`platform-badge ${getPlatformClass(platform)}`}>
      {children || platform}
    </span>
  );
}