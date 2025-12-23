"use client";
import { useEvents } from "@/hooks/useEvents";
import { EventCards } from "@/components/EventCards";

export default function Home() {
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

  return (
    <>
      <h2 className="mb-2 text-3xl font-semibold text-gray-700">Dashboard</h2>
      <p className="mb-8 text-gray-500">
        Manage your events and track registrations
      </p>
      <h3 className="mb-8 text-2xl font-medium text-gray-700">Recent Events</h3>
      <div className="grid grid-cols-1 gap-6">
        <EventCards events={events} />
      </div>
    </>
  );
}
