"use client";
import { Event } from "@apptypes/event";
import { useEvents } from "@/hooks/useEvents";

export default function EventsPage() {
  const { events = [], loading, error } = useEvents();

  console.log("events", events);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-gray-500">Loading events...</p>
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
        <p className="text-lg text-gray-500">No events found.</p>
      </div>
    );
  }

  // TODO add images, use EventCard
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">Events</h1>
        <div className="grid grid-cols-1 gap-6">
          {events.map((event: Event) => (
            <div key={event.id} className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                {event.title}
              </h2>
              <p className="mb-4 text-gray-600">{event.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
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
        </div>
      </div>
    </div>
  );
}
