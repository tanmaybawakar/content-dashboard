import { useState, useEffect } from 'react';

// Define the Competitor type based on your data model
interface Competitor {
  id: string;
  handle: string;
  platforms: string[];
  followerCount: number;
  avgEngagement: number;
  postingFrequency: number;
  growthRate: number;
  notes?: string;
  lastScrapedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Define the hook return type
interface UseCompetitorsReturn {
  competitors: Competitor[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  analyzeCompetitor: (id: string) => Promise<void>;
  createCompetitor: (competitorData: Omit<Competitor, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCompetitor: (id: string, competitorData: Partial<Competitor>) => Promise<void>;
  deleteCompetitor: (id: string) => Promise<void>;
}

export function useCompetitors(): UseCompetitorsReturn {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch competitors from API
  const fetchCompetitors = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/competitors');
      if (!response.ok) {
        throw new Error('Failed to fetch competitors');
      }

      const data = await response.json();
      setCompetitors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Analyze a competitor
  const analyzeCompetitor = async (id: string) => {
    try {
      const response = await fetch(`/api/competitors/${id}/analyze`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to analyze competitor');
      }

      // Refetch competitors to get updated analysis data
      await fetchCompetitors();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  // Create a new competitor
  const createCompetitor = async (competitorData: Omit<Competitor, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/competitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(competitorData),
      });

      if (!response.ok) {
        throw new Error('Failed to create competitor');
      }

      const newCompetitor = await response.json();
      setCompetitors(prevCompetitors => [...prevCompetitors, newCompetitor]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  // Update an existing competitor
  const updateCompetitor = async (id: string, competitorData: Partial<Competitor>) => {
    try {
      const response = await fetch(`/api/competitors/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(competitorData),
      });

      if (!response.ok) {
        throw new Error('Failed to update competitor');
      }

      const updatedCompetitor = await response.json();
      setCompetitors(prevCompetitors =>
        prevCompetitors.map(competitor =>
          competitor.id === id ? { ...competitor, ...updatedCompetitor } : competitor
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  // Delete a competitor
  const deleteCompetitor = async (id: string) => {
    try {
      const response = await fetch(`/api/competitors/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete competitor');
      }

      setCompetitors(prevCompetitors => prevCompetitors.filter(competitor => competitor.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  // Initialize the hook
  useEffect(() => {
    fetchCompetitors();
  }, []);

  return {
    competitors,
    loading,
    error,
    refetch: fetchCompetitors,
    analyzeCompetitor,
    createCompetitor,
    updateCompetitor,
    deleteCompetitor,
  };
}