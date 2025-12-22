import { Event } from '@apptypes/event';
import EventCard from '@components//EventCard';

type EventCardsProps = {
  events: Event[];
};

export function EventCards({ events }: EventCardsProps) {
  if (events.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">No events found.</div>
    );
  }

  // TODO fix form visually
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard event={event} key={event.id} />
      ))}
    </div>
  );
}
