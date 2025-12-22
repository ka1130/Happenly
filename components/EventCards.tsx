import { Event } from '@/types/event';

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {events.map((event) => (
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

            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">$49.99</p>
                <p className="text-sm text-gray-500 line-through">$69.99</p>
              </div>

              <div className="flex items-center gap-1">
                <div className="text-yellow-400">★★★★</div>
                <div className="text-gray-300">★</div>
                <span className="text-sm text-gray-600 ml-1">(42)</span>
              </div>
            </div>

            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
        // <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
        //   <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        //     {event.title}
        //   </h2>
        //   <p className="text-gray-600 mb-4">{event.description}</p>
        //   <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        //     <div>
        //       <span className="font-semibold">Date:</span> {event.date}
        //     </div>
        //     <div>
        //       <span className="font-semibold">Time:</span> {event.time}
        //     </div>
        //     <div className="col-span-2">
        //       <span className="font-semibold">Location:</span> {event.location}
        //     </div>
        //   </div>
        // </div>
      ))}
    </div>
  );
}
