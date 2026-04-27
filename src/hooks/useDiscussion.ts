import { useState, useEffect } from 'react';

// Define the Discussion type based on your data model
interface Discussion {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

// Define the Message type
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

// Define the hook return type
interface UseDiscussionReturn {
  discussions: Discussion[];
  currentDiscussion: Discussion | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createDiscussion: (title: string) => Promise<void>;
  sendMessage: (discussionId: string, content: string) => Promise<void>;
  selectDiscussion: (id: string) => void;
  deleteDiscussion: (id: string) => Promise<void>;
}

export function useDiscussion(): UseDiscussionReturn {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [currentDiscussion, setCurrentDiscussion] = useState<Discussion | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch discussions from API
  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/discussions');
      if (!response.ok) {
        throw new Error('Failed to fetch discussions');
      }

      const data = await response.json();
      setDiscussions(data);

      // Set the first discussion as current if none is selected
      if (data.length > 0 && !currentDiscussion) {
        setCurrentDiscussion(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Create a new discussion
  const createDiscussion = async (title: string) => {
    try {
      const response = await fetch('/api/discussions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error('Failed to create discussion');
      }

      const newDiscussion = await response.json();
      setDiscussions(prevDiscussions => [...prevDiscussions, newDiscussion]);
      setCurrentDiscussion(newDiscussion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  // Send a message in a discussion
  const sendMessage = async (discussionId: string, content: string) => {
    try {
      const response = await fetch(`/api/discussions/${discussionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const updatedDiscussion = await response.json();
      setDiscussions(prevDiscussions =>
        prevDiscussions.map(discussion =>
          discussion.id === discussionId ? updatedDiscussion : discussion
        )
      );

      // Update current discussion if it's the one being updated
      if (currentDiscussion?.id === discussionId) {
        setCurrentDiscussion(updatedDiscussion);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  // Select a discussion
  const selectDiscussion = (id: string) => {
    const discussion = discussions.find(d => d.id === id);
    if (discussion) {
      setCurrentDiscussion(discussion);
    }
  };

  // Delete a discussion
  const deleteDiscussion = async (id: string) => {
    try {
      const response = await fetch(`/api/discussions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete discussion');
      }

      setDiscussions(prevDiscussions => prevDiscussions.filter(d => d.id !== id));

      // Clear current discussion if it was deleted
      if (currentDiscussion?.id === id) {
        setCurrentDiscussion(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  // Initialize the hook
  useEffect(() => {
    fetchDiscussions();
  }, []);

  return {
    discussions,
    currentDiscussion,
    loading,
    error,
    refetch: fetchDiscussions,
    createDiscussion,
    sendMessage,
    selectDiscussion,
    deleteDiscussion,
  };
}