import { useState, useEffect } from 'react';

// Define the Idea type based on your data model
interface Idea {
  id: string;
  title: string;
  platform: string;
  caption: string;
  postType: string;
  status: string;
  scheduledAt?: string;
  publishedAt?: string;
  tags: string[];
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Define the hook return type
interface UseIdeasReturn {
  ideas: Idea[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createIdea: (ideaData: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateIdea: (id: string, ideaData: Partial<Idea>) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;
}

export function useIdeas(): UseIdeasReturn {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch ideas from API
  const fetchIdeas = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/ideas');
      if (!response.ok) {
        throw new Error('Failed to fetch ideas');
      }

      const data = await response.json();
      setIdeas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Create a new idea
  const createIdea = async (ideaData: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ideaData),
      });

      if (!response.ok) {
        throw new Error('Failed to create idea');
      }

      const newIdea = await response.json();
      setIdeas(prevIdeas => [...prevIdeas, newIdea]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  // Update an existing idea
  const updateIdea = async (id: string, ideaData: Partial<Idea>) => {
    try {
      const response = await fetch(`/api/ideas/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ideaData),
      });

      if (!response.ok) {
        throw new Error('Failed to update idea');
      }

      const updatedIdea = await response.json();
      setIdeas(prevIdeas =>
        prevIdeas.map(idea =>
          idea.id === id ? { ...idea, ...updatedIdea } : idea
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  // Delete an idea
  const deleteIdea = async (id: string) => {
    try {
      const response = await fetch(`/api/ideas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete idea');
      }

      setIdeas(prevIdeas => prevIdeas.filter(idea => idea.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  // Initialize the hook
  useEffect(() => {
    fetchIdeas();
  }, []);

  return {
    ideas,
    loading,
    error,
    refetch: fetchIdeas,
    createIdea,
    updateIdea,
    deleteIdea,
  };
}