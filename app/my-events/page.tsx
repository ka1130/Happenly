"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@lib/supabase";
import { useEvents } from "@hooks/useEvents";
import EventCard from "@components/EventCard";
import { Event as AppEvent } from "@apptypes/event";

export default function EventsPage() {
  const [user, setUser] = useState<any>(null);
  const { events: initialEvents = [], loading, error } = useEvents();
  const [events, setEvents] = useState<AppEvent[]>([]);

  // fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // initial events after fetch
  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  if (!user) return <p>Please log in to see events.</p>;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-stone-500">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-stone-500">No events found.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold text-stone-900">Events</h1>
      <div className="flex flex-wrap gap-6">
        {events.map((event) => (
          <Link href={`/event/${event.id}`} key={event.id}>
            <EventCard
              event={event}
              onDeleteAction={(id) =>
                setEvents((prev) => prev.filter((e) => e.id !== id))
              }
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
