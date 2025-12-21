import { useState, useEffect } from 'react';
import { Event } from '@/types/event';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events', { signal: controller.signal });
        if (!res.ok) throw new Error('Failed to fetch');

        const data = await res.json();
        setEvents(data);
      } catch (err: any) {
        // Only set the error state if the error was not caused by the fetch being aborted.
        if (err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    return () => {
      controller.abort();
    };
  }, []);

  return { events, loading, error };
}
