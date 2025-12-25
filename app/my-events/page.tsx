"use client";
import { useState, useEffect } from "react";
import { useEvents } from "@/hooks/useEvents";
import EventCard from "@/components/EventCard";
import { Event as AppEvent } from "@apptypes/event";

export default function EventsPage() {
  // TODO display only per-user events, check if the logic is not unnecessarily repeated with Home
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
    <div>
      <h1 className="mb-8 text-4xl font-bold text-stone-900">Events</h1>
      <div className="flex flex-wrap gap-6">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onDeleteAction={handleDeleteEvent}
          />
        ))}
      </div>
    </div>
  );
}
