'use client';
import { Event } from '@apptypes/event';
import { useEvents } from '@/hooks/useEvents';

export default function EventsPage() {
  const { events = [], loading, error } = useEvents();

  console.log('events', events);

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
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No events found.</p>
      </div>
    );
  }

  // TODO add images, use EventCard
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Events</h1>
        <div className="grid grid-cols-1 gap-6">
          {events.map((event: Event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {event.title}
              </h2>
              <p className="text-gray-600 mb-4">{event.description}</p>
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
