import { Event } from '@apptypes/event';
import { CalendarIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

type EventCardProps = {
  event: Event;
};

export default function EventCard({ event }: EventCardProps) {
  return (
    <div
      key={event.id}
      className="max-w-sm w-full bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
    >
      <div className="relative">
        <img
          src={event.image}
          alt="Product"
          className="w-full h-52 object-cover"
        />
        <span className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          {event.category}
        </span>
        <span className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          Published
        </span>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
          <p className="text-gray-500 mt-1">{event.description}</p>
        </div>

        <p className="text-sm text-gray-500 flex gap-2">
          <CalendarIcon
            className="h-4.5 w-4.5 relative top-[-px]"
            strokeWidth={2}
          />
          <span>{event.date}</span>
        </p>

        <button className="text-xs px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 flex gap-2">
          <PencilSquareIcon className="h-4 w-4 relative top-[-2px]" />
          <span>Edit</span>
        </button>
      </div>
    </div>
  );
}
