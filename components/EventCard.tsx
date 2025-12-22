import { Event } from '@apptypes/event';
import {
  CalendarIcon,
  PencilSquareIcon,
  ClockIcon,
  MapPinIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { formatCategory } from '@utils/formatCategory';
import { formatTimeRange } from '@utils/formatTimeRange';

// TODO RWD! mobile-first?

const status = (event: Event) => {
  if (!event) return 'DRAFT';
  if (event.registrations >= event.capacity) return 'FULL';
  if (event.published) return 'PUBLISHED';
  return 'DRAFT';
};

const STATUS_CONFIG = {
  FULL: {
    label: 'Full',
    className: 'text-red-600',
  },
  PUBLISHED: {
    label: 'Published',
    className: 'text-green-700',
  },
  DRAFT: {
    label: 'Draft',
    className: 'text-orange-300',
  },
} as const;

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
          <span
            className={`px-3 py-1 mr-3 rounded-md text-sm font-medium bg-gray-100/20 ${
              STATUS_CONFIG[status(event)].className
            }`}
          >
            {STATUS_CONFIG[status(event)].label}
          </span>
          <span className="bg-gray-200 px-3 py-1 rounded-md text-sm font-medium">
            {formatCategory(event.category)}
          </span>
        </div>
      </div>
      {/* TODO block registrations when full */}
      <div className="p-5 flex flex-col min-h-72">
        <div className="flex-1 flex flex-col space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 font-sans">
              {event.title}
            </h3>
            <p className="text-gray-500 mt-1">{event.description}</p>
          </div>

          <p className="text-sm text-gray-500 flex gap-2">
            <CalendarIcon
              className="h-4.5 w-4.5 relative top-[px]"
              strokeWidth={2}
            />
            <span>{event.date}</span>
          </p>

          <p className="text-sm text-gray-500 flex gap-2">
            <ClockIcon
              className="h-4.5 w-4.5 relative top-[px]"
              strokeWidth={2}
            />
            <span>{formatTimeRange(event.startAt, event.endAt)}</span>
          </p>

          <p className="text-sm text-gray-500 flex gap-2">
            <MapPinIcon
              className="h-4.5 w-4.5 relative top-[px]"
              strokeWidth={2}
            />
            <span>{event.location}</span>
          </p>

          <p className="text-sm text-gray-500 flex gap-2">
            <MapPinIcon
              className="h-4.5 w-4.5 relative top-[px]"
              strokeWidth={2}
            />
            <span>
              {event.registrations} / {event.capacity} attendees
            </span>
          </p>
        </div>

        <div className="flex justify-between gap-4 mt-auto">
          <button className="text-xs px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 flex gap-2 flex-1 justify-center cursor-pointer">
            <PencilSquareIcon className="h-4 w-4 relative top-[px]" />
            <span>Edit</span>
          </button>
          <button className="cursor-pointer hover:bg-gray-100 p-2 rounded-md">
            <TrashIcon className="h-4 w-4 text-red-700" />
          </button>
        </div>
      </div>
    </div>
  );
}
