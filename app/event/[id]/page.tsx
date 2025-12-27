"use client";

import { useState } from "react";
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
  const [activeTab, setActiveTab] = useState<
    "overview" | "attendees" | "schedule"
  >("overview");
  const router = useRouter();

  const event: Event | undefined = events.find((e) => e.id === id);
  if (!event) return <p>Event not found</p>;

  const spotsRemaining = event.capacity - event.registrations;
  const progress = Math.min((event.registrations / event.capacity) * 100, 100);

  return (
    <div className="relative w-full p-4 text-stone-600">
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="h-[30vh] w-full rounded-lg object-cover"
        />
        <button
          onClick={() => router.back()}
          className="absolute top-5 left-5 cursor-pointer rounded-md border border-white/40 bg-white/60 p-2 backdrop-blur-sm hover:bg-white/70"
        >
          <ArrowLeftIcon className="h-4 w-4 text-white" strokeWidth={2.5} />
        </button>
        {/* <div className="absolute top-5 left-5 rounded-md border border-white/40 bg-white/60 p-2 backdrop-blur-sm">
          <ArrowLeftIcon className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div> */}
        <div className="absolute bottom-5 left-5">
          <span
            className={`mr-3 rounded-md bg-stone-100/20 px-3 py-1 text-sm font-medium ${
              STATUS_CONFIG[status(event)].className
            }`}
          >
            {STATUS_CONFIG[status(event)].label}
          </span>
          <span className="rounded-md bg-stone-200 px-3 py-1 text-sm font-medium">
            {formatCategory(event.category)}
          </span>
        </div>
      </div>

      {/* Flex container: tabs left, info right */}
      <div className="mt-4 flex w-full flex-col gap-4 lg:flex-row">
        {/* Left: Tabs + content */}
        <div className="flex-1">
          {/* <div className="flex border-b border-gray-300">
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
          </div> */}
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
              <div>
                <h4 className="mb-4 font-semibold">About this event</h4>
                <p className="text-sm leading-relaxed">{event.description}</p>
              </div>
            )}
            {activeTab === "attendees" && (
              <p>{event.registrations} People registered</p>
            )}
            {/* TODO this schedule will go away */}
            {activeTab === "schedule" && (
              <div className="space-y-6 text-sm">
                {mockSchedule.map((item, index) => (
                  <div key={index} className="flex gap-4">
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

        {/* Right: Info block */}
        <div className="flex w-full flex-col gap-3 rounded-lg bg-gray-50 p-4 text-sm lg:w-64">
          <div className="flex items-center gap-2">
            <CalendarIcon
              className="relative top-[px] h-4.5 w-4.5"
              strokeWidth={2}
            />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon
              className="relative top-[px] h-4.5 w-4.5"
              strokeWidth={2}
            />
            {formatTimeRange(event.startAt, event.endAt)}
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon
              className="relative top-[px] h-4.5 w-4.5"
              strokeWidth={2}
            />
            <span>{event.location}</span>
          </div>

          <hr className="my-2 border-gray-300" />

          <div className="flex items-center gap-2">
            <UsersIcon
              className="relative top-[px] h-4.5 w-4.5"
              strokeWidth={2}
            />
            <span>Capacity</span>
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
