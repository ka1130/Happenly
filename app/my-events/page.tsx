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
    <div className="min-h-screen bg-stone-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl">
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
        {/* <div className="grid grid-cols-1 gap-6">
          {events.map((event: Event) => (
            <div key={event.id} className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-2 text-2xl font-semibold text-stone-900">
                {event.title}
              </h2>
              <p className="mb-4 text-stone-600">{event.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm text-stone-700">
                <div>
                  <span className="font-semibold">Date:</span> {event.date}
                </div>
                <div>
                  <span className="font-semibold">Time:</span> {event.startAt}
                </div>
                <div>
                  <span className="font-semibold">Time:</span> {event.endAt}
                </div>
                <div className="col-span-2">
                  <span className="font-semibold">Location:</span>
                  {event.location}
                </div>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}
