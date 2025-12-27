"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useEvents } from "@hooks/useEvents";
import { Event } from "@apptypes/event";
import { status, STATUS_CONFIG } from "@components/EventCard";
import { formatCategory } from "@utils/formatCategory";
import { formatTimeRange } from "@utils/formatTimeRange";
import { useEventRegistrations } from "@hooks/useEventRegistrations";

const mockSchedule = [
  {
    time: "9:00 AM",
    title: "Registration & Breakfast",
    location: "Main Lobby",
  },
  { time: "10:00 AM", title: "Opening Keynote", location: "Main Hall" },
  { time: "12:00 PM", title: "Networking Lunch", location: "Garden Terrace" },
];

export default function EventPage() {
  const { events } = useEvents();
  const { id } = useParams();
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "attendees" | "schedule"
  >("overview");

  useEffect(() => {
    const found = events.find((e) => e.id === id);
    setEvent(found ?? null);
  }, [events, id]);

  const {
    userRegistered,
    registrations,
    spotsRemaining,
    loading,
    handleRegister,
  } = useEventRegistrations(event);

  if (!event) return <p>Loading event...</p>;

  const progress = Math.min((registrations / event.capacity) * 100, 100);

  return (
    <div className="p-4 text-stone-600">
      {/* Header */}
      <div className="relative">
        <img
          src={event.image || "/placeholder.png"}
          alt={event.title}
          className="h-[30vh] w-full rounded-lg object-cover"
        />
        <button
          onClick={() => router.back()}
          className="absolute top-5 left-5 rounded-md border border-white/40 bg-white/60 p-2 backdrop-blur-sm hover:bg-white/70"
        >
          <ArrowLeftIcon className="h-5 w-5 text-white" strokeWidth={2.5} />
        </button>

        <div className="absolute bottom-16 left-5 flex gap-2">
          <span
            className={`rounded-md bg-stone-100/20 px-3 py-1 text-sm font-medium ${STATUS_CONFIG[status(event)].className}`}
          >
            {STATUS_CONFIG[status(event)].label}
          </span>
          <span className="rounded-md bg-stone-200 px-3 py-1 text-sm font-medium">
            {formatCategory(event.category)}
          </span>
        </div>

        <h3 className="absolute bottom-6 left-5 text-2xl font-semibold text-white">
          {event.title}
        </h3>
      </div>

      {/* Content */}
      <div className="mt-4 flex w-full flex-col gap-4 lg:flex-row">
        {/* Tabs */}
        <div className="flex-1">
          <div className="flex gap-2 rounded bg-stone-200 p-1 text-sm">
            {["overview", "attendees", "schedule"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`cursor-pointer rounded px-4 py-1 font-medium text-stone-700 transition-colors ${
                  activeTab === tab
                    ? "bg-white text-stone-900"
                    : "hover:bg-stone-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            {activeTab === "overview" && (
              <p className="text-sm leading-relaxed">{event.description}</p>
            )}
            {activeTab === "attendees" && (
              <p>{registrations} people registered</p>
            )}
            {activeTab === "schedule" && (
              <div className="space-y-6 text-sm">
                {mockSchedule.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex w-24 items-center text-right font-medium text-gray-700">
                      {item.time}
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-base font-semibold">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex w-full flex-col gap-3 rounded-lg bg-gray-50 p-4 text-sm lg:w-64">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" strokeWidth={2} />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5" strokeWidth={2} />
            {formatTimeRange(event.startAt, event.endAt)}
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5" strokeWidth={2} />
            <span>{event.location}</span>
          </div>

          <hr className="my-2 border-gray-300" />

          <div className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" strokeWidth={2} />
            <span>Capacity</span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span>
              {registrations}/{event.capacity}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            {spotsRemaining} spots remaining
          </p>

          <button
            onClick={handleRegister}
            disabled={spotsRemaining <= 0 || loading || userRegistered}
            className={`mt-4 w-full rounded-md py-2 text-white ${
              !userRegistered && spotsRemaining > 0 && !loading
                ? "bg-blue-500 hover:bg-blue-600"
                : "cursor-not-allowed bg-gray-400"
            }`}
          >
            {loading
              ? "Registering..."
              : userRegistered
                ? "Registered"
                : spotsRemaining > 0
                  ? "Register Now"
                  : "Full"}
          </button>
        </div>
      </div>
    </div>
  );
}
