import { useState, useEffect } from 'react';

// Define the CalendarEvent type based on your data model
interface CalendarEvent {
  id: string;
  title: string;
  platform: string;
  date: string; // ISO date string
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Define the hook return type
interface UseCalendarReturn {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getEventsByMonth: (year: number, month: number) => Promise<void>;
  createEvent: (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEvent: (id: string, eventData: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export function useCalendar(): UseCalendarReturn {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch calendar events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/calendar');
      if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Get events by month
  const getEventsByMonth = async (year: number, month: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/calendar?year=${year}&month=${month}`);
      if (!response.ok) {
        throw new Error('Failed to fetch calendar events for month');
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Create a new calendar event
  const createEvent = async (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Failed to create calendar event');
      }

      const newEvent = await response.json();
      setEvents(prevEvents => [...prevEvents, newEvent]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  // Update an existing calendar event
  const updateEvent = async (id: string, eventData: Partial<CalendarEvent>) => {
    try {
      const response = await fetch(`/api/calendar/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Failed to update calendar event');
      }

      const updatedEvent = await response.json();
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === id ? { ...event, ...updatedEvent } : event
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  // Delete a calendar event
  const deleteEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/calendar/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete calendar event');
      }

      setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  // Initialize the hook
  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
    getEventsByMonth,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}