"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useEvents } from "@/hooks/useEvents";
import EventCard from "@/components/EventCard";
import { Event as AppEvent } from "@apptypes/event";

export default function Home() {
  const { events: initialEvents = [], loading, error } = useEvents();
  const [events, setEvents] = useState<AppEvent[]>([]);

  // initial events after fetch
  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

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
          <Link href={`/event/${event.id}`} key={event.id}>
            <EventCard event={event} onDeleteAction={handleDeleteEvent} />
          </Link>
        ))}
      </div>
    </div>
  );
}
