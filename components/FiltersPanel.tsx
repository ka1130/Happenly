import { type EventCategory } from "@apptypes/event";
import { formatCategory } from "@utils/formatCategory";

import { type Dispatch, type SetStateAction } from "react";

type FiltersPanelProps = {
  selectedCategory: EventCategory | "";
  selectedSort: string;
  selectedStatus: string;
  setSelectedCategory: Dispatch<SetStateAction<EventCategory | "">>;
  setSelectedSort: Dispatch<SetStateAction<string>>;
  setSelectedStatus: Dispatch<SetStateAction<string>>;
};

export default function FiltersPanel({
  selectedCategory,
  selectedSort,
  selectedStatus,
  setSelectedCategory,
  setSelectedSort,
  setSelectedStatus,
}: FiltersPanelProps) {
  const filters = [
    {
      label: "Category",
      value: selectedCategory,
      onChange: setSelectedCategory,
      options: [
        { label: "All", value: "" },
        { label: "Concert", value: "CONCERT" },
        { label: "Workshop", value: "WORKSHOP" },
        { label: "Meetup", value: "MEETUP" },
        { label: "Conference", value: "CONFERENCE" },
        { label: "Tech", value: "TECH" },
        { label: "Culture Tech", value: "CULTURE_TECH" },
      ],
      width: "w-[160px]",
    },
    {
      label: "Sort by",
      value: selectedSort,
      onChange: setSelectedSort,
      options: [
        { label: "Date (soonest)", value: "date-asc" },
        { label: "Date (latest)", value: "date-desc" },
        { label: "Most attendees", value: "attendees-desc" },
        { label: "Title (A-Z)", value: "title-asc" },
      ],
      width: "w-[160px]",
    },
    {
      label: "Status",
      value: selectedStatus,
      onChange: setSelectedStatus,
      options: [
        { label: "All", value: "all" },
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" },
        { label: "Past", value: "past" },
      ],
      width: "w-[140px]",
    },
  ];

  return (
    <div className="flex flex-col gap-2 text-stone-500">
      <div className="flex flex-wrap gap-3 rounded-md bg-stone-100 p-4">
        {filters.map((f) => (
          <select
            key={f.label}
            value={f.value}
            onChange={(e) => {
              if (f.label === "Category")
                setSelectedCategory(e.target.value as EventCategory | "");
              else if (f.label === "Sort by") setSelectedSort(e.target.value);
              else if (f.label === "Status") setSelectedStatus(e.target.value);
            }}
            className={`h-9 ${f.width} rounded-md border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none`}
          >
            {f.options.map((o) => (
              <option
                key={o.value}
                value={o.value}
                className={o.value === "" ? "text-gray-400" : "text-gray-900"}
              >
                {o.label}
              </option>
            ))}
          </select>
        ))}
        <button
          onClick={() => {
            setSelectedCategory("");
            setSelectedSort("");
            setSelectedStatus("all");
          }}
          className="h-9 cursor-pointer rounded-md border border-gray-300 bg-white px-3 text-sm hover:bg-stone-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
