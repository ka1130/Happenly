import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function FiltersPanel() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-3 rounded-md bg-stone-100 p-4">
        <button className="flex h-9 w-[160px] items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
          <span className="line-clamp-1">Category</span>
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </button>

        <button className="flex h-9 w-[140px] items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
          <span className="line-clamp-1">Status</span>
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </button>

        <button className="flex h-9 w-[160px] items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
          <span className="line-clamp-1">Sort by</span>
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </button>
      </div>
    </div>
  );
}
