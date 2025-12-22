import { Event } from '@apptypes/event';
import {
  CalendarIcon,
  PencilSquareIcon,
  ClockIcon,
  MapPinIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { formatCategory } from '@utils/formatCategory';

type EventCardProps = {
  event: Event;
};

// TODO add tailwind extension for prettier to order classNames
// TODO on card click move to event's page (create [id] endpoint/route
// TODO change fonts: set them up properly
export default function EventCard({ event }: EventCardProps) {
  return (
    <div
      key={event.id}
      className="max-w-sm w-full bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:bg-gray-50 cursor-pointer"
    >
      <div className="relative">
        <img
          src={event.image}
          alt="Product"
          className="w-full h-52 object-cover"
        />
        {/* TODO styles */}
        <div className="absolute top-3 left-3">
          {/* TODO 3 cases: Published, Draft and Full, each in different color */}
          <span className="text-white px-3 py-1 rounded-md text-sm font-medium  mr-2">
            {event.published ? 'Published' : 'Draft'}
          </span>
          <span className="bg-gray-200 px-3 py-1 rounded-md text-sm font-medium">
            {formatCategory(event.category)}
          </span>
        </div>
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

        <p className="text-sm text-gray-500 flex gap-2">
          <ClockIcon
            className="h-4.5 w-4.5 relative top-[-px]"
            strokeWidth={2}
          />
          <span>{event.startAt}</span>
          {/* TODO format time, add end time */}
        </p>

        <p className="text-sm text-gray-500 flex gap-2">
          <MapPinIcon
            className="h-4.5 w-4.5 relative top-[-px]"
            strokeWidth={2}
          />
          <span>{event.location}</span>
          {/* TODO format time, add end time */}
        </p>

        <p className="text-sm text-gray-500 flex gap-2">
          <MapPinIcon
            className="h-4.5 w-4.5 relative top-[-px]"
            strokeWidth={2}
          />
          <span>
            {event.registrations} / {event.capacity} attendees
          </span>
          {/* TODO format time, add end time */}
        </p>
        {/* TODO enable edit/patch */}
        <div className="flex justify-between gap-4">
          <button className="text-xs px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 flex gap-2 flex-1 justify-center cursor-pointer">
            <PencilSquareIcon className="h-4 w-4 relative top-[-2px]" />
            <span>Edit</span>
          </button>
          <button className="cursor-pointer hover:bg-gray-100 p-2 rounded-md">
            <TrashIcon className="h-4 w-4 text-red-700" />
          </button>
        </div>

        {/* TODO add trash  endpoint */}
      </div>
    </div>
  );
}
