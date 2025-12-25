"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarIcon,
  PencilSquareIcon,
  ClockIcon,
  MapPinIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Event } from "@apptypes/event";
import ConfirmDialog from "@components/ConfirmDialog";
import { formatCategory } from "@utils/formatCategory";
import { formatTimeRange } from "@utils/formatTimeRange";

const status = (event: Event) => {
  if (!event) return "DRAFT";
  if (event.registrations >= event.capacity) return "FULL";
  if (event.published) return "PUBLISHED";
  return "DRAFT";
};

const STATUS_CONFIG = {
  FULL: {
    label: "Full",
    className: "text-red-600",
  },
  PUBLISHED: {
    label: "Published",
    className: "text-green-700",
  },
  DRAFT: {
    label: "Draft",
    className: "text-orange-300",
  },
} as const;

type EventCardProps = {
  event: Event;
  onDeleteAction?: (id: string) => void;
};

export default function EventCard({ event, onDeleteAction }: EventCardProps) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  // TODO what should happen upon error deleting?
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!deleteError) return;

    const timer = setTimeout(() => {
      setDeleteError("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [deleteError]);

  const handleDelete = async () => {
    setConfirmDeleteOpen(false);
    // TODO when loading, display loading... or loader on button
    setLoadingDelete(true);
    setDeleteError("");

    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json(); // Supabase zwraca JSON z { error: "..." }
        setDeleteError(data.error || "There was a problem deleting the event");
        return;
      }

      console.log("Removed event:", event.title);
      if (onDeleteAction) onDeleteAction(event.id);
    } catch (err: any) {
      setDeleteError(
        err.message || "There was a problem with removing this event",
      );
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div
      key={event.id}
      className="cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:bg-stone-50 hover:shadow-xl"
    >
      <div className="relative">
        <img
          src={event.image}
          alt="Product"
          className="h-52 w-full object-cover"
        />
        <div className="absolute top-3 left-3">
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
      {/* TODO block registrations when full */}
      <div className="flex min-h-82 w-76 flex-col p-5">
        <div className="flex flex-1 flex-col space-y-4">
          <div>
            <h3 className="font-sans text-xl font-bold text-stone-900">
              {event.title}
            </h3>
            <p className="mt-1 text-stone-500">{event.description}</p>
          </div>

          <p className="flex gap-2 text-sm text-stone-500">
            <CalendarIcon
              className="relative top-[px] h-4.5 w-4.5"
              strokeWidth={2}
            />
            <span>{event.date}</span>
          </p>

          <p className="flex gap-2 text-sm text-stone-500">
            <ClockIcon
              className="relative top-[px] h-4.5 w-4.5"
              strokeWidth={2}
            />
            <span>{formatTimeRange(event.startAt, event.endAt)}</span>
          </p>

          <p className="flex gap-2 text-sm text-stone-500">
            <MapPinIcon
              className="relative top-[px] h-4.5 w-4.5"
              strokeWidth={2}
            />
            <span>{event.location}</span>
          </p>

          <p className="flex gap-2 text-sm text-stone-500">
            <MapPinIcon
              className="relative top-[px] h-4.5 w-4.5"
              strokeWidth={2}
            />
            <span>
              {event.registrations} / {event.capacity} attendees
            </span>
          </p>
        </div>

        {deleteError && (
          <div
            onClick={() => setDeleteError("")}
            className="mb-2 flex cursor-pointer items-center justify-between gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100"
          >
            <span className="min-w-0 truncate">{deleteError}</span>

            <XCircleIcon className="h-5 w-5 shrink-0 text-red-400" />
          </div>
        )}

        <div className="mt-auto flex justify-between gap-4">
          <Link
            href={`/edit/${event.id}`}
            className="flex flex-1 cursor-pointer justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 focus:ring-2 focus:ring-stone-400 focus:outline-none"
          >
            <PencilSquareIcon className="relative top-[px] h-4 w-4" />
            <span>Edit</span>
          </Link>
          <button
            disabled={!!deleteError}
            className="cursor-pointer rounded-md p-2 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            onClick={() => setConfirmDeleteOpen(true)}
          >
            <TrashIcon className="h-4 w-4 text-red-700" />
          </button>
          <ConfirmDialog
            open={confirmDeleteOpen}
            title="Delete Event"
            message="Are you sure you want to delete this event? This action cannot be undone and all registration data will be lost."
            onCancelAction={() => setConfirmDeleteOpen(false)}
            onConfirmAction={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
