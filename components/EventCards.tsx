import { Event } from "@apptypes/event";
import EventCard from "@components//EventCard";

type EventCardsProps = {
  events: Event[];
  onDeleteAction?: (id: string) => void;
};

export function EventCards({ events, onDeleteAction }: EventCardsProps) {
  if (events.length === 0) {
    return (
      <div className="py-12 text-center text-stone-500">No events found.</div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onDeleteAction={onDeleteAction}
        />
      ))}
    </div>
  );
}
