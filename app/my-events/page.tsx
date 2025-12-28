"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@lib/supabase";
import { useEvents } from "@hooks/useEvents";
import EventCard, { EventCardSkeleton } from "@components/EventCard";
import { Event as AppEvent } from "@apptypes/event";

export default function EventsPage() {
  const [user, setUser] = useState<any>(null);
  const { events: initialEvents = [], loading, error } = useEvents();
  const [events, setEvents] = useState<AppEvent[]>([]);
  const router = useRouter();

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

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  if (!user) return <p>Please log in to see events.</p>;

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-4xl font-bold text-stone-900">Events</h1>

      {error && (
        <div className="flex justify-center py-12">
          <p className="text-red-500">Error: {error.message}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-6">
        {loading || events.length === 0
          ? Array.from({ length: 3 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))
          : events.map((event) => (
              <div
                key={event.id}
                onClick={() => router.push(`/event/${event.id}`)}
              >
                <EventCard
                  event={event}
                  onDeleteAction={(id) =>
                    setEvents((prev) => prev.filter((e) => e.id !== id))
                  }
                />
              </div>
            ))}
      </div>

      {!loading && events.length === 0 && !error && (
        <p className="col-span-full py-12 text-center text-stone-500">
          No events found.
        </p>
      )}
    </div>
  );
}
