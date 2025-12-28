"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { type EventCategory } from "@apptypes/event";
import { formatCategory } from "@utils/formatCategory";

export default function FiltersPanel() {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | "">(
    "",
  );
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-3 rounded-md bg-stone-100 p-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as EventCategory)}
          className="h-9 w-[160px] rounded-md border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Category</option>
          {[
            "CONCERT",
            "WORKSHOP",
            "MEETUP",
            "CONFERENCE",
            "TECH",
            "CULTURE_TECH",
          ].map((cat) => (
            <option key={cat} value={cat}>
              {formatCategory(cat as EventCategory)}
            </option>
          ))}
        </select>

        <select
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
          className="h-9 w-[160px] rounded-md border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Sort by</option>
          <option value="date-asc">Date (soonest)</option>
          <option value="date-desc">Date (latest)</option>
          <option value="attendees-desc">Most attendees</option>
          <option value="title-asc">Title (A-Z)</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="h-9 w-[140px] rounded-md border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="past">Past</option>
        </select>
      </div>
    </div>
  );
}
