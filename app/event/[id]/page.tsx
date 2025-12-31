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
import { supabase } from "@lib/supabase";

export default function EventPage() {
  const { events } = useEvents();
  const { id } = useParams();
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "attendees" | "schedule"
  >("overview");

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userRegistered, setUserRegistered] = useState<boolean | null>(null);
  const [registrations, setRegistrations] = useState(0);
  const [spotsRemaining, setSpotsRemaining] = useState(0);
  const [loading, setLoading] = useState(false);

  // find event
  useEffect(() => {
    const found = events.find((e) => e.id === id);
    setEvent(found ?? null);
  }, [events, id]);

  // get user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, []);

  // fetch registration status (ONLY source of truth)
  const fetchStatus = async () => {
    if (!event || !currentUserId) return;

    const res = await fetch("/api/registration-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: event.id,
        userId: currentUserId,
      }),
    });

    const data = await res.json();

    setUserRegistered(data.registered);
    setRegistrations(data.registrations);
    setSpotsRemaining(event.capacity - data.registrations);
  };

  // refetch on load / change
  useEffect(() => {
    fetchStatus();
  }, [event, currentUserId]);

  // register
  const handleRegister = async () => {
    if (!event || !currentUserId) return;
    setLoading(true);

    await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: event.id,
        userId: currentUserId,
      }),
    });

    await fetchStatus();
    setLoading(false);
  };

  // unregister
  const handleUnregister = async () => {
    if (!event || !currentUserId) return;
    setLoading(true);

    await fetch("/api/unregister", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: event.id,
        userId: currentUserId,
      }),
    });

    await fetchStatus();
    setLoading(false);
  };

  if (!event) return <p>Loading event...</p>;

  const progress = Math.min((registrations / (event.capacity || 1)) * 100, 100);

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
                className={`rounded px-4 py-1 font-medium transition-colors ${
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
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex w-full flex-col gap-3 rounded-lg bg-gray-50 p-4 text-sm lg:w-64">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5" />
            {formatTimeRange(event.startAt, event.endAt)}
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5" />
            <span>{event.location}</span>
          </div>

          <hr className="my-2" />

          <div className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            <span>Capacity</span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span>
              {registrations}/{event.capacity || "N/A"}
            </span>
          </div>

          <p className="text-xs text-gray-500">
            {spotsRemaining} spots remaining
          </p>

          {userRegistered !== null && (
            <button
              onClick={userRegistered ? handleUnregister : handleRegister}
              disabled={loading || spotsRemaining <= 0}
              className={`mt-4 w-full rounded-md py-2 text-white ${
                userRegistered
                  ? "bg-red-500 hover:bg-red-600"
                  : spotsRemaining > 0
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "cursor-not-allowed bg-gray-400"
              }`}
            >
              {loading
                ? userRegistered
                  ? "Unregistering..."
                  : "Registering..."
                : userRegistered
                  ? "Unregister"
                  : spotsRemaining > 0
                    ? "Register Now"
                    : "Full"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
