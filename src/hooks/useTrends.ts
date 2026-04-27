import { useState, useEffect } from 'react';

// Define the Trend type based on your data model
interface Trend {
  id: string;
  title: string;
  description: string;
  topic: string;
  platform: string;
  score: number; // 0-100
  volume: number;
  growthRate: number;
  relatedTopics: string[];
  sources: {
    url: string;
    title: string;
    publishedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// Define the hook return type
interface UseTrendsReturn {
  trends: Trend[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  fetchTrends: (topic?: string, platform?: string) => Promise<void>;
}

export function useTrends(): UseTrendsReturn {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch trends from API
  const fetchTrends = async (topic?: string, platform?: string) => {
    try {
      setLoading(true);
      setError(null);

      let url = '/api/trends';
      if (topic || platform) {
        const params = new URLSearchParams();
        if (topic) params.append('topic', topic);
        if (platform) params.append('platform', platform);
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch trends');
      }

      const data = await response.json();
      setTrends(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Initialize the hook
  useEffect(() => {
    fetchTrends();
  }, []);

  return {
    trends,
    loading,
    error,
    refetch: () => fetchTrends(),
    fetchTrends,
  };
}