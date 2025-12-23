import { Event } from "@apptypes/event";
import {
  CalendarIcon,
  PencilSquareIcon,
  ClockIcon,
  MapPinIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { formatCategory } from "@utils/formatCategory";
import { formatTimeRange } from "@utils/formatTimeRange";

// TODO RWD! mobile-first?

const status = (event: Event) => {
  if (!event) return "DRAFT";
  if (event.registrations >= event.capacity) return "FULL";
  if (event.published) return "PUBLISHED";
  return "DRAFT";
};

const STATUS_CONFIG = {
  FULL: {
    label: "Full",
    className: "text-red-600",
  },
  PUBLISHED: {
    label: "Published",
    className: "text-green-700",
  },
  DRAFT: {
    label: "Draft",
    className: "text-orange-300",
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
      className="w-full max-w-sm cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
    >
      <div className="relative">
        <img
          src={event.image}
          alt="Product"
          className="h-52 w-full object-cover"
        />
        {/* TODO styles */}
        <div className="absolute top-3 left-3">
          <span
            className={`mr-3 rounded-md bg-gray-100/20 px-3 py-1 text-sm font-medium ${
              STATUS_CONFIG[status(event)].className
            }`}
          >
            {STATUS_CONFIG[status(event)].label}
          </span>
          <span className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium">
            {formatCategory(event.category)}
          </span>
        </div>
      </div>
      {/* TODO block registrations when full */}
      <div className="flex min-h-72 flex-col p-5">
        <div className="flex flex-1 flex-col space-y-4">
          <div>
            <h3 className="font-sans text-xl font-bold text-gray-900">
              {event.title}
            </h3>
            <p className="mt-1 text-gray-500">{event.description}</p>
          </div>

          <p className="flex gap-2 text-sm text-gray-500">
            <CalendarIcon
              className="relative top-[px] h-4.5 w-4.5"
              strokeWidth={2}
            />
            <span>{event.date}</span>
          </p>

          <p className="flex gap-2 text-sm text-gray-500">
            <ClockIcon
              className="relative top-[px] h-4.5 w-4.5"
              strokeWidth={2}
            />
            <span>{formatTimeRange(event.startAt, event.endAt)}</span>
          </p>

          <p className="flex gap-2 text-sm text-gray-500">
            <MapPinIcon
              className="relative top-[px] h-4.5 w-4.5"
              strokeWidth={2}
            />
            <span>{event.location}</span>
          </p>

          <p className="flex gap-2 text-sm text-gray-500">
            <MapPinIcon
              className="relative top-[px] h-4.5 w-4.5"
              strokeWidth={2}
            />
            <span>
              {event.registrations} / {event.capacity} attendees
            </span>
          </p>
        </div>

        <div className="mt-auto flex justify-between gap-4">
          <button className="flex flex-1 cursor-pointer justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-400 focus:outline-none">
            <PencilSquareIcon className="relative top-[px] h-4 w-4" />
            <span>Edit</span>
          </button>
          <button className="cursor-pointer rounded-md p-2 hover:bg-gray-100">
            <TrashIcon className="h-4 w-4 text-red-700" />
          </button>
        </div>
      </div>
    </div>
  );
}
