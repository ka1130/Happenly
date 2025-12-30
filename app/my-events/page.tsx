"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@lib/supabase";
import { useEvents } from "@hooks/useEvents";
import EventCard, { EventCardSkeleton } from "@components/EventCard";
import { Event as AppEvent } from "@apptypes/event";

export default function EventsPage() {
  const [user, setUser] = useState<any>(null);
  const { events: initialEvents = [], loading, error } = useEvents();
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [activeTab, setActiveTab] = useState<"attending" | "created">(
    "attending",
  );

  const [attendingEvents, setAttendingEvents] = useState<AppEvent[]>([]);
  const [createdEvents, setCreatedEvents] = useState<AppEvent[]>([]);

  const router = useRouter();

  // fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  useEffect(() => {
    if (!user) return;

    const fetchEvents = async () => {
      // created
      const { data: created } = await supabase
        .from("events")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      // attending
      const { data: attending } = await supabase
        .from("event_registrations")
        .select("events (*)")
        .eq("user_id", user.id);

      setCreatedEvents(created ?? []);
      setAttendingEvents(attending?.map((r: any) => r.events) ?? []);
    };

    fetchEvents();
  }, [user]);

  if (!user) return <p>Please log in to see events.</p>;

  const handleDeleteEvent = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete event:", error);
      return;
    }
    setEvents((prev) => prev?.filter((event) => event.id !== id) || []);
  };

  const visibleEvents =
    activeTab === "attending" ? attendingEvents : createdEvents;

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-4xl font-bold text-stone-900">Events</h1>

      {error && (
        <div className="flex justify-center py-12">
          <p className="text-red-500">Error: {error.message}</p>
        </div>
      )}

      <div className="mb-8 flex gap-6 border-b">
        <button
          onClick={() => setActiveTab("attending")}
          className={`cursor-pointer pb-2 font-medium ${
            activeTab === "attending"
              ? "border-b-2 border-stone-900 text-stone-900"
              : "text-stone-400"
          }`}
        >
          Attending
        </button>

        <button
          onClick={() => setActiveTab("created")}
          className={`cursor-pointer pb-2 font-medium ${
            activeTab === "created"
              ? "border-b-2 border-stone-900 text-stone-900"
              : "text-stone-400"
          }`}
        >
          Created by me
        </button>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {loading || events === null ? (
          Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={i} />)
        ) : events.length === 0 ? (
          <p className="col-span-full py-12 text-center text-stone-500">
            No events found.
          </p>
        ) : (
          visibleEvents.map((event) => (
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

      {!loading && events.length === 0 && !error && (
        <p className="col-span-full py-12 text-center text-stone-500">
          No events found.
        </p>
      )}
    </div>
  );
}
