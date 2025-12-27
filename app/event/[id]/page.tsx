"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useEvents } from "@hooks/useEvents";
import { Event } from "@apptypes/event";

export default function EventPage() {
  const { events } = useEvents();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<
    "overview" | "attendees" | "schedule"
  >("overview");

  const event: Event | undefined = events.find((e) => e.id === id);
  if (!event) return <p>Event not found</p>;

  const spotsRemaining = event.capacity - event.registrations;
  const progress = Math.min((event.registrations / event.capacity) * 100, 100);

  return (
    <div className="w-full p-4">
      <img
        src={event.image}
        alt={event.title}
        className="max-h-64 w-full rounded-lg object-cover"
      />

      {/* Flex container: tabs left, info right */}
      <div className="mt-4 flex w-full flex-col gap-4 lg:flex-row">
        {/* Left: Tabs + content */}
        <div className="flex-1">
          <div className="flex border-b border-gray-300">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 ${activeTab === "overview" ? "border-b-2 border-blue-500 text-blue-600" : ""}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("attendees")}
              className={`px-4 py-2 ${activeTab === "attendees" ? "border-b-2 border-blue-500 text-blue-600" : ""}`}
            >
              Attendees
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`px-4 py-2 ${activeTab === "schedule" ? "border-b-2 border-blue-500 text-blue-600" : ""}`}
            >
              Schedule
            </button>
          </div>

          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            {activeTab === "overview" && <p>{event.description}</p>}
            {activeTab === "attendees" && (
              <p>{event.registrations} people registered</p>
            )}
            {activeTab === "schedule" && (
              <p>
                Start: {event.startAt} End: {event.endAt}
              </p>
            )}
          </div>
        </div>

        {/* Right: Info block */}
        <div className="flex w-full flex-col gap-3 rounded-lg bg-gray-50 p-4 lg:w-64">
          <div className="flex items-center gap-2">
            <span className="material-icons text-gray-500">event</span>
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-icons text-gray-500">schedule</span>
            <span>
              {event.startAt} - {event.endAt}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-icons text-gray-500">place</span>
            <span>{event.location}</span>
          </div>

          <hr className="my-2 border-gray-300" />

          <div className="flex items-center gap-2">
            <span className="material-icons text-gray-500">people</span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span>
              {event.registrations}/{event.capacity}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            {spotsRemaining} spots remaining
          </p>

          <button className="mt-4 w-full cursor-pointer rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600">
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
}
