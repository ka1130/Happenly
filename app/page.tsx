"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEvents } from "@hooks/useEvents";
import EventCard, { EventCardSkeleton } from "@components/EventCard";
import { supabase } from "@lib/supabase";
import { Event as AppEvent } from "@apptypes/event";

export default function Home() {
  const { events: fetchedEvents, loading, error } = useEvents();
  const [events, setEvents] = useState<AppEvent[] | null>(null);
  const router = useRouter();

  // Sync local state with fetched events
  useEffect(() => {
    if (!loading) {
      setEvents(fetchedEvents);
    }
  }, [fetchedEvents, loading]);

  const handleDeleteEvent = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete event:", error);
      return;
    }
    setEvents((prev) => prev?.filter((event) => event.id !== id) || []);
  };

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      {/* Header always renders instantly */}
      <h2 className="mb-2 text-3xl font-semibold text-stone-700">Dashboard</h2>
      <p className="mb-12 text-stone-500">
        Manage your events and track registrations
      </p>
      <h3 className="mb-4 text-2xl font-medium text-stone-700">
        Recent Events
      </h3>

      {error && (
        <div className="flex justify-center py-12">
          <p className="text-red-500">Error: {error.message}</p>
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,20rem)] justify-start gap-6">
        {loading || events === null ? (
          Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={i} />)
        ) : events.length === 0 ? (
          <p className="col-span-full py-12 text-center text-stone-500">
            No events found.
          </p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              onClick={() => router.push(`/event/${event.id}`)}
            >
              <EventCard
                event={event}
                onDeleteAction={() => handleDeleteEvent(event.id)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
