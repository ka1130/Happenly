"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { useEvents } from "@hooks/useEvents";
import EventCard, { EventCardSkeleton } from "@components/EventCard";
import FiltersPanel from "@components/FiltersPanel";
import Dashboard from "@components/Dashboard";
import { supabase } from "@lib/supabase";
import { Event as AppEvent } from "@apptypes/event";

export default function Home() {
  const { events: fetchedEvents, loading, error } = useEvents();
  const [events, setEvents] = useState<AppEvent[] | null>(null);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const router = useRouter();

  // Sync local state with fetched events
  useEffect(() => {
    if (!loading) {
      setEvents(fetchedEvents);
    }
  }, [fetchedEvents, loading]);

  const handleDeleteEvent = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete event:", error);
      return;
    }
    setEvents((prev) => prev?.filter((event) => event.id !== id) || []);
  };

  const filteredEvents = events
    ? events.filter(
        (e) =>
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          (e.description?.toLowerCase().includes(search.toLowerCase()) ??
            false),
      )
    : [];

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <Dashboard />

      {error && (
        <div className="flex justify-center py-12">
          <p className="text-red-500">Error: {error.message}</p>
        </div>
      )}

      <div className="mt-10 mb-4 space-y-4">
        <h2 className="font-heading text-xl font-semibold">Recent Events</h2>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="w-full rounded-md border border-stone-400 px-10 py-2"
            />
            <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-stone-400" />
          </div>
          <button
            className="flex cursor-pointer items-center gap-2 rounded-md border border-stone-400 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-stone-400" />{" "}
            Filters
          </button>
        </div>
      </div>

      {filtersOpen && <FiltersPanel />}

      <div className="mt-10 grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {loading || events === null ? (
          Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={i} />)
        ) : events.length === 0 ? (
          <p className="col-span-full py-12 text-center text-stone-500">
            No events found.
          </p>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => router.push(`/event/${event.id}`)}
            >
              <EventCard
                event={event}
                onDeleteAction={() => handleDeleteEvent(event.id)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
