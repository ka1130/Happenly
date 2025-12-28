"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEvents } from "@hooks/useEvents";
import EventCard from "@components/EventCard";
import { supabase } from "@lib/supabase";
import { Event as AppEvent } from "@apptypes/event";

export default function Home() {
  const { events: fetchedEvents, loading, error } = useEvents();
  const [events, setEvents] = useState<AppEvent[] | null>(null); // start as null
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

  if (loading || events === null) {
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
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="mb-2 text-3xl font-semibold text-stone-700">Dashboard</h2>
      <p className="mb-12 text-stone-500">
        Manage your events and track registrations
      </p>
      <h3 className="mb-4 text-2xl font-medium text-stone-700">
        Recent Events
      </h3>
      <div className="grid grid-cols-[repeat(auto-fill,20rem)] justify-start gap-6">
        {events.map((event) => (
          <div onClick={() => router.push(`/event/${event.id}`)} key={event.id}>
            <EventCard
              event={event}
              onDeleteAction={() => handleDeleteEvent(event.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
